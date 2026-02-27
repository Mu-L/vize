import { useModel as _useModel } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, withCtx as _withCtx, unref as _unref } from "vue"

import type { ImageEffectorRGB, ImageEffectorFxParamDefs } from '@/utility/image-effector/ImageEffector.js'
import MkInput from '@/components/MkInput.vue'
import MkRadios from '@/components/MkRadios.vue'
import MkSwitch from '@/components/MkSwitch.vue'
import MkRange from '@/components/MkRange.vue'
import { i18n } from '@/i18n.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkImageEffectorFxForm',
  props: {
    paramDefs: { type: null as unknown as PropType<ImageEffectorFxParamDefs>, required: true },
    "modelValue": { required: true }
  },
  emits: ["update:modelValue"],
  setup(__props) {

const params = _useModel(__props, "modelValue")
function getHex(c: ImageEffectorRGB) {
	return `#${c.map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
}
function getRgb(hex: string | number): ImageEffectorRGB | null {
	if (
		typeof hex === 'number' ||
		typeof hex !== 'string' ||
		!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)
	) {
		return null;
	}
	const m = hex.slice(1).match(/[0-9a-fA-F]{2}/g);
	if (m == null) return [0, 0, 0];
	return m.map(x => parseInt(x, 16) / 255) as ImageEffectorRGB;
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", { class: "_gaps" }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.paramDefs, (v, k) => {
        return (_openBlock(), _createElementBlock("div", { key: _ctx.k }, [
          (_ctx.v.type === 'boolean')
            ? (_openBlock(), _createBlock(MkSwitch, {
              key: 0,
              modelValue: params.value[_ctx.k],
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => ((params.value[_ctx.k]) = $event))
            }, {
              label: _withCtx(() => [
                _createTextVNode(_toDisplayString(_ctx.v.label ?? _ctx.k), 1 /* TEXT */)
              ]),
              default: _withCtx(() => [
                (_ctx.v.caption != null)
                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                    _toDisplayString(_ctx.v.caption)
                  ], 64 /* STABLE_FRAGMENT */))
                  : _createCommentVNode("v-if", true)
              ]),
              _: 1 /* STABLE */
            }))
            : (_ctx.v.type === 'number')
              ? (_openBlock(), _createBlock(MkRange, {
                key: 1,
                continuousUpdate: "",
                min: _ctx.v.min,
                max: _ctx.v.max,
                step: _ctx.v.step,
                textConverter: _ctx.v.toViewValue,
                onThumbDoubleClicked: _cache[1] || (_cache[1] = () => {
  				params.value[_ctx.k] = _ctx.v.default;
  			}),
                modelValue: params.value[_ctx.k],
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((params.value[_ctx.k]) = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_ctx.v.label ?? _ctx.k), 1 /* TEXT */)
                ]),
                default: _withCtx(() => [
                  (_ctx.v.caption != null)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _toDisplayString(_ctx.v.caption)
                    ], 64 /* STABLE_FRAGMENT */))
                    : _createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
              }))
            : (_ctx.v.type === 'number:enum')
              ? (_openBlock(), _createBlock(MkRadios, {
                key: 2,
                options: _ctx.v.enum,
                modelValue: params.value[_ctx.k],
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event: any) => ((params.value[_ctx.k]) = $event))
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_ctx.v.label ?? _ctx.k), 1 /* TEXT */)
                ]),
                default: _withCtx(() => [
                  (_ctx.v.caption != null)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _toDisplayString(_ctx.v.caption)
                    ], 64 /* STABLE_FRAGMENT */))
                    : _createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
              }))
            : (_ctx.v.type === 'seed')
              ? (_openBlock(), _createElementBlock("div", { key: 3 }, [
                _createVNode(MkRange, {
                  continuousUpdate: "",
                  type: "number",
                  min: 0,
                  max: 10000,
                  step: 1,
                  modelValue: params.value[_ctx.k],
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event: any) => ((params.value[_ctx.k]) = $event))
                }, {
                  label: _withCtx(() => [
                    _createTextVNode(_toDisplayString(_ctx.v.label ?? _ctx.k), 1 /* TEXT */)
                  ]),
                  default: _withCtx(() => [
                    (_ctx.v.caption != null)
                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                        _toDisplayString(_ctx.v.caption)
                      ], 64 /* STABLE_FRAGMENT */))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _: 1 /* STABLE */
                })
              ]))
            : (_ctx.v.type === 'color')
              ? (_openBlock(), _createBlock(MkInput, {
                key: 4,
                modelValue: getHex(params.value[_ctx.k]),
                type: "color",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = v => { const c = getRgb(v); if (_ctx.c != null) params.value[_ctx.k] = _ctx.c; })
              }, {
                label: _withCtx(() => [
                  _createTextVNode(_toDisplayString(_ctx.v.label ?? _ctx.k), 1 /* TEXT */)
                ]),
                default: _withCtx(() => [
                  (_ctx.v.caption != null)
                    ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                      _toDisplayString(_ctx.v.caption)
                    ], 64 /* STABLE_FRAGMENT */))
                    : _createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
              }))
            : _createCommentVNode("v-if", true)
        ]))
      }), 128 /* KEYED_FRAGMENT */)), (Object.keys(__props.paramDefs).length === 0) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: _normalizeClass(_ctx.$style.nothingToConfigure)
        }, "\n\t\t" + _toDisplayString(_unref(i18n).ts.nothingToConfigure) + "\n\t", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ]))
}
}

})
