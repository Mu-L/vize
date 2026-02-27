import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import type { SearchResult } from '~/composables/masto/search'

export default /*@__PURE__*/_defineComponent({
  __name: 'SearchResult',
  props: {
    result: { type: null as unknown as PropType<SearchResult>, required: true },
    active: { type: Boolean as PropType<boolean>, required: true }
  },
  setup(__props) {

function onActivate() {
  (document.activeElement as HTMLElement).blur()
}

return (_ctx: any,_cache: any) => {
  const _component_CommonScrollIntoView = _resolveComponent("CommonScrollIntoView")
  const _component_SearchHashtagInfo = _resolveComponent("SearchHashtagInfo")
  const _component_SearchAccountInfo = _resolveComponent("SearchAccountInfo")
  const _component_StatusCard = _resolveComponent("StatusCard")

  return (_openBlock(), _createBlock(_component_CommonScrollIntoView, {
      as: "RouterLink",
      "hover:bg-active": "",
      active: __props.active,
      to: __props.result.to,
      py2: "",
      block: "",
      px2: "",
      "aria-selected": __props.active,
      class: _normalizeClass({ 'bg-active': __props.active }),
      onClick: _cache[0] || (_cache[0] = () => onActivate())
    }, {
      default: _withCtx(() => [
        (__props.result.type === 'hashtag')
          ? (_openBlock(), _createBlock(_component_SearchHashtagInfo, {
            key: 0,
            hashtag: __props.result.data
          }))
          : (__props.result.type === 'account')
            ? (_openBlock(), _createBlock(_component_SearchAccountInfo, {
              key: 1,
              account: __props.result.data
            }))
          : (__props.result.type === 'status')
            ? (_openBlock(), _createBlock(_component_StatusCard, {
              key: 2,
              status: __props.result.data,
              actions: false,
              "show-reply-to": false
            }))
          : _createCommentVNode("v-if", true),
        _createTextVNode("\n    "),
        _createTextVNode("\n  ")
      ]),
      _: 1 /* STABLE */
    }, 10 /* CLASS, PROPS */, ["active", "to", "aria-selected"]))
}
}

})
