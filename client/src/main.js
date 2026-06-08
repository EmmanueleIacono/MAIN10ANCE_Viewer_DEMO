import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

createApp(App).use(router).mount('#app')
