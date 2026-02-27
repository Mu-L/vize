import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, mergeProps as _mergeProps, withCtx as _withCtx } from "vue"


export type MenuItemProps = {
  id: string;
  label: string;
  routeName: string;
  disabled?: boolean;
};

export default /*@__PURE__*/_defineComponent({
  __name: 'VFMenuItem',
  props: {
    id: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    routeName: { type: String as PropType<string>, required: true },
    disabled: { type: Boolean as PropType<boolean>, required: false }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createBlock(_component_NuxtLink, _mergeProps(_ctx.$attrs, {
      class: { 'menuitem-link': true, 'text-body-1': true, 'menuitem-link-disabled': __props.disabled },
      to: { name: __props.routeName },
      "prefetch-on": "visibility",
      "active-class": "menuitem-link-active"
    }), {
      default: _withCtx(() => [
        _createTextVNode("\n    "),
        _createTextVNode(_toDisplayString(__props.label), 1 /* TEXT */),
        _createTextVNode("\n  ")
      ]),
      _: 1 /* STABLE */
    }, 16 /* FULL_PROPS */, ["to"]))
}
}

})
