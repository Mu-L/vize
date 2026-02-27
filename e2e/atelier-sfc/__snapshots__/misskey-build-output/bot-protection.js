import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-shield" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("span", null, "ref: ")
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("a", { href: "https://docs.hcaptcha.com/#integration-testing-test-keys", target: "_blank" }, "hCaptcha Developer Guide")
const _hoisted_6 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_7 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_8 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-link" })
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_10 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_11 = /*#__PURE__*/ _createElementVNode("span", null, "ref: ")
const _hoisted_12 = /*#__PURE__*/ _createElementVNode("a", { href: "https://developers.google.com/recaptcha/docs/faq?hl=ja#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do", target: "_blank" }, "reCAPTCHA FAQ")
const _hoisted_13 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_14 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-key" })
const _hoisted_15 = /*#__PURE__*/ _createElementVNode("span", null, "ref: ")
const _hoisted_16 = /*#__PURE__*/ _createElementVNode("a", { href: "https://developers.cloudflare.com/turnstile/troubleshooting/testing/", target: "_blank" }, "Cloudflare Docs")
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import * as Misskey from 'misskey-js'
import type { ApiWithDialogCustomErrors } from '@/os.js'
import MkRadios from '@/components/MkRadios.vue'
import MkInput from '@/components/MkInput.vue'
import FormSlot from '@/components/form/slot.vue'
import * as os from '@/os.js'
import { misskeyApi } from '@/utility/misskey-api.js'
import { fetchInstance } from '@/instance.js'
import { i18n } from '@/i18n.js'
import { useForm } from '@/composables/use-form.js'
import MkFormFooter from '@/components/MkFormFooter.vue'
import MkFolder from '@/components/MkFolder.vue'
import MkInfo from '@/components/MkInfo.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'bot-protection',
  async setup(__props) {

const MkCaptcha = defineAsyncComponent(() => import('@/components/MkCaptcha.vue'));
const errorHandler: ApiWithDialogCustomErrors = {
	// 検証リクエストそのものに失敗
	'0f4fe2f1-2c15-4d6e-b714-efbfcde231cd': {
		title: i18n.ts._captcha._error._requestFailed.title,
		text: i18n.ts._captcha._error._requestFailed.text,
	},
	// 検証リクエストの結果が不正
	'c41c067f-24f3-4150-84b2-b5a3ae8c2214': {
		title: i18n.ts._captcha._error._verificationFailed.title,
		text: i18n.ts._captcha._error._verificationFailed.text,
	},
	// 不明なエラー
	'f868d509-e257-42a9-99c1-42614b031a97': {
		title: i18n.ts._captcha._error._unknown.title,
		text: i18n.ts._captcha._error._unknown.text,
	},
};
const captchaResult = ref<string | null>(null);
const meta = await misskeyApi('admin/captcha/current');
const botProtectionForm = useForm({
	provider: meta.provider,
	hcaptchaSiteKey: meta.hcaptcha.siteKey,
	hcaptchaSecretKey: meta.hcaptcha.secretKey,
	mcaptchaSiteKey: meta.mcaptcha.siteKey,
	mcaptchaSecretKey: meta.mcaptcha.secretKey,
	mcaptchaInstanceUrl: meta.mcaptcha.instanceUrl,
	recaptchaSiteKey: meta.recaptcha.siteKey,
	recaptchaSecretKey: meta.recaptcha.secretKey,
	turnstileSiteKey: meta.turnstile.siteKey,
	turnstileSecretKey: meta.turnstile.secretKey,
}, async (state) => {
	const provider = state.provider;
	if (provider === 'none') {
		await os.apiWithDialog(
			'admin/captcha/save',
			{ provider: provider as Misskey.entities.AdminCaptchaSaveRequest['provider'] },
			undefined,
			errorHandler,
		);
	} else {
		const sitekey = provider === 'hcaptcha'
			? state.hcaptchaSiteKey
			: provider === 'mcaptcha'
				? state.mcaptchaSiteKey
				: provider === 'recaptcha'
					? state.recaptchaSiteKey
					: provider === 'turnstile'
						? state.turnstileSiteKey
						: null;
		const secret = provider === 'hcaptcha'
			? state.hcaptchaSecretKey
			: provider === 'mcaptcha'
				? state.mcaptchaSecretKey
				: provider === 'recaptcha'
					? state.recaptchaSecretKey
					: provider === 'turnstile'
						? state.turnstileSecretKey
						: null;

		await os.apiWithDialog(
			'admin/captcha/save',
			{
				provider: provider as Misskey.entities.AdminCaptchaSaveRequest['provider'],
				sitekey: sitekey,
				secret: secret,
				instanceUrl: state.mcaptchaInstanceUrl,
				captchaResult: captchaResult.value,
			},
			undefined,
			errorHandler,
		);
	}

	await fetchInstance(true);
});
watch(botProtectionForm.state, () => {
	captchaResult.value = null;
});
const canSaving = computed((): boolean => {
	return (botProtectionForm.state.provider === 'none') ||
		(botProtectionForm.state.provider === 'hcaptcha' && !!captchaResult.value) ||
		(botProtectionForm.state.provider === 'mcaptcha' && !!captchaResult.value) ||
		(botProtectionForm.state.provider === 'recaptcha' && !!captchaResult.value) ||
		(botProtectionForm.state.provider === 'turnstile' && !!captchaResult.value) ||
		(botProtectionForm.state.provider === 'testcaptcha' && !!captchaResult.value);
});

return (_ctx: any,_cache: any) => {
  const _component_SearchMarker = _resolveComponent("SearchMarker")
  const _component_SearchIcon = _resolveComponent("SearchIcon")
  const _component_SearchLabel = _resolveComponent("SearchLabel")

  return (_openBlock(), _createBlock(_component_SearchMarker, {
      markerId: "botProtection",
      keywords: ['bot', 'protection', 'captcha', 'hcaptcha', 'mcaptcha', 'recaptcha', 'turnstile']
    }, {
      default: _withCtx(() => [
        _createVNode(MkFolder, null, {
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
                _createTextVNode(_toDisplayString(_unref(i18n).ts.botProtection), 1 /* TEXT */)
              ]),
              _: 1 /* STABLE */
            })
          ]),
          default: _withCtx(() => [
            (_unref(botProtectionForm).savedState.provider === 'hcaptcha')
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                _createTextVNode("hCaptcha")
              ], 64 /* STABLE_FRAGMENT */))
              : (_unref(botProtectionForm).savedState.provider === 'mcaptcha')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                  _createTextVNode("mCaptcha")
                ], 64 /* STABLE_FRAGMENT */))
              : (_unref(botProtectionForm).savedState.provider === 'recaptcha')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                  _createTextVNode("reCAPTCHA")
                ], 64 /* STABLE_FRAGMENT */))
              : (_unref(botProtectionForm).savedState.provider === 'turnstile')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
                  _createTextVNode("Turnstile")
                ], 64 /* STABLE_FRAGMENT */))
              : (_unref(botProtectionForm).savedState.provider === 'testcaptcha')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [
                  _createTextVNode("testCaptcha")
                ], 64 /* STABLE_FRAGMENT */))
              : (_openBlock(), _createElementBlock(_Fragment, { key: 5 }, [
                _toDisplayString(_unref(i18n).ts.none),
                _createTextVNode(" ("),
                _toDisplayString(_unref(i18n).ts.notRecommended),
                _createTextVNode(")")
              ], 64 /* STABLE_FRAGMENT */)),
            (_unref(botProtectionForm).modified.value)
              ? (_openBlock(), _createBlock(MkFormFooter, {
                key: 0,
                canSaving: canSaving.value,
                form: _unref(botProtectionForm)
              }))
              : _createCommentVNode("v-if", true),
            _createElementVNode("div", { class: "_gaps_m" }, [
              _createVNode(MkRadios, {
                options: [
  					{ value: 'none', label: `${_unref(i18n).ts.none} (${_unref(i18n).ts.notRecommended})` },
  					{ value: 'hcaptcha', label: 'hCaptcha' },
  					{ value: 'mcaptcha', label: 'mCaptcha' },
  					{ value: 'recaptcha', label: 'reCAPTCHA' },
  					{ value: 'turnstile', label: 'Turnstile' },
  					{ value: 'testcaptcha', label: 'testCaptcha' },
  				],
                modelValue: _unref(botProtectionForm).state.provider,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => ((_unref(botProtectionForm).state.provider) = $event))
              }),
              (_unref(botProtectionForm).state.provider === 'hcaptcha')
                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                  _createVNode(MkInput, {
                    debounce: "",
                    modelValue: _unref(botProtectionForm).state.hcaptchaSiteKey,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event: any) => ((_unref(botProtectionForm).state.hcaptchaSiteKey) = $event))
                  }, {
                    prefix: _withCtx(() => [
                      _hoisted_2
                    ]),
                    label: _withCtx(() => [
                      _createTextVNode(_toDisplayString(_unref(i18n).ts.hcaptchaSiteKey), 1 /* TEXT */)
                    ]),
                    _: 1 /* STABLE */
                  }),
                  _createVNode(MkInput, {
                    debounce: "",
                    modelValue: _unref(botProtectionForm).state.hcaptchaSecretKey,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((_unref(botProtectionForm).state.hcaptchaSecretKey) = $event))
                  }, {
                    prefix: _withCtx(() => [
                      _hoisted_3
                    ]),
                    label: _withCtx(() => [
                      _createTextVNode(_toDisplayString(_unref(i18n).ts.hcaptchaSecretKey), 1 /* TEXT */)
                    ]),
                    _: 1 /* STABLE */
                  }),
                  (_unref(botProtectionForm).state.hcaptchaSiteKey)
                    ? (_openBlock(), _createBlock(FormSlot, { key: 0 }, {
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts._captcha.verify), 1 /* TEXT */)
                      ]),
                      default: _withCtx(() => [
                        _createVNode(MkCaptcha, {
                          provider: "hcaptcha",
                          sitekey: _unref(botProtectionForm).state.hcaptchaSiteKey,
                          secretKey: _unref(botProtectionForm).state.hcaptchaSecretKey,
                          modelValue: captchaResult.value,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((captchaResult).value = $event))
                        })
                      ]),
                      _: 1 /* STABLE */
                    }))
                    : _createCommentVNode("v-if", true),
                  _createVNode(MkInfo, null, {
                    default: _withCtx(() => [
                      _createElementVNode("div", {
                        class: _normalizeClass(_ctx.$style.captchaInfoMsg)
                      }, [
                        _createElementVNode("div", null, _toDisplayString(_unref(i18n).ts._captcha.testSiteKeyMessage), 1 /* TEXT */),
                        _createElementVNode("div", null, [
                          _hoisted_4,
                          _hoisted_5
                        ])
                      ], 2 /* CLASS */)
                    ]),
                    _: 1 /* STABLE */
                  })
                ], 64 /* STABLE_FRAGMENT */))
                : (_unref(botProtectionForm).state.provider === 'mcaptcha')
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.mcaptchaSiteKey,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((_unref(botProtectionForm).state.mcaptchaSiteKey) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_6
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.mcaptchaSiteKey), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.mcaptchaSecretKey,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event: any) => ((_unref(botProtectionForm).state.mcaptchaSecretKey) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_7
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.mcaptchaSecretKey), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.mcaptchaInstanceUrl,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event: any) => ((_unref(botProtectionForm).state.mcaptchaInstanceUrl) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_8
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.mcaptchaInstanceUrl), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (_unref(botProtectionForm).state.mcaptchaSiteKey && _unref(botProtectionForm).state.mcaptchaInstanceUrl)
                      ? (_openBlock(), _createBlock(FormSlot, { key: 0 }, {
                        label: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts._captcha.verify), 1 /* TEXT */)
                        ]),
                        default: _withCtx(() => [
                          _createVNode(MkCaptcha, {
                            provider: "mcaptcha",
                            sitekey: _unref(botProtectionForm).state.mcaptchaSiteKey,
                            secretKey: _unref(botProtectionForm).state.mcaptchaSecretKey,
                            instanceUrl: _unref(botProtectionForm).state.mcaptchaInstanceUrl,
                            modelValue: captchaResult.value,
                            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event: any) => ((captchaResult).value = $event))
                          })
                        ]),
                        _: 1 /* STABLE */
                      }))
                      : _createCommentVNode("v-if", true)
                  ], 64 /* STABLE_FRAGMENT */))
                : (_unref(botProtectionForm).state.provider === 'recaptcha')
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.recaptchaSiteKey,
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event: any) => ((_unref(botProtectionForm).state.recaptchaSiteKey) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_9
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.recaptchaSiteKey), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.recaptchaSecretKey,
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event: any) => ((_unref(botProtectionForm).state.recaptchaSecretKey) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_10
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.recaptchaSecretKey), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (_unref(botProtectionForm).state.recaptchaSiteKey)
                      ? (_openBlock(), _createBlock(FormSlot, { key: 0 }, {
                        label: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts._captcha.verify), 1 /* TEXT */)
                        ]),
                        default: _withCtx(() => [
                          _createVNode(MkCaptcha, {
                            provider: "recaptcha",
                            sitekey: _unref(botProtectionForm).state.recaptchaSiteKey,
                            secretKey: _unref(botProtectionForm).state.recaptchaSecretKey,
                            modelValue: captchaResult.value,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event: any) => ((captchaResult).value = $event))
                          })
                        ]),
                        _: 1 /* STABLE */
                      }))
                      : _createCommentVNode("v-if", true),
                    _createVNode(MkInfo, null, {
                      default: _withCtx(() => [
                        _createElementVNode("div", {
                          class: _normalizeClass(_ctx.$style.captchaInfoMsg)
                        }, [
                          _createElementVNode("div", null, _toDisplayString(_unref(i18n).ts._captcha.testSiteKeyMessage), 1 /* TEXT */),
                          _createElementVNode("div", null, [
                            _hoisted_11,
                            _hoisted_12
                          ])
                        ], 2 /* CLASS */)
                      ]),
                      _: 1 /* STABLE */
                    })
                  ], 64 /* STABLE_FRAGMENT */))
                : (_unref(botProtectionForm).state.provider === 'turnstile')
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.turnstileSiteKey,
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event: any) => ((_unref(botProtectionForm).state.turnstileSiteKey) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_13
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.turnstileSiteKey), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(MkInput, {
                      debounce: "",
                      modelValue: _unref(botProtectionForm).state.turnstileSecretKey,
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event: any) => ((_unref(botProtectionForm).state.turnstileSecretKey) = $event))
                    }, {
                      prefix: _withCtx(() => [
                        _hoisted_14
                      ]),
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts.turnstileSecretKey), 1 /* TEXT */)
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (_unref(botProtectionForm).state.turnstileSiteKey)
                      ? (_openBlock(), _createBlock(FormSlot, { key: 0 }, {
                        label: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_unref(i18n).ts._captcha.verify), 1 /* TEXT */)
                        ]),
                        default: _withCtx(() => [
                          _createVNode(MkCaptcha, {
                            provider: "turnstile",
                            sitekey: _unref(botProtectionForm).state.turnstileSiteKey,
                            secretKey: _unref(botProtectionForm).state.turnstileSecretKey,
                            modelValue: captchaResult.value,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event: any) => ((captchaResult).value = $event))
                          })
                        ]),
                        _: 1 /* STABLE */
                      }))
                      : _createCommentVNode("v-if", true),
                    _createVNode(MkInfo, null, {
                      default: _withCtx(() => [
                        _createElementVNode("div", {
                          class: _normalizeClass(_ctx.$style.captchaInfoMsg)
                        }, [
                          _createElementVNode("div", null, "\n\t\t\t\t\t\t\t" + _toDisplayString(_unref(i18n).ts._captcha.testSiteKeyMessage) + "\n\t\t\t\t\t\t", 1 /* TEXT */),
                          _createElementVNode("div", null, [
                            _hoisted_15,
                            _hoisted_16
                          ])
                        ], 2 /* CLASS */)
                      ]),
                      _: 1 /* STABLE */
                    })
                  ], 64 /* STABLE_FRAGMENT */))
                : (_unref(botProtectionForm).state.provider === 'testcaptcha')
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 4 }, [
                    _createVNode(MkInfo, { warn: "" }, {
                      default: _withCtx(() => [
                        _createElementVNode("span", { innerHTML: _unref(i18n).ts.testCaptchaWarning }, null, 8 /* PROPS */, ["innerHTML"])
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(FormSlot, null, {
                      label: _withCtx(() => [
                        _createTextVNode(_toDisplayString(_unref(i18n).ts._captcha.verify), 1 /* TEXT */)
                      ]),
                      default: _withCtx(() => [
                        _createVNode(MkCaptcha, {
                          provider: "testcaptcha",
                          sitekey: null,
                          modelValue: captchaResult.value,
                          "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event: any) => ((captchaResult).value = $event))
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
    }, 8 /* PROPS */, ["keywords"]))
}
}

})
