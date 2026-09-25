<script setup lang="ts">
const count = 1
</script>

<template>
  <!-- @vue-ignore -->
  <div :id="count.missing">{{ count.missing }}</div>
</template>
