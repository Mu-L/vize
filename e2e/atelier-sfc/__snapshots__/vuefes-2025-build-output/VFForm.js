import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, resolveComponent as _resolveComponent, renderSlot as _renderSlot, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, withCtx as _withCtx } from "vue"


import type * as v from "valibot";
import {
  type FormFieldState,
  type FormSubmitEvent,
  Form as PForm,
} from "@primevue/forms";
import { valibotResolver } from "@primevue/forms/resolvers/valibot";
import { useTemplateRef } from "#imports";

export { type FormSubmitEvent, type FormFieldState } from "@primevue/forms";

export interface FormProps<State extends object> {
  initialValues: State;
  /** @default "blur" */
  validateOn?: "blur" | "submit" | "immediate";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: v.ObjectSchema<any, any> | v.ObjectSchemaAsync<any, any>;
}

export interface FormEmits {
  submit: [FormSubmitEvent];
}

export type FormFieldStates<State extends object> = {
  [key in keyof State]: FormFieldState;
};

export interface FormSlots<State extends object> {
  default: ($form: FormFieldStates<State>) => unknown;
}

export default /*@__PURE__*/_defineComponent({
  __name: 'VFForm',
  setup(__props, { expose: __expose, emit: __emit }) {

const emit = __emit
const form = useTemplateRef("form");
__expose({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentState: () => (form.value as any)?.states as FormFieldStates<State> | undefined,

  setFieldValue: (field: keyof State, value: State[keyof State]) => {
    if (form.value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form.value as any).setFieldValue(field as string, value);
    }
  },
})

return (_ctx: any,_cache: any) => {
  const _component_PForm = _resolveComponent("PForm")

  return (_openBlock(), _createBlock(_component_PForm, {
      ref: form,
      "initial-values": undefined,
      resolver: __props.schema ? _ctx.valibotResolver(__props.schema) : undefined,
      "validate-on-blur": __props.validateOn === 'blur',
      "validate-on-submit": __props.validateOn === 'submit',
      "validate-on-mount": __props.validateOn === 'immediate',
      onSubmit: _cache[0] || (_cache[0] = ($event: any) => (emit('submit', $event)))
    }, {
      default: _withCtx(($form) => [
        _renderSlot(_ctx.$slots, "default", _normalizeProps(_guardReactiveProps($form)))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["initial-values", "resolver", "validate-on-blur", "validate-on-submit", "validate-on-mount"]))
}
}

})
