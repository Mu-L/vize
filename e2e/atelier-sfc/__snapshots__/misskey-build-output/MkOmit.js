import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, renderSlot as _renderSlot, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, unref as _unref } from "vue"

import { onMounted, onUnmounted, useTemplateRef, ref } from 'vue'
import { i18n } from '@/i18n.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkOmit',
  props: {
    maxHeight: { type: Number as PropType<number>, required: false, default: 200 }
  },
  setup(__props) {

const props = __props
const content = useTemplateRef('content');
const omitted = ref(false);
const ignoreOmit = ref(false);
const calcOmit = () => {
	if (omitted.value || ignoreOmit.value || content.value == null) return;
	omitted.value = content.value.offsetHeight > props.maxHeight;
};
const omitObserver = new ResizeObserver((entries, observer) => {
	calcOmit();
});
onMounted(() => {
	calcOmit();
	omitObserver.observe(content.value as HTMLElement);
});
onUnmounted(() => {
	omitObserver.disconnect();
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      ref: content,
      class: _normalizeClass([_ctx.$style.content, { [_ctx.$style.omitted]: omitted.value }])
    }, [ _renderSlot(_ctx.$slots, "default"), (omitted.value) ? (_openBlock(), _createElementBlock("button", {
          key: 0,
          class: _normalizeClass(["_button", _ctx.$style.fade]),
          onClick: _cache[0] || (_cache[0] = () => { ignoreOmit.value = true; omitted.value = false; })
        }, [ _createElementVNode("span", {
            class: _normalizeClass(_ctx.$style.fadeLabel)
          }, _toDisplayString(_unref(i18n).ts.showMore), 3 /* TEXT, CLASS */) ])) : _createCommentVNode("v-if", true) ], 2 /* CLASS */))
}
}

})
