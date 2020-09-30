<template>
  <div class="app-container">

    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" width="80" />

      <el-table-column prop="linkUrl" label="链接地址" width="80"/>

      <el-table-column prop="imageUrl" label="图片地址" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/cms/banner/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
// 引入banner.js文件
import banner from '@/api/cms/banner'

export default {
  data() {
    return {
      list: [], // 返回的数据
      page: 1, // 当前页
      limit: 8, // 每页记录数
      total: 0
    }
  },

  created() { // 页面渲染之前执行
    this.getList()
  },

  methods: { // 调用teacher.js中的方法

    // 查询讲师数据
    getList(page = 1) {
      this.page = page
      banner.pageBanner(this.page, this.limit)
        .then(response => {
          // 查询出来的数据
          this.list = response.data.items
          // 总记录数
          this.total = response.data.total
        })
    },

    // 删除讲师
    removeDataById(id) {
      this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banner.removeBanner(id)
          .then(response => {
            // 删除成功,提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })

            // 刷新列表页面
            this.getList()
          })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    }
  }
}
</script>

