import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-bolt" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-bolt" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-recycle" })
import { ref, computed } from 'vue'
import * as os from '@/os.js'
import { misskeyApi } from '@/utility/misskey-api.js'
import { fetchInstance } from '@/instance.js'
import { i18n } from '@/i18n.js'
import { definePage } from '@/page.js'
import MkSwitch from '@/components/MkSwitch.vue'
import MkFolder from '@/components/MkFolder.vue'
import MkInput from '@/components/MkInput.vue'
import MkLink from '@/components/MkLink.vue'
import { useForm } from '@/composables/use-form.js'
import MkFormFooter from '@/components/MkFormFooter.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'performance',
  async setup(__props) {

const meta = await misskeyApi('admin/meta');
const enableServerMachineStats = ref(meta.enableServerMachineStats);
const enableIdenticonGeneration = ref(meta.enableIdenticonGeneration);
const enableChartsForRemoteUser = ref(meta.enableChartsForRemoteUser);
const enableStatsForFederatedInstances = ref(meta.enableStatsForFederatedInstances);
const enableChartsForFederatedInstances = ref(meta.enableChartsForFederatedInstances);
const showRoleBadgesOfRemoteUsers = ref(meta.showRoleBadgesOfRemoteUsers);
function onChange_enableServerMachineStats(value: boolean) {
	os.apiWithDialog('admin/update-meta', {
		enableServerMachineStats: value,
	}).then(() => {
		fetchInstance(true);
	});
}
function onChange_enableIdenticonGeneration(value: boolean) {
	os.apiWithDialog('admin/update-meta', {
		enableIdenticonGeneration: value,
	}).then(() => {
		fetchInstance(true);
	});
}
function onChange_enableChartsForRemoteUser(value: boolean) {
	os.apiWithDialog('admin/update-meta', {
		enableChartsForRemoteUser: value,
	}).then(() => {
		fetchInstance(true);
	});
}
function onChange_enableStatsForFederatedInstances(value: boolean) {
	os.apiWithDialog('admin/update-meta', {
		enableStatsForFederatedInstances: value,
	}).then(() => {
		fetchInstance(true);
	});
}
function onChange_enableChartsForFederatedInstances(value: boolean) {
	os.apiWithDialog('admin/update-meta', {
		enableChartsForFederatedInstances: value,
	}).then(() => {
		fetchInstance(true);
	});
}
function onChange_showRoleBadgesOfRemoteUsers(value: boolean) {
	os.apiWithDialog('admin/update-meta', {
		showRoleBadgesOfRemoteUsers: value,
	}).then(() => {
		fetchInstance(true);
	});
}
const fttForm = useForm({
	enableFanoutTimeline: meta.enableFanoutTimeline,
	enableFanoutTimelineDbFallback: meta.enableFanoutTimelineDbFallback,
	perLocalUserUserTimelineCacheMax: meta.perLocalUserUserTimelineCacheMax,
	perRemoteUserUserTimelineCacheMax: meta.perRemoteUserUserTimelineCacheMax,
	perUserHomeTimelineCacheMax: meta.perUserHomeTimelineCacheMax,
	perUserListTimelineCacheMax: meta.perUserListTimelineCacheMax,
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		enableFanoutTimeline: state.enableFanoutTimeline,
		enableFanoutTimelineDbFallback: state.enableFanoutTimelineDbFallback,
		perLocalUserUserTimelineCacheMax: state.perLocalUserUserTimelineCacheMax,
		perRemoteUserUserTimelineCacheMax: state.perRemoteUserUserTimelineCacheMax,
		perUserHomeTimelineCacheMax: state.perUserHomeTimelineCacheMax,
		perUserListTimelineCacheMax: state.perUserListTimelineCacheMax,
	});
	fetchInstance(true);
});
const rbtForm = useForm({
	enableReactionsBuffering: meta.enableReactionsBuffering,
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		enableReactionsBuffering: state.enableReactionsBuffering,
	});
	fetchInstance(true);
});
const remoteNotesCleaningForm = useForm({
	enableRemoteNotesCleaning: meta.enableRemoteNotesCleaning,
	remoteNotesCleaningExpiryDaysForEachNotes: meta.remoteNotesCleaningExpiryDaysForEachNotes,
	remoteNotesCleaningMaxProcessingDurationInMinutes: meta.remoteNotesCleaningMaxProcessingDurationInMinutes,
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		enableRemoteNotesCleaning: state.enableRemoteNotesCleaning,
		remoteNotesCleaningExpiryDaysForEachNotes: state.remoteNotesCleaningExpiryDaysForEachNotes,
		remoteNotesCleaningMaxProcessingDurationInMinutes: state.remoteNotesCleaningMaxProcessingDurationInMinutes,
	});
	fetchInstance(true);
});
const headerActions = computed(() => []);
const headerTabs = computed(() => []);
definePage(() => ({
	title: i18n.ts.performance,
	icon: 'ti ti-bolt',
}));

