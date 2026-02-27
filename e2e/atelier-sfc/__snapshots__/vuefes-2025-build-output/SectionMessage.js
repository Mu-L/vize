import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, resolveDynamicComponent as _resolveDynamicComponent, withCtx as _withCtx, unref as _unref } from "vue"

import { HOME_HEADING_ID } from '~/constant'
import { useBreakpoint, useI18n, useWithBase } from '#imports'
import { VFSection, JaMessage, EnMessage } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionMessage',
  setup(__props) {

const bp = useBreakpoint();
const withBase = useWithBase();
const { locale, t } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).message,
      title: _unref(t)('message'),
      "cover-image": {
        src: _unref(bp) === 'pc'
          ? _unref(withBase)('/images/top/cover/message-pc.png')
          : _unref(withBase)('/images/top/cover/message-sp.png'),
        alt: _unref(t)('messageCoverImageAlt'),
      }
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaMessage) : _unref(EnMessage)))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title", "cover-image"]))
}
}

})
