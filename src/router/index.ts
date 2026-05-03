import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/home',
  //   name: 'Home', 
  //   meta: {
  //     title: "首页"
  //   },
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   meta: {
  //     title: "关于我们"
  //   },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/user/address',
    name: 'UserAddress',
    meta: {
      title: "收货地址"
    },
    component: () => import('../views/user/address.vue')
  },
  {
    path: '/award/address',
    name: 'AwardAddress',
    meta: {
      title: "收货地址"
    },
    component: () => import('../views/award/address.vue')
  }, {
    path: '/award/info',
    name: 'AwardInfo',
    meta: {
      title: "奖品信息"
    },
    component: () => import('../views/award/info.vue')
  },
  {
    path: '/user/reg',
    name: 'UserReg',
    meta: {
      title: "欢迎注册"
    },
    component: () => import('../views/user/register.vue')
  }
  ,{
    path: '/user/guide',
    name: 'UserGuide',
    meta: {
      title: "注册引导"
    },
    component: () => import('../views/user/guide.vue')
  },{
    path: '/user/award',
    name: 'UserAward',
    meta: {
      title: "领取奖励"
    },
    component: () => import('../views/user/award.vue')
  },
  {
    path: '/user/customer',
    name: 'UserCustomer',
    meta: {
      title: "注册引导"
    },
    component: () => import('../views/user/customer.vue')
  },
  {
    path: '/user/activity/record',
    name: 'UserActivityRecord',
    meta: {
      title: "活动参与记录"
    },
    component: () => import('../views/user/activity_record.vue')
  },
  {
    path: '/activity/index',
    name: 'ctivityIndex',
    meta: {
      title: "活动"
    },
    component: () => import('../views/activity/index.vue')
  },

  
  // {
  //   path: '/user/register',
  //   name: 'UserRegister',
  //   meta: {
  //     title: "店员注册"
  //   },
  //   component: () => import('../views/user/register.vue')
  // },
  {
    path: '/user/auth',
    name: 'UserAuth',
    meta: {
      title: "实名认证"
    },
    component: () => import('../views/user/auth.vue')
  },
  {
    path: '/salesman/reg',
    name: 'SalesmamReg',
    meta: {
      title: "业务员注册"
    },
    component: () => import('../views/salesman/register.vue')
  },

  {
    path: '/ask/index',
    name: 'AskIndex',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('../views/ask/index.vue')
  },

  {
    path: '/ask/desc',
    name: 'AskDesc',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('../views/ask/desc.vue')
  },

  {
    path: '/ask/rank',
    name: 'AskRank',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('../views/ask/rank.vue')
  },


  {
    path: '/ask/answer',
    name: 'AskAnswer',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('../views/ask/answer.vue')
  },


  {
    path: '/speak/speak',
    name: 'SpeakSpeak',
    meta: {
      title: "开口说"
    },
    component: () => import('../views/speak/speak.vue')
  },

  {
    path: '/speak/index',
    name: 'SpeakIndex',
    meta: {
      title: "开口说知识"
    },
    component: () => import('../views/speak/index.vue')
  },

  {
    path: '/receipt/index',
    name: 'ReceiptIndex',
    meta: {
      title: "销售竞赛"
    },
    component: () => import('../views/receipt/index.vue')
  },


  {
    path: '/receipt/receipt',
    name: 'ReceiptReceipt',
    meta: {
      title: "销售竞赛"
    },
    component: () => import('../views/receipt/receipt.vue')
  },
  {
    path: '/receipt/rank',
    name: 'ReceiptRank',
    meta: {
      title: "销售竞赛排行榜"
    },
    component: () => import('../views/receipt/rank.vue')
  },

  {
    path: '/video/video',
    name: 'VideoVideo',
    meta: {
      title: "看视频"
    },
    component: () => import('../views/video/video.vue')
  },

  {
    path: '/video/answer',
    name: 'VideoAnswer',
    meta: {
      title: "答题"
    },
    component: () => import('../views/video/answer.vue')
  },

  {
    path: '/video/result',
    name: 'VideoResult',
    meta: {
      title: "答题结果"
    },
    component: () => import('../views/video/result.vue')
  },
  {
  path: '/video/index',
  name: 'VideoIndex',
  meta: {
    title: "看视频"
  },
  component: () => import('../views/video/index.vue')
},



  {
    path: '/user/mine',
    name: 'UserMine',
    meta: {
      title: "个人中心"
    },
    component: () => import('../views/user/mine.vue')
  },
  {
    path: '/salesman/mine',
    name: 'SalesmanMine',
    meta: {
      title: "个人中心"
    },
    component: () => import('../views/salesman/mine.vue')
  },

  {
    path: '/404',
    name: 'NotFound',
    meta: {
      title: "温馨提示"
    },
    component: () => import('../views/NotFound.vue')
  },

  {
    path: '/article/article',
    name: 'ArticleArticle',
    meta: {
      title: "有奖分享"
    },
    component: () => import('../views/article/article.vue')
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

  {
    path: '/company/list',
    name: 'CompanyList',
    meta: {
      title: "机构列表"
    },
    component: () => import('../views/company/list.vue')
  },
  {
    path: '/company/info',
    name: 'CompanyInfo',
    meta: {
      title: "机构详情"
    },
    component: () => import('../views/company/info.vue')
  },
  {
    path: '/company/index',
    name: 'CompanyIndex',
    meta: {
      title: "药企活动列表"
    },
    component: () => import('../views/company/index.vue')
  },


{
  path: '/course/index',
  name: 'CourseIndex',
  meta: {
    title: "课程学习"
  },
  component: () => import('../views/course/index.vue')
},


{
  path: '/course/course',
  name: 'CourseCourse',
  meta: {
    title: "课程"
  },
  component: () => import('../views/course/course.vue')
},
{
  path: '/course/video',
  name: 'CourseVideo',
  meta: {
    title: "课程学习"
  },
  component: () => import('../views/course/video.vue')
}
,
{
  path: '/course/question',
  name: 'CourseQuestion',
  meta: {
    title: "试卷介绍"
  },
  component: () => import('../views/course/question.vue')
}
,
{
  path: '/course/teacher',
  name: 'CourseTeacher',
  meta: {
    title: "讲师详情"
  },
  component: () => import('../views/course/teacher.vue')
}

,
{
  path: '/course/teacher/list',
  name: 'CourseTeacherList',
  meta: {
    title: "讲师详情"
  },
  component: () => import('../views/course/teacher/list.vue')
}
,
{
  path: '/course/answer',
  name: 'CourseAnswer',
  meta: {
    title: "考试"
  },
  component: () => import('../views/course/answer.vue')
}
,
{
  path: '/course/result',
  name: 'CourseResult',
  meta: {
    title: "考试结果"
  },
  component: () => import('../views/course/result.vue')
}
,
{
  path: '/vote/vote',
  name: 'VoteVote',
  meta: {
    title: "投票"
  },
  component: () => import('../views/vote/vote.vue')
},
{
  path: '/vote/reg',
  name: 'VoteReg',
  meta: {
    title: "投票"
  },
  component: () => import('../views/vote/register.vue')
},
{
  path: '/vote/reg',
  name: 'VoteReg',
  meta: {
    title: "投票报名"
  },
  component: () => import('../views/vote/register.vue')
},
{
  path: '/vote/detail',
  name: 'VoteDetail',
  meta: {
    title: "投票详情"
  },
  component: () => import('../views/vote/detail.vue')
}

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
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

  window.scrollTo(0, 0);

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
