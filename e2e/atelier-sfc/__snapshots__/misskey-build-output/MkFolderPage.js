import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementVNode as _createElementVNode, withDirectives as _withDirectives, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref, vShow as _vShow } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-chevron-left" })
import { onMounted, ref } from 'vue'
import { claimZIndex } from '@/os.js'
import { prefer } from '@/preferences.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkFolderPage',
  props: {
    pageId: { type: Number as PropType<number>, required: true, default: 0 }
  },
  emits: ["closed"],
  setup(__props, { emit: __emit }) {

const emit = __emit
const props = __props
const zIndex = claimZIndex('low');
const showing = ref(true);
function closePage() {
	showing.value = false;
}
function onClosed() {
	emit('closed');
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_Transition, {
      name: "x",
      enterActiveClass: _unref(prefer).s.animation ? _ctx.$style.transition_x_enterActive : '',
      leaveActiveClass: _unref(prefer).s.animation ? _ctx.$style.transition_x_leaveActive : '',
      enterFromClass: _unref(prefer).s.animation ? _ctx.$style.transition_x_enterFrom : '',
      leaveToClass: _unref(prefer).s.animation ? _ctx.$style.transition_x_leaveTo : '',
      duration: 300,
      appear: "",
      onAfterLeave: onClosed
    }, {
      default: _withCtx(() => [
        _withDirectives(_createElementVNode("div", {
          class: _normalizeClass([_ctx.$style.root]),
          style: _normalizeStyle({ zIndex: _unref(zIndex) })
        }, [
          _createElementVNode("div", {
            class: _normalizeClass([_ctx.$style.bg]),
            style: _normalizeStyle({ zIndex: _unref(zIndex) })
          }, null, 6 /* CLASS, STYLE */),
          _createElementVNode("div", {
            class: _normalizeClass([_ctx.$style.content]),
            style: _normalizeStyle({ zIndex: _unref(zIndex) })
          }, [
            _createElementVNode("div", {
              class: _normalizeClass(_ctx.$style.header)
            }, [
              _createElementVNode("button", {
                class: _normalizeClass(["_button", _ctx.$style.back]),
                onClick: closePage
              }, [
                _hoisted_1
              ], 2 /* CLASS */),
              _createElementVNode("div", {
                id: `v-${__props.pageId}-header`,
                class: _normalizeClass(_ctx.$style.title)
              }, null, 10 /* CLASS, PROPS */, ["id"]),
              _createElementVNode("div", {
                class: _normalizeClass(_ctx.$style.spacer)
              }, null, 2 /* CLASS */)
            ], 2 /* CLASS */),
            _createElementVNode("div", { id: `v-${__props.pageId}-body` }, null, 8 /* PROPS */, ["id"])
          ], 6 /* CLASS, STYLE */)
        ], 6 /* CLASS, STYLE */), [
          [_vShow, showing.value]
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["enterActiveClass", "leaveActiveClass", "enterFromClass", "leaveToClass", "duration"]))
}
}

})
