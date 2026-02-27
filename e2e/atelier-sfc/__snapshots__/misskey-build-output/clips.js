import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"

import { computed, markRaw } from 'vue'
import * as Misskey from 'misskey-js'
import MkPagination from '@/components/MkPagination.vue'
import { Paginator } from '@/utility/paginator.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'clips',
  props: {
    user: { type: null as unknown as PropType<Misskey.entities.User>, required: true }
  },
  setup(__props) {

const props = __props
const paginator = markRaw(new Paginator('users/clips', {
	limit: 20,
	computedParams: computed(() => ({
		userId: props.user.id,
	})),
}));

return (_ctx: any,_cache: any) => {
  const _component_MkA = _resolveComponent("MkA")

  return (_openBlock(), _createElementBlock("div", {
      class: "_spacer",
      style: "--MI_SPACER-w: 700px;"
    }, [ _createElementVNode("div", null, [ _createVNode(MkPagination, {
          paginator: _unref(paginator),
          withControl: ""
        }, {
          default: _withCtx(({items}) => [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items, (item) => {
              return (_openBlock(), _createBlock(_component_MkA, {
                key: item.id,
                to: `/clips/${item.id}`,
                class: _normalizeClass(_ctx.$style.item),
                class: "_panel _margin"
              }, [
                _createElementVNode("b", null, _toDisplayString(item.name), 1 /* TEXT */),
                (item.description)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    class: _normalizeClass(_ctx.$style.description)
                  }, _toDisplayString(item.description), 1 /* TEXT */))
                  : _createCommentVNode("v-if", true)
              ], 10 /* CLASS, PROPS */, ["to"]))
            }), 128 /* KEYED_FRAGMENT */))
          ]),
          _: 1 /* STABLE */
        }) ]) ]))
}
}

})
