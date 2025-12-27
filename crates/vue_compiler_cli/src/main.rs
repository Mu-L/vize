//! Vue Compiler CLI
//!
//! A high-performance CLI for compiling Vue SFC files with native multithreading.

use clap::{Parser, ValueEnum};
use glob::glob;
use rayon::prelude::*;
use std::fs;
use std::io::{self, Write};
use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::Instant;
use vue_compiler_sfc::{
    compile_sfc, parse_sfc, ScriptCompileOptions, SfcCompileOptions, SfcParseOptions,
    StyleCompileOptions, TemplateCompileOptions,
};

#[derive(Debug, Clone, Copy, ValueEnum)]
enum OutputFormat {
    /// Output compiled JavaScript
    Js,
    /// Output JSON with code and metadata
    Json,
    /// Only show statistics (no output)
    Stats,
}

#[derive(Parser)]
#[command(name = "vue-compiler")]
#[command(about = "High-performance Vue SFC compiler", long_about = None)]
struct Cli {
    /// Glob pattern(s) to match .vue files
    #[arg(required = true)]
    patterns: Vec<String>,

    /// Output directory (if not specified, outputs to stdout)
    #[arg(short, long)]
    output: Option<PathBuf>,

    /// Output format
    #[arg(short, long, value_enum, default_value = "js")]
    format: OutputFormat,

    /// Enable SSR mode
    #[arg(long)]
    ssr: bool,

    /// Number of threads (default: number of CPUs)
    #[arg(short = 'j', long)]
    threads: Option<usize>,

    /// Show verbose output
    #[arg(short, long)]
    verbose: bool,

    /// Continue on errors
    #[arg(long)]
    continue_on_error: bool,
}

#[derive(Debug)]
struct CompileStats {
    total_files: usize,
    success: AtomicUsize,
    failed: AtomicUsize,
    total_bytes: AtomicUsize,
    output_bytes: AtomicUsize,
}

impl CompileStats {
    fn new(total_files: usize) -> Self {
        Self {
            total_files,
            success: AtomicUsize::new(0),
            failed: AtomicUsize::new(0),
            total_bytes: AtomicUsize::new(0),
            output_bytes: AtomicUsize::new(0),
        }
    }
}

#[derive(Debug, serde::Serialize)]
struct CompileOutput {
    filename: String,
    code: String,
    css: Option<String>,
    errors: Vec<String>,
    warnings: Vec<String>,
}

fn collect_files(patterns: &[String]) -> Vec<PathBuf> {
    let mut files = Vec::new();
    for pattern in patterns {
        match glob(pattern) {
            Ok(paths) => {
                for entry in paths.flatten() {
                    if entry.extension().is_some_and(|ext| ext == "vue") {
                        files.push(entry);
                    }
                }
            }
            Err(e) => {
                eprintln!("Invalid glob pattern '{}': {}", pattern, e);
            }
        }
    }
    files.sort();
    files.dedup();
    files
}

fn compile_file(path: &PathBuf, ssr: bool) -> Result<CompileOutput, String> {
    let source = fs::read_to_string(path).map_err(|e| format!("Failed to read file: {}", e))?;

    let filename = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("anonymous.vue")
        .to_string();

    // Parse
    let parse_opts = SfcParseOptions {
        filename: filename.clone(),
        ..Default::default()
    };

    let descriptor = parse_sfc(&source, parse_opts).map_err(|e| e.message)?;

    // Compile
    let has_scoped = descriptor.styles.iter().any(|s| s.scoped);
    let compile_opts = SfcCompileOptions {
        parse: SfcParseOptions {
            filename: filename.clone(),
            ..Default::default()
        },
        script: ScriptCompileOptions {
            id: Some(filename.clone()),
            ..Default::default()
        },
        template: TemplateCompileOptions {
            id: Some(filename.clone()),
            scoped: has_scoped,
            ssr,
            ..Default::default()
        },
        style: StyleCompileOptions {
            id: filename.clone(),
            scoped: has_scoped,
            ..Default::default()
        },
    };

    let result = compile_sfc(&descriptor, compile_opts).map_err(|e| e.message)?;

    Ok(CompileOutput {
        filename,
        code: result.code,
        css: result.css,
        errors: result.errors.into_iter().map(|e| e.message).collect(),
        warnings: result.warnings.into_iter().map(|e| e.message).collect(),
    })
}

