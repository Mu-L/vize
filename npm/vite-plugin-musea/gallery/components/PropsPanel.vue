<script setup lang="ts">
import { watch } from 'vue'
import { usePalette } from '../composables/usePalette'
import TextControl from './controls/TextControl.vue'
import NumberControl from './controls/NumberControl.vue'
import BooleanControl from './controls/BooleanControl.vue'
import RangeControl from './controls/RangeControl.vue'
import SelectControl from './controls/SelectControl.vue'
import ColorControl from './controls/ColorControl.vue'

const props = defineProps<{
  artPath: string
}>()

const { palette, loading, error, values, load, setValue, resetValues } = usePalette()

watch(() => props.artPath, (path) => {
  if (path) load(path)
}, { immediate: true })

function getControlComponent(kind: string) {
  switch (kind) {
    case 'text': return TextControl
    case 'number': return NumberControl
    case 'boolean': return BooleanControl
    case 'range': return RangeControl
    case 'select':
    case 'radio': return SelectControl
    case 'color': return ColorControl
    default: return TextControl
  }
}
</script>

<template>
  <div class="props-panel">
    <div v-if="loading" class="props-loading">
      <div class="loading-spinner" />
      Loading props...
    </div>

    <div v-else-if="error" class="props-error">
      {{ error }}
    </div>

    <template v-else-if="palette && palette.controls.length > 0">
      <div class="props-header">
        <h3 class="props-title">Props Controls</h3>
        <button class="props-reset" @click="resetValues">
          Reset
        </button>
      </div>

      <div class="props-grid">
        <template v-for="group in palette.groups" :key="group">
          <div v-if="group" class="props-group-header">{{ group }}</div>
          <template v-for="control in palette.controls.filter(c => c.group === group)" :key="control.name">
            <component
              :is="getControlComponent(control.control)"
              :label="control.name"
              :description="control.description"
              :required="control.required"
              :options="control.options"
              :min="control.range?.min"
              :max="control.range?.max"
              :step="control.range?.step"
              :model-value="values[control.name]"
              @update:model-value="(v: unknown) => setValue(control.name, v)"
            />
          </template>
        </template>

        <template v-for="control in palette.controls.filter(c => !c.group)" :key="control.name">
          <component
            :is="getControlComponent(control.control)"
            :label="control.name"
            :description="control.description"
            :required="control.required"
            :options="control.options"
            :min="control.range?.min"
            :max="control.range?.max"
            :step="control.range?.step"
            :model-value="values[control.name]"
            @update:model-value="(v: unknown) => setValue(control.name, v)"
          />
        </template>
      </div>

      <div class="props-json">
        <div class="props-json-header">Current Values</div>
        <pre class="props-json-code">{{ JSON.stringify(values, null, 2) }}</pre>
      </div>
    </template>

    <div v-else class="props-empty">
      <p>No props controls available for this component.</p>
      <p class="props-empty-hint">
        Add a <code>component</code> attribute to the <code>&lt;art&gt;</code> block to enable props analysis.
      </p>
    </div>
  </div>
</template>

<style scoped>
.props-panel {
  padding: 0.5rem;
}

.props-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  min-height: 200px;
  color: var(--musea-text-muted);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--musea-border);
  border-top-color: var(--musea-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.props-error {
  padding: 1rem;
  color: var(--musea-error);
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: var(--musea-radius-md);
  font-size: 0.8125rem;
}

.props-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.props-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.props-reset {
  background: var(--musea-bg-tertiary);
  border: 1px solid var(--musea-border);
  border-radius: var(--musea-radius-sm);
  color: var(--musea-text-muted);
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  transition: all var(--musea-transition);
}

.props-reset:hover {
  border-color: var(--musea-text-muted);
  color: var(--musea-text);
}

.props-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.props-group-header {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--musea-text-muted);
  margin-top: 0.5rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--musea-border-subtle);
}

.props-json {
  margin-top: 1.5rem;
  background: var(--musea-bg-secondary);
  border: 1px solid var(--musea-border);
  border-radius: var(--musea-radius-md);
  overflow: hidden;
}

.props-json-header {
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--musea-text-muted);
  background: var(--musea-bg-tertiary);
  border-bottom: 1px solid var(--musea-border);
}

.props-json-code {
  padding: 0.75rem;
  font-family: var(--musea-font-mono);
  font-size: 0.75rem;
  color: var(--musea-text-secondary);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.props-empty {
  padding: 2rem;
  text-align: center;
  color: var(--musea-text-muted);
  font-size: 0.875rem;
}

.props-empty-hint {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
}

.props-empty code {
  background: var(--musea-bg-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: var(--musea-font-mono);
}
</style>
