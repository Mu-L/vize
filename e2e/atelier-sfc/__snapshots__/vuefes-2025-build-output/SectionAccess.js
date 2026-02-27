import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { HOME_HEADING_ID } from '~/constant'
import { useI18n } from '#imports'
import { VFSection, JaAccess, EnAccess } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionAccess',
  setup(__props) {

const { locale, t } = useI18n();

return (_ctx: any,_cache: any) => {
  const _component_VFButton = _resolveComponent("VFButton")

  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).access,
      title: _unref(t)('access.title'),
      class: "section-access"
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaAccess) : _unref(EnAccess))),
        _createElementVNode("div", {
          class: "access-button-container",
          "data-v-1a019a61": ""
        }, [
          _createVNode(_component_VFButton, { link: "https://maps.app.goo.gl/fdVEfMK5KcY33QiXA" }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('access.googleMapLink')), 1 /* TEXT */),
              _createTextVNode("\n      ")
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _createElementVNode("div", {
          class: "access-images-container",
          "data-v-1a019a61": ""
        }, [
          _createElementVNode("img", {
            src: "/images/top/access1.jpg",
            alt: _unref(t)('access.alt1'),
            loading: "lazy",
            "data-v-1a019a61": ""
          }, null, 8 /* PROPS */, ["alt"]),
          _createElementVNode("img", {
            src: "/images/top/access2.jpg",
            alt: _unref(t)('access.alt2'),
            loading: "lazy",
            "data-v-1a019a61": ""
          }, null, 8 /* PROPS */, ["alt"])
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title"]))
}
}

})
