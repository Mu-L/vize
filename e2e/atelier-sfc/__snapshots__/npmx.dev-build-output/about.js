import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, renderList as _renderList, toDisplayString as _toDisplayString, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = { class: "font-mono text-3xl sm:text-4xl font-medium" }
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:arrow-left rtl-flip w-4 h-4", "aria-hidden": "true" })
const _hoisted_3 = { class: "hidden sm:inline" }
const _hoisted_4 = { class: "text-fg-muted text-lg" }
const _hoisted_5 = { class: "text-lg text-fg-subtle uppercase tracking-wider mb-4" }
const _hoisted_6 = { class: "text-fg" }
const _hoisted_7 = { class: "text-fg" }
const _hoisted_8 = { class: "text-lg text-fg-subtle uppercase tracking-wider mb-4" }
const _hoisted_9 = /*#__PURE__*/ _createElementVNode("span", { class: "text-fg-subtle shrink-0 mt-1" }, "&mdash;")
const _hoisted_10 = { class: "text-fg" }
const _hoisted_11 = /*#__PURE__*/ _createElementVNode("span", { class: "text-fg-subtle shrink-0 mt-1" }, "&mdash;")
const _hoisted_12 = { class: "text-fg" }
const _hoisted_13 = { class: "text-lg text-fg-subtle uppercase tracking-wider mb-4" }
const _hoisted_14 = { class: "text-fg-muted leading-relaxed mb-6" }
const _hoisted_15 = { id: "governance-heading", class: "text-sm text-fg-subtle uppercase tracking-wider mb-4" }
const _hoisted_16 = { class: "text-xs text-fg-muted tracking-tight" }
const _hoisted_17 = /*#__PURE__*/ _createElementVNode("span", { class: "i-lucide:external-link rtl-flip w-3.5 h-3.5 text-fg-muted opacity-50 shrink-0 self-start mt-0.5 pointer-events-none", "aria-hidden": "true" })
const _hoisted_18 = { id: "contributors-heading", class: "text-sm text-fg-subtle uppercase tracking-wider mb-4" }
const _hoisted_19 = { class: "pointer-events-none absolute -top-9 inset-is-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs px-2 py-1 shadow-lg opacity-0 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100", dir: "ltr", role: "tooltip" }
import type { Role } from '#server/api/contributors.get'

