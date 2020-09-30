<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="轮播图名称">
        <el-input v-model="banner.title"/>
      </el-form-item>
      <el-form-item label="轮播图排序">
        <el-input-number v-model="banner.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="链接地址">
        <el-select v-model="banner.linkUrl" clearable placeholder="请选择">
          <el-option :value="'/'" label="首页"/>
          <el-option :value="'/course'" label="课程"/>
          <el-option :value="'/teacher'" label="名师"/>
          <el-option :value="'/article'" label="文章"/>
          <el-option :value="'/qa'" label="问答"/>
        </el-select>
      </el-form-item>

      <el-form-item label="轮播图图片">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="banner.imageUrl" width="300px" height="160px"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换图片
        </el-button>

        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="1200"
          :height="480"
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
import bannerApi from '@/api/cms/banner'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      banner: {
        title: '',
        sort: 0,
        linkUrl: '',
        imageUrl: 'https://nicklaus-edu.oss-cn-beijing.aliyuncs.com/2020/09/17/692915c063144fdfaf6cbf2afa1d3ea4file.png'
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
        this.banner = {}
        this.banner.imageUrl = 'https://nicklaus-edu.oss-cn-beijing.aliyuncs.com/2020/09/17/692915c063144fdfaf6cbf2afa1d3ea4file.png'
      }
    },

    // 根据id查询轮播图
    getInfo(id) {
      bannerApi.findBanner(id)
        .then(response => {
          this.banner = response.data.banner
        })
    },

    saveOrUpdate() {
      // 如果id不存在
      if (this.banner.id == null) {
        // 添加讲师
        this.addBanner(this.banner)
      } else {
        // 修改讲师
        this.updateBanner(this.banner)
      }
    },

    addBanner(banner) {
      bannerApi.addBanner(banner)
        .then(response => {
          // 添加成功
          this.$message({
            type: 'success',
            message: '添加成功!'
          })

          // 重定向
          this.$router.push({ path: '/cms/banner/list' })
        })
    },

    updateBanner(banner) {
      bannerApi.updateBanner(banner)
        .then(response => {
          // 修改成功
          this.$message({
            type: 'success',
            message: '修改成功!'
          })

          // 重定向
          this.$router.push({ path: '/cms/banner/list' })
        })
    },

    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },

    cropSuccess(data) {
      this.imagecropperShow = false
      this.banner.imageUrl = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>

<style>

</style>
