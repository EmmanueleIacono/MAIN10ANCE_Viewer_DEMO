<template>
  <teleport v-if="store.state.confirmVisibile" to="#confirm">
    <div class="confirm-container">
      <div class="fill pannello-confirm">
        <div class="panel panel-default fill pannello-confirm-child">
          <div class="panel-heading pannello-confirm-header" data-toggle="tooltip">
            <b>ATTENZIONE</b>
          </div>
          <div class="panel-body">
            <span style="white-space: pre;">{{store.state.confirmMessaggio}}</span>
          </div>
          <div class="alert-footer">
            <button @click="conferma(true)" class="bottone-main10ance">OK</button>
            <button @click="conferma(false)" class="bottone-main10ance verde-trasp">ANNULLA</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import {inject} from 'vue';

export default {
  name: 'Alert',
  setup() {
    const store = inject('store');

    function conferma(bool) {
      store.methods.resetConfirm(bool);
    }

    return {
      store,
      conferma,
    }
  }
}
</script>

<style scoped>
button:hover {
  background-color: #aaa;
}
.confirm-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.pannello-confirm {
  width: 50vw;
  max-width: 500px;
}
.pannello-confirm-child {
  overflow: auto;
  border: none;
  height: fit-content;
  min-height: 120px;
}
.pannello-confirm-header {
  color: var(--verdeMain10ance);
  background-color: var(--blackOlive);
}
.alert-footer {
  padding: 15px;
  float: right;
}
.verde-trasp {
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>
