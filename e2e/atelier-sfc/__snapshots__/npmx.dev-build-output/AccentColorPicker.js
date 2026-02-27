import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, renderList as _renderList, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle, unref as _unref } from "vue"


const _hoisted_1 = { class: "sr-only", "data-v-6911dde9": "" }
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:ban size-4 text-bg", "aria-hidden": "true", "data-v-6911dde9": "" })
import { useAccentColor } from '~/composables/useSettings'

export default /*@__PURE__*/_defineComponent({
  __name: 'AccentColorPicker',
  setup(__props) {

const { accentColors, selectedAccentColor, setAccentColor } = useAccentColor()
onPrehydrate(el => {
  const settings = JSON.parse(localStorage.getItem('npmx-settings') || '{}')
  const id = settings.accentColorId
  if (id) {
    const input = el.querySelector<HTMLInputElement>(`input[value="${id}"]`)
    if (input) {
      input.checked = true
      input.setAttribute('checked', '')
    }
    // Remove checked from the server-default (clear button, value="")
    const clearInput = el.querySelector<HTMLInputElement>('input[value=""]')
    if (clearInput) {
      clearInput.checked = false
      clearInput.removeAttribute('checked')
    }
  }
})

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("fieldset", {
      class: "flex items-center gap-4 has-[input:focus-visible]:(outline-solid outline-accent/70 outline-offset-4) rounded-xl w-fit",
      "data-v-6911dde9": ""
    }, [ _createElementVNode("legend", _hoisted_1, _toDisplayString(_ctx.$t('settings.accent_colors')), 1 /* TEXT */), (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_unref(accentColors), (color) => {
        return (_openBlock(), _createElementBlock("label", {
          key: color.id,
          class: "size-6 rounded-full transition-transform duration-150 motion-safe:hover:scale-110 has-[:checked]:(ring-2 ring-fg ring-offset-2 ring-offset-bg-subtle) has-[:focus-visible]:(ring-2 ring-fg ring-offset-2 ring-offset-bg-subtle)",
          style: _normalizeStyle({ backgroundColor: `var(--swatch-${color.id})` }),
          "data-v-6911dde9": ""
        }, [
          _createElementVNode("input", {
            type: "radio",
            name: "accent-color",
            class: "sr-only",
            value: color.id,
            checked: _unref(selectedAccentColor) === color.id,
            "aria-label": color.name,
            onChange: _cache[0] || (_cache[0] = ($event: any) => (_unref(setAccentColor)(color.id))),
            "data-v-6911dde9": ""
          }, null, 40 /* PROPS, NEED_HYDRATION */, ["value", "checked", "aria-label"])
        ], 4 /* STYLE */))
      }), 128 /* KEYED_FRAGMENT */)), _createElementVNode("label", {
        class: "size-6 rounded-full transition-transform duration-150 motion-safe:hover:scale-110 has-[:checked]:(ring-2 ring-fg ring-offset-2 ring-offset-bg-subtle) has-[:focus-visible]:(ring-2 ring-fg ring-offset-2 ring-offset-bg-subtle) flex items-center justify-center bg-fg",
        "data-v-6911dde9": ""
      }, [ _createElementVNode("input", {
          type: "radio",
          name: "accent-color",
          class: "sr-only",
          value: "",
          checked: _unref(selectedAccentColor) === null,
          "aria-label": _ctx.$t('settings.clear_accent'),
          onChange: _cache[1] || (_cache[1] = ($event: any) => (_unref(setAccentColor)(null))),
          "data-v-6911dde9": ""
        }, null, 40 /* PROPS, NEED_HYDRATION */, ["checked", "aria-label"]), _hoisted_2 ]) ]))
}
}

})
