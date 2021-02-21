import Vue from 'vue'
import App from './App.vue'    
import VueKonva from 'vue-konva';
import VueRouter from 'vue-router' 

Vue.use(VueKonva);
Vue.use(VueRouter);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
