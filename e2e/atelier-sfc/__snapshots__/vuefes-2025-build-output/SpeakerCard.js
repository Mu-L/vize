import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "speaker-name", "data-v-d9d88340": "" }
import type { NuxtRoute, RoutesNamesList } from '@typed-router'
import XIcon from '~icons/icons/ic_x'
import GithubIcon from '~icons/icons/ic_github'
import BlueskyIcon from '~icons/icons/ic_bluesky'
import { useI18n } from '#imports'
import { NuxtLink } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SpeakerCard',
  props: {
    speaker: { type: Object as PropType<{ name: string; avatarUrl: string; affiliation?: string; title?: string; socialUrls?: { github?: string; x?: string; bluesky?: string; }; }>, required: true },
    to: { type: null as unknown as PropType<NuxtRoute<T, P>>, required: false }
  },
  setup(__props) {

const { t } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("li", {
      class: "speaker",
      "data-v-d9d88340": ""
    }, [ _createVNode(_resolveDynamicComponent(__props.to ? _unref(NuxtLink) : 'div'), {
        to: __props.to,
        class: "speaker-card-link"
      }, {
        default: _withCtx(() => [
          _createElementVNode("img", {
            src: __props.speaker.avatarUrl,
            alt: '',
            class: "speaker-image",
            "data-v-d9d88340": ""
          }, null, 8 /* PROPS */, ["src", "alt"]),
          _createElementVNode("p", {
            class: "speaker-affiliation text-caption",
            "data-v-d9d88340": ""
          }, [
            _createTextVNode("\n        "),
            _createTextVNode(_toDisplayString(__props.speaker.affiliation), 1 /* TEXT */),
            (__props.speaker.affiliation && __props.speaker.title)
              ? (_openBlock(), _createElementBlock("br", {
                key: 0,
                "data-v-d9d88340": ""
              }))
              : _createCommentVNode("v-if", true),
            _createTextVNode("\n        "),
            _createTextVNode(_toDisplayString(__props.speaker.title), 1 /* TEXT */),
            _createTextVNode("\n      ")
          ]),
          _createElementVNode("h3", _hoisted_1, "\n        " + _toDisplayString(__props.speaker.name) + "\n      ", 1 /* TEXT */)
        ]),
        _: 1 /* STABLE */
      }), _createElementVNode("div", {
        class: "speaker-socials",
        "data-v-d9d88340": ""
      }, [ (__props.speaker.socialUrls?.github) ? (_openBlock(), _createBlock(NuxtLink, {
            key: 0,
            to: __props.speaker.socialUrls.github,
            target: "_blank"
          }, {
            default: _withCtx(() => [
              _createVNode(GithubIcon, {
                "aria-label": _unref(t)('snsIconImageAlt.github'),
                role: "img"
              })
            ]),
            _: 1 /* STABLE */
          })) : _createCommentVNode("v-if", true), (__props.speaker.socialUrls?.x) ? (_openBlock(), _createBlock(NuxtLink, {
            key: 0,
            to: __props.speaker.socialUrls.x,
            target: "_blank"
          }, {
            default: _withCtx(() => [
              _createVNode(XIcon, {
                "aria-label": _unref(t)('snsIconImageAlt.x'),
                role: "img"
              })
            ]),
            _: 1 /* STABLE */
          })) : _createCommentVNode("v-if", true), (__props.speaker.socialUrls?.bluesky) ? (_openBlock(), _createBlock(NuxtLink, {
            key: 0,
            to: __props.speaker.socialUrls.bluesky,
            target: "_blank"
          }, {
            default: _withCtx(() => [
              _createVNode(BlueskyIcon, {
                "aria-label": _unref(t)('snsIconImageAlt.bluesky'),
                role: "img"
              })
            ]),
            _: 1 /* STABLE */
          })) : _createCommentVNode("v-if", true) ]) ]))
}
}

})
