<template>
  <teleport v-if="store.state.alertVisibile" to="#alert">
    <div class="alert-container">
      <div class="fill pannello-alert">
        <div class="panel panel-default fill pannello-alert-child">
          <div class="panel-heading pannello-alert-header" data-toggle="tooltip">
            <b>ATTENZIONE</b>
          </div>
          <div class="panel-body">
            <div>{{store.state.alertMessaggio}}</div>
          </div>
          <div class="alert-footer">
            <button @click="store.methods.resetAlert" class="bottone-main10ance">CHIUDI</button>
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

    return {
      store,
    }
  }
}
</script>

<style scoped>
button:hover {
  background-color: #aaa;
}
.alert-container {
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
.pannello-alert {
  width: 50vw;
  max-width: 500px;
}
.pannello-alert-child {
  overflow: auto;
  border: none;
  height: fit-content;
  min-height: 120px;
}
.pannello-alert-header {
  color: var(--verdeMain10ance);
  background-color: var(--blackOlive);
}
.alert-footer {
  padding: 15px;
  float: right;
}
</style>
