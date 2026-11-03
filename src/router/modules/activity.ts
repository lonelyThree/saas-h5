import { RouteRecordRaw } from 'vue-router'
import { loadView } from '../utils' // 引入刚才定义的工具函数


const activityRoutes: Array<RouteRecordRaw> = [
    {
    path: '/activity/index',
    name: 'ActivityIndex',
    meta: {
      title: "活动"
    },
    component: () => import('@/views/activity/index.vue')
  },
  {
    path: '/ask/index',
    name: 'AskIndex',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('@/views/ask/index.vue')
  },

  {
    path: '/ask/desc',
    name: 'AskDesc',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('@/views/ask/desc.vue')
  },

  {
    path: '/ask/rank',
    name: 'AskRank',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('@/views/ask/rank.vue')
  },


  {
    path: '/ask/answer',
    name: 'AskAnswer',
    meta: {
      title: "答题赢大奖"
    },
    component: () => import('@/views/ask/answer.vue')
  },


  {
    path: '/speak/speak',
    name: 'SpeakSpeak',
    meta: {
      title: "开口说"
    },
    component: () => import('@/views/speak/speak.vue')
  },

  {
    path: '/speak/index',
    name: 'SpeakIndex',
    meta: {
      title: "开口说知识"
    },
    component: () => import('@/views/speak/index.vue')
  },

  {
    path: '/receipt/index',
    name: 'ReceiptIndex',
    meta: {
      title: "销售竞赛"
    },
    component: () => import('@/views/receipt/index.vue')
  },


  {
    path: '/receipt/receipt',
    name: 'ReceiptReceipt',
    meta: {
      title: "销售竞赛"
    },
    component: () => import('@/views/receipt/receipt.vue')
  },
  {
    path: '/receipt/rank',
    name: 'ReceiptRank',
    meta: {
      title: "销售竞赛排行榜"
    },
    component: () => import('@/views/receipt/rank.vue')
  },

  {
    path: '/video/video',
    name: 'VideoVideo',
    meta: {
      title: "看视频"
    },
    component: () => import('@/views/video/video.vue')
  },

  {
    path: '/video/answer',
    name: 'VideoAnswer',
    meta: {
      title: "答题"
    },
    component: () => import('@/views/video/answer.vue')
  },

  {
    path: '/video/result',
    name: 'VideoResult',
    meta: {
      title: "答题结果"
    },
    component: () => import('@/views/video/result.vue')
  },
  {
  path: '/video/index',
  name: 'VideoIndex',
  meta: {
    title: "看视频"
  },
  component: () => import('@/views/video/index.vue')
},
 {
    path: '/article/article',
    name: 'ArticleArticle',
    meta: {
      title: "有奖分享"
    },
    component: () => import('@/views/article/article.vue')
  },


  {
  path: '/vote/vote',
  name: 'VoteVote',
  meta: {
    title: "投票"
  },
  component: () => import('@/views/vote/vote.vue')
},
{
  path: '/vote/reg',
  name: 'VoteReg',
  meta: {
    title: "投票报名"
  },
  component: () => import('@/views/vote/register.vue')
},
{
  path: '/vote/detail',
  name: 'VoteDetail',
  meta: {
    title: "投票详情"
  },
  component: () => import('@/views/vote/detail.vue')
}


]

export default activityRoutes