import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-plus" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-x" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-ban" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-trash" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-check" })
import { computed, watch, ref, useTemplateRef } from 'vue'
import * as Misskey from 'misskey-js'
import MkWindow from '@/components/MkWindow.vue'
import MkButton from '@/components/MkButton.vue'
import MkInput from '@/components/MkInput.vue'
import MkInfo from '@/components/MkInfo.vue'
import MkFolder from '@/components/MkFolder.vue'
import * as os from '@/os.js'
import { misskeyApi } from '@/utility/misskey-api.js'
import { i18n } from '@/i18n.js'
import MkSwitch from '@/components/MkSwitch.vue'
import MkRolePreview from '@/components/MkRolePreview.vue'
import MkTextarea from '@/components/MkTextarea.vue'
import { ensureSignin } from '@/i.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'avatar-decoration-edit-dialog',
  props: {
    avatarDecoration: { type: null as unknown as PropType<Misskey.entities.AdminAvatarDecorationsListResponse[number]>, required: false }
  },
  emits: ["done", "closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const $i = ensureSignin();
const windowEl = useTemplateRef('windowEl');
const url = ref<string>(props.avatarDecoration ? props.avatarDecoration.url : '');
const name = ref<string>(props.avatarDecoration ? props.avatarDecoration.name : '');
const description = ref<string>(props.avatarDecoration ? props.avatarDecoration.description : '');
const roleIdsThatCanBeUsedThisDecoration = ref(props.avatarDecoration ? props.avatarDecoration.roleIdsThatCanBeUsedThisDecoration : []);
const rolesThatCanBeUsedThisDecoration = ref<Misskey.entities.Role[]>([]);
watch(roleIdsThatCanBeUsedThisDecoration, async () => {
	rolesThatCanBeUsedThisDecoration.value = (await Promise.all(roleIdsThatCanBeUsedThisDecoration.value.map((id) => misskeyApi('admin/roles/show', { roleId: id }).catch(() => null)))).filter(x => x != null);
}, { immediate: true });
async function addRole() {
	const roles = await misskeyApi('admin/roles/list');
	const currentRoleIds = rolesThatCanBeUsedThisDecoration.value.map(x => x.id);
	const { canceled, result: roleId } = await os.select({
		items: roles.filter(r => r.isPublic).filter(r => !currentRoleIds.includes(r.id)).map(r => ({ label: r.name, value: r.id })),
	});
	if (canceled || roleId == null) return;
	rolesThatCanBeUsedThisDecoration.value.push(roles.find(r => r.id === roleId)!);
}
async function removeRole(role: Misskey.entities.Role, ev: PointerEvent) {
	rolesThatCanBeUsedThisDecoration.value = rolesThatCanBeUsedThisDecoration.value.filter(x => x.id !== role.id);
}
async function done() {
	const params = {
		url: url.value,
		name: name.value,
		description: description.value,
		roleIdsThatCanBeUsedThisDecoration: rolesThatCanBeUsedThisDecoration.value.map(x => x.id),
	};
	if (props.avatarDecoration) {
		await os.apiWithDialog('admin/avatar-decorations/update', {
			id: props.avatarDecoration.id,
			...params,
		});
		emit('done', {
			updated: {
				id: props.avatarDecoration.id,
				...params,
			},
		});
		windowEl.value?.close();
	} else {
		const created = await os.apiWithDialog('admin/avatar-decorations/create', params);
		emit('done', {
			created: created,
		});
		windowEl.value?.close();
	}
}
async function del() {
	if (props.avatarDecoration == null) return;
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.tsx.removeAreYouSure({ x: name.value }),
	});
	if (canceled) return;
	misskeyApi('admin/avatar-decorations/delete', {
		id: props.avatarDecoration.id,
	}).then(() => {
		emit('done', {
			deleted: true,
		});
		windowEl.value?.close();
	});
}

