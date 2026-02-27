import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle } from "vue"

import { computed, useRuntimeConfig } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'OgNameBadge',
  props: {
    name: { type: String as PropType<string>, required: false },
    userRole: { type: String as PropType<"Attendee" | "Attendee+Party" | "Sponsor" | "Speaker" | "Staff">, required: false },
    avatarImageUrl: { type: String as PropType<string>, required: false },
    lang: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const runtimeConfig = useRuntimeConfig();
const variants = computed(() => {
  switch (__props.userRole) {
    case "Attendee+Party":
      return {
        color: "#007f62",
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/name-badge/party.png`,
        nameBadgeBaseImageUrl: `${runtimeConfig.siteUrl}images/name-badge/party.png`,
      };
    case "Sponsor":
      return {
        color: "#f66c21",
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/name-badge/sponsor.png`,
        nameBadgeBaseImageUrl: `${runtimeConfig.siteUrl}images/name-badge/sponsor.png`,
      };
    case "Speaker":
      return {
        color: "#8314d3",
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/name-badge/speaker.png`,
        nameBadgeBaseImageUrl: `${runtimeConfig.siteUrl}images/name-badge/speaker.png`,
      };
    case "Staff":
      return {
        color: "#ffffff",
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/name-badge/staff.png`,
        nameBadgeBaseImageUrl: `${runtimeConfig.siteUrl}images/name-badge/staff.png`,
      };
    case "Attendee":
    default:
      return {
        color: "#385FCC",
        baseImageUrl: `${runtimeConfig.siteUrl}images/og/name-badge/default.png`,
        nameBadgeBaseImageUrl: `${runtimeConfig.siteUrl}images/name-badge/default.png`,
      };
  }
});
const nameTransform = computed(() => {
  // Count full-width characters as 2 and half-width characters as 1
  let weightedLength = 0;
  const nameStr = __props.name ?? "";
  for (const char of nameStr) {
    // Detect full-width characters (Japanese, Chinese, Korean, full-width symbols, etc.)
    if (char.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u)) {
      weightedLength += 2;
    } else {
      weightedLength += 1;
    }
  }

  if (weightedLength <= 12) return `scaleX(1)`;
  if (weightedLength <= 16) return `scaleX(0.95) translateX(-2.5%)`;
  if (weightedLength <= 20) return `scaleX(0.9) translateX(-2.5%)`;
  if (weightedLength <= 24) return `scaleX(0.85) translateX(-2.5%)`;
  if (weightedLength <= 28) return `scaleX(0.8) translateX(-2.5%)`;
  if (weightedLength <= 32) return `scaleX(0.75) translateX(-2.5%)`;
  return `scaleX(0.7) translateX(-2.5%)`;
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
      }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("div", {
        style: _normalizeStyle({
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          right: '8.33333%',
          width: '33.3333%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })
      }, [ _createElementVNode("img", {
          src: variants.value.nameBadgeBaseImageUrl,
          alt: "",
          style: _normalizeStyle({
            width: '100%',
            objectFit: 'contain',
          })
        }, null, 12 /* STYLE, PROPS */, ["src"]) ], 4 /* STYLE */), _createElementVNode("div", {
        id: "name-badge-name",
        style: _normalizeStyle({
          position: 'absolute',
          top: '33.5%',
          left: '60%',
          color: variants.value.color,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          fontFamily: 'JetBrainsMono-Regular, IBMPlexSansJP-Regular',
          transform: nameTransform.value,
          transformOrigin: 'left center',
          whiteSpace: 'nowrap',
        })
      }, "\n      " + _toDisplayString(__props.name) + "\n    ", 5 /* TEXT, STYLE */), (__props.userRole === 'Staff' && __props.lang) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          id: "name-badge-lang",
          style: _normalizeStyle({
          position: 'absolute',
          top: '49%',
          left: '82.5%',
          transform: 'translateX(-50%)',
          color: variants.value.color,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          fontFamily: 'JetBrainsMono-Regular, IBMPlexSansJP-Regular',
        })
        }, "\n      " + _toDisplayString(__props.lang) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createElementVNode("div", {
        id: "name-badge-avatar",
        style: _normalizeStyle({
          position: 'absolute',
          bottom: '14.4%',
          right: '2%',
          transform: 'translateX(-50%)',
          width: '15.4%',
          height: '29.05%',
          borderRadius: '50%',
          overflow: 'hidden',
        })
      }, [ (__props.avatarImageUrl) ? (_openBlock(), _createElementBlock("img", {
            key: 0,
            src: __props.avatarImageUrl,
            alt: "Avatar",
            style: _normalizeStyle({
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            ...(__props.userRole === 'Sponsor'
              ? { objectFit: 'contain', backgroundColor: '#fff' }
              : {}
            ),
          })
          })) : _createCommentVNode("v-if", true) ], 4 /* STYLE */) ], 4 /* STYLE */))
}
}

})
