import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, resolveDynamicComponent as _resolveDynamicComponent, withCtx as _withCtx, unref as _unref } from "vue"

import { useI18n } from '#imports'
import { VFSection, JaStudentSupportClosed, EnStudentSupportClosed } from '#components'
import { HOME_HEADING_ID } from '~/constant'

export default /*@__PURE__*/_defineComponent({
  __name: 'SectionStudentSupport',
  setup(__props) {

const { locale, t } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(VFSection, {
      id: _unref(HOME_HEADING_ID).studentSupport,
      title: _unref(t)('student.title')
    }, {
      default: _withCtx(() => [
        _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaStudentSupportClosed) : _unref(EnStudentSupportClosed)))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id", "title"]))
}
}

})
