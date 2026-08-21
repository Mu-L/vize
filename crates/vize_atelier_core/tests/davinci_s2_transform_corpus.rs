//! P2-9, the corpus-runnable differential entry — the
//! P1-6/P1-7 lane shape. Compiled only with the `davinci-differential`
//! feature (`[[test]] required-features`). Runs the committed battery
//! with the same exact-pinned counters as the plain witness, then, with
//! `VIZE_DAVINCI_DIFFERENTIAL_CORPUS=<dir>`, additionally dual-runs the
//! template block of every `.vue` file under `<dir>` through both
//! lanes. Divergence panics (TS-25); every skip is a counted class.
//!
//! Run:
//!
//! ```text
//! VIZE_DAVINCI_DIFFERENTIAL_CORPUS=tests/_fixtures/_git \
//!     cargo test -p vize_atelier_core --features davinci-differential \
//!     --test davinci_s2_transform_corpus -- --nocapture
//! ```

mod s2_support;

use std::fs;
use std::path::{Path, PathBuf};

use davinci_harness::fixtures::template_block;
use s2_support::{BATTERY, Counters, compare};

fn collect_vue_files(root: &Path, out: &mut Vec<PathBuf>) {
    let Ok(entries) = fs::read_dir(root) else {
        return;
    };
    let mut children: Vec<PathBuf> = entries
        .filter_map(|entry| entry.ok().map(|entry| entry.path()))
        .collect();
    children.sort();
    for child in children {
        if child.is_dir() {
            // node_modules trees repeat the same shipped sources; the
            // sweep targets project code.
            if child.file_name().is_some_and(|name| name == "node_modules") {
                continue;
            }
            collect_vue_files(&child, out);
        } else if child.extension().is_some_and(|ext| ext == "vue") {
            out.push(child);
        }
    }
}

#[test]
fn the_s2_transform_lane_holds_over_the_corpus() {
    // -- committed battery, the same exact pins as the plain witness --
    let mut counters = Counters::default();
    for (name, source) in BATTERY {
        compare(name, source, &mut counters);
    }
    assert_eq!(
        counters,
        Counters {
            templates_seen: 30,
            compared: 30,
            skipped_legacy_flag: 0,
            skipped_old_parse_errors: 0,
            skipped_s2_errors: 0,
            if_ops: 20,
            branches: 38,
            keys_static: 13,
            keys_dynamic: 2,
            keys_template_if: 1,
            keys_slot_root: 1,
            conditions_compound: 0,
            for_ops: 15,
            for_values: 14,
            for_keys: 4,
            for_indexes: 1,
            for_values_absent: 1,
            for_compound: 0,
        },
        "battery accounting moved: re-pin in BOTH lanes deliberately"
    );

    // -- optional corpus sweep --------------------------------------
    let Some(corpus_root) = std::env::var_os("VIZE_DAVINCI_DIFFERENTIAL_CORPUS") else {
        eprintln!("VIZE_DAVINCI_DIFFERENTIAL_CORPUS unset: committed battery only");
        return;
    };
    let corpus_root = PathBuf::from(corpus_root);
    // Cargo runs test binaries from the package directory; let
    // workspace-root-relative paths (`tests/_fixtures/_git`) work too.
    let corpus_root = if corpus_root.is_relative() && !corpus_root.is_dir() {
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../..")
            .join(&corpus_root)
    } else {
        corpus_root
    };
    assert!(
        corpus_root.is_dir(),
        "VIZE_DAVINCI_DIFFERENTIAL_CORPUS must name a directory: {}",
        corpus_root.display()
    );
    let mut files = Vec::new();
    collect_vue_files(&corpus_root, &mut files);
    assert!(
        !files.is_empty(),
        "corpus sweep found no .vue files under {}",
        corpus_root.display()
    );
    let mut corpus = Counters::default();
    let mut unreadable = 0u64;
    let mut without_template = 0u64;
    for file in &files {
        let Ok(source) = fs::read_to_string(file) else {
            unreadable += 1;
            continue;
        };
        let Some(template) = template_block(&source) else {
            without_template += 1;
            continue;
        };
        let context = file.to_string_lossy();
        compare(context.as_ref(), template, &mut corpus);
    }
    eprintln!(
        "davinci s2 transform corpus sweep: files={} unreadable={unreadable} \
         without_template={without_template} {corpus:?}",
        files.len(),
    );
}
