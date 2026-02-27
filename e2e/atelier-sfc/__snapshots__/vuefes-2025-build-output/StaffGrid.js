import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, renderList as _renderList, mergeProps as _mergeProps, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle } from "vue"

import { computed } from 'vue'
import StaffGridItem, { type StaffItemProps } from './StaffGridItem.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'StaffGrid',
  props: {
    staffList: { type: Array as PropType<StaffItemProps[]>, required: true },
    gridMode: { type: String as PropType<"leader" | "core" | "volunteer">, required: true },
    columns: { type: Number as PropType<number>, required: false }
  },
  setup(__props) {

const gridClass = computed(() => `staff-grid staff-grid-${__props.gridMode}`);
const gridStyle = computed(() =>
  __props.columns && (__props.gridMode === "leader" || __props.gridMode === "core")
    ? { gridTemplateColumns: `repeat(${__props.columns}, 1fr)` }
    : {},
);

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(gridClass.value),
      style: _normalizeStyle(gridStyle.value),
      "data-v-90614dfd": ""
    }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.staffList, (staff, idx) => {
        return (_openBlock(), _createBlock(StaffGridItem, _mergeProps({ ...staff, gridMode: __props.gridMode }, {
          key: idx,
          class: "staff-member"
        }), null, 16 /* FULL_PROPS */))
      }), 128 /* KEYED_FRAGMENT */)) ], 6 /* CLASS, STYLE */))
}
}

})
