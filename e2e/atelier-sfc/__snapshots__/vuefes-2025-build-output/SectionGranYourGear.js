import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { HOME_HEADING_ID } from '~/constant'
import { useI18n, useWithBase } from '#imports'
import { VFSection, JaCheckTheItems, EnCheckTheItems } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionGranYourGear',
  setup(__props) {

const withBase = useWithBase();
const { locale, t } = useI18n();

return (_ctx: any,_cache: any) => {
  const _component_VFButton = _resolveComponent("VFButton")

  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).store,
      title: _unref(t)('store.panel.title'),
      "cover-image": {
        src: _unref(withBase)('/images/top/cover/grab-your-gear.png'),
        alt: _unref(t)('store.coverImageAlt'),
      }
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaCheckTheItems) : _unref(EnCheckTheItems))),
        _createElementVNode("div", {
          class: "button-container",
          "data-v-a9c01bc1": ""
        }, [
          _createVNode(_component_VFButton, { link: "https://vuejs-jp.stores.jp" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('store.preOrder')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title", "cover-image"]))
}
}

})
