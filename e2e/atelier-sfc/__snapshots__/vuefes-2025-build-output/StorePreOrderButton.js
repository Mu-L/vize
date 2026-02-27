import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { useI18n } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'StorePreOrderButton',
  setup(__props) {

const { t } = useI18n();

return (_ctx: any,_cache: any) => {
  const _component_VFButton = _resolveComponent("VFButton")

  return (_openBlock(), _createBlock(_component_VFButton, {
      link: "https://vuejs-jp.stores.jp",
      external: "",
      class: "vf-button"
    }, {
      default: _withCtx(() => [
        _createTextVNode("\r\n    "),
        _createTextVNode(_toDisplayString(_unref(t)('store.preOrder')), 1 /* TEXT */),
        _createTextVNode("\r\n  ")
      ]),
      _: 1 /* STABLE */
    }))
}
}

})
