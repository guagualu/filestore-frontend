// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'

import home from "../components/home/home.vue"
import fileHome from "../components/home/files/fileHome.vue"

//创建并暴露一个路由器
export default new VueRouter({
    routes: [{
        name: "home",
        path: '/home',
        component: home,
        children: [{
            name: "myFiles",
            path: "files",
            component: fileHome
        }],
    }]
})