//! Musea command - Component gallery server

use clap::Args;
use std::path::PathBuf;

#[derive(Args)]
pub struct MuseaArgs {
    /// Port to run the server on
    #[arg(short, long, default_value = "6006")]
    pub port: u16,

    /// Host to bind to
    #[arg(long, default_value = "localhost")]
    pub host: String,

    /// Stories directory
    #[arg(short, long)]
    pub stories: Option<PathBuf>,

    /// Open browser automatically
    #[arg(long)]
    pub open: bool,
}

pub fn run(args: MuseaArgs) {
    eprintln!("vize musea: Starting component gallery...");
    eprintln!("  host: {}", args.host);
    eprintln!("  port: {}", args.port);
    eprintln!("  open: {}", args.open);

    // Call vize_musea
    vize_musea::serve();
}
