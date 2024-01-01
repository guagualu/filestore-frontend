const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false, //关闭语法检查
    // devServer: {
    //     proxy: {
    //         '/file/upload/mp': {
    //             target: 'http://localhost:8082',
    //             changeOrigin: true,
    //         },
    //         '/user': {
    //             target: 'http://localhost:8080',
    //             changeOrigin: true,
    //         }
    //     }
    // }
    devServer: {
        port: 9090, // 此处修改你想要的端口号
        proxy: {
            '/file': {
                target: 'http://localhost:8082',
                changeOrigin: true,
            },
            '/user': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/uf': {
                target: 'http://localhost:8084',
                changeOrigin: true,
                pathRewrite: { '^/uf': '/user-file' }
            },
            '/oss': {
                target: 'http://file-store-gua.oss-cn-chengdu.aliyuncs.com',
                changeOrigin: true,
            }
        }
    }
})