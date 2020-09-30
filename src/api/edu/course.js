import request from '@/utils/request'

export default {

  // 保存课程基本信息
  addCourseInfo(courseInfo) {
    return request({
      url: `/serviceEdu/course/addCourse`, // es6路径写法
      method: 'post',
      data: courseInfo
    })
  },

  // 查询所有讲师用于讲师下拉列表
  getTeacherList() {
    return request({
      url: `/serviceEdu/teacher/findAll`, // es6路径写法
      method: 'get'
    })
  },

  // 回显课程基本信息
  getCourseInfo(courseInfoId) {
    return request({
      url: `/serviceEdu/course/findCourseInfo/${courseInfoId}`, // es6路径写法
      method: 'get'
    })
  },

  // 回显课程基本信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `/serviceEdu/course/updateCourse`, // es6路径写法
      method: 'put',
      data: courseInfo
    })
  },

  // 查看课程发布信息
  getPublishCourseInfo(courseId) {
    return request({
      url: `/serviceEdu/course/getPublishCourseInfo/${courseId}`, // es6路径写法
      method: 'get'
    })
  },

  // 发布课程
  publishCourse(courseId) {
    return request({
      url: `/serviceEdu/course/publishCourse/${courseId}`, // es6路径写法
      method: 'put'
    })
  },

  // 分页查询课程列表
  pageQueryCourse(current, limit, courseQuery) {
    return request({
      url: `/serviceEdu/course/pageQueryCourse/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },

  // 根据id删除课程
  removeCourse(courseId) {
    return request({
      url: `/serviceEdu/course/removeCourse/${courseId}`, // es6路径写法
      method: 'delete'
    })
  }

}