return (_ctx: any,_cache: any) => {
  const _component_MkAvatar = _resolveComponent("MkAvatar")

  return (_openBlock(), _createBlock(MkWindow, {
      ref: windowEl,
      initialWidth: 400,
      initialHeight: 500,
      canResize: true,
      onClose: _cache[0] || (_cache[0] = ($event: any) => (_unref(windowEl)?.close())),
      onClosed: _cache[1] || (_cache[1] = ($event: any) => (emit('closed')))
    }, {
      default: _withCtx(() => [
        (__props.avatarDecoration)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _toDisplayString(__props.avatarDecoration.name)
          ], 64 /* STABLE_FRAGMENT */))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
            _createTextVNode("New decoration")
          ], 64 /* STABLE_FRAGMENT */)),
        _createElementVNode("div", { style: "display: flex; flex-direction: column; min-height: 100%;" }, [
          _createElementVNode("div", {
            class: "_spacer",
            style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px; flex-grow: 1;"
          }, [
            _createElementVNode("div", { class: "_gaps_m" }, [
              _createElementVNode("div", {
                class: _normalizeClass(_ctx.$style.preview)
              }, [
                _createElementVNode("div", {
                  class: _normalizeClass([_ctx.$style.previewItem, _ctx.$style.light])
                }, [
                  _createVNode(_component_MkAvatar, {
                    style: "width: 60px; height: 60px;",
                    user: _unref($i),
                    decorations: url.value != '' ? [{ url: url.value }] : [],
                    forceShowDecoration: ""
                  })
                ], 2 /* CLASS */),
                _createElementVNode("div", {
                  class: _normalizeClass([_ctx.$style.previewItem, _ctx.$style.dark])
                }, [
                  _createVNode(_component_MkAvatar, {
                    style: "width: 60px; height: 60px;",
                    user: _unref($i),
                    decorations: url.value != '' ? [{ url: url.value }] : [],
                    forceShowDecoration: ""
                  })
                ], 2 /* CLASS */)
              ], 2 /* CLASS */),
              _createVNode(MkInput, {
                modelValue: name.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((name).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.name), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkInput, {
                modelValue: url.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((url).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.imageUrl), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkTextarea, {
                modelValue: description.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((description).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.description), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkFolder, null, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.availableRoles), 1 /* TEXT */)
                ]),
                suffix: _withCtx(() => [
                  _createTextVNode(_toDisplayString(rolesThatCanBeUsedThisDecoration.value.length === 0 ? _unref(i18n).ts.all : rolesThatCanBeUsedThisDecoration.value.length), 1 /* TEXT */)
                ]),
                default: _withCtx(() => [
                  _createElementVNode("div", { class: "_gaps" }, [
                    _createVNode(MkButton, {
                      rounded: "",
                      onClick: addRole
                    }, {
                      default: _withCtx(() => [
                        _hoisted_1,
                        _createTextVNode(" "),
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.add), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(rolesThatCanBeUsedThisDecoration.value, (role) => {
                      return (_openBlock(), _createElementBlock("div", {
                        key: role.id,
                        class: _normalizeClass(_ctx.$style.roleItem)
                      }, [
                        _createVNode(MkRolePreview, {
                          class: _normalizeClass(_ctx.$style.role),
                          role: role,
                          forModeration: true,
                          detailed: false,
                          style: "pointer-events: none;"
                        }),
                        (role.target === 'manual')
                          ? (_openBlock(), _createElementBlock("button", {
                            key: 0,
                            class: _normalizeClass(["_button", _ctx.$style.roleUnassign]),
                            onClick: _cache[5] || (_cache[5] = ($event: any) => (removeRole(role, $event)))
                          }, [
                            _hoisted_2
                          ]))
                          : (_openBlock(), _createElementBlock("button", {
                            key: 1,
                            class: _normalizeClass(["_button", _ctx.$style.roleUnassign]),
                            disabled: ""
                          }, [
                            _hoisted_3
                          ]))
                      ], 2 /* CLASS */))
                    }), 128 /* KEYED_FRAGMENT */))
                  ])
                ]),
                _: 1 /* STABLE */
              }),
              (__props.avatarDecoration)
                ? (_openBlock(), _createBlock(MkButton, {
                  key: 0,
                  danger: "",
                  onClick: _cache[6] || (_cache[6] = ($event: any) => (del()))
                }, {
                  default: _withCtx(() => [
                    _hoisted_4,
                    _createTextVNode(" "),
                    _createTextVNode(_toDisplayString(_unref(i18n).ts.delete), 1 /* TEXT */)
                  ]),
                  _: 1 /* STABLE */
                }))
                : _createCommentVNode("v-if", true)
            ])
          ]),
          _createElementVNode("div", {
            class: _normalizeClass(_ctx.$style.footer)
          }, [
            _createVNode(MkButton, {
              primary: "",
              rounded: "",
              style: "margin: 0 auto;",
              onClick: done
            }, {
              default: _withCtx(() => [
                _hoisted_5,
                _createTextVNode(" "),
                _createTextVNode(_toDisplayString(props.avatarDecoration ? _unref(i18n).ts.update : _unref(i18n).ts.create), 1 /* TEXT */)
              ]),
              _: 1 /* STABLE */
            })
          ], 2 /* CLASS */)
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["initialWidth", "initialHeight", "canResize"]))
}
}

})
