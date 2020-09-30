<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/uploadAvatar'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://nicklaus-edu.oss-cn-beijing.aliyuncs.com/template/default-cover.jpg',
        price: 0
      },
      courseId: 0,
      teacherList: [], // 讲师下拉列表的数据对象
      subjectNestedList: [], // 一级分类
      subSubjectList: [], // 二级分类
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
      // 初始化方法
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 回显课程信息
        this.backCourseInfo(this.courseId)
      } else {
      // 初始化所有一级分类
        this.findFirstSubjectList()
      }

      // 初始化所有讲师
      this.findTeacherList()
    },

    saveOrUpdate() {
      if (this.courseId) {
        // 更新课程信息
        this.uploadCourseInfo()
      } else {
        // 添加课程信息
        this.saveCourseInfo()
      }
    },

    saveCourseInfo() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          // 获取课程id
          this.courseId = response.data.courseId
          // 提示添加成功信息
          this.$message({
            type: 'success',
            message: '添加课程信息成功!'
          })
          // 跳转到chapter页面
          this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
        })
    },

    uploadCourseInfo() {
      course.updateCourseInfo(this.courseInfo)
        .then(response => {
          // 提示更新成功信息
          this.$message({
            type: 'success',
            message: '修改课程信息成功!'
          })
          // 跳转到chapter页面
          this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
        })
    },

    // 回显课程信息
    backCourseInfo(courseId) {
      course.getCourseInfo(courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfo

          // 初始化一级分类
          //   this.findFirstSubjectList()

          //   // 查询一级分类下的二级分类
          //   for (let i = 0; i < this.subjectNestedList.length; i++) {
          //     if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
          //       // 初始化二级分类
          //       this.subSubjectList = this.subjectNestedList[i].children
          //     }
          //   }
          // 初始化分类列表
          subject.getSubjectList().then(response => {
            this.subjectNestedList = response.data.items
            for (let i = 0; i < this.subjectNestedList.length; i++) {
              if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
                this.subSubjectList = this.subjectNestedList[i].children
              }
            }
          })
        })
    },

    findTeacherList() {
      // 查询所有讲师
      course.getTeacherList()
        .then(response => {
          this.teacherList = response.data.items
        })
    },

    findFirstSubjectList() {
      // 查询所有一级分类列表(树形)
      subject.getSubjectList()
        .then(response => {
          this.subjectNestedList = response.data.items
        })
    },

    subjectLevelOneChanged(value) {
      // 每当一级分类改变时,刷新二级分类列表
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          // 刷新当前二级分类选择器中选中的值
          this.courseInfo.subjectId = ''
        }
      }
    },

    handleAvatarSuccess(response) {
      // 封面上传成功
      this.courseInfo.cover = response.data.url
    },

    beforeAvatarUpload(file) {
      // 判断文件格式是否合理
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
