import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, normalizeClass as _normalizeClass } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'MkEllipsis',
  props: {
    static: { type: Boolean as PropType<boolean>, required: false, default: false }
  },
  setup(__props) {

const props = __props

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("span", {
      class: _normalizeClass([_ctx.$style.root, { [_ctx.$style.static]: __props.static }])
    }, [ _createElementVNode("span", {
        class: _normalizeClass(_ctx.$style.dot)
      }, ".", 2 /* CLASS */), _createElementVNode("span", {
        class: _normalizeClass(_ctx.$style.dot)
      }, ".", 2 /* CLASS */), _createElementVNode("span", {
        class: _normalizeClass(_ctx.$style.dot)
      }, ".", 2 /* CLASS */) ], 2 /* CLASS */))
}
}

})
