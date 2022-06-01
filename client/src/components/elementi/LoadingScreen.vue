<template>
  <div v-if="caricamento" class="caricamento">
    <img src="../../assets/img/spinning-loader-1.gif" alt="Loading" class="immagine-loading">
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  props: {
    caricamento: Boolean,
  }
}
</script>

<style scoped>
.caricamento {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9000;
}
.immagine-loading {
  height: 30px;
  opacity: .5;
}
</style>
