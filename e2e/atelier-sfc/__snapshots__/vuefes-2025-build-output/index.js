import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveDynamicComponent as _resolveDynamicComponent, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"

import { VFButton, VFHeading, JaTokusho, EnTokusho } from '#components'
import { defineRouteRules, useI18n, useHead, useSeoMeta, useLocalePath, useRuntimeConfig, defineOgImage } from '#imports'

export default /*@__PURE__*/_defineComponent({
  __name: 'index',
  setup(__props) {

defineRouteRules({ prerender: true });
const runtimeConfig = useRuntimeConfig();
const { locale, t } = useI18n();
const localePath = useLocalePath();
defineOgImage({
  url: `${runtimeConfig.public.siteUrl}images/og/tokusho.png`,
});
useSeoMeta({
  title: t("transactions"),
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("section", {
      class: "tokusho",
      "data-v-b8d37852": ""
    }, [ _createElementVNode("div", {
        class: _normalizeClass(["tokusho-content", { 'lang-en': _unref(locale) === 'en' }]),
        "data-v-b8d37852": ""
      }, [ _createVNode(VFHeading, {
          nth: 1,
          class: "heading"
        }, {
          default: _withCtx(() => [
            _createTextVNode("\n        "),
            _createTextVNode(_toDisplayString(_unref(t)("transactions")), 1 /* TEXT */),
            _createTextVNode("\n      ")
          ]),
          _: 1 /* STABLE */
        }), _createVNode(_resolveDynamicComponent(_unref(locale) === 'ja' ? _unref(JaTokusho) : _unref(EnTokusho))), _createElementVNode("div", {
          class: "back-top-button",
          "data-v-b8d37852": ""
        }, [ _createVNode(VFButton, {
            outlined: "",
            link: _unref(localePath)('/')
          }, {
            default: _withCtx(() => [
              _createTextVNode("\n          "),
              _createTextVNode(_toDisplayString(_unref(t)("backTop")), 1 /* TEXT */),
              _createTextVNode("\n        ")
            ]),
            _: 1 /* STABLE */
          }) ]) ], 2 /* CLASS */) ]))
}
}

})
