<template>
<div>
  <details :open="open">
    <summary class="sommario-main10ance"><b>{{summary}}</b></summary>
    <slot><img id="loading-image" src="../../assets/img/ajax-loader-3.gif" alt="Loading..." height="20" /></slot>
  </details>
</div>
</template>

<script>
export default {
  name: 'Details',
  props: {
    summary: String,
    open: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<style scoped>
.sommario-main10ance {
  display: revert;
  cursor: pointer;
}
</style>
