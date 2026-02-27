import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Teleport as _Teleport, openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, toDisplayString as _toDisplayString, mergeProps as _mergeProps } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'Modal.client',
  props: {
    modalTitle: { type: String as PropType<string>, required: true }
  },
  emits: ["transitioned"],
  setup(__props, { expose: __expose, emit: __emit }) {

const emit = __emit
const props = __props
const dialogRef = useTemplateRef('dialogRef')
const modalTitleId = computed(() => {
  const id = getCurrentInstance()?.attrs.id
  return id ? `${id}-title` : undefined
})
function handleModalClose() {
  dialogRef.value?.close()
}
/**
 * Emits `transitioned` once the dialog has finished its open opacity transition.
 * This is used by consumers that need to run layout-sensitive logic (for example
 * dispatching a resize) only after the modal is fully displayed.
 */
function onDialogTransitionEnd(event: TransitionEvent) {
  const el = dialogRef.value
  if (!el) return
  if (!el.open) return
  if (event.target !== el) return
  if (event.propertyName !== 'opacity') return
  emit('transitioned')
}
__expose({
  showModal: () => dialogRef.value?.showModal(),
  close: () => dialogRef.value?.close(),
})

return (_ctx: any,_cache: any) => {
  const _component_ButtonBase = _resolveComponent("ButtonBase")

  return (_openBlock(), _createBlock(_Teleport, { to: "body" }, [ _createElementVNode("dialog", _mergeProps(_ctx.$attrs, {
        ref: dialogRef,
        closedby: "any",
        class: "w-[calc(100%-2rem)] bg-bg border border-border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto overscroll-contain m-0 m-auto p-6 text-fg focus-visible:outline focus-visible:outline-accent/70",
        "aria-labelledby": modalTitleId.value,
        onTransitionend: onDialogTransitionEnd,
        "data-v-d2401b8f": ""
      }), [ _createTextVNode("\n      "), _createTextVNode("\n      "), _createElementVNode("div", {
          class: "flex items-center justify-between mb-6",
          "data-v-d2401b8f": ""
        }, [ _createElementVNode("h2", {
            id: modalTitleId.value,
            class: "font-mono text-lg font-medium",
            "data-v-d2401b8f": ""
          }, "\n          " + _toDisplayString(__props.modalTitle) + "\n        ", 9 /* TEXT, PROPS */, ["id"]), _createVNode(_component_ButtonBase, {
            type: "button",
            "aria-label": _ctx.$t('common.close'),
            onClick: handleModalClose,
            classicon: "i-lucide:x"
          }) ]), _createTextVNode("\n      "), _createTextVNode("\n      "), _renderSlot(_ctx.$slots, "default") ], 48 /* FULL_PROPS, NEED_HYDRATION */, ["aria-labelledby"]) ]))
}
}

})
