import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, resolveComponent as _resolveComponent, renderList as _renderList } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusMedia',
  props: {
    status: { type: null as unknown as PropType<mastodon.v1.Status | mastodon.v1.StatusEdit>, required: true },
    fullSize: { type: Boolean as PropType<boolean>, required: false },
    isPreview: { type: Boolean as PropType<boolean>, required: false, default: false }
  },
  setup(__props) {

const gridColumnNumber = computed(() => {
  const num = __props.status.mediaAttachments.length
  if (num <= 1)
    return 1
  else if (num <= 4)
    return 2
  else
    return 3
})

return (_ctx: any,_cache: any) => {
  const _component_StatusAttachment = _resolveComponent("StatusAttachment")

  return (_openBlock(), _createElementBlock("div", { class: "status-media-container" }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.status.mediaAttachments, (attachment) => {
        return (_openBlock(), _createElementBlock(_Fragment, { key: attachment.id }, [
          _createVNode(_component_StatusAttachment, {
            attachment: attachment,
            attachments: __props.status.mediaAttachments,
            "full-size": __props.fullSize,
            "w-full": "",
            "h-full": "",
            "is-preview": __props.isPreview
          })
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */)) ]))
}
}

})
