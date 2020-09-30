import request from '@/utils/request'

export default {

  // 根据id查询小节
  findVideoById(videoId) {
    return request({
      url: `/serviceEdu/video/findVideo/${videoId}`,
      method: 'get'
    })
  },

  // 根据id查询小节
  removeVideo(videoId) {
    return request({
      url: `/serviceEdu/video/removeVideo/${videoId}`,
      method: 'delete'
    })
  },

  // 添加小节
  addVideo(video) {
    return request({
      url: `/serviceEdu/video/addVideo`,
      method: 'post',
      data: video
    })
  },

  // 修改小节
  updateVideo(video) {
    return request({
      url: `/serviceEdu/video/updateVideo`,
      method: 'put',
      data: video
    })
  },

  // 删除视频
  deleteVod(videoId) {
    return request({
      url: `/eduVod/aliyunVod/deleteVideo/${videoId}`,
      method: 'delete'
    })
  }

}
