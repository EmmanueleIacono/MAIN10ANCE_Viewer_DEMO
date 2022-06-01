<template>
  <button :id="nome" :class="[icona, colore]" :title="title" class="glyphicon dbBtn" height="30"></button>
</template>

<script>
export default {
  name: 'BottoneBIMExplorer',
  props: {
    icona: String,
    nome: String,
    title: String,
    colore: String,
  }
}
</script>

<style scoped>
.dbBtn {
  margin-top: 0px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
  border: none;
  color: var(--ghostWhite);
  margin-bottom: 1rem;
  padding: .9rem 1rem;
  font-size: large;
  font-weight: initial;
}
.verde {
  background: var(--verdeMain10ance);
}
.blu {
  background: var(--bluInterreg);
}
.giallo {
  background: var(--gialloIntervento);
}
.verde:hover {
  background: var(--verdeMain10anceTrasparenza);
}
.blu:hover {
  background: var(--bluInterregTrasparenza);
}
.giallo:hover {
  background: var(--gialloInterventoTrasparenza);
}
</style>
