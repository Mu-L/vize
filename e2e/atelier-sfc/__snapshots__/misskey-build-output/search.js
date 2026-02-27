import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, withCtx as _withCtx, unref as _unref } from "vue"

import { computed, defineAsyncComponent, ref, toRef } from 'vue'
import { $i } from '@/i.js'
import { i18n } from '@/i18n.js'
import { definePage } from '@/page.js'
import { notesSearchAvailable, usersSearchAvailable } from '@/utility/check-permissions.js'
import MkInfo from '@/components/MkInfo.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'search',
  props: {
    query: { type: String as PropType<string>, required: false, default: '' },
    userId: { type: String as PropType<string>, required: false, default: undefined },
    username: { type: String as PropType<string>, required: false, default: undefined },
    host: { type: String as PropType<string | null>, required: false, default: undefined },
    type: { type: String as PropType<'note' | 'user'>, required: false, default: 'note' },
    origin: { type: String as PropType<'combined' | 'local' | 'remote'>, required: false, default: 'combined' },
    ignoreNotesSearchAvailable: { type: Boolean as PropType<boolean>, required: false, default: false }
  },
  setup(__props) {

const props = __props
const XNote = defineAsyncComponent(() => import('./search.note.vue'));
const XUser = defineAsyncComponent(() => import('./search.user.vue'));
const tab = ref(toRef(props, 'type').value);
const headerActions = computed(() => []);
const headerTabs = computed(() => [{
	key: 'note',
	title: i18n.ts.notes,
	icon: 'ti ti-pencil',
}, {
	key: 'user',
	title: i18n.ts.users,
	icon: 'ti ti-users',
}]);
definePage(() => ({
	title: i18n.ts.search,
	icon: 'ti ti-search',
}));

return (_ctx: any,_cache: any) => {
  const _component_PageWithHeader = _resolveComponent("PageWithHeader")

  return (_openBlock(), _createBlock(_component_PageWithHeader, {
      actions: headerActions.value,
      tabs: headerTabs.value,
      swipable: true,
      tab: tab.value,
      "onUpdate:tab": _cache[0] || (_cache[0] = ($event: any) => ((tab).value = $event))
    }, {
      default: _withCtx(() => [
        (tab.value === 'note')
          ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "_spacer",
            style: "--MI_SPACER-w: 800px;"
          }, [
            (_unref(notesSearchAvailable) || __props.ignoreNotesSearchAvailable)
              ? (_openBlock(), _createElementBlock("div", { key: 0 }, [
                _createVNode(XNote, _normalizeProps(_guardReactiveProps(props)))
              ]))
              : (_openBlock(), _createElementBlock("div", { key: 1 }, [
                _createVNode(MkInfo, { warn: "" }, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(_unref(i18n).ts.notesSearchNotAvailable), 1 /* TEXT */)
                  ]),
                  _: 1 /* STABLE */
                })
              ]))
          ]))
          : (tab.value === 'user')
            ? (_openBlock(), _createElementBlock("div", {
              key: 1,
              class: "_spacer",
              style: "--MI_SPACER-w: 800px;"
            }, [
              (_unref(usersSearchAvailable))
                ? (_openBlock(), _createElementBlock("div", { key: 0 }, [
                  _createVNode(XUser, _normalizeProps(_guardReactiveProps(props)))
                ]))
                : (_openBlock(), _createElementBlock("div", { key: 1 }, [
                  _createVNode(MkInfo, { warn: "" }, {
                    default: _withCtx(() => [
                      _createTextVNode(_toDisplayString(_unref(i18n).ts.usersSearchNotAvailable), 1 /* TEXT */)
                    ]),
                    _: 1 /* STABLE */
                  })
                ]))
            ]))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["actions", "tabs", "swipable", "tab"]))
}
}

})
