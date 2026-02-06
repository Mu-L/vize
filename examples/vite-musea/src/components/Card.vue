<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  image?: string
  variant?: 'default' | 'outlined' | 'elevated'
}>()
</script>

<template>
  <div class="card" :class="`card--${variant ?? 'default'}`">
    <div v-if="image" class="card-image">
      <div class="card-image-placeholder" :style="{ background: image }">
        <span>{{ title.charAt(0) }}</span>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="description" class="card-description">{{ description }}</p>
      <div class="card-footer">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 320px;
}

.card:hover {
  transform: translateY(-2px);
}

.card--default {
  background: #fff;
  border: 1px solid #e5e7eb;
}

.card--outlined {
  background: transparent;
  border: 2px solid #d1d5db;
}

.card--elevated {
  background: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card--elevated:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.card-body {
  padding: 1rem 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  gap: 0.5rem;
}
</style>
