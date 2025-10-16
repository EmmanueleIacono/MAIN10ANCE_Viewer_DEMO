<template>
<div :class="colonna" class="fill pannello-explorer">
  <div class="panel panel-default fill pannello-explorer-child">
    <div class="panel-heading pannello-explorer-header" data-toggle="tooltip">
      <b>NAVIGATORE</b>
    </div>
    <div class="panel-body">
      <slot>Explorer default content</slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Explorer',
  props: {
    colonna: String
  }
}
</script>

<style scoped>
.pannello-explorer {
  padding-left: 15px;
  padding-right: 0px;
}
.pannello-explorer-child {
  overflow: auto;
}
.pannello-explorer-header {
  color: var(--verdeMain10ance);
  background-color: var(--blackOlive);
}
</style>
