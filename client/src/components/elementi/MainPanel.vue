<template>
<div class="panel panel-default fill ovf m10-main-panel">
  <slot>MainPanel default content</slot>
</div>
</template>

<style scoped>
.ovf {
  overflow: auto;
}

:global(.m10-split-layout) {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

:global(.m10-split-layout > .m10-main-panel) {
  flex: 1 1 auto;
  width: auto !important;
  min-width: 0;
  float: none !important;
}
</style>
