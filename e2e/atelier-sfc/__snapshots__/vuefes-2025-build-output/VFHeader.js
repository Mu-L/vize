import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveDynamicComponent as _resolveDynamicComponent, mergeProps as _mergeProps, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { "aria-hidden": "true", class: "language-separator", "data-v-fb343dab": "" }, "\n            /\n          ")
import { NuxtLink } from '#components'
import { useI18n, useLocalePath, useSwitchLocalePath } from '#imports'
import { useAnimationStore } from '~/stores/animation'
import Logo from '~icons/logo/logo'
import AnimationPlay from '~icons/icons/animation-play'
import AnimationPause from '~icons/icons/animation-pause'

export default /*@__PURE__*/_defineComponent({
  __name: 'VFHeader',
  props: {
    isRoot: { type: Boolean as PropType<boolean>, required: false, default: false }
  },
  setup(__props) {

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale, t } = useI18n();
const [animationEnabled, setAnimationEnabled, isWebGLSupported] = useAnimationStore();

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("header", null, [ _createElementVNode("div", {
        class: "header",
        "data-v-fb343dab": ""
      }, [ _createVNode(_resolveDynamicComponent(__props.isRoot ? 'div' : _unref(NuxtLink)), _mergeProps(__props.isRoot ? {} : { to: _unref(localePath)('/'), title: _unref(t)('backTop') }, {
          class: "logo"
        }), {
          default: _withCtx(() => [
            _createVNode(Logo, {
              class: "logo-image",
              "aria-label": _unref(t)('logo.shortAlt'),
              role: "img"
            })
          ]),
          _: 1 /* STABLE */
        }), _createElementVNode("div", {
          class: "header-control",
          "data-v-fb343dab": ""
        }, [ _createElementVNode("nav", null, [ _createVNode(NuxtLink, {
              to: _unref(switchLocalePath)('ja'),
              lang: "ja",
              title: "日本語に切り替え",
              class: _normalizeClass({ active: _unref(locale) === 'ja' })
            }, {
              default: _withCtx(() => [
                _createTextVNode("\n            JA\n          ")
              ]),
              _: 1 /* STABLE */
            }), _hoisted_1, _createVNode(NuxtLink, {
              to: _unref(switchLocalePath)('en'),
              lang: "en",
              title: "Switch to English",
              class: _normalizeClass({ active: _unref(locale) === 'en' })
            }, {
              default: _withCtx(() => [
                _createTextVNode("\n            EN\n          ")
              ]),
              _: 1 /* STABLE */
            }) ]), _createElementVNode("button", {
            type: "button",
            class: "animation-control",
            disabled: !_unref(isWebGLSupported),
            "aria-label": _unref(animationEnabled) ? _ctx.$t('animation.pause') : _ctx.$t('animation.play'),
            onClick: _cache[0] || (_cache[0] = ($event: any) => (_unref(setAnimationEnabled)(!_unref(animationEnabled)))),
            "data-v-fb343dab": ""
          }, [ _createVNode(_resolveDynamicComponent(_unref(animationEnabled) ? AnimationPause : AnimationPlay), {
              "aria-label": _unref(animationEnabled) ? _ctx.$t('animation.pause') : _ctx.$t('animation.play'),
              role: "img"
            }) ], 8 /* PROPS */, ["disabled", "aria-label"]) ]) ]) ]))
}
}

})
