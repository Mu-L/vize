import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, unref as _unref } from "vue"


const _hoisted_1 = { class: "item-name", "data-v-22c7485f": "" }
const _hoisted_2 = { class: "item-price", "data-v-22c7485f": "" }
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("br", { "data-v-22c7485f": "" })
import type { Goods } from '~~/i18n/goods'
import { useI18n } from '#imports'

interface Props {
  item: Goods;
}

export default /*@__PURE__*/_defineComponent({
  __name: 'StoreItemCard',
  props: {
    item: { type: null as unknown as PropType<Goods>, required: true }
  },
  setup(__props) {

const { t } = useI18n();
const formatPrice = (price: number) => {
  return `¥${price.toLocaleString()}`;
};

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("li", {
      class: "store-item-card",
      "data-v-22c7485f": ""
    }, [ _createElementVNode("div", {
        class: "item-image",
        "data-v-22c7485f": ""
      }, [ _createElementVNode("img", {
          src: __props.item.src,
          alt: __props.item.name,
          loading: "lazy",
          "data-v-22c7485f": ""
        }, null, 8 /* PROPS */, ["src", "alt"]) ]), _createElementVNode("div", {
        class: "item-content",
        "data-v-22c7485f": ""
      }, [ _createElementVNode("div", _hoisted_1, "\r\n        " + _toDisplayString(__props.item.name) + "\r\n      ", 1 /* TEXT */), _createElementVNode("div", _hoisted_2, "\r\n        " + _toDisplayString(formatPrice(__props.item.price)) + "\r\n      ", 1 /* TEXT */), _createElementVNode("div", {
          class: "item-description",
          "data-v-22c7485f": ""
        }, [ _createElementVNode("p", null, _toDisplayString(__props.item.description), 1 /* TEXT */), _hoisted_3, _createElementVNode("div", {
            class: "item-specs",
            "data-v-22c7485f": ""
          }, [ (__props.item.specs.color) ? (_openBlock(), _createElementBlock("p", {
                key: 0,
                class: "spec-item",
                "data-v-22c7485f": ""
              }, "\r\n            " + _toDisplayString(_unref(t)('store.color')) + _toDisplayString(__props.item.specs.color) + "\r\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (__props.item.specs.material) ? (_openBlock(), _createElementBlock("p", {
                key: 0,
                class: "spec-item",
                "data-v-22c7485f": ""
              }, "\r\n            " + _toDisplayString(_unref(t)('store.material')) + _toDisplayString(__props.item.specs.material) + "\r\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true), (__props.item.specs.size) ? (_openBlock(), _createElementBlock("p", {
                key: 0,
                class: "spec-item",
                "data-v-22c7485f": ""
              }, "\r\n            " + _toDisplayString(_unref(t)('store.size')) + _toDisplayString(__props.item.specs.size) + "\r\n          ", 1 /* TEXT */)) : _createCommentVNode("v-if", true) ]) ]) ]) ]))
}
}

})
