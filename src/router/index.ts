import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../views/Home.vue'

// 导入模块化路由
import userRoutes from './modules/user'
import salesmanRoutes from './modules/sales_man'
import activityRoutes from './modules/activity'
import companyRoutes from './modules/company'
import courseRoutes from './modules/course'


const routes: Array<RouteRecordRaw> = [
  ...userRoutes,
  ...salesmanRoutes,
  ...activityRoutes,
  ...companyRoutes,
  ...courseRoutes,
  

  {
    path: '/404',
    name: 'NotFound',
    meta: {
      title: "温馨提示"
    },
    component: () => import('../views/NotFound.vue')
  },

 
  // {
  //   path: '/layout',
  //   name: 'recordLayout',
  //   component: () => import('../views/im/layout.vue'),
  //   // meta: {
  //   //   auth: false,
  //   // },
  //   redirect: '/record',
  //   children: [
  //     {
  //       path: "/record",
  //       name: "record",
  //       component: import("../views/im/record.vue"),
  //       meta: {
  //         // auth: false,
  //         title: '首页'
  //       }
  //     },
  //     // {
  //     //   path: "/patient/message",
  //     //   name: "message",
  //     //   component: require("../pages/patient/message"),
  //     //   meta: {
  //     //     auth: false,
  //     //     title: '消息'
  //     //   }
  //     // },
  //     // {
  //     //   path: "/patient/myIndex",
  //     //   name: "MyIndex",
  //     //   component: require("../pages/patient/myIndex"),
  //     //   meta: {
  //     //     auth: false,
  //     //     title: '个人中心'
  //     //   }
  //     // },
  //   ]
  // },

  




]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
   // 使用内置的 scrollBehavior 替代手动 window.scrollTo
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 4. 你还可以监听路由拦截，比如权限验证。
router.beforeEach((to, from, next) => {
  if (typeof (to.meta.title) === 'string') {
    document.title = to.meta.title
  }

  if (to.path == '/404') {
    next();
    return
  }


  // 尝试修改为正常的url并重定向
  if (to.query.wx_appid) {
    next();
    return;
  }


  if (/\/\?{1}\S*\#\//i.test(window.location.href)) {
    try {
      let url = window.location.href;
      let hash = window.location.hash;
      let search = window.location.search && window.location.search.slice(1);
      // 如果url是以？结尾的
      if (/\?{1}\S+$/.test(hash)) {
        window.location.href = url.replace(/\/\?{1}\S*\#\//, "/#/") + "&" + search;
      } else {
        window.location.href = url.replace(/\/\?{1}\S*\#\//, "/#/") + "?" + search;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // window.scrollTo(0, 0);

  if (from.query.wx_appid) {
    let toQuery = JSON.parse(JSON.stringify(to.query));
    toQuery.wx_appid = from.query.wx_appid;
    next({
      path: to.path,
      query: toQuery,
    });
  } else {
    next();
  }
})

export default router
