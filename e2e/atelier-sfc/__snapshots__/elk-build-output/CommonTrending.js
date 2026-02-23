import { mergeDefaults as _mergeDefaults } from 'vue'
import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString } from "vue"

import type { mastodon } from 'masto'

export default /*@__PURE__*/_defineComponent({
  __name: 'CommonTrending',
  props: {
    history: { type: Array as PropType<mastodon.v1.TagHistory[]>, required: true },
    maxDay: { type: Number as PropType<number>, required: false, default: 2 }
  },
  setup(__props) {

const ongoingHot = computed(() => __props.history.slice(0, __props.maxDay))
const people = computed(() =>
  ongoingHot.value.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("p", null, "\n    " + _toDisplayString(_ctx.$t('command.n_people_in_the_past_n_days', [people.value, __props.maxDay])) + "\n  ", 1 /* TEXT */))
}
}

})
