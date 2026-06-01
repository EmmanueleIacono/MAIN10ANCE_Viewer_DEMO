<template>
<div :class="colonna" class="panel panel-default fill ovf">
  <slot>MainPanel default content</slot>
</div>
</template>

<script setup>
defineProps({
  colonna: String
});
</script>

<style scoped>
.ovf {
  overflow: auto;
}
</style>
