import { defineComponent as _defineComponent } from 'vue'
import { Fragment as _Fragment, Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, resolveDynamicComponent as _resolveDynamicComponent, renderSlot as _renderSlot, mergeProps as _mergeProps, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { style: "height: 100lvh", "data-v-996b718b": "" })
import { useScroll } from '@vueuse/core'
import { useLocaleRoute, type RoutesNamesList } from '@typed-router'
import { computed, nextTick, useBreakpoint, useRoute, watch, useI18n, type Breakpoint } from '#imports'
import { EnCtaTicket, JaCtaTicket, MainVisual, VFCta, VFFooter, VFHeader, VFMenu, VFSpCta, VFSpMenu } from '#components'
import { useAnimationStore } from '~/stores/animation'
import { HOME_HEADING_ID } from '~/constant'
import type { MenuItemProps } from '~/components/menu/VFMenuItem.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'default',
  setup(__props) {

const [animation] = useAnimationStore();
const bp = useBreakpoint();
const route = useRoute();
const localeRoute = useLocaleRoute();
const isRoot = computed(() => ["/", "/en"].includes(route.path));
const { locale, t } = useI18n();
const menuItems = computed<MenuItemProps[]>(() =>
  [
    {
      id: HOME_HEADING_ID.home,
      label: "Home",
      routeName: localeRoute({ name: "index" }).name,
    },
    {
      id: HOME_HEADING_ID.timetable,
      label: "Timetable",
      routeName: localeRoute({ name: "timetable" }).name,
      disabled: !import.meta.vfFeatures.timetable,
    },
    {
      id: HOME_HEADING_ID.speaker,
      label: "Speaker",
      routeName: localeRoute({ name: "speaker" }).name,
    },
    {
      id: HOME_HEADING_ID.event,
      label: "Event",
      routeName: localeRoute({ name: "event" }).name,
    },
    {
      id: HOME_HEADING_ID.store,
      label: "Store",
      routeName: localeRoute({ name: "store" }).name,
    },
    {
      id: HOME_HEADING_ID.ticket,
      label: "Ticket",
      routeName: localeRoute({ name: "ticket" }).name,
    },
    {
      id: HOME_HEADING_ID.sponsor,
      label: "Sponsor",
      routeName: localeRoute({ name: "sponsors" }).name,
    },
  ].filter(it => !!it),
);
const cta = computed(() =>
  ({
    props: {
      actionButton: {
        label: t("ticket.details"),
        link: localeRoute({ name: "ticket" }).path,
      },
      openerText: "Ticket",
    },
    content: locale.value === "ja"
      ? JaCtaTicket
      : EnCtaTicket,
  }),
);
const { y } = useScroll(window);
const isShowedSpMenu = computed(() => {
  const targetBp: Breakpoint[]
    = isTimetable.value
      ? ["pc", "mobile-wide", "mobile"]
      : isWidenContent.value
        ? ["mobile-wide", "mobile"]
        : ["mobile"];
  return targetBp.includes(bp.value) && (!isRoot.value || y.value > 450);
});
const isShowedSpCta = computed(() => {
  const targetBp: Breakpoint[]
    = isTimetable.value || isWidenContent.value
      ? ["pc", "mobile-wide", "mobile"]
      : ["mobile-wide", "mobile"];
  return targetBp.includes(bp.value) && (!isRoot.value || y.value > 450);
});
const WIDE_ROUTE_NAMES: RoutesNamesList[] = [
  "speaker",
  "speaker-speakerId",
  "ticket",
  "ticket-userId",
  "ticket-userId-edit",
  "sponsors",
  "sponsors-sponsorId",
  "event",
  "related-events",
  "store",
];
const isWidenContent = computed(() =>
  WIDE_ROUTE_NAMES
    .map(r => localeRoute(r as string)?.name as string | undefined)
    .filter(it => !!it)
    .includes(route.name?.toString() ?? ""),
);
const isTimetable = computed(() => localeRoute("timetable" as string).name === route.name?.toString());
// scroll behavior
watch(() => route.hash, async (hash) => {
  if (hash === "") {
    return;
  }
  await nextTick();
  if (isRoot.value && hash === "#") {
    window.scrollTo(0, 0);
    return;
  }
  const target = document.querySelector(hash);
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3;
    window.scrollTo({ top, behavior: "smooth" });
  }
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [ _createElementVNode("div", null, [ _createVNode(MainVisual, {
          "title-tag": isRoot.value ? 'h1' : 'div',
          animation: undefined,
          "show-scroll-attention": isRoot.value,
          class: "main-visual"
        }), (isRoot.value) ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            style: "height: 100svh",
            "data-v-996b718b": ""
          })) : _createCommentVNode("v-if", true), _createElementVNode("div", {
          class: "layout",
          "data-v-996b718b": ""
        }, [ _createElementVNode("div", {
            class: "side-content left-menu",
            "data-v-996b718b": ""
          }, [ (!isShowedSpMenu.value) ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "nav-menu",
                "data-v-996b718b": ""
              }, [ _createVNode(VFMenu, { items: menuItems.value }) ])) : _createCommentVNode("v-if", true) ]), _createElementVNode("div", {
            class: _normalizeClass(["content", { 'widen-content': isWidenContent.value, 'timetable': isTimetable.value }]),
            "data-v-996b718b": ""
          }, [ _createVNode(VFHeader, {
              "is-root": undefined,
              class: "header"
            }), _createElementVNode("main", {
              class: "main",
              "data-v-996b718b": ""
            }, [ _renderSlot(_ctx.$slots, "default") ]), _createVNode(VFFooter) ], 2 /* CLASS */), _createElementVNode("div", {
            class: "side-content right-menu",
            "data-v-996b718b": ""
          }, [ (!isShowedSpCta.value && cta.value) ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "nav-menu",
                "data-v-996b718b": ""
              }, [ _createVNode(VFCta, { "action-button": cta.value.props.actionButton }, {
                  default: _withCtx(() => [
                    _createVNode(_resolveDynamicComponent(cta.value.content))
                  ]),
                  _: 1 /* STABLE */
                }) ])) : _createCommentVNode("v-if", true) ]) ]), _hoisted_1 ]), _createElementVNode("div", {
        class: "sp-nav-container",
        "data-v-996b718b": ""
      }, [ _createVNode(_Transition, null, {
          default: _withCtx(() => [
            (isShowedSpMenu.value && cta.value)
              ? (_openBlock(), _createBlock(VFSpMenu, {
                key: 0,
                items: menuItems.value
              }))
              : _createCommentVNode("v-if", true)
          ]),
          _: 1 /* STABLE */
        }), _createVNode(_Transition, null, {
          default: _withCtx(() => [
            (isShowedSpCta.value && cta.value && _unref(route).path !== _unref(localeRoute)({ name: "ticket" }).path)
              ? (_openBlock(), _createBlock(VFSpCta, _mergeProps(cta.value.props, { key: 0 }), {
                default: _withCtx(() => [
                  _createVNode(_resolveDynamicComponent(cta.value.content))
                ]),
                _: 1 /* STABLE */
              }))
              : _createCommentVNode("v-if", true)
          ]),
          _: 1 /* STABLE */
        }) ]) ], 64 /* STABLE_FRAGMENT */))
}
}

})
