<script setup lang="ts">
import Input from './Input.vue'
</script>

<art
  title="Input"
  component="./Input.vue"
  category="Forms"
  status="ready"
  tags="input,form,text"
>
  <variant name="Default" default>
    <Input placeholder="Enter text..." />
  </variant>
  <variant name="With Value">
    <Input model-value="Hello, Musea!" placeholder="Enter text..." />
  </variant>
  <variant name="Search">
    <Input type="search" placeholder="Search..." />
  </variant>
  <variant name="With Error">
    <Input model-value="bad@" error="Invalid email address" placeholder="Enter email..." />
  </variant>
  <variant name="Disabled">
    <Input model-value="Read only" disabled placeholder="Disabled input" />
  </variant>
</art>
