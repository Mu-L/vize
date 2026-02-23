import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'AccountCard',
  props: {
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: true },
    hoverCard: { type: Boolean as PropType<boolean>, required: false },
    relationshipContext: { type: String as PropType<'followedBy' | 'following'>, required: false }
  },
  setup(__props) {

cacheAccount(__props.account)

return (_ctx: any,_cache: any) => {
  const _component_AccountInfo = _resolveComponent("AccountInfo")
  const _component_AccountFollowButton = _resolveComponent("AccountFollowButton")

  return (_openBlock(), _createElementBlock("div", {
      flex: "",
      "justify-between": "",
      "hover:bg-active": "",
      "transition-100": ""
    }, [ _createVNode(_component_AccountInfo, {
        account: __props.account,
        hover: "",
        p1: "",
        as: "router-link",
        "hover-card": __props.hoverCard,
        shrink: "",
        "overflow-hidden": "",
        to: _ctx.getAccountRoute(__props.account)
      }), _renderSlot(_ctx.$slots, "default", {}, () => [ _createElementVNode("div", {
          "h-full": "",
          p1: "",
          "shrink-0": ""
        }, [ _createVNode(_component_AccountFollowButton, {
            account: __props.account,
            context: __props.relationshipContext
          }) ]) ]) ]))
}
}

})
