const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/',
    productionSourceMap: false,

    lintOnSave: false,


    devServer: {

        // client:{overlay: {

        //     warnings: false,

        //     errors: false,
        //     warnings:false,

        // },},
        host: 'localhost', //
        port: 5003, //自定义端口
        https: false, //false关闭https，true为开启
        open: true, //自动打开浏览器
        proxy: {
            '/api': {
                target: 'https://api.yctang.net/api/', // 代理的线上的接口地址
                // 如果要代理 websockets
                ws: true,
                changeOrigin: true,
                pathRewrite: {   //重写路径，这种是没有我们定义的前缀
                    '/api': ''
                }
            },
            '/stream': {
                target: 'https://nls-gateway-cn-beijing.aliyuncs.com/stream/', // 代理的线上的接口地址
                // 如果要代理 websockets
                ws: true,
                changeOrigin: true,
                pathRewrite: {   //重写路径，这种是没有我们定义的前缀
                    '/api': ''
                }
            },
            '/place': {
                target: 'http://api.map.baidu.com', // 代理的线上的接口地址
                // 如果要代理 websockets
                ws: true,
                changeOrigin: true,
            }
        }

    },



})

