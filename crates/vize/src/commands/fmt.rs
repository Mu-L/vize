//! Format command - Format Vue SFC files

use clap::Args;
use std::path::PathBuf;

#[derive(Args)]
pub struct FmtArgs {
    /// Glob pattern(s) to match .vue files
    #[arg(default_value = "./**/*.vue")]
    pub patterns: Vec<String>,

    /// Check formatting without writing (exit with error if files need formatting)
    #[arg(long)]
    pub check: bool,

    /// Write formatted output to files
    #[arg(short, long)]
    pub write: bool,

    /// Config file path
    #[arg(short, long)]
    pub config: Option<PathBuf>,
}

pub fn run(args: FmtArgs) {
    eprintln!("vize fmt: Formatting Vue SFC files...");
    eprintln!("  patterns: {:?}", args.patterns);
    eprintln!("  check: {}", args.check);
    eprintln!("  write: {}", args.write);

    // Call vize_glyph
    vize_glyph::format();
}
