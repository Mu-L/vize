import { defineComponent as _defineComponent, type PropType } from 'vue'
import { navigateTo, useLocaleRoute } from '@typed-router'
import type { NuxtError } from '#app'

export default /*@__PURE__*/_defineComponent({
  __name: 'error',
  props: {
    error: { type: null as unknown as PropType<NuxtError>, required: true }
  },
  setup(__props) {

const props = __props
const localeRoute = useLocaleRoute();
if (props.error.statusCode === 404) {
  navigateTo(localeRoute({ name: "index" }), { replace: true });
}

return { props, localeRoute, useLocaleRoute, navigateTo }
}

})
