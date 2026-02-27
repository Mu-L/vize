import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import * as v from 'valibot'
import { HOME_HEADING_ID } from '~/constant'
import { reactive, useI18n, useRuntimeConfig } from '#imports'
import { VFSection, VFButton } from '#components'
import { type FormSubmitEvent, VFForm, VFInput, VFTextarea } from '~/components/form'
import VFToast, { useToast } from '~/components/toast/VFToast.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionContact',
  setup(__props) {

const { t } = useI18n();
const config = useRuntimeConfig();
const toast = useToast();
const schema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty(t("validation.required", { target: t("contactForm.formFields.name.label") })),
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty(t("validation.required", { target: t("contactForm.formFields.email.label") })),
    v.email(t("validation.email")),
  ),
  content: v.pipe(
    v.string(),
    v.nonEmpty(t("validation.required", { target: t("contactForm.formFields.content.label") })),
  ),
});
const state = reactive<v.InferOutput<typeof schema>>({
  name: "",
  email: "",
  content: "",
});
async function submit(event: FormSubmitEvent) {
  if (event.valid) {
    const formData = new FormData();
    Object.entries(event.states).forEach(([name, { value }]) => {
      formData.append(name, value);
    });
    try {
      await fetch(config.public.contactFormEndpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      event.reset();
      toast.open({
        type: "success",
        message: t("contactForm.successMessage"),
      });
    }
    catch (error) {
      console.error(error);
      toast.open({
        type: "alert",
        message: t("contactForm.errorMessage"),
      });
    }
  }
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).contact,
      title: _unref(t)('contactForm.title')
    }, {
      default: _withCtx(() => [
        _createElementVNode("p", null, _toDisplayString(_unref(t)("contactForm.description")), 1 /* TEXT */),
        _createVNode(VFForm, {
          "initial-values": state,
          schema: _unref(schema),
          onSubmit: submit
        }, {
          default: _withCtx(($form) => [
            _createElementVNode("div", {
              class: "contact-form-items",
              "data-v-d447762c": ""
            }, [
              _createVNode(VFInput, {
                name: "name",
                required: "",
                label: _unref(t)('contactForm.formFields.name.label'),
                placeholder: _unref(t)('contactForm.formFields.name.placeholder'),
                "form-state": $form.name
              }),
              _createVNode(VFInput, {
                name: "email",
                required: "",
                label: _unref(t)('contactForm.formFields.email.label'),
                placeholder: _unref(t)('contactForm.formFields.email.placeholder'),
                "form-state": $form.email
              }),
              _createTextVNode("\n          "),
              _createTextVNode("\n          "),
              _createVNode(VFTextarea, {
                name: "content",
                required: "",
                label: _unref(t)('contactForm.formFields.content.label'),
                placeholder: _unref(t)('contactForm.formFields.content.placeholder'),
                "form-state": $form.content
              })
            ]),
            _createVNode(VFButton, {
              type: "submit",
              class: "submit-button",
              disabled: 
              !(
                $form.name?.touched
                && $form.name?.valid
                && $form.email?.touched
                && $form.email?.valid
                && $form.content?.touched
                && $form.content?.valid
              )
          
            }, {
              default: _withCtx(() => [
                _createTextVNode("\n          "),
                _createTextVNode(_toDisplayString(_unref(t)("contactForm.formFields.submit.label")), 1 /* TEXT */),
                _createTextVNode("\n        ")
              ]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        }),
        _createVNode(VFToast, { state: _unref(toast).state.value })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title"]))
}
}

})
