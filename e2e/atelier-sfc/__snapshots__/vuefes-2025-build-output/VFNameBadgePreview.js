import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, withModifiers as _withModifiers, withKeys as _withKeys } from "vue"

import { computed, onMounted, ref, useTemplateRef, watchEffect } from 'vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFNameBadgePreview',
  props: {
    userRole: { type: String as PropType<"Attendee" | "Attendee+Party" | "Sponsor" | "Speaker" | "Staff">, required: true },
    name: { type: String as PropType<string>, required: true },
    avatarImageUrl: { type: String as PropType<string>, required: false },
    lang: { type: String as PropType<string>, required: false },
    width: { type: String as PropType<string>, required: false },
    height: { type: String as PropType<string>, required: false },
    aspectRatio: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const variants = computed(() => {
  switch (__props.userRole) {
    case "Attendee+Party":
      return {
        color: "#007f62",
        baseImageUrl: "/images/name-badge/party.png",
        avatarPlaceholderImageUrl: "/images/name-badge/party-avatar.png",
      };
    case "Sponsor":
      return {
        color: "#f66c21",
        baseImageUrl: "/images/name-badge/sponsor.png",
        avatarPlaceholderImageUrl: "/images/name-badge/sponsor-avatar.png",
      };
    case "Speaker":
      return {
        color: "#8314d3",
        baseImageUrl: "/images/name-badge/speaker.png",
        avatarPlaceholderImageUrl: "/images/name-badge/speaker-avatar.png",
      };
    case "Staff":
      return {
        color: "#ffffff",
        baseImageUrl: "/images/name-badge/staff.png",
        avatarPlaceholderImageUrl: "/images/name-badge/staff-avatar.png",
      };
    case "Attendee":
    default:
      return {
        color: "#385FCC",
        baseImageUrl: "/images/name-badge/default.png",
        avatarPlaceholderImageUrl: "/images/name-badge/default-avatar.png",
      };
  }
});
const nameScaleX = computed(() => {
  // Count full-width characters as 2, half-width characters as 1
  let weightedLength = 0;
  for (const char of __props.name ?? "") {
    // Check for full-width characters (Japanese, Chinese, Korean, full-width symbols, etc.)
    if (char.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u)) {
      weightedLength += 2;
    } else {
      weightedLength += 1;
    }
  }

  if (weightedLength <= 12) return 1;
  if (weightedLength <= 16) return 0.9;
  if (weightedLength <= 20) return 0.85;
  if (weightedLength <= 24) return 0.8;
  if (weightedLength <= 28) return 0.7;
  if (weightedLength <= 32) return 0.6;
  return 0.5;
});
// const isSafari = ref(false);
const isTouchDevice = ref(false);
const isFocused = ref(false);
const isHovering = ref(false);
const cardOuter = useTemplateRef<HTMLElement | null>("cardOuter");
const cardWrapper = useTemplateRef<HTMLElement | null>("cardWrapper");
function focus() {
  if (isTouchDevice.value) return;
  isFocused.value = true;
}
function unfocus() {
  if (isTouchDevice.value) return;
  isFocused.value = false;
}
const ratioX = ref(0);
const ratioY = ref(0);
const posX = ref(0);
const posY = ref(0);
const mx = ref(0);
const my = ref(0);
const rx = ref(0);
const ry = ref(0);
function reset() {
  ratioX.value = 0;
  ratioY.value = 0;
  posX.value = 0;
  posY.value = 0;
  mx.value = 0;
}
onMounted(() => {
  // isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (window.matchMedia("(hover: none)").matches) {
    isTouchDevice.value = true;
  }
  // const backface = cardWrapper.querySelector(".card-face-back") as HTMLElement;
  // const rotationDegree = 0;
  watchEffect(() => {
    if (!cardWrapper.value) return;
    if (isFocused.value) {
      cardWrapper.value.classList.add("focused");
    } else {
      cardWrapper.value.classList.remove("focused");
    }
  });
  cardOuter.value!.addEventListener("pointerleave", () => {
    if (isFocused.value) return;
    isHovering.value = false;
    reset();
  });
  cardOuter.value!.addEventListener("pointermove", (event) => {
    if (isTouchDevice.value) return;
    if (!cardWrapper.value) return;
    isHovering.value = true;
    const { x, y } = event as PointerEvent;
    const bounds = cardWrapper.value.getBoundingClientRect();
    const pointerX = x - bounds.x;
    const pointerY = y - bounds.y;
    ratioX.value = pointerX / bounds.width;
    ratioY.value = pointerY / bounds.height;
    posX.value = 50 + (ratioX.value - 0.5) * 28;
    posY.value = 50 + (ratioY.value - 0.5) * 28;
    mx.value = ratioX.value * 100;
    my.value = ratioY.value * 100;
    rx.value = (ratioX.value - 0.5) * -30;
    ry.value = (ratioY.value - 0.5) * 50;
  });
  // Zoom
  cardWrapper.value!.addEventListener("click", () => {
    if (isTouchDevice.value) return;
    if (isFocused.value) {
      unfocus();
    } else {
      focus();
    }
    // cardWrapper.classList.add("flip-start");
    // Hide highlight for 1.2 seconds
    // const highlight = cardWrapper.querySelector(".highlight") as HTMLElement;
    // const emboss = cardWrapper.querySelector(".emboss") as HTMLElement;
    // if (highlight) {
    //   highlight.style.opacity = "0";
    //   emboss.style.opacity = "0";
    //   setTimeout(() => {
    //     highlight.style.opacity = "";
    //     emboss.style.opacity = "";
    //   }, 1200);
    // }
    // // flip with gradually slower speed
    // const delays = [0, 500];
    // const flipWithDelay = (index: number) => {
    //   if (index >= delays.length) {
    //     setTimeout(() => {
    //       cardWrapper.classList.remove("flip-start");
    //     }, 800); // Wait a bit after the last flip
    //     return;
    //   }
    //   setTimeout(() => {
    //     rotationDegree += 180;
    //     cardWrapper.style.setProperty("--rotation", `${rotationDegree}deg`);
    //     backface.style.setProperty("--rotation", `${rotationDegree}deg`);
    //     flipWithDelay(index + 1);
    //   }, delays[index]);
    // };
    // flipWithDelay(0);
  });
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [ _createElementVNode("div", {
        class: _normalizeClass(["name-badge-preview-background", { focused: isFocused.value }]),
        onClick: unfocus,
        onKeydown: _withKeys(_withModifiers(unfocus, ["prevent"]), ["esc"]),
        "data-v-31a73177": ""
      }, null, 34 /* CLASS, NEED_HYDRATION */), _createElementVNode("div", {
        ref: cardOuter,
        class: _normalizeClass(["name-badge-preview-outer", { focused: isFocused.value }]),
        "data-v-31a73177": ""
      }, [ _createElementVNode("div", {
          class: _normalizeClass(["name-badge-preview", { focused: isFocused.value }]),
          "data-v-31a73177": ""
        }, [ _createElementVNode("div", {
            ref: cardWrapper,
            class: _normalizeClass(["base-name-badge-wrapper", { hovering: isHovering.value || isFocused.value }]),
            style: _normalizeStyle({
            width: __props.width,
            height: __props.height,
            aspectRatio: __props.aspectRatio,
            '--ratio-x': ratioX.value,
            '--ratio-y': ratioY.value,
            '--posx': `${posX.value}%`,
            '--posy': `${posY.value}%`,
            '--mx': `${mx.value}%`,
            '--my': `${my.value}%`,
            '--rx': `${rx.value}deg`,
            '--ry': `${ry.value}deg`,
          }),
            "data-v-31a73177": ""
          }, [ _createElementVNode("img", {
              src: variants.value.baseImageUrl,
              alt: "Name Badge Preview",
              class: "base-name-badge card-face card-face-front",
              style: _normalizeStyle({
              width: __props.width,
              height: __props.height,
              aspectRatio: __props.aspectRatio,
              backfaceVisibility: 'hidden',
            }),
              "data-v-31a73177": ""
            }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("div", {
              class: "card-face highlight",
              style: _normalizeStyle({ width: __props.width, height: __props.height, aspectRatio: __props.aspectRatio }),
              "data-v-31a73177": ""
            }, null, 4 /* STYLE */), _createElementVNode("div", {
              class: "card-face emboss",
              style: _normalizeStyle({ width: __props.width, height: __props.height, aspectRatio: __props.aspectRatio }),
              "data-v-31a73177": ""
            }, null, 4 /* STYLE */), _createElementVNode("div", {
              class: "card-face card-face-back",
              style: _normalizeStyle({ width: __props.width, height: __props.height, aspectRatio: __props.aspectRatio }),
              "data-v-31a73177": ""
            }, null, 4 /* STYLE */), _createElementVNode("img", {
              id: "avatar-image",
              src: __props.avatarImageUrl ?? variants.value.avatarPlaceholderImageUrl,
              alt: "avatar",
              style: _normalizeStyle({
              ...(__props.userRole === 'Sponsor'
                ? { objectFit: 'contain', backgroundColor: '#fff' }
                : {}
              ),
            }),
              "data-v-31a73177": ""
            }, null, 12 /* STYLE, PROPS */, ["src"]), _createElementVNode("div", {
              id: "name-badge-name",
              style: _normalizeStyle({ color: variants.value.color, transform: `scaleX(${nameScaleX.value})` }),
              "data-v-31a73177": ""
            }, "\n          " + _toDisplayString(__props.name) + "\n        ", 5 /* TEXT, STYLE */), (__props.userRole==='Staff' && __props.lang) ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                id: "name-badge-lang",
                style: _normalizeStyle({ color: variants.value.color }),
                "data-v-31a73177": ""
              }, "\n          " + _toDisplayString(__props.lang) + "\n        ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ], 6 /* CLASS, STYLE */) ], 2 /* CLASS */) ], 2 /* CLASS */) ], 64 /* STABLE_FRAGMENT */))
}
}

})
