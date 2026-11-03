import { RouteRecordRaw } from 'vue-router'
import { loadView } from '../utils' // 引入刚才定义的工具函数

const courseRoutes: Array<RouteRecordRaw> = [

  {
  path: '/course/index',
  name: 'CourseIndex',
  meta: {
    title: "课程学习"
  },
  component: () => import('@/views/course/index.vue')
},


{
  path: '/course/course',
  name: 'CourseCourse',
  meta: {
    title: "课程"
  },
  component: () => import('@/views/course/course.vue')
},
{
  path: '/course/video',
  name: 'CourseVideo',
  meta: {
    title: "课程学习"
  },
  component: () => import('@/views/course/video.vue')
}
,
{
  path: '/course/question',
  name: 'CourseQuestion',
  meta: {
    title: "试卷"
  },
  component: () => import('@/views/course/question.vue')
}
,
{
  path: '/course/teacher',
  name: 'CourseTeacher',
  meta: {
    title: "讲师详情"
  },
  component: () => import('@/views/course/teacher.vue')
}

,
{
  path: '/course/teacher/list',
  name: 'CourseTeacherList',
  meta: {
    title: "讲师详情"
  },
  component: () => import('@/views/course/teacher/list.vue')
}
,
{
  path: '/course/answer',
  name: 'CourseAnswer',
  meta: {
    title: "考试"
  },
  component: () => import('@/views/course/answer.vue')
}
,
{
  path: '/course/result',
  name: 'CourseResult',
  meta: {
    title: "考试结果"
  },
  component: () => import('@/views/course/result.vue')
},
{
  path: '/course/video-bk',
  name: 'CourseVideoBk',
  meta: {
    title: "课程学习"
  },
  component: () => import('@/views/course/video-bk.vue')
}
,

]

export default courseRoutes