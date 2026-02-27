import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, mergeProps as _mergeProps, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("img", { src: "/images/image-preview-placeholder.svg", alt: "", "data-v-f22274a6": "" })
import type { FormFieldState } from '@primevue/forms'
import { FormField } from '@primevue/forms'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { shallowRef, toRaw, useId, watch } from '#imports'

export interface VFFile {
  displayName: string;
  name: string;
  objectURL: string;
  type: string;
}

export default /*@__PURE__*/_defineComponent({
  __name: 'VFFileInput',
  props: {
    formState: { type: null as unknown as PropType<FormFieldState>, required: false },
    name: { type: String as PropType<string>, required: false },
    label: { type: String as PropType<string>, required: false },
    placeholder: { type: String as PropType<string>, required: false },
    description: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const id = useId();
const descriptionId = useId();
const file = shallowRef<VFFile | null>(null);
function handleFileSelect(ev: FileUploadSelectEvent, formState: FormFieldState) {
  file.value = {
    displayName: ev.files[0].name,
    name: ev.files[0].name,
    objectURL: ev.files[0].objectURL,
    type: ev.files[0].type,
  };
  if (formState) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (formState as any).onInput({ value: toRaw(file.value) });
  }
}
watch(() => __props.formState, (v) => {
  if (v?.value) {
    file.value = v.value as VFFile;
  } else {
    file.value = null;
  }
}, { immediate: true, deep: true });

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(FormField, {
      class: "vf-file-input",
      name: __props.name,
      "initial-value": ""
    }, {
      default: _withCtx(($field) => [
        (__props.label)
          ? (_openBlock(), _createElementBlock("label", {
            key: 0,
            for: _unref(id),
            "data-v-f22274a6": ""
          }, _toDisplayString(__props.label), 1 /* TEXT */))
          : _createCommentVNode("v-if", true),
        _createElementVNode("div", {
          class: "file-upload-wrapper",
          "data-v-f22274a6": ""
        }, [
          _createElementVNode("div", {
            class: "image-preview",
            "data-v-f22274a6": ""
          }, [
            (file.value)
              ? (_openBlock(), _createElementBlock("img", {
                key: 0,
                src: file.value.objectURL,
                alt: "Image",
                "data-v-f22274a6": ""
              }))
              : (_openBlock(), _createElementBlock("div", {
                key: 1,
                class: "image-placeholder",
                "data-v-f22274a6": ""
              }, [
                _hoisted_1
              ]))
          ]),
          _createVNode(FileUpload, _mergeProps(_ctx.$attrs, {
            id: _unref(id),
            "aria-describedby": _unref(descriptionId),
            mode: "basic",
            "custom-upload": "",
            auto: "",
            severity: "secondary",
            class: "p-button-outlined",
            accept: "image/*",
            onSelect: _cache[0] || (_cache[0] = ($event: any) => (handleFileSelect($event, _ctx.$field)))
          }), {
            chooseicon: _withCtx(() => [
              _createElementVNode("div", {
                class: "input-box",
                tabindex: "0",
                "data-v-f22274a6": ""
              }, [
                (file.value?.displayName)
                  ? (_openBlock(), _createElementBlock("span", {
                    key: 0,
                    "data-v-f22274a6": ""
                  }, _toDisplayString(file.value.displayName), 1 /* TEXT */))
                  : (_openBlock(), _createElementBlock("span", {
                    key: 1,
                    "data-v-f22274a6": ""
                  }, _toDisplayString(__props.placeholder), 1 /* TEXT */))
              ])
            ]),
            _: 1 /* STABLE */
          })
        ]),
        (__props.description)
          ? (_openBlock(), _createElementBlock("p", {
            key: 0,
            class: "description text-caption",
            "data-v-f22274a6": ""
          }, "\n      " + _toDisplayString(__props.description) + "\n    ", 1 /* TEXT */))
          : _createCommentVNode("v-if", true),
        (__props.formState?.invalid)
          ? (_openBlock(), _createElementBlock("p", {
            key: 0,
            id: _unref(descriptionId),
            class: "error-message text-caption",
            "aria-hidden": __props.formState.valid,
            "data-v-f22274a6": ""
          }, [
            _createElementVNode("span", null, [
              (__props.formState?.invalid)
                ? (_openBlock(), _createElementBlock("span", {
                  key: 0,
                  "data-v-f22274a6": ""
                }, "\n          " + _toDisplayString(__props.formState.error.message) + "\n        ", 1 /* TEXT */))
                : _createCommentVNode("v-if", true)
            ])
          ]))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["name"]))
}
}

})
