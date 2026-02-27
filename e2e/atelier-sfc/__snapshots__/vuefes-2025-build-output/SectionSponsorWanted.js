import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, resolveDynamicComponent as _resolveDynamicComponent, withCtx as _withCtx, unref as _unref } from "vue"

import { HOME_HEADING_ID } from '~/constant'
import { useBreakpoint, useI18n, useWithBase } from '#imports'
import { VFSection, JaSponsorWanted, EnSponsorWanted } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionSponsorWanted',
  setup(__props) {

const bp = useBreakpoint();
const withBase = useWithBase();
const { locale, t } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).sponsorWanted,
      title: _unref(t)('sponsorWanted'),
      "cover-image": {
        src: _unref(bp) === 'pc'
          ? _unref(withBase)('/images/top/cover/sponsor-wanted-pc.svg')
          : _unref(withBase)('/images/top/cover/sponsor-wanted-sp.svg'),
        alt: _unref(t)('sponsorWantedCoverImageAlt'),
      }
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaSponsorWanted) : _unref(EnSponsorWanted)))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title", "cover-image"]))
}
}

})
