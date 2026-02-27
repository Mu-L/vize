import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"

import { onMounted, ref } from 'vue'
import MkUrlPreview from '@/components/MkUrlPreview.vue'
import * as os from '@/os.js'
import { prefer } from '@/preferences.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkUrlPreviewPopup',
  props: {
    showing: { type: Boolean as PropType<boolean>, required: true },
    url: { type: String as PropType<string>, required: true },
    anchorElement: { type: null as unknown as PropType<HTMLElement>, required: true }
  },
  emits: ["closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const zIndex = os.claimZIndex('middle');
const top = ref(0);
const left = ref(0);
onMounted(() => {
	const rect = props.anchorElement.getBoundingClientRect();
	const x = Math.max((rect.left + (props.anchorElement.offsetWidth / 2)) - (300 / 2), 6) + window.scrollX;
	const y = rect.top + props.anchorElement.offsetHeight + window.scrollY;
	top.value = y;
	left.value = x;
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(_ctx.$style.root),
      style: _normalizeStyle({ zIndex: _unref(zIndex), top: top.value + 'px', left: left.value + 'px' })
    }, [ _createVNode(_Transition, {
        name: _unref(prefer).s.animation ? '_transition_zoom' : '',
        onAfterLeave: _cache[0] || (_cache[0] = ($event: any) => (emit('closed')))
      }, {
        default: _withCtx(() => [
          (__props.showing)
            ? (_openBlock(), _createBlock(MkUrlPreview, {
              key: 0,
              class: "_popup _shadow",
              url: __props.url,
              showActions: false
            }))
            : _createCommentVNode("v-if", true)
        ]),
        _: 1 /* STABLE */
      }) ], 6 /* CLASS, STYLE */))
}
}

})
