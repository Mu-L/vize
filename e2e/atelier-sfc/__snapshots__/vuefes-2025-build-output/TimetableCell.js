import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "schedule-title", "data-v-5dc9891f": "" }
const _hoisted_2 = { class: "name", "data-v-5dc9891f": "" }
import { computed } from 'vue'
import { useI18n, useLocaleRoute } from '#imports'
import type { TimetableCell } from '~~/i18n/timetable'
import SliderIcon from '~icons/icons/timetable-slider.svg'

export default /*@__PURE__*/_defineComponent({
  __name: 'TimetableCell',
  setup(__props) {

const { t } = useI18n();
const localeRoute = useLocaleRoute();
const accentColorName = computed(() => {
  switch (__props.track) {
    case "hacomono":
      return "primary";
    case "mates":
      return "purple";
    case "feature":
      return "orange";
    case "cyberAgent":
      return "navy";
    case "blank":
      return "blank";
    default:
      return "primary";
  }
});
const backgroundColor = `var(--color-${accentColorName.value}-sub)`;
const color = `var(--color-${accentColorName.value}-base)`;
const hoverColor = `var(--color-${accentColorName.value}-accent-hover)`;

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createElementBlock("td", {
      colspan: __props.colspan,
      rowspan: __props.rowspan,
      class: _normalizeClass(["cell", { 'cell--schedule': __props.type === 'schedule' }]),
      "data-v-5dc9891f": ""
    }, [ _createElementVNode("div", {
        class: "cell-inner",
        "data-v-5dc9891f": ""
      }, [ (__props.startTime && __props.type !== 'schedule') ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "time",
            "data-v-5dc9891f": ""
          }, "\n        " + "\n        " + _toDisplayString(__props.startTime) + " - " + _toDisplayString(__props.endTime) + "\n      ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (__props.type === 'schedule') ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "schedule-content",
            "data-v-5dc9891f": ""
          }, [ (__props.startTime) ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "time",
                "data-v-5dc9891f": ""
              }, "\n            " + "\n            " + _toDisplayString(__props.startTime) + " - " + _toDisplayString(__props.endTime) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createElementVNode("div", _hoisted_1, "\n            " + _toDisplayString(__props.title) + "\n          ", 1 /* TEXT */) ])) : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [ (__props.type === 'event' && __props.link) ? (_openBlock(), _createBlock(_component_NuxtLink, {
                key: 0,
                to: {
              path: '/event',
              query: { session: __props.link },
              hash: `#${__props.link}`,
            },
                class: "title"
              }, {
                default: _withCtx(() => [
                  _createTextVNode("\n          "),
                  _createTextVNode(_toDisplayString(__props.title), 1 /* TEXT */),
                  _createTextVNode("\n        ")
                ]),
                _: 1 /* STABLE */
              })) : (_openBlock(), _createElementBlock("div", {
                key: 1,
                class: "title",
                "data-v-5dc9891f": ""
              }, "\n          " + _toDisplayString(__props.title) + "\n        ", 1 /* TEXT */)), (__props.speakers) ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "speakers",
                style: _normalizeStyle({ '--speaker-gap': __props.type ==='lightningTalk' ? '32px' : undefined }),
                "data-v-5dc9891f": ""
              }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.speakers, (speaker) => {
                  return (_openBlock(), _createElementBlock("div", {
                    key: speaker.id,
                    class: _normalizeClass({ 'event-speaker': __props.type === 'event' }),
                    "data-v-5dc9891f": ""
                  }, [
                    (speaker.talkTitle)
                      ? (_openBlock(), _createBlock(_component_NuxtLink, {
                        key: 0,
                        to: _unref(localeRoute)(
                    speaker.sponsorId === undefined
                      ? { name: 'speaker-speakerId', params: { speakerId: speaker.id } }
                      : { name: 'sponsors-sponsorId', params: { sponsorId: speaker.sponsorId }, hash: `#${speaker.id}` },
                  ) || (speaker.sponsorId === undefined ? '/speakers' : '/sponsors'),
                        class: "title"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode("\n                "),
                          _createTextVNode(_toDisplayString(speaker.talkTitle), 1 /* TEXT */),
                          _createTextVNode("\n              ")
                        ]),
                        _: 1 /* STABLE */
                      }))
                      : _createCommentVNode("v-if", true),
                    _createElementVNode("div", {
                      class: "speaker-item",
                      "data-v-5dc9891f": ""
                    }, [
                      (speaker.avatarUrl)
                        ? (_openBlock(), _createElementBlock("div", {
                          key: 0,
                          class: "avatar",
                          "data-v-5dc9891f": ""
                        }, [
                          _createElementVNode("img", {
                            src: speaker.avatarUrl,
                            alt: speaker.name,
                            "data-v-5dc9891f": ""
                          }, null, 8 /* PROPS */, ["src", "alt"])
                        ]))
                        : _createCommentVNode("v-if", true),
                      _createElementVNode("div", {
                        class: "speaker-info",
                        "data-v-5dc9891f": ""
                      }, [
                        (speaker.affiliation)
                          ? (_openBlock(), _createElementBlock("p", {
                            key: 0,
                            class: "affiliation",
                            "data-v-5dc9891f": ""
                          }, "\n                    " + _toDisplayString(speaker.affiliation) + "\n                  ", 1 /* TEXT */))
                          : _createCommentVNode("v-if", true),
                        (speaker.title)
                          ? (_openBlock(), _createElementBlock("p", {
                            key: 0,
                            class: "job-title",
                            "data-v-5dc9891f": ""
                          }, "\n                    " + _toDisplayString(speaker.title) + "\n                  ", 1 /* TEXT */))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("p", _hoisted_2, "\n                    " + _toDisplayString(speaker.name) + "\n                  ", 1 /* TEXT */)
                      ])
                    ])
                  ], 2 /* CLASS */))
                }), 128 /* KEYED_FRAGMENT */)) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n        "), _createTextVNode("\n        "), (__props.slide) ? (_openBlock(), _createElementBlock("a", {
                key: 0,
                href: __props.slide,
                class: "slide",
                target: "_blank",
                "data-v-5dc9891f": ""
              }, [ _createVNode(SliderIcon, {
                  "aria-label": _unref(t)('timetable.slider'),
                  role: "img"
                }) ])) : _createCommentVNode("v-if", true) ], 64 /* STABLE_FRAGMENT */)) ]) ], 10 /* CLASS, PROPS */, ["colspan", "rowspan"]))
}
}

})
