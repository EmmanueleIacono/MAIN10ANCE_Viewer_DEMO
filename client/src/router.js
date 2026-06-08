import {createRouter, createWebHistory} from 'vue-router';
import TabBIM from './components/TabBIM.vue';
import TabGIS from './components/TabGIS.vue';
import TabCollection from './components/TabCollection.vue';
import TabPlanner from './components/TabPlanner.vue';
import TabDashboard from './components/TabDashboard.vue';
import TabAnagrafica from './components/TabAnagrafica/Main.vue';
import TabAuth from './components/TabAuth.vue';

const routes = [
  {path: '/', redirect: {name: 'gis'}},
  {path: '/gis', name: 'gis', component: TabGIS, meta: {tab: 'Tab2'}},
  {path: '/bim', name: 'bim', component: TabBIM, meta: {tab: 'Tab1'}},
  {path: '/galleria', name: 'collection', component: TabCollection, meta: {tab: 'Tab5'}},
  {path: '/planner', name: 'planner', component: TabPlanner, meta: {tab: 'Tab3'}},
  {path: '/dashboard', name: 'dashboard', component: TabDashboard, meta: {tab: 'Tab4'}},
  {path: '/anagrafica', name: 'anagrafica', component: TabAnagrafica, meta: {tab: 'Tab6'}},
  {path: '/accesso', name: 'auth', component: TabAuth, meta: {tab: 'TabAuth'}},
  {path: '/documenti', name: 'documenti', component: TabGIS, meta: {tab: 'Tab2', docsDialog: true}},
  {path: '/:pathMatch(.*)*', redirect: {name: 'gis'}},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
