//! Failure after acceptance must terminate the production emission route.

use super::super::{VaporS3BridgeStatus, lower_source_for_vapor, tests::options};
use crate::compile::native::emit_accepted;
use vize_carton::Allocator;

#[test]
fn inconsistent_accepted_payload_returns_no_render_or_map() {
    for source_map in [false, true] {
        for damage in 0..2 {
            let allocator = Allocator::new();
            let source = "<main><button @click=\"save\">{{ label }}</button></main>";
            let VaporS3BridgeStatus::Accepted(mut artifact) =
                lower_source_for_vapor(&allocator, source, options())
            else {
                panic!("fixture must be accepted before damaging its private payload");
            };
            // Both the root list and descendant addresses are admission-checked.
            if damage == 0 {
                artifact.0.roots.push(usize::MAX);
            } else {
                artifact.0.nodes[0].children.push(usize::MAX);
            }
            let result = emit_accepted(
                &allocator,
                source,
                artifact,
                Some("data-v-test"),
                source_map,
                |_, _| panic!("shared generation must never receive a partial IR"),
            );
            assert_eq!(result.code.as_str(), "");
            assert_eq!(result.templates.len(), 0);
            assert!(result.map.is_none());
            assert_eq!(result.error_messages.len(), 1);
            assert_eq!(
                result.error_messages[0].as_str(),
                "Davinci S3 emission rejected Vapor artifact: inconsistent checked payload"
            );
        }
    }
}

#[test]
fn accepted_payload_reaches_shared_generation_with_authored_anchors() {
    let allocator = Allocator::new();
    let source = "<button @click=\"save\">{{ label }}</button>";
    let VaporS3BridgeStatus::Accepted(artifact) =
        lower_source_for_vapor(&allocator, source, options())
    else {
        panic!("fixture must be accepted");
    };
    let result = emit_accepted(&allocator, source, artifact, None, true, |ir, spans| {
        assert!(spans.is_some());
        let output = crate::generate::generate_vapor(ir, None);
        crate::compile::VaporCompileResult {
            code: output.code,
            templates: output.templates,
            map: output.map,
            error_messages: Vec::new(),
        }
    });
    assert_eq!(result.error_messages.len(), 0);
    assert_eq!(result.templates.as_slice(), &["<button> </button>"]);
    assert!(result.code.contains("_ctx.save(e)"));
    assert!(result.code.contains("_ctx.label"));
}
