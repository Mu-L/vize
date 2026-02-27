import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock } from "vue"

import { computed, h } from 'vue'
import type { ParameterizedString } from 'i18n'

export default /*@__PURE__*/_defineComponent({
  __name: 'I18n',
  props: {
    src: { type: null as unknown as PropType<T>, required: true },
    tag: { type: String as PropType<string>, required: false, default: 'span' },
    textTag: { type: String as PropType<string>, required: false }
  },
  setup(__props) {

const props = __props
const parsed = computed(() => {
	let str = props.src as string;
	const value: (string | { arg: string; })[] = [];
	for (; ;) {
		const nextBracketOpen = str.indexOf('{');
		const nextBracketClose = str.indexOf('}');

		if (nextBracketOpen === -1) {
			value.push(str);
			break;
		} else {
			if (nextBracketOpen > 0) value.push(str.substring(0, nextBracketOpen));
			value.push({
				arg: str.substring(nextBracketOpen + 1, nextBracketClose),
			});
		}

		str = str.substring(nextBracketClose + 1);
	}

	return value;
});
const render = () => {
	return h(props.tag, parsed.value.map(x => typeof x === 'string' ? (props.textTag ? h(props.textTag, x) : x) : (slots as any)[x.arg]()));
};

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(render))
}
}

})
