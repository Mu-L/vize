import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, renderSlot as _renderSlot, toDisplayString as _toDisplayString, unref as _unref } from "vue"

import type { AriaLive } from '~/composables/aria'

export default /*@__PURE__*/_defineComponent({
  __name: 'AriaStatus',
  props: {
    ariaLive: { type: null as unknown as PropType<AriaLive>, required: false, default: 'polite' }
  },
  setup(__props, { expose: __expose }) {

const { announceStatus, clearStatus, status } = useAriaStatus()
__expose({
  announceStatus,
  clearStatus,
})

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [ _renderSlot(_ctx.$slots, "default"), _createElementVNode("p", {
        "sr-only": "",
        role: "status",
        "aria-live": __props.ariaLive
      }, [ _renderSlot(_ctx.$slots, "status", {
          name: "status",
          status: _unref(status)
        }, () => [ _createTextVNode("\n      "), _toDisplayString(_unref(status)), _createTextVNode("\n    ") ]) ], 8 /* PROPS */, ["aria-live"]) ], 64 /* STABLE_FRAGMENT */))
}
}

})
