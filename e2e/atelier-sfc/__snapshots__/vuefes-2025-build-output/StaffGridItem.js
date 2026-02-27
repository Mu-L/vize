import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"


const _hoisted_1 = { class: "font-bold", "data-v-3d07fc80": "" }
const _hoisted_2 = { class: "font-bold", "data-v-3d07fc80": "" }

import { computed } from "vue";

export type StaffItemProps = {
  name: string;
  avatarUrl?: string;
  socialUrls?: {
    x?: string;
    github?: string;
  };
};

export default /*@__PURE__*/_defineComponent({
  __name: 'StaffGridItem',
  setup(__props) {

const gridItemClass = computed(() => `staff-link-${__props.gridMode}`);
const linkComp = computed(() => socialUrls?.x ? __props.socialUrls.x : socialUrls?.github);

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (linkComp.value)
      ? (_openBlock(), _createBlock(_component_NuxtLink, {
        key: 0,
        to: linkComp.value,
        external: "",
        target: "_blank",
        class: _normalizeClass(["staff", gridItemClass.value])
      }, {
        default: _withCtx(() => [
          _createElementVNode("img", {
            src: __props.avatarUrl,
            alt: __props.name,
            "data-v-3d07fc80": ""
          }, null, 8 /* PROPS */, ["src", "alt"]),
          _createElementVNode("p", _hoisted_1, _toDisplayString(__props.name), 1 /* TEXT */)
        ]),
        _: 1 /* STABLE */
      }))
      : (_openBlock(), _createElementBlock("div", {
        key: 1,
        class: _normalizeClass(["staff", gridItemClass.value]),
        "data-v-3d07fc80": ""
      }, [ (__props.avatarUrl) ? (_openBlock(), _createElementBlock("img", {
            key: 0,
            src: __props.avatarUrl,
            alt: __props.name,
            loading: "lazy",
            "data-v-3d07fc80": ""
          })) : _createCommentVNode("v-if", true), _createElementVNode("p", _hoisted_2, "\n      " + _toDisplayString(__props.name) + "\n    ", 1 /* TEXT */) ]))
}
}

})
