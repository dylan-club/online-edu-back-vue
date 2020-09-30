import request from '@/utils/request'

export default {

  // 查询某课程下所有课程大纲
  getChapterList(courseId) {
    return request({
      url: `/serviceEdu/chapter/findChapterAndVideo/${courseId}`, // es6路径写法
      method: 'get'
    })
  },

  // 保存章节
  saveChapter(chapter) {
    return request({
      url: `/serviceEdu/chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },

  // 删除章节
  deleteChapter(chapterId) {
    return request({
      url: `/serviceEdu/chapter/removeChapter/${chapterId}`,
      method: 'delete'
    })
  },

  // 查询章节
  findChapter(chapterId) {
    return request({
      url: `/serviceEdu/chapter/findChapter/${chapterId}`,
      method: 'get'
    })
  },

  // 修改章节
  updateChapter(chapter) {
    return request({
      url: `/serviceEdu/chapter/updateChapter`,
      method: 'put',
      data: chapter
    })
  }

}
