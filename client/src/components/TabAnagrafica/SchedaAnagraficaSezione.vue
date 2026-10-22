<template>
  <table
    class="form-table anagrafica-section"
    :class="{'first-section': prima, 'section-open': aperta, 'section-collapsed': !aperta}"
  >
    <tbody>
      <tr
        class="section-title-row"
        tabindex="0"
        :title="aperta ? 'Clicca per chiudere la sezione' : 'Clicca per aprire la sezione'"
        @click="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      >
        <td colspan="2"><b>{{ titolo }}</b></td>
      </tr>
      <slot />
    </tbody>
  </table>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
  titolo: {
    type: String,
    required: true,
  },
  modalitaModifica: {
    type: Boolean,
    default: false,
  },
  prima: {
    type: Boolean,
    default: false,
  },
});

const aperta = ref(props.modalitaModifica);

watch(() => props.modalitaModifica, value => {
  aperta.value = value;
});

function toggle() {
  aperta.value = !aperta.value;
}
</script>

<style scoped>
.anagrafica-section {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-bottom: 1.2rem;
}

.anagrafica-section:not(.first-section) .section-title-row td {
  border-top: 1px solid #808080;
}

.section-title-row {
  cursor: pointer;
  outline: 0;
  user-select: none;
}

.section-title-row td {
  position: relative;
  padding: 1.2rem 11rem .4rem 3.4rem;
  color: inherit;
  text-align: center;
  vertical-align: middle;
  transition: background-color .15s ease, color .15s ease, box-shadow .15s ease;
}

.section-title-row:hover td,
.section-title-row:focus td {
  background-color: rgba(26, 91, 167, .12);
  box-shadow: inset 0 0 0 1px rgba(26, 91, 167, .28);
}

.section-title-row td::before {
  content: ">";
  position: absolute;
  left: .8rem;
  top: 50%;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(26, 91, 167, .45);
  background: rgba(255, 255, 255, .36);
  color: var(--bluMain10ance);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transform: translateY(-50%);
  transition: background-color .15s ease, color .15s ease;
}

.section-open .section-title-row td::before {
  content: "v";
}

.section-title-row:hover td::before,
.section-title-row:focus td::before {
  background: var(--bluMain10ance);
  color: #fff;
}

.section-title-row td::after {
  content: "Apri sezione";
  position: absolute;
  right: .8rem;
  top: 50%;
  padding: .25rem .7rem;
  border: 1px solid rgba(26, 91, 167, .25);
  background: rgba(255, 255, 255, .42);
  color: var(--bluMain10ance);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  transform: translateY(-50%);
  opacity: .9;
}

.section-open .section-title-row td::after {
  content: "Chiudi sezione";
}

.section-title-row:hover td::after,
.section-title-row:focus td::after {
  border-color: rgba(26, 91, 167, .5);
  background: #fff;
  text-decoration: underline;
}

.section-collapsed :deep(tbody tr:not(.section-title-row)) {
  display: none;
}

.anagrafica-section :deep(th) {
  width: 38%;
  vertical-align: top;
  background-color: transparent;
}

@media (max-width: 720px) {
  .section-title-row td {
    padding-right: 3.4rem;
  }

  .section-title-row td::after {
    display: none;
  }
}
</style>
