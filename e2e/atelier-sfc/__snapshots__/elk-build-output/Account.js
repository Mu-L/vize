import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'Account',
  props: {
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: true },
    hoverCard: { type: Boolean as PropType<boolean>, required: false },
    list: { type: String as PropType<string>, required: true }
  },
  setup(__props) {

cacheAccount(__props.account)
const client = useMastoClient()
const isRemoved = ref(false)
async function edit() {
  try {
    if (isRemoved.value)
      await client.v1.lists.$select(list).accounts.create({ accountIds: [account.id] })
    else
      await client.v1.lists.$select(list).accounts.remove({ accountIds: [account.id] })
    isRemoved.value = !isRemoved.value
  }
  catch (err) {
    console.error(err)
  }
}

return (_ctx: any,_cache: any) => {
  const _component_AccountInfo = _resolveComponent("AccountInfo")
  const _component_CommonTooltip = _resolveComponent("CommonTooltip")

  return (_openBlock(), _createElementBlock("div", {
      flex: "",
      "justify-between": "",
      "hover:bg-active": "",
      "transition-100": "",
      "items-center": ""
    }, [ _createVNode(_component_AccountInfo, {
        account: __props.account,
        hover: "",
        p1: "",
        as: "router-link",
        "hover-card": __props.hoverCard,
        shrink: "",
        "overflow-hidden": "",
        to: _ctx.getAccountRoute(__props.account)
      }), _createElementVNode("div", null, [ _createVNode(_component_CommonTooltip, {
          content: isRemoved.value ? _ctx.$t('list.add_account') : _ctx.$t('list.remove_account'),
          hover: isRemoved.value ? 'text-green' : 'text-red'
        }, {
          default: _withCtx(() => [
            _createElementVNode("button", {
              "text-sm": "",
              p2: "",
              "border-1": "",
              "transition-colors": "",
              "border-dark": "",
              "bg-base": "",
              "btn-action-icon": "",
              onClick: edit
            }, [
              _createElementVNode("span", {
                class: _normalizeClass(isRemoved.value ? 'i-ri:user-add-line' : 'i-ri:user-unfollow-line')
              }, null, 2 /* CLASS */)
            ])
          ]),
          _: 1 /* STABLE */
        }) ]) ]))
}
}

})
