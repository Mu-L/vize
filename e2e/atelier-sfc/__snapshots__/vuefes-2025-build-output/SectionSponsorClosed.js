import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, resolveDynamicComponent as _resolveDynamicComponent, withCtx as _withCtx, unref as _unref } from "vue"

import { HOME_HEADING_ID } from '~/constant'
import { useI18n } from '#imports'
import { VFSection, JaSponsorClosed, EnSponsorClosed } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionSponsorClosed',
  setup(__props) {

const { locale, t } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).sponsorClosed,
      title: _unref(t)('sponsorClosed')
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaSponsorClosed) : _unref(EnSponsorClosed)))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title"]))
}
}

})
