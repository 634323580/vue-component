import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Notification from '_c/notification'
Vue.use(Notification)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
