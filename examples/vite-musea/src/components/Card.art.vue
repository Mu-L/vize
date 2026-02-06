<script setup lang="ts">
import Card from './Card.vue'
import Button from './Button.vue'
</script>

<art
  title="Card"
  component="./Card.vue"
  category="Layout"
  status="ready"
  tags="card,container,layout"
>
  <variant name="Default" default>
    <Card title="Getting Started" description="Learn how to build with Musea components.">
      <Button variant="primary">Read More</Button>
    </Card>
  </variant>
  <variant name="With Image">
    <Card
      title="Featured"
      description="A card with an image header for rich content display."
      image="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <Button variant="primary">View</Button>
      <Button>Share</Button>
    </Card>
  </variant>
  <variant name="Outlined">
    <Card title="Outlined Card" description="A card with an outlined style." variant="outlined">
      <Button>Action</Button>
    </Card>
  </variant>
  <variant name="Elevated">
    <Card title="Elevated Card" description="A card with elevation shadow." variant="elevated">
      <Button variant="primary">Action</Button>
    </Card>
  </variant>
</art>
