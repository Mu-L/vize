import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "staff-description", "data-v-c298d5f2": "" }
import { HOME_HEADING_ID } from '~/constant'
import { useI18n, useFetch, useBreakpoint, computed, onMounted } from '#imports'
import { VFSection } from '#components'
import StaffGrid from './StaffGrid.vue'
import type { Staff } from '~~/server/api/staffs/index.get'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionStaff',
  async setup(__props) {

const { t } = useI18n();
const bp = useBreakpoint();
const { data: staffList } = await useFetch("/api/staffs", { deep: true });
const leaderColumns = computed(() => {
  return bp.value === "pc" ? 3 : 2;
});
const coreColumns = computed(() => {
  return bp.value === "pc" ? 4 : 3;
});
onMounted(() => {
  if (!staffList.value) return;
  staffList.value.leaders = shuffleNonPinned(staffList.value.leaders);
  staffList.value.cores = shuffleNonPinned(staffList.value.cores);
});
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}
function shuffleNonPinned(staffArray: Staff[]): Staff[] {
  const pinned = staffArray.filter(staff => staff.pinned);
  const nonPinned = staffArray.filter(staff => !staff.pinned);
  const shuffledNonPinned = shuffleArray(nonPinned);
  return [...pinned, ...shuffledNonPinned];
}

return (_ctx: any,_cache: any) => {
  const _component_VFHeading = _resolveComponent("VFHeading")

  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).staff,
      title: _unref(t)('staff.title')
    }, {
      default: _withCtx(() => [
        _createElementVNode("p", _hoisted_1, "\n      " + _toDisplayString(_unref(t)('staff.description')) + "\n    ", 1 /* TEXT */),
        (_unref(staffList))
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _createVNode(StaffGrid, {
              "staff-list": _unref(staffList).leaders,
              "grid-mode": "leader",
              columns: leaderColumns.value
            }),
            _createVNode(StaffGrid, {
              "staff-list": _unref(staffList).cores,
              "grid-mode": "core",
              columns: coreColumns.value
            }),
            _createVNode(_component_VFHeading, { id: "volunteer-staff" }, {
              default: _withCtx(() => [
                _createTextVNode("\n        "),
                _createTextVNode(_toDisplayString(_unref(t)('staff.volunteer')), 1 /* TEXT */),
                _createTextVNode("\n      ")
              ]),
              _: 1 /* STABLE */
            }),
            _createVNode(StaffGrid, {
              "staff-list": _unref(staffList).volunteers,
              "grid-mode": "volunteer"
            })
          ], 64 /* STABLE_FRAGMENT */))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title"]))
}
}

})
