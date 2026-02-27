import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'MkCodeInline',
  props: {
    code: { type: String as PropType<string>, required: true }
  },
  setup(__props) {

const props = __props

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("code", {
      class: _normalizeClass(_ctx.$style.root)
    }, _toDisplayString(__props.code), 3 /* TEXT, CLASS */))
}
}

})
