import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusVisibilityIndicator',
  props: {
    status: { type: null as unknown as PropType<mastodon.v1.Status>, required: true }
  },
  setup(__props) {

const visibility = computed(() => statusVisibilities.find(v => v.value === status.visibility)!)

return (_ctx: any,_cache: any) => {
  const _component_CommonTooltip = _resolveComponent("CommonTooltip")

  return (_openBlock(), _createBlock(_component_CommonTooltip, {
      content: _ctx.$t(`visibility.${visibility.value}`),
      placement: "bottom"
    }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: _normalizeClass(visibility.value.icon),
          "aria-label": _ctx.$t(`visibility.${visibility.value}`)
        }, null, 10 /* CLASS, PROPS */, ["aria-label"])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["content"]))
}
}

})
