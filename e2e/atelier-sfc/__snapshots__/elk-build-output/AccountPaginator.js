import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, withCtx as _withCtx } from "vue"


const _hoisted_1 = { italic: "true" }
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:external-link-fill": "true" })
import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'AccountPaginator',
  props: {
    paginator: { type: null as unknown as PropType<mastodon.Paginator<mastodon.v1.Account[], mastodon.DefaultPaginationParams | undefined>>, required: true },
    context: { type: String as PropType<'following' | 'followers'>, required: false },
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: false },
    relationshipContext: { type: String as PropType<'followedBy' | 'following'>, required: false }
  },
  setup(__props) {

const fallbackContext = computed(() => {
  return ['following', 'followers'].includes(context!)
})
const showOriginSite = computed(() =>
  __props.account && __props.account.id !== currentUser.value?.account.id && getServerName(__props.account) !== currentServer.value,
)

return (_ctx: any,_cache: any) => {
  const _component_CommonPaginator = _resolveComponent("CommonPaginator")
  const _component_AccountCard = _resolveComponent("AccountCard")
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createBlock(_component_CommonPaginator, { paginator: __props.paginator }, {
      default: _withCtx(({ item }) => [
        _createVNode(_component_AccountCard, {
          account: item,
          "relationship-context": __props.relationshipContext,
          "hover-card": "",
          border: "b base",
          py2: "",
          px4: ""
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["paginator"]))
}
}

})
