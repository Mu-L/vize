<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchDocs } from '../api'

const props = defineProps<{
  artPath: string
}>()

const markdown = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

watch(() => props.artPath, async (path) => {
  if (!path) return
  loading.value = true
  error.value = null
  try {
    const data = await fetchDocs(path)
    markdown.value = data.markdown
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div class="docs-panel">
    <div v-if="loading" class="docs-loading">
      <div class="loading-spinner" />
      Loading documentation...
    </div>

    <div v-else-if="error" class="docs-error">
      {{ error }}
    </div>

    <div v-else-if="markdown" class="docs-content">
      <!-- Render markdown as pre-formatted text; a proper markdown renderer can be added later -->
      <pre class="docs-markdown">{{ markdown }}</pre>
    </div>

    <div v-else class="docs-empty">
      <p>No documentation available for this component.</p>
    </div>
  </div>
</template>

<style scoped>
.docs-panel {
  padding: 0.5rem;
}

.docs-loading {
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

.docs-error {
  padding: 1rem;
  color: var(--musea-error);
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: var(--musea-radius-md);
  font-size: 0.8125rem;
}

.docs-content {
  background: var(--musea-bg-secondary);
  border: 1px solid var(--musea-border);
  border-radius: var(--musea-radius-md);
  overflow: hidden;
}

.docs-markdown {
  padding: 1.5rem;
  font-family: var(--musea-font-sans);
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--musea-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.docs-empty {
  padding: 2rem;
  text-align: center;
  color: var(--musea-text-muted);
  font-size: 0.875rem;
}
</style>
