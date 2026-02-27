import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, withCtx as _withCtx } from "vue"


const _hoisted_1 = { "me-1": "true" }
import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'ConversationCard',
  props: {
    conversation: { type: null as unknown as PropType<mastodon.v1.Conversation>, required: true }
  },
  setup(__props) {

const withAccounts = computed(() =>
  __props.conversation.accounts.filter(account => account.id !== conversation.lastStatus?.account.id),
)

return (_ctx: any,_cache: any) => {
  const _component_StatusCard = _resolveComponent("StatusCard")
  const _component_AccountAvatar = _resolveComponent("AccountAvatar")

  return (__props.conversation.lastStatus)
      ? (_openBlock(), _createElementBlock("article", {
        key: 0,
        flex: "",
        "flex-col": "",
        "gap-2": ""
      }, [ (__props.conversation.lastStatus) ? (_openBlock(), _createBlock(_component_StatusCard, {
            key: 0,
            status: __props.conversation.lastStatus,
            actions: false
          }, {
            meta: _withCtx(() => [
              _createElementVNode("div", {
                flex: "",
                "gap-2": "",
                "text-sm": "",
                "text-secondary": "",
                "font-bold": ""
              }, [
                _createElementVNode("p", _hoisted_1, "\n            " + _toDisplayString(_ctx.$t('conversation.with')) + "\n          ", 1 /* TEXT */),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(withAccounts.value, (account) => {
                  return (_openBlock(), _createBlock(_component_AccountAvatar, {
                    key: account.id,
                    "h-5": "",
                    "w-5": "",
                    account: account
                  }, null, 8 /* PROPS */, ["account"]))
                }), 128 /* KEYED_FRAGMENT */))
              ])
            ]),
            _: 1 /* STABLE */
          })) : _createCommentVNode("v-if", true) ]))
      : _createCommentVNode("v-if", true)
}
}

})
