import request from '@/utils/request'

export default {

  // 查询所有轮播图信息带分页
  pageBanner(current, limit) {
    return request({
      url: `/serviceCms/bannerAdmin/pageBanner/${current}/${limit}`,
      method: 'get'
    })
  },

  // 添加轮播图
  addBanner(banner) {
    return request({
      url: `/serviceCms/bannerAdmin/addBanner`,
      method: 'post',
      data: banner
    })
  },

  // 删除轮播图
  removeBanner(bannerId) {
    return request({
      url: `/serviceCms/bannerAdmin/removeBanner/${bannerId}`,
      method: 'delete'
    })
  },

  // 查询轮播图
  findBanner(bannerId) {
    return request({
      url: `/serviceCms/bannerAdmin/findBanner/${bannerId}`,
      method: 'get'
    })
  },

  // 更新轮播图
  updateBanner(banner) {
    return request({
      url: `/serviceCms/bannerAdmin/updateBanner`,
      method: 'put',
      data: banner
    })
  }

}
