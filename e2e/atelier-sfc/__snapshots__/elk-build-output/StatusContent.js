import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusContent',
  props: {
    status: { type: null as unknown as PropType<mastodon.v1.Status>, required: true },
    newer: { type: null as unknown as PropType<mastodon.v1.Status>, required: false },
    context: { type: null as unknown as PropType<mastodon.v2.FilterContext | 'details'>, required: false },
    isPreview: { type: Boolean as PropType<boolean>, required: false },
    inNotification: { type: Boolean as PropType<boolean>, required: false },
    isNested: { type: Boolean as PropType<boolean>, required: true }
  },
  setup(__props) {

const isDM = computed(() => __props.status.visibility === 'direct')
const isDetails = computed(() => __props.context === 'details')
// Content Filter logic
const filterResult = computed(() => status.filtered?.length ? __props.status.filtered[0] : null)
const filter = computed(() => filterResult.value?.filter)
const filterPhrase = computed(() => filter.value?.title)
const isFiltered = computed(() => __props.status.account.id !== currentUser.value?.account.id && filterPhrase && __props.context && __props.context !== 'details' && !!filter.value?.context.includes(context))
// check spoiler text or media attachment
// needed to handle accounts that mark all their posts as sensitive
const spoilerTextPresent = computed(() => !!__props.status.spoilerText && __props.status.spoilerText.trim().length > 0)
const hasSpoilerOrSensitiveMedia = computed(() => spoilerTextPresent.value || (__props.status.sensitive && !!__props.status.mediaAttachments.length))
const isSensitiveNonSpoiler = computed(() => __props.status.sensitive && !__props.status.spoilerText && !!__props.status.mediaAttachments.length)
const hideAllMedia = computed(
  () => {
    return currentUser.value ? (getHideMediaByDefault(currentUser.value.account) && (!!__props.status.mediaAttachments.length || !!status.card?.html)) : false
  },
)
const embeddedMediaPreference = usePreferences('experimentalEmbeddedMedia')
const allowEmbeddedMedia = computed(() => status.card?.html && embeddedMediaPreference.value)

return (_ctx: any,_cache: any) => {
  const _component_StatusBody = _resolveComponent("StatusBody")
  const _component_StatusSpoiler = _resolveComponent("StatusSpoiler")
  const _component_ContentRich = _resolveComponent("ContentRich")
  const _component_StatusTranslation = _resolveComponent("StatusTranslation")
  const _component_StatusPoll = _resolveComponent("StatusPoll")
  const _component_StatusMedia = _resolveComponent("StatusMedia")
  const _component_StatusPreviewCard = _resolveComponent("StatusPreviewCard")
  const _component_StatusEmbeddedMedia = _resolveComponent("StatusEmbeddedMedia")
  const _component_StatusCard = _resolveComponent("StatusCard")

  return (_openBlock(), _createElementBlock("div", {
      "space-y-3": "",
      class: _normalizeClass({
        'py2 px3.5 bg-dm rounded-4 me--1': isDM.value,
        'ms--3.5 mt--1 ms--1': isDM.value && __props.context !== 'details',
      })
    }, [ ((!isFiltered.value && isSensitiveNonSpoiler.value) || hideAllMedia.value) ? (_openBlock(), _createBlock(_component_StatusBody, {
          key: 0,
          status: __props.status,
          newer: __props.newer,
          "with-action": !isDetails.value,
          "is-nested": __props.isNested,
          class: _normalizeClass(isDetails.value ? 'text-xl' : '')
        })) : _createCommentVNode("v-if", true), _createVNode(_component_StatusSpoiler, {
        enabled: hasSpoilerOrSensitiveMedia.value || isFiltered.value,
        filter: isFiltered.value,
        "sensitive-non-spoiler": isSensitiveNonSpoiler.value || hideAllMedia.value,
        "is-d-m": isDM.value
      }, {
        default: _withCtx(() => [
          (spoilerTextPresent.value)
            ? (_openBlock(), _createElementBlock("p", { key: 0 }, [
              _createVNode(_component_ContentRich, {
                content: __props.status.spoilerText,
                emojis: __props.status.emojis,
                markdown: false
              })
            ]))
            : (filterPhrase.value)
              ? (_openBlock(), _createElementBlock("p", { key: 1 }, _toDisplayString(`${_ctx.$t('status.filter_hidden_phrase')}: ${filterPhrase.value}`), 1 /* TEXT */))
            : _createCommentVNode("v-if", true),
          (!(isSensitiveNonSpoiler.value || hideAllMedia.value))
            ? (_openBlock(), _createBlock(_component_StatusBody, {
              key: 0,
              status: __props.status,
              newer: __props.newer,
              "with-action": !isDetails.value,
              "is-nested": __props.isNested,
              class: _normalizeClass(isDetails.value ? 'text-xl' : '')
            }))
            : _createCommentVNode("v-if", true),
          _createVNode(_component_StatusTranslation, { status: __props.status }),
          (__props.status.poll)
            ? (_openBlock(), _createBlock(_component_StatusPoll, {
              key: 0,
              status: __props.status
            }))
            : _createCommentVNode("v-if", true),
          (__props.status.mediaAttachments?.length)
            ? (_openBlock(), _createBlock(_component_StatusMedia, {
              key: 0,
              status: __props.status,
              "is-preview": __props.isPreview
            }))
            : _createCommentVNode("v-if", true),
          (__props.status.card && !allowEmbeddedMedia.value && !__props.isNested)
            ? (_openBlock(), _createBlock(_component_StatusPreviewCard, {
              key: 0,
              card: __props.status.card,
              "small-picture-only": __props.status.mediaAttachments?.length > 0
            }))
            : _createCommentVNode("v-if", true),
          (allowEmbeddedMedia.value)
            ? (_openBlock(), _createBlock(_component_StatusEmbeddedMedia, {
              key: 0,
              status: __props.status
            }))
            : _createCommentVNode("v-if", true),
          (__props.status.reblog)
            ? (_openBlock(), _createBlock(_component_StatusCard, {
              key: 0,
              status: __props.status.reblog,
              border: "~ rounded",
              actions: false
            }))
            : _createCommentVNode("v-if", true)
        ]),
        _: 1 /* STABLE */
      }) ], 2 /* CLASS */))
}
}

})
