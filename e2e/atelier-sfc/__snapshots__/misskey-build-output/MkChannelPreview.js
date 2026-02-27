import { defineComponent as _defineComponent, type PropType } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock, createVNode as _createVNode, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, toDisplayString as _toDisplayString, normalizeStyle as _normalizeStyle, withCtx as _withCtx, unref as _unref } from "vue"


const _hoisted_1 = /*#__PURE__*/ _createElementVNode("div", { class: "fade", "data-v-399359be": "" })
const _hoisted_2 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-device-tv", "data-v-399359be": "" })
const _hoisted_3 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-users ti-fw", "data-v-399359be": "" })
const _hoisted_4 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-pencil ti-fw", "data-v-399359be": "" })
const _hoisted_5 = /*#__PURE__*/ _createElementVNode("i", { class: "ti ti-user-star ti-fw", "data-v-399359be": "" })
const _hoisted_6 = { style: "margin-left: 4px;", "data-v-399359be": "" }
import { computed, ref, watch } from 'vue'
import * as Misskey from 'misskey-js'
import { $i } from '@/i.js'
import { i18n } from '@/i18n.js'
import { miLocalStorage } from '@/local-storage.js'

export default /*@__PURE__*/_defineComponent({
  __name: 'MkChannelPreview',
  props: {
    channel: { type: null as unknown as PropType<Misskey.entities.Channel>, required: true }
  },
  setup(__props) {

const props = __props
const getLastReadedAt = (): number | null => {
	return miLocalStorage.getItemAsJson(`channelLastReadedAt:${props.channel.id}`) ?? null;
};
const lastReadedAt = ref(getLastReadedAt());
watch(() => props.channel.id, () => {
	lastReadedAt.value = getLastReadedAt();
});
const updateLastReadedAt = () => {
	lastReadedAt.value = props.channel.lastNotedAt ? Date.parse(props.channel.lastNotedAt) : Date.now();
};
const bannerStyle = computed(() => {
	if (props.channel.bannerUrl) {
		return { backgroundImage: `url(${props.channel.bannerUrl})` };
	} else {
		return { backgroundColor: '#4c5e6d' };
	}
});

return (_ctx: any,_cache: any) => {
  const _component_MkA = _resolveComponent("MkA")
  const _component_I18n = _resolveComponent("I18n")
  const _component_MkTime = _resolveComponent("MkTime")

  return (_openBlock(), _createElementBlock("div", {
      style: "position: relative;",
      "data-v-399359be": ""
    }, [ _createVNode(_component_MkA, {
        to: `/channels/${__props.channel.id}`,
        class: "eftoefju _panel",
        onClick: updateLastReadedAt
      }, {
        default: _withCtx(() => [
          _createElementVNode("div", {
            class: "banner",
            style: _normalizeStyle(bannerStyle.value),
            "data-v-399359be": ""
          }, [
            _hoisted_1,
            _createElementVNode("div", {
              class: "name",
              "data-v-399359be": ""
            }, [
              _hoisted_2,
              _createTextVNode(" "),
              _createTextVNode(_toDisplayString(__props.channel.name), 1 /* TEXT */)
            ]),
            (__props.channel.isSensitive)
              ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                class: "sensitiveIndicator",
                "data-v-399359be": ""
              }, _toDisplayString(_unref(i18n).ts.sensitive), 1 /* TEXT */))
              : _createCommentVNode("v-if", true),
            _createElementVNode("div", {
              class: "status",
              "data-v-399359be": ""
            }, [
              _createElementVNode("div", null, [
                _hoisted_3,
                _createVNode(_component_I18n, {
                  src: _unref(i18n).ts._channel.usersCount,
                  tag: "span",
                  style: "margin-left: 4px;"
                }, {
                  n: _withCtx(() => [
                    _createElementVNode("b", null, _toDisplayString(__props.channel.usersCount), 1 /* TEXT */)
                  ]),
                  _: 1 /* STABLE */
                })
              ]),
              _createElementVNode("div", null, [
                _hoisted_4,
                _createVNode(_component_I18n, {
                  src: _unref(i18n).ts._channel.notesCount,
                  tag: "span",
                  style: "margin-left: 4px;"
                }, {
                  n: _withCtx(() => [
                    _createElementVNode("b", null, _toDisplayString(__props.channel.notesCount), 1 /* TEXT */)
                  ]),
                  _: 1 /* STABLE */
                })
              ]),
              (_unref($i) != null && _unref($i).id === __props.channel.userId)
                ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  style: "color: var(--MI_THEME-warn)",
                  "data-v-399359be": ""
                }, [
                  _hoisted_5,
                  _createElementVNode("span", _hoisted_6, _toDisplayString(_unref(i18n).ts.youAreAdmin), 1 /* TEXT */)
                ]))
                : _createCommentVNode("v-if", true)
            ])
          ], 4 /* STYLE */),
          (__props.channel.description)
            ? (_openBlock(), _createElementBlock("article", {
              key: 0,
              "data-v-399359be": ""
            }, [
              _createElementVNode("p", {
                title: __props.channel.description,
                "data-v-399359be": ""
              }, _toDisplayString(__props.channel.description.length > 85 ? __props.channel.description.slice(0, 85) + '…' : __props.channel.description), 9 /* TEXT, PROPS */, ["title"])
            ]))
            : _createCommentVNode("v-if", true),
          _createElementVNode("footer", null, [
            (__props.channel.lastNotedAt)
              ? (_openBlock(), _createElementBlock("span", {
                key: 0,
                "data-v-399359be": ""
              }, [
                _createTextVNode("\n\t\t\t\t"),
                _toDisplayString(_unref(i18n).ts.updatedAt),
                _createTextVNode(": "),
                _createVNode(_component_MkTime, { time: __props.channel.lastNotedAt })
              ]))
              : _createCommentVNode("v-if", true)
          ])
        ]),
        _: 1 /* STABLE */
      }), (__props.channel.lastNotedAt && (__props.channel.isFavorited || __props.channel.isFollowing) && (!lastReadedAt.value || Date.parse(__props.channel.lastNotedAt) > lastReadedAt.value)) ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "indicator",
          "data-v-399359be": ""
        })) : _createCommentVNode("v-if", true) ]))
}
}

})
