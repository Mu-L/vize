import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, normalizeStyle as _normalizeStyle, withCtx as _withCtx } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("source", { srcset: "/images/main-visual.webp", type: "image/webp", "data-v-1a54de74": "" })
import { ref } from 'vue'
import MainVisualWebGL from './MainVisualWebGL.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'MainVisualGraphic',
  props: {
    appearance: { type: String as PropType<"webgl" | "svg" | "png">, required: false, default: "webgl" },
    animation: { type: Boolean as PropType<boolean>, required: false, default: true }
  },
  setup(__props) {

const showFallback = ref(true);
const webGLLoaded = ref(false);
const handleWebGLInitialized = () => {
  webGLLoaded.value = true;
  setTimeout(() => {
    showFallback.value = false;
  }, 100);
};

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_Transition, { mode: "out-in" }, {
      default: _withCtx(() => [
        (__props.appearance === 'webgl')
          ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "main-visual-graphic-wrapper",
            "data-v-1a54de74": ""
          }, [
            _createVNode(MainVisualWebGL, {
              animation: __props._animation,
              style: _normalizeStyle({
            opacity: webGLLoaded.value ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          }),
              onInitialized: handleWebGLInitialized
            }),
            (showFallback.value)
              ? (_openBlock(), _createElementBlock("img", {
                key: 0,
                style: _normalizeStyle({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: webGLLoaded.value ? 0 : 1,
            transition: 'opacity 0.3s ease-out',
          }),
                src: "/images/main-visual.png",
                alt: _ctx.$t('mainVisual.imageAlt'),
                "data-v-1a54de74": ""
              }))
              : _createCommentVNode("v-if", true)
          ]))
          : (__props.appearance === 'png')
            ? (_openBlock(), _createElementBlock("div", {
              key: 1,
              class: "main-visual-graphic-wrapper",
              "data-v-1a54de74": ""
            }, [
              _createElementVNode("picture", null, [
                _hoisted_1,
                _createElementVNode("img", {
                  src: "/images/main-visual.png",
                  alt: _ctx.$t('mainVisual.imageAlt'),
                  "data-v-1a54de74": ""
                }, null, 8 /* PROPS */, ["alt"])
              ])
            ]))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }))
}
}

})
