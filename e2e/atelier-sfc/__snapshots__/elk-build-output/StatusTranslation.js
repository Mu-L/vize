import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("span", { block: "true", "i-ri:loader-2-fill": "true", "data-v-f51ca8d9": "" })
import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'StatusTranslation',
  props: {
    status: { type: null as unknown as PropType<mastodon.v1.Status>, required: true }
  },
  async setup(__props) {

const {
  toggle: _toggleTranslation,
  translation,
  enabled: isTranslationEnabled,
} = await useTranslation(status, getLanguageCode())
const preferenceHideTranslation = usePreferences('hideTranslation')
const showButton = computed(() =>
  !preferenceHideTranslation.value
  && isTranslationEnabled
  && __props.status.content.trim().length,
)
const translating = ref(false)
async function toggleTranslation() {
  translating.value = true
  try {
    await _toggleTranslation()
  }
  finally {
    translating.value = false
  }
}

return (_ctx: any,_cache: any) => {
  return (showButton.value)
      ? (_openBlock(), _createElementBlock("div", {
        key: 0,
        "data-v-f51ca8d9": ""
      }, [ _createElementVNode("button", {
          "p-0": "",
          flex: "~ center",
          "gap-2": "",
          "text-sm": "",
          disabled: translating.value,
          "disabled-bg-transparent": "",
          "btn-text": "",
          class: "disabled-text-$c-text-btn-disabled-deeper",
          onClick: toggleTranslation,
          "data-v-f51ca8d9": ""
        }, [ (translating.value) ? (_openBlock(), _createElementBlock("span", {
              key: 0,
              block: "",
              "animate-spin": "",
              "preserve-3d": "",
              "data-v-f51ca8d9": ""
            }, [ _hoisted_1 ])) : (_openBlock(), _createElementBlock("div", {
              key: 1,
              "i-ri:translate": "",
              "data-v-f51ca8d9": ""
            })), _createTextVNode("\n      "), _createTextVNode(_toDisplayString(_unref(translation).visible ? _ctx.$t('menu.show_untranslated') : _ctx.$t('menu.translate_post')), 1 /* TEXT */), _createTextVNode("\n    ") ], 8 /* PROPS */, ["disabled"]) ]))
      : _createCommentVNode("v-if", true)
}
}

})
