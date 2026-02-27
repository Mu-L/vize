import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, normalizeClass as _normalizeClass } from "vue"

import * as Misskey from 'misskey-js'
import XNotification from '@/components/MkNotification.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'notification',
  props: {
    notification: { type: null as unknown as PropType<Misskey.entities.Notification>, required: true }
  },
  setup(__props) {


return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(_ctx.$style.root)
    }, [ _createVNode(XNotification, {
        notification: __props.notification,
        class: "notification _acrylic",
        full: false
      }) ], 2 /* CLASS */))
}
}

})
