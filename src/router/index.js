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
import JwtService from '../pkg/jwt.js'
import MySignUp from "../components/MySignUp.vue"

//创建并暴露一个路由器
const router = new VueRouter({
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
        },
        {
            name: "signUp",
            path: '/signUp',
            component: MySignUp,
        },
        {
            name: "login",
            path: '',
            component: home,
        },


    ]
})

//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
router.beforeEach((to, from, next) => {
    console.log(to.path == "/")
    if (to.path.includes("signUp") || to.path == "/") {
        next()
        return
    }
    if (JwtService.isAuthenticated()) { //判断是否需要鉴权
        next()
    } else {
        alert('未登录,请先登录！')
    }
})


export default router