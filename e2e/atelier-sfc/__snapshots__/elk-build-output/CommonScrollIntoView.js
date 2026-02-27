import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, resolveDynamicComponent as _resolveDynamicComponent, renderSlot as _renderSlot, withCtx as _withCtx } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'CommonScrollIntoView',
  props: {
    as: { type: String as PropType<string>, required: false, default: 'div' },
    active: { type: Boolean as PropType<boolean>, required: true }
  },
  setup(__props) {

const el = ref()
watch(() => __props.active, (active) => {
  const _el = unrefElement(el)
  if (active && _el)
    _el.scrollIntoView({ block: 'nearest', inline: 'start' })
})

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_resolveDynamicComponent(__props.as), { ref: el }, {
      default: _withCtx(() => [
        _renderSlot(_ctx.$slots, "default")
      ]),
      _: 1 /* STABLE */
    }, 512 /* NEED_PATCH */))
}
}

})
