import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue"

import type { GridRow } from '@/components/grid/row.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkNumberCell',
  props: {
    content: { type: String as PropType<string>, required: true },
    row: { type: null as unknown as PropType<GridRow>, required: false }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(["mk_grid_th", [_ctx.$style.cell]]),
      tabindex: -1,
      "data-grid-cell": "",
      "data-grid-cell-row": __props.row?.index ?? -1,
      "data-grid-cell-col": -1
    }, [ _createElementVNode("div", {
        class: _normalizeClass([_ctx.$style.root])
      }, "\n\t\t" + _toDisplayString(__props.content) + "\n\t", 3 /* TEXT, CLASS */) ], 10 /* CLASS, PROPS */, ["tabindex", "data-grid-cell-row", "data-grid-cell-col"]))
}
}

})
