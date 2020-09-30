<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-button type="text" @click="openDialog">添加章节</el-button>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduVod/aliyunVod/uploadVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!--章节-->
    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideoDialog(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!--视频-->
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form>

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false,
      chapterVideoList: [],
      courseId: '', // 课程id
      dialogChapterFormVisible: false, // 是否显示章节表单
      chapter: {// 章节对象
        courseId: '',
        title: '',
        sort: 0
      },

      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {// 课时对象
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: '',
        size: 0
      },

      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapterVideoList(this.courseId)
    }
  },

  methods: {

    // 上一步
    previous() {
      this.$router.push({ path: '/edu/course/info/' + this.courseId })
    },

    // 下一步
    next() {
      this.$router.push({ path: '/edu/course/publish/' + this.courseId })
    },

    // 获取章节和小节信息
    getChapterVideoList(id) {
      chapter.getChapterList(id)
        .then(response => {
          this.chapterVideoList = response.data.items
        })
    },

    openDialog() {
      this.dialogChapterFormVisible = true
      // 重置表单
      this.chapter.title = ''
      this.chapter.sort = 0
    },

    saveOrUpdate() {
      if (this.chapter.id) {
        // 修改章节
        this.updateChapter()
      } else {
        // 添加章节
        this.addChapter()
      }
    },

    addChapter() {
      this.chapter.courseId = this.courseId
      // 添加章节
      chapter.saveChapter(this.chapter)
        .then(response => {
          // 关闭对话框
          this.dialogChapterFormVisible = false
          // 显示提示信息
          this.$message({
            type: 'success',
            message: '添加章节成功!'
          })
          // 刷新课程大纲列表
          this.getChapterVideoList(this.courseId)
        })
    },

    editChapter(chapterId) {
      // 回显章节信息
      // 打开对话框
      this.dialogChapterFormVisible = true
      chapter.findChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    },

    updateChapter() {
      // 更新章节信息
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭对话框
          this.dialogChapterFormVisible = false
          // 显示提示信息
          this.$message({
            type: 'success',
            message: '修改章节成功!'
          })
          // 刷新课程大纲列表
          this.getChapterVideoList(this.courseId)
        })
    },

    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
          .then(response => {
            // 删除成功,提示信息
            this.$message({
              type: 'success',
              message: '删除章节成功!'
            })

            // 刷新列表页面
            this.getChapterVideoList(this.courseId)
          })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },

    openVideoDialog(chapterId) {
      this.dialogVideoFormVisible = true
      this.chapterId = chapterId
      // 重置表单
      this.video.title = ''
      this.video.sort = 0
      this.video.free = 0
      this.video.videoSourceId = ''
    },

    saveOrUpdateVideo() {
      if (this.video.chapterId) {
        // 更新小节
        this.updateVideo()
      } else {
        // 添加小节
        this.addVideo()
      }
    },

    addVideo() {
      this.video.courseId = this.courseId
      this.video.chapterId = this.chapterId
      video.addVideo(this.video)
        .then(response => {
          // 关闭对话框
          this.dialogVideoFormVisible = false
          // 显示提示信息
          this.$message({
            type: 'success',
            message: '添加小节成功!'
          })
          // 刷新课程大纲列表
          this.getChapterVideoList(this.courseId)
        })
    },

    updateVideo() {
      video.updateVideo(this.video)
        .then(response => {
          // 关闭对话框
          this.dialogVideoFormVisible = false
          // 显示提示信息
          this.$message({
            type: 'success',
            message: '修改小节成功!'
          })
          // 刷新课程大纲列表
          this.getChapterVideoList(this.courseId)
        })
    },

    editVideo(videoId) {
      // 打开对话框
      this.dialogVideoFormVisible = true
      // 回显小节信息
      video.findVideoById(videoId)
        .then(response => {
          this.video = response.data.video
          this.fileList = [{ 'name': this.video.videoOriginalName }]
        })
    },

    removeVideo(videoId) {
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.removeVideo(videoId)
          .then(response => {
            // 删除成功,提示信息
            this.$message({
              type: 'success',
              message: '删除小节成功!'
            })

            // 刷新列表页面
            this.getChapterVideoList(this.courseId)
          })
      })
    },

    // 上传成功
    handleVodUploadSuccess(response, file) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
      this.video.size = file.size
    },

    // 上传之前
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    // 删除时(同时删除阿里云存储的视频)
    handleVodRemove(file) {
      video.deleteVod(this.video.videoSourceId)
        .then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          // 清空文件列表
          this.fileList = []
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
        })
    },

    // 删除前
    beforeVodRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }

  }
}
</script>

<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted rgb(11, 245, 225);
}

</style>
