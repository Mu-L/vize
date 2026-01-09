//! LSP command - Language Server Protocol server

use clap::Args;

#[derive(Args)]
pub struct LspArgs {
    /// Use stdio for communication (default)
    #[arg(long)]
    pub stdio: bool,

    /// TCP port for socket communication
    #[arg(long)]
    pub port: Option<u16>,

    /// Enable debug logging
    #[arg(long)]
    pub debug: bool,
}

pub fn run(args: LspArgs) {
    eprintln!("vize lsp: Starting Language Server...");
    eprintln!("  stdio: {}", args.stdio);
    eprintln!("  port: {:?}", args.port);
    eprintln!("  debug: {}", args.debug);

    // Call vize_maestro
    vize_maestro::serve();
}
