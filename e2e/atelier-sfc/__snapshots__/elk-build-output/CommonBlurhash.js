import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, resolveComponent as _resolveComponent, mergeProps as _mergeProps } from "vue"


export default /*@__PURE__*/Object.assign({
  inheritAttrs: false,
}, {
  __name: 'CommonBlurhash',
  props: {
    blurhash: { type: String as PropType<string>, required: false, default: '' },
    src: { type: String as PropType<string>, required: true },
    srcset: { type: String as PropType<string>, required: false },
    shouldLoadImage: { type: Boolean as PropType<boolean>, required: false, default: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  const _component_UnLazyImage = _resolveComponent("UnLazyImage")

  return (_openBlock(), _createBlock(_component_UnLazyImage, _mergeProps(_ctx.$attrs, {
      blurhash: __props.blurhash,
      src: __props.src,
      "src-set": __props.srcset,
      "lazy-load": __props.shouldLoadImage,
      "auto-sizes": ""
    }), null, 16 /* FULL_PROPS */, ["blurhash", "src", "src-set", "lazy-load"]))
}
}

})
