import { RouteRecordRaw } from 'vue-router'
import { loadView } from '../utils' // 引入刚才定义的工具函数



const companyRoutes: Array<RouteRecordRaw> = [
    {
    path: '/company/list',
    name: 'CompanyList',
    meta: {
      title: "机构列表"
    },
    component: () => import('@/views/company/list.vue')
  },
  {
    path: '/company/info',
    name: 'CompanyInfo',
    meta: {
      title: "机构详情"
    },
    component: () => import('@/views/company/info.vue')
  },
  {
    path: '/company/index',
    name: 'CompanyIndex',
    meta: {
      title: "药企活动列表"
    },
    component: () => import('@/views/company/index.vue')
  },

]

export default companyRoutes