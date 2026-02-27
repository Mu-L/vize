import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveDynamicComponent as _resolveDynamicComponent, renderSlot as _renderSlot, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import type { IconClass } from '~/types'

export default /*@__PURE__*/_defineComponent({
  __name: 'Static',
  props: {
    as: { type: String as PropType<string | Component>, required: false, default: 'span' },
    variant: { type: String as PropType<'ghost' | 'default'>, required: false, default: 'default' },
    classicon: { type: null as unknown as PropType<IconClass>, required: false }
  },
  setup(__props) {

const props = __props

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_resolveDynamicComponent(__props.as), {
      class: _normalizeClass(["bg-bg-muted text-fg-muted inline-flex gap-x-1 items-center justify-center font-mono border border-gray-400 dark:border-gray-500 rounded-md text-xs px-2 py-0.5", { 'opacity-80 border-dashed': __props.variant === 'ghost' }])
    }, {
      default: _withCtx(() => [
        (__props.classicon)
          ? (_openBlock(), _createElementBlock("span", {
            key: 0,
            class: _normalizeClass(["size-[1em]", __props.classicon]),
            "aria-hidden": "true"
          }))
          : _createCommentVNode("v-if", true),
        _renderSlot(_ctx.$slots, "default")
      ]),
      _: 1 /* STABLE */
    }, 2 /* CLASS */))
}
}

})
