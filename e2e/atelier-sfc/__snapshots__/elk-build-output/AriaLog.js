import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveDynamicComponent as _resolveDynamicComponent, renderList as _renderList, renderSlot as _renderSlot, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import type { AriaLive } from '~/composables/aria'

export default /*@__PURE__*/_defineComponent({
  __name: 'AriaLog',
  props: {
    ariaLive: { type: null as unknown as PropType<AriaLive>, required: false, default: 'polite' },
    heading: { type: String as PropType<'h2' | 'h3' | 'h4' | 'h5' | 'h6'>, required: false, default: 'h2' },
    title: { type: String as PropType<string>, required: true },
    messageKey: { type: Object as PropType<(message: any) => any>, required: false, default: (message: any) => message }
  },
  setup(__props, { expose: __expose }) {

const { announceLogs, appendLogs, clearLogs, logs } = useAriaLog()
__expose({
  announceLogs,
  appendLogs,
  clearLogs,
})

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [ _renderSlot(_ctx.$slots, "default"), _createElementVNode("div", {
        "sr-only": "",
        role: "log",
        "aria-live": __props.ariaLive
      }, [ _createVNode(_resolveDynamicComponent(__props.heading), null, {
          default: _withCtx(() => [
            _createTextVNode("\n      "),
            _createTextVNode(_toDisplayString(__props.title), 1 /* TEXT */),
            _createTextVNode("\n    ")
          ]),
          _: 1 /* STABLE */
        }), _createElementVNode("ul", null, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_unref(logs), (log) => {
            return (_openBlock(), _createElementBlock("li", { key: __props.messageKey(log) }, [
              _renderSlot(_ctx.$slots, "log", {
                name: "log",
                log: log
              }, () => [
                _createTextVNode("\n          "),
                _toDisplayString(log),
                _createTextVNode("\n        ")
              ])
            ]))
          }), 128 /* KEYED_FRAGMENT */)) ]) ], 8 /* PROPS */, ["aria-live"]) ], 64 /* STABLE_FRAGMENT */))
}
}

})
