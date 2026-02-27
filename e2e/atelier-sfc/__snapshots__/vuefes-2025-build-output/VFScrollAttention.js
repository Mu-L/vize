import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, withCtx as _withCtx } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("span", { "data-v-00a3cad2": "" }, "Scroll")
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { class: "dotted", "data-v-00a3cad2": "" }, "・")
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("span", { class: "dotted", "data-v-00a3cad2": "" }, "・")
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("span", { class: "dotted", "data-v-00a3cad2": "" }, "・")
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("span", { class: "dotted", "data-v-00a3cad2": "" }, "・")
import { onMounted, onUnmounted, ref } from 'vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFScrollAttention',
  props: {
    direction: { type: String as PropType<"top" | "bottom">, required: false, default: "bottom" }
  },
  setup(__props) {

let showAttentionTimerId: ReturnType<typeof setTimeout> | undefined;
let scrollTimerId: ReturnType<typeof setTimeout> | undefined;
const isShow = ref(false);
const isMoved = ref(false);
const setIsMoved = () => {
  // If the user scrolls, remove the event listener to prevent multiple calls
  window.removeEventListener("scroll", setIsMoved);

  isMoved.value = true;
};
const hideScrollAttention = () => {
  // If the user scrolls, remove the event listener to prevent multiple calls
  window.removeEventListener("scroll", hideScrollAttention);

  if (isShow.value) {
    isShow.value = false;
  }
};
const showScrollAttention = () => {
  if (isMoved.value) {
    // If the user has already scrolled, do not show the attention
    return;
  }

  isShow.value = true;
  // Add an event listener to hide the attention when the user scrolls
  window.addEventListener("scroll", hideScrollAttention, {
    once: true,
  });
};
// TODO: If props.direction is "top", show the attention when the user scrolls down
onMounted(() => {
  showAttentionTimerId = setTimeout(() => {
    // If the user has not scrolled for 4 seconds, show the attention
    showScrollAttention();
    window.removeEventListener("scroll", setIsMoved);
  }, 4000);
  scrollTimerId = setTimeout(() => {
    window.addEventListener("scroll", setIsMoved, {
      once: true,
    });
  }, 1000);
});
onUnmounted(() => {
  window.removeEventListener("scroll", setIsMoved);
  window.removeEventListener("scroll", hideScrollAttention);
  if (showAttentionTimerId) {
    clearTimeout(showAttentionTimerId);
    showAttentionTimerId = undefined;
  }
  if (scrollTimerId) {
    clearTimeout(scrollTimerId);
    scrollTimerId = undefined;
  }
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_Transition, { name: "vf-scroll-attention" }, {
      default: _withCtx(() => [
        (isShow.value)
          ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "vf-scroll-attention",
            "data-v-00a3cad2": ""
          }, [
            _createElementVNode("div", {
              class: "floating",
              "data-v-00a3cad2": ""
            }, [
              _hoisted_1,
              _hoisted_2,
              _hoisted_3,
              _hoisted_4,
              _hoisted_5
            ])
          ]))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }))
}
}

})
