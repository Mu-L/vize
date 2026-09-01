use alloc::vec::Vec as StdVec;

use vize_davinci::id::NodeId;
use vize_s0::String;
use vize_s2::op::{Attribute, BindingOp, ComponentOp, DynamicName, Op, Region};

use super::super::EmitCx;
use super::super::hoist::compact_props_object;
use super::super::props_static::ComponentHoistProps;
use super::super::{EmitError, builtin, directive, props_static, slots};

pub(super) fn has_rendered_binds(component: &ComponentOp<'_>, skip_is: bool) -> bool {
    component.bindings.iter().any(|binding| {
        !(matches!(binding, BindingOp::SlotContent(_))
            || slots::is_slots_spread(binding)
            || directive::is_runtime(binding)
            || super::super::memo::is_memo(binding)
            || super::super::once::is_once(binding)
            || matches!(binding, BindingOp::VueCloak(_))
            || (skip_is && builtin::is_is_bind(binding)))
    })
}

pub(super) fn has_rendered_attrs(component: &ComponentOp<'_>, skip_is: bool) -> bool {
    component
        .attributes
        .iter()
        .any(|attr| !skip_is || attr.name != "is")
}

pub(super) fn rendered_hoist_attrs<'a, 'b>(
    component: &'b ComponentOp<'a>,
    skip_is: bool,
) -> StdVec<&'b Attribute<'a>> {
    component
        .attributes
        .iter()
        .filter(|attr| !skip_is || attr.name != "is")
        .collect()
}

pub(super) fn hoistable_static_props(
    component: &ComponentOp<'_>,
    skip_is: bool,
    hoist_attrs: &[&Attribute<'_>],
) -> Result<Option<ComponentHoistProps>, EmitError> {
    if skip_is {
        return Ok((!hoist_attrs.is_empty()).then(|| ComponentHoistProps {
            source: compact_props_object(hoist_attrs.iter().copied()),
            dynamic_values: false,
            non_key: hoist_attrs.iter().any(|attr| attr.name != "key"),
            valued_prop: hoist_attrs.iter().any(|attr| attr.value.is_some()),
            all_static_binds: false,
        }));
    }
    props_static::component_hoist_props(&component.attributes, &component.bindings)
}

pub(super) fn can_hoist_static_props(
    cx: &EmitCx<'_>,
    component: &ComponentOp<'_>,
    id: Option<NodeId>,
    blocked_by_context: bool,
    has_slots: bool,
    creates_slots: bool,
    props: Option<&ComponentHoistProps>,
) -> bool {
    let Some(props) = props else {
        return false;
    };
    if blocked_by_context {
        return false;
    }
    let text_only_default = slots::has_text_only_implicit_default(&component.children);
    let has_runtime_directive = directive::has_runtime(&component.bindings);
    let nested_slot_key = cx.slot_param_depth > 0
        && (has_slots || creates_slots)
        && has_nested_component_key(&component.children);
    let loop_or_scoped_slot_hoist = (cx.in_v_for || cx.slot_param_depth > 0)
        && (text_only_default
            || (props.all_static_binds && !has_runtime_directive && !nested_slot_key));
    let hoist_context = (cx.hoist_static_vnodes && text_only_default) || loop_or_scoped_slot_hoist;
    let is_template_for_root = id.is_some_and(|id| cx.template_for_item_root_id == Some(id));
    let dynamic_props_hoistable = !props.dynamic_values || !has_slots || text_only_default;
    let transition_props_slot_hoist = transition_props_slot_hoist(component, has_slots);
    (!is_template_for_root
        && dynamic_props_hoistable
        && props_static::should_hoist(cx, id, props_static::PropHoistPosition::Nested))
        || (is_template_for_root
            && dynamic_props_hoistable
            && id.is_some_and(|id| {
                cx.template_for_item_root_id == Some(id)
                    && props_static::props_hoistable(cx, Some(id))
                    && !has_runtime_directive
            }))
        || (!props.dynamic_values
            && props.valued_prop
            && !has_runtime_directive
            && (hoist_context || transition_props_slot_hoist))
        || (props.dynamic_values
            && cx.slot_param_depth == 0
            && !cx.in_v_for
            && dynamic_props_hoistable)
}

fn has_nested_component_key(region: &Region<'_>) -> bool {
    region.ops.iter().any(|op| match op {
        Op::Element(element) => has_nested_component_key(&element.children),
        Op::Component(component) => {
            has_component_key(component) || has_nested_component_key(&component.children)
        }
        Op::If(if_op) => if_op
            .branches
            .iter()
            .any(|branch| has_nested_component_key(&branch.region)),
        Op::For(for_op) => has_nested_component_key(&for_op.region),
        Op::Slot(slot) => has_nested_component_key(&slot.fallback),
        Op::Text(_) | Op::Interpolation(_) => false,
    })
}

fn has_component_key(component: &ComponentOp<'_>) -> bool {
    component.attributes.iter().any(|attr| attr.name == "key")
        || component.bindings.iter().any(|binding| {
            matches!(
                binding,
                BindingOp::Bind(bind) if matches!(bind.name, Some(DynamicName::Static("key")))
            )
        })
}

pub(super) fn transition_props_slot_hoist(component: &ComponentOp<'_>, has_slots: bool) -> bool {
    matches!(component.name, "Transition" | "transition")
        && has_slots
        && has_direct_slot_outlet(&component.children)
}

fn has_direct_slot_outlet(region: &Region<'_>) -> bool {
    region.ops.iter().any(|op| matches!(op, Op::Slot(_)))
}

pub(super) fn emit_dynamic_props(cx: &mut EmitCx<'_>, names: &[String]) {
    if names.is_empty() {
        return;
    }
    cx.buf.push(", [");
    for (i, name) in names.iter().enumerate() {
        if i > 0 {
            cx.buf.push(", ");
        }
        cx.buf.push("\"");
        cx.buf.push(name.as_str());
        cx.buf.push("\"");
    }
    cx.buf.push("]");
}
