import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createBlock as _createBlock, resolveDynamicComponent as _resolveDynamicComponent } from "vue"

import * as Misskey from 'misskey-js'
import XText from './page.text.vue'
import XSection from './page.section.vue'
import XImage from './page.image.vue'
import XNote from './page.note.vue'
import XDynamic from './page.dynamic.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'page.block',
  props: {
    block: { type: null as unknown as PropType<Misskey.entities.PageBlock>, required: true },
    h: { type: Number as PropType<number>, required: true },
    page: { type: null as unknown as PropType<Misskey.entities.Page>, required: true }
  },
  setup(__props) {

function getComponent(type: string) {
	switch (type) {
		case 'text': return XText;
		case 'section': return XSection;
		case 'image': return XImage;
		case 'note': return XNote;
		// 動的ページの代替用ブロック
		case 'button':
		case 'if':
		case 'textarea':
		case 'post':
		case 'canvas':
		case 'numberInput':
		case 'textInput':
		case 'switch':
		case 'radioButton':
		case 'counter':
			return XDynamic;
		default: return null;
	}
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createBlock(_resolveDynamicComponent(getComponent(__props.block.type)), {
      key: __props.block.id,
      page: __props.page,
      block: __props.block,
      h: __props.h
    }, null, 8 /* PROPS */, ["page", "block", "h"]))
}
}

})
