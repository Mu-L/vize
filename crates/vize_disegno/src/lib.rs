//! Disegno - the Davinci S2 semantic IR: the pivot stage and the primary
//! consumer surface.
//!
//! Named after Leonardo's *disegno*: the drawing that carries the idea,
//! independent of the material it is later executed in.
//!
//! S2 is the normalized, input-neutral representation of UI semantics
//! (`davinci-road/architecture.md`, "S2 — Disegno"). Vue templates, JSX and
//! pug all lower into the same [`op`] family; whatever is genuinely
//! Vue-specific stays a `vue.*` dialect op instead of shaping the core.
//! Nothing lowers into this crate yet - the DOM-backend lowering is P2-8 -
//! so the crate holds the type family, its folio page, the invariants that
//! are enforceable by construction, and the verifier for the ones that are
//! not:
//!
//! - [`op`] — the op enums ([`op::Op`], [`op::BindingOp`]) and their payload
//!   types, arena-resident and **`Drop`-free by construction** through
//!   `vize_carton::{Box, Vec}` (whose const assertion rejects `Drop`
//!   payloads; P1-10 measured it catching two real violations).
//! - [`expr`] — [`expr::ExprSlot`], the reserved expression position.
//!   The real reference (`ExprRef`) is P2-5b's deliverable.
//! - [`folio`] — [`folio::DisegnoFolio`], the S2 stage dump
//!   (`davinci-road/plan/folio-format.md`, "Disegno page").
//! - [`verify`] — the between-pass invariant checks (P2-6), debug/CI only:
//!   local in the GHC `-dcore-lint` sense, and never in a release build.
//!
//! The crate is `no_std + alloc` from birth so S2 artifacts print and parse
//! on any target (wasm32-wasip2 included; P2-14 makes that lane required).

#![no_std]

extern crate alloc;

pub mod expr;
pub mod folio;
pub mod op;
pub mod verify;
