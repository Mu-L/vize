import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { useLocaleRoute } from '@typed-router'
import { HOME_HEADING_ID } from '~/constant'
import { useBreakpoint, useI18n, useWithBase } from '#imports'
import { VFSection, SponsorGrid } from '#components'
import { SPONSORS as JaSponsors } from '~~/i18n/ja/sponsors'
import { SPONSORS as EnSponsors } from '~~/i18n/en/sponsors'
import type { OptionSponsor } from '~~/i18n/sponsor'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionSponsors',
  setup(__props) {

const bp = useBreakpoint();
const withBase = useWithBase();
const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();

return (_ctx: any,_cache: any) => {
  const _component_VFHeading = _resolveComponent("VFHeading")
  const _component_VFButton = _resolveComponent("VFButton")

  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).sponsorWanted,
      "cover-image": {
        src: _unref(bp) === 'pc'
          ? _unref(withBase)('/images/top/cover/sponsors-pc.svg')
          : _unref(withBase)('/images/top/cover/sponsors-sp.svg'),
        alt: _unref(t)('sponsors.coverImageAlt'),
      }
    }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "platina-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.platinaSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          _createElementVNode("div", {
            class: "sponsor-grid-container",
            "data-v-bee358c2": ""
          }, [
            _createVNode(SponsorGrid, {
              sponsors: _unref(locale) === 'ja' ? _unref(JaSponsors).PLATINA : _unref(EnSponsors).PLATINA,
              columns: _unref(bp) === 'mobile' ? 1 : 2,
              gap: "24px",
              "image-only": ""
            })
          ])
        ]),
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "gold-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.goldSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          _createElementVNode("div", {
            class: "sponsor-grid-container",
            "data-v-bee358c2": ""
          }, [
            _createVNode(SponsorGrid, {
              sponsors: _unref(locale) === 'ja' ? _unref(JaSponsors).GOLD : _unref(EnSponsors).GOLD,
              columns: _unref(bp) === 'mobile' ? 2 : 3,
              gap: "24px",
              "image-only": ""
            })
          ])
        ]),
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "silver-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.silverSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          _createElementVNode("div", {
            class: "sponsor-grid-container",
            "data-v-bee358c2": ""
          }, [
            _createVNode(SponsorGrid, {
              sponsors: _unref(locale) === 'ja' ? _unref(JaSponsors).SILVER : _unref(EnSponsors).SILVER,
              columns: _unref(bp) === 'mobile' ? 2 : 4,
              gap: "24px",
              "image-only": ""
            })
          ])
        ]),
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "bronze-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.bronzeSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          _createElementVNode("div", {
            class: "sponsor-grid-container",
            "data-v-bee358c2": ""
          }, [
            _createVNode(SponsorGrid, {
              sponsors: _unref(locale) === 'ja' ? _unref(JaSponsors).BRONZE : _unref(EnSponsors).BRONZE,
              columns: _unref(bp) === 'mobile' ? 2 : 4,
              gap: "24px",
              "image-only": ""
            })
          ])
        ]),
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "option-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.optionSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_unref(locale) === "ja" ? _unref(JaSponsors).OPTION : _unref(EnSponsors).OPTION, (option) => {
            return (_openBlock(), _createElementBlock("div", { key: option.title, "data-v-bee358c2": "" }, [
              (option.data.length > 0)
                ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: "sponsor-option-container",
                  "data-v-bee358c2": ""
                }, [
                  _createElementVNode("h3", null, _toDisplayString(_unref(t)(`sponsors.${option.title}`)), 1 /* TEXT */),
                  _createVNode(SponsorGrid, {
                    sponsors: option.data,
                    columns: _unref(bp) === 'mobile' ? 2 : 4,
                    gap: "24px",
                    "image-only": ""
                  })
                ]))
                : _createCommentVNode("v-if", true)
            ]))
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "creative-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.creativeSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          _createElementVNode("div", {
            class: "sponsor-grid-container",
            "data-v-bee358c2": ""
          }, [
            _createVNode(SponsorGrid, {
              sponsors: _unref(locale) === 'ja' ? _unref(JaSponsors).CREATIVE : _unref(EnSponsors).CREATIVE,
              columns: _unref(bp) === 'mobile' ? 2 : 3,
              gap: "24px",
              "image-only": ""
            })
          ])
        ]),
        _createElementVNode("div", {
          class: "sponsor-list",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFHeading, { id: "individual-sponsors" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.individualSponsor')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          }),
          _createElementVNode("div", {
            class: "sponsor-individual-container",
            "data-v-bee358c2": ""
          }, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_unref(locale) === 'ja' ? _unref(JaSponsors).INDIVIDUAL : _unref(EnSponsors).INDIVIDUAL, (name, index) => {
              return (_openBlock(), _createElementBlock("span", { key: index, "data-v-bee358c2": "" }, _toDisplayString(name), 1 /* TEXT */))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]),
        _createElementVNode("div", {
          class: "view-all-sponsors",
          "data-v-bee358c2": ""
        }, [
          _createVNode(_component_VFButton, { link: _unref(localeRoute)({ name: 'sponsors' }) }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('sponsors.viewAll')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "cover-image"]))
}
}

})
