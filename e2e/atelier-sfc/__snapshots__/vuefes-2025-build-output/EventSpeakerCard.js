import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString } from "vue"


const _hoisted_1 = { class: "speaker-name", "data-v-0dfff319": "" }

export default /*@__PURE__*/_defineComponent({
  __name: 'EventSpeakerCard',
  props: {
    speaker: { type: Object as PropType<{ name: string; avatarUrl: string; affiliation?: string; title?: string; }>, required: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("li", {
      class: "speaker",
      "data-v-0dfff319": ""
    }, [ _createElementVNode("img", {
        src: __props.speaker.avatarUrl,
        alt: "",
        class: "speaker-image",
        "data-v-0dfff319": ""
      }, null, 8 /* PROPS */, ["src"]), _createElementVNode("p", {
        class: "speaker-affiliation",
        "data-v-0dfff319": ""
      }, [ _createTextVNode("\n      "), _createTextVNode(_toDisplayString(__props.speaker.affiliation), 1 /* TEXT */), (__props.speaker.affiliation && __props.speaker.title) ? (_openBlock(), _createElementBlock("br", {
            key: 0,
            "data-v-0dfff319": ""
          })) : _createCommentVNode("v-if", true), _createTextVNode("\n      "), _createTextVNode(_toDisplayString(__props.speaker.title), 1 /* TEXT */), _createTextVNode("\n    ") ]), _createElementVNode("h3", _hoisted_1, "\n      " + _toDisplayString(__props.speaker.name) + "\n    ", 1 /* TEXT */) ]))
}
}

})
