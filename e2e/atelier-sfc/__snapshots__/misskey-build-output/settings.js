import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-info-circle" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-mail" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-link" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-link" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-link" })
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-link" })
const _hoisted_7 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-link" })
const _hoisted_8 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-user-star" })
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-world-cog" })
const _hoisted_10 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_11 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_12 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-ad" })
const _hoisted_13 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-world-search" })
const _hoisted_14 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-planet" })
const _hoisted_15 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-list" })
const _hoisted_16 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-plus" })
const _hoisted_17 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-x" })
const _hoisted_18 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-ghost" })
import { computed } from 'vue'
import MkSwitch from '@/components/MkSwitch.vue'
import MkInput from '@/components/MkInput.vue'
import MkTextarea from '@/components/MkTextarea.vue'
import MkInfo from '@/components/MkInfo.vue'
import FormSplit from '@/components/form/split.vue'
import * as os from '@/os.js'
import { misskeyApi } from '@/utility/misskey-api.js'
import { fetchInstance, instance } from '@/instance.js'
import { i18n } from '@/i18n.js'
import { definePage } from '@/page.js'
import MkButton from '@/components/MkButton.vue'
import MkFolder from '@/components/MkFolder.vue'
import { useForm } from '@/composables/use-form.js'
import MkFormFooter from '@/components/MkFormFooter.vue'
import MkRadios from '@/components/MkRadios.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'settings',
  async setup(__props) {

const meta = await misskeyApi('admin/meta');
const proxyAccount = await misskeyApi('users/show', { userId: meta.proxyAccountId });
const infoForm = useForm({
	name: meta.name ?? '',
	shortName: meta.shortName ?? '',
	description: meta.description ?? '',
	maintainerName: meta.maintainerName ?? '',
	maintainerEmail: meta.maintainerEmail ?? '',
	tosUrl: meta.tosUrl ?? '',
	privacyPolicyUrl: meta.privacyPolicyUrl ?? '',
	inquiryUrl: meta.inquiryUrl ?? '',
	repositoryUrl: meta.repositoryUrl ?? '',
	impressumUrl: meta.impressumUrl ?? '',
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		name: state.name,
		shortName: state.shortName === '' ? null : state.shortName,
		description: state.description,
		maintainerName: state.maintainerName,
		maintainerEmail: state.maintainerEmail,
		tosUrl: state.tosUrl,
		privacyPolicyUrl: state.privacyPolicyUrl,
		inquiryUrl: state.inquiryUrl,
		repositoryUrl: state.repositoryUrl,
		impressumUrl: state.impressumUrl,
	});
	fetchInstance(true);
});
const pinnedUsersForm = useForm({
	pinnedUsers: meta.pinnedUsers.join('\n'),
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		pinnedUsers: state.pinnedUsers.split('\n'),
	});
	fetchInstance(true);
});
const serviceWorkerForm = useForm({
	enableServiceWorker: meta.enableServiceWorker,
	swPublicKey: meta.swPublickey ?? '',
	swPrivateKey: meta.swPrivateKey ?? '',
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		enableServiceWorker: state.enableServiceWorker,
		swPublicKey: state.swPublicKey,
		swPrivateKey: state.swPrivateKey,
	});
	fetchInstance(true);
});
const adForm = useForm({
	notesPerOneAd: meta.notesPerOneAd,
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		notesPerOneAd: state.notesPerOneAd,
	});
	fetchInstance(true);
});
const urlPreviewForm = useForm({
	urlPreviewEnabled: meta.urlPreviewEnabled,
	urlPreviewAllowRedirect: meta.urlPreviewAllowRedirect,
	urlPreviewTimeout: meta.urlPreviewTimeout,
	urlPreviewMaximumContentLength: meta.urlPreviewMaximumContentLength,
	urlPreviewRequireContentLength: meta.urlPreviewRequireContentLength,
	urlPreviewUserAgent: meta.urlPreviewUserAgent ?? '',
	urlPreviewSummaryProxyUrl: meta.urlPreviewSummaryProxyUrl ?? '',
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		urlPreviewEnabled: state.urlPreviewEnabled,
		urlPreviewAllowRedirect: state.urlPreviewAllowRedirect,
		urlPreviewTimeout: state.urlPreviewTimeout,
		urlPreviewMaximumContentLength: state.urlPreviewMaximumContentLength,
		urlPreviewRequireContentLength: state.urlPreviewRequireContentLength,
		urlPreviewUserAgent: state.urlPreviewUserAgent,
		urlPreviewSummaryProxyUrl: state.urlPreviewSummaryProxyUrl,
	});
	fetchInstance(true);
});
const federationForm = useForm({
	federation: meta.federation,
	federationHosts: meta.federationHosts.join('\n'),
	deliverSuspendedSoftware: meta.deliverSuspendedSoftware,
	signToActivityPubGet: meta.signToActivityPubGet,
	proxyRemoteFiles: meta.proxyRemoteFiles,
	allowExternalApRedirect: meta.allowExternalApRedirect,
	cacheRemoteFiles: meta.cacheRemoteFiles,
	cacheRemoteSensitiveFiles: meta.cacheRemoteSensitiveFiles,
}, async (state) => {
	await os.apiWithDialog('admin/update-meta', {
		federation: state.federation,
		federationHosts: state.federationHosts.split('\n'),
		deliverSuspendedSoftware: state.deliverSuspendedSoftware,
		signToActivityPubGet: state.signToActivityPubGet,
		proxyRemoteFiles: state.proxyRemoteFiles,
		allowExternalApRedirect: state.allowExternalApRedirect,
		cacheRemoteFiles: state.cacheRemoteFiles,
		cacheRemoteSensitiveFiles: state.cacheRemoteSensitiveFiles,
	});
	fetchInstance(true);
});
const proxyAccountForm = useForm({
	description: proxyAccount.description,
}, async (state) => {
	await os.apiWithDialog('admin/update-proxy-account', {
		description: state.description,
	});
	fetchInstance(true);
});
async function openSetupWizard() {
	const { canceled } = await os.confirm({
		type: 'warning',
		title: i18n.ts._serverSettings.restartServerSetupWizardConfirm_title,
		text: i18n.ts._serverSettings.restartServerSetupWizardConfirm_text,
	});
	if (canceled) return;
	const { dispose } = await os.popupAsyncWithDialog(import('@/components/MkServerSetupWizardDialog.vue').then(x => x.default), {
	}, {
		closed: () => dispose(),
	});
}
const headerTabs = computed(() => []);
definePage(() => ({
	title: i18n.ts.general,
	icon: 'ti ti-settings',
}));

