<template>
<div
  ref="explorerRef"
  :class="{'is-collapsed': collassato}"
  class="fill pannello-explorer m10-explorer"
>
  <button
    type="button"
    class="explorer-resize-handle"
    title="Ridimensiona navigatore"
    @pointerdown="iniziaResize"
  ></button>
  <div class="panel panel-default fill pannello-explorer-child">
    <div class="panel-heading pannello-explorer-header" data-toggle="tooltip">
      <b class="explorer-title">NAVIGATORE</b>
      <button
        type="button"
        class="explorer-collapse-btn glyphicon"
        :class="collassato ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right'"
        :title="collassato ? 'Espandi navigatore' : 'Comprimi navigatore'"
        @click="toggleCollasso"
      ></button>
    </div>
    <div v-show="!collassato" class="panel-body explorer-content">
      <slot>Explorer default content</slot>
    </div>
  </div>
</div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';

const STORAGE_WIDTH_KEY = 'm10_explorer_width_percent';
const DEFAULT_EXPLORER_WIDTH = 5 / 12 * 100;
const MIN_EXPLORER_WIDTH = 18;
const MAX_EXPLORER_WIDTH = 66;

const collassato = ref(false);
const explorerWidth = ref(leggiLarghezzaSalvata());
const explorerRef = ref(null);
const parentLayout = ref(null);

const explorerWidthCss = computed(() => `${explorerWidth.value}%`);

onMounted(() => {
  parentLayout.value = explorerRef.value?.parentElement || null;
  if (parentLayout.value) {
    parentLayout.value.classList.add('m10-split-layout');
    aggiornaLarghezzaLayout();
  }
});

onBeforeUnmount(() => {
  rimuoviListenerResize();
});

function toggleCollasso() {
  collassato.value = !collassato.value;
}

function iniziaResize(event) {
  if (collassato.value) return;
  parentLayout.value = event.currentTarget.closest('.m10-split-layout');
  if (!parentLayout.value) return;
  event.preventDefault();
  event.currentTarget.setPointerCapture?.(event.pointerId);
  window.addEventListener('pointermove', aggiornaResize);
  window.addEventListener('pointerup', terminaResize);
}

function aggiornaResize(event) {
  if (!parentLayout.value) return;
  const rect = parentLayout.value.getBoundingClientRect();
  const nuovaLarghezza = (rect.right - event.clientX) / rect.width * 100;
  explorerWidth.value = limitaLarghezza(nuovaLarghezza);
  aggiornaLarghezzaLayout();
}

function terminaResize() {
  localStorage.setItem(STORAGE_WIDTH_KEY, String(explorerWidth.value));
  rimuoviListenerResize();
}

function rimuoviListenerResize() {
  window.removeEventListener('pointermove', aggiornaResize);
  window.removeEventListener('pointerup', terminaResize);
}

function aggiornaLarghezzaLayout() {
  parentLayout.value?.style.setProperty('--m10-explorer-width', explorerWidthCss.value);
}

function leggiLarghezzaSalvata() {
  const valoreSalvato = localStorage.getItem(STORAGE_WIDTH_KEY);
  if (valoreSalvato === null) return DEFAULT_EXPLORER_WIDTH;
  const salvata = Number(valoreSalvato);
  if (!Number.isFinite(salvata)) return DEFAULT_EXPLORER_WIDTH;
  return limitaLarghezza(salvata);
}

function limitaLarghezza(value) {
  return Math.min(MAX_EXPLORER_WIDTH, Math.max(MIN_EXPLORER_WIDTH, value));
}
</script>

<style scoped>
.pannello-explorer {
  position: relative;
  padding-left: 15px;
  padding-right: 0px;
}
.pannello-explorer-child {
  overflow: auto;
}
.pannello-explorer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  color: var(--verdeMain10ance);
  background-color: var(--blackOlive);
}

.explorer-title {
  min-width: 0;
}

.explorer-collapse-btn {
  width: 2.6rem;
  height: 2.6rem;
  flex: 0 0 auto;
  border: 1px solid rgba(168, 201, 86, .45);
  background: transparent;
  color: var(--verdeMain10ance);
  cursor: pointer;
}

.explorer-collapse-btn:hover,
.explorer-collapse-btn:focus {
  background: var(--verdeMain10ance);
  color: var(--blackOlive);
}

.explorer-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  z-index: 3;
  width: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: col-resize;
}

.explorer-resize-handle::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 4px;
  width: 2px;
  background: transparent;
}

.explorer-resize-handle:hover::after,
.explorer-resize-handle:focus::after {
  background: var(--verdeMain10ance);
}

.is-collapsed {
  padding-left: 0;
}

.is-collapsed .pannello-explorer-child {
  overflow: hidden;
}

.is-collapsed .pannello-explorer-header {
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  padding: .8rem .4rem;
}

.is-collapsed .explorer-title {
  margin-top: 1rem;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0;
}

.is-collapsed .explorer-resize-handle {
  display: none;
}

:global(.m10-split-layout > .m10-explorer) {
  flex: 0 0 var(--m10-explorer-width, 41.6667%);
  width: var(--m10-explorer-width, 41.6667%) !important;
  min-width: 18rem;
  float: none !important;
}

:global(.m10-split-layout > .m10-explorer.is-collapsed) {
  flex-basis: 4.2rem;
  width: 4.2rem !important;
  min-width: 4.2rem;
}

:global(.m10-split-layout > .m10-explorer),
:global(.m10-split-layout > .m10-main-panel) {
  height: 100%;
}
</style>
