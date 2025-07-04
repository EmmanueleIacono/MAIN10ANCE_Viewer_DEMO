<template>
<div>
  <div @click.stop="apriNodo(node.id)" class="parent-icona" :class="idNodoSelezionato === node.id ? 'cliccato' : null">
    <i :class="state.nodeOpen ? 'glyphicon-triangle-bottom' : 'glyphicon-triangle-right'" class="glyphicon icona open-close-node"></i>
    <i :class="getNodeIcon()" class="glyphicon icona"></i>
    {{ node.nome }}
  </div>
  <div v-if="node.children && node.children.length > 0" class="children-container">
    <img v-if="state.childLoad" src="../../assets/img/ajax-loader-3.gif" style="height: 15px;">
    <div v-if="state.childNodes && state.nodeOpen && !state.childLoad">
      <TreeNode @cambiaIdCliccato="apriNodoChild(childNode.id)" v-for="childNode in state.childNodes" :key="childNode.id" :node="childNode" />
    </div>
  </div>
</div>
</template>

<script>
import { reactive, inject } from 'vue';

export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    },
  },
  emits: ['cambiaIdCliccato'],
  setup(props, { emit }) {
    const idNodoSelezionato = inject('cartellaSelezionata');

    const state = reactive({
      nodeOpen: false,
      childNodes: null,
      childLoad: false,
    });

    const icone = {
      'default': 'glyphicon-question-sign',
      'folder-open': 'glyphicon-folder-open',
      'folder-close': 'glyphicon-folder-close',
      'object': 'glyphicon-file'
    }

    function getNodeIcon() {
      if (props.node.type === 'folder') {
        return state.nodeOpen ? icone['folder-open'] : icone['folder-close'];
      }
      return icone[props.node.type] || icone['default'];
    }

    function apriNodo(id) {
      console.log('nodo aperto', id);
      console.log('nodo selezionato: ', idNodoSelezionato);
      emit('cambiaIdCliccato', id);
      state.nodeOpen = !state.nodeOpen;
      if (state.nodeOpen && !state.childNodes && props.node.children && props.node.children.length > 0) {
        state.childLoad = true;
        // per simulare load async, poi togliere
        setTimeout(() => {
          const childObjects = [...props.node.children]; // creo copia per evitare mutazioni (?)
          childObjects.sort((a, b) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });
          state.childNodes = childObjects;
          state.childLoad = false;
        }, 100);
      }
    }

    function apriNodoChild(id) {
      console.log('apri figlio: ', id);
      emit('cambiaIdCliccato', id);
    }

    return {
      state,
      idNodoSelezionato,
      icone,
      getNodeIcon,
      apriNodo,
      apriNodoChild,
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
  user-select: none;
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

.cliccato {
  background: #beebff;
  border-radius: 2px;
  box-shadow: inset 0 0 1px #999999;
}
</style>
