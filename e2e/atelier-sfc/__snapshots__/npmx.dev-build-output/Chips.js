import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, TransitionGroup as _TransitionGroup, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, withCtx as _withCtx } from "vue"


const _hoisted_1 = { class: "text-fg-subtle text-xs", "data-v-1523c9ae": "" }
const _hoisted_2 = { class: "max-w-32 truncate", "data-v-1523c9ae": "" }
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:x w-3 h-3", "aria-hidden": "true", "data-v-1523c9ae": "" })
import type { FilterChip } from '#shared/types/preferences'

export default /*@__PURE__*/_defineComponent({
  __name: 'Chips',
  props: {
    chips: { type: Array as PropType<FilterChip[]>, required: true }
  },
  setup(__props, { emit: __emit }) {

const emit = __emit

return (_ctx: any,_cache: any) => {
  const _component_TagStatic = _resolveComponent("TagStatic")

  return (__props.chips.length > 0)
      ? (_openBlock(), _createElementBlock("div", {
        key: 0,
        class: "flex flex-wrap items-center gap-2",
        "data-v-1523c9ae": ""
      }, [ _createVNode(_TransitionGroup, { name: "chip" }, {
          default: _withCtx(() => [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.chips, (chip) => {
              return (_openBlock(), _createBlock(_component_TagStatic, {
                key: chip.id,
                class: "gap-2 pe-1"
              }, [
                _createElementVNode("span", _hoisted_1, _toDisplayString(chip.label) + ":", 1 /* TEXT */),
                _createElementVNode("span", _hoisted_2, _toDisplayString(Array.isArray(chip.value) ? chip.value.join(', ') : chip.value), 1 /* TEXT */),
                _createElementVNode("button", {
                  type: "button",
                  class: "flex items-center p-1 -m-1 hover:text-fg rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-1",
                  "aria-label": _ctx.$t('filters.remove_filter', { label: chip.label }),
                  onClick: _cache[0] || (_cache[0] = ($event: any) => (emit('remove', chip)))
                }, [
                  _hoisted_3
                ], 8 /* PROPS */, ["aria-label"])
              ]))
            }), 128 /* KEYED_FRAGMENT */))
          ]),
          _: 1 /* STABLE */
        }), (__props.chips.length > 1) ? (_openBlock(), _createElementBlock("button", {
            key: 0,
            type: "button",
            class: "text-sm p-0.5 text-fg-muted hover:text-fg underline transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2",
            onClick: _cache[1] || (_cache[1] = ($event: any) => (emit('clearAll'))),
            "data-v-1523c9ae": ""
          }, "\n      " + _toDisplayString(_ctx.$t('filters.clear_all')) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ]))
      : _createCommentVNode("v-if", true)
}
}

})
