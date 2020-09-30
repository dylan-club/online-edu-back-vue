import request from '@/utils/request'

export default {

  // 创建统计记录
  createStatistics(day) {
    return request({
      url: `/serviceStatistics/statisticsDaily/createStatistics/${day}`,
      method: 'post'
    })
  },

  // 查询统计图表数据
  getChartData(searchObj) {
    return request({
      url: `/serviceStatistics/statisticsDaily/getChartData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}
