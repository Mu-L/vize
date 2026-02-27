import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, Transition as _Transition, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, resolveDirective as _resolveDirective, renderList as _renderList, mergeProps as _mergeProps, withCtx as _withCtx } from "vue"

import { ref } from 'vue'
import MenuItem, { type MenuItemProps } from './VFMenuItem.vue'
import SpMenuMobileButton from './VFSpMenuMobileButton.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFSpMenu',
  props: {
    items: { type: Array as PropType<MenuItemProps[]>, required: true }
  },
  setup(__props) {

const menuOpen = ref(false);
function toggleMenu(toggle = !menuOpen.value) {
  menuOpen.value = toggle;
}

return (_ctx: any,_cache: any) => {
  const _directive_click_outside = _resolveDirective("click-outside")

  return (_openBlock(), _createElementBlock("div", {
      class: "sp-navigation-wrapper",
      lang: "en",
      "data-v-3487cf0a": ""
    }, [ _createVNode(_Transition, {
        "enter-active-class": "zoom-blur-in",
        "leave-active-class": "zoom-blur-in-reverse"
      }, {
        default: _withCtx(() => [
          (menuOpen.value)
            ? (_openBlock(), _createElementBlock("ul", {
              key: 0,
              class: "sp-navigation-content",
              "data-v-3487cf0a": ""
            }, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.items, (item, idx) => {
                return (_openBlock(), _createElementBlock("li", { key: idx, "data-v-3487cf0a": "" }, [
                  _createVNode(MenuItem, _mergeProps(item, {
                    class: "sp-navigation-link"
                  }))
                ]))
              }), 128 /* KEYED_FRAGMENT */))
            ]))
            : _createCommentVNode("v-if", true)
        ]),
        _: 1 /* STABLE */
      }), _createVNode(SpMenuMobileButton, {
        class: "navigation-button-mobile",
        "is-opened": menuOpen.value,
        onClick: toggleMenu
      }) ]))
}
}

})
