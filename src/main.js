import Vue from 'vue'
import App from './App.vue'
import Calendar from '@/views/RoomStatus.vue'
import SelectRoom from '@/views/RoomSelection.vue'
import VueRouter from 'vue-router'

const router = new VueRouter({
  routes:[
    {path: '/calendar/:user', component: Calendar},
    {path: '/', component: SelectRoom},
    
    //Default route, in case of bad hash route
    {
      path: '/:garbage', 
      redirect: `/calendar/${localStorage.getItem('default_room')}`
    },
  ]
})


Vue.config.productionTip = false

Vue.use(VueRouter)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
