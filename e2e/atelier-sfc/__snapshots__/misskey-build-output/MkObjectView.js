import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode } from "vue"

import XValue from './MkObjectView.value.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkObjectView',
  props: {
    value: { type: null as unknown as PropType<Record<string, unknown>>, required: true }
  },
  setup(__props) {

const props = __props

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", null, [ _createVNode(XValue, {
        value: __props.value,
        collapsed: false
      }) ]))
}
}

})
