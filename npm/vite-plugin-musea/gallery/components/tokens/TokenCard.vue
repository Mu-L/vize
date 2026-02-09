<script setup lang="ts">
import { computed } from 'vue'
import type { DesignToken } from '../../api'
import SpacingPreview from './SpacingPreview.vue'
import TypographyPreview from './TypographyPreview.vue'

const props = withDefaults(defineProps<{
  name: string
  token: DesignToken
  categoryPath?: string
  usageCount?: number
}>(), {
  usageCount: 0,
})

const emit = defineEmits<{
  edit: []
  delete: []
  showUsage: []
}>()

const isColor = computed(() => {
  if (props.token.type === 'color') return true
  if (typeof props.token.value !== 'string') return false
  return (
    props.token.value.startsWith('#') ||
    props.token.value.startsWith('rgb') ||
    props.token.value.startsWith('hsl')
  )
})

const displayValue = computed(() => {
  if (props.token.$tier === 'semantic' && props.token.$resolvedValue !== undefined) {
    return props.token.$resolvedValue
  }
  return props.token.value
})

const previewType = computed<'color' | 'spacing' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'shadow' | 'borderRadius' | 'generic'>(() => {
  if (isColor.value) return 'color'

  const path = props.categoryPath?.toLowerCase() ?? ''
  const type = props.token.type?.toLowerCase() ?? ''
  const name = props.name.toLowerCase()

  if (type === 'dimension' || type === 'spacing') {
    if (path.includes('spacing') || name.includes('spacing') || name.includes('gap') || name.includes('padding') || name.includes('margin')) {
      return 'spacing'
    }
    if (path.includes('font-size') || path.includes('fontsize') || name.includes('font-size') || name.includes('fontsize')) {
      return 'fontSize'
    }
    if (path.includes('border-radius') || path.includes('borderradius') || name.includes('radius')) {
      return 'borderRadius'
    }
  }

  if (type === 'fontweight' || name.includes('font-weight') || name.includes('fontweight') || name.includes('weight')) {
    return 'fontWeight'
  }

  if (type === 'lineheight' || name.includes('line-height') || name.includes('lineheight')) {
    return 'lineHeight'
  }

  if (type === 'shadow' || name.includes('shadow')) {
    return 'shadow'
  }

  return 'generic'
})

const tierLabel = computed(() => {
  if (props.token.$tier === 'semantic') return 'Semantic'
  if (props.token.$tier === 'primitive') return 'Primitive'
  return null
})
</script>

<template>
  <div class="token-card" :class="{ 'token-card--semantic': token.$tier === 'semantic' }">
    <div class="token-preview">
      <!-- Color swatch -->
      <div
        v-if="previewType === 'color'"
        class="color-swatch"
        :style="{ background: String(displayValue) }"
      />
      <!-- Spacing bar -->
      <SpacingPreview
        v-else-if="previewType === 'spacing'"
        :value="displayValue"
      />
      <!-- Typography previews -->
      <TypographyPreview
        v-else-if="previewType === 'fontSize'"
        :value="displayValue"
        token-type="fontSize"
      />
      <TypographyPreview
        v-else-if="previewType === 'fontWeight'"
        :value="displayValue"
        token-type="fontWeight"
      />
      <TypographyPreview
        v-else-if="previewType === 'lineHeight'"
        :value="displayValue"
        token-type="lineHeight"
      />
      <!-- Shadow preview -->
      <div
        v-else-if="previewType === 'shadow'"
        class="shadow-swatch"
        :style="{ boxShadow: String(displayValue) }"
      />
      <!-- Border radius preview -->
      <div
        v-else-if="previewType === 'borderRadius'"
        class="radius-swatch"
        :style="{ borderRadius: String(displayValue) }"
      />
      <!-- Generic -->
      <div v-else class="generic-preview">
        <span class="generic-value-icon">T</span>
      </div>
    </div>

    <div class="token-info">
      <div class="token-name-row">
        <span class="token-name">{{ name }}</span>
        <span v-if="tierLabel" class="tier-badge" :class="'tier-badge--' + token.$tier">
          {{ tierLabel }}
        </span>
      </div>
      <div class="token-value">{{ token.value }}</div>
      <div v-if="token.$tier === 'semantic' && token.$reference" class="token-reference">
        <span class="ref-arrow">&rarr;</span> {{ token.$reference }}
        <span v-if="token.$resolvedValue !== undefined" class="ref-resolved">
          ({{ token.$resolvedValue }})
        </span>
      </div>
      <div v-if="token.description" class="token-desc">{{ token.description }}</div>
    </div>

    <button
      v-if="usageCount > 0"
      class="usage-badge"
      title="View component usage"
      @click.stop="emit('showUsage')"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      {{ usageCount }}
    </button>

    <div class="token-actions">
      <button class="action-btn" title="Edit" @click.stop="emit('edit')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button class="action-btn action-btn--danger" title="Delete" @click.stop="emit('delete')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.token-card {
  background: var(--musea-bg-secondary);
  border: 1px solid var(--musea-border);
  border-radius: var(--musea-radius-md);
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: border-color var(--musea-transition);
  position: relative;
}

.token-card:hover {
  border-color: var(--musea-text-muted);
}

.token-card:hover .token-actions {
  opacity: 1;
}

.token-preview {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch {
  width: 48px;
  height: 48px;
  border-radius: var(--musea-radius-md);
  border: 1px solid var(--musea-border);
}

.shadow-swatch {
  width: 40px;
  height: 40px;
  border-radius: var(--musea-radius-md);
  background: var(--musea-bg-secondary);
}

.radius-swatch {
  width: 40px;
  height: 40px;
  border: 2px solid var(--musea-accent);
  background: transparent;
}

.generic-preview {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--musea-border);
  border-radius: var(--musea-radius-md);
  color: var(--musea-text-muted);
}

.generic-value-icon {
  font-family: var(--musea-font-mono);
  font-size: 1rem;
  font-weight: 600;
}

.token-info {
  flex: 1;
  min-width: 0;
}

.token-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.token-name {
  font-weight: 600;
  font-family: var(--musea-font-mono);
  font-size: 0.875rem;
  word-break: break-all;
}

.tier-badge {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

.tier-badge--primitive {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.tier-badge--semantic {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.token-value {
  color: var(--musea-text-muted);
  font-family: var(--musea-font-mono);
  font-size: 0.75rem;
  word-break: break-all;
}

.token-reference {
  font-size: 0.6875rem;
  color: var(--musea-text-muted);
  font-family: var(--musea-font-mono);
  margin-top: 0.125rem;
}

.ref-arrow {
  color: #c084fc;
}

.ref-resolved {
  opacity: 0.7;
}

.token-desc {
  color: var(--musea-text-muted);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.usage-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--musea-border);
  border-radius: 9999px;
  background: transparent;
  color: var(--musea-text-muted);
  font-size: 0.6875rem;
  font-family: var(--musea-font-mono);
  cursor: pointer;
  transition: border-color var(--musea-transition), color var(--musea-transition);
  white-space: nowrap;
  flex-shrink: 0;
}

.usage-badge:hover {
  border-color: var(--musea-accent);
  color: var(--musea-accent);
}

.token-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity var(--musea-transition);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--musea-text-muted);
  border-radius: var(--musea-radius-sm, 4px);
  cursor: pointer;
  transition: background var(--musea-transition), color var(--musea-transition);
}

.action-btn:hover {
  background: var(--musea-border);
  color: var(--musea-text);
}

.action-btn--danger:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}
</style>
