import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: { title: '在线教育后台首页', icon: 'dashboard' },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/edu/teacher',
    component: Layout,
    redirect: '/edu/teacher/list',
    name: 'Teacher',
    meta: { title: '讲师管理', icon: 'peoples' },
    children: [
      {
        path: 'list',
        name: 'EduTeacherList',
        component: () => import('@/views/edu/teacher/list'),
        meta: { title: '讲师列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'EduTeacherCreate',
        component: () => import('@/views/edu/teacher/create'),
        meta: { title: '添加讲师', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        name: 'EduTeacherEdit',
        component: () => import('@/views/edu/teacher/create'),
        meta: { title: '编辑讲师', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/edu/subject',
    component: Layout,
    redirect: '/edu/subject/list',
    name: 'Subject',
    meta: { title: '课程分类管理', icon: 'star' },
    children: [
      {
        path: 'list',
        name: 'EduSubjectList',
        component: () => import('@/views/edu/subject/list'),
        meta: { title: '课程分类列表', icon: 'tree' }
      },
      {
        path: 'create',
        name: 'EduSubjectCreate',
        component: () => import('@/views/edu/subject/create'),
        meta: { title: '添加课程分类', icon: 'edit' }
      }
    ]
  },

  {
    path: '/edu/course',
    component: Layout,
    redirect: '/edu/course/list',
    name: 'Course',
    meta: { title: '课程管理', icon: 'guide' },
    children: [
      {
        path: 'list',
        name: 'EduCourseList',
        component: () => import('@/views/edu/course/list'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'info',
        name: 'EduCourseCreate',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '发布课程', icon: 'shopping' }
      },
      {
        path: 'info/:id',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程基本信息', noCache: true },
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'EduCourseChapterEdit',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: '编辑课程大纲', noCache: true },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'EduCoursePublishEdit',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: '发布课程', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/cms/banner',
    component: Layout,
    redirect: '/cms/banner/list',
    name: 'Banner',
    meta: { title: '轮播图管理', icon: 'message' },
    children: [
      {
        path: 'list',
        name: 'CrmBannerList',
        component: () => import('@/views/cms/banner/list'),
        meta: { title: '轮播图列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'CrmBannerCreate',
        component: () => import('@/views/cms/banner/create'),
        meta: { title: '添加轮播图', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        name: 'CrmBannerEdit',
        component: () => import('@/views/cms/banner/create'),
        meta: { title: '编辑轮播图', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/statistics/daily',
    component: Layout,
    redirect: '/statistics/daily/show',
    name: 'statistics',
    meta: { title: '统计分析', icon: 'excel' },
    children: [
      {
        path: 'create',
        name: 'StatisticsCreate',
        component: () => import('@/views/statistics/daily/create'),
        meta: { title: '生成统计', icon: 'edit' }
      },
      {
        path: 'show',
        name: 'StatisticsShow',
        component: () => import('@/views/statistics/daily/show'),
        meta: { title: '分析展示', icon: 'chart' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
