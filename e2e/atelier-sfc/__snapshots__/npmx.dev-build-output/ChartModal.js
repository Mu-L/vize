import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, withCtx as _withCtx } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'ChartModal',
  props: {
    modalTitle: { type: String as PropType<string>, required: false }
  },
  emits: ["transitioned"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props

return (_ctx: any,_cache: any) => {
  const _component_Modal = _resolveComponent("Modal")

  return (_openBlock(), _createBlock(_component_Modal, {
      modalTitle: __props.modalTitle ?? _ctx.$t('package.trends.title'),
      id: "chart-modal",
      class: "h-full sm:h-min sm:border sm:border-border sm:rounded-lg shadow-xl sm:max-h-[90vh] sm:max-w-3xl",
      onTransitioned: _cache[0] || (_cache[0] = ($event: any) => (emit('transitioned')))
    }, {
      default: _withCtx(() => [
        _createElementVNode("div", { class: "font-mono text-sm" }, [
          _renderSlot(_ctx.$slots, "default")
        ]),
        _renderSlot(_ctx.$slots, "after")
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modalTitle"]))
}
}

})
