<script setup lang="ts">
import { computed } from 'vue'
import type { ArtVariant } from '../../src/types.js'
import { getPreviewUrl } from '../api'

const props = defineProps<{
  artPath: string
  variant: ArtVariant
}>()

const previewUrl = computed(() => getPreviewUrl(props.artPath, props.variant.name))
</script>

<template>
  <div class="variant-card">
    <div class="variant-preview">
      <iframe
        :src="previewUrl"
        loading="lazy"
        :title="variant.name"
      />
    </div>
    <div class="variant-info">
      <div class="variant-left">
        <span class="variant-name">{{ variant.name }}</span>
        <span v-if="variant.isDefault" class="variant-badge">Default</span>
      </div>
      <div class="variant-actions">
        <button
          class="variant-action-btn"
          title="Open in new tab"
          @click="window.open(previewUrl, '_blank')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Expose window for template
const window = globalThis.window
</script>

<style scoped>
.variant-card {
  background: var(--musea-bg-secondary);
  border: 1px solid var(--musea-border);
  border-radius: var(--musea-radius-lg);
  overflow: hidden;
  transition: all var(--musea-transition);
}

.variant-card:hover {
  border-color: var(--musea-text-muted);
  box-shadow: var(--musea-shadow);
  transform: translateY(-2px);
}

.variant-preview {
  aspect-ratio: 16 / 10;
  background: var(--musea-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.variant-preview iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.variant-info {
  padding: 1rem;
  border-top: 1px solid var(--musea-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.variant-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.variant-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.variant-badge {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  background: var(--musea-accent-subtle);
  color: var(--musea-accent);
}

.variant-actions {
  display: flex;
  gap: 0.5rem;
}

.variant-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--musea-bg-tertiary);
  border-radius: var(--musea-radius-sm);
  color: var(--musea-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--musea-transition);
}

.variant-action-btn:hover {
  background: var(--musea-bg-elevated);
  color: var(--musea-text);
}

.variant-action-btn svg {
  width: 14px;
  height: 14px;
}
</style>
