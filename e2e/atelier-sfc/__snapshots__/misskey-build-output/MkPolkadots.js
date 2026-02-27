import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, normalizeClass as _normalizeClass } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'MkPolkadots',
  props: {
    accented: { type: Boolean as PropType<boolean>, required: false, default: false },
    revered: { type: Boolean as PropType<boolean>, required: false, default: false },
    height: { type: Number as PropType<number>, required: false, default: 200 }
  },
  setup(__props) {

const props = __props

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass([_ctx.$style.root, __props.accented ? _ctx.$style.accented : null, __props.revered ? _ctx.$style.revered : null])
    }, null, 2 /* CLASS */))
}
}

})
