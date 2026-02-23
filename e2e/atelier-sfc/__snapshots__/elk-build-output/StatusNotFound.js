import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:arrow-right-up-line": "true" })

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusNotFound',
  props: {
    account: { type: String as PropType<string>, required: true },
    status: { type: String as PropType<string>, required: true }
  },
  setup(__props) {

const originalUrl = computed(() => {
  const [handle, _server] = __props.account.split('@')
  const server = _server || currentUser.value?.server
  if (!server)
    return null

  return `https://${server}/@${handle}/${__props.status}`
})

return (_ctx: any,_cache: any) => {
  const _component_CommonNotFound = _resolveComponent("CommonNotFound")
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createBlock(_component_CommonNotFound, null, {
      default: _withCtx(() => [
        _createElementVNode("div", { flex: "~ col center gap2" }, [
          _createElementVNode("div", null, _toDisplayString(_ctx.$t('error.status_not_found')), 1 /* TEXT */),
          (originalUrl.value)
            ? (_openBlock(), _createBlock(_component_NuxtLink, {
              key: 0,
              to: originalUrl.value,
              external: "",
              target: "_blank"
            }, {
              default: _withCtx(() => [
                _createElementVNode("button", {
                  "btn-solid": "",
                  flex: "~ center gap-2",
                  "text-sm": "",
                  px2: "",
                  py1: ""
                }, [
                  _hoisted_1,
                  _createTextVNode("\n          "),
                  _createTextVNode(_toDisplayString(_ctx.$t('status.try_original_site')), 1 /* TEXT */),
                  _createTextVNode("\n        ")
                ])
              ]),
              _: 1 /* STABLE */
            }))
            : _createCommentVNode("v-if", true)
        ])
      ]),
      _: 1 /* STABLE */
    }))
}
}

})
