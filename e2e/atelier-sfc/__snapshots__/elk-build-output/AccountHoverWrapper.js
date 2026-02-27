import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, mergeProps as _mergeProps, withCtx as _withCtx, unref as _unref } from "vue"

import type { mastodon } from 'masto'
import { fetchAccountByHandle } from '~/composables/cache'

type WatcherType = [acc?: mastodon.v1.Account | null, h?: string, v?: boolean]

export default /*@__PURE__*/Object.assign({
  inheritAttrs: false,
}, {
  __name: 'AccountHoverWrapper',
  props: {
    account: { type: null as unknown as PropType<mastodon.v1.Account | null>, required: false },
    handle: { type: String as PropType<string>, required: false },
    disabled: { type: Boolean as PropType<boolean>, required: false }
  },
  setup(__props) {

const props = __props
const accountHover = ref()
const hovered = useElementHover(accountHover)
const account = ref<mastodon.v1.Account | null | undefined>(props.account)
watch(
  () => [props.account, props.handle, hovered.value] satisfies WatcherType,
  ([newAccount, newHandle, newVisible], oldProps) => {
    if (!newVisible || process.test)
      return
    if (newAccount) {
      account.value = newAccount
      return
    }
    if (newHandle) {
      const [_oldAccount, oldHandle, _oldVisible] = oldProps ?? [undefined, undefined, false]
      if (!oldHandle || newHandle !== oldHandle || !account.value) {
        // new handle can be wrong: using server instead of webDomain
        fetchAccountByHandle(newHandle).then((acc) => {
          if (newHandle === props.handle)
            account.value = acc
        })
      }
      return
    }
    account.value = undefined
  },
  { immediate: true, flush: 'post' },
)
const userSettings = useUserSettings()

return (_ctx: any,_cache: any) => {
  const _component_VMenu = _resolveComponent("VMenu")
  const _component_AccountHoverCard = _resolveComponent("AccountHoverCard")

  return (_openBlock(), _createElementBlock("span", { ref: accountHover }, [ (!__props.disabled && account.value && !_ctx.getPreferences(_unref(userSettings), 'hideAccountHoverCard')) ? (_openBlock(), _createBlock(_component_VMenu, _mergeProps(_ctx.$attrs, {
          key: 0,
          placement: "bottom-start",
          delay: { show: 500, hide: 100 },
          "close-on-content-click": false,
          "no-auto-focus": ""
        }), {
          popper: _withCtx(() => [
            (account.value)
              ? (_openBlock(), _createBlock(_component_AccountHoverCard, {
                key: 0,
                account: account.value
              }))
              : _createCommentVNode("v-if", true)
          ]),
          default: _withCtx(() => [
            _renderSlot(_ctx.$slots, "default")
          ]),
          _: 1 /* STABLE */
        })) : (_openBlock(), _createElementBlock("slot", { key: 1 })) ], 512 /* NEED_PATCH */))
}
}

})
