import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "truncate" }
const _hoisted_2 = { class: "truncate" }
import type { PackageFileTree } from '#shared/types'
import type { RouteLocationRaw } from 'vue-router'
import type { RouteNamedMap } from 'vue-router/auto-routes'
import { ADDITIONAL_ICONS, getFileIcon } from '~/utils/file-icons'

export default /*@__PURE__*/_defineComponent({
  __name: 'FileTree',
  props: {
    tree: { type: Array as PropType<PackageFileTree[]>, required: true },
    currentPath: { type: String as PropType<string>, required: true },
    baseUrl: { type: String as PropType<string>, required: true },
    baseRoute: { type: null as unknown as PropType<Pick<RouteNamedMap['code'], 'params'>>, required: true },
    depth: { type: Number as PropType<number>, required: false }
  },
  setup(__props) {

const props = __props
const depth = computed(() => props.depth ?? 0)
// Check if a node or any of its children is currently selected
function isNodeActive(node: PackageFileTree): boolean {
  if (props.currentPath === node.path) return true
  if (props.currentPath.startsWith(node.path + '/')) return true
  return false
}
// Build route object for a file path
function getFileRoute(nodePath: string): RouteLocationRaw {
  return {
    name: 'code',
    params: {
      org: props.baseRoute.params.org,
      packageName: props.baseRoute.params.packageName,
      version: props.baseRoute.params.version,
      filePath: nodePath ?? '',
    },
  }
}
const { toggleDir, isExpanded, autoExpandAncestors } = useFileTreeState(props.baseUrl)
// Auto-expand directories in the current path
watch(
  () => props.currentPath,
  path => {
    if (path) {
      autoExpandAncestors(path)
    }
  },
  { immediate: true },
)

return (_ctx: any,_cache: any) => {
  const _component_ButtonBase = _resolveComponent("ButtonBase")
  const _component_CodeFileTree = _resolveComponent("CodeFileTree")
  const _component_LinkBase = _resolveComponent("LinkBase")

  return (_openBlock(), _createElementBlock("ul", {
      class: _normalizeClass(["list-none m-0 p-0", depth.value === 0 ? 'py-2' : ''])
    }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.tree, (node) => {
        return (_openBlock(), _createElementBlock("li", { key: node.path }, [
          _createTextVNode("\n      "),
          _createTextVNode("\n      "),
          (node.type === 'directory')
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
              _createVNode(_component_ButtonBase, {
                class: "w-full justify-start! rounded-none! border-none!",
                block: "",
                "aria-pressed": isNodeActive(node),
                style: _normalizeStyle({ paddingLeft: `${depth.value * 12 + 12}px` }),
                onClick: _cache[0] || (_cache[0] = ($event: any) => (_unref(toggleDir)(node.path))),
                classicon: _unref(isExpanded)(node.path) ? 'i-lucide:chevron-down' : 'i-lucide:chevron-right'
              }, {
                default: _withCtx(() => [
                  _createElementVNode("svg", {
                    class: _normalizeClass(["size-[1em] me-1 shrink-0", _unref(isExpanded)(node.path) ? 'text-yellow-500' : 'text-yellow-600']),
                    viewBox: "0 0 16 16",
                    fill: "currentColor",
                    "aria-hidden": "true"
                  }, [
                    _createElementVNode("use", { href: `/file-tree-sprite.svg#${_unref(isExpanded)(node.path) ? _unref(ADDITIONAL_ICONS)['folder-open'] : _unref(ADDITIONAL_ICONS)['folder']}` }, null, 8 /* PROPS */, ["href"])
                  ], 2 /* CLASS */),
                  _createElementVNode("span", _hoisted_1, _toDisplayString(node.name), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              (_unref(isExpanded)(node.path) && node.children)
                ? (_openBlock(), _createBlock(_component_CodeFileTree, {
                  key: 0,
                  tree: node.children,
                  "current-path": __props.currentPath,
                  "base-url": __props.baseUrl,
                  "base-route": __props.baseRoute,
                  depth: depth.value + 1
                }))
                : _createCommentVNode("v-if", true)
            ], 64 /* STABLE_FRAGMENT */))
            : (_openBlock(), _createBlock(_component_LinkBase, {
              key: 1,
              variant: "button-secondary",
              to: getFileRoute(node.path),
              "aria-current": __props.currentPath === node.path,
              class: "w-full justify-start! rounded-none! border-none!",
              block: "",
              style: _normalizeStyle({ paddingLeft: `${depth.value * 12 + 32}px` })
            }, {
              default: _withCtx(() => [
                _createElementVNode("svg", {
                  class: "size-[1em] me-1 shrink-0",
                  viewBox: "0 0 16 16",
                  fill: "currentColor",
                  "aria-hidden": "true"
                }, [
                  _createElementVNode("use", { href: `/file-tree-sprite.svg#${_unref(getFileIcon)(node.name)}` }, null, 8 /* PROPS */, ["href"])
                ]),
                _createElementVNode("span", _hoisted_2, _toDisplayString(node.name), 1 /* TEXT */)
              ]),
              _: 1 /* STABLE */
            })),
          _createTextVNode("\n\n      "),
          _createTextVNode("\n      ")
        ]))
      }), 128 /* KEYED_FRAGMENT */)) ], 2 /* CLASS */))
}
}

})