fn main() {
    let cli = Cli::parse();

    // Configure thread pool
    if let Some(threads) = cli.threads {
        rayon::ThreadPoolBuilder::new()
            .num_threads(threads)
            .build_global()
            .expect("Failed to configure thread pool");
    }

    // Collect files
    let files = collect_files(&cli.patterns);

    if files.is_empty() {
        eprintln!("No .vue files found matching the patterns");
        std::process::exit(1);
    }

    let stats = CompileStats::new(files.len());
    let start = Instant::now();

    if cli.verbose {
        eprintln!(
            "Compiling {} files using {} threads...",
            files.len(),
            rayon::current_num_threads()
        );
    }

    // Parallel compilation
    let results: Vec<_> = files
        .par_iter()
        .map(|path| {
            let source_size = fs::metadata(path).map(|m| m.len() as usize).unwrap_or(0);
            stats.total_bytes.fetch_add(source_size, Ordering::Relaxed);

            match compile_file(path, cli.ssr) {
                Ok(output) => {
                    stats.success.fetch_add(1, Ordering::Relaxed);
                    stats
                        .output_bytes
                        .fetch_add(output.code.len(), Ordering::Relaxed);

                    if cli.verbose && !output.errors.is_empty() {
                        for err in &output.errors {
                            eprintln!("  {} warning: {}", path.display(), err);
                        }
                    }

                    Some((path.clone(), output))
                }
                Err(e) => {
                    stats.failed.fetch_add(1, Ordering::Relaxed);
                    eprintln!("Error compiling {}: {}", path.display(), e);

                    if !cli.continue_on_error {
                        std::process::exit(1);
                    }

                    None
                }
            }
        })
        .collect();

    let elapsed = start.elapsed();

    // Output results
    match cli.format {
        OutputFormat::Stats => {
            // Just show stats, handled below
        }
        OutputFormat::Js | OutputFormat::Json => {
            if let Some(ref output_dir) = cli.output {
                // Write to output directory
                fs::create_dir_all(output_dir).expect("Failed to create output directory");

                for (path, output) in results.into_iter().flatten() {
                    let stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("out");
                    let ext = match cli.format {
                        OutputFormat::Js => "js",
                        OutputFormat::Json => "json",
                        OutputFormat::Stats => unreachable!(),
                    };
                    let out_path = output_dir.join(format!("{}.{}", stem, ext));

                    let content = match cli.format {
                        OutputFormat::Js => output.code,
                        OutputFormat::Json => {
                            serde_json::to_string_pretty(&output).unwrap_or_default()
                        }
                        OutputFormat::Stats => unreachable!(),
                    };

                    fs::write(&out_path, content).unwrap_or_else(|e| {
                        eprintln!("Failed to write {}: {}", out_path.display(), e);
                    });
                }
            } else {
                // Write to stdout
                let stdout = io::stdout();
                let mut handle = stdout.lock();

                for (path, output) in results.into_iter().flatten() {
                    match cli.format {
                        OutputFormat::Js => {
                            writeln!(handle, "// {}", path.display()).ok();
                            writeln!(handle, "{}", output.code).ok();
                        }
                        OutputFormat::Json => {
                            serde_json::to_writer_pretty(&mut handle, &output).ok();
                            writeln!(handle).ok();
                        }
                        OutputFormat::Stats => unreachable!(),
                    }
                }
            }
        }
    }

    // Print stats
    let success = stats.success.load(Ordering::Relaxed);
    let failed = stats.failed.load(Ordering::Relaxed);
    let total_bytes = stats.total_bytes.load(Ordering::Relaxed);
    let output_bytes = stats.output_bytes.load(Ordering::Relaxed);

    eprintln!();
    eprintln!("{}", "=".repeat(50));
    eprintln!(" Compilation Complete");
    eprintln!("{}", "=".repeat(50));
    eprintln!();
    eprintln!("  Files     : {} / {}", success, stats.total_files);
    if failed > 0 {
        eprintln!("  Failed    : {}", failed);
    }
    eprintln!(
        "  Input     : {:.2} MB",
        total_bytes as f64 / 1024.0 / 1024.0
    );
    eprintln!(
        "  Output    : {:.2} MB",
        output_bytes as f64 / 1024.0 / 1024.0
    );
    eprintln!("  Time      : {:.2}s", elapsed.as_secs_f64());
    eprintln!(
        "  Throughput: {:.0} files/s",
        success as f64 / elapsed.as_secs_f64()
    );
    eprintln!(
        "            : {:.2} MB/s",
        total_bytes as f64 / 1024.0 / 1024.0 / elapsed.as_secs_f64()
    );
    eprintln!();

    if failed > 0 {
        std::process::exit(1);
    }
}
