import { defineComponent as _defineComponent, type PropType } from 'vue'
import { KeepAlive as _KeepAlive, openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, resolveComponent as _resolveComponent, normalizeClass as _normalizeClass, unref as _unref } from "vue"

import { inject, nextTick, onMounted, provide, ref, shallowRef, useTemplateRef } from 'vue'
import type { Router } from '@/router.js'
import { prefer } from '@/preferences.js'
import MkLoadingPage from '@/pages/_loading_.vue'
import { DI } from '@/di.js'
import { randomId } from '@/utility/random-id.js'
import { deepEqual } from '@/utility/deep-equal.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'RouterView',
  props: {
    router: { type: null as unknown as PropType<Router>, required: false }
  },
  setup(__props) {

const props = __props
const _router = props.router ?? inject(DI.router);
if (_router == null) {
	throw new Error('no router provided');
}
const router = _router;
const viewId = randomId();
provide(DI.viewId, viewId);
const currentDepth = inject(DI.routerCurrentDepth, 0);
provide(DI.routerCurrentDepth, currentDepth + 1);
const current = router.current;
const currentPageComponent = shallowRef('component' in current.route ? current.route.component : MkLoadingPage);
const currentPageProps = ref(current.props);
let currentRoutePath = current.route.path;
const key = ref(router.getCurrentFullPath());
router.useListener('change', ({ resolved }) => {
	if (resolved == null || 'redirect' in resolved.route) return;
	if (resolved.route.path === currentRoutePath && deepEqual(resolved.props, currentPageProps.value)) return;
	currentPageComponent.value = resolved.route.component;
	currentPageProps.value = resolved.props;
	key.value = router.getCurrentFullPath();
	currentRoutePath = resolved.route.path;
});

return (_ctx: any,_cache: any) => {
  const _component_MkLoading = _resolveComponent("MkLoading")

  return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass(["_pageContainer", _ctx.$style.root])
    }, [ _createVNode(_KeepAlive, { max: _unref(prefer).s.numberOfPageCache }) ], 2 /* CLASS */))
}
}

})
