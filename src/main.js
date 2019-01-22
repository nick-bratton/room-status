import Vue from 'vue'
import App from './App.vue'
import Calendar from '@/Calendar.vue'
import SelectRoom from '@/SelectRoom.vue'
import VueRouter from 'vue-router'

const router = new VueRouter({
  routes:[
    {path: '/calendar/:user', component: Calendar},
    {path: '/', component: SelectRoom},
  ]
})


Vue.config.productionTip = false

Vue.use(VueRouter)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
