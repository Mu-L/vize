import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, mergeProps as _mergeProps, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { italic: "true" }
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:external-link-fill": "true" })
import type { mastodon } from 'masto'
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default /*@__PURE__*/_defineComponent({
  __name: 'TimelineScheduledPostsPaginator',
  props: {
    paginator: { type: null as unknown as PropType<mastodon.Paginator<mastodon.v1.ScheduledStatus[], mastodon.DefaultPaginationParams>>, required: true },
    stream: { type: null as unknown as PropType<mastodon.streaming.Subscription>, required: false },
    context: { type: null as unknown as PropType<mastodon.v2.FilterContext>, required: false },
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: false },
    preprocess: { type: Object as PropType<(items: (mastodon.v1.ScheduledStatus | mastodon.v1.Status)[]) => mastodon.v1.Status[]>, required: false },
    buffer: { type: Number as PropType<number>, required: false, default: 10 },
    endMessage: { type: Boolean as PropType<boolean | string>, required: false, default: true }
  },
  setup(__props) {

// @ts-expect-error missing types
const { formatNumber } = useHumanReadableNumber()
const virtualScroller = usePreferences('experimentalVirtualScroller')
const showOriginSite = computed(() =>
  __props.account && __props.account.id !== currentUser.value?.account.id && getServerName(__props.account) !== currentServer.value,
)

return (_ctx: any,_cache: any) => {
  const _component_CommonPaginator = _resolveComponent("CommonPaginator")
  const _component_StatusCard = _resolveComponent("StatusCard")
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createBlock(_component_CommonPaginator, _mergeProps({ paginator: __props.paginator, stream: __props.stream, preprocess: __props.preprocess, buffer: __props.buffer, endMessage: __props.endMessage }, {
      "virtual-scroller": _unref(virtualScroller)
    }), {
      updater: _withCtx(({ number, update }) => [
        _createElementVNode("button", {
          id: "elk_show_new_items",
          "py-4": "",
          border: "b base",
          flex: "~ col",
          "p-3": "",
          "w-full": "",
          "text-primary": "",
          "font-bold": "",
          onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.update && _ctx.update(...args)))
        }, "\n        " + _toDisplayString(_ctx.$t('timeline.show_new_items', number, { named: { v: _unref(formatNumber)(number) } })) + "\n      ", 1 /* TEXT */)
      ]),
      default: _withCtx(({ item, older, newer, active }) => [
        _createVNode(_resolveDynamicComponent(_unref(virtualScroller) ? _unref(DynamicScrollerItem) : 'article'), {
          item: item,
          active: active
        }, {
          default: _withCtx(() => [
            _createVNode(_component_StatusCard, {
              status: item,
              context: __props.context,
              older: older,
              newer: newer,
              account: __props.account,
              actions: false,
              "disable-link": true
            })
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 16 /* FULL_PROPS */, ["virtual-scroller"]))
}
}

})
