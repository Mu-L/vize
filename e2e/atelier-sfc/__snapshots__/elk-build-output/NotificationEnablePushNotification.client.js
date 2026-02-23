import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, renderSlot as _renderSlot, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, unref as _unref } from "vue"


const _hoisted_1 = { id: "notifications-warning", "text-md": "true", "font-bold": "true", "w-full": "true" }
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { "aria-hidden": "true", "i-ri:close-line": "true" })
const _hoisted_3 = { "xl:hidden": "true" }
const _hoisted_4 = { "xl:hidden": "true" }
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("span", { block: "true", "i-ri:loader-2-fill": "true", "aria-hidden": "true" })
import { useMediaQuery } from '@vueuse/core'

export default /*@__PURE__*/_defineComponent({
  __name: 'NotificationEnablePushNotification.client',
  props: {
    closeableHeader: { type: Boolean as PropType<boolean>, required: false },
    busy: { type: Boolean as PropType<boolean>, required: false },
    animate: { type: Boolean as PropType<boolean>, required: false }
  },
  emits: ["hide", "subscribe"],
  setup(__props, { emit: $emit }) {

const xl = useMediaQuery('(min-width: 1280px)')
const isLegacyAccount = computed(() => !currentUser.value?.vapidKey)

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      flex: "~ col",
      "gap-y-2": "",
      role: "alert",
      "aria-labelledby": "notifications-warning",
      class: _normalizeClass(__props.closeableHeader ? 'border-b border-base' : 'px6 px4')
    }, [ _createElementVNode("header", {
        flex: "",
        "items-center": "",
        "pb-2": ""
      }, [ _createElementVNode("h2", _hoisted_1, "\n        " + _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.enable_title')) + "\n      ", 1 /* TEXT */), (__props.closeableHeader) ? (_openBlock(), _createElementBlock("button", {
            key: 0,
            flex: "",
            "rounded-4": "",
            type: "button",
            title: _ctx.$t('settings.notifications.push_notifications.warning.enable_close'),
            "hover:bg-active": "",
            "cursor-pointer": "",
            "transition-100": "",
            disabled: __props.busy,
            onClick: _cache[0] || (_cache[0] = ($event: any) => (_ctx.$emit('hide')))
          }, [ _hoisted_2 ])) : _createCommentVNode("v-if", true) ]), (__props.closeableHeader) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ _createElementVNode("p", _hoisted_3, "\n        " + _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.enable_description')) + "\n      ", 1 /* TEXT */), _createElementVNode("p", _hoisted_4, "\n        " + _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.enable_description_mobile')) + "\n      ", 1 /* TEXT */), _createElementVNode("p", {
            class: _normalizeClass(_unref(xl) ? null : 'hidden')
          }, "\n        " + _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.enable_description_desktop')) + "\n      ", 3 /* TEXT, CLASS */) ], 64 /* STABLE_FRAGMENT */)) : (_openBlock(), _createElementBlock("p", { key: 1 }, "\n      " + _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.enable_description_settings')) + "\n    ", 1 /* TEXT */)), (isLegacyAccount.value) ? (_openBlock(), _createElementBlock("p", { key: 0 }, "\n      " + _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.re_auth')) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createElementVNode("button", {
        "btn-outline": "",
        "rounded-full": "",
        "font-bold": "",
        py4: "",
        flex: "~ gap2 center",
        m5: "",
        type: "button",
        class: _normalizeClass(__props.busy || isLegacyAccount.value ? 'border-transparent' : null),
        disabled: __props.busy || isLegacyAccount.value,
        onClick: _cache[1] || (_cache[1] = ($event: any) => (_ctx.$emit('subscribe')))
      }, [ (__props.busy && __props.animate) ? (_openBlock(), _createElementBlock("span", {
            key: 0,
            "aria-hidden": "true",
            block: "",
            "animate-spin": "",
            "preserve-3d": ""
          }, [ _hoisted_5 ])) : (_openBlock(), _createElementBlock("span", {
            key: 1,
            "aria-hidden": "true",
            block: "",
            "i-ri:check-line": ""
          })), _createElementVNode("span", null, _toDisplayString(_ctx.$t('settings.notifications.push_notifications.warning.enable_desktop')), 1 /* TEXT */) ], 10 /* CLASS, PROPS */, ["disabled"]), _renderSlot(_ctx.$slots, "error") ], 2 /* CLASS */))
}
}

})
