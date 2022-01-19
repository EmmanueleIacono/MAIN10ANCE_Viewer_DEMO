<template>
  <button :id="nome" :class="icona" :title="title" class="glyphicon dbBtn" height="30"></button>
</template>

<script>
export default {
  name: 'BottoneBIMExplorer',
  props: {
    icona: String,
    nome: String,
    title: String,
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
  background: var(--verdeMain10ance);
  color: var(--ghostWhite);
  margin-bottom: 1rem;
  padding: .9rem 1rem;
  font-size: large;
  font-weight: initial;
}
</style>
