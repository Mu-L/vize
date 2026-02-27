import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, renderSlot as _renderSlot, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import { VFButton } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFCta',
  props: {
    actionButton: { type: Object as PropType<{ label: string; link: string; external?: true; }>, required: false },
    isBg: { type: Boolean as PropType<boolean>, required: false, default: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(["cta-content", { 'cta-bg': __props.isBg }]),
      "data-v-e5aa6472": ""
    }, [ _renderSlot(_ctx.$slots, "default"), (__props.actionButton) ? (_openBlock(), _createBlock(VFButton, {
          key: 0,
          link: __props.actionButton.link,
          external: __props.actionButton.external,
          class: "action-button"
        }, {
          default: _withCtx(() => [
            _createTextVNode("\n      "),
            _createTextVNode(_toDisplayString(__props.actionButton.label), 1 /* TEXT */),
            _createTextVNode("\n    ")
          ]),
          _: 1 /* STABLE */
        })) : _createCommentVNode("v-if", true) ], 2 /* CLASS */))
}
}

})
