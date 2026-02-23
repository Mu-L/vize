import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, mergeProps as _mergeProps, withCtx as _withCtx, unref as _unref } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/Object.assign({
  inheritAttrs: false,
}, {
  __name: 'TagHoverWrapper',
  props: {
    tagName: { type: String as PropType<string>, required: false },
    disabled: { type: Boolean as PropType<boolean>, required: false }
  },
  setup(__props) {

const tag = ref<mastodon.v1.Tag>()
const tagHover = ref()
const hovered = useElementHover(tagHover)
watch(hovered, (newHovered) => {
  if (newHovered && __props.tagName) {
    fetchTag(__props.tagName).then((t) => {
      tag.value = t
    })
  }
})
const userSettings = useUserSettings()

return (_ctx: any,_cache: any) => {
  const _component_VMenu = _resolveComponent("VMenu")
  const _component_TagCardSkeleton = _resolveComponent("TagCardSkeleton")
  const _component_TagCard = _resolveComponent("TagCard")

  return (_openBlock(), _createElementBlock("span", { ref: tagHover }, [ (!__props.disabled && !_ctx.getPreferences(_unref(userSettings), 'hideTagHoverCard')) ? (_openBlock(), _createBlock(_component_VMenu, _mergeProps(_ctx.$attrs, {
          key: 0,
          placement: "bottom-start",
          delay: { show: 500, hide: 100 },
          "close-on-content-click": false,
          "no-auto-focus": ""
        }), {
          popper: _withCtx(() => [
            (!tag.value)
              ? (_openBlock(), _createBlock(_component_TagCardSkeleton, { key: 0 }))
              : (_openBlock(), _createBlock(_component_TagCard, {
                key: 1,
                tag: tag.value
              }))
          ]),
          default: _withCtx(() => [
            _renderSlot(_ctx.$slots, "default")
          ]),
          _: 1 /* STABLE */
        })) : (_openBlock(), _createElementBlock("slot", { key: 1 })) ], 512 /* NEED_PATCH */))
}
}

})
