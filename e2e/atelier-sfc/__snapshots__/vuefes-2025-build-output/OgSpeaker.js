import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle } from "vue"

import { computed, useRuntimeConfig } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'OgSpeaker',
  props: {
    name: { type: String as PropType<string>, required: true },
    avatarUrl: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<"default" | "purple" | "orange" | "navy">, required: true },
    speakerTitle: { type: String as PropType<string>, required: false },
    affiliation: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const runtimeConfig = useRuntimeConfig();
const avatarImageFullUrl = computed(() => `${runtimeConfig.siteUrl}${__props.avatarUrl.startsWith("/") ? __props.avatarUrl.slice(1) : __props.avatarUrl}`);
const description = computed(() => __props.speakerTitle || __props.affiliation);
const variants = computed(() => {
  switch (__props.color) {
    case "purple":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/purple.png`,
        baseColor: "#8314d3",
        subColor: "#d0edf2",
      };
    case "orange":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/orange.png`,
        baseColor: "#f66c21",
        subColor: "#def7d1",
      };
    case "navy":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/navy.png`,
        baseColor: "#385FCC",
        subColor: "#ffdaff",
      };
    case "default":
    default:
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/default.png`,
        baseColor: "#007f62",
        subColor: "#fae8e4",
      };
  }
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      style: _normalizeStyle({ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' })
    }, [ _createElementVNode("img", {
        src: variants.value.baseImageUrl,
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
      }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("img", {
        src: avatarImageFullUrl.value,
        alt: "",
        style: _normalizeStyle({
          position: 'absolute',
          width: '50%',
          top: '50%',
          left: '75%',
          objectFit: 'cover',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
        })
      }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          top: 0,
          right: 0,
          fontSize: '30px',
          backgroundColor: variants.value.baseColor,
          color: variants.value.subColor,
          fontFamily: 'JetBrainsMono-Regular, IBMPlexSansJP-Regular',
          padding: '20px',
        })
      }, "\n      " + "\n      " + _toDisplayString("Speaker") + "\n    ", 5 /* TEXT, STYLE */), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          fontSize: '40px',
          backgroundColor: variants.value.subColor,
          color: variants.value.baseColor,
          fontFamily: 'JetBrainsMono-Regular, IBMPlexSansJP-Regular',
          lineHeight: '90%',
          padding: '25px 45px',
          borderRadius: '125px',
        })
      }, "\n      " + "\n      " + _toDisplayString(__props.name) + "\n    ", 5 /* TEXT, STYLE */), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          bottom: '0',
          right: '0',
          textAlign: 'right',
          padding: '20px',
          boxSizing: 'border-box',
          color: variants.value.subColor,
          backgroundColor: variants.value.baseColor,
          fontSize: '22px',
          fontWeight: 'bold',
        })
      }, [ _createElementVNode("div", {
          style: _normalizeStyle({
            margin: '0 auto',
            fontFamily: 'IBMPlexSansJP-Regular, JetBrainsMono-Regular',
          })
        }, "\n        " + _toDisplayString(description.value) + "\n      ", 5 /* TEXT, STYLE */) ], 4 /* STYLE */) ], 4 /* STYLE */))
}
}

})