return (_ctx: any,_cache: any) => {
  const _component_PageWithHeader = _resolveComponent("PageWithHeader")
  const _component_SearchMarker = _resolveComponent("SearchMarker")
  const _component_SearchIcon = _resolveComponent("SearchIcon")
  const _component_SearchLabel = _resolveComponent("SearchLabel")
  const _component_SearchText = _resolveComponent("SearchText")
  const _directive_panel = _resolveDirective("panel")

  return (_openBlock(), _createBlock(_component_PageWithHeader, { tabs: headerTabs.value }, {
      default: _withCtx(() => [
        _createElementVNode("div", {
          class: "_spacer",
          style: "--MI_SPACER-w: 700px; --MI_SPACER-min: 16px; --MI_SPACER-max: 32px;"
        }, [
          _createVNode(_component_SearchMarker, {
            path: "/admin/settings",
            label: _unref(i18n).ts.general,
            keywords: ['general', 'settings'],
            icon: "ti ti-settings"
          }, {
            default: _withCtx(() => [
              _createElementVNode("div", { class: "_gaps_m" }, [
                _createVNode(_component_SearchMarker, { keywords: ['information', 'meta'] }, {
                  default: _withCtx((slotProps) => [
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
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.info), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(infoForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(infoForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(_component_SearchMarker, { keywords: ['name'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                modelValue: _unref(infoForm).state.name,
                                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => ((_unref(infoForm).state.name) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.instanceName), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.name)
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
                          _createVNode(_component_SearchMarker, { keywords: ['shortName'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                modelValue: _unref(infoForm).state.shortName,
                                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event: any) => ((_unref(infoForm).state.shortName) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.shortName), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  _createTextVNode(" ("),
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts.optional), 1 /* TEXT */),
                                  _createTextVNode(")"),
                                  (_unref(infoForm).modifiedStates.shortName)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.shortNameDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['description'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkTextarea, {
                                modelValue: _unref(infoForm).state.description,
                                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((_unref(infoForm).state.description) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.instanceDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.description)
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
                          _createVNode(FormSplit, { minWidth: 300 }, {
                            default: _withCtx(() => [
                              _createVNode(_component_SearchMarker, { keywords: ['maintainer', 'name'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    modelValue: _unref(infoForm).state.maintainerName,
                                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((_unref(infoForm).state.maintainerName) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts.maintainerName), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(infoForm).modifiedStates.maintainerName)
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
                              _createVNode(_component_SearchMarker, { keywords: ['maintainer', 'email', 'contact'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "email",
                                    modelValue: _unref(infoForm).state.maintainerEmail,
                                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((_unref(infoForm).state.maintainerEmail) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts.maintainerEmail), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(infoForm).modifiedStates.maintainerEmail)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    prefix: _withCtx(() => [
                                      _hoisted_2
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['tos', 'termsOfService'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                type: "url",
                                modelValue: _unref(infoForm).state.tosUrl,
                                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event: any) => ((_unref(infoForm).state.tosUrl) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.tosUrl), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.tosUrl)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                prefix: _withCtx(() => [
                                  _hoisted_3
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['privacyPolicy'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                type: "url",
                                modelValue: _unref(infoForm).state.privacyPolicyUrl,
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event: any) => ((_unref(infoForm).state.privacyPolicyUrl) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.privacyPolicyUrl), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.privacyPolicyUrl)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                prefix: _withCtx(() => [
                                  _hoisted_4
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['inquiry', 'contact'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                type: "url",
                                modelValue: _unref(infoForm).state.inquiryUrl,
                                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event: any) => ((_unref(infoForm).state.inquiryUrl) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.inquiryUrl), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.inquiryUrl)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.inquiryUrlDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                prefix: _withCtx(() => [
                                  _hoisted_5
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['repository', 'url'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                type: "url",
                                modelValue: _unref(infoForm).state.repositoryUrl,
                                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event: any) => ((_unref(infoForm).state.repositoryUrl) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.repositoryUrl), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.repositoryUrl)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.repositoryUrlDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                prefix: _withCtx(() => [
                                  _hoisted_6
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          (!_unref(instance).providesTarball && !_unref(infoForm).state.repositoryUrl)
                            ? (_openBlock(), _createBlock(MkInfo, {
                              key: 0,
                              warn: ""
                            }, {
                              default: _withCtx(() => [
                                _createTextVNode("\n\t\t\t\t\t\t\t\t"),
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.repositoryUrlOrTarballRequired), 1 /* TEXT */),
                                _createTextVNode("\n\t\t\t\t\t\t\t")
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true),
                          _createVNode(_component_SearchMarker, { keywords: ['impressum', 'legalNotice'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkInput, {
                                type: "url",
                                modelValue: _unref(infoForm).state.impressumUrl,
                                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event: any) => ((_unref(infoForm).state.impressumUrl) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.impressumUrl), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(infoForm).modifiedStates.impressumUrl)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.impressumDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                prefix: _withCtx(() => [
                                  _hoisted_7
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
                _createVNode(_component_SearchMarker, { keywords: ['pinned', 'users'] }, {
                  default: _withCtx((slotProps) => [
                    _createVNode(MkFolder, { defaultOpen: slotProps.isParentOfTarget }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_8
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.pinnedUsers), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(pinnedUsersForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(pinnedUsersForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createVNode(MkTextarea, {
                          modelValue: _unref(pinnedUsersForm).state.pinnedUsers,
                          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event: any) => ((_unref(pinnedUsersForm).state.pinnedUsers) = $event))
                        }, {
                          label: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.pinnedUsers), 1 /* TEXT */),
                            (_unref(pinnedUsersForm).modifiedStates.pinnedUsers)
                              ? (_openBlock(), _createElementBlock("span", {
                                key: 0,
                                class: "_modified"
                              }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                              : _createCommentVNode("v-if", true)
                          ]),
                          caption: _withCtx(() => [
                            _createVNode(_component_SearchText, null, {
                              default: _withCtx(() => [
                                _createTextVNode(_toDisplayString(_unref(i18n).ts.pinnedUsersDescription), 1 /* TEXT */)
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, { keywords: ['serviceWorker'] }, {
                  default: _withCtx((slotProps) => [
                    _createVNode(MkFolder, { defaultOpen: slotProps.isParentOfTarget }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_9
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode("ServiceWorker")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(serviceWorkerForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(serviceWorkerForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(_component_SearchMarker, null, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(serviceWorkerForm).state.enableServiceWorker,
                                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event: any) => ((_unref(serviceWorkerForm).state.enableServiceWorker) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.enableServiceworker), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(serviceWorkerForm).modifiedStates.enableServiceWorker)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.serviceworkerInfo), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          (_unref(serviceWorkerForm).state.enableServiceWorker)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                              _createVNode(_component_SearchMarker, null, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    modelValue: _unref(serviceWorkerForm).state.swPublicKey,
                                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event: any) => ((_unref(serviceWorkerForm).state.swPublicKey) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode("Public key")
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(serviceWorkerForm).modifiedStates.swPublicKey)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    prefix: _withCtx(() => [
                                      _hoisted_10
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, null, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    modelValue: _unref(serviceWorkerForm).state.swPrivateKey,
                                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event: any) => ((_unref(serviceWorkerForm).state.swPrivateKey) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode("Private key")
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(serviceWorkerForm).modifiedStates.swPrivateKey)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    prefix: _withCtx(() => [
                                      _hoisted_11
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
                _createVNode(_component_SearchMarker, { keywords: ['ads'] }, {
                  default: _withCtx((slotProps) => [
                    _createVNode(MkFolder, { defaultOpen: slotProps.isParentOfTarget }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_12
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts._ad.adsSettings), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(adForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(adForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createElementVNode("div", { class: "_gaps_s" }, [
                            _createVNode(_component_SearchMarker, null, {
                              default: _withCtx(() => [
                                _createVNode(MkInput, {
                                  min: 0,
                                  type: "number",
                                  modelValue: _unref(adForm).state.notesPerOneAd,
                                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event: any) => ((_unref(adForm).state.notesPerOneAd) = $event))
                                }, {
                                  label: _withCtx(() => [
                                    _createVNode(_component_SearchLabel, null, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts._ad.notesPerOneAd), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    }),
                                    (_unref(adForm).modifiedStates.notesPerOneAd)
                                      ? (_openBlock(), _createElementBlock("span", {
                                        key: 0,
                                        class: "_modified"
                                      }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                      : _createCommentVNode("v-if", true)
                                  ]),
                                  caption: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(_unref(i18n).ts._ad.setZeroToDisable), 1 /* TEXT */)
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            }),
                            (_unref(adForm).state.notesPerOneAd > 0 && _unref(adForm).state.notesPerOneAd < 20)
                              ? (_openBlock(), _createBlock(MkInfo, {
                                key: 0,
                                warn: true
                              }, {
                                default: _withCtx(() => [
                                  _createTextVNode("\n\t\t\t\t\t\t\t\t\t"),
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts._ad.adsTooClose), 1 /* TEXT */),
                                  _createTextVNode("\n\t\t\t\t\t\t\t\t")
                                ]),
                                _: 1 /* STABLE */
                              }))
                              : _createCommentVNode("v-if", true)
                          ])
                        ])
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, { keywords: ['url', 'preview'] }, {
                  default: _withCtx((slotProps) => [
                    _createVNode(MkFolder, { defaultOpen: slotProps.isParentOfTarget }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_13
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.title), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(urlPreviewForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(urlPreviewForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(_component_SearchMarker, null, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(urlPreviewForm).state.urlPreviewEnabled,
                                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewEnabled) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.enable), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(urlPreviewForm).modifiedStates.urlPreviewEnabled)
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
                          (_unref(urlPreviewForm).state.urlPreviewEnabled)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                              _createVNode(_component_SearchMarker, { keywords: ['allow', 'redirect'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkSwitch, {
                                    modelValue: _unref(urlPreviewForm).state.urlPreviewAllowRedirect,
                                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewAllowRedirect) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.allowRedirect), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(urlPreviewForm).modifiedStates.urlPreviewAllowRedirect)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    caption: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.allowRedirectDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, { keywords: ['contentLength'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkSwitch, {
                                    modelValue: _unref(urlPreviewForm).state.urlPreviewRequireContentLength,
                                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewRequireContentLength) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.requireContentLength), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(urlPreviewForm).modifiedStates.urlPreviewRequireContentLength)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    caption: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.requireContentLengthDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, { keywords: ['contentLength'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "number",
                                    modelValue: _unref(urlPreviewForm).state.urlPreviewMaximumContentLength,
                                    "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewMaximumContentLength) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.maximumContentLength), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(urlPreviewForm).modifiedStates.urlPreviewMaximumContentLength)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    caption: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.maximumContentLengthDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, { keywords: ['timeout'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "number",
                                    modelValue: _unref(urlPreviewForm).state.urlPreviewTimeout,
                                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewTimeout) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.timeout), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(urlPreviewForm).modifiedStates.urlPreviewTimeout)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    caption: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.timeoutDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createVNode(_component_SearchMarker, { keywords: ['userAgent'] }, {
                                default: _withCtx(() => [
                                  _createVNode(MkInput, {
                                    type: "text",
                                    modelValue: _unref(urlPreviewForm).state.urlPreviewUserAgent,
                                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewUserAgent) = $event))
                                  }, {
                                    label: _withCtx(() => [
                                      _createVNode(_component_SearchLabel, null, {
                                        default: _withCtx(() => [
                                          _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.userAgent), 1 /* TEXT */)
                                        ]),
                                        _: 1 /* STABLE */
                                      }),
                                      (_unref(urlPreviewForm).modifiedStates.urlPreviewUserAgent)
                                        ? (_openBlock(), _createElementBlock("span", {
                                          key: 0,
                                          class: "_modified"
                                        }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                        : _createCommentVNode("v-if", true)
                                    ]),
                                    caption: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.userAgentDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              }),
                              _createElementVNode("div", null, [
                                _createVNode(_component_SearchMarker, { keywords: ['proxy'] }, {
                                  default: _withCtx(() => [
                                    _createVNode(MkInput, {
                                      type: "text",
                                      modelValue: _unref(urlPreviewForm).state.urlPreviewSummaryProxyUrl,
                                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event: any) => ((_unref(urlPreviewForm).state.urlPreviewSummaryProxyUrl) = $event))
                                    }, {
                                      label: _withCtx(() => [
                                        _createVNode(_component_SearchLabel, null, {
                                          default: _withCtx(() => [
                                            _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.summaryProxy), 1 /* TEXT */)
                                          ]),
                                          _: 1 /* STABLE */
                                        }),
                                        (_unref(urlPreviewForm).modifiedStates.urlPreviewSummaryProxyUrl)
                                          ? (_openBlock(), _createElementBlock("span", {
                                            key: 0,
                                            class: "_modified"
                                          }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                          : _createCommentVNode("v-if", true)
                                      ]),
                                      caption: _withCtx(() => [
                                        _createTextVNode("[" + _toDisplayString(_unref(i18n).ts.notUsePleaseLeaveBlank) + "] " + _toDisplayString(_unref(i18n).ts._urlPreviewSetting.summaryProxyDescription), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ]),
                                  _: 1 /* STABLE */
                                }),
                                _createElementVNode("div", {
                                  class: _normalizeClass(_ctx.$style.subCaption)
                                }, [
                                  _createTextVNode("\n\t\t\t\t\t\t\t\t\t\t"),
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts._urlPreviewSetting.summaryProxyDescription2), 1 /* TEXT */),
                                  _createTextVNode("\n\t\t\t\t\t\t\t\t\t\t"),
                                  _createElementVNode("ul", { style: "padding-left: 20px; margin: 4px 0" }, [
                                    _createElementVNode("li", null, _toDisplayString(_unref(i18n).ts._urlPreviewSetting.timeout) + " / key:timeout", 1 /* TEXT */),
                                    _createElementVNode("li", null, _toDisplayString(_unref(i18n).ts._urlPreviewSetting.maximumContentLength) + " / key:contentLengthLimit", 1 /* TEXT */),
                                    _createElementVNode("li", null, _toDisplayString(_unref(i18n).ts._urlPreviewSetting.requireContentLength) + " / key:contentLengthRequired", 1 /* TEXT */),
                                    _createElementVNode("li", null, _toDisplayString(_unref(i18n).ts._urlPreviewSetting.userAgent) + " / key:userAgent", 1 /* TEXT */)
                                  ])
                                ], 2 /* CLASS */)
                              ])
                            ], 64 /* STABLE_FRAGMENT */))
                            : _createCommentVNode("v-if", true)
                        ])
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, { keywords: ['federation'] }, {
                  default: _withCtx((slotProps) => [
                    _createVNode(MkFolder, { defaultOpen: slotProps.isParentOfTarget }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_14
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.federation), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(federationForm).savedState.federation === 'all')
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                            _toDisplayString(_unref(i18n).ts.all)
                          ], 64 /* STABLE_FRAGMENT */))
                          : (_unref(federationForm).savedState.federation === 'specified')
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                              _toDisplayString(_unref(i18n).ts.specifyHost)
                            ], 64 /* STABLE_FRAGMENT */))
                          : (_unref(federationForm).savedState.federation === 'none')
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                              _toDisplayString(_unref(i18n).ts.none)
                            ], 64 /* STABLE_FRAGMENT */))
                          : _createCommentVNode("v-if", true),
                        (_unref(federationForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(federationForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(_component_SearchMarker, null, {
                            default: _withCtx(() => [
                              _createVNode(MkRadios, {
                                options: [
  										{ value: 'all', label: _unref(i18n).ts.all },
  										{ value: 'specified', label: _unref(i18n).ts.specifyHost },
  										{ value: 'none', label: _unref(i18n).ts.none },
  									],
                                modelValue: _unref(federationForm).state.federation,
                                "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event: any) => ((_unref(federationForm).state.federation) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.behavior), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(federationForm).modifiedStates.federation)
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
                          _createVNode(_component_SearchMarker, { keywords: ['hosts'] }, {
                            default: _withCtx(() => [
                              (_unref(federationForm).state.federation === 'specified')
                                ? (_openBlock(), _createBlock(MkTextarea, {
                                  key: 0,
                                  modelValue: _unref(federationForm).state.federationHosts,
                                  "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event: any) => ((_unref(federationForm).state.federationHosts) = $event))
                                }, {
                                  label: _withCtx(() => [
                                    _createVNode(_component_SearchLabel, null, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts.federationAllowedHosts), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    }),
                                    (_unref(federationForm).modifiedStates.federationHosts)
                                      ? (_openBlock(), _createElementBlock("span", {
                                        key: 0,
                                        class: "_modified"
                                      }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                      : _createCommentVNode("v-if", true)
                                  ]),
                                  caption: _withCtx(() => [
                                    _createTextVNode(_toDisplayString(_unref(i18n).ts.federationAllowedHostsDescription), 1 /* TEXT */)
                                  ]),
                                  _: 1 /* STABLE */
                                }))
                                : _createCommentVNode("v-if", true)
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['suspended', 'software'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkFolder, null, {
                                icon: _withCtx(() => [
                                  _hoisted_15
                                ]),
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.deliverSuspendedSoftware), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                footer: _withCtx(() => [
                                  _createElementVNode("div", { class: "_buttons" }, [
                                    _createVNode(MkButton, {
                                      onClick: _cache[24] || (_cache[24] = ($event: any) => (_unref(federationForm).state.deliverSuspendedSoftware.push({software: '', versionRange: ''})))
                                    }, {
                                      default: _withCtx(() => [
                                        _hoisted_16,
                                        _createTextVNode(" "),
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts.add), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ])
                                ]),
                                default: _withCtx(() => [
                                  _createElementVNode("div", {
                                    class: _normalizeClass(["_gaps_s", _ctx.$style.metadataRoot])
                                  }, [
                                    _createVNode(MkInfo, null, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.deliverSuspendedSoftwareDescription), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    }),
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_unref(federationForm).state.deliverSuspendedSoftware, (element, index) => {
                                      return (_openBlock(), _createElementBlock("div", {
                                        key: index,
                                        class: _normalizeClass(_ctx.$style.fieldDragItem)
                                      }, [
                                        _createElementVNode("button", {
                                          class: _normalizeClass(["_button", _ctx.$style.dragItemRemove]),
                                          onClick: _cache[25] || (_cache[25] = ($event: any) => (_unref(federationForm).state.deliverSuspendedSoftware.splice(index, 1)))
                                        }, [
                                          _hoisted_17
                                        ], 2 /* CLASS */),
                                        _createElementVNode("div", {
                                          class: _normalizeClass(_ctx.$style.dragItemForm)
                                        }, [
                                          _createVNode(FormSplit, { minWidth: 200 }, {
                                            default: _withCtx(() => [
                                              _createVNode(MkInput, {
                                                small: "",
                                                placeholder: _unref(i18n).ts.softwareName,
                                                modelValue: element.software,
                                                "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event: any) => ((element.software) = $event))
                                              }),
                                              _createVNode(MkInput, {
                                                small: "",
                                                placeholder: _unref(i18n).ts.version,
                                                modelValue: element.versionRange,
                                                "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event: any) => ((element.versionRange) = $event))
                                              })
                                            ]),
                                            _: 1 /* STABLE */
                                          })
                                        ], 2 /* CLASS */)
                                      ], 2 /* CLASS */))
                                    }), 128 /* KEYED_FRAGMENT */))
                                  ], 2 /* CLASS */)
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['sign', 'get'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(federationForm).state.signToActivityPubGet,
                                "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event: any) => ((_unref(federationForm).state.signToActivityPubGet) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.signToActivityPubGet), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(federationForm).modifiedStates.signToActivityPubGet)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.signToActivityPubGet_description), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['proxy', 'remote', 'files'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(federationForm).state.proxyRemoteFiles,
                                "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event: any) => ((_unref(federationForm).state.proxyRemoteFiles) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.proxyRemoteFiles), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(federationForm).modifiedStates.proxyRemoteFiles)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.proxyRemoteFiles_description), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['allow', 'external', 'redirect'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(federationForm).state.allowExternalApRedirect,
                                "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event: any) => ((_unref(federationForm).state.allowExternalApRedirect) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.allowExternalApRedirect), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(federationForm).modifiedStates.allowExternalApRedirect)
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
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts._serverSettings.allowExternalApRedirect_description), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ]),
                                  _createElementVNode("div", null, _toDisplayString(_unref(i18n).ts.needToRestartServerToApply), 1 /* TEXT */)
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['cache', 'remote', 'files'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkSwitch, {
                                modelValue: _unref(federationForm).state.cacheRemoteFiles,
                                "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event: any) => ((_unref(federationForm).state.cacheRemoteFiles) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.cacheRemoteFiles), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  (_unref(federationForm).modifiedStates.cacheRemoteFiles)
                                    ? (_openBlock(), _createElementBlock("span", {
                                      key: 0,
                                      class: "_modified"
                                    }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                caption: _withCtx(() => [
                                  _createVNode(_component_SearchText, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts.cacheRemoteFilesDescription), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  }),
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts.youCanCleanRemoteFilesCache), 1 /* TEXT */)
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }),
                          (_unref(federationForm).state.cacheRemoteFiles)
                            ? (_openBlock(), _createBlock(_component_SearchMarker, {
                              key: 0,
                              keywords: ['cache', 'remote', 'sensitive', 'files']
                            }, {
                              default: _withCtx(() => [
                                _createVNode(MkSwitch, {
                                  modelValue: _unref(federationForm).state.cacheRemoteSensitiveFiles,
                                  "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event: any) => ((_unref(federationForm).state.cacheRemoteSensitiveFiles) = $event))
                                }, {
                                  label: _withCtx(() => [
                                    _createVNode(_component_SearchLabel, null, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts.cacheRemoteSensitiveFiles), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    }),
                                    (_unref(federationForm).modifiedStates.cacheRemoteSensitiveFiles)
                                      ? (_openBlock(), _createElementBlock("span", {
                                        key: 0,
                                        class: "_modified"
                                      }, _toDisplayString(_unref(i18n).ts.modified), 1 /* TEXT */))
                                      : _createCommentVNode("v-if", true)
                                  ]),
                                  caption: _withCtx(() => [
                                    _createVNode(_component_SearchText, null, {
                                      default: _withCtx(() => [
                                        _createTextVNode(_toDisplayString(_unref(i18n).ts.cacheRemoteSensitiveFilesDescription), 1 /* TEXT */)
                                      ]),
                                      _: 1 /* STABLE */
                                    })
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            }))
                            : _createCommentVNode("v-if", true)
                        ])
                      ]),
                      _: 1 /* STABLE */
                    })
                  ]),
                  _: 1 /* STABLE */
                }),
                _createVNode(_component_SearchMarker, { keywords: ['proxy', 'account'] }, {
                  default: _withCtx((slotProps) => [
                    _createVNode(MkFolder, { defaultOpen: slotProps.isParentOfTarget }, {
                      icon: _withCtx(() => [
                        _createVNode(_component_SearchIcon, null, {
                          default: _withCtx(() => [
                            _hoisted_18
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      label: _withCtx(() => [
                        _createVNode(_component_SearchLabel, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_unref(i18n).ts.proxyAccount), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      default: _withCtx(() => [
                        (_unref(proxyAccountForm).modified.value)
                          ? (_openBlock(), _createBlock(MkFormFooter, {
                            key: 0,
                            form: _unref(proxyAccountForm)
                          }))
                          : _createCommentVNode("v-if", true),
                        _createElementVNode("div", { class: "_gaps" }, [
                          _createVNode(MkInfo, null, {
                            default: _withCtx(() => [
                              _createTextVNode(_toDisplayString(_unref(i18n).ts.proxyAccountDescription), 1 /* TEXT */)
                            ]),
                            _: 1 /* STABLE */
                          }),
                          _createVNode(_component_SearchMarker, { keywords: ['description'] }, {
                            default: _withCtx(() => [
                              _createVNode(MkTextarea, {
                                max: 500,
                                tall: "",
                                mfmAutocomplete: "",
                                mfmPreview: true,
                                modelValue: _unref(proxyAccountForm).state.description,
                                "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event: any) => ((_unref(proxyAccountForm).state.description) = $event))
                              }, {
                                label: _withCtx(() => [
                                  _createVNode(_component_SearchLabel, null, {
                                    default: _withCtx(() => [
                                      _createTextVNode(_toDisplayString(_unref(i18n).ts._profile.description), 1 /* TEXT */)
                                    ]),
                                    _: 1 /* STABLE */
                                  })
                                ]),
                                caption: _withCtx(() => [
                                  _createTextVNode(_toDisplayString(_unref(i18n).ts._profile.youCanIncludeHashtags), 1 /* TEXT */)
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
                _createVNode(MkButton, {
                  primary: "",
                  onClick: openSetupWizard
                }, {
                  default: _withCtx(() => [
                    _createTextVNode("\n\t\t\t\t\tOpen setup wizard\n\t\t\t\t")
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
    }, 8 /* PROPS */, ["tabs"]))
}
}

})
