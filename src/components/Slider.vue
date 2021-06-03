<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true; sliderDialogTitle = '添加轮播图'" style="margin-bottom: 15px;">添加轮播图</el-button>
        </el-col>
      </el-row>

      <el-table ref="dragTable" v-loading="listLoading" :data="sliderList" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="排序" prop="sort"></el-table-column>
      <el-table-column align="center" label="广告名称" prop="name"></el-table-column>
      <el-table-column align="center" label="网址" prop="url"></el-table-column>
      <el-table-column label="操作" align="center" min-width="90px">
        <template slot-scope="scope">
             <!-- 编辑按钮 -->
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="editSliderDialog(scope.row)">编辑</el-button>
             <!-- 删除按钮 -->
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSlider(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <!-- <div class="show-d">
      <el-tag style="margin-right:12px;">默认顺序 :</el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>拖拽后顺序 :</el-tag> {{ newList }}
    </div> -->

      <!-- 添加轮播图模态框 -->
      <el-dialog
        :title="sliderDialogTitle"
        :visible.sync="addDialogVisible"
        width="50%" @close="reset">
        <el-form label-width="120px" :model="sliderForm" :rules="addFormRules" ref="addSliderFormRef">
          <el-form-item label="ID：" hidden>
            <el-input v-model="sliderForm.id"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="广告名称：">
            <el-input v-model="sliderForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="网址：">
            <el-input v-model="sliderForm.url"></el-input>
          </el-form-item>
          <el-form-item label="轮播图：">
            <el-upload
              class="upload-demo"
              action="http://47.106.245.151:18080/bookshop/goods/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="uploadHeader"
              list-type="picture"
              ref="sliderPic"
              :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSlider()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data(){
    return{
      addDialogVisible: false, // 添加用户框是否可见
      sliderDialogTitle: '添加轮播图',
      sliderList:'',
      dialogVisible: false,
      preViewImg: '',
      addFormRules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入网址', trigger: 'blur' },
        ],
      },
      sliderForm: {
        id: '',
        name: '',
        url: '',
        pic:''
      },
      sliderAdd:true,
      oldList: [],
      newList: [],
      listLoading: true,
    }
  },
  created() {
    this.getSliderList()
  },
  methods:{
    async getSliderList() {
      this.listLoading = true
      const res = await this.$http.get('/slider')
      if (res.data.code === 20000) {
        this.sliderList = res.data.data.list
        this.listLoading = false
        this.oldList = this.sliderList.map(v => v.id)
        this.newList = this.oldList.slice()
        this.$nextTick(() => {
          this.setSort()
        })
      } else {
        this.$message({ 'message': res.data.message,
          'type': 'info'
        })
      }
    },
    // 重置表单
    reset () {
      this.$refs.addSliderFormRef.resetFields()
      this.sliderForm.id = ''
      this.$refs['sliderPic'].clearFiles();
    },
    handlePreview(obj) {
      this.dialogVisible = true
      this.preViewImg = obj.response.data.url
    },
    handleRemove() {
      this.sliderForm.goodsPic=''
    },
    uploadSuccess(response, file, fileList) {
      if (response.code !== 20000) return this.$message.error('上传失败')
      this.sliderForm.pic=response.data.path
    },
    addSlider () {
      this.$refs.addSliderFormRef.validate(async valid => {
        if (valid) {
          let res = {}
          if (this.sliderAdd) {
            res = await this.$http.post('/slider', this.sliderForm)
          } else {
            res = await this.$http.put('/slider', this.sliderForm)
          }
          if (res.data.code === 20000) {
            this.$message.success(this.sliderAdd ? '添加成功' : '编辑成功')
            this.addDialogVisible = false
            this.getSliderList()
          } else {
            this.$message.error(res.data.message)
          }
        }
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: async evt => {
          const targetRow = this.sliderList.splice(evt.oldIndex, 1)[0]
          this.sliderList.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)

          const res = await this.$http.get(`/slider/${this.newList}`)
          if (res.data.code === 20000) {
            this.$message.success('排序成功')
            this.getSliderList()
          } else {
            this.$message.error(res.data.message)
          }
        }
      })
    },
    editSliderDialog (row) {
      this.addDialogVisible = true
      this.sliderAdd=false
      this.sliderDialogTitle = '编辑轮播图'
      let temp = JSON.parse(JSON.stringify(row))
      this.sliderForm = {
        id: temp.id,
        name: temp.name,
        url: temp.url,
      }
    },
    async deleteSlider(id) {
      //弹框询问是否删除，确认删除返回值为confirm，取消删除返回值为cancel
      const res = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log(res)
      if (res === 'confirm') {
        let res = await this.$http.delete(`/slider/${id}`)
        if (res.data.code === 20000) {
          this.$message.success('删除成功')
          this.getSliderList()
        } else {
          this.$message.error(res.data.message)
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
  },
  computed: {
    uploadHeader() {
      const Authorization = window.sessionStorage.getItem('token')
      return { Authorization }
    }
  },
}
</script>

<style>

</style>