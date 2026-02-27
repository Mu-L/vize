import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Transition as _Transition, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx } from "vue"


const _hoisted_1 = { class: "vf-toast-icon", "aria-hidden": "true", "data-v-e322f984": "" }
const _hoisted_2 = { class: "vf-toast-message", "data-v-e322f984": "" }

import {
  computed,
  onUnmounted,
  readonly,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { useI18n } from "#imports";

export type ToastOption
  = {
    autoClose: true;
    durationMs?: number;
  }
  | {
    autoClose: false;
  };

export type ToastType = "success" | "alert";

export interface ToastState {
  isOpened: boolean;
  type: ToastType;
  message: string;
}

function defaultToastState(): ToastState {
  return {
    isOpened: false,
    type: "success",
    message: "",
  };
}

const DEFAULT_DURATION_MS = 3000;

export function useToast(
  options: ToastOption = {
    autoClose: true,
    durationMs: DEFAULT_DURATION_MS,
  },
) {
  let closeTimerId: ReturnType<typeof setTimeout> | undefined;

  const state = ref<ToastState>(defaultToastState());

  function open({ type: t, message: m }: { type: ToastType; message: string }) {
    state.value = {
      isOpened: true,
      type: t,
      message: m,
    };
  }

  function close() {
    state.value = defaultToastState();
  }

  watch(
    () => state.value.isOpened,
    (v) => {
      if (closeTimerId) {
        clearTimeout(closeTimerId);
        closeTimerId = undefined;
      }

      if (v && options.autoClose) {
        closeTimerId = setTimeout(
          () => close(),
          options.durationMs ?? DEFAULT_DURATION_MS,
        );
      }
    },
  );

  onUnmounted(() => {
    if (closeTimerId) {
      clearTimeout(closeTimerId);
      closeTimerId = undefined;
    }
  });

  return {
    state: readonly(state),
    open,
    close,
  };
}

export default /*@__PURE__*/_defineComponent({
  __name: 'VFToast',
  props: {
    state: { type: null as unknown as PropType<ToastState>, required: true }
  },
  setup(__props) {

const { locale: lang } = useI18n();
const rootElRef = useTemplateRef("root");
const positionRight = computed(() => {
  if (rootElRef.value) {
    return `calc(50% - (${rootElRef.value.offsetWidth}px / 2))`;
  }
  return "50%";
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_Transition, { name: "vf-toast" }, {
      default: _withCtx(() => [
        (__props.state.isOpened)
          ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            ref: "root",
            class: _normalizeClass(["vf-toast", `vf-toast-${__props.state.type}`]),
            role: __props.state.type === 'alert' ? 'alert' : 'status',
            "aria-live": __props.state.type === 'alert' ? 'assertive' : 'polite',
            lang: undefined,
            "data-v-e322f984": ""
          }, [
            _createElementVNode("div", {
              class: "vf-toast-content",
              "data-v-e322f984": ""
            }, [
              _createElementVNode("span", _hoisted_1, "\n          " + "\n          " + _toDisplayString(__props.state.type === "success" ? "🎉" : "⚠️") + "\n        ", 1 /* TEXT */),
              _createElementVNode("span", _hoisted_2, "\n          " + _toDisplayString(__props.state.message) + "\n        ", 1 /* TEXT */)
            ])
          ]))
          : _createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }))
}
}

})
