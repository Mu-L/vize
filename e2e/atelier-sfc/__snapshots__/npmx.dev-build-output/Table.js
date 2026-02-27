import { useModel as _useModel } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withModifiers as _withModifiers, withKeys as _withKeys } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-32 bg-bg-muted rounded animate-pulse" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-12 bg-bg-muted rounded animate-pulse" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-48 bg-bg-muted rounded animate-pulse" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-16 bg-bg-muted rounded animate-pulse ms-auto" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-20 bg-bg-muted rounded animate-pulse ms-auto" })
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-24 bg-bg-muted rounded animate-pulse ms-auto" })
const _hoisted_7 = /*#__PURE__*/ _createElementVNode("div", { class: "h-4 w-32 bg-bg-muted rounded animate-pulse ms-auto" })
import type { NpmSearchResult } from '#shared/types/npm-registry'
import type { ColumnConfig, ColumnId, SortKey, SortOption, StructuredFilters } from '#shared/types/preferences'
import { buildSortOption, parseSortOption, toggleDirection } from '#shared/types/preferences'

export default /*@__PURE__*/_defineComponent({
  __name: 'Table',
  props: {
    results: { type: Array as PropType<NpmSearchResult[]>, required: true },
    columns: { type: Array as PropType<ColumnConfig[]>, required: true },
    filters: { type: null as unknown as PropType<StructuredFilters>, required: false },
    isLoading: { type: Boolean as PropType<boolean>, required: false },
    "sortOption": {}
  },
  emits: ["update:sortOption"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const sortOption = _useModel(__props, "sortOption")
const { t } = useI18n()
function isColumnVisible(id: string): boolean {
  return props.columns.find(c => c.id === id)?.visible ?? false
}
function isSortable(id: string): boolean {
  return props.columns.find(c => c.id === id)?.sortable ?? false
}
// Map column id to sort key
const columnToSortKey: Record<string, SortKey> = {
  name: 'name',
  downloads: 'downloads-week',
  updated: 'updated',
  qualityScore: 'quality',
  popularityScore: 'popularity',
  maintenanceScore: 'maintenance',
  combinedScore: 'score',
}
// Default direction for each column
const columnDefaultDirection: Record<string, 'asc' | 'desc'> = {
  name: 'asc',
  downloads: 'desc',
  updated: 'desc',
  qualityScore: 'desc',
  popularityScore: 'desc',
  maintenanceScore: 'desc',
  combinedScore: 'desc',
}
function isColumnSorted(id: string): boolean {
  const option = sortOption.value
  if (!option) return false
  const { key } = parseSortOption(option)
  return key === columnToSortKey[id]
}
function getSortDirection(id: string): 'asc' | 'desc' | null {
  const option = sortOption.value
  if (!option) return null
  if (!isColumnSorted(id)) return null
  const { direction } = parseSortOption(option)
  return direction
}
function toggleSort(id: string) {
  if (!isSortable(id)) return
  const sortKey = columnToSortKey[id]
  if (!sortKey) return
  const isSorted = isColumnSorted(id)
  if (!isSorted) {
    // First click - use default direction
    const defaultDir = columnDefaultDirection[id] ?? 'desc'
    sortOption.value = buildSortOption(sortKey, defaultDir)
  } else {
    // Toggle direction
    const currentDir = getSortDirection(id) ?? 'desc'
    sortOption.value = buildSortOption(sortKey, toggleDirection(currentDir))
  }
}
// Map column IDs to i18n keys
const columnLabels = computed(() => ({
  name: t('filters.columns.name'),
  version: t('filters.columns.version'),
  description: t('filters.columns.description'),
  downloads: t('filters.columns.downloads'),
  updated: t('filters.columns.published'),
  maintainers: t('filters.columns.maintainers'),
  keywords: t('filters.columns.keywords'),
  qualityScore: t('filters.columns.quality_score'),
  popularityScore: t('filters.columns.popularity_score'),
  maintenanceScore: t('filters.columns.maintenance_score'),
  combinedScore: t('filters.columns.combined_score'),
  security: t('filters.columns.security'),
}))
function getColumnLabel(id: ColumnId): string {
  return columnLabels.value[id]
}

return (_ctx: any,_cache: any) => {
  const _component_PackageTableRow = _resolveComponent("PackageTableRow")

  return (_openBlock(), _createElementBlock("div", { class: "overflow-x-auto" }, [ _createElementVNode("table", { class: "w-full text-start" }, [ _createElementVNode("thead", { class: "border-b border-border" }, [ _createElementVNode("tr", null, [ _createTextVNode("\n          "), _createTextVNode("\n          "), _createElementVNode("th", {
              scope: "col",
              class: _normalizeClass(["py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-inset focus-visible:outline-none", {
                'hover:text-fg transition-colors duration-200': isSortable('name'),
              }]),
              "aria-sort": 
                isColumnSorted('name')
                  ? getSortDirection('name') === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              ,
              tabindex: isSortable('name') ? 0 : undefined,
              role: "columnheader",
              onClick: _cache[0] || (_cache[0] = ($event: any) => (toggleSort('name'))),
              onKeydown: [_withKeys(($event: any) => (toggleSort('name')), ["enter"]), _withKeys(_withModifiers(($event: any) => (toggleSort('name')), ["prevent"]), ["space"])]
            }, [ _createElementVNode("span", { class: "inline-flex items-center gap-1" }, [ _createTextVNode("\n              "), _createTextVNode(_toDisplayString(getColumnLabel('name')), 1 /* TEXT */), _createTextVNode("\n              "), (isSortable('name')) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ (isColumnSorted('name')) ? (_openBlock(), _createElementBlock("span", {
                        key: 0,
                        class: _normalizeClass(["i-lucide:chevron-down w-3 h-3", getSortDirection('name') === 'asc' ? 'rotate-180' : '']),
                        "aria-hidden": "true"
                      })) : (_openBlock(), _createElementBlock("span", {
                        key: 1,
                        class: "i-lucide:chevrons-up-down w-3 h-3 opacity-30",
                        "aria-hidden": "true"
                      })) ], 64 /* STABLE_FRAGMENT */)) : _createCommentVNode("v-if", true) ]) ], 42 /* CLASS, PROPS, NEED_HYDRATION */, ["aria-sort", "tabindex"]), (isColumnVisible('version')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none"
              }, "\n            " + _toDisplayString(getColumnLabel('version')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('description')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none"
              }, "\n            " + _toDisplayString(getColumnLabel('description')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('downloads')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: _normalizeClass(["py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-inset focus-visible:outline-none", {
                'hover:text-fg transition-colors duration-200': isSortable('downloads'),
              }]),
                "aria-sort": 
                isColumnSorted('downloads')
                  ? getSortDirection('downloads') === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              ,
                tabindex: isSortable('downloads') ? 0 : undefined,
                role: "columnheader",
                onClick: _cache[1] || (_cache[1] = ($event: any) => (toggleSort('downloads'))),
                onKeydown: _cache[2] || (_cache[2] = _withKeys(($event: any) => (toggleSort('downloads')), ["enter"]))
              }, [ _createElementVNode("span", { class: "inline-flex items-center gap-1 justify-end" }, [ _createTextVNode("\n              "), _createTextVNode(_toDisplayString(getColumnLabel('downloads')), 1 /* TEXT */), _createTextVNode("\n              "), (isSortable('downloads')) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ (isColumnSorted('downloads')) ? (_openBlock(), _createElementBlock("span", {
                          key: 0,
                          class: _normalizeClass(["i-lucide:chevron-down w-3 h-3", getSortDirection('downloads') === 'asc' ? 'rotate-180' : '']),
                          "aria-hidden": "true"
                        })) : (_openBlock(), _createElementBlock("span", {
                          key: 1,
                          class: "i-lucide:chevrons-up-down w-3 h-3 opacity-30",
                          "aria-hidden": "true"
                        })) ], 64 /* STABLE_FRAGMENT */)) : _createCommentVNode("v-if", true) ]) ])) : _createCommentVNode("v-if", true), (isColumnVisible('updated')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: _normalizeClass(["py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-inset focus-visible:outline-none", {
                'hover:text-fg transition-colors duration-200': isSortable('updated'),
              }]),
                "aria-sort": 
                isColumnSorted('updated')
                  ? getSortDirection('updated') === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              ,
                tabindex: isSortable('updated') ? 0 : undefined,
                role: "columnheader",
                onClick: _cache[3] || (_cache[3] = ($event: any) => (toggleSort('updated'))),
                onKeydown: _cache[4] || (_cache[4] = _withKeys(($event: any) => (toggleSort('updated')), ["enter"]))
              }, [ _createElementVNode("span", { class: "inline-flex items-center gap-1" }, [ _createTextVNode("\n              "), _createTextVNode(_toDisplayString(getColumnLabel('updated')), 1 /* TEXT */), _createTextVNode("\n              "), (isSortable('updated')) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ (isColumnSorted('updated')) ? (_openBlock(), _createElementBlock("span", {
                          key: 0,
                          class: _normalizeClass(["i-lucide:chevron-down w-3 h-3", getSortDirection('updated') === 'asc' ? 'rotate-180' : '']),
                          "aria-hidden": "true"
                        })) : (_openBlock(), _createElementBlock("span", {
                          key: 1,
                          class: "i-lucide:chevrons-up-down w-3 h-3 opacity-30",
                          "aria-hidden": "true"
                        })) ], 64 /* STABLE_FRAGMENT */)) : _createCommentVNode("v-if", true) ]) ])) : _createCommentVNode("v-if", true), (isColumnVisible('maintainers')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('maintainers')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('keywords')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('keywords')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('qualityScore')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('qualityScore')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('popularityScore')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('popularityScore')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('maintenanceScore')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('maintenanceScore')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('combinedScore')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('combinedScore')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (isColumnVisible('security')) ? (_openBlock(), _createElementBlock("th", {
                key: 0,
                scope: "col",
                class: "py-3 px-3 text-xs text-start text-fg-muted font-mono font-medium uppercase tracking-wider whitespace-nowrap select-none text-end"
              }, "\n            " + _toDisplayString(getColumnLabel('security')) + "\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ]) ]), _createElementVNode("tbody", null, [ _createTextVNode("\n        "), _createTextVNode("\n        "), (__props.isLoading && __props.results.length === 0) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ (_openBlock(), _createElementBlock(_Fragment, null, _renderList(5, (i) => {
                return _createElementVNode("tr", {
                  key: `skeleton-${i}`,
                  class: "border-b border-border"
                }, [
                  _createElementVNode("td", { class: "py-3 px-3" }, [
                    _hoisted_1
                  ]),
                  (isColumnVisible('version'))
                    ? (_openBlock(), _createElementBlock("td", {
                      key: 0,
                      class: "py-3 px-3"
                    }, [
                      _hoisted_2
                    ]))
                    : _createCommentVNode("v-if", true),
                  (isColumnVisible('description'))
                    ? (_openBlock(), _createElementBlock("td", {
                      key: 0,
                      class: "py-3 px-3"
                    }, [
                      _hoisted_3
                    ]))
                    : _createCommentVNode("v-if", true),
                  (isColumnVisible('downloads'))
                    ? (_openBlock(), _createElementBlock("td", {
                      key: 0,
                      class: "py-3 px-3"
                    }, [
                      _hoisted_4
                    ]))
                    : _createCommentVNode("v-if", true),
                  (isColumnVisible('updated'))
                    ? (_openBlock(), _createElementBlock("td", {
                      key: 0,
                      class: "py-3 px-3"
                    }, [
                      _hoisted_5
                    ]))
                    : _createCommentVNode("v-if", true),
                  (isColumnVisible('maintainers'))
                    ? (_openBlock(), _createElementBlock("td", {
                      key: 0,
                      class: "py-3 px-3"
                    }, [
                      _hoisted_6
                    ]))
                    : _createCommentVNode("v-if", true),
                  (isColumnVisible('keywords'))
                    ? (_openBlock(), _createElementBlock("td", {
                      key: 0,
                      class: "py-3 px-3"
                    }, [
                      _hoisted_7
                    ]))
                    : _createCommentVNode("v-if", true)
                ])
              }), 64 /* STABLE_FRAGMENT */)) ], 64 /* STABLE_FRAGMENT */)) : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.results, (result, index) => {
                return (_openBlock(), _createBlock(_component_PackageTableRow, {
                  key: result.package.name,
                  result: result,
                  columns: __props.columns,
                  index: index,
                  filters: __props.filters,
                  onClickKeyword: _cache[5] || (_cache[5] = ($event: any) => (emit('clickKeyword', $event)))
                }, null, 8 /* PROPS */, ["result", "columns", "index", "filters"]))
              }), 128 /* KEYED_FRAGMENT */)) ], 64 /* STABLE_FRAGMENT */)), _createTextVNode("\n\n        "), _createTextVNode("\n        ") ]) ]), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (__props.results.length === 0 && !__props.isLoading) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "py-12 text-center text-fg-subtle font-mono text-sm"
        }, "\n      " + _toDisplayString(_ctx.$t('filters.table.no_packages')) + "\n    ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ]))
}
}

})
