// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'

import home from "../components/home/home.vue"
import fileHome from "../components/home/files/fileHome.vue"
import recycleBin from "../components/home/recycleBin/recycle-bin.vue"
import homeIndexAside from "../components/home/homeIndexAside.vue"
import session from "../components/home/im/session.vue"
import addrBook from "../components/home/im/addrBook.vue"
import homeImAside from "../components/home/homeImAside.vue"

import homeAside from "../components/home/homeAside.vue"
import homeBody from "../components/home/homeBody.vue"

//创建并暴露一个路由器
export default new VueRouter({
    routes: [{
        name: "home",
        path: '/home',
        component: home,
        children: [{
            name: "blank",
            path: "",
            components: {
                toAside: homeAside,
                toBody: homeBody,
            },
            children: [{
                    name: "index",
                    path: "index",
                    components: {
                        inAside: homeIndexAside,
                        inBody: fileHome,
                    },
                },
                {
                    name: "myFiles",
                    path: "index/files",
                    components: {
                        inAside: homeIndexAside,
                        inBody: fileHome,
                    }
                },
                {
                    name: "recycleBin",
                    path: "index/recycle",
                    components: {
                        inAside: homeIndexAside,
                        inBody: recycleBin,
                    }
                },
                {
                    name: "im",
                    path: "im",
                    components: {
                        inAside: homeImAside,
                        inBody: session,
                    }
                },
                {
                    name: "session",
                    path: "im/session",
                    components: {
                        inAside: homeImAside,
                        inBody: session,
                    },
                },
                {
                    name: "addrBook",
                    path: "im/addrBook",
                    components: {
                        inAside: homeImAside,
                        inBody: addrBook,
                    },
                }

            ]
        }],
    }]
})