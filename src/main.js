import Vue from 'vue'
import App from './App.vue'    
import VueKonva from 'vue-konva';
import VueRouter from 'vue-router' 
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import router from './router'

Vue.use(VueKonva);
Vue.use(VueRouter);
Vue.use(Buefy);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

