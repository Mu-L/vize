import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-cpu", "data-v-c7a21a0b": "" })
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as Misskey from 'misskey-js'
import XPie from './pie.vue'

export default /*@__PURE__*/_defineComponent({
  __name: 'cpu',
  props: {
    connection: { type: null as unknown as PropType<Misskey.IChannelConnection<Misskey.Channels['serverStats']>>, required: true },
    meta: { type: null as unknown as PropType<Misskey.entities.ServerInfoResponse>, required: true }
  },
  setup(__props) {

const props = __props
const usage = ref<number>(0);
function onStats(stats: Misskey.entities.ServerStats) {
	usage.value = stats.cpu;
}
onMounted(() => {
	props.connection.on('stats', onStats);
});
onBeforeUnmount(() => {
	props.connection.off('stats', onStats);
});

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", {
      class: "vrvdvrys",
      "data-v-c7a21a0b": ""
    }, [ _createVNode(XPie, {
        class: "pie",
        value: usage.value
      }), _createElementVNode("div", null, [ _createElementVNode("p", null, [ _hoisted_1, _createTextVNode("CPU") ]), _createElementVNode("p", null, _toDisplayString(__props.meta.cpu.cores) + " Logical cores", 1 /* TEXT */), _createElementVNode("p", null, _toDisplayString(__props.meta.cpu.model), 1 /* TEXT */) ]) ]))
}
}

})
