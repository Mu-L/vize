import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderList as _renderList, renderSlot as _renderSlot, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"

import { useLocaleRoute } from '@typed-router'
import type { Sponsor } from '~~/i18n/sponsor'

export default /*@__PURE__*/_defineComponent({
  __name: 'SponsorGrid',
  props: {
    sponsors: { type: Array as PropType<Array<Sponsor>>, required: true },
    imageOnly: { type: Boolean as PropType<boolean>, required: false, default: false },
    columns: { type: Number as PropType<number>, required: false, default: 3 },
    gap: { type: String as PropType<string>, required: false, default: "1rem" },
    gapSp: { type: String as PropType<string>, required: false },
    linkPath: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const localeRoute = useLocaleRoute();

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createElementBlock("div", {
      class: "sponsor-grid",
      style: _normalizeStyle({
        gridTemplateColumns: `repeat(${__props.columns}, 1fr)`,
        gap: __props.gap,
      }),
      "data-v-291dd5ff": ""
    }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.sponsors, (sponsor) => {
        return (_openBlock(), _createElementBlock("div", {
          key: sponsor.id,
          class: "sponsor-grid-item",
          "data-v-291dd5ff": ""
        }, [
          _createVNode(_component_NuxtLink, {
            to: _unref(localeRoute)({
            name: 'sponsors-sponsorId',
            params: { sponsorId: sponsor.id },
          }),
            class: "to-sponsor"
          }, {
            default: _withCtx(() => [
              _renderSlot(_ctx.$slots, "default", { item: sponsor }, () => [
                _createElementVNode("img", {
                  src: sponsor.logoImageUrl,
                  alt: sponsor.logoImageAlt,
                  loading: "lazy",
                  "data-v-291dd5ff": ""
                }, null, 8 /* PROPS */, ["src", "alt"])
              ])
            ]),
            _: 1 /* STABLE */
          }),
          (sponsor.name && !__props.imageOnly)
            ? (_openBlock(), _createElementBlock("h3", {
              key: 0,
              class: "sponsor-name",
              "data-v-291dd5ff": ""
            }, "\n        " + _toDisplayString(sponsor.name) + "\n      ", 1 /* TEXT */))
            : _createCommentVNode("v-if", true)
        ]))
      }), 128 /* KEYED_FRAGMENT */)) ], 4 /* STYLE */))
}
}

})
