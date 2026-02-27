import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode } from "vue"

import TrendsChart from '../Package/TrendsChart.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'LineChart',
  props: {
    packages: { type: Array as PropType<string[]>, required: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", { class: "font-mono" }, [ _createVNode(TrendsChart, {
        "package-names": __props.packages,
        "in-modal": false,
        "show-facet-selector": ""
      }) ]))
}
}

})
