<template>
<div>
  <details>
    <summary class="sommario-main10ance"><b>{{summary}}</b></summary>
    <slot>Default content</slot>
  </details>
</div>
</template>

<script>
export default {
  name: 'Details',
  props: {
    summary: String,
  }
}
</script>

<style scoped>
.sommario-main10ance {
  display: revert;
  cursor: pointer;
}
</style>
