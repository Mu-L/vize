import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, withModifiers as _withModifiers } from "vue"


const _hoisted_1 = { dir: "ltr", "data-v-190c4f39": "" }
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:circle-alert w-4 h-4", "aria-hidden": "true", "data-v-190c4f39": "" })
const _hoisted_3 = { class: "sr-only", "data-v-190c4f39": "" }
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:check w-4 h-4", "aria-hidden": "true", "data-v-190c4f39": "" })
const _hoisted_5 = { class: "sr-only", "data-v-190c4f39": "" }
import type { NpmSearchResult } from '#shared/types/npm-registry'
import type { ColumnConfig, StructuredFilters } from '#shared/types/preferences'

export default /*@__PURE__*/_defineComponent({
  __name: 'TableRow',
  props: {
    result: { type: null as unknown as PropType<NpmSearchResult>, required: true },
    columns: { type: Array as PropType<ColumnConfig[]>, required: true },
    index: { type: Number as PropType<number>, required: false },
    filters: { type: null as unknown as PropType<StructuredFilters>, required: false }
  },
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const pkg = computed(() => props.result.package)
const score = computed(() => props.result.score)
const updatedDate = computed(() => props.result.package.date)
function formatDownloads(count?: number): string {
  if (count === undefined) return '-'
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}
function formatScore(value?: number): string {
  if (value === undefined || value === 0) return '-'
  return Math.round(value * 100).toString()
}
function isColumnVisible(id: string): boolean {
  return props.columns.find(c => c.id === id)?.visible ?? false
}
const packageUrl = computed(() => packageRoute(pkg.value.name))
const allMaintainersText = computed(() => {
  if (!pkg.value.maintainers?.length) return ''
  return pkg.value.maintainers.map(m => m.name || m.email).join(', ')
})

return (_ctx: any,_cache: any) => {
  const _component_NuxtLink = _resolveComponent("NuxtLink")
  const _component_DateTime = _resolveComponent("DateTime")
  const _component_ButtonBase = _resolveComponent("ButtonBase")

  return (_openBlock(), _createElementBlock("tr", {
      class: "group relative scale-100 [clip-path:inset(0)] border-b border-border hover:bg-bg-muted transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-inset focus-visible:outline-none focus:bg-bg-muted",
      tabindex: "0",
      "data-result-index": __props.index,
      "data-v-190c4f39": ""
    }, [ _createTextVNode("\n    "), _createTextVNode("\n    "), _createElementVNode("td", {
        class: "py-2 px-3",
        "data-v-190c4f39": ""
      }, [ _createVNode(_component_NuxtLink, {
          to: packageUrl.value,
          class: "row-link font-mono text-sm text-fg hover:text-accent-fallback transition-colors duration-200",
          dir: "ltr"
        }, {
          default: _withCtx(() => [
            _createTextVNode("\n        "),
            _createTextVNode(_toDisplayString(pkg.value.name), 1 /* TEXT */),
            _createTextVNode("\n      ")
          ]),
          _: 1 /* STABLE */
        }) ]), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('version')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-xs text-fg-subtle",
          "data-v-190c4f39": ""
        }, [ _createElementVNode("span", _hoisted_1, _toDisplayString(pkg.value.version), 1 /* TEXT */) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('description')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 text-sm text-fg-muted max-w-xs truncate",
          "data-v-190c4f39": ""
        }, "\n      " + _toDisplayString(_ctx.decodeHtmlEntities(pkg.value.description || '-')) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('downloads')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-xs text-fg-muted text-end tabular-nums",
          "data-v-190c4f39": ""
        }, "\n      " + _toDisplayString(formatDownloads(__props.result.downloads?.weekly)) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('updated')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-end text-xs text-fg-muted",
          "data-v-190c4f39": ""
        }, [ (updatedDate.value) ? (_openBlock(), _createBlock(_component_DateTime, {
              key: 0,
              datetime: updatedDate.value,
              year: "numeric",
              month: "short",
              day: "numeric"
            })) : (_openBlock(), _createElementBlock("span", {
              key: 1,
              "data-v-190c4f39": ""
            }, "-")) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('maintainers')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 text-sm text-fg-muted text-end",
          "data-v-190c4f39": ""
        }, [ (pkg.value.maintainers?.length) ? (_openBlock(), _createElementBlock("span", {
              key: 0,
              title: pkg.value.maintainers.length > 3 ? allMaintainersText.value : undefined,
              class: _normalizeClass({ 'cursor-help': pkg.value.maintainers.length > 3 }),
              "data-v-190c4f39": ""
            }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pkg.value.maintainers.slice(0, 3), (maintainer, idx) => {
                return (_openBlock(), _createElementBlock(_Fragment, { key: maintainer.username || maintainer.email, "data-v-190c4f39": "" }, [
                  _createVNode(_component_NuxtLink, {
                    to: {
                name: '~username',
                params: { username: maintainer.username || maintainer.name || '' },
              },
                    class: "relative z-10 hover:text-accent-fallback transition-colors duration-200",
                    onClick: _withModifiers(() => {}, ["stop"])
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(_toDisplayString(maintainer.username || maintainer.name || maintainer.email), 1 /* TEXT */)
                    ]),
                    _: 1 /* STABLE */
                  }),
                  (idx < Math.min(pkg.value.maintainers.length, 3) - 1)
                    ? (_openBlock(), _createElementBlock("span", {
                      key: 0,
                      "data-v-190c4f39": ""
                    }, ", "))
                    : _createCommentVNode("v-if", true)
                ], 64 /* STABLE_FRAGMENT */))
              }), 128 /* KEYED_FRAGMENT */)), (pkg.value.maintainers.length > 3) ? (_openBlock(), _createElementBlock("span", {
                  key: 0,
                  class: "text-fg-subtle",
                  "data-v-190c4f39": ""
                }, "\n          +" + _toDisplayString(pkg.value.maintainers.length - 3) + "\n        ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ])) : (_openBlock(), _createElementBlock("span", {
              key: 1,
              class: "text-fg-subtle",
              "data-v-190c4f39": ""
            }, "-")) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('keywords')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 text-end",
          "data-v-190c4f39": ""
        }, [ (pkg.value.keywords?.length) ? (_openBlock(), _createElementBlock("div", {
              key: 0,
              class: "relative z-10 flex flex-wrap gap-1 justify-end",
              "aria-label": _ctx.$t('package.card.keywords'),
              "data-v-190c4f39": ""
            }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(pkg.value.keywords.slice(0, 3), (keyword) => {
                return (_openBlock(), _createBlock(_component_ButtonBase, {
                  key: keyword,
                  size: "small",
                  "aria-pressed": props.filters?.keywords.includes(keyword),
                  title: `Filter by ${keyword}`,
                  onClick: _cache[0] || (_cache[0] = _withModifiers(($event: any) => (emit('clickKeyword', keyword)), ["stop"])),
                  class: _normalizeClass({ 'group-hover:bg-bg-elevated': !props.filters?.keywords.includes(keyword) })
                }, "\n          " + _toDisplayString(keyword) + "\n        ", 11 /* TEXT, CLASS, PROPS */, ["aria-pressed", "title"]))
              }), 128 /* KEYED_FRAGMENT */)), (pkg.value.keywords.length > 3) ? (_openBlock(), _createElementBlock("span", {
                  key: 0,
                  class: "text-fg-subtle text-xs",
                  title: pkg.value.keywords.slice(3).join(', '),
                  "data-v-190c4f39": ""
                }, "\n          +" + _toDisplayString(pkg.value.keywords.length - 3) + "\n        ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ])) : (_openBlock(), _createElementBlock("span", {
              key: 1,
              class: "text-fg-subtle",
              "data-v-190c4f39": ""
            }, "-")) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('qualityScore')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-xs text-fg-muted text-end tabular-nums",
          "data-v-190c4f39": ""
        }, "\n      " + _toDisplayString(formatScore(score.value?.detail?.quality)) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('popularityScore')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-xs text-fg-muted text-end tabular-nums",
          "data-v-190c4f39": ""
        }, "\n      " + _toDisplayString(formatScore(score.value?.detail?.popularity)) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('maintenanceScore')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-xs text-fg-muted text-end tabular-nums",
          "data-v-190c4f39": ""
        }, "\n      " + _toDisplayString(formatScore(score.value?.detail?.maintenance)) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('combinedScore')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3 font-mono text-xs text-fg-muted text-end tabular-nums",
          "data-v-190c4f39": ""
        }, "\n      " + _toDisplayString(formatScore(score.value?.final)) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (isColumnVisible('security')) ? (_openBlock(), _createElementBlock("td", {
          key: 0,
          class: "py-2 px-3",
          "data-v-190c4f39": ""
        }, [ (__props.result.flags?.insecure) ? (_openBlock(), _createElementBlock("span", {
              key: 0,
              class: "text-syntax-kw",
              "data-v-190c4f39": ""
            }, [ _hoisted_2, _createElementVNode("span", _hoisted_3, _toDisplayString(_ctx.$t('filters.table.security_warning')), 1 /* TEXT */) ])) : (__props.result.flags !== undefined) ? (_openBlock(), _createElementBlock("span", {
                key: 1,
                class: "text-provider-nuxt",
                "data-v-190c4f39": ""
              }, [ _hoisted_4, _createElementVNode("span", _hoisted_5, _toDisplayString(_ctx.$t('filters.table.secure')), 1 /* TEXT */) ])) : (_openBlock(), _createElementBlock("span", {
              key: 2,
              class: "text-fg-subtle",
              "data-v-190c4f39": ""
            }, " - ")) ])) : _createCommentVNode("v-if", true) ], 8 /* PROPS */, ["data-result-index"]))
}
}

})
