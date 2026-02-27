import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import MkTooltip from '@/components/MkTooltip.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkCellTooltip',
  props: {
    showing: { type: Boolean as PropType<boolean>, required: true },
    content: { type: String as PropType<string>, required: true },
    anchorElement: { type: null as unknown as PropType<HTMLElement>, required: true }
  },
  emits: ["closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkTooltip, {
      ref: "tooltip",
      showing: __props.showing,
      anchorElement: __props.anchorElement,
      maxWidth: 250,
      onClosed: _cache[0] || (_cache[0] = ($event: any) => (emit('closed')))
    }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: _normalizeClass(_ctx.$style.root)
        }, "\n\t\t" + _toDisplayString(__props.content) + "\n\t", 3 /* TEXT, CLASS */)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["showing", "anchorElement", "maxWidth"]))
}
}

})
