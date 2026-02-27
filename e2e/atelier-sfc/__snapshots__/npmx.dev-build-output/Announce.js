import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, resolveComponent as _resolveComponent, renderSlot as _renderSlot, withCtx as _withCtx } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'Announce',
  props: {
    text: { type: String as PropType<string>, required: true },
    position: { type: String as PropType<'top' | 'bottom' | 'left' | 'right'>, required: false },
    isVisible: { type: Boolean as PropType<boolean>, required: true }
  },
  setup(__props) {

const props = __props

return (_ctx: any,_cache: any) => {
  const _component_TooltipBase = _resolveComponent("TooltipBase")

  return (_openBlock(), _createBlock(_component_TooltipBase, {
      text: undefined,
      isVisible: undefined,
      position: undefined,
      "tooltip-attr": { 'aria-live': 'polite' }
    }, {
      default: _withCtx(() => [
        _renderSlot(_ctx.$slots, "default")
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["text", "isVisible", "position", "tooltip-attr"]))
}
}

})
