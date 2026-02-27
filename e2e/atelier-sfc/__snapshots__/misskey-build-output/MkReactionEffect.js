import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, unref as _unref } from "vue"

import { onMounted, ref } from 'vue'
import * as os from '@/os.js'
import MkReactionIcon from '@/components/MkReactionIcon.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkReactionEffect',
  props: {
    reaction: { type: String as PropType<string>, required: true },
    x: { type: Number as PropType<number>, required: true },
    y: { type: Number as PropType<number>, required: true }
  },
  emits: ["end"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const up = ref(false);
const zIndex = os.claimZIndex('middle');
const angle = (90 - (Math.random() * 180)) + 'deg';
onMounted(() => {
	window.setTimeout(() => {
		up.value = true;
	}, 10);
	window.setTimeout(() => {
		emit('end');
	}, 1100);
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(_ctx.$style.root),
      style: _normalizeStyle({ zIndex: _unref(zIndex), top: `${__props.y - 64}px`, left: `${__props.x - 64}px` })
    }, [ _createElementVNode("span", {
        class: _normalizeClass([_ctx.$style.text, { [_ctx.$style.up]: up.value }])
      }, [ _createVNode(MkReactionIcon, {
          class: "icon",
          reaction: __props.reaction
        }) ], 2 /* CLASS */) ], 6 /* CLASS, STYLE */))
}
}

})
