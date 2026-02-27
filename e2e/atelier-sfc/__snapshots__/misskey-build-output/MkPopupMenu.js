import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import { ref, useTemplateRef } from 'vue'
import MkModal from './MkModal.vue'
import MkMenu from './MkMenu.vue'
import type { MenuItem } from '@/types/menu.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkPopupMenu',
  props: {
    items: { type: Array as PropType<MenuItem[]>, required: true },
    align: { type: String as PropType<'center' | string>, required: false },
    width: { type: Number as PropType<number>, required: false },
    anchorElement: { type: null as unknown as PropType<HTMLElement | null>, required: false },
    returnFocusTo: { type: null as unknown as PropType<HTMLElement | null>, required: false }
  },
  emits: ["closed", "closing"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const modal = useTemplateRef('modal');
const manualShowing = ref(true);
const hiding = ref(false);
function click() {
	close();
}
function onModalClose() {
	emit('closing');
}
function onMenuClose() {
	close();
	if (hiding.value) {
		// hidingであればclosedを発火
		emit('closed');
	}
}
function onModalClosed() {
	if (!hiding.value) {
		// hidingでなければclosedを発火
		emit('closed');
	}
}
function hide() {
	manualShowing.value = false;
	hiding.value = true;
	// closeは呼ぶ必要がある
	modal.value?.close();
}
function close() {
	manualShowing.value = false;
	// closeは呼ぶ必要がある
	modal.value?.close();
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkModal, {
      ref: modal,
      manualShowing: manualShowing.value,
      zPriority: 'high',
      anchorElement: __props.anchorElement,
      transparentBg: true,
      returnFocusTo: __props.returnFocusTo,
      onClick: click,
      onClose: onModalClose,
      onClosed: onModalClosed
    }, {
      default: _withCtx(({ type, maxHeight }) => [
        _createVNode(MkMenu, {
          items: __props.items,
          align: __props.align,
          width: __props.width,
          "max-height": maxHeight,
          asDrawer: type === 'drawer',
          returnFocusTo: __props.returnFocusTo,
          class: _normalizeClass({ [_ctx.$style.drawer]: type === 'drawer' }),
          onClose: onMenuClose,
          onHide: hide
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["manualShowing", "zPriority", "anchorElement", "transparentBg", "returnFocusTo"]))
}
}

})
