import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle } from "vue"

import { computed, useRuntimeConfig } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'OgSponsor',
  props: {
    name: { type: String as PropType<string>, required: true },
    logoImageUrl: { type: String as PropType<string>, required: true },
    plan: { type: String as PropType<"PLATINA" | "GOLD" | "SILVER" | "BRONZE" | "OPTION_ONLY" | "CREATIVE">, required: false, default: "OPTION_ONLY" }
  },
  setup(__props) {

const planName = computed(() => {
  return __props.plan === "OPTION_ONLY" ? "OPTION" : __props.plan;
});
const runtimeConfig = useRuntimeConfig();
const logoImageFullUrl = computed(() => `${runtimeConfig.siteUrl}${__props.logoImageUrl.startsWith("/") ? __props.logoImageUrl.slice(1) : __props.logoImageUrl}`);
const SPONSOR_TAG_STYLE_BASE = {
  alignItems: "center",
  padding: "15px 25px",
};
const variants = computed(() => {
  switch (planName.value) {
    case "PLATINA":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/purple.png`,
        baseColor: "#8314d3",
        subColor: "#d0edf2",
        sponsorTagStyle: {
          ...SPONSOR_TAG_STYLE_BASE,
          background: "linear-gradient(270deg, #EEEEEE 0%, #C6C6C6 25%, #EEEEEE 50%, #EEEEEE 75%, #C6C6C6 100%)",
        },
      };
    case "GOLD":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/default.png`,
        baseColor: "#007f62",
        subColor: "#fae8e4",
        sponsorTagStyle: {
          ...SPONSOR_TAG_STYLE_BASE,
          background: "#DBD69A",
        },
      };
    case "SILVER":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/orange.png`,
        baseColor: "#f66c21",
        subColor: "#def7d1",
        sponsorTagStyle: {
          ...SPONSOR_TAG_STYLE_BASE,
          background: "#E2E4EC",
        },
      };
    case "BRONZE":
    default:
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/navy.png`,
        baseColor: "#385FCC",
        subColor: "#ffdaff",
        sponsorTagStyle: {
          ...SPONSOR_TAG_STYLE_BASE,
          background: "#DDA25B",
        },
      };
    case "OPTION":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/orange.png`,
        baseColor: "#f66c21",
        subColor: "#def7d1",
        sponsorTagStyle: {
          ...SPONSOR_TAG_STYLE_BASE,
          background: "#E2E4EC",
        },
      };
    case "CREATIVE":
      return {
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/speaker-or-sponsor/default.png`,
        baseColor: "#007f62",
        subColor: "#fae8e4",
        sponsorTagStyle: {
          ...SPONSOR_TAG_STYLE_BASE,
          background: "#DBD69A",
        },
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
          zIndex: -1,
        })
      }, null, 12 /* STYLE, PROPS */, ["src"]), _createTextVNode("\n\n    "), _createTextVNode("\n    "), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          width: '50%',
          backgroundColor: 'white',
          zIndex: 1,
        })
      }, null, 4 /* STYLE */), _createElementVNode("img", {
        src: logoImageFullUrl.value,
        alt: "Sponsor Logo",
        style: _normalizeStyle({
          position: 'absolute',
          width: '50%',
          top: '50%',
          left: '75%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        })
      }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '50%',
          padding: '20px',
          textAlign: 'center',
          boxSizing: 'border-box',
          color: variants.value.subColor,
          backgroundColor: variants.value.baseColor,
          fontSize: '32px',
          fontWeight: 'bold',
          zIndex: 3,
        })
      }, [ _createElementVNode("div", {
          style: _normalizeStyle({
            margin: '0 auto',
            fontFamily: 'JetBrainsMono-Regular, IBMPlexSansJP-Regular',
          })
        }, "\n        " + _toDisplayString(__props.name) + "\n      ", 5 /* TEXT, STYLE */) ], 4 /* STYLE */), _createTextVNode("\n\n    "), _createTextVNode("\n    "), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          top: '0',
          right: '0',
          color: '#3c576f',
          fontWeight: 'bold',
          fontSize: '30px',
          zIndex: 4,
          fontFamily: 'JetBrainsMono-Regular, IBMPlexSansJP-Regular',
          ...variants.value.sponsorTagStyle,
        })
      }, "\n      " + "\n      " + _toDisplayString(planName.value.charAt(0).toUpperCase() + planName.value.slice(1).toLowerCase()) + " Sponsor\n    ", 5 /* TEXT, STYLE */) ], 4 /* STYLE */))
}
}

})
