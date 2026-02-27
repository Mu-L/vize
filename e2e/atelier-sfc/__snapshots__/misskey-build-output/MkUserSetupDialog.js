import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-user-edit" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-lock" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-user-plus" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-bell-plus" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-confetti", style: "display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);" })
const _hoisted_6 = { style: "font-size: 120%;" }
const _hoisted_7 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_8 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_10 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_11 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_12 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_13 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_14 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-bell-ringing-2", style: "display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);" })
const _hoisted_15 = { style: "font-size: 120%;" }
const _hoisted_16 = { style: "padding: 0 16px;" }
const _hoisted_17 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_18 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_19 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-check", style: "display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);" })
const _hoisted_20 = { style: "font-size: 120%;" }
const _hoisted_21 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_22 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
import { ref, useTemplateRef, watch, nextTick, defineAsyncComponent } from 'vue'
import { host } from '@@/js/config.js'
import MkModalWindow from '@/components/MkModalWindow.vue'
import MkButton from '@/components/MkButton.vue'
import XProfile from '@/components/MkUserSetupDialog.Profile.vue'
import XFollow from '@/components/MkUserSetupDialog.Follow.vue'
import XPrivacy from '@/components/MkUserSetupDialog.Privacy.vue'
import MkAnimBg from '@/components/MkAnimBg.vue'
import { i18n } from '@/i18n.js'
import { instance } from '@/instance.js'
import MkPushNotificationAllowButton from '@/components/MkPushNotificationAllowButton.vue'
import { store } from '@/store.js'
import * as os from '@/os.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkUserSetupDialog',
  emits: ["closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const dialog = useTemplateRef('dialog');
const page = ref(store.s.accountSetupWizard);
watch(page, () => {
	store.set('accountSetupWizard', page.value);
});
async function close(skip: boolean) {
	if (skip) {
		const { canceled } = await os.confirm({
			type: 'warning',
			text: i18n.ts._initialAccountSetting.skipAreYouSure,
		});
		if (canceled) return;
	}
	dialog.value?.close();
	store.set('accountSetupWizard', -1);
}
function setupComplete() {
	store.set('accountSetupWizard', -1);
	dialog.value?.close();
}
function launchTutorial() {
	setupComplete();
	nextTick(async () => {
		const { dispose } = await os.popupAsyncWithDialog(import('@/components/MkTutorialDialog.vue').then(x => x.default), {
			initialPage: 1,
		}, {
			closed: () => dispose(),
		});
	});
}
async function later(later: boolean) {
	if (later) {
		const { canceled } = await os.confirm({
			type: 'warning',
			text: i18n.ts._initialAccountSetting.laterAreYouSure,
		});
		if (canceled) return;
	}
	dialog.value?.close();
	store.set('accountSetupWizard', 0);
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(MkModalWindow, {
      ref: dialog,
      width: 500,
      height: 550,
      "data-cy-user-setup": "",
      onClose: _cache[0] || (_cache[0] = ($event: any) => (close(true))),
      onClosed: _cache[1] || (_cache[1] = ($event: any) => (emit('closed')))
    }, {
      default: _withCtx(() => [
        (page.value === 1)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _hoisted_1,
            _createTextVNode(" "),
            _toDisplayString(_unref(i18n).ts._initialAccountSetting.profileSetting)
          ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 2)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _hoisted_2,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts._initialAccountSetting.privacySetting)
            ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 3)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _hoisted_3,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts.follow)
            ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 4)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
              _hoisted_4,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts.pushNotification)
            ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 5)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [
              _toDisplayString(_unref(i18n).ts.done)
            ], 64 /* STABLE_FRAGMENT */))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [
            _toDisplayString(_unref(i18n).ts.initialAccountSetting)
          ], 64 /* STABLE_FRAGMENT */)),
        _createElementVNode("div", { style: "overflow-x: clip;" }, [
          _createElementVNode("div", {
            class: _normalizeClass(_ctx.$style.progressBar)
          }, [
            _createElementVNode("div", {
              class: _normalizeClass(_ctx.$style.progressBarValue),
              style: _normalizeStyle({ width: `${(page.value / 5) * 100}%` })
            }, null, 6 /* CLASS, STYLE */)
          ], 2 /* CLASS */),
          _createVNode(_Transition, {
            mode: "out-in",
            enterActiveClass: _ctx.$style.transition_x_enterActive,
            leaveActiveClass: _ctx.$style.transition_x_leaveActive,
            enterFromClass: _ctx.$style.transition_x_enterFrom,
            leaveToClass: _ctx.$style.transition_x_leaveTo
          }, {
            default: _withCtx(() => [
              (page.value === 0)
                ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: _normalizeClass(_ctx.$style.centerPage)
                }, [
                  _createVNode(MkAnimBg, {
                    style: "position: absolute; top: 0;",
                    scale: 1.5
                  }),
                  _createElementVNode("div", {
                    class: "_spacer",
                    style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;"
                  }, [
                    _createElementVNode("div", {
                      class: "_gaps",
                      style: "text-align: center;"
                    }, [
                      _hoisted_5,
                      _createElementVNode("div", _hoisted_6, _toDisplayString(_unref(i18n).ts._initialAccountSetting.accountCreated), 1 /* TEXT */),
                      _createElementVNode("div", null, _toDisplayString(_unref(i18n).ts._initialAccountSetting.letsStartAccountSetup), 1 /* TEXT */),
                      _createVNode(MkButton, {
                        primary: "",
                        rounded: "",
                        gradate: "",
                        style: "margin: 16px auto 0 auto;",
                        "data-cy-user-setup-continue": "",
                        onClick: _cache[2] || (_cache[2] = ($event: any) => (page.value++))
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts._initialAccountSetting.profileSetting), 1 /* TEXT */),
                          _createTextVNode(" "),
                          _hoisted_7
                        ]),
                        _: 1 /* STABLE */
                      }),
                      _createVNode(MkButton, {
                        style: "margin: 0 auto;",
                        transparent: "",
                        rounded: "",
                        onClick: _cache[3] || (_cache[3] = ($event: any) => (later(true)))
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.later), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ])
                ]))
                : (page.value === 1)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 1,
                    style: "height: 100cqh; overflow: auto;"
                  }, [
                    _createElementVNode("div", {
                      class: _normalizeClass(_ctx.$style.pageRoot)
                    }, [
                      _createElementVNode("div", {
                        style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;",
                        class: _normalizeClass(["_spacer", _ctx.$style.pageMain])
                      }, [
                        _createVNode(XProfile)
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          _createVNode(MkButton, {
                            rounded: "",
                            "data-cy-user-setup-back": "",
                            onClick: _cache[4] || (_cache[4] = ($event: any) => (page.value--))
                          }, {
                            default: _withCtx(() => [
                              _hoisted_8,
                              _createTextVNode(" "),
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            "data-cy-user-setup-continue": "",
                            onClick: _cache[5] || (_cache[5] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_9
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ], 2 /* CLASS */)
                    ], 2 /* CLASS */)
                  ]))
                : (page.value === 2)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 2,
                    style: "height: 100cqh; overflow: auto;"
                  }, [
                    _createElementVNode("div", {
                      class: _normalizeClass(_ctx.$style.pageRoot)
                    }, [
                      _createElementVNode("div", {
                        style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;",
                        class: _normalizeClass(["_spacer", _ctx.$style.pageMain])
                      }, [
                        _createVNode(XPrivacy)
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          _createVNode(MkButton, {
                            rounded: "",
                            "data-cy-user-setup-back": "",
                            onClick: _cache[6] || (_cache[6] = ($event: any) => (page.value--))
                          }, {
                            default: _withCtx(() => [
                              _hoisted_10,
                              _createTextVNode(" "),
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            "data-cy-user-setup-continue": "",
                            onClick: _cache[7] || (_cache[7] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_11
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ], 2 /* CLASS */)
                    ], 2 /* CLASS */)
                  ]))
                : (page.value === 3)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 3,
                    style: "height: 100cqh; overflow: auto;"
                  }, [
                    _createElementVNode("div", {
                      class: "_spacer",
                      style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;"
                    }, [
                      _createVNode(XFollow)
                    ]),
                    _createElementVNode("div", {
                      class: _normalizeClass(_ctx.$style.pageFooter)
                    }, [
                      _createElementVNode("div", { class: "_buttonsCenter" }, [
                        _createVNode(MkButton, {
                          rounded: "",
                          "data-cy-user-setup-back": "",
                          onClick: _cache[8] || (_cache[8] = ($event: any) => (page.value--))
                        }, {
                          default: _withCtx(() => [
                            _hoisted_12,
                            _createTextVNode(" "),
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        }),
                        _createVNode(MkButton, {
                          primary: "",
                          rounded: "",
                          gradate: "",
                          style: "",
                          "data-cy-user-setup-continue": "",
                          onClick: _cache[9] || (_cache[9] = ($event: any) => (page.value++))
                        }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                            _createTextVNode(" "),
                            _hoisted_13
                          ]),
                          _: 1 /* STABLE */
                        })
                      ])
                    ], 2 /* CLASS */)
                  ]))
                : (page.value === 4)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 4,
                    class: _normalizeClass(_ctx.$style.centerPage)
                  }, [
                    _createElementVNode("div", {
                      class: "_spacer",
                      style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;"
                    }, [
                      _createElementVNode("div", {
                        class: "_gaps",
                        style: "text-align: center;"
                      }, [
                        _hoisted_14,
                        _createElementVNode("div", _hoisted_15, _toDisplayString(_unref(i18n).ts.pushNotification), 1 /* TEXT */),
                        _createElementVNode("div", _hoisted_16, _toDisplayString(_unref(i18n).tsx._initialAccountSetting.pushNotificationDescription({ name: _unref(instance).name ?? _unref(host) })), 1 /* TEXT */),
                        _createVNode(MkPushNotificationAllowButton, {
                          primary: "",
                          showOnlyToRegister: "",
                          style: "margin: 0 auto;"
                        }),
                        _createElementVNode("div", {
                          class: "_buttonsCenter",
                          style: "margin-top: 16px;"
                        }, [
                          _createVNode(MkButton, {
                            rounded: "",
                            "data-cy-user-setup-back": "",
                            onClick: _cache[10] || (_cache[10] = ($event: any) => (page.value--))
                          }, {
                            default: _withCtx(() => [
                              _hoisted_17,
                              _createTextVNode(" "),
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            "data-cy-user-setup-continue": "",
                            onClick: _cache[11] || (_cache[11] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_18
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ])
                    ])
                  ]))
                : (page.value === 5)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 5,
                    class: _normalizeClass(_ctx.$style.centerPage)
                  }, [
                    _createVNode(MkAnimBg, {
                      style: "position: absolute; top: 0;",
                      scale: 1.5
                    }),
                    _createElementVNode("div", {
                      class: "_spacer",
                      style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;"
                    }, [
                      _createElementVNode("div", {
                        class: "_gaps",
                        style: "text-align: center;"
                      }, [
                        _hoisted_19,
                        _createElementVNode("div", _hoisted_20, _toDisplayString(_unref(i18n).ts._initialAccountSetting.initialAccountSettingCompleted), 1 /* TEXT */),
                        _createElementVNode("div", null, _toDisplayString(_unref(i18n).tsx._initialAccountSetting.youCanContinueTutorial({ name: _unref(instance).name ?? _unref(host) })), 1 /* TEXT */),
                        _createElementVNode("div", {
                          class: "_buttonsCenter",
                          style: "margin-top: 16px;"
                        }, [
                          _createVNode(MkButton, {
                            rounded: "",
                            primary: "",
                            gradate: "",
                            "data-cy-user-setup-continue": "",
                            onClick: _cache[12] || (_cache[12] = ($event: any) => (launchTutorial()))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts._initialAccountSetting.startTutorial), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_21
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          _createVNode(MkButton, {
                            rounded: "",
                            "data-cy-user-setup-back": "",
                            onClick: _cache[13] || (_cache[13] = ($event: any) => (page.value--))
                          }, {
                            default: _withCtx(() => [
                              _hoisted_22,
                              _createTextVNode(" "),
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(MkButton, {
                            rounded: "",
                            primary: "",
                            "data-cy-user-setup-continue": "",
                            onClick: _cache[14] || (_cache[14] = ($event: any) => (setupComplete()))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.close), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ])
                    ])
                  ]))
                : _createCommentVNode("v-if", true)
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["width", "height"]))
}
}

})
