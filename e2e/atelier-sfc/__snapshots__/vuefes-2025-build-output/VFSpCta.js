import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, resolveDirective as _resolveDirective, renderSlot as _renderSlot, withCtx as _withCtx } from "vue"

import { ref } from 'vue'
import SpCtaMobileButton from './VFSpCtaMobileButton.vue'
import { VFCta } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFSpCta',
  props: {
    actionButton: { type: Object as PropType<{ label: string; link: string; external?: true; }>, required: false },
    openerText: { type: String as PropType<string>, required: true }
  },
  setup(__props) {

const isOpened = ref(false);
function toggleMenu(toggle = !isOpened.value) {
  isOpened.value = toggle;
}

return (_ctx: any,_cache: any) => {
  const _directive_click_outside = _resolveDirective("click-outside")

  return (_openBlock(), _createElementBlock("div", {
      class: "sp-cta-wrapper",
      lang: "en",
      "data-v-1c3f9163": ""
    }, [ _createVNode(_Transition, {
        "enter-active-class": "zoom-blur-in",
        "leave-active-class": "zoom-blur-in-reverse"
      }, {
        default: _withCtx(() => [
          (isOpened.value)
            ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              class: "sp-cta-content",
              "data-v-1c3f9163": ""
            }, [
              _createVNode(VFCta, {
                "is-bg": false,
                "action-button": undefined
              }, {
                default: _withCtx(() => [
                  _renderSlot(_ctx.$slots, "default")
                ]),
                _: 1 /* STABLE */
              })
            ]))
            : _createCommentVNode("v-if", true)
        ]),
        _: 1 /* STABLE */
      }), _createVNode(SpCtaMobileButton, {
        class: "cta-button-mobile",
        "is-opened": undefined,
        "opener-text": __props.openerText,
        onClick: toggleMenu
      }) ]))
}
}

})
