import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("br")
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-plus" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-x" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-ban" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-trash" })
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-check" })
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
import { customEmojiCategories } from '@/custom-emojis.js'
import MkSwitch from '@/components/MkSwitch.vue'
import { selectFile } from '@/utility/drive.js'
import MkRolePreview from '@/components/MkRolePreview.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'emoji-edit-dialog',
  props: {
    emoji: { type: null as unknown as PropType<Misskey.entities.EmojiDetailed>, required: false }
  },
  emits: ["done", "closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const windowEl = useTemplateRef('windowEl');
const name = ref<string>(props.emoji ? props.emoji.name : '');
const category = ref<string>(props.emoji?.category ? props.emoji.category : '');
const aliases = ref<string>(props.emoji ? props.emoji.aliases.join(' ') : '');
const license = ref<string>(props.emoji?.license ? props.emoji.license : '');
const isSensitive = ref(props.emoji ? props.emoji.isSensitive : false);
const localOnly = ref(props.emoji ? props.emoji.localOnly : false);
const roleIdsThatCanBeUsedThisEmojiAsReaction = ref(props.emoji ? props.emoji.roleIdsThatCanBeUsedThisEmojiAsReaction : []);
const rolesThatCanBeUsedThisEmojiAsReaction = ref<Misskey.entities.Role[]>([]);
const file = ref<Misskey.entities.DriveFile>();
watch(roleIdsThatCanBeUsedThisEmojiAsReaction, async () => {
	rolesThatCanBeUsedThisEmojiAsReaction.value = (await Promise.all(roleIdsThatCanBeUsedThisEmojiAsReaction.value.map((id) => misskeyApi('admin/roles/show', { roleId: id }).catch(() => null)))).filter(x => x != null);
}, { immediate: true });
const imgUrl = computed(() => file.value ? file.value.url : props.emoji ? props.emoji.url : null);
async function changeImage(ev: PointerEvent) {
	file.value = await selectFile({
		anchorElement: ev.currentTarget ?? ev.target,
		multiple: false,
	});
	const candidate = file.value.name.replace(/\.(.+)$/, '');
	if (candidate.match(/^[a-z0-9_]+$/)) {
		name.value = candidate;
	}
}
async function addRole() {
	const roles = await misskeyApi('admin/roles/list');
	const currentRoleIds = rolesThatCanBeUsedThisEmojiAsReaction.value.map(x => x.id);
	const { canceled, result: roleId } = await os.select({
		items: roles.filter(r => r.isPublic).filter(r => !currentRoleIds.includes(r.id)).map(r => ({ label: r.name, value: r.id })),
	});
	if (canceled || roleId == null) return;
	rolesThatCanBeUsedThisEmojiAsReaction.value.push(roles.find(r => r.id === roleId)!);
}
async function removeRole(role: Misskey.entities.RoleLite) {
	rolesThatCanBeUsedThisEmojiAsReaction.value = rolesThatCanBeUsedThisEmojiAsReaction.value.filter(x => x.id !== role.id);
}
async function done() {
	const params = {
		name: name.value,
		category: category.value === '' ? null : category.value,
		aliases: aliases.value.split(' ').filter(x => x !== ''),
		license: license.value === '' ? null : license.value,
		isSensitive: isSensitive.value,
		localOnly: localOnly.value,
		roleIdsThatCanBeUsedThisEmojiAsReaction: rolesThatCanBeUsedThisEmojiAsReaction.value.map(x => x.id),
		fileId: file.value ? file.value.id : undefined,
	} satisfies Misskey.entities.AdminEmojiUpdateRequest;
	if (props.emoji) {
		const emojiDetailed = {
			id: props.emoji.id,
			aliases: params.aliases,
			name: params.name,
			category: params.category,
			host: props.emoji.host,
			url: file.value ? file.value.url : props.emoji.url,
			license: params.license,
			isSensitive: params.isSensitive,
			localOnly: params.localOnly,
			roleIdsThatCanBeUsedThisEmojiAsReaction: params.roleIdsThatCanBeUsedThisEmojiAsReaction,
		} satisfies Misskey.entities.EmojiDetailed;
		await os.apiWithDialog('admin/emoji/update', {
			id: props.emoji.id,
			...params,
		});
		emit('done', {
			updated: emojiDetailed,
		});
		windowEl.value?.close();
	} else {
		if (params.fileId == null) return;
		const created = await os.apiWithDialog('admin/emoji/add', {
			...params,
			fileId: params.fileId, // TSを黙らすため
		});
		emit('done', {
			created: created,
		});
		windowEl.value?.close();
	}
}
async function del() {
	if (!props.emoji) return;
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.tsx.removeAreYouSure({ x: name.value }),
	});
	if (canceled) return;
	misskeyApi('admin/emoji/delete', {
		id: props.emoji.id,
	}).then(() => {
		emit('done', {
			deleted: true,
		});
		windowEl.value?.close();
	});
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkWindow, {
      ref: windowEl,
      initialWidth: 400,
      initialHeight: 500,
      canResize: true,
      onClose: _cache[0] || (_cache[0] = ($event: any) => (_unref(windowEl)?.close())),
      onClosed: _cache[1] || (_cache[1] = ($event: any) => (emit('closed')))
    }, {
      default: _withCtx(() => [
        (__props.emoji)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _createTextVNode(":"),
            _toDisplayString(__props.emoji.name),
            _createTextVNode(":")
          ], 64 /* STABLE_FRAGMENT */))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
            _createTextVNode("New emoji")
          ], 64 /* STABLE_FRAGMENT */)),
        _createElementVNode("div", { style: "display: flex; flex-direction: column; min-height: 100%;" }, [
          _createElementVNode("div", {
            class: "_spacer",
            style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px; flex-grow: 1;"
          }, [
            _createElementVNode("div", { class: "_gaps_m" }, [
              (imgUrl.value != null)
                ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: _normalizeClass(_ctx.$style.imgs)
                }, [
                  _createElementVNode("div", {
                    style: "background: #000;",
                    class: _normalizeClass(_ctx.$style.imgContainer)
                  }, [
                    _createElementVNode("img", {
                      src: imgUrl.value,
                      class: _normalizeClass(_ctx.$style.img)
                    }, null, 10 /* CLASS, PROPS */, ["src"])
                  ], 2 /* CLASS */),
                  _createElementVNode("div", {
                    style: "background: #222;",
                    class: _normalizeClass(_ctx.$style.imgContainer)
                  }, [
                    _createElementVNode("img", {
                      src: imgUrl.value,
                      class: _normalizeClass(_ctx.$style.img)
                    }, null, 10 /* CLASS, PROPS */, ["src"])
                  ], 2 /* CLASS */),
                  _createElementVNode("div", {
                    style: "background: #ddd;",
                    class: _normalizeClass(_ctx.$style.imgContainer)
                  }, [
                    _createElementVNode("img", {
                      src: imgUrl.value,
                      class: _normalizeClass(_ctx.$style.img)
                    }, null, 10 /* CLASS, PROPS */, ["src"])
                  ], 2 /* CLASS */),
                  _createElementVNode("div", {
                    style: "background: #fff;",
                    class: _normalizeClass(_ctx.$style.imgContainer)
                  }, [
                    _createElementVNode("img", {
                      src: imgUrl.value,
                      class: _normalizeClass(_ctx.$style.img)
                    }, null, 10 /* CLASS, PROPS */, ["src"])
                  ], 2 /* CLASS */)
                ]))
                : _createCommentVNode("v-if", true),
              _createVNode(MkButton, {
                rounded: "",
                style: "margin: 0 auto;",
                onClick: changeImage
              }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.selectFile), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkInput, {
                pattern: "[a-z0-9_]",
                autocapitalize: "off",
                modelValue: name.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((name).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.name), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkInput, {
                datalist: _unref(customEmojiCategories).filter(x => x != null),
                modelValue: category.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((category).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.category), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkInput, {
                autocapitalize: "off",
                modelValue: aliases.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((aliases).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.tags), 1 /* TEXT */)
                ]),
                caption: _withCtx(() => [
                  _createTextVNode("\n\t\t\t\t\t\t"),
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.theKeywordWhenSearchingForCustomEmoji), 1 /* TEXT */),
                  _hoisted_1,
                  _createTextVNode("\n\t\t\t\t\t\t"),
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.setMultipleBySeparatingWithSpace), 1 /* TEXT */),
                  _createTextVNode("\n\t\t\t\t\t")
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkInput, {
                mfmAutocomplete: true,
                modelValue: license.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event: any) => ((license).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.license), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkFolder, null, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.rolesThatCanBeUsedThisEmojiAsReaction), 1 /* TEXT */)
                ]),
                suffix: _withCtx(() => [
                  _createTextVNode(_toDisplayString(rolesThatCanBeUsedThisEmojiAsReaction.value.length === 0 ? _unref(i18n).ts.all : rolesThatCanBeUsedThisEmojiAsReaction.value.length), 1 /* TEXT */)
                ]),
                default: _withCtx(() => [
                  _createElementVNode("div", { class: "_gaps" }, [
                    _createVNode(MkButton, {
                      rounded: "",
                      onClick: addRole
                    }, {
                      default: _withCtx(() => [
                        _hoisted_2,
                        _createTextVNode(" "),
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.add), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(rolesThatCanBeUsedThisEmojiAsReaction.value, (role) => {
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
                            onClick: _cache[6] || (_cache[6] = ($event: any) => (removeRole(role)))
                          }, [
                            _hoisted_3
                          ]))
                          : (_openBlock(), _createElementBlock("button", {
                            key: 1,
                            class: _normalizeClass(["_button", _ctx.$style.roleUnassign]),
                            disabled: ""
                          }, [
                            _hoisted_4
                          ]))
                      ], 2 /* CLASS */))
                    }), 128 /* KEYED_FRAGMENT */)),
                    _createVNode(MkInfo, null, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.rolesThatCanBeUsedThisEmojiAsReactionEmptyDescription), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(MkInfo, { warn: "" }, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.rolesThatCanBeUsedThisEmojiAsReactionPublicRoleWarn), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    })
                  ])
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkSwitch, {
                modelValue: isSensitive.value,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event: any) => ((isSensitive).value = $event))
              }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.sensitive), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkSwitch, {
                modelValue: localOnly.value,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event: any) => ((localOnly).value = $event))
              }, {
                default: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.localOnly), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              (__props.emoji)
                ? (_openBlock(), _createBlock(MkButton, {
                  key: 0,
                  danger: "",
                  onClick: _cache[9] || (_cache[9] = ($event: any) => (del()))
                }, {
                  default: _withCtx(() => [
                    _hoisted_5,
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
                _hoisted_6,
                _createTextVNode(" "),
                _createTextVNode(_toDisplayString(props.emoji ? _unref(i18n).ts.update : _unref(i18n).ts.create), 1 /* TEXT */)
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
