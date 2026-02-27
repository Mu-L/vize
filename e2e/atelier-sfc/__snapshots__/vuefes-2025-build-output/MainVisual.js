import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveDynamicComponent as _resolveDynamicComponent, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "Vue Fes")
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "Japan 2025")
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "ビューフェス")
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "ジャパン2025")
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "Otemachi")
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "Place Hall & Conference")
const _hoisted_7 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "大手町")
const _hoisted_8 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "プレイス ホール &")
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("span", { "data-v-74861f33": "" }, "カンファレンス")
import MainVisualGraphic from './MainVisualGraphic.vue'
import { useI18n } from '#imports'
import { VFScrollAttention } from '#components'

export default /*@__PURE__*/_defineComponent({
  __name: 'MainVisual',
  props: {
    titleTag: { type: String as PropType<"h1" | "div">, required: false, default: "h1" },
    animation: { type: Boolean as PropType<boolean>, required: false, default: true },
    showScrollAttention: { type: Boolean as PropType<boolean>, required: false, default: false }
  },
  setup(__props) {

const { locale } = useI18n();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("section", {
      class: "main-visual",
      "data-v-74861f33": ""
    }, [ _createVNode(_resolveDynamicComponent(__props.titleTag), { class: "main-visual-head" }, {
        default: _withCtx(() => [
          _createElementVNode("span", {
            class: "site-title site-title-en",
            lang: "en",
            "aria-hidden": _unref(locale) !== 'en',
            "data-v-74861f33": ""
          }, [
            _hoisted_1,
            _hoisted_2
          ], 8 /* PROPS */, ["aria-hidden"]),
          _createElementVNode("span", {
            class: "site-title site-title-ja",
            lang: "ja",
            "aria-hidden": _unref(locale) !== 'ja',
            "data-v-74861f33": ""
          }, [
            _hoisted_3,
            _hoisted_4
          ], 8 /* PROPS */, ["aria-hidden"])
        ]),
        _: 1 /* STABLE */
      }), _createElementVNode("div", {
        class: "main-visual-body",
        "data-v-74861f33": ""
      }, [ _createElementVNode("time", {
          datetime: "2025-10-25",
          lang: "en",
          "aria-hidden": _unref(locale) !== 'en',
          "data-v-74861f33": ""
        }, "OCTOBER 25, 2025", 8 /* PROPS */, ["aria-hidden"]), _createVNode(MainVisualGraphic, {
          appearance: __props.animation ? 'webgl' : 'png',
          class: "main-visual-graphic"
        }), _createElementVNode("time", {
          datetime: "2025-10-25",
          lang: "ja",
          "aria-hidden": _unref(locale) !== 'ja',
          "data-v-74861f33": ""
        }, "2025年10月25日", 8 /* PROPS */, ["aria-hidden"]) ]), _createElementVNode("div", {
        class: "main-visual-foot",
        "data-v-74861f33": ""
      }, [ _createElementVNode("div", {
          lang: "en",
          "aria-hidden": _unref(locale) !== 'en',
          "data-v-74861f33": ""
        }, [ _hoisted_5, _hoisted_6 ], 8 /* PROPS */, ["aria-hidden"]), _createElementVNode("div", {
          lang: "ja",
          "aria-hidden": _unref(locale) !== 'ja',
          "data-v-74861f33": ""
        }, [ _hoisted_7, _hoisted_8, _hoisted_9 ], 8 /* PROPS */, ["aria-hidden"]) ]), (__props.showScrollAttention) ? (_openBlock(), _createBlock(VFScrollAttention, { key: 0 })) : _createCommentVNode("v-if", true) ]))
}
}

})