export default /*@__PURE__*/_defineComponent({
  __name: 'about',
  setup(__props) {

const router = useRouter()
const canGoBack = useCanGoBack()
useSeoMeta({
  title: () => `${$t('about.title')} - npmx`,
  ogTitle: () => `${$t('about.title')} - npmx`,
  twitterTitle: () => `${$t('about.title')} - npmx`,
  description: () => $t('about.meta_description'),
  ogDescription: () => $t('about.meta_description'),
  twitterDescription: () => $t('about.meta_description'),
})
defineOgImageComponent('Default', {
  primaryColor: '#60a5fa',
  title: 'about npmx',
  description: 'a fast, modern browser for the **npm registry**',
})
const pmLinks = {
  npm: 'https://www.npmjs.com/',
  pnpm: 'https://pnpm.io/',
  yarn: 'https://yarnpkg.com/',
  bun: 'https://bun.sh/',
  deno: 'https://deno.com/',
  vlt: 'https://www.vlt.sh/',
}
const { data: contributors, status: contributorsStatus } = useLazyFetch('/api/contributors')
const governanceMembers = computed(
  () => contributors.value?.filter(c => c.role !== 'contributor') ?? [],
)
const communityContributors = computed(
  () => contributors.value?.filter(c => c.role === 'contributor') ?? [],
)
const roleLabels = computed(
  () =>
    ({
      steward: $t('about.team.role_steward'),
      maintainer: $t('about.team.role_maintainer'),
    }) as Partial<Record<Role, string>>,
)

return (_ctx: any,_cache: any) => {
  const _component_i18n_t = _resolveComponent("i18n-t")
  const _component_LinkBase = _resolveComponent("LinkBase")
  const _component_NuxtLink = _resolveComponent("NuxtLink")
  const _component_CallToAction = _resolveComponent("CallToAction")

  return (_openBlock(), _createElementBlock("main", { class: "container flex-1 py-12 sm:py-16 overflow-x-hidden" }, [ _createElementVNode("article", { class: "max-w-2xl mx-auto" }, [ _createElementVNode("header", { class: "mb-12" }, [ _createElementVNode("div", { class: "flex items-baseline justify-between gap-4 mb-4" }, [ _createElementVNode("h1", _hoisted_1, "\n            " + _toDisplayString(_ctx.$t('about.heading')) + "\n          ", 1 /* TEXT */), (_unref(canGoBack)) ? (_openBlock(), _createElementBlock("button", {
                key: 0,
                type: "button",
                class: "cursor-pointer inline-flex items-center gap-2 font-mono text-sm text-fg-muted hover:text-fg transition-colors duration-200 rounded focus-visible:outline-accent/70 shrink-0",
                onClick: _cache[0] || (_cache[0] = ($event: any) => (_unref(router).back()))
              }, [ _hoisted_2, _createElementVNode("span", _hoisted_3, _toDisplayString(_ctx.$t('nav.back')), 1 /* TEXT */) ])) : _createCommentVNode("v-if", true) ]), _createElementVNode("p", _hoisted_4, "\n          " + _toDisplayString(_ctx.$t('tagline')) + "\n        ", 1 /* TEXT */) ]), _createElementVNode("section", { class: "prose prose-invert max-w-none space-y-8" }, [ _createElementVNode("div", null, [ _createElementVNode("h2", _hoisted_5, "\n            " + _toDisplayString(_ctx.$t('about.what_we_are.title')) + "\n          ", 1 /* TEXT */), _createElementVNode("p", { class: "text-fg-muted leading-relaxed mb-4" }, [ _createVNode(_component_i18n_t, {
                keypath: "about.what_we_are.description",
                tag: "span",
                scope: "global"
              }, {
                betterUxDx: _withCtx(() => [
                  _createElementVNode("strong", _hoisted_6, _toDisplayString(_ctx.$t('about.what_we_are.better_ux_dx')), 1 /* TEXT */)
                ]),
                jsr: _withCtx(() => [
                  _createVNode(_component_LinkBase, { to: "https://jsr.io/" }, {
                    default: _withCtx(() => [
                      _createTextVNode("JSR")
                    ]),
                    _: 1 /* STABLE */
                  })
                ]),
                _: 1 /* STABLE */
              }) ]), _createElementVNode("p", { class: "text-fg-muted leading-relaxed" }, [ _createVNode(_component_i18n_t, {
                keypath: "about.what_we_are.admin_description",
                tag: "span",
                scope: "global"
              }, {
                adminUi: _withCtx(() => [
                  _createElementVNode("strong", _hoisted_7, _toDisplayString(_ctx.$t('about.what_we_are.admin_ui')), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }) ]) ]), _createElementVNode("div", null, [ _createElementVNode("h2", _hoisted_8, "\n            " + _toDisplayString(_ctx.$t('about.what_we_are_not.title')) + "\n          ", 1 /* TEXT */), _createElementVNode("ul", { class: "space-y-3 text-fg-muted list-none p-0" }, [ _createElementVNode("li", { class: "flex items-start gap-3" }, [ _hoisted_9, _createElementVNode("span", null, [ _createElementVNode("strong", _hoisted_10, _toDisplayString(_ctx.$t('about.what_we_are_not.not_package_manager')), 1 /* TEXT */), _createTextVNode("\n                "), _createTextVNode(_toDisplayString(' '), 1 /* TEXT */), _createTextVNode("\n                "), _createVNode(_component_i18n_t, {
                    keypath: "about.what_we_are_not.package_managers_exist",
                    tag: "span",
                    scope: "global"
                  }, {
                    already: _withCtx(() => [
                      _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.already')), 1 /* TEXT */)
                    ]),
                    people: _withCtx(() => [
                      _createVNode(_component_LinkBase, {
                        to: _unref(pmLinks).npm,
                        class: "font-sans"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.people')), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    building: _withCtx(() => [
                      _createVNode(_component_LinkBase, {
                        to: _unref(pmLinks).pnpm,
                        class: "font-sans"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.building')), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    really: _withCtx(() => [
                      _createVNode(_component_LinkBase, {
                        to: _unref(pmLinks).yarn,
                        class: "font-sans"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.really')), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    cool: _withCtx(() => [
                      _createVNode(_component_LinkBase, {
                        to: _unref(pmLinks).bun,
                        class: "font-sans"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.cool')), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    package: _withCtx(() => [
                      _createVNode(_component_LinkBase, {
                        to: _unref(pmLinks).deno,
                        class: "font-sans"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.package')), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    managers: _withCtx(() => [
                      _createVNode(_component_LinkBase, {
                        to: _unref(pmLinks).vlt,
                        class: "font-sans"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.words.managers')), 1 /* TEXT */)
                        ]),
                        _: 1 /* STABLE */
                      })
                    ]),
                    _: 1 /* STABLE */
                  }) ]) ]), _createElementVNode("li", { class: "flex items-start gap-3" }, [ _hoisted_11, _createElementVNode("span", null, [ _createElementVNode("strong", _hoisted_12, _toDisplayString(_ctx.$t('about.what_we_are_not.not_registry')), 1 /* TEXT */), _createTextVNode("\n                "), _createTextVNode(_toDisplayString(_ctx.$t('about.what_we_are_not.registry_description')), 1 /* TEXT */), _createTextVNode("\n              ") ]) ]) ]) ]), _createElementVNode("div", null, [ _createElementVNode("h2", _hoisted_13, "\n            " + _toDisplayString(_ctx.$t('about.team.title')) + "\n          ", 1 /* TEXT */), _createElementVNode("p", _hoisted_14, "\n            " + _toDisplayString(_ctx.$t('about.contributors.description')) + "\n          ", 1 /* TEXT */), _createTextVNode("\n\n          "), _createTextVNode("\n          "), (governanceMembers.value.length) ? (_openBlock(), _createElementBlock("section", {
                key: 0,
                class: "mb-12",
                "aria-labelledby": "governance-heading"
              }, [ _createElementVNode("h3", _hoisted_15, "\n              " + _toDisplayString(_ctx.$t('about.team.governance')) + "\n            ", 1 /* TEXT */), _createElementVNode("ul", { class: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 list-none p-0" }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(governanceMembers.value, (person) => {
                    return (_openBlock(), _createElementBlock("li", {
                      key: person.id,
                      class: "relative flex items-center gap-3 p-3 border border-border rounded-lg hover:border-border-hover hover:bg-bg-muted transition-[border-color,background-color] duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-offset-bg focus-within:ring-offset-2 focus-within:ring-fg/50"
                    }, [
                      _createElementVNode("img", {
                        src: `${person.avatar_url}&s=80`,
                        alt: `${person.login}'s avatar`,
                        class: "w-12 h-12 rounded-md ring-1 ring-border shrink-0",
                        loading: "lazy"
                      }, null, 8 /* PROPS */, ["src", "alt"]),
                      _createElementVNode("div", { class: "min-w-0 flex-1" }, [
                        _createElementVNode("div", { class: "font-mono text-sm text-fg truncate" }, [
                          _createVNode(_component_NuxtLink, {
                            to: person.html_url,
                            target: "_blank",
                            class: "decoration-none after:content-[''] after:absolute after:inset-0",
                            "aria-label": _ctx.$t('about.contributors.view_profile', { name: person.login })
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode("\n                      @"),
                              _createTextVNode(_toDisplayString(person.login), 1 /* TEXT */),
                              _createTextVNode("\n                    ")
                            ]),
                            _: 1 /* STABLE */
                          })
                        ]),
                        _createElementVNode("div", _hoisted_16, "\n                    " + _toDisplayString(roleLabels.value[person.role] ?? person.role) + "\n                  ", 1 /* TEXT */),
                        (person.sponsors_url)
                          ? (_openBlock(), _createBlock(_component_LinkBase, {
                            key: 0,
                            to: person.sponsors_url,
                            "no-underline": "",
                            "no-external-icon": "",
                            classicon: "i-lucide:heart",
                            class: "relative z-10 text-xs text-fg-muted hover:text-pink-400 mt-0.5",
                            "aria-label": _ctx.$t('about.team.sponsor_aria', { name: person.login })
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode("\n                    "),
                              _createTextVNode(_toDisplayString(_ctx.$t('about.team.sponsor')), 1 /* TEXT */),
                              _createTextVNode("\n                  ")
                            ]),
                            _: 1 /* STABLE */
                          }))
                          : _createCommentVNode("v-if", true)
                      ]),
                      _hoisted_17
                    ]))
                  }), 128 /* KEYED_FRAGMENT */)) ]) ])) : _createCommentVNode("v-if", true), _createTextVNode("\n\n          "), _createTextVNode("\n          "), _createElementVNode("section", { "aria-labelledby": "contributors-heading" }, [ _createElementVNode("h3", _hoisted_18, "\n              " + _toDisplayString(_ctx.$t( 'about.contributors.title', { count: _ctx.$n(communityContributors.value.length) }, communityContributors.value.length, )) + "\n            ", 1 /* TEXT */), (_unref(contributorsStatus) === 'pending') ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: "text-fg-subtle text-sm",
                  role: "status"
                }, "\n              " + _toDisplayString(_ctx.$t('about.contributors.loading')) + "\n            ", 1 /* TEXT */)) : (_unref(contributorsStatus) === 'error') ? (_openBlock(), _createElementBlock("div", {
                    key: 1,
                    class: "text-fg-subtle text-sm",
                    role: "alert"
                  }, "\n              " + _toDisplayString(_ctx.$t('about.contributors.error')) + "\n            ", 1 /* TEXT */)) : (communityContributors.value.length) ? (_openBlock(), _createElementBlock("ul", {
                    key: 2,
                    class: "grid grid-cols-[repeat(auto-fill,48px)] justify-center gap-2 list-none p-0"
                  }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(communityContributors.value, (contributor) => {
                      return (_openBlock(), _createElementBlock("li", {
                        key: contributor.id,
                        class: "group relative"
                      }, [
                        _createVNode(_component_LinkBase, {
                          to: contributor.html_url,
                          "no-underline": "",
                          "no-external-icon": "",
                          "aria-label": _ctx.$t('about.contributors.view_profile', { name: contributor.login })
                        }, {
                          default: _withCtx(() => [
                            _createElementVNode("img", {
                              src: `${contributor.avatar_url}&s=64`,
                              alt: `${contributor.login}'s avatar`,
                              width: "48",
                              height: "48",
                              class: "w-12 h-12 rounded-lg ring-2 ring-transparent group-hover:ring-accent transition-all duration-200 ease-out hover:scale-125 will-change-transform",
                              loading: "lazy"
                            }, null, 8 /* PROPS */, ["src", "alt"]),
                            _createElementVNode("span", _hoisted_19, "\n                    @" + _toDisplayString(contributor.login) + "\n                  ", 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]))
                    }), 128 /* KEYED_FRAGMENT */)) ])) : _createCommentVNode("v-if", true) ]) ]), _createVNode(_component_CallToAction) ]) ]) ]))
}
}

})
