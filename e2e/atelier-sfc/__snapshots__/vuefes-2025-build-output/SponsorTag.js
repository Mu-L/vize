import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'SponsorTag',
  props: {
  plan: {
    type: String,
    required: true,
  },
},
  setup(__props: any) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("span", {
      class: _normalizeClass(`sponsor-tag sponsor-tag--${__props.plan.toLowerCase()}`),
      "data-v-86c8a49e": ""
    }, "\n    " + _toDisplayString(_ctx.$t(`sponsors.${__props.plan.toLowerCase().replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())}Sponsor`)) + "\n  ", 3 /* TEXT, CLASS */))
}
}

})
