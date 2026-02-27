import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveDynamicComponent as _resolveDynamicComponent, renderSlot as _renderSlot, mergeProps as _mergeProps, withCtx as _withCtx } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'VFHeading',
  props: {
    id: { type: String as PropType<string>, required: false },
    nth: { type: Number as PropType<1 | 2 | 3>, required: false, default: 2 }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [ (__props.id) ? (_openBlock(), _createElementBlock("a", {
          key: 0,
          href: `#${__props.id}`,
          class: "anchor",
          "data-v-cb52de0e": ""
        }, [ _createVNode(_resolveDynamicComponent(`h${__props.nth}`), _mergeProps(_ctx.$attrs, {
            id: __props.id
          }), {
            default: _withCtx(() => [
              _renderSlot(_ctx.$slots, "default")
            ]),
            _: 1 /* STABLE */
          }) ])) : (_openBlock(), _createBlock(_resolveDynamicComponent(`h${__props.nth}`), _mergeProps(_ctx.$attrs, {
          key: 1,
          is: `h${__props.nth}`,
          id: __props.id
        }), {
          default: _withCtx(() => [
            _renderSlot(_ctx.$slots, "default")
          ]),
          _: 1 /* STABLE */
        })), _createElementVNode("hr") ], 64 /* STABLE_FRAGMENT */))
}
}

})
