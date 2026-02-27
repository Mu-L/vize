import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-trash" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-check" })
import { ref, useTemplateRef } from 'vue'
import * as Misskey from 'misskey-js'
import MkModalWindow from '@/components/MkModalWindow.vue'
import MkButton from '@/components/MkButton.vue'
import MkInput from '@/components/MkInput.vue'
import * as os from '@/os.js'
import { misskeyApi } from '@/utility/misskey-api.js'
import { i18n } from '@/i18n.js'
import MkTextarea from '@/components/MkTextarea.vue'
import MkSwitch from '@/components/MkSwitch.vue'
import MkRadios from '@/components/MkRadios.vue'

type AdminAnnouncementType = Misskey.entities.AdminAnnouncementsCreateRequest & { id: string; };

export default /*@__PURE__*/_defineComponent({
  __name: 'MkUserAnnouncementEditDialog',
  props: {
    user: { type: null as unknown as PropType<Misskey.entities.User>, required: true },
    announcement: { type: null as unknown as PropType<Required<AdminAnnouncementType>>, required: false }
  },
  emits: ["done", "closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const dialog = useTemplateRef('dialog');
const title = ref(props.announcement ? props.announcement.title : '');
const text = ref(props.announcement ? props.announcement.text : '');
const icon = ref(props.announcement ? props.announcement.icon : 'info');
const display = ref(props.announcement ? props.announcement.display : 'dialog');
const needConfirmationToRead = ref(props.announcement ? props.announcement.needConfirmationToRead : false);
async function done() {
	const params = {
		title: title.value,
		text: text.value,
		icon: icon.value,
		imageUrl: null,
		display: display.value,
		needConfirmationToRead: needConfirmationToRead.value,
		userId: props.user.id,
	} satisfies Misskey.entities.AdminAnnouncementsCreateRequest;
	if (props.announcement) {
		await os.apiWithDialog('admin/announcements/update', {
			...params,
			id: props.announcement.id,
		});
		emit('done', {
			updated: {
				...params,
				id: props.announcement.id,
			},
		});
		dialog.value?.close();
	} else {
		const created = await os.apiWithDialog('admin/announcements/create', params);
		emit('done', {
			created: created,
		});
		dialog.value?.close();
	}
}
async function del() {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.tsx.removeAreYouSure({ x: title.value }),
	});
	if (canceled) return;
	if (props.announcement) {
		await misskeyApi('admin/announcements/delete', {
			id: props.announcement.id,
		});
	}
	emit('done', {
		deleted: true,
	});
	dialog.value?.close();
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkModalWindow, {
      ref: dialog,
      width: 400,
      onClose: _cache[0] || (_cache[0] = ($event: any) => (_unref(dialog)?.close())),
      onClosed: _cache[1] || (_cache[1] = ($event: any) => (emit('closed')))
    }, {
      default: _withCtx(() => [
        (__props.announcement)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _createTextVNode(":"),
            _toDisplayString(__props.announcement.title),
            _createTextVNode(":")
          ], 64 /* STABLE_FRAGMENT */))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
            _createTextVNode("New announcement")
          ], 64 /* STABLE_FRAGMENT */)),
        _createElementVNode("div", null, [
          _createElementVNode("div", {
            class: "_spacer",
            style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;"
          }, [
            _createElementVNode("div", { class: "_gaps_m" }, [
              _createVNode(MkInput, {
                modelValue: title.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((title).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.title), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkTextarea, {
                modelValue: text.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((text).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.text), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkRadios, {
                options: [
  						{ value: 'info', icon: 'ti ti-info-circle' },
  						{ value: 'warning', icon: 'ti ti-alert-triangle', iconStyle: 'color: var(--MI_THEME-warn);' },
  						{ value: 'error', icon: 'ti ti-circle-x', iconStyle: 'color: var(--MI_THEME-error);' },
  						{ value: 'success', icon: 'ti ti-check', iconStyle: 'color: var(--MI_THEME-success);' },
  					],
                modelValue: icon.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((icon).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.icon), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkRadios, {
                options: [
  						{ value: 'normal', label: _unref(i18n).ts.normal },
  						{ value: 'banner', label: _unref(i18n).ts.banner },
  						{ value: 'dialog', label: _unref(i18n).ts.dialog },
  					],
                modelValue: display.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event: any) => ((display).value = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts.display), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              _createVNode(MkSwitch, {
                modelValue: needConfirmationToRead.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event: any) => ((needConfirmationToRead).value = $event))
              }, {
                caption: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_unref(i18n).ts._announcement.needConfirmationToReadDescription), 1 /* TEXT */)
                ]),
                default: _withCtx(() => [
                  _createTextVNode("\n\t\t\t\t\t"),
                  _createTextVNode(_toDisplayString(_unref(i18n).ts._announcement.needConfirmationToRead), 1 /* TEXT */),
                  _createTextVNode("\n\t\t\t\t\t")
                ]),
                _: 1 /* STABLE */
              }),
              (__props.announcement)
                ? (_openBlock(), _createBlock(MkButton, {
                  key: 0,
                  danger: "",
                  onClick: _cache[7] || (_cache[7] = ($event: any) => (del()))
                }, {
                  default: _withCtx(() => [
                    _hoisted_1,
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
                _hoisted_2,
                _createTextVNode(" "),
                _createTextVNode(_toDisplayString(props.announcement ? _unref(i18n).ts.update : _unref(i18n).ts.create), 1 /* TEXT */)
              ]),
              _: 1 /* STABLE */
            })
          ], 2 /* CLASS */)
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["width"]))
}
}

})
