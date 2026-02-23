import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createVNode as _createVNode, resolveComponent as _resolveComponent, withCtx as _withCtx } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'TagCardPaginator',
  props: {
    paginator: { type: null as unknown as PropType<mastodon.Paginator<mastodon.v1.Tag[], mastodon.DefaultPaginationParams>>, required: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  const _component_CommonPaginator = _resolveComponent("CommonPaginator")
  const _component_TagCard = _resolveComponent("TagCard")
  const _component_TagCardSkeleton = _resolveComponent("TagCardSkeleton")

  return (_openBlock(), _createBlock(_component_CommonPaginator, {
      paginator: __props.paginator,
      "key-prop": "name"
    }, {
      default: _withCtx(({ item }) => [
        _createVNode(_component_TagCard, {
          tag: item,
          border: "b base"
        })
      ]),
      loading: _withCtx(() => [
        _createVNode(_component_TagCardSkeleton, { border: "b base" }),
        _createVNode(_component_TagCardSkeleton, { border: "b base" }),
        _createVNode(_component_TagCardSkeleton, {
          border: "b base",
          op50: ""
        }),
        _createVNode(_component_TagCardSkeleton, {
          border: "b base",
          op50: ""
        }),
        _createVNode(_component_TagCardSkeleton, {
          border: "b base",
          op25: ""
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["paginator"]))
}
}

})
