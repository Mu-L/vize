import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { useLocaleRoute } from '@typed-router'
import { useBreakpoint, useI18n, useWithBase } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionTimetable',
  setup(__props) {

const bp = useBreakpoint();
const withBase = useWithBase();
const { t } = useI18n();
const localeRoute = useLocaleRoute();

return (_ctx: any,_cache: any) => {
  const _component_VFSection = _resolveComponent("VFSection")
  const _component_VFButton = _resolveComponent("VFButton")

  return (_openBlock(), _createBlock(_component_VFSection, { "cover-image": {
        src: _unref(bp) === 'pc'
          ? _unref(withBase)('/images/top/cover/timetable-pc.svg')
          : _unref(withBase)('/images/top/cover/timetable-sp.svg'),
        alt: _unref(t)('timetable.coverImageAlt'),
      } }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: "button-container",
          "data-v-b56a5ce0": ""
        }, [
          _createVNode(_component_VFButton, { link: _unref(localeRoute)('/timetable') }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('timetable.view')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["cover-image"]))
}
}

})
