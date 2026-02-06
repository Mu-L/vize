<script setup lang="ts">
import Badge from './Badge.vue'
</script>

<art
  title="Badge"
  component="./Badge.vue"
  category="Components"
  status="ready"
  tags="badge,tag,label"
>
  <variant name="Default" default>
    <Badge>Default</Badge>
  </variant>
  <variant name="Variants">
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  </variant>
  <variant name="Sizes">
    <div style="display: flex; gap: 0.5rem; align-items: center">
      <Badge size="sm" variant="info">Small</Badge>
      <Badge size="md" variant="info">Medium</Badge>
      <Badge size="lg" variant="info">Large</Badge>
    </div>
  </variant>
</art>
