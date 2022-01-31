<template>
  <div class="au-card m-b-30">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card',
}
</script>

<style scoped>
.au-card {
    -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
    padding: 40px;
    padding-right: 35px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.4);
    overflow: hidden;
}
.m-b-30 {
    margin-bottom: 30px;
}
</style>
