import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle } from "vue"

import { useRuntimeConfig, computed } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'OgDefault',
  props: {
    titleJa: { type: String as PropType<string>, required: true },
    titleEn: { type: String as PropType<string>, required: true }
  },
  setup(__props) {

const runtimeConfig = useRuntimeConfig();
const baseImageUrl = computed(() => `${runtimeConfig.siteUrl}images/og/default.png`);
const noiseImageUrl = computed(() => `${runtimeConfig.siteUrl}images/og/noise.png`);

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      style: _normalizeStyle({ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' })
    }, [ _createElementVNode("img", {
        src: baseImageUrl.value,
        alt: "",
        style: _normalizeStyle({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        })
      }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: 0,
          bottom: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          color: '#007f62',
          fontFamily: 'ClashDisplay-Medium, IBMPlexSansJP-SemiBold',
        })
      }, [ _createElementVNode("div", {
          style: _normalizeStyle({
            fontSize: '64px',
          })
        }, "\n        " + _toDisplayString(__props.titleJa) + "\n      ", 5 /* TEXT, STYLE */), _createElementVNode("div", {
          style: _normalizeStyle({
            fontSize: '140px',
          })
        }, "\n        " + _toDisplayString(__props.titleEn) + "\n      ", 5 /* TEXT, STYLE */) ], 4 /* STYLE */), _createElementVNode("img", {
        src: noiseImageUrl.value,
        alt: "",
        style: _normalizeStyle({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          mixBlendMode: 'overlay',
          opacity: 0.075,
        })
      }, null, 12 /* STYLE, PROPS */, ["src"]) ], 4 /* STYLE */))
}
}

})
