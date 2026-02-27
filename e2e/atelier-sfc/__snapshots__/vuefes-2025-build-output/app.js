import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, resolveComponent as _resolveComponent, withCtx as _withCtx } from "vue"

import '~/assets/styles/main.css'
import { useAutoThemeChanger } from './stores/animation'
import { useI18n, useHead, useSeoMeta, defineOgImage } from '#imports'
import { NuxtPage, NuxtRouteAnnouncer } from '#components'
const ogImage = "https://vuefes.jp/2025/og-image.png";

export default /*@__PURE__*/_defineComponent({
  __name: 'app',
  setup(__props) {

const { t } = useI18n();
// NOTE: use getter to handle locale changes
const title = () => `${t("nuxtSiteConfig.name")} %separator %s`;
const description = () => t("nuxtSiteConfig.description");
defineOgImage({ component: "root", url: ogImage });
useHead({ templateParams: { separator: "-" } });
useSeoMeta({
  titleTemplate: title,
  ogTitle: title,
  description,
  ogDescription: description,
});
useAutoThemeChanger();

return (_ctx: any,_cache: any) => {
  const _component_NuxtLayout = _resolveComponent("NuxtLayout")

  return (_openBlock(), _createElementBlock(_Fragment, null, [ _createVNode(NuxtRouteAnnouncer), _createVNode(_component_NuxtLayout, null, {
        default: _withCtx(() => [
          _createVNode(NuxtPage)
        ]),
        _: 1 /* STABLE */
      }) ], 64 /* STABLE_FRAGMENT */))
}
}

})
