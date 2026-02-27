import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "featured-speaker-heading", "data-v-dc90cbe3": "" }
import Carousel from 'primevue/carousel'
import { useLocaleRoute } from '@typed-router'
import { SESSION_SPEAKERS as enSessionSpeakers, PANEL_DISCUSSION_SPEAKERS as enPanelDiscussionSpeakers } from '../../../i18n/en/speakers'
import { SESSION_SPEAKERS as jaSessionSpeakers, PANEL_DISCUSSION_SPEAKERS as jaPanelDiscussionSpeakers } from '../../../i18n/ja/speakers'
import { computed, useI18n } from '#imports'
import { EnSpeaker, JaSpeaker, VFButton } from '#components'
import type { Speaker } from '~~/i18n/speaker'
import { HOME_HEADING_ID } from '~/constant'

interface ColorSet {
  base: string;
  sub: string;
}
type CarouselSpeaker = Omit<Speaker, "id" | "color"> & {
  id: string;
  color: ColorSet;
};

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionSpeaker',
  setup(__props) {

const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();
class ColorSetIter {
  static THEMES = ["primary", "orange", "navy", "purple"];
  private index = -1;
  public next(): ColorSet {
    this.index = (this.index + 1) % ColorSetIter.THEMES.length;
    const theme = ColorSetIter.THEMES[this.index];
    return {
      base: `var(--color-${theme}-base)`,
      sub: `var(--color-${theme}-sub)`,
    };
  }
}
const speakers = computed<CarouselSpeaker[]>(() => {
  const colorSetIter = new ColorSetIter();

  const _speakers
    = (locale.value === "en" ? [...enSessionSpeakers, ...enPanelDiscussionSpeakers] : [...jaSessionSpeakers, ...jaPanelDiscussionSpeakers])

      .filter((it, index, speakers) => index === speakers.findIndex(s => s.name === it.name))
      .filter(it => it.attendedIndex !== undefined)
      .sort((a, b) => a.attendedIndex! - b.attendedIndex!)
      .map(it => ({
        ...it,
        id: it.name,
        color: colorSetIter.next(),
      }));

  return [
    { ..._speakers[_speakers.length - 1]! },
    ..._speakers,
    { ..._speakers[0]! },
  ];
});

return (_ctx: any,_cache: any) => {
  const _component_VFSection = _resolveComponent("VFSection")

  return (_openBlock(), _createBlock(_component_VFSection, {
      id: _unref(HOME_HEADING_ID).speaker,
      title: _unref(t)('speakers.title'),
      class: "section-speakers"
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaSpeaker) : _unref(EnSpeaker))),
        _createElementVNode("h3", _hoisted_1, "\n      " + _toDisplayString(_unref(t)('speakers.featured')) + "\n    ", 1 /* TEXT */),
        _createElementVNode("div", {
          class: "carousel",
          "data-v-dc90cbe3": ""
        }, [
          _createVNode(Carousel, {
            value: speakers.value,
            circular: "",
            "num-visible": 3,
            "num-scroll": 1
          }, {
            item: _withCtx(({ data: speaker }) => [
              _createElementVNode("div", {
                class: "speaker-card",
                style: _normalizeStyle({
                backgroundImage: `url(${speaker.avatarUrl}) `,
              }),
                "data-v-dc90cbe3": ""
              }, [
                (speaker.affiliation || speaker.title)
                  ? (_openBlock(), _createElementBlock("p", {
                    key: 0,
                    style: _normalizeStyle({
                  color: speaker.color.base,
                  backgroundColor: speaker.color.sub,
                }),
                    class: "speaker-affiliation",
                    "data-v-dc90cbe3": ""
                  }, [
                    _createTextVNode("\n              "),
                    _toDisplayString(speaker.affiliation),
                    (speaker.affiliation && speaker.title)
                      ? (_openBlock(), _createElementBlock("br", {
                        key: 0,
                        "data-v-dc90cbe3": ""
                      }))
                      : _createCommentVNode("v-if", true),
                    _createTextVNode("\n              "),
                    _toDisplayString(speaker.title),
                    _createTextVNode("\n            ")
                  ]))
                  : _createCommentVNode("v-if", true),
                _createElementVNode("div", {
                  class: "speaker-name",
                  style: _normalizeStyle({
                  color: speaker.color.sub,
                  backgroundColor: speaker.color.base,
                }),
                  "data-v-dc90cbe3": ""
                }, "\n              " + _toDisplayString(speaker.name) + "\n            ", 5 /* TEXT, STYLE */)
              ], 4 /* STYLE */)
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _createElementVNode("div", {
          class: "view-all-speakers",
          "data-v-dc90cbe3": ""
        }, [
          _createVNode(VFButton, { link: _unref(localeRoute)({ name: 'speaker' }) }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('speakers.viewAll')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title"]))
}
}

})
