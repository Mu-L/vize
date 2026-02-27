import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString } from "vue"


const _hoisted_1 = { class: "track", "data-v-ae18e2f6": "" }

type Props = {
  color: "primary" | "purple" | "orange" | "navy";
  title: string;
};

export default /*@__PURE__*/_defineComponent({
  __name: 'TimetableHead',
  props: {
    color: { type: String as PropType<"primary" | "purple" | "orange" | "navy">, required: true },
    title: { type: String as PropType<string>, required: true }
  },
  setup(__props) {

const props = __props
const backgroundColor = `var(--color-${props.color}-base)`;
const textColor = `var(--color-${props.color}-sub)`;

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("th", _hoisted_1, "\n    " + _toDisplayString(__props.title) + "\n  "))
}
}

})
