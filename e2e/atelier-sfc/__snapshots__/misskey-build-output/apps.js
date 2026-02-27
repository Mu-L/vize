import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-trash" })
import { ref, computed, markRaw } from 'vue'
import * as Misskey from 'misskey-js'
import MkPagination from '@/components/MkPagination.vue'
import { misskeyApi } from '@/utility/misskey-api.js'
import { i18n } from '@/i18n.js'
import { definePage } from '@/page.js'
import MkKeyValue from '@/components/MkKeyValue.vue'
import MkButton from '@/components/MkButton.vue'
import MkFolder from '@/components/MkFolder.vue'
import { Paginator } from '@/utility/paginator.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'apps',
  setup(__props) {

const paginator = markRaw(new Paginator('i/apps', {
	limit: 100,
	noPaging: true,
	params: {
		sort: '+lastUsedAt',
	},
}));
function revoke(token: Misskey.entities.IAppsResponse[number]) {
	misskeyApi('i/revoke-token', { tokenId: token.id }).then(() => {
		paginator.reload();
	});
}
const headerActions = computed(() => []);
const headerTabs = computed(() => []);
definePage(() => ({
	title: i18n.ts.installedApps,
	icon: 'ti ti-plug',
}));

return (_ctx: any,_cache: any) => {
  const _component_MkResult = _resolveComponent("MkResult")
  const _component_MkTime = _resolveComponent("MkTime")

  return (_openBlock(), _createElementBlock("div", { class: "_gaps_m" }, [ _createVNode(MkPagination, { paginator: _unref(paginator) }, {
        empty: _withCtx(() => [
          _createVNode(_component_MkResult, { type: "empty" })
        ]),
        default: _withCtx(({items}) => [
          _createElementVNode("div", { class: "_gaps" }, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(items, (token) => {
              return (_openBlock(), _createBlock(MkFolder, {
                key: token.id,
                defaultOpen: true
              }, [
                (token.iconUrl)
                  ? (_openBlock(), _createElementBlock("img", {
                    key: 0,
                    class: _normalizeClass(_ctx.$style.appIcon),
                    src: token.iconUrl,
                    alt: ""
                  }))
                  : (_openBlock(), _createElementBlock("i", {
                    key: 1,
                    class: "ti ti-plug"
                  })),
                _toDisplayString(token.name),
                _toDisplayString(token.description),
                (token.lastUsedAt != null)
                  ? (_openBlock(), _createBlock(_component_MkTime, {
                    key: 0,
                    time: token.lastUsedAt
                  }))
                  : _createCommentVNode("v-if", true),
                _createVNode(MkButton, {
                  danger: "",
                  onClick: _cache[0] || (_cache[0] = ($event: any) => (revoke(token)))
                }, {
                  default: _withCtx(() => [
                    _hoisted_1,
                    _createTextVNode(" "),
                    _createTextVNode(_toDisplayString(_unref(i18n).ts.delete), 1 /* TEXT */)
                  ]),
                  _: 1 /* STABLE */
                }),
                _createElementVNode("div", { class: "_gaps_s" }, [
                  (token.description)
                    ? (_openBlock(), _createElementBlock("div", { key: 0 }, _toDisplayString(token.description), 1 /* TEXT */))
                    : _createCommentVNode("v-if", true),
                  _createElementVNode("div", null, [
                    _createVNode(MkKeyValue, { oneline: "" }, {
                      key: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.installedDate), 1 /* TEXT */)
                      ]),
                      value: _withCtx(() => [
                        _createVNode(_component_MkTime, {
                          time: token.createdAt,
                          mode: 'detail'
                        })
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (token.lastUsedAt != null)
                      ? (_openBlock(), _createBlock(MkKeyValue, {
                        key: 0,
                        oneline: ""
                      }, {
                        key: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.lastUsedDate), 1 /* TEXT */)
                        ]),
                        value: _withCtx(() => [
                          _createVNode(_component_MkTime, {
                            time: token.lastUsedAt,
                            mode: 'detail'
                          })
                        ]),
                        _: 1 /* STABLE */
                      }))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _createVNode(MkFolder, null, {
                    label: _withCtx(() => [
                      _createTextVNode(_toDisplayString(_unref(i18n).ts.permission), 1 /* TEXT */)
                    ]),
                    suffix: _withCtx(() => [
                      _createTextVNode(_toDisplayString(Object.keys(token.permission).length === 0 ? _unref(i18n).ts.none : Object.keys(token.permission).length), 1 /* TEXT */)
                    ]),
                    default: _withCtx(() => [
                      _createElementVNode("ul", null, [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(token.permission, (p) => {
                          return (_openBlock(), _createElementBlock("li", { key: p }, _toDisplayString(_unref(i18n).ts._permissions[p] ?? p), 1 /* TEXT */))
                        }), 128 /* KEYED_FRAGMENT */))
                      ])
                    ]),
                    _: 1 /* STABLE */
                  })
                ])
              ], 8 /* PROPS */, ["defaultOpen"]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]),
        _: 1 /* STABLE */
      }) ]))
}
}

})
