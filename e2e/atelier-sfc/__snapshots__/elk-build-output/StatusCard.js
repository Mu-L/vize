import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withDirectives as _withDirectives, renderSlot as _renderSlot, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref, vShow as _vShow, withModifiers as _withModifiers } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:hashtag": "true" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:pushpin-line": "true" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("div", { w: "1px", h: "0.5", border: "x base", "mt-3": "true" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("div", { w: "1px", h: "0.5", border: "x base" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("div", { w: "1px", h: "0.5", border: "x base" })
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("div", { w: "1px", "h-10": "true", border: "x base" })
const _hoisted_7 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:repeat-fill": "true", "me-46px": "true", "text-green": "true", "w-16px": "true", "h-16px": "true", class: "status-boosted" })
const _hoisted_8 = { italic: "true" }
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:eye-line": "true" })
const _hoisted_10 = /*#__PURE__*/ _createElementVNode("div", { "i-ri:repeat-fill": "true", "text-green": "true", "w-16px": "true", "h-16px": "true" })
const _hoisted_11 = /*#__PURE__*/ _createElementVNode("div", { "w-1px": "true", border: "x base", "mb-9": "true" })
const _hoisted_12 = /*#__PURE__*/ _createElementVNode("div", { "flex-auto": "true" })
import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusCard',
  props: {
    status: { type: null as unknown as PropType<mastodon.v1.Status>, required: true },
    followedTag: { type: String as PropType<string | null>, required: false },
    actions: { type: Boolean as PropType<boolean>, required: false, default: true },
    context: { type: null as unknown as PropType<mastodon.v2.FilterContext>, required: false },
    hover: { type: Boolean as PropType<boolean>, required: false },
    inNotification: { type: Boolean as PropType<boolean>, required: false },
    isPreview: { type: Boolean as PropType<boolean>, required: false },
    isNested: { type: Boolean as PropType<boolean>, required: false, default: false },
    disableLink: { type: Boolean as PropType<boolean>, required: false, default: false },
    older: { type: null as unknown as PropType<mastodon.v1.Status>, required: false },
    newer: { type: null as unknown as PropType<mastodon.v1.Status>, required: false },
    hasOlder: { type: Boolean as PropType<boolean>, required: false },
    hasNewer: { type: Boolean as PropType<boolean>, required: false },
    main: { type: null as unknown as PropType<mastodon.v1.Status>, required: false },
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: false }
  },
  setup(__props) {

const userSettings = useUserSettings()
const status = computed(() => {
  if (props.status.reblog && (!props.status.content || props.status.content === props.status.reblog.content))
    return props.status.reblog
  return props.status
})
// Use original status, avoid connecting a reblog
const directReply = computed(() => __props.hasNewer || (!!status.value.inReplyToId && (status.value.inReplyToId === newer?.id || status.value.inReplyToId === newer?.reblog?.id)))
// Use reblogged status, connect it to further replies
const connectReply = computed(() => __props.hasOlder || status.value.id === older?.inReplyToId || status.value.id === older?.reblog?.inReplyToId)
// Open a detailed status, the replies directly to it
const replyToMain = computed(() => __props.main && __props.main.id === status.value.inReplyToId)
const rebloggedBy = computed(() => props.status.reblog ? props.status.account : null)
const statusRoute = computed(() => getStatusRoute(status.value))
const router = useRouter()
function go(evt: MouseEvent | KeyboardEvent) {
  if (evt.metaKey || evt.ctrlKey) {
    window.open(statusRoute.value.href)
  }
  else {
    cacheStatus(status.value)
    router.push(statusRoute.value)
  }
}
const createdAt = useFormattedDateTime(status.value.createdAt)
const timeAgoOptions = useTimeAgoOptions(true)
const timeago = useTimeAgo(() => status.value.createdAt, timeAgoOptions)
const isSelfReply = computed(() => status.value.inReplyToAccountId === status.value.account.id)
const collapseRebloggedBy = computed(() => rebloggedBy.value?.id === status.value.account.id)
const isDM = computed(() => status.value.visibility === 'direct')
const isPinned = computed(
  () =>
    !!props.status.pinned && account?.id === status.value.account.id,
)
const showUpperBorder = computed(() => __props.newer && !directReply.value)
const showReplyTo = computed(() => !replyToMain.value && !directReply.value)
const forceShow = ref(false)

return (_ctx: any,_cache: any) => {
  const _component_StatusLink = _resolveComponent("StatusLink")
  const _component_StatusReplyingTo = _resolveComponent("StatusReplyingTo")
  const _component_AccountHoverWrapper = _resolveComponent("AccountHoverWrapper")
  const _component_NuxtLink = _resolveComponent("NuxtLink")
  const _component_AccountAvatar = _resolveComponent("AccountAvatar")
  const _component_AccountInlineInfo = _resolveComponent("AccountInlineInfo")
  const _component_AccountBigAvatar = _resolveComponent("AccountBigAvatar")
  const _component_StatusAccountDetails = _resolveComponent("StatusAccountDetails")
  const _component_StatusVisibilityIndicator = _resolveComponent("StatusVisibilityIndicator")
  const _component_CommonTooltip = _resolveComponent("CommonTooltip")
  const _component_StatusEditIndicator = _resolveComponent("StatusEditIndicator")
  const _component_StatusActionsMore = _resolveComponent("StatusActionsMore")
  const _component_StatusContent = _resolveComponent("StatusContent")
  const _component_StatusActions = _resolveComponent("StatusActions")

  return (_openBlock(), _createBlock(_component_StatusLink, {
      status: status.value,
      hover: __props.hover,
      "disable-link": __props.disableLink
    }, {
      default: _withCtx(() => [
        _createTextVNode("\n    "),
        _createTextVNode("\n    "),
        _createElementVNode("div", {
          h: showUpperBorder.value ? '1px' : '0',
          "w-auto": "",
          "bg-border": "",
          "mb-1": "",
          "z--1": ""
        }, null, 8 /* PROPS */, ["h"]),
        _renderSlot(_ctx.$slots, "meta", {}, () => [
          _createTextVNode("\n      "),
          _createTextVNode("\n      "),
          _createElementVNode("div", {
            flex: "~ col",
            "justify-between": ""
          }, [
            (!!__props.followedTag && __props.followedTag !== '')
              ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                flex: "~ gap2",
                "items-center": "",
                "h-auto": "",
                "text-sm": "",
                "text-orange": "",
                m: "is-5",
                p: "t-1 is-5",
                relative: "",
                "text-secondary": "",
                "ws-nowrap": ""
              }, [
                _hoisted_1,
                _createTextVNode("\n          "),
                _createTextVNode("\n          "),
                _createElementVNode("span", null, _toDisplayString(__props.followedTag), 1 /* TEXT */)
              ]))
              : _createCommentVNode("v-if", true)
          ]),
          _createTextVNode("\n\n      "),
          _createTextVNode("\n      "),
          _createElementVNode("div", {
            flex: "~ col",
            "justify-between": ""
          }, [
            (isPinned.value)
              ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                flex: "~ gap2",
                "items-center": "",
                "h-auto": "",
                "text-sm": "",
                "text-orange": "",
                m: "is-5",
                p: "t-1 is-5",
                relative: "",
                "text-secondary": "",
                "ws-nowrap": ""
              }, [
                _hoisted_2,
                _createElementVNode("span", null, _toDisplayString(_ctx.$t('status.pinned')), 1 /* TEXT */)
              ]))
              : _createCommentVNode("v-if", true)
          ]),
          _createTextVNode("\n\n      "),
          _createTextVNode("\n      "),
          (status.value.inReplyToAccountId)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              (showReplyTo.value)
                ? (_openBlock(), _createBlock(_component_StatusReplyingTo, {
                  key: 0,
                  m: "is-5",
                  p: "t-1 is-5",
                  status: status.value,
                  "is-self-reply": isSelfReply.value,
                  class: _normalizeClass(__props.inNotification ? 'text-secondary-light' : '')
                }))
                : _createCommentVNode("v-if", true),
              _createElementVNode("div", {
                flex: "~ col gap-1",
                "items-center": "",
                pos: "absolute top-0 inset-is-0",
                w: "77px",
                "z--1": ""
              }, [
                (showReplyTo.value)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                    _hoisted_3,
                    _hoisted_4,
                    _hoisted_5
                  ], 64 /* STABLE_FRAGMENT */))
                  : _createCommentVNode("v-if", true),
                _hoisted_6
              ])
            ], 64 /* STABLE_FRAGMENT */))
            : _createCommentVNode("v-if", true),
          _createTextVNode("\n\n      "),
          _createTextVNode("\n      "),
          _createElementVNode("div", {
            flex: "~ col",
            "justify-between": ""
          }, [
            (rebloggedBy.value && !collapseRebloggedBy.value)
              ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                flex: "~",
                "items-center": "",
                p: "t-1 b-0.5 x-1px",
                relative: "",
                "text-secondary": "",
                "ws-nowrap": ""
              }, [
                _hoisted_7,
                _createElementVNode("div", {
                  absolute: "",
                  "top-1": "",
                  "ms-24px": "",
                  "w-32px": "",
                  "h-32px": "",
                  "rounded-full": ""
                }, [
                  _createVNode(_component_AccountHoverWrapper, { account: rebloggedBy.value }, {
                    default: _withCtx(() => [
                      _createVNode(_component_NuxtLink, { to: _ctx.getAccountRoute(rebloggedBy.value) }, {
                        default: _withCtx(() => [
                          _createVNode(_component_AccountAvatar, { account: rebloggedBy.value })
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    _: 1 /* STABLE */
                  })
                ]),
                _createVNode(_component_AccountInlineInfo, {
                  "font-bold": "",
                  account: rebloggedBy.value,
                  avatar: false,
                  "text-sm": ""
                })
              ]))
              : _createCommentVNode("v-if", true)
          ])
        ]),
        _createElementVNode("div", {
          flex: "",
          "gap-3": "",
          class: _normalizeClass({ 'text-secondary': __props.inNotification })
        }, [
          (status.value.account.suspended && !forceShow.value)
            ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              flex: "~col 1",
              "min-w-0": ""
            }, [
              _createElementVNode("p", _hoisted_8, "\n            " + _toDisplayString(_ctx.$t('status.account.suspended_message')) + "\n          ", 1 /* TEXT */),
              _createElementVNode("div", null, [
                _createElementVNode("button", {
                  "p-0": "",
                  flex: "~ center",
                  "gap-2": "",
                  "text-sm": "",
                  "btn-text": "",
                  onClick: _cache[0] || (_cache[0] = ($event: any) => (forceShow.value = true))
                }, [
                  _hoisted_9,
                  _createElementVNode("span", null, _toDisplayString(_ctx.$t('status.account.suspended_show')), 1 /* TEXT */)
                ])
              ])
            ]))
            : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _createTextVNode("\n        "),
              _createTextVNode("\n        "),
              _createElementVNode("div", { relative: "" }, [
                (collapseRebloggedBy.value)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    absolute: "",
                    flex: "",
                    "items-center": "",
                    "justify-center": "",
                    "top--6px": "",
                    "px-2px": "",
                    "py-3px": "",
                    "rounded-full": "",
                    "bg-base": ""
                  }, [
                    _hoisted_10
                  ]))
                  : _createCommentVNode("v-if", true),
                _createVNode(_component_AccountHoverWrapper, { account: status.value.account }, {
                  default: _withCtx(() => [
                    _createVNode(_component_NuxtLink, {
                      to: _ctx.getAccountRoute(status.value.account),
                      "rounded-full": ""
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_AccountBigAvatar, { account: status.value.account })
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                (connectReply.value)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    "w-full": "",
                    "h-full": "",
                    flex: "",
                    "mt--3px": "",
                    "justify-center": ""
                  }, [
                    _hoisted_11
                  ]))
                  : _createCommentVNode("v-if", true)
              ]),
              _createTextVNode("\n\n        "),
              _createTextVNode("\n        "),
              _createElementVNode("div", {
                flex: "~ col 1",
                "min-w-0": ""
              }, [
                _createTextVNode("\n          "),
                _createTextVNode("\n          "),
                _createElementVNode("div", {
                  flex: "",
                  "items-center": "",
                  "space-x-1": ""
                }, [
                  _createVNode(_component_AccountHoverWrapper, { account: status.value.account }, {
                    default: _withCtx(() => [
                      _createVNode(_component_StatusAccountDetails, { account: status.value.account })
                    ]),
                    _: 1 /* STABLE */
                  }),
                  _hoisted_12,
                  _withDirectives(_createElementVNode("div", {
                    "text-sm": "",
                    "text-secondary": "",
                    flex: "~ row nowrap",
                    "hover:underline": "",
                    "whitespace-nowrap": ""
                  }, [
                    _createElementVNode("div", {
                      flex: "~ gap1",
                      "items-center": ""
                    }, [
                      (status.value.visibility !== 'public')
                        ? (_openBlock(), _createBlock(_component_StatusVisibilityIndicator, {
                          key: 0,
                          status: status.value
                        }))
                        : _createCommentVNode("v-if", true),
                      _createElementVNode("div", { flex: "" }, [
                        _createVNode(_component_CommonTooltip, { content: _unref(createdAt) }, {
                          default: _withCtx(() => [
                            _createVNode(_component_NuxtLink, {
                              title: status.value.createdAt,
                              href: statusRoute.value.href,
                              onClick: _cache[1] || (_cache[1] = _withModifiers(($event: any) => (go($event)), ["prevent"]))
                            }, {
                              default: _withCtx(() => [
                                _createElementVNode("time", {
                                  "text-sm": "",
                                  "ws-nowrap": "",
                                  "hover:underline": "",
                                  datetime: status.value.createdAt
                                }, "\n                        " + _toDisplayString(_unref(timeago)) + "\n                      ", 9 /* TEXT, PROPS */, ["datetime"])
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        }),
                        _createVNode(_component_StatusEditIndicator, {
                          status: status.value,
                          inline: ""
                        })
                      ])
                    ])
                  ], 512 /* NEED_PATCH */), [
                    [_vShow, !_ctx.getPreferences(_unref(userSettings), 'zenMode')]
                  ]),
                  (__props.actions !== false)
                    ? (_openBlock(), _createBlock(_component_StatusActionsMore, {
                      key: 0,
                      status: status.value,
                      "me--2": ""
                    }))
                    : _createCommentVNode("v-if", true)
                ]),
                _createTextVNode("\n\n          "),
                _createTextVNode("\n          "),
                _createVNode(_component_StatusContent, {
                  status: status.value,
                  newer: __props.newer,
                  context: __props.context,
                  "is-preview": __props.isPreview,
                  "in-notification": __props.inNotification,
                  "is-nested": __props.isNested,
                  mb2: "",
                  class: _normalizeClass({ 'mt-2 mb1': isDM.value })
                }),
                (__props.actions !== false)
                  ? (_openBlock(), _createBlock(_component_StatusActions, {
                    key: 0,
                    status: status.value
                  }))
                  : _createCommentVNode("v-if", true)
              ])
            ], 64 /* STABLE_FRAGMENT */))
        ], 2 /* CLASS */)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["status", "hover", "disable-link"]))
}
}

})
