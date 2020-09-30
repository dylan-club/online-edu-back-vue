<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/uploadAvatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: 'https://nicklaus-edu.oss-cn-beijing.aliyuncs.com/2020/09/11/16271549026847e8add6f89589098b0afile.png'
      },
      saveBtnDisabled: false,
      imagecropperShow: false, // 是否显示
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API
    }
  },

  // 配置路由监听
  watch: {
    $route(to, from) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {

    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getInfo(id)
      } else {
        // 重置数据
        this.teacher = {}
        this.teacher.avatar = 'https://nicklaus-edu.oss-cn-beijing.aliyuncs.com/2020/09/11/16271549026847e8add6f89589098b0afile.png'
      }
    },

    // 根据讲师id查询讲师
    getInfo(id) {
      teacherApi.getTeacherInfo(id)
        .then(response => {
          this.teacher = response.data.teacher
        })
    },

    saveOrUpdate() {
      // 如果id不存在
      if (this.teacher.id == null) {
        // 添加讲师
        this.addTeacherInfo(this.teacher)
      } else {
        // 修改讲师
        this.updateTeacher(this.teacher)
      }
    },

    addTeacherInfo(teacher) {
      teacherApi.addTeacher(teacher)
        .then(response => {
          // 添加成功
          this.$message({
            type: 'success',
            message: '添加成功!'
          })

          // 重定向
          this.$router.push({ path: '/edu/teacher/list' })
        })
    },

    updateTeacher(teacher) {
      teacherApi.updateTeacherInfo(teacher)
        .then(response => {
          // 修改成功
          this.$message({
            type: 'success',
            message: '修改成功!'
          })

          // 重定向
          this.$router.push({ path: '/edu/teacher/list' })
        })
    },

    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },

    cropSuccess(data) {
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>

<style>

</style>
