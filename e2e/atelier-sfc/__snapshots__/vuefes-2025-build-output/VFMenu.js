import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, renderList as _renderList, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps } from "vue"

import MenuItem, { type MenuItemProps } from './VFMenuItem.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFMenu',
  props: {
    items: { type: Array as PropType<MenuItemProps[]>, required: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("ul", {
      class: "navigation-content",
      lang: "en",
      "data-v-2c8e3193": ""
    }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.items, (item, idx) => {
        return (_openBlock(), _createElementBlock("li", { key: idx, "data-v-2c8e3193": "" }, [
          _createVNode(MenuItem, _normalizeProps(_guardReactiveProps(item)))
        ]))
      }), 128 /* KEYED_FRAGMENT */)) ]))
}
}

})
