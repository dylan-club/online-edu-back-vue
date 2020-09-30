import request from '@/utils/request'

export default {

  // 查询所有课程分类信息
  getSubjectList() {
    return request({
      url: `/serviceEdu/subject/findAllSubject`, // es6路径写法
      method: 'get'
    })
  }

}
