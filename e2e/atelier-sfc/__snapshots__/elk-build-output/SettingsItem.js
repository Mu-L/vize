import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderSlot as _renderSlot, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"


export default /*@__PURE__*/_defineComponent({
  __name: 'SettingsItem',
  props: {
    text: { type: String as PropType<string>, required: false },
    content: { type: String as PropType<string>, required: false },
    description: { type: String as PropType<string>, required: false },
    icon: { type: String as PropType<string>, required: false },
    to: { type: String as PropType<string | Record<string, string>>, required: false },
    command: { type: Boolean as PropType<boolean>, required: false },
    disabled: { type: Boolean as PropType<boolean>, required: false },
    external: { type: Boolean as PropType<true>, required: false },
    large: { type: Boolean as PropType<true>, required: false },
    match: { type: Boolean as PropType<boolean>, required: false },
    target: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const router = useRouter()
const scrollOnClick = computed(() => __props.to && !(__props.target === '_blank' || __props.external))
useCommand({
  scope: 'Settings',
  name: () => __props.text
    ?? (__props.to
      ? typeof __props.to === 'string'
        ? __props.to
        : __props.to.name
      : ''
    ),
  description: () => __props.description,
  icon: () => __props.icon || '',
  visible: () => __props.command && __props.to,
  onActivate() {
    router.push(to!)
  },
})

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createBlock(_component_NuxtLink, {
      disabled: __props.disabled,
      to: __props.to,
      external: __props.external,
      target: __props.target,
      "exact-active-class": "text-primary",
      class: _normalizeClass(__props.disabled ? 'op25 pointer-events-none ' : __props.match ? 'text-primary' : ''),
      block: "",
      "w-full": "",
      group: "",
      "focus:outline-none": "",
      tabindex: __props.disabled ? -1 : undefined,
      onClick: _cache[0] || (_cache[0] = ($event: any) => (scrollOnClick.value ? _ctx.$scrollToTop() : undefined))
    }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          "w-full": "",
          flex: "",
          px5: "",
          py3: "",
          "md:gap2": "",
          gap4: "",
          "items-center": "",
          "transition-250": "",
          "group-hover:bg-active": "",
          "group-focus-visible:ring": "2 current"
        }, [
          _createElementVNode("div", {
            "flex-1": "",
            flex: "",
            "items-center": "",
            "md:gap2": "",
            gap4: ""
          }, [
            (_ctx.$slots.icon || __props.icon)
              ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                flex: "",
                "items-center": "",
                "justify-center": "",
                "flex-shrink-0": "",
                class: _normalizeClass(_ctx.$slots.description ? 'w-12 h-12' : '')
              }, [
                _renderSlot(_ctx.$slots, "icon", {}, () => [
                  (__props.icon)
                    ? (_openBlock(), _createElementBlock("div", {
                      key: 0,
                      class: _normalizeClass([__props.icon, __props.large ? 'text-xl mr-1' : 'text-xl md:text-size-inherit'])
                    }))
                    : _createCommentVNode("v-if", true)
                ])
              ]))
              : _createCommentVNode("v-if", true),
            _createElementVNode("div", { flex: "~ col gap-0.5" }, [
              _createElementVNode("p", null, [
                _renderSlot(_ctx.$slots, "default", {}, () => [
                  _createElementVNode("span", null, _toDisplayString(__props.text), 1 /* TEXT */)
                ])
              ]),
              (_ctx.$slots.description || __props.description)
                ? (_openBlock(), _createElementBlock("p", {
                  key: 0,
                  "text-sm": "",
                  "text-secondary": ""
                }, [
                  _renderSlot(_ctx.$slots, "description", {}, () => [
                    _createTextVNode("\n              "),
                    _toDisplayString(__props.description),
                    _createTextVNode("\n            ")
                  ])
                ]))
                : _createCommentVNode("v-if", true)
            ])
          ]),
          (_ctx.$slots.content || __props.content)
            ? (_openBlock(), _createElementBlock("p", {
              key: 0,
              "text-sm": "",
              "text-secondary": ""
            }, [
              _renderSlot(_ctx.$slots, "content", {}, () => [
                _createTextVNode("\n          "),
                _toDisplayString(__props.content),
                _createTextVNode("\n        ")
              ])
            ]))
            : _createCommentVNode("v-if", true),
          (__props.to)
            ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              class: _normalizeClass(["rtl-flip", !__props.external ? 'i-ri:arrow-right-s-line' : 'i-ri:external-link-line']),
              "text-xl": "",
              "text-secondary-light": ""
            }))
            : _createCommentVNode("v-if", true)
        ])
      ]),
      _: 1 /* STABLE */
    }, 10 /* CLASS, PROPS */, ["disabled", "to", "external", "target", "tabindex"]))
}
}

})
