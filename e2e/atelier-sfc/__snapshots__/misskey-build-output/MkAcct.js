import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, unref as _unref } from "vue"

import * as Misskey from 'misskey-js'
import { toUnicode } from 'punycode.js'
import { host as hostRaw } from '@@/js/config.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkAcct',
  props: {
    user: { type: null as unknown as PropType<Misskey.entities.UserLite>, required: true },
    detail: { type: Boolean as PropType<boolean>, required: false }
  },
  setup(__props) {

const host = toUnicode(hostRaw);

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("span", null, [ _createElementVNode("span", null, "@" + _toDisplayString(__props.user.username), 1 /* TEXT */), (__props.user.host || __props.detail) ? (_openBlock(), _createElementBlock("span", {
          key: 0,
          style: "opacity: 0.5;"
        }, "@" + _toDisplayString(__props.user.host || _unref(host)), 1 /* TEXT */)) : _createCommentVNode("v-if", true) ]))
}
}

})
