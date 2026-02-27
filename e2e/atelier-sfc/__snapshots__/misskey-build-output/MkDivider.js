import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, normalizeStyle as _normalizeStyle } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'MkDivider',
  props: {
    marginTopBottom: { type: String as PropType<string>, required: false },
    marginLeftRight: { type: String as PropType<string>, required: false },
    borderStyle: { type: String as PropType<string>, required: false },
    borderWidth: { type: String as PropType<string>, required: false },
    borderColor: { type: String as PropType<string>, required: false }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: "default",
      style: _normalizeStyle([
  		__props.marginTopBottom ? { marginTop: __props.marginTopBottom, marginBottom: __props.marginTopBottom } : {},
  		__props.marginLeftRight ? { marginLeft: __props.marginLeftRight, marginRight: __props.marginLeftRight } : {},
  		__props.borderStyle ? { borderStyle: __props.borderStyle } : {},
  		__props.borderWidth ? { borderWidth: __props.borderWidth } : {},
  		__props.borderColor ? { borderColor: __props.borderColor } : {},
  	]),
      "data-v-35ac9890": ""
    }, null, 4 /* STYLE */))
}
}

})
