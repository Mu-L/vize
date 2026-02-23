import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, resolveDynamicComponent as _resolveDynamicComponent, renderSlot as _renderSlot, mergeProps as _mergeProps, withCtx as _withCtx } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'Emoji',
  props: {
    as: { type: String as PropType<string>, required: true },
    alt: { type: String as PropType<string>, required: false },
    dataEmojiId: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const title = ref<string | undefined>()
if (__props.alt) {
  if (__props.alt.startsWith(':')) {
    title.value = alt.replace(/:/g, '')
  }
  else {
    import('node-emoji').then(({ find }) => {
      title.value = find(alt)?.key.replace(/_/g, ' ')
    })
  }
}
// if it has a data-emoji-id, use that as the title instead
if (__props.dataEmojiId)
  title.value = dataEmojiId

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_resolveDynamicComponent(__props.as), _mergeProps(_ctx.$attrs, {
      alt: __props.alt,
      "data-emoji-id": __props.dataEmojiId,
      title: title.value
    }), {
      default: _withCtx(() => [
        _renderSlot(_ctx.$slots, "default")
      ]),
      _: 1 /* STABLE */
    }, 16 /* FULL_PROPS */, ["alt", "data-emoji-id", "title"]))
}
}

})
