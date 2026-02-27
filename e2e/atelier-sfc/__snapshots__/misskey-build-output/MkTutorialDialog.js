import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-pencil" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-mood-smile" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-home" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-pencil-plus" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-eye-exclamation" })
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-confetti", style: "display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);" })
const _hoisted_7 = { style: "font-size: 120%;" }
const _hoisted_8 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_10 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_11 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_12 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_13 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_14 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_15 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_16 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_17 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
const _hoisted_18 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-right" })
const _hoisted_19 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-check", style: "display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);" })
const _hoisted_20 = { style: "font-size: 120%;" }
const _hoisted_21 = { href: "https://misskey-hub.net/docs/for-users/", target: "_blank", class: "_link" }
const _hoisted_22 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-arrow-left" })
import { ref, useTemplateRef, watch } from 'vue'
import { host } from '@@/js/config.js'
import MkModalWindow from '@/components/MkModalWindow.vue'
import MkButton from '@/components/MkButton.vue'
import XNote from '@/components/MkTutorialDialog.Note.vue'
import XTimeline from '@/components/MkTutorialDialog.Timeline.vue'
import XPostNote from '@/components/MkTutorialDialog.PostNote.vue'
import XSensitive from '@/components/MkTutorialDialog.Sensitive.vue'
import MkAnimBg from '@/components/MkAnimBg.vue'
import { i18n } from '@/i18n.js'
import { instance } from '@/instance.js'
import { claimAchievement } from '@/utility/achievements.js'
import * as os from '@/os.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkTutorialDialog',
  props: {
    initialPage: { type: Number as PropType<number>, required: false }
  },
  emits: ["closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const dialog = useTemplateRef('dialog');
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const page = ref(props.initialPage ?? 0);
watch(page, (to) => {
	// チュートリアルの枚数を増やしたら必ず変更すること！！
	if (to === 6) {
		claimAchievement('tutorialCompleted');
	}
});
const isReactionTutorialPushed = ref<boolean>(false);
const isSensitiveTutorialSucceeded = ref<boolean>(false);
async function close(skip: boolean) {
	if (skip) {
		const { canceled } = await os.confirm({
			type: 'warning',
			text: i18n.ts._initialTutorial.skipAreYouSure,
		});
		if (canceled) return;
	}
	dialog.value?.close();
}

return (_ctx: any,_cache: any) => {
  const _component_I18n = _resolveComponent("I18n")

  return (_openBlock(), _createBlock(MkModalWindow, {
      ref: dialog,
      width: 600,
      height: 650,
      onClose: _cache[0] || (_cache[0] = ($event: any) => (close(true))),
      onClosed: _cache[1] || (_cache[1] = ($event: any) => (emit('closed')))
    }, {
      default: _withCtx(() => [
        (page.value === 1)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _hoisted_1,
            _createTextVNode(" "),
            _toDisplayString(_unref(i18n).ts._initialTutorial._note.title)
          ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 2)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
              _hoisted_2,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts._initialTutorial._reaction.title)
            ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 3)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _hoisted_3,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts._initialTutorial._timeline.title)
            ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 4)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
              _hoisted_4,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts._initialTutorial._postNote.title)
            ], 64 /* STABLE_FRAGMENT */))
          : (page.value === 5)
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [
              _hoisted_5,
              _createTextVNode(" "),
              _toDisplayString(_unref(i18n).ts._initialTutorial._howToMakeAttachmentsSensitive.title)
            ], 64 /* STABLE_FRAGMENT */))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [
            _toDisplayString(_unref(i18n).ts._initialTutorial.title)
          ], 64 /* STABLE_FRAGMENT */)),
        _createElementVNode("div", { style: "overflow-x: clip;" }, [
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
                      _hoisted_6,
                      _createElementVNode("div", _hoisted_7, _toDisplayString(_unref(i18n).ts._initialTutorial._landing.title), 1 /* TEXT */),
                      _createElementVNode("div", null, _toDisplayString(_unref(i18n).ts._initialTutorial._landing.description), 1 /* TEXT */),
                      _createVNode(MkButton, {
                        primary: "",
                        rounded: "",
                        gradate: "",
                        style: "margin: 16px auto 0 auto;",
                        onClick: _cache[2] || (_cache[2] = ($event: any) => (page.value++))
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts._initialTutorial.launchTutorial), 1 /* TEXT */),
                          _createTextVNode(" "),
                          _hoisted_8
                        ]),
                        _: 1 /* STABLE */
                      }),
                      _createVNode(MkButton, {
                        style: "margin: 0 auto;",
                        transparent: "",
                        rounded: "",
                        onClick: _cache[3] || (_cache[3] = ($event: any) => (close(true)))
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.close), 1 /* TEXT */)
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
                        _createVNode(XNote, { phase: "aboutNote" })
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          (__props.initialPage !== 1)
                            ? (_openBlock(), _createBlock(MkButton, {
                              key: 0,
                              rounded: "",
                              onClick: _cache[4] || (_cache[4] = ($event: any) => (page.value--))
                            }, {
                              default: _withCtx(() => [
                                _hoisted_9,
                                _createTextVNode(" "),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            onClick: _cache[5] || (_cache[5] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_10
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
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(XNote, {
                            phase: "howToReact",
                            onReacted: _cache[6] || (_cache[6] = ($event: any) => (isReactionTutorialPushed.value = true))
                          }),
                          (!isReactionTutorialPushed.value)
                            ? (_openBlock(), _createElementBlock("div", { key: 0 }, _toDisplayString(_unref(i18n).ts._initialTutorial._reaction.reactToContinue), 1 /* TEXT */))
                            : _createCommentVNode("v-if", true)
                        ])
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          (__props.initialPage !== 2)
                            ? (_openBlock(), _createBlock(MkButton, {
                              key: 0,
                              rounded: "",
                              onClick: _cache[7] || (_cache[7] = ($event: any) => (page.value--))
                            }, {
                              default: _withCtx(() => [
                                _hoisted_11,
                                _createTextVNode(" "),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            disabled: !isReactionTutorialPushed.value,
                            onClick: _cache[8] || (_cache[8] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_12
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
                      class: _normalizeClass(_ctx.$style.pageRoot)
                    }, [
                      _createElementVNode("div", {
                        style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;",
                        class: _normalizeClass(["_spacer", _ctx.$style.pageMain])
                      }, [
                        _createVNode(XTimeline)
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          (__props.initialPage !== 3)
                            ? (_openBlock(), _createBlock(MkButton, {
                              key: 0,
                              rounded: "",
                              onClick: _cache[9] || (_cache[9] = ($event: any) => (page.value--))
                            }, {
                              default: _withCtx(() => [
                                _hoisted_13,
                                _createTextVNode(" "),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            onClick: _cache[10] || (_cache[10] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_14
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ], 2 /* CLASS */)
                    ], 2 /* CLASS */)
                  ]))
                : (page.value === 4)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 4,
                    style: "height: 100cqh; overflow: auto;"
                  }, [
                    _createElementVNode("div", {
                      class: _normalizeClass(_ctx.$style.pageRoot)
                    }, [
                      _createElementVNode("div", {
                        style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;",
                        class: _normalizeClass(["_spacer", _ctx.$style.pageMain])
                      }, [
                        _createVNode(XPostNote)
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          (__props.initialPage !== 3)
                            ? (_openBlock(), _createBlock(MkButton, {
                              key: 0,
                              rounded: "",
                              onClick: _cache[11] || (_cache[11] = ($event: any) => (page.value--))
                            }, {
                              default: _withCtx(() => [
                                _hoisted_15,
                                _createTextVNode(" "),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            onClick: _cache[12] || (_cache[12] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_16
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ], 2 /* CLASS */)
                    ], 2 /* CLASS */)
                  ]))
                : (page.value === 5)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 5,
                    style: "height: 100cqh; overflow: auto;"
                  }, [
                    _createElementVNode("div", {
                      class: _normalizeClass(_ctx.$style.pageRoot)
                    }, [
                      _createElementVNode("div", {
                        style: "--MI_SPACER-min: 20px; --MI_SPACER-max: 28px;",
                        class: _normalizeClass(["_spacer", _ctx.$style.pageMain])
                      }, [
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(XSensitive, {
                            onSucceeded: _cache[13] || (_cache[13] = ($event: any) => (isSensitiveTutorialSucceeded.value = true))
                          }),
                          (!isSensitiveTutorialSucceeded.value)
                            ? (_openBlock(), _createElementBlock("div", { key: 0 }, _toDisplayString(_unref(i18n).ts._initialTutorial._howToMakeAttachmentsSensitive.doItToContinue), 1 /* TEXT */))
                            : _createCommentVNode("v-if", true)
                        ])
                      ], 2 /* CLASS */),
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.pageFooter)
                      }, [
                        _createElementVNode("div", { class: "_buttonsCenter" }, [
                          (__props.initialPage !== 2)
                            ? (_openBlock(), _createBlock(MkButton, {
                              key: 0,
                              rounded: "",
                              onClick: _cache[14] || (_cache[14] = ($event: any) => (page.value--))
                            }, {
                              default: _withCtx(() => [
                                _hoisted_17,
                                _createTextVNode(" "),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(MkButton, {
                            primary: "",
                            rounded: "",
                            gradate: "",
                            disabled: !isSensitiveTutorialSucceeded.value,
                            onClick: _cache[15] || (_cache[15] = ($event: any) => (page.value++))
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.continue), 1 /* TEXT */),
                              _createTextVNode(" "),
                              _hoisted_18
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ], 2 /* CLASS */)
                    ], 2 /* CLASS */)
                  ]))
                : (page.value === 6)
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 6,
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
                        _createElementVNode("div", _hoisted_20, _toDisplayString(_unref(i18n).ts._initialTutorial._done.title), 1 /* TEXT */),
                        _createVNode(_component_I18n, {
                          src: _unref(i18n).ts._initialTutorial._done.description,
                          tag: "div",
                          style: "padding: 0 16px;"
                        }, {
                          link: _withCtx(() => [
                            _createElementVNode("a", _hoisted_21, _toDisplayString(_unref(i18n).ts.help), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        }),
                        _createElementVNode("div", null, _toDisplayString(_unref(i18n).tsx._initialAccountSetting.haveFun({ name: _unref(instance).name ?? _unref(host) })), 1 /* TEXT */),
                        _createElementVNode("div", {
                          class: "_buttonsCenter",
                          style: "margin-top: 16px;"
                        }, [
                          (__props.initialPage !== 4)
                            ? (_openBlock(), _createBlock(MkButton, {
                              key: 0,
                              rounded: "",
                              onClick: _cache[16] || (_cache[16] = ($event: any) => (page.value--))
                            }, {
                              default: _withCtx(() => [
                                _hoisted_22,
                                _createTextVNode(" "),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.goBack), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(MkButton, {
                            rounded: "",
                            primary: "",
                            gradate: "",
                            onClick: _cache[17] || (_cache[17] = ($event: any) => (close(false)))
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
