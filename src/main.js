import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import api from './http/api' // 导入api接口

Vue.prototype.$api = api; // 将api挂载到vue的原型上


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
