import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, mergeProps as _mergeProps, unref as _unref } from "vue"

import InputText from 'primevue/inputtext'
import { useId } from 'vue'
import type { FormFieldState } from './VFForm.vue'
import { useI18n } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFInput',
  props: {
    formState: { type: null as unknown as PropType<FormFieldState>, required: false },
    description: { type: String as PropType<string>, required: false }
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
          "data-v-d2039ff3": ""
        }, _toDisplayString(_ctx.$attrs.label), 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createVNode(InputText, _mergeProps(_ctx.$attrs, {
        id: _unref(id),
        "aria-describedby": _unref(descriptionId),
        class: {
          invalid: __props.formState?.invalid,
        }
      })), (__props.description) ? (_openBlock(), _createElementBlock("p", {
          key: 0,
          class: "description text-caption",
          "data-v-d2039ff3": ""
        }, "\n      " + _toDisplayString(__props.description) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (__props.formState?.invalid) ? (_openBlock(), _createElementBlock("p", {
          key: 0,
          id: _unref(descriptionId),
          class: "error-message text-caption",
          "aria-hidden": __props.formState.valid,
          "data-v-d2039ff3": ""
        }, [ (__props.formState?.invalid) ? (_openBlock(), _createElementBlock("span", {
              key: 0,
              "data-v-d2039ff3": ""
            }, "\n        " + "\n        " + _toDisplayString(__props.formState.error?.message) + "\n      ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ])) : _createCommentVNode("v-if", true) ]))
}
}

})
