import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'


  const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', component: Main },
      { path: '/login', component: Login },
      { path: '/register', component: Register }
    ]
  })

  export default router