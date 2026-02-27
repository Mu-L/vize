import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { useTemplateRef, ref } from 'vue'
import * as Misskey from 'misskey-js'
import MkModalWindow from '@/components/MkModalWindow.vue'
import MkTextarea from '@/components/MkTextarea.vue'
import MkDriveFileThumbnail from '@/components/MkDriveFileThumbnail.vue'
import { i18n } from '@/i18n.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkFileCaptionEditWindow',
  props: {
    file: { type: null as unknown as PropType<Misskey.entities.DriveFile | null>, required: false },
    default: { type: String as PropType<string | null>, required: false }
  },
  emits: ["done", "closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const dialog = useTemplateRef('dialog');
const caption = ref(props.default ?? '');
async function ok() {
	emit('done', caption.value);
	dialog.value?.close();
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkModalWindow, {
      ref: dialog,
      width: 400,
      height: 450,
      withOkButton: true,
      okButtonDisabled: false,
      onOk: _cache[0] || (_cache[0] = ($event: any) => (ok())),
      onClose: _cache[1] || (_cache[1] = ($event: any) => (_unref(dialog)?.close())),
      onClosed: _cache[2] || (_cache[2] = ($event: any) => (emit('closed')))
    }, {
      header: _withCtx(() => [
        _createTextVNode(_toDisplayString(_unref(i18n).ts.describeFile), 1 /* TEXT */)
      ]),
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: "_spacer",
          style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;"
        }, [
          (__props.file)
            ? (_openBlock(), _createBlock(MkDriveFileThumbnail, {
              key: 0,
              file: __props.file,
              fit: "contain",
              style: "height: 100px; margin-bottom: 16px;"
            }))
            : _createCommentVNode("v-if", true),
          _createVNode(MkTextarea, {
            autofocus: "",
            placeholder: _unref(i18n).ts.inputNewDescription,
            modelValue: caption.value,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((caption).value = $event))
          }, {
            label: _withCtx(() => [
              _createTextVNode(_toDisplayString(_unref(i18n).ts.caption), 1 /* TEXT */)
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["width", "height", "withOkButton", "okButtonDisabled"]))
}
}

})
