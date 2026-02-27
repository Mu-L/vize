import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import * as Misskey from 'misskey-js'
import MkDrive from '@/components/MkDrive.vue'
import MkWindow from '@/components/MkWindow.vue'
import { i18n } from '@/i18n.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkDriveWindow',
  props: {
    initialFolder: { type: null as unknown as PropType<Misskey.entities.DriveFolder | null>, required: false }
  },
  emits: ["closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkWindow, {
      ref: "window",
      initialWidth: 800,
      initialHeight: 500,
      canResize: true,
      onClosed: _cache[0] || (_cache[0] = ($event: any) => (emit('closed')))
    }, {
      header: _withCtx(() => [
        _createTextVNode("\n\t\t" + _toDisplayString(_unref(i18n).ts.drive) + "\n\t", 1 /* TEXT */)
      ]),
      default: _withCtx(() => [
        _createVNode(MkDrive, { initialFolder: __props.initialFolder })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["initialWidth", "initialHeight", "canResize"]))
}
}

})
