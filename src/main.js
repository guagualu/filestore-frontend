import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueRouter from 'vue-router'


//引入路由器
import router from './router'

Vue.use(ElementUI);

Vue.use(VueRouter)

const vm = new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')