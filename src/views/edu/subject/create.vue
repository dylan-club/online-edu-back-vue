<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/serviceEdu/subject/addSubject'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: 'https://nicklaus-edu.oss-cn-beijing.aliyuncs.com/template/1.xlsx', // 阿里云OSS地址
      fileUploadBtnText: '上传到服务器', // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },

  methods: {

    // 上传文件
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.importBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit()
    },
    // 上传成功
    fileUploadSuccess() {
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程分类成功!'
      })

      // 重定向到课程分类列表页面
      // 重定向
      this.$router.push({ path: '/edu/subject/list' })
    },
    // 上传失败
    fileUploadError(response) {
      this.loading = false
      this.$message({
        type: 'success',
        message: response.data.message
      })
    }
  }
}
</script>

<style>

</style>
