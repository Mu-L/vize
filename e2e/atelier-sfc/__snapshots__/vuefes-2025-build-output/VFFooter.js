import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("br", { "data-v-32917c4d": "" })
import { useI18n, useLocalePath } from '#imports'
import { VFButton } from '#components'
import XIcon from '~icons/icons/ic_x'
import YoutubeIcon from '~icons/icons/ic_youtube'
import GithubIcon from '~icons/icons/ic_github'
import NoteIcon from '~icons/icons/ic_note'
import BlueskyIcon from '~icons/icons/ic_bluesky'
import Logo from '~icons/logo/logo'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFFooter',
  setup(__props) {

const localePath = useLocalePath();
const { t } = useI18n();

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createElementBlock("footer", null, [ _createElementVNode("div", {
        class: "sns-container",
        "data-v-32917c4d": ""
      }, [ _createVNode(VFButton, {
          icon: "",
          link: "https://x.com/vuefes",
          external: "",
          class: "sns-button"
        }, {
          default: _withCtx(() => [
            _createVNode(XIcon, {
              "aria-label": _unref(t)('snsIconImageAlt.x'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }), _createVNode(VFButton, {
          icon: "",
          link: "https://bsky.app/profile/vuefes.bsky.social",
          external: "",
          class: "sns-button"
        }, {
          default: _withCtx(() => [
            _createVNode(BlueskyIcon, {
              "aria-label": _unref(t)('snsIconImageAlt.bluesky'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }), _createVNode(VFButton, {
          icon: "",
          link: "https://www.youtube.com/channel/UC6KPwA1kZJtQYdlh8_2hxCA",
          external: "",
          class: "sns-button"
        }, {
          default: _withCtx(() => [
            _createVNode(YoutubeIcon, {
              "aria-label": _unref(t)('snsIconImageAlt.youtube'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }), _createVNode(VFButton, {
          icon: "",
          link: "https://github.com/vuejs-jp",
          external: "",
          class: "sns-button"
        }, {
          default: _withCtx(() => [
            _createVNode(GithubIcon, {
              "aria-label": _unref(t)('snsIconImageAlt.github'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }), _createVNode(VFButton, {
          icon: "",
          link: "https://note.com/vuejs_jp/m/mb35849fee631",
          external: "",
          class: "sns-button"
        }, {
          default: _withCtx(() => [
            _createVNode(NoteIcon, {
              "aria-label": _unref(t)('snsIconImageAlt.note'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }) ]), _createElementVNode("div", {
        class: "container",
        "data-v-32917c4d": ""
      }, [ _createVNode(_component_NuxtLink, {
          to: _unref(localePath)('/'),
          title: _unref(t)('backTop'),
          class: "logo"
        }, {
          default: _withCtx(() => [
            _createVNode(Logo, {
              class: "logo-image",
              "aria-label": _unref(t)('logo.shortAlt'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }), _createElementVNode("div", {
          class: "links",
          "data-v-32917c4d": ""
        }, [ _createElementVNode("ul", {
            class: "past-vuefes-links",
            "data-v-32917c4d": ""
          }, [ _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, {
                to: "https://vuefes.jp/2024",
                external: "",
                target: "_blank"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("Vue Fes Japan 2024")
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, {
                to: "https://vuefes.jp/2023",
                external: "",
                target: "_blank"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("Vue Fes Japan 2023")
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, {
                to: "https://vuefes.jp/2022",
                external: "",
                target: "_blank"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("Vue Fes Japan Online 2022")
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, {
                to: "https://vuefes.jp/2020",
                external: "",
                target: "_blank"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("Vue Fes Japan 2020")
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, {
                to: "https://vuefes.jp/2019",
                external: "",
                target: "_blank"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("Vue Fes Japan 2019")
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, {
                to: "https://vuefes.jp/2018",
                external: "",
                target: "_blank"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("Vue Fes Japan 2018")
                ]),
                _: 1 /* STABLE */
              }) ]) ]), _createElementVNode("ul", {
            class: "other-links",
            "data-v-32917c4d": ""
          }, [ _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, { to: _unref(localePath)('/related-events') }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(t)("relatedEvents.sectionTitle")), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, { to: _unref(localePath)('/privacy-policy') }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(t)("privacyPolicy")), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, { to: _unref(localePath)('/code-of-conduct') }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(t)("coc")), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("li", null, [ _createVNode(_component_NuxtLink, { to: _unref(localePath)('/tokusho') }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(t)("transactions")), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }) ]) ]) ]), _createElementVNode("p", {
          class: "text-caption",
          "data-v-32917c4d": ""
        }, [ _createTextVNode("\n        © 2018-2025 Vue.js Japan Users Group some rights reserved. "), _hoisted_1, _createTextVNode("\n        Vue.js artworks by Evan You is licensed under a Creative Commons\n        Attribution 4.0 International License.\n      ") ]) ]) ]))
}
}

})
