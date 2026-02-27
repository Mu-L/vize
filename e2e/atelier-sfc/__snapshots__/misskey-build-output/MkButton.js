import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import { nextTick, onMounted, useTemplateRef } from 'vue'
import type { MkABehavior } from '@/components/global/MkA.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkButton',
  props: {
    type: { type: String as PropType<'button' | 'submit' | 'reset'>, required: false },
    primary: { type: Boolean as PropType<boolean>, required: false },
    gradate: { type: Boolean as PropType<boolean>, required: false },
    rounded: { type: Boolean as PropType<boolean>, required: false },
    inline: { type: Boolean as PropType<boolean>, required: false },
    link: { type: Boolean as PropType<boolean>, required: false },
    to: { type: String as PropType<string>, required: false },
    linkBehavior: { type: null as unknown as PropType<MkABehavior>, required: false },
    autofocus: { type: Boolean as PropType<boolean>, required: false },
    wait: { type: Boolean as PropType<boolean>, required: false },
    danger: { type: Boolean as PropType<boolean>, required: false },
    full: { type: Boolean as PropType<boolean>, required: false },
    small: { type: Boolean as PropType<boolean>, required: false },
    large: { type: Boolean as PropType<boolean>, required: false },
    transparent: { type: Boolean as PropType<boolean>, required: false },
    asLike: { type: Boolean as PropType<boolean>, required: false },
    name: { type: String as PropType<string>, required: false },
    value: { type: String as PropType<string>, required: false },
    disabled: { type: Boolean as PropType<boolean>, required: false },
    iconOnly: { type: Boolean as PropType<boolean>, required: false },
    active: { type: Boolean as PropType<boolean>, required: false }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const el = useTemplateRef('el');
const ripples = useTemplateRef('ripples');
onMounted(() => {
	if (props.autofocus) {
		nextTick(() => {
			el.value!.focus();
		});
	}
});
function distance(p: { x: number; y: number }, q: { x: number; y: number }): number {
	return Math.hypot(p.x - q.x, p.y - q.y);
}
function calcCircleScale(boxW: number, boxH: number, circleCenterX: number, circleCenterY: number): number {
	const origin = { x: circleCenterX, y: circleCenterY };
	const dist1 = distance({ x: 0, y: 0 }, origin);
	const dist2 = distance({ x: boxW, y: 0 }, origin);
	const dist3 = distance({ x: 0, y: boxH }, origin);
	const dist4 = distance({ x: boxW, y: boxH }, origin);
	return Math.max(dist1, dist2, dist3, dist4) * 2;
}
function onMousedown(evt: MouseEvent): void {
	const target = evt.target! as HTMLElement;
	const rect = target.getBoundingClientRect();
	const ripple = window.document.createElement('div');
	ripple.classList.add(ripples.value!.dataset.childrenClass!);
	ripple.style.top = (evt.clientY - rect.top - 1).toString() + 'px';
	ripple.style.left = (evt.clientX - rect.left - 1).toString() + 'px';
	ripples.value!.appendChild(ripple);
	const circleCenterX = evt.clientX - rect.left;
	const circleCenterY = evt.clientY - rect.top;
	const scale = calcCircleScale(target.clientWidth, target.clientHeight, circleCenterX, circleCenterY);
	window.setTimeout(() => {
		ripple.style.transform = 'scale(' + (scale / 2) + ')';
	}, 1);
	window.setTimeout(() => {
		ripple.style.transition = 'all 1s ease';
		ripple.style.opacity = '0';
	}, 1000);
	window.setTimeout(() => {
		if (ripples.value) ripples.value.removeChild(ripple);
	}, 2000);
}

return (_ctx: any,_cache: any) => {
  const _component_MkA = _resolveComponent("MkA")

  return (!__props.link)
      ? (_openBlock(), _createElementBlock("button", {
        key: 0,
        ref: "el",
        class: _normalizeClass(["_button", [_ctx.$style.root, { [_ctx.$style.inline]: __props.inline, [_ctx.$style.primary]: __props.primary, [_ctx.$style.gradate]: __props.gradate, [_ctx.$style.danger]: __props.danger, [_ctx.$style.rounded]: __props.rounded, [_ctx.$style.full]: __props.full, [_ctx.$style.small]: __props.small, [_ctx.$style.large]: __props.large, [_ctx.$style.transparent]: __props.transparent, [_ctx.$style.asLike]: __props.asLike, [_ctx.$style.iconOnly]: __props.iconOnly, [_ctx.$style.wait]: __props.wait, [_ctx.$style.active]: __props.active }]]),
        type: __props.type,
        name: __props.name,
        value: __props.value,
        disabled: __props.disabled || __props.wait,
        onClick: _cache[0] || (_cache[0] = ($event: any) => (emit('click', $event))),
        onMousedown: onMousedown
      }, [ _createElementVNode("div", {
          ref: ripples,
          class: _normalizeClass(_ctx.$style.ripples),
          "data-children-class": _ctx.$style.ripple
        }, null, 10 /* CLASS, PROPS */, ["data-children-class"]), _createElementVNode("div", {
          class: _normalizeClass(_ctx.$style.content)
        }, [ _renderSlot(_ctx.$slots, "default") ], 2 /* CLASS */) ]))
      : (_openBlock(), _createBlock(_component_MkA, {
        key: 1,
        class: _normalizeClass(["_button", [_ctx.$style.root, { [_ctx.$style.inline]: __props.inline, [_ctx.$style.primary]: __props.primary, [_ctx.$style.gradate]: __props.gradate, [_ctx.$style.danger]: __props.danger, [_ctx.$style.rounded]: __props.rounded, [_ctx.$style.full]: __props.full, [_ctx.$style.small]: __props.small, [_ctx.$style.large]: __props.large, [_ctx.$style.transparent]: __props.transparent, [_ctx.$style.asLike]: __props.asLike, [_ctx.$style.iconOnly]: __props.iconOnly, [_ctx.$style.wait]: __props.wait, [_ctx.$style.active]: __props.active }]]),
        to: __props.to ?? '#',
        behavior: __props.linkBehavior,
        onMousedown: onMousedown
      }, {
        default: _withCtx(() => [
          _createElementVNode("div", {
            ref: ripples,
            class: _normalizeClass(_ctx.$style.ripples),
            "data-children-class": _ctx.$style.ripple
          }, null, 10 /* CLASS, PROPS */, ["data-children-class"]),
          _createElementVNode("div", {
            class: _normalizeClass(_ctx.$style.content)
          }, [
            _renderSlot(_ctx.$slots, "default")
          ], 2 /* CLASS */)
        ]),
        _: 1 /* STABLE */
      }))
}
}

})
