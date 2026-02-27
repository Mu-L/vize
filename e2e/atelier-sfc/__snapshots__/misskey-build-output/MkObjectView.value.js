import { defineComponent as _defineComponent, type PropType } from 'vue'
import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, renderList as _renderList, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass } from "vue"


const _hoisted_1 = { class: "k", "data-v-75890950": "" }
import { reactive } from 'vue'
import number from '@/filters/number.js'
import XValue from '@/components/MkObjectView.value.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkObjectView.value',
  props: {
    value: { type: null as unknown as PropType<unknown>, required: true }
  },
  setup(__props) {

const props = __props
const collapsed = reactive<Record<string, boolean>>({});
if (isObject(props.value)) {
	for (const key in props.value) {
		collapsed[key] = collapsable(props.value[key]);
	}
}
function isObject(v: unknown): v is Record<PropertyKey, unknown> {
	return typeof v === 'object' && !Array.isArray(v) && v !== null;
}
function isArray(v: unknown): v is unknown[] {
	return Array.isArray(v);
}
function isEmpty(v: unknown): v is Record<PropertyKey, never> | never[] {
	return (isArray(v) && v.length === 0) || (isObject(v) && Object.keys(v).length === 0);
}
function collapsable(v: unknown): boolean {
	return (isObject(v) || isArray(v)) && !isEmpty(v);
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: "igpposuu _monospace",
      "data-v-75890950": ""
    }, [ (__props.value === null) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "null",
          "data-v-75890950": ""
        }, "null")) : (typeof __props.value === 'boolean') ? (_openBlock(), _createElementBlock("div", {
            key: 1,
            class: _normalizeClass(["boolean", { true: __props.value, false: !__props.value }]),
            "data-v-75890950": ""
          }, _toDisplayString(__props.value ? 'true' : 'false'), 1 /* TEXT */)) : (typeof __props.value === 'string') ? (_openBlock(), _createElementBlock("div", {
            key: 2,
            class: "string",
            "data-v-75890950": ""
          }, "\"" + _toDisplayString(__props.value) + "\"", 1 /* TEXT */)) : (typeof __props.value === 'number') ? (_openBlock(), _createElementBlock("div", {
            key: 3,
            class: "number",
            "data-v-75890950": ""
          }, _toDisplayString(number(__props.value)), 1 /* TEXT */)) : (isArray(__props.value) && isEmpty(__props.value)) ? (_openBlock(), _createElementBlock("div", {
            key: 4,
            class: "array empty",
            "data-v-75890950": ""
          }, "[]")) : (isArray(__props.value)) ? (_openBlock(), _createElementBlock("div", {
            key: 5,
            class: "array",
            "data-v-75890950": ""
          }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.value.length, (i) => {
              return (_openBlock(), _createElementBlock("div", { class: "element", "data-v-75890950": "" }, [
                _createTextVNode("\n\t\t\t"),
                _createTextVNode(_toDisplayString(i), 1 /* TEXT */),
                _createTextVNode(": "),
                _createVNode(XValue, {
                  value: __props.value[i - 1],
                  collapsed: ""
                })
              ]))
            }), 256 /* UNKEYED_FRAGMENT */)) ])) : (isObject(__props.value) && isEmpty(__props.value)) ? (_openBlock(), _createElementBlock("div", {
            key: 6,
            class: "object empty",
            "data-v-75890950": ""
          }, "{}")) : (isObject(__props.value)) ? (_openBlock(), _createElementBlock("div", {
            key: 7,
            class: "object",
            "data-v-75890950": ""
          }, [ (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(Object.keys(__props.value), (k) => {
              return (_openBlock(), _createElementBlock("div", { class: "kv", "data-v-75890950": "" }, [
                _createElementVNode("button", {
                  class: _normalizeClass(["toggle _button", { visible: collapsable(__props.value[k]) }]),
                  onClick: _cache[0] || (_cache[0] = ($event: any) => (collapsed[k] = !collapsed[k])),
                  "data-v-75890950": ""
                }, _toDisplayString(collapsed[k] ? '+' : '-'), 3 /* TEXT, CLASS */),
                _createElementVNode("div", _hoisted_1, _toDisplayString(k) + ":", 1 /* TEXT */),
                (collapsed[k])
                  ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    class: "v",
                    "data-v-75890950": ""
                  }, [
                    _createElementVNode("button", {
                      class: "_button",
                      onClick: _cache[1] || (_cache[1] = ($event: any) => (collapsed[k] = !collapsed[k])),
                      "data-v-75890950": ""
                    }, [
                      (typeof __props.value[k] === 'string')
                        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                          _createTextVNode("\"...\"")
                        ], 64 /* STABLE_FRAGMENT */))
                        : (isArray(__props.value[k]))
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                            _createTextVNode("[...]")
                          ], 64 /* STABLE_FRAGMENT */))
                        : (isObject(__props.value[k]))
                          ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                            _createTextVNode("{...}")
                          ], 64 /* STABLE_FRAGMENT */))
                        : _createCommentVNode("v-if", true)
                    ])
                  ]))
                  : (_openBlock(), _createElementBlock("div", {
                    key: 1,
                    class: "v",
                    "data-v-75890950": ""
                  }, [
                    _createVNode(XValue, { value: __props.value[k] })
                  ]))
              ]))
            }), 256 /* UNKEYED_FRAGMENT */)) ])) : _createCommentVNode("v-if", true) ]))
}
}

})
