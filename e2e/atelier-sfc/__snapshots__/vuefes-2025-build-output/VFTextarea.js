import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, mergeProps as _mergeProps, unref as _unref } from "vue"

import Textarea from 'primevue/textarea'
import { useId } from 'vue'
import type { FormFieldState } from './VFForm.vue'
import { useI18n } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFTextarea',
  props: {
    formState: { type: null as unknown as PropType<FormFieldState>, required: false }
  },
  setup(__props) {

const id = useId();
const descriptionId = useId();
const { locale: lang } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", null, [ _createTextVNode("\n    "), _createTextVNode("\n    "), (_ctx.$attrs.label) ? (_openBlock(), _createElementBlock("label", {
          key: 0,
          for: _unref(id),
          lang: undefined,
          "data-v-889ab427": ""
        }, _toDisplayString(_ctx.$attrs.label), 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createVNode(Textarea, _mergeProps(_ctx.$attrs, {
        id: _unref(id),
        "aria-describedby": _unref(descriptionId),
        class: { 'has-form-state': __props.formState, 'invalid': __props.formState?.invalid },
        rows: "6"
      })), (__props.formState?.invalid) ? (_openBlock(), _createElementBlock("p", {
          key: 0,
          id: _unref(descriptionId),
          "aria-hidden": __props.formState.valid,
          class: "error-message text-caption",
          "data-v-889ab427": ""
        }, [ (__props.formState?.invalid) ? (_openBlock(), _createElementBlock("span", {
              key: 0,
              "data-v-889ab427": ""
            }, "\n        " + _toDisplayString(__props.formState.error.message) + "\n      ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ])) : _createCommentVNode("v-if", true) ]))
}
}

})
