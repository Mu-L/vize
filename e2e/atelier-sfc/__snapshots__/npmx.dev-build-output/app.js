import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, withCtx as _withCtx, unref as _unref } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'App',
  props: {
    text: { type: String as PropType<string>, required: false },
    position: { type: String as PropType<'top' | 'bottom' | 'left' | 'right'>, required: false },
    interactive: { type: Boolean as PropType<boolean>, required: false },
    to: { type: String as PropType<string | HTMLElement>, required: false },
    defer: { type: Boolean as PropType<boolean>, required: false },
    offset: { type: Number as PropType<number>, required: false }
  },
  setup(__props) {

const props = __props
const isVisible = shallowRef(false)
const tooltipId = useId()
const hideTimeout = shallowRef<ReturnType<typeof setTimeout> | null>(null)
function show() {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value)
    hideTimeout.value = null
  }
  isVisible.value = true
}
function hide() {
  if (props.interactive) {
    // Delay hide so cursor can travel from trigger to tooltip
    hideTimeout.value = setTimeout(() => {
      isVisible.value = false
    }, 150)
  } else {
    isVisible.value = false
  }
}
const tooltipAttrs = computed(() => {
  const attrs: Record<string, unknown> = { role: 'tooltip', id: tooltipId }
  if (props.interactive) {
    attrs.onMouseenter = show
    attrs.onMouseleave = hide
  }
  return attrs
})

return (_ctx: any,_cache: any) => {
  const _component_TooltipBase = _resolveComponent("TooltipBase")

  return (_openBlock(), _createBlock(_component_TooltipBase, {
      text: undefined,
      isVisible: undefined,
      position: undefined,
      interactive: undefined,
      to: undefined,
      defer: undefined,
      offset: undefined,
      "tooltip-attr": tooltipAttrs.value,
      onMouseenter: show,
      onMouseleave: hide,
      onFocusin: show,
      onFocusout: hide,
      "aria-describedby": isVisible.value ? _unref(tooltipId) : undefined
    }, {
      default: _withCtx(() => [
        _renderSlot(_ctx.$slots, "default"),
        (_ctx.$slots.content)
          ? (_openBlock(), _createElementBlock("slot", {
            key: 0,
            name: "content"
          }))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["text", "isVisible", "position", "interactive", "to", "defer", "offset", "tooltip-attr", "aria-describedby"]))
}
}

})
