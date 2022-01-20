<template>
<div>
  <div @click="apriNodo" class="parent-icona" :style="idCliccato === node.id ? stileCliccato : null">
    <i v-if="node.children" :class="state.nodeOpen ? 'glyphicon-triangle-bottom' : 'glyphicon-triangle-right'" class="glyphicon icona open-close-node"></i>
    <i :class="icone[node.type] || icone['default']" class="glyphicon icona"></i>
    {{node.text}}
  </div>
  <div class="children-container">
    <img v-if="state.childLoad && !state.childNodes" src="../../assets/img/ajax-loader-3.gif" style="height: 15px;">
    <div v-if="state.childNodes && state.nodeOpen">
      <TreeNode @click="apriModello(nodo.id)" v-for="nodo in state.childNodes" :key="nodo.id" :node="nodo" />
    </div>
  </div>
</div>
</template>

<script>
import {inject, reactive} from 'vue';
import {getObjects} from '../../js/richieste';
import {getModel} from '../../js/BIM';

export default {
  name: 'TreeNode',
  props: {
    node: Object,
  },
  setup(props, context) {
    const idCliccato = inject('idCliccato');
    const state = reactive({
      nodeOpen: false,
      childNodes: null,
      childLoad: false,
    });

    const icone = {
      'default': 'glyphicon glyphicon-question-sign',
      'bucket': 'glyphicon glyphicon-folder-open',
      'object': 'glyphicon glyphicon-file'
    }
    const stileCliccato = {
      'background': "#beebff",
      'border-radius': "2px",
      'box-shadow': "inset 0 0 1px #999999",
    }

    async function apriNodo() {
      context.emit('cambiaIdCliccato', props.node.id);
      state.nodeOpen = !state.nodeOpen;
      if (!state.childNodes && props.node.children) {
        state.childLoad = true;
        const childObjects = await getObjects(props.node.id);
        state.childNodes = childObjects;
      }
    }
    function apriModello(id) {
      context.emit('cambiaIdCliccato', id);
      getModel(id);
    }

    return {
      idCliccato,
      state,
      icone,
      stileCliccato,
      apriNodo,
      apriModello,
    }
  }
}
</script>

<style scoped>
.parent-icona {
  margin-top: 1px;
  margin-bottom: 4px;
  cursor: pointer;
  width: fit-content;
  padding: 0 4px 0 1px;
  transition: background-color .15s, box-shadow .15s;
}
.parent-icona:hover {
  background: #e7f4f9;
  border-radius: 2px;
  box-shadow: inset 0 0 1px #cccccc;
}
.icona {
  margin-right: 2px;
}
.open-close-node {
  font-size: 10px;
  margin-right: 10px;
}
.children-container {
  margin-left: 30px;
}
</style>
