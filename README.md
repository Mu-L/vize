<p align="center">
  <img src="./playground/public/og-image.png" alt="Vize" width="600" />
</p>

<p align="center">
  <strong>Unofficial High-Performance Vue.js Toolchain in Rust</strong>
</p>

<p align="center">
  <em>/viːz/ — Named after Vizier + Visor + Advisor: a wise tool that sees through your code.</em>
</p>

<p align="center">
  <a href="https://vizejs.dev"><strong>Documentation</strong></a> ・
  <a href="https://vizejs.dev/play/"><strong>Playground</strong></a> ・
  <a href="https://github.com/sponsors/ubugeeei"><strong>Sponsor</strong></a>
</p>

<p align="center">
  <a href="https://crates.io/crates/vize"><img src="https://img.shields.io/crates/v/vize.svg" alt="crates.io" /></a>
  <a href="https://www.npmjs.com/package/vize"><img src="https://img.shields.io/npm/v/vize.svg?label=vize" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/@vizejs/vite-plugin"><img src="https://img.shields.io/npm/v/@vizejs/vite-plugin.svg?label=@vizejs/vite-plugin" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/@vizejs/wasm"><img src="https://img.shields.io/npm/v/@vizejs/wasm.svg?label=@vizejs/wasm" alt="npm" /></a>
  <a href="https://github.com/ubugeeei/vize/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
</p>

> [!WARNING]
> This project is under active development and is not yet ready for production use.
> APIs and features may change without notice.

---

## Features

- **Compile** — Vue SFC compiler (DOM / Vapor / SSR)
- **Lint** — Vue.js linter with i18n diagnostics
- **Format** — Vue.js formatter
- **Type Check** — TypeScript type checker for Vue
- **LSP** — Language Server Protocol for editor integration
- **Musea** — Component gallery (Storybook-like)
- **MCP** — AI integration via Model Context Protocol

## Quick Start

```bash
npm install -g vize
```

```bash
vize build src/**/*.vue    # Compile
vize fmt --check           # Format check
vize lint --fix            # Lint & auto-fix
vize check --strict        # Type check
```

See the [documentation](https://vizejs.dev) for detailed usage, Vite plugin setup, WASM bindings, and more.

## Performance

Compiling **15,000 SFC files** (36.9 MB):

|  | @vue/compiler-sfc | Vize | Speedup |
|--|-------------------|------|---------|
| **Single Thread** | 16.21s | 6.65s | **2.4x** |
| **Multi Thread** | 4.13s | 498ms | **8.3x** |

## Contributing

See the [documentation](https://vizejs.dev) for architecture overview and development setup.

## Credits

This project is inspired by and builds upon the work of these amazing projects:
[Volar.js](https://github.com/volarjs/volar.js) ・ [vuejs/language-tools](https://github.com/vuejs/language-tools) ・ [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) ・ [eslint-plugin-vuejs-accessibility](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility) ・ [Lightning CSS](https://github.com/parcel-bundler/lightningcss) ・ [Storybook](https://github.com/storybookjs/storybook) ・ [OXC](https://github.com/oxc-project/oxc)

## Sponsors

This project is maintained by [@ubugeeei](https://github.com/ubugeeei). If you find Vize useful, please consider [sponsoring](https://github.com/sponsors/ubugeeei).

## License

[MIT](./LICENSE)
