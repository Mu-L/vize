import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, unref as _unref } from "vue"

import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import * as Misskey from 'misskey-js'
import MkAchievements from '@/components/MkAchievements.vue'
import { claimAchievement } from '@/utility/achievements.js'
import { $i } from '@/i.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'achievements',
  props: {
    user: { type: null as unknown as PropType<Misskey.entities.User>, required: true }
  },
  setup(__props) {

const props = __props
let timer: number | null;
function viewAchievements3min() {
	if ($i && (props.user.id === $i.id)) {
		claimAchievement('viewAchievements3min');
	}
}
onMounted(() => {
	if (timer == null) timer = window.setTimeout(viewAchievements3min, 1000 * 60 * 3);
});
onUnmounted(() => {
	if (timer != null) {
		window.clearTimeout(timer);
		timer = null;
	}
});
onActivated(() => {
	if (timer == null) timer = window.setTimeout(viewAchievements3min, 1000 * 60 * 3);
});
onDeactivated(() => {
	if (timer != null) {
		window.clearTimeout(timer);
		timer = null;
	}
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: "_spacer",
      style: "--MI_SPACER-w: 1200px;"
    }, [ _createVNode(MkAchievements, {
        user: __props.user,
        withLocked: false,
        withDescription: _unref($i) != null && (props.user.id === _unref($i).id)
      }) ]))
}
}

})
