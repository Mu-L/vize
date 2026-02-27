import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, renderSlot as _renderSlot, toDisplayString as _toDisplayString, withCtx as _withCtx } from "vue"

import { VFHeading } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFSection',
  props: {
    title: { type: String as PropType<string>, required: false },
    heading: { type: Number as PropType<1 | 2 | 3 | 4 | 5 | 6>, required: false, default: 2 },
    coverImage: { type: Object as PropType<{ src: string; alt: string; }>, required: false },
    id: { type: String as PropType<string>, required: false }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("section", {
      class: "vf-section",
      "data-v-a7fe3cf2": ""
    }, [ (__props.coverImage) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "section-cover-wrapper",
          "data-v-a7fe3cf2": ""
        }, [ _createElementVNode("img", {
            src: __props.coverImage.src,
            alt: __props.coverImage.alt,
            "data-v-a7fe3cf2": ""
          }, null, 8 /* PROPS */, ["src", "alt"]) ])) : _createCommentVNode("v-if", true), _createElementVNode("div", {
        class: "section-content",
        "data-v-a7fe3cf2": ""
      }, [ (__props.title) ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            "data-v-a7fe3cf2": ""
          }, [ _createVNode(VFHeading, {
              id: __props.id,
              level: __props.heading
            }, {
              default: _withCtx(() => [
                _createTextVNode("\n          "),
                _createTextVNode(_toDisplayString(__props.title), 1 /* TEXT */),
                _createTextVNode("\n        ")
              ]),
              _: 1 /* STABLE */
            }) ])) : _createCommentVNode("v-if", true), _createElementVNode("div", {
          class: "section-content-inner",
          "data-v-a7fe3cf2": ""
        }, [ _renderSlot(_ctx.$slots, "default") ]) ]) ]))
}
}

})
