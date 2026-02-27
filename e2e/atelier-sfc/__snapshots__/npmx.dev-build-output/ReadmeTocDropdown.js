import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, Teleport as _Teleport, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "truncate" }
const _hoisted_2 = { class: "truncate" }
const _hoisted_3 = { class: "truncate" }
import type { TocItem } from '#shared/types/readme'
import { onClickOutside, useEventListener } from '@vueuse/core'

interface TocNode extends TocItem {
  children: TocNode[]
}

export default /*@__PURE__*/_defineComponent({
  __name: 'ReadmeTocDropdown',
  props: {
    toc: { type: Array as PropType<TocItem[]>, required: true },
    activeId: { type: String as PropType<string | null>, required: false }
  },
  setup(__props) {

const props = __props
function buildTocTree(items: TocItem[]): TocNode[] {
  const result: TocNode[] = []
  const stack: TocNode[] = []
  for (const item of items) {
    const node: TocNode = { ...item, children: [] }
    // Find parent: look for the last item with smaller depth
    while (stack.length > 0 && stack[stack.length - 1]!.depth >= item.depth) {
      stack.pop()
    }
    if (stack.length === 0) {
      result.push(node)
    } else {
      stack[stack.length - 1]!.children.push(node)
    }
    stack.push(node)
  }
  return result
}
const tocTree = computed(() => buildTocTree(props.toc))
// Create a map from id to index for efficient lookup
const idToIndex = computed(() => {
  const map = new Map<string, number>()
  props.toc.forEach((item, index) => map.set(item.id, index))
  return map
})
const listRef = useTemplateRef('listRef')
const triggerRef = useTemplateRef('triggerRef')
const isOpen = shallowRef(false)
const highlightedIndex = shallowRef(-1)
const dropdownPosition = shallowRef<{ top: number; right: number } | null>(null)
function getDropdownStyle(): Record<string, string> {
  if (!dropdownPosition.value) return {}
  return {
    top: `${dropdownPosition.value.top}px`,
    right: `${document.documentElement.clientWidth - dropdownPosition.value.right}px`,
  }
}
// Close on scroll (but not when scrolling inside the dropdown)
function handleScroll(event: Event) {
  if (!isOpen.value) return
  if (listRef.value && event.target instanceof Node && listRef.value.contains(event.target)) {
    return
  }
  close()
}
useEventListener('scroll', handleScroll, { passive: true })
// Generate unique ID for accessibility
const inputId = useId()
const listboxId = `${inputId}-toc-listbox`
function toggle() {
  if (isOpen.value) {
    close()
  } else {
    const rect = triggerRef.value?.getBoundingClientRect()
    if (rect) {
      dropdownPosition.value = {
        top: rect.bottom + 4,
        right: rect.right,
      }
    }
    isOpen.value = true
    // Highlight active item if any
    const activeIndex = idToIndex.value.get(props.activeId ?? '')
    highlightedIndex.value = activeIndex ?? 0
  }
}
function close() {
  isOpen.value = false
  highlightedIndex.value = -1
}
function select() {
  close()
  triggerRef.value?.focus()
}
function getIndex(id: string): number {
  return idToIndex.value.get(id) ?? -1
}
// Check for reduced motion preference
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
onClickOutside(listRef, close, { ignore: [triggerRef] })
function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  const itemCount = props.toc.length
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = (highlightedIndex.value + 1) % itemCount
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value =
        highlightedIndex.value <= 0 ? itemCount - 1 : highlightedIndex.value - 1
      break
    case 'Enter': {
      event.preventDefault()
      const item = props.toc[highlightedIndex.value]
      if (item) {
        select()
      }
      break
    }
    case 'Escape':
      close()
      triggerRef.value?.focus()
      break
  }
}

return (_ctx: any,_cache: any) => {
  const _component_ButtonBase = _resolveComponent("ButtonBase")
  const _component_NuxtLink = _resolveComponent("NuxtLink")

  return (_openBlock(), _createElementBlock(_Fragment, null, [ _createVNode(_component_ButtonBase, {
        ref: triggerRef,
        type: "button",
        "aria-expanded": isOpen.value,
        "aria-haspopup": "listbox",
        "aria-label": _ctx.$t('package.readme.toc_title'),
        "aria-controls": _unref(listboxId),
        onClick: toggle,
        onKeydown: handleKeydown,
        classicon: "i-lucide:list",
        class: "px-2.5",
        block: ""
      }, {
        default: _withCtx(() => [
          _createElementVNode("span", {
            class: _normalizeClass(["i-lucide:chevron-down w-3 h-3", [
          { 'rotate-180': isOpen.value },
          _unref(prefersReducedMotion) ? '' : 'transition-transform duration-200',
        ]]),
            "aria-hidden": "true"
          }, null, 2 /* CLASS */)
        ]),
        _: 1 /* STABLE */
      }), _createVNode(_Teleport, { to: "body" }) ], 64 /* STABLE_FRAGMENT */))
}
}

})