return (_ctx: any,_cache: any) => {
  const _component_PageWithHeader = _resolveComponent("PageWithHeader")
  const _component_SearchMarker = _resolveComponent("SearchMarker")
  const _component_SearchLabel = _resolveComponent("SearchLabel")
  const _component_SearchIcon = _resolveComponent("SearchIcon")
  const _component_SearchText = _resolveComponent("SearchText")

  return (_openBlock(), _createBlock(_component_PageWithHeader, {
      actions: headerActions.value,
      tabs: headerTabs.value
    }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: "_spacer",
          style: "--MI_SPACER-w: 700px; --MI_SPACER-min: 16px; --MI_SPACER-max: 32px;"
        }, [
          _createVNode(_component_SearchMarker, {
            path: "/admin/performance",
            label: _unref(i18n).ts.performance,
            keywords: ['performance'],
            icon: "ti ti-bolt"
          }, {
            default: _withCtx(() => [
              _createElementVNode("div", { class: "_gaps" }, [
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", {
                      class: "_panel",
                      style: "padding: 16px;"
                    }, [
                      _createVNode(MkSwitch, {
                        onChange: onChange_enableServerMachineStats,
                        modelValue: enableServerMachineStats.value,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => ((enableServerMachineStats).value = $event))
                      }, {
                        label: _withCtx(() => [
                          _createVNode(_component_SearchLabel, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.enableServerMachineStats), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        caption: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.turnOffToImprovePerformance), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", {
                      class: "_panel",
                      style: "padding: 16px;"
                    }, [
                      _createVNode(MkSwitch, {
                        onChange: onChange_enableIdenticonGeneration,
                        modelValue: enableIdenticonGeneration.value,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event: any) => ((enableIdenticonGeneration).value = $event))
                      }, {
                        label: _withCtx(() => [
                          _createVNode(_component_SearchLabel, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.enableIdenticonGeneration), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        caption: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.turnOffToImprovePerformance), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", {
                      class: "_panel",
                      style: "padding: 16px;"
                    }, [
                      _createVNode(MkSwitch, {
                        onChange: onChange_enableChartsForRemoteUser,
                        modelValue: enableChartsForRemoteUser.value,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((enableChartsForRemoteUser).value = $event))
                      }, {
                        label: _withCtx(() => [
                          _createVNode(_component_SearchLabel, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.enableChartsForRemoteUser), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        caption: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.turnOffToImprovePerformance), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", {
                      class: "_panel",
                      style: "padding: 16px;"
                    }, [
                      _createVNode(MkSwitch, {
                        onChange: onChange_enableStatsForFederatedInstances,
                        modelValue: enableStatsForFederatedInstances.value,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((enableStatsForFederatedInstances).value = $event))
                      }, {
                        label: _withCtx(() => [
                          _createVNode(_component_SearchLabel, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.enableStatsForFederatedInstances), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        caption: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.turnOffToImprovePerformance), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", {
                      class: "_panel",
                      style: "padding: 16px;"
                    }, [
                      _createVNode(MkSwitch, {
                        onChange: onChange_enableChartsForFederatedInstances,
                        modelValue: enableChartsForFederatedInstances.value,
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((enableChartsForFederatedInstances).value = $event))
                      }, {
                        label: _withCtx(() => [
                          _createVNode(_component_SearchLabel, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.enableChartsForFederatedInstances), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        caption: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.turnOffToImprovePerformance), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createElementVNode("div", {
                      class: "_panel",
                      style: "padding: 16px;"
                    }, [
                      _createVNode(MkSwitch, {
                        onChange: onChange_showRoleBadgesOfRemoteUsers,
                        modelValue: showRoleBadgesOfRemoteUsers.value,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event: any) => ((showRoleBadgesOfRemoteUsers).value = $event))
                      }, {
                        label: _withCtx(() => [
                          _createVNode(_component_SearchLabel, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.showRoleBadgesOfRemoteUsers), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        caption: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts.turnOffToImprovePerformance), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ])
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createVNode(MkFolder, { defaultOpen: true }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_1
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Misskey® Fan-out Timeline Technology™ (FTT)")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(fttForm).savedState.enableFanoutTimeline)
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createTextVNode("Enabled")
                          ], 64 /* STABLE_FRAGMENT */))
                          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createTextVNode("Disabled")
                          ], 64 /* STABLE_FRAGMENT */)),
                        (_unref(fttForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(fttForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(_component_SearchMarker, null, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(fttForm).state.enableFanoutTimeline,
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event: any) => ((_unref(fttForm).state.enableFanoutTimeline) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.enable), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(fttForm).modifiedStates.enableFanoutTimeline)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createElementVNode("div", null, [
                                    _createVNode(_component_SearchText, null, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.fanoutTimelineDescription), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ]),
                                  _createElementVNode("div", null, [
                                    _createVNode(MkLink, {
                                      target: "_blank",
                                      url: "https://misskey-hub.net/docs/for-admin/features/ftt/"
                                    }, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts.details), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ])
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          (_unref(fttForm).state.enableFanoutTimeline)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                              _createVNode(_component_SearchMarker, { keywords: ['db', 'database', 'fallback'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkSwitch, {
                                    modelValue: _unref(fttForm).state.enableFanoutTimelineDbFallback,
                                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event: any) => ((_unref(fttForm).state.enableFanoutTimelineDbFallback) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.fanoutTimelineDbFallback), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(fttForm).modifiedStates.enableFanoutTimelineDbFallback)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    caption: _withCtx(() => [
                                      _createVNode(_component_SearchText, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.fanoutTimelineDbFallbackDescription), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      })
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, null, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "number",
                                    modelValue: _unref(fttForm).state.perLocalUserUserTimelineCacheMax,
                                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event: any) => ((_unref(fttForm).state.perLocalUserUserTimelineCacheMax) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode("perLocalUserUserTimelineCacheMax")
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(fttForm).modifiedStates.perLocalUserUserTimelineCacheMax)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, null, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "number",
                                    modelValue: _unref(fttForm).state.perRemoteUserUserTimelineCacheMax,
                                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event: any) => ((_unref(fttForm).state.perRemoteUserUserTimelineCacheMax) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode("perRemoteUserUserTimelineCacheMax")
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(fttForm).modifiedStates.perRemoteUserUserTimelineCacheMax)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, null, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "number",
                                    modelValue: _unref(fttForm).state.perUserHomeTimelineCacheMax,
                                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event: any) => ((_unref(fttForm).state.perUserHomeTimelineCacheMax) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode("perUserHomeTimelineCacheMax")
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(fttForm).modifiedStates.perUserHomeTimelineCacheMax)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, null, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "number",
                                    modelValue: _unref(fttForm).state.perUserListTimelineCacheMax,
                                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event: any) => ((_unref(fttForm).state.perUserListTimelineCacheMax) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode("perUserListTimelineCacheMax")
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(fttForm).modifiedStates.perUserListTimelineCacheMax)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ], 64 /* STABLE_FRAGMENT */))
                            : _createCommentVNode("v-if", true)
                        ])
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createVNode(MkFolder, { defaultOpen: true }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_2
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Misskey® Reactions Boost Technology™ (RBT)")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(rbtForm).savedState.enableReactionsBuffering)
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createTextVNode("Enabled")
                          ], 64 /* STABLE_FRAGMENT */))
                          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createTextVNode("Disabled")
                          ], 64 /* STABLE_FRAGMENT */)),
                        (_unref(rbtForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(rbtForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps_m" }, [
                          _createVNode(_component_SearchMarker, null, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(rbtForm).state.enableReactionsBuffering,
                                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event: any) => ((_unref(rbtForm).state.enableReactionsBuffering) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.enable), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(rbtForm).modifiedStates.enableReactionsBuffering)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.reactionsBufferingDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          })
                        ])
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, null, {
                  default: _withCtx(() => [
                    _createVNode(MkFolder, { defaultOpen: true }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_3
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Remote Notes Cleaning (仮)")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(remoteNotesCleaningForm).savedState.enableRemoteNotesCleaning)
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _createTextVNode("Enabled")
                          ], 64 /* STABLE_FRAGMENT */))
                          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createTextVNode("Disabled")
                          ], 64 /* STABLE_FRAGMENT */)),
                        (_unref(remoteNotesCleaningForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(remoteNotesCleaningForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps_m" }, [
                          _createVNode(MkSwitch, {
                            modelValue: _unref(remoteNotesCleaningForm).state.enableRemoteNotesCleaning,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event: any) => ((_unref(remoteNotesCleaningForm).state.enableRemoteNotesCleaning) = $event))
                          }, {
                            label: _withCtx(() => [
                              _createVNode(_component_SearchLabel, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts.enable), 1 /* TEXT */)
                                ]),
                                _: 1 /* STABLE */
                              }),
                              (_unref(remoteNotesCleaningForm).modifiedStates.enableRemoteNotesCleaning)
                                ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: "_modified"
                                }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                : _createCommentVNode("v-if", true)
                            ]),
                            caption: _withCtx(() => [
                              _createVNode(_component_SearchText, null, {
                                default: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.remoteNotesCleaning_description), 1 /* TEXT */)
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          (_unref(remoteNotesCleaningForm).state.enableRemoteNotesCleaning)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                              _createVNode(MkInput, {
                                type: "number",
                                modelValue: _unref(remoteNotesCleaningForm).state.remoteNotesCleaningExpiryDaysForEachNotes,
                                "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event: any) => ((_unref(remoteNotesCleaningForm).state.remoteNotesCleaningExpiryDaysForEachNotes) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.remoteNotesCleaningExpiryDaysForEachNotes), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  _createTextVNode(" ("),
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts.inDays), 1 /* TEXT */),
                                  _createTextVNode(")"),
                                  (_unref(remoteNotesCleaningForm).modifiedStates.remoteNotesCleaningExpiryDaysForEachNotes)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                suffix: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts._time.day), 1 /* TEXT */)
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(MkInput, {
                                type: "number",
                                modelValue: _unref(remoteNotesCleaningForm).state.remoteNotesCleaningMaxProcessingDurationInMinutes,
                                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event: any) => ((_unref(remoteNotesCleaningForm).state.remoteNotesCleaningMaxProcessingDurationInMinutes) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.remoteNotesCleaningMaxProcessingDuration), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  _createTextVNode(" ("),
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts.inMinutes), 1 /* TEXT */),
                                  _createTextVNode(")"),
                                  (_unref(remoteNotesCleaningForm).modifiedStates.remoteNotesCleaningMaxProcessingDurationInMinutes)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                suffix: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts._time.minute), 1 /* TEXT */)
                                ]),
                                _: 1 /* STABLE */
                              })
                            ], 64 /* STABLE_FRAGMENT */))
                            : _createCommentVNode("v-if", true)
                        ])
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                })
              ])
            ]),
            _: 1 /* STABLE */
          })
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["actions", "tabs"]))
}
}

})
