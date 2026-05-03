import { createApp, reactive } from 'vue'

import LoadingComponent from '../components/globalLoading'

const msg = reactive({
    show: false,
})

const $loading = createApp(LoadingComponent, { msg }).mount(document.createElement('vue-loading'))
// console.log($loading);
const load = {
    show(title) { // 控制显示loading的方法
        msg.show = true
        document.body.appendChild($loading.$el)
    },

    hide() { // 控制loading隐藏的方法
        msg.show = false
    }
}

export default {
    install(app) {
        console.log(app);
        // Vue.prototype.$http = axios
        app.config.globalProperties.$loading = load
    }
}


// import LoadingComponent from '../components/globalLoading'

// import { getCurrentInstance } from 'vue'

// import vue from 'vue'
// let Loadingnew = {}

// // 避免重复install，设立flag

// Loadingnew.installed = false
// Loadingnew.install = function (Vue) {

//     if (Loadingnew.installed) return

//     vue.prototype.$loading = {}
//     vue.prototype.$loading.show = () => {

//         // 如果页面有loading则不继续执行

//         if (document.querySelector('#vue-loading')) return

//         // 1、创建构造器，定义loading模板

//         let LoadingTip = Vue.extend(LoadingComponent)

//         // 2、创建实例，挂载到文档以后的地方

//         let tpl = new LoadingTip().$mount().$el

//         // 3、把创建的实例添加到body中

//         document.body.appendChild(tpl)

//         // 阻止遮罩滑动

//         document.querySelector('#vue-loading').addEventListener('touchmove', function (e) {
//             e.stopPropagation()
//             e.preventDefault()
//         })
//         Loadingnew.installed = true

//     }
//     vue.prototype.$loading.hide = () => {
//         let tpl = document.querySelector('#vue-loading');
//         if(tpl){
//             document.body.removeChild(tpl)
//         }
//     }
// }
// export default Loadingnew