import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"

import { useLocaleRoute } from '@typed-router'
import { HOME_HEADING_ID } from '~/constant'
import { useBreakpoint, useI18n, useWithBase } from '#imports'
import { VFSection, JaGetYourTicket, EnGetYourTicket } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionGetYourTicket',
  setup(__props) {

const bp = useBreakpoint();
const withBase = useWithBase();
const { locale, t } = useI18n();
const localeRoute = useLocaleRoute();

return (_ctx: any,_cache: any) => {
  const _component_VFButton = _resolveComponent("VFButton")

  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).ticket,
      title: _unref(t)('ticket.title'),
      "cover-image": {
        src: _unref(bp) === 'pc'
          ? _unref(withBase)('/images/top/cover/get-your-ticket-pc.png')
          : _unref(withBase)('/images/top/cover/get-your-ticket-sp.png'),
        alt: _unref(t)('ticket.coverImageAlt'),
      }
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaGetYourTicket) : _unref(EnGetYourTicket))),
        _createElementVNode("div", {
          class: "button-container",
          "data-v-52de2e2a": ""
        }, [
          _createVNode(_component_VFButton, { link: _unref(localeRoute)('/ticket') }, {
            default: _withCtx(() => [
              _createTextVNode("\n        "),
              _createTextVNode(_toDisplayString(_unref(t)('ticket.viewTicketDetails')), 1 /* TEXT */),
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
