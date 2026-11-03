import { RouteRecordRaw } from 'vue-router'
import { loadView } from '../utils' // 引入刚才定义的工具函数

const salesmanRoutes: Array<RouteRecordRaw> = [
    {
    path: '/salesman/reg',
    name: 'SalesmanReg',
    meta: {
      title: "业务员注册"
    },
    component: () => import('@/views/salesman/register.vue')
  },{
    path: '/salesman/mine',
    name: 'SalesmanMine',
    meta: {
      title: "个人中心"
    },
    component: () => import('@/views/salesman/mine.vue')
  },

   {
    path: '/counter/index',
    name: 'CounterIndex',
    meta: {
      title: "销售竞赛"
    },
    component: () => import('@/views/counter/index.vue')
  },

{
    path: '/counter/counter',
    name: 'CounterCounter',
    meta: {
      title: "贴柜培训"
    },
    component: () => import('@/views/counter/counter.vue')
  },

  {
    path: '/counter/checkin',
    name: 'CounterCheckin',
    meta: {
      title: "贴柜打卡"
    },
    component: () => import('@/views/counter/checkin.vue')
  },

  {
    path: '/counter/result',
    name: 'CounterResult',
    meta: {
      title: "贴柜结果"
    },
    component: () => import('@/views/counter/result.vue')
  },{
    path: '/salesman/award/record',
    name: 'SalesmanAwardRecord',
    meta: {
      title: "奖励记录"
    },
    component: () => import('@/views/salesman/award_record.vue')
  },

]

export default salesmanRoutes