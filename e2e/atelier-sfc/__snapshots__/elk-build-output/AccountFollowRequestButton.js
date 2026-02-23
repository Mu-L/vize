import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("span", { block: "true", "text-current": "true", "i-ri:check-fill": "true" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { block: "true", "text-current": "true", "i-ri:close-fill": "true" })
const _hoisted_3 = { "text-secondary": "true" }
import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'AccountFollowRequestButton',
  props: {
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: true },
    relationship: { type: null as unknown as PropType<mastodon.v1.Relationship>, required: false }
  },
  setup(__props) {

const relationship = computed(() => props.relationship || useRelationship(__props.account).value)
const { client } = useMasto()
async function authorizeFollowRequest() {
  relationship.value!.requestedBy = false
  relationship.value!.followedBy = true
  try {
    const newRel = await client.value.v1.followRequests.$select(account.id).authorize()
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    relationship.value!.requestedBy = true
    relationship.value!.followedBy = false
  }
}
async function rejectFollowRequest() {
  relationship.value!.requestedBy = false
  try {
    const newRel = await client.value.v1.followRequests.$select(account.id).reject()
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    relationship.value!.requestedBy = true
  }
}

return (_ctx: any,_cache: any) => {
  const _component_CommonTooltip = _resolveComponent("CommonTooltip")

  return (_openBlock(), _createElementBlock("div", {
      flex: "",
      "gap-4": ""
    }, [ (relationship.value?.requestedBy) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ _createVNode(_component_CommonTooltip, { content: _ctx.$t('account.authorize') }, {
            default: _withCtx(() => [
              _createElementVNode("button", {
                type: "button",
                "rounded-full": "",
                "text-sm": "",
                p2: "",
                "border-1": "",
                "hover:text-green": "",
                "transition-colors": "",
                onClick: authorizeFollowRequest
              }, [
                _hoisted_1
              ])
            ]),
            _: 1 /* STABLE */
          }), _createVNode(_component_CommonTooltip, { content: _ctx.$t('account.reject') }, {
            default: _withCtx(() => [
              _createElementVNode("button", {
                type: "button",
                "rounded-full": "",
                "text-sm": "",
                p2: "",
                "border-1": "",
                "hover:text-red": "",
                "transition-colors": "",
                onClick: rejectFollowRequest
              }, [
                _hoisted_2
              ])
            ]),
            _: 1 /* STABLE */
          }) ], 64 /* STABLE_FRAGMENT */)) : (_openBlock(), _createElementBlock("span", {
          key: 1,
          "text-secondary": ""
        }, "\n        " + _toDisplayString(relationship.value?.followedBy ? _ctx.$t('account.authorized') : _ctx.$t('account.rejected')) + "\n      ", 1 /* TEXT */)) ]))
}
}

})
