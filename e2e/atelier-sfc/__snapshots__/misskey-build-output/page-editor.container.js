import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, withDirectives as _withDirectives, renderSlot as _renderSlot, vShow as _vShow } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-trash", "data-v-e6054065": "" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-menu-2", "data-v-e6054065": "" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-chevron-up", "data-v-e6054065": "" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-chevron-down", "data-v-e6054065": "" })
import { ref } from 'vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'page-editor.container',
  props: {
    expanded: { type: Boolean as PropType<boolean>, required: false, default: true },
    removable: { type: Boolean as PropType<boolean>, required: false, default: true },
    draggable: { type: Boolean as PropType<boolean>, required: false }
  },
  emits: ["toggle", "remove"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const showBody = ref(props.expanded);
function toggleContent(show: boolean) {
	showBody.value = show;
	emit('toggle', show);
}
function remove() {
	emit('remove');
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: "cpjygsrt",
      "data-v-e6054065": ""
    }, [ _createElementVNode("header", null, [ _createElementVNode("div", {
          class: "title",
          "data-v-e6054065": ""
        }, [ _renderSlot(_ctx.$slots, "header") ]), _createElementVNode("div", {
          class: "buttons",
          "data-v-e6054065": ""
        }, [ _renderSlot(_ctx.$slots, "func"), (__props.removable) ? (_openBlock(), _createElementBlock("button", {
              key: 0,
              class: "_button",
              onClick: _cache[0] || (_cache[0] = ($event: any) => (remove())),
              "data-v-e6054065": ""
            }, [ _hoisted_1 ])) : _createCommentVNode("v-if", true), (__props.draggable) ? (_openBlock(), _createElementBlock("button", {
              key: 0,
              class: "drag-handle _button",
              "data-v-e6054065": ""
            }, [ _hoisted_2 ])) : _createCommentVNode("v-if", true), _createElementVNode("button", {
            class: "_button",
            onClick: _cache[1] || (_cache[1] = ($event: any) => (toggleContent(!showBody.value))),
            "data-v-e6054065": ""
          }, [ (showBody.value) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ _hoisted_3 ], 64 /* STABLE_FRAGMENT */)) : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [ _hoisted_4 ], 64 /* STABLE_FRAGMENT */)) ]) ]) ]), _withDirectives(_createElementVNode("div", {
        class: "body",
        "data-v-e6054065": ""
      }, [ _renderSlot(_ctx.$slots, "default") ], 512 /* NEED_PATCH */), [ [_vShow, showBody.value] ]) ]))
}
}

})
