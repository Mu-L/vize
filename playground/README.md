# Vue Compiler RS Playground

A modern WASM-powered playground for testing the Vue Compiler RS.

## Features

- Real-time compilation
- Monaco Editor with Vue syntax highlighting
- Split-pane view (Template / Output)
- Multiple output views (Code, AST, Helpers)
- Compiler options (Mode, Hoist Static, Cache Handlers)
- VDom / Vapor mode toggle
- Beautiful dark theme

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build WASM (from project root)
pnpm build:wasm

# Build for production
pnpm build
```

## Tech Stack

- React 18
- Vite
- Monaco Editor
- Prism for syntax highlighting
- WASM (vue-compiler-rs)
