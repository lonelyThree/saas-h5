import { createApp } from 'vue'
import App from './App.vue'

import config from "./js/config/index";

const app = createApp(App)


import router from './router'

// 1. 引入你需要的组件
import { Toast, Empty, Dialog, Loading, Popup, List, Lazyload, Cell, ImagePreview, Badge,
     Checkbox, CheckboxGroup, Icon, Field, Area, Search, Swipe, SwipeItem, Progress, RadioGroup,
     Uploader, Radio, ActionSheet, Button, DropdownMenu, DropdownItem, Tab, Tabs,TextEllipsis,
     CountDown, Overlay
 } from 'vant'; //Tabbar, TabbarItem,
// 2. 引入组件样式
import 'vant/lib/index.css';

import 'amfe-flexible/index.js'

import instance from "./js/axios/index.js"


app.config.globalProperties.$config = config.config

app.config.globalProperties.$axios = instance
app.config.globalProperties.$router = router

// 3. 注册你需要的组件
app.use(Toast)
app.use(Empty)
app.use(Dialog)
app.use(Loading)
app.use(Popup)
app.use(List)
app.use(Cell)
app.use(ImagePreview)
app.use(Badge)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Lazyload)
// app.use(Tabbar)
// app.use(TabbarItem)
app.use(Icon)
app.use(Field)
app.use(Area)

app.use(Search)
app.use(Swipe)
app.use(SwipeItem)
app.use(Progress)

app.use(Radio);
app.use(RadioGroup);
app.use(Uploader);
app.use(ActionSheet);
app.use(Button)

app.use(DropdownMenu)
app.use(DropdownItem)

app.use(Tab)
app.use(Tabs)
app.use(TextEllipsis)

app.use(CountDown)
app.use(Overlay)
// import VConsole from 'vconsole'

// const vConsole = new VConsole()


// import Loadingnew from './js/loading'
// app.use(Loadingnew) // 注册在Vue实例上


// 引入公用css
import "./css/reset.scss";
import "./css/base.scss";
import "animate.css";
// 引入flex css https://github.com/lzxb/flex.css/blob/master/docs/zh-ch.md
import "flex.css";
import "./css/font.css";

app.use(router).mount('#app')