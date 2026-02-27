import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDynamicComponent as _resolveDynamicComponent, mergeProps as _mergeProps, withCtx as _withCtx, withModifiers as _withModifiers } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/Object.assign({
  inheritAttrs: false,
}, {
  __name: 'AccountBigCard',
  props: {
    account: { type: null as unknown as PropType<mastodon.v1.Account>, required: true },
    as: { type: String as PropType<string>, required: false, default: 'div' }
  },
  setup(__props) {

cacheAccount(__props.account)

return (_ctx: any,_cache: any) => {
  const _component_AccountAvatar = _resolveComponent("AccountAvatar")
  const _component_NuxtLink = _resolveComponent("NuxtLink")
  const _component_AccountFollowButton = _resolveComponent("AccountFollowButton")
  const _component_AccountDisplayName = _resolveComponent("AccountDisplayName")
  const _component_AccountHandle = _resolveComponent("AccountHandle")
  const _component_ContentRich = _resolveComponent("ContentRich")
  const _component_AccountPostsFollowers = _resolveComponent("AccountPostsFollowers")

  return (_openBlock(), _createBlock(_resolveDynamicComponent(__props.as), _mergeProps(_ctx.$attrs, {
      block: "",
      "focus:outline-none": "",
      "focus-visible:ring": "2 primary"
    }), {
      default: _withCtx(() => [
        _createTextVNode("\n    "),
        _createTextVNode("\n    "),
        _createElementVNode("div", {
          px2: "",
          pt2: ""
        }, [
          _createElementVNode("div", {
            rounded: "",
            "of-hidden": "",
            bg: "gray-500/20",
            aspect: "3.19"
          }, [
            _createElementVNode("img", {
              "h-full": "",
              "w-full": "",
              "object-cover": "",
              src: __props.account.header,
              alt: _ctx.$t('account.profile_description', [__props.account.username])
            }, null, 8 /* PROPS */, ["src", "alt"])
          ])
        ]),
        _createElementVNode("div", {
          "px-4": "",
          "pb-4": "",
          "space-y-2": ""
        }, [
          _createTextVNode("\n      "),
          _createTextVNode("\n      "),
          _createElementVNode("div", {
            flex: "",
            "sm:flex-row": "",
            "flex-col": "",
            "flex-gap-2": ""
          }, [
            _createElementVNode("div", {
              flex: "",
              "items-center": "",
              "justify-between": ""
            }, [
              _createElementVNode("div", {
                "w-17": "",
                "h-17": "",
                "rounded-full": "",
                "border-4": "",
                "border-bg-base": "",
                "z-2": "",
                "mt--2": "",
                "ms--1": ""
              }, [
                _createVNode(_component_AccountAvatar, { account: __props.account })
              ]),
              _createVNode(_component_NuxtLink, {
                block: "",
                "sm:hidden": "",
                href: "javascript:;",
                onClick: _withModifiers(() => {}, ["stop"])
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_AccountFollowButton, { account: __props.account })
                ]),
                _: 1 /* STABLE */
              })
            ]),
            _createElementVNode("div", { "sm:mt-2": "" }, [
              _createVNode(_component_AccountDisplayName, {
                account: __props.account,
                "font-bold": "",
                "text-lg": "",
                "line-clamp-1": "",
                "ws-pre-wrap": "",
                "break-all": ""
              }),
              _createVNode(_component_AccountHandle, {
                "text-sm": "",
                account: __props.account
              })
            ])
          ]),
          _createTextVNode("\n      "),
          _createTextVNode("\n      "),
          (__props.account.note)
            ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              "max-h-100": "",
              "overflow-y-auto": ""
            }, [
              _createVNode(_component_ContentRich, {
                content: __props.account.note,
                emojis: __props.account.emojis
              })
            ]))
            : _createCommentVNode("v-if", true),
          _createTextVNode("\n      "),
          _createTextVNode("\n      "),
          _createElementVNode("div", {
            flex: "",
            "justify-between": "",
            "items-center": ""
          }, [
            _createVNode(_component_AccountPostsFollowers, {
              "text-sm": "",
              account: __props.account
            }),
            _createVNode(_component_NuxtLink, {
              "sm:block": "",
              hidden: "",
              href: "javascript:;",
              onClick: _withModifiers(() => {}, ["stop"])
            }, {
              default: _withCtx(() => [
                _createVNode(_component_AccountFollowButton, { account: __props.account })
              ]),
              _: 1 /* STABLE */
            })
          ])
        ])
      ]),
      _: 1 /* STABLE */
    }, 16 /* FULL_PROPS */))
}
}

})
