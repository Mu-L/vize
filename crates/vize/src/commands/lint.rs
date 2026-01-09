//! Lint command - Lint Vue SFC files

use clap::Args;
use std::path::PathBuf;

#[derive(Args)]
pub struct LintArgs {
    /// Glob pattern(s) to match .vue files
    #[arg(default_value = "./**/*.vue")]
    pub patterns: Vec<String>,

    /// Automatically fix problems
    #[arg(long)]
    pub fix: bool,

    /// Config file path
    #[arg(short, long)]
    pub config: Option<PathBuf>,

    /// Output format (text, json, sarif)
    #[arg(short, long, default_value = "text")]
    pub format: String,
}

pub fn run(args: LintArgs) {
    eprintln!("vize lint: Linting Vue SFC files...");
    eprintln!("  patterns: {:?}", args.patterns);
    eprintln!("  fix: {}", args.fix);
    eprintln!("  format: {}", args.format);

    // Call vize_patina
    vize_patina::lint();
}
