import request from '@/utils/request'

export default {

  // 讲师条件查询带分页
  getTeacherPageList(current, limit, teacherQuery) {
    return request({
      url: `/serviceEdu/teacher/pageQueryTeacher/${current}/${limit}`, // es6路径写法
      method: 'post',
      data: teacherQuery // 把teacherQuery转换成json
    })
  },

  // 根据id逻辑删除讲师
  removeTeacherById(id) {
    return request({
      url: `/serviceEdu/teacher/removeById/${id}`,
      method: 'delete'
    })
  },

  // 添加讲师
  addTeacher(teacher) {
    return request({
      url: `/serviceEdu/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },

  // 查询讲师
  getTeacherInfo(id) {
    return request({
      url: `/serviceEdu/teacher/findTeacherById/${id}`,
      method: 'get'
    })
  },

  // 修改讲师
  updateTeacherInfo(teacher) {
    return request({
      url: `/serviceEdu/teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }

}
