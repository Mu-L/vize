import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Teleport as _Teleport, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, renderSlot as _renderSlot, unref as _unref } from "vue"

import type { HTMLAttributes } from 'vue'
import type { Placement, Strategy } from '@floating-ui/vue'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'Base',
  props: {
    text: { type: String as PropType<string>, required: false },
    position: { type: String as PropType<'top' | 'bottom' | 'left' | 'right'>, required: false },
    isVisible: { type: Boolean as PropType<boolean>, required: true },
    interactive: { type: Boolean as PropType<boolean>, required: false },
    tooltipAttr: { type: null as unknown as PropType<HTMLAttributes>, required: false },
    to: { type: String as PropType<string | HTMLElement>, required: false, default: 'body' },
    defer: { type: Boolean as PropType<boolean>, required: false },
    offset: { type: Number as PropType<number>, required: false, default: 4 },
    strategy: { type: null as unknown as PropType<Strategy>, required: false, default: 'absolute' }
  },
  setup(__props) {

const props = __props
const triggerRef = useTemplateRef('triggerRef')
const tooltipRef = useTemplateRef('tooltipRef')
const placement = computed<Placement>(() => props.position || 'bottom')
const { floatingStyles } = useFloating(triggerRef, tooltipRef, {
  placement,
  whileElementsMounted: autoUpdate,
  strategy: props.strategy,
  middleware: [offset(props.offset), flip(), shift({ padding: 8 })],
})

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      ref: triggerRef,
      class: "inline-flex"
    }, [ _renderSlot(_ctx.$slots, "default"), _createVNode(_Teleport, {
        to: props.to,
        defer: undefined
      }) ], 512 /* NEED_PATCH */))
}
}

})
