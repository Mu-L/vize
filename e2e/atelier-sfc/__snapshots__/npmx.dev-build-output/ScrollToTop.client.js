import { defineComponent as _defineComponent } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:arrow-up w-5 h-5", "aria-hidden": "true", "data-v-155e1102": "" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:arrow-up w-5 h-5", "aria-hidden": "true", "data-v-155e1102": "" })
const scrollThreshold = 300

export default /*@__PURE__*/_defineComponent({
  __name: 'ScrollToTop.client',
  setup(__props) {

const route = useRoute()
// Pages where scroll-to-top should NOT be shown
const excludedRoutes = new Set(['index', 'code'])
const isActive = computed(() => !excludedRoutes.has(route.name as string))
const isMounted = useMounted()
const isVisible = shallowRef(false)
const { isSupported: supportsScrollStateQueries } = useCssSupports(
  'container-type',
  'scroll-state',
  { ssrValue: false },
)
function onScroll() {
  if (!supportsScrollStateQueries.value) {
    return
  }
  isVisible.value = window.scrollY > scrollThreshold
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
useEventListener('scroll', onScroll, { passive: true })
onMounted(() => {
  onScroll()
})

return (_ctx: any,_cache: any) => {
  return (isActive.value && _unref(supportsScrollStateQueries))
      ? (_openBlock(), _createElementBlock("button", {
        key: 0,
        type: "button",
        class: "scroll-to-top-css fixed bottom-4 inset-ie-4 z-50 w-12 h-12 bg-bg-elevated border border-border rounded-full shadow-lg md:hidden flex items-center justify-center text-fg-muted hover:text-fg transition-colors active:scale-95",
        "aria-label": _ctx.$t('common.scroll_to_top'),
        onClick: scrollToTop,
        "data-v-155e1102": ""
      }, [ _hoisted_1 ]))
      : (_openBlock(), _createBlock(_Transition, {
        key: 1,
        "enter-active-class": "transition-all duration-200",
        "enter-from-class": "opacity-0 translate-y-2",
        "enter-to-class": "opacity-100 translate-y-0",
        "leave-active-class": "transition-all duration-200",
        "leave-from-class": "opacity-100 translate-y-0",
        "leave-to-class": "opacity-0 translate-y-2"
      }, {
        default: _withCtx(() => [
          (isActive.value && _unref(isMounted) && isVisible.value)
            ? (_openBlock(), _createElementBlock("button", {
              key: 0,
              type: "button",
              class: "fixed bottom-4 inset-ie-4 z-50 w-12 h-12 bg-bg-elevated border border-border rounded-full shadow-lg md:hidden flex items-center justify-center text-fg-muted hover:text-fg transition-colors active:scale-95",
              "aria-label": _ctx.$t('common.scroll_to_top'),
              onClick: scrollToTop,
              "data-v-155e1102": ""
            }, [
              _hoisted_2
            ]))
            : _createCommentVNode("v-if", true)
        ]),
        _: 1 /* STABLE */
      }))
}
}

})
