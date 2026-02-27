import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, renderList as _renderList, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-rocket-off" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-device-tv" })
import { inject } from 'vue'
import * as Misskey from 'misskey-js'
import { i18n } from '@/i18n.js'
import { notePage } from '@/filters/note.js'
import { userPage } from '@/filters/user.js'
import { DI } from '@/di.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkNoteHeader',
  props: {
    note: { type: null as unknown as PropType<Misskey.entities.Note>, required: true }
  },
  setup(__props) {

const mock = inject(DI.mock, false);

return (_ctx: any,_cache: any) => {
  const _component_MkUserName = _resolveComponent("MkUserName")
  const _component_MkA = _resolveComponent("MkA")
  const _component_MkAcct = _resolveComponent("MkAcct")
  const _component_MkTime = _resolveComponent("MkTime")
  const _directive_user_preview = _resolveDirective("user-preview")
  const _directive_tooltip = _resolveDirective("tooltip")

  return (_openBlock(), _createElementBlock("header", {
      class: _normalizeClass(_ctx.$style.root)
    }, [ (_unref(mock)) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: _normalizeClass(_ctx.$style.name)
        }, [ _createVNode(_component_MkUserName, { user: __props.note.user }) ])) : (_openBlock(), _createBlock(_component_MkA, {
          key: 1,
          class: _normalizeClass(_ctx.$style.name),
          to: _unref(userPage)(__props.note.user)
        }, {
          default: _withCtx(() => [
            _createVNode(_component_MkUserName, { user: __props.note.user })
          ]),
          _: 1 /* STABLE */
        })), (__props.note.user.isBot) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: _normalizeClass(_ctx.$style.isBot)
        }, "bot")) : _createCommentVNode("v-if", true), _createElementVNode("div", {
        class: _normalizeClass(_ctx.$style.username)
      }, [ _createVNode(_component_MkAcct, { user: __props.note.user }) ], 2 /* CLASS */), (__props.note.user.badgeRoles) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: _normalizeClass(_ctx.$style.badgeRoles)
        }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.note.user.badgeRoles, (role, i) => {
            return (_openBlock(), _createElementBlock("img", {
              key: i,
              class: _normalizeClass(_ctx.$style.badgeRole),
              src: role.iconUrl
            }, 10 /* CLASS, PROPS */, ["src"]))
          }), 128 /* KEYED_FRAGMENT */)) ])) : _createCommentVNode("v-if", true), _createElementVNode("div", {
        class: _normalizeClass(_ctx.$style.info)
      }, [ (_unref(mock)) ? (_openBlock(), _createElementBlock("div", { key: 0 }, [ _createVNode(_component_MkTime, {
              time: __props.note.createdAt,
              colored: ""
            }) ])) : (_openBlock(), _createBlock(_component_MkA, {
            key: 1,
            to: _unref(notePage)(__props.note)
          }, {
            default: _withCtx(() => [
              _createVNode(_component_MkTime, {
                time: __props.note.createdAt,
                colored: ""
              })
            ]),
            _: 1 /* STABLE */
          })), (__props.note.visibility !== 'public') ? (_openBlock(), _createElementBlock("span", {
            key: 0,
            style: "margin-left: 0.5em;",
            title: _unref(i18n).ts._visibility[__props.note.visibility]
          }, [ (__props.note.visibility === 'home') ? (_openBlock(), _createElementBlock("i", {
                key: 0,
                class: "ti ti-home"
              })) : (__props.note.visibility === 'followers') ? (_openBlock(), _createElementBlock("i", {
                  key: 1,
                  class: "ti ti-lock"
                })) : (__props.note.visibility === 'specified') ? (_openBlock(), _createElementBlock("i", {
                  key: 2,
                  ref: "specified",
                  class: "ti ti-mail"
                })) : _createCommentVNode("v-if", true) ])) : _createCommentVNode("v-if", true), (__props.note.localOnly) ? (_openBlock(), _createElementBlock("span", {
            key: 0,
            style: "margin-left: 0.5em;",
            title: _unref(i18n).ts._visibility['disableFederation']
          }, [ _hoisted_1 ])) : _createCommentVNode("v-if", true), (__props.note.channel) ? (_openBlock(), _createElementBlock("span", {
            key: 0,
            style: "margin-left: 0.5em;",
            title: __props.note.channel.name
          }, [ _hoisted_2 ])) : _createCommentVNode("v-if", true) ], 2 /* CLASS */) ], 2 /* CLASS */))
}
}

})
