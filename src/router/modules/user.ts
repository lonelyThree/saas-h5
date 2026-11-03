import { RouteRecordRaw } from 'vue-router'
import { loadView } from '../utils' // 引入刚才定义的工具函数

const userRoutes: Array<RouteRecordRaw> = [
    {
    path: '/user/address',
    name: 'UserAddress',
    meta: {
      title: "收货地址"
    },
    component: () => import('@/views/user/address.vue')
  },
  {
    path: '/award/address',
    name: 'AwardAddress',
    meta: {
      title: "收货地址"
    },
    component: () => import('@/views/award/address.vue')
  }, {
    path: '/award/info',
    name: 'AwardInfo',
    meta: {
      title: "奖品信息"
    },
    component: () => import('@/views/award/info.vue')
  },
  {
    path: '/user/reg',
    name: 'UserReg',
    meta: {
      title: "欢迎注册"
    },
    component: () => import('@/views/user/register.vue')
  }
  ,{
    path: '/user/guide',
    name: 'UserGuide',
    meta: {
      title: "注册引导"
    },
    component: () => import('@/views/user/guide.vue')
  },{
    path: '/user/award',
    name: 'UserAward',
    meta: {
      title: "领取奖励"
    },
    component: () => import('@/views/user/award.vue')
  },
  {
    path: '/user/customer',
    name: 'UserCustomer',
    meta: {
      title: "注册引导"
    },
    component: () => import('@/views/user/customer.vue')
  },
  {
    path: '/user/activity/record',
    name: 'UserActivityRecord',
    meta: {
      title: "活动参与记录"
    },
    component: () => import('@/views/user/activity_record.vue')
  },
  {
    path: '/user/auth',
    name: 'UserAuth',
    meta: {
      title: "实名认证"
    },
    component: () => import('@/views/user/auth.vue')
  },
  {
    path: '/user/mine',
    name: 'UserMine',
    meta: {
      title: "个人中心"
    },
    component: () => import('@/views/user/mine.vue')
  },
  {
    path: '/user/award/record',
    name: 'UserAwardRecord',
    meta: {
      title: "奖励记录"
    },
    component: () => import('@/views/user/award_record.vue')
  },
]

export default userRoutes