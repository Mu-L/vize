import { useModel as _useModel } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { class: "flex-1" })
import type { ColumnConfig, ColumnId, DownloadRange, FilterChip, PageSize, PaginationMode, SearchScope, SecurityFilter, SortKey, SortOption, StructuredFilters, UpdatedWithin, ViewMode } from '#shared/types/preferences'
import { buildSortOption, parseSortOption, SORT_KEYS, toggleDirection } from '#shared/types/preferences'

export default /*@__PURE__*/_defineComponent({
  __name: 'ListToolbar',
  props: {
    filters: { type: null as unknown as PropType<StructuredFilters>, required: true },
    columns: { type: Array as PropType<ColumnConfig[]>, required: true },
    totalCount: { type: Number as PropType<number>, required: true },
    filteredCount: { type: Number as PropType<number>, required: true },
    availableKeywords: { type: Array as PropType<string[]>, required: false },
    activeFilters: { type: Array as PropType<FilterChip[]>, required: true },
    searchContext: { type: Boolean as PropType<boolean>, required: false },
    disabledSortKeys: { type: Array as PropType<SortKey[]>, required: false },
    "sortOption": { required: true },
    "viewMode": { required: true },
    "paginationMode": { required: true },
    "pageSize": { required: true }
  },
  emits: ["toggleColumn", "resetColumns", "clearFilter", "clearAllFilters", "update:text", "update:searchScope", "update:downloadRange", "update:security", "update:updatedWithin", "toggleKeyword", "update:sortOption", "update:viewMode", "update:paginationMode", "update:pageSize"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const sortOption = _useModel(__props, "sortOption")
const viewMode = _useModel(__props, "viewMode")
const paginationMode = _useModel(__props, "paginationMode")
const pageSize = _useModel(__props, "pageSize")
const { t } = useI18n()
const showingFiltered = computed(() => props.filteredCount !== props.totalCount)
// Parse current sort option into key and direction
const currentSort = computed(() => parseSortOption(sortOption.value))
// Get available sort keys based on context
const disabledSet = computed(() => new Set(props.disabledSortKeys ?? []))
const availableSortKeys = computed(() => {
  const applyDisabled = (k: (typeof SORT_KEYS)[number]) => ({
    ...k,
    disabled: k.disabled || disabledSet.value.has(k.key),
  })

  if (props.searchContext) {
    // In search context: show relevance + non-disabled sorts (downloads, updated, name)
    return SORT_KEYS.filter(k => !k.searchOnly || k.key === 'relevance').map(applyDisabled)
  }
  // In org/user context: hide search-only sorts
  return SORT_KEYS.filter(k => !k.searchOnly).map(applyDisabled)
})
// Handle sort key change from dropdown
const sortKeyModel = computed<SortKey>({
  get: () => currentSort.value.key,
  set: newKey => {
    const config = SORT_KEYS.find(k => k.key === newKey)
    const direction = config?.defaultDirection ?? 'desc'
    sortOption.value = buildSortOption(newKey, direction)
  },
})
// Toggle sort direction
function handleToggleDirection() {
  const { key, direction } = currentSort.value
  sortOption.value = buildSortOption(key, toggleDirection(direction))
}
// Map sort key to i18n key
const sortKeyLabelKeys = computed<Record<SortKey, string>>(() => ({
  'relevance': t('filters.sort.relevance'),
  'downloads-week': t('filters.sort.downloads_week'),
  'downloads-day': t('filters.sort.downloads_day'),
  'downloads-month': t('filters.sort.downloads_month'),
  'downloads-year': t('filters.sort.downloads_year'),
  'updated': t('filters.sort.published'),
  'name': t('filters.sort.name'),
  'quality': t('filters.sort.quality'),
  'popularity': t('filters.sort.popularity'),
  'maintenance': t('filters.sort.maintenance'),
  'score': t('filters.sort.score'),
}))
function getSortKeyLabelKey(key: SortKey): string {
  return sortKeyLabelKeys.value[key]
}

return (_ctx: any,_cache: any) => {
  const _component_SelectField = _resolveComponent("SelectField")
  const _component_ViewModeToggle = _resolveComponent("ViewModeToggle")
  const _component_ColumnPicker = _resolveComponent("ColumnPicker")
  const _component_FilterPanel = _resolveComponent("FilterPanel")
  const _component_FilterChips = _resolveComponent("FilterChips")

  return (_openBlock(), _createElementBlock("div", { class: "space-y-3 mb-6" }, [ _createTextVNode("\n    "), _createTextVNode("\n    "), _createElementVNode("div", { class: "flex flex-col sm:flex-row sm:items-center gap-3" }, [ _createTextVNode("\n      "), _createTextVNode("\n      "), (viewMode.value === 'cards' && paginationMode.value === 'infinite' && !__props.searchContext) ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "text-sm font-mono text-fg-muted"
          }, [ (showingFiltered.value) ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [ _createTextVNode("\n          "), _toDisplayString(_ctx.$t( 'filters.count.showing_filtered', {
                  filtered: _ctx.$n(__props.filteredCount),
                  count: _ctx.$n(__props.totalCount),
                }, __props.totalCount, )), _createTextVNode("\n        ") ], 64 /* STABLE_FRAGMENT */)) : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [ _createTextVNode("\n          "), _toDisplayString(_ctx.$t('filters.count.showing_all', { count: _ctx.$n(__props.totalCount) }, __props.totalCount)), _createTextVNode("\n        ") ], 64 /* STABLE_FRAGMENT */)) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n\n      "), _createTextVNode("\n      "), ((viewMode.value === 'table' || paginationMode.value === 'paginated') && !__props.searchContext) ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "text-sm font-mono text-fg-muted"
          }, "\n        " + _toDisplayString(_ctx.$t( 'filters.count.showing_paginated', {
                pageSize: pageSize.value === 'all' ? _ctx.$n(__props.filteredCount) : Math.min(pageSize.value, __props.filteredCount),
                count: _ctx.$n(__props.filteredCount),
              }, __props.filteredCount, )) + "\n      ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), _hoisted_1, _createElementVNode("div", { class: "flex flex-wrap items-center gap-3 sm:justify-end justify-between w-full sm:w-auto" }, [ _createTextVNode("\n        "), _createTextVNode("\n        "), _createElementVNode("div", { class: "flex items-center gap-1 shrink-0 order-1 sm:order-1" }, [ _createTextVNode("\n          "), _createTextVNode("\n          "), _createVNode(_component_SelectField, {
              label: _ctx.$t('filters.sort.label'),
              "hidden-label": "",
              id: "sort-select",
              items: availableSortKeys.value.map((keyConfig) => ({
  	label: getSortKeyLabelKey(keyConfig.key),
  	value: keyConfig.key,
  	disabled: keyConfig.disabled
  })),
              modelValue: sortKeyModel.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => ((sortKeyModel).value = $event))
            }), _createTextVNode("\n\n          "), _createTextVNode("\n          "), (!__props.searchContext || currentSort.value.key !== 'relevance') ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                type: "button",
                class: "p-1.5 rounded border border-border bg-bg-subtle text-fg-muted hover:text-fg hover:border-border-hover transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                "aria-label": _ctx.$t('filters.sort.toggle_direction'),
                title: 
                currentSort.value.direction === 'asc'
                  ? _ctx.$t('filters.sort.ascending')
                  : _ctx.$t('filters.sort.descending')
              ,
                onClick: handleToggleDirection
              }, [ _createElementVNode("span", {
                  class: _normalizeClass(["w-4 h-4 block transition-transform duration-200", 
                  currentSort.value.direction === 'asc'
                    ? 'i-lucide:arrow-down-narrow-wide'
                    : 'i-lucide:arrow-down-wide-narrow'
                ]),
                  "aria-hidden": "true"
                }, null, 2 /* CLASS */) ])) : _createCommentVNode("v-if", true) ]), _createTextVNode("\n\n        "), _createTextVNode("\n        "), _createElementVNode("div", { class: "flex sm:hidden items-center gap-1 order-2" }, [ _createVNode(_component_ViewModeToggle, {
              modelValue: viewMode.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event: any) => ((viewMode).value = $event))
            }) ]), _createTextVNode("\n\n        "), _createTextVNode("\n        "), (viewMode.value === 'table') ? (_openBlock(), _createBlock(_component_ColumnPicker, {
              key: 0,
              class: "flex sm:hidden order-3",
              columns: __props.columns,
              onToggle: _cache[2] || (_cache[2] = ($event: any) => (emit('toggleColumn', $event))),
              onReset: _cache[3] || (_cache[3] = ($event: any) => (emit('resetColumns')))
            })) : _createCommentVNode("v-if", true), _createTextVNode("\n\n        "), _createTextVNode("\n        "), _createElementVNode("div", { class: "hidden sm:flex items-center gap-1 order-2" }, [ _createVNode(_component_ViewModeToggle, {
              modelValue: viewMode.value,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((viewMode).value = $event))
            }), (viewMode.value === 'table') ? (_openBlock(), _createBlock(_component_ColumnPicker, {
                key: 0,
                columns: __props.columns,
                onToggle: _cache[5] || (_cache[5] = ($event: any) => (emit('toggleColumn', $event))),
                onReset: _cache[6] || (_cache[6] = ($event: any) => (emit('resetColumns')))
              })) : _createCommentVNode("v-if", true) ]) ]) ]), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (!__props.searchContext) ? (_openBlock(), _createBlock(_component_FilterPanel, {
          key: 0,
          filters: __props.filters,
          "available-keywords": __props.availableKeywords,
          "onUpdate:text": _cache[7] || (_cache[7] = ($event: any) => (emit('update:text', $event))),
          "onUpdate:search-scope": _cache[8] || (_cache[8] = ($event: any) => (emit('update:searchScope', $event))),
          "onUpdate:download-range": _cache[9] || (_cache[9] = ($event: any) => (emit('update:downloadRange', $event))),
          "onUpdate:security": _cache[10] || (_cache[10] = ($event: any) => (emit('update:security', $event))),
          "onUpdate:updated-within": _cache[11] || (_cache[11] = ($event: any) => (emit('update:updatedWithin', $event))),
          onToggleKeyword: _cache[12] || (_cache[12] = ($event: any) => (emit('toggleKeyword', $event)))
        })) : _createCommentVNode("v-if", true), _createTextVNode("\n\n    "), _createTextVNode("\n    "), (!__props.searchContext) ? (_openBlock(), _createBlock(_component_FilterChips, {
          key: 0,
          chips: __props.activeFilters,
          onRemove: _cache[13] || (_cache[13] = ($event: any) => (emit('clearFilter', $event))),
          onClearAll: _cache[14] || (_cache[14] = ($event: any) => (emit('clearAllFilters')))
        })) : _createCommentVNode("v-if", true) ]))
}
}

})
