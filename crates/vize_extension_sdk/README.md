# vize_extension_sdk

The SDK for Vize extension-contract guests: the canonical `vize:contracts`
WIT package (`wit/`) and its released surface history (`versions/`),
its bindings, the capability-handshake constants, writers for the S1 and S2
pages the host accepts, and the runtime an import-free `no_std`
`wasm32-wasip2` guest provides itself. It depends on no Vize implementation
crate.

Contract versioning follows
[the compatibility policy](https://github.com/ubugeeei-prod/vize/blob/main/docs/davinci/contracts-compat-policy.md).
Support and deprecation guarantees are defined in the
[Rust crate support tiers](https://github.com/ubugeeei-prod/vize/blob/main/docs/content/stability.md#rust-crate-support-tiers).

## Typed expression guests

Enable the `typed-expression` feature to select the
`typed-expression-dialect` export world and its
`export_typed_expression_dialect!` macro. Implement `typed_handshake::Guest`
and `typed_bindings::exports::vize::contracts::typed_expression_analysis::Guest`. The default selects the existing
input world. World selection avoids duplicate public handshake macros in
`wit-bindgen`; each component exports one selected world.

Typed bindings require a producer-supplied dialect signature. Local bindings
shadow the block environment only inside their own expression. A missing or
unknown type must be refused rather than guessed. The world carries the same
versioned facts and projection pages as the original expression world and
adds the `typed-environment@1` handshake requirement.

## License

MIT
