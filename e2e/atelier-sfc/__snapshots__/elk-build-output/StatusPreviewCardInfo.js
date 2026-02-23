import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue"


const _hoisted_1 = { "text-secondary": "true", "break-all": "true", "line-clamp-1": "true" }
import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusPreviewCardInfo',
  props: {
    card: { type: null as unknown as PropType<mastodon.v1.PreviewCard>, required: true },
    root: { type: Boolean as PropType<boolean>, required: false },
    provider: { type: String as PropType<string>, required: false }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      "max-h-2xl": "",
      flex: "",
      "flex-col": "",
      "my-auto": "",
      class: _normalizeClass([
        __props.root ? 'flex-gap-1' : 'justify-center sm:justify-start',
      ])
    }, [ _createElementVNode("p", _hoisted_1, "\n      " + _toDisplayString(__props.provider) + "\n    ", 1 /* TEXT */), (__props.card.title) ? (_openBlock(), _createElementBlock("strong", {
          key: 0,
          "font-normal": "",
          "sm:font-medium": "",
          "line-clamp-1": "",
          "break-all": ""
        }, _toDisplayString(__props.card.title), 1 /* TEXT */)) : _createCommentVNode("v-if", true), (__props.card.description) ? (_openBlock(), _createElementBlock("p", {
          key: 0,
          "line-clamp-1": "",
          "break-all": "",
          "sm:break-words": "",
          "text-secondary": "",
          class: _normalizeClass([__props.root ? 'sm:line-clamp-2' : ''])
        }, "\n      " + _toDisplayString(__props.card.description) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ], 2 /* CLASS */))
}
}

})
