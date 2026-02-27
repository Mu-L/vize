import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, mergeProps as _mergeProps, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import type { NuxtRoute, RoutesNamesList } from '@typed-router'
import { useI18n } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFButton',
  props: {
    type: { type: String as PropType<"button" | "submit" | "reset">, required: false, default: "button" },
    outlined: { type: Boolean as PropType<boolean>, required: false, default: false },
    icon: { type: Boolean as PropType<boolean>, required: false, default: false },
    link: { type: null as unknown as PropType<NuxtRoute<T, P> | string>, required: false },
    external: { type: Boolean as PropType<true>, required: false, default: false }
  },
  setup(__props, { emit: __emit }) {

const emit = __emit
const { locale: lang } = useI18n();

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (__props.to)
      ? (_openBlock(), _createBlock(_component_NuxtLink, {
        key: 0,
        to: undefined,
        lang: undefined,
        class: _normalizeClass(["button", [
        {
          'button-outlined': __props.outlined,
          'button-icon': __props.icon,
        },
      ]]),
        external: undefined,
        target: __props.external ? '_blank' : undefined
      }, {
        default: _withCtx(() => [
          _renderSlot(_ctx.$slots, "default")
        ]),
        _: 1 /* STABLE */
      }))
      : (_openBlock(), _createElementBlock("button", _mergeProps(_ctx.$attrs, {
        key: 1,
        type: undefined,
        lang: undefined,
        class: _normalizeClass([
        {
          'button-outlined': __props.outlined,
          'button-icon': __props.icon,
        },
      ]),
        onClick: _cache[0] || (_cache[0] = ($event: any) => (emit('click'))),
        "data-v-c2c19fc7": ""
      }), [ _renderSlot(_ctx.$slots, "default") ]))
}
}

})
