import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, withCtx as _withCtx } from "vue"

import { computed } from 'vue'
import { VFButton } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFSpMenuMobileButton',
  props: {
    isOpened: { type: Boolean as PropType<boolean>, required: true }
  },
  setup(__props, { emit: __emit }) {

const emits = __emit
const label = computed(() => __props.isOpened ? "Close" : "Menu");

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(VFButton, {
      class: "toggle-button",
      onClick: _cache[0] || (_cache[0] = ($event: any) => (emits('click')))
    }, {
      default: _withCtx(() => [
        _createTextVNode("\n    "),
        _createTextVNode(_toDisplayString(label.value), 1 /* TEXT */),
        _createTextVNode("\n  ")
      ]),
      _: 1 /* STABLE */
    }))
}
}

})
