<template>
  <div>
    <!-- 面包屑导航区域 图标分隔符 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>快递管理</el-breadcrumb-item>
          <el-breadcrumb-item>快递公司列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card class="box-card">
        <!-- 搜索框 -->
          <el-row :gutter="20">
              <el-col :span="10" class="table-tool">
                  <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="getexpressList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="2">
                  <el-button type="primary" @click="addDialogVisible = true; expressAdd = true;
                    expressDialogTitle = '添加快递公司'">添加快递公司</el-button>
              </el-col>
          </el-row>
          <!-- 快递公司列表 -->
          <el-table
            :data="expressList"
            style="width: 100%" stripe border>
            <el-table-column label="#" type="index" align="center"></el-table-column>
            <el-table-column label="logo" prop="pic" width="100px" align="center">
              <template slot-scope="scope">
                <el-image :src="scope.row.pic"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="快递公司名称" prop="name" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                    {{ scope.row.createTime | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="90px">
            <template slot-scope="scope">
                 <!-- 编辑按钮 -->
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editExpressDialog(scope.row)">编辑</el-button>
                 <!-- 删除按钮 -->
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteExpress(scope.row.id)">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currPage"
            :page-sizes="[5, 10, 30, 40]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="rows">
          </el-pagination>
          <!-- 添加快递公司模态框 -->
          <el-dialog
            :title="expressDialogTitle"
            :visible.sync="addDialogVisible"
            width="50%" @close="reset">
            <el-form label-width="122px" :model="expressForm" :rules="addFormRules" ref="expressForm">
                <el-form-item label="ID：" hidden>
                  <el-input v-model="expressForm.id"></el-input>
                </el-form-item>
                <el-form-item label="logo：">
                  <el-upload
                    class="upload-demo"
                    action="http://47.106.245.151:18080/bookshop/goods/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :headers="uploadHeader"
                    list-type="picture"
                    ref="expressPic"
                    :on-success="uploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item prop="name" label="快递公司名称：">
                  <el-input v-model="expressForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addExpress('expressForm')">确 定</el-button>
            </span>
          </el-dialog>
      </el-card>
  </div>
</template>

<script>
import Express from '../api/express.js'
export default {
  data() {
    return {
      addDialogVisible: false, // 添加快递公司框是否可见
      expressForm: {
        id: '',
        name: '',
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入快递公司名称', trigger: 'blur' },
        ],
      },
      expressAdd: true,
      expressDialogTitle: '添加快递公司',
      expressList:[],
      queryInfo: {
        currPage: 1, // 当前页码
        pageSize: 5, // 每页条目数
        search: ''
      },
      dialogVisible: false,
      preViewImg: '',
    }
  },
  // 页面初始化
  created() {
    this.getexpressList()
  },
  methods: {
    async getexpressList() {
      const res = await Express.list(this.queryInfo)
      if (res.data.code === 20000) {
        this.expressList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$notify({title: '获取快递公司列表失败', message: res.data.message, type: "error" })
      }
    },
    // 每页条目数切换
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.queryInfo.currPage = 1
      this.getexpressList()
    },
    // 当前页切换
    handleCurrentChange(newCurrPage) {
      this.queryInfo.currPage = newCurrPage
      this.getexpressList()
    },
    // 重置表单
    reset () {
      this.$refs.expressForm.resetFields()
      this.expressForm.id = ''
      this.$refs['expressPic'].clearFiles();
    },
    // 添加/编辑快递公司
    addExpress(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = {}
          if (this.expressAdd) {
            res = await Express.add(this.expressForm)
          } else {
            res = await Express.update(this.expressForm)
          }
          if (res.data.code === 20000) {
            this.$notify({title: '成功', message: this.expressAdd ? '添加成功' : '编辑成功', type: "success" });
            this.addDialogVisible = false
            this.getexpressList()
          } else {
            this.$message.error(res.data.message)
            this.$notify({title: '失败', message: this.expressAdd ? '添加失败' : '编辑失败', type: "error" })
          }
        }
      })
    },
    // 快递公司编辑框
    editExpressDialog (row) {
      this.addDialogVisible = true
      this.expressAdd = false
      this.expressDialogTitle = '编辑快递公司'
      let temp = JSON.parse(JSON.stringify(row))
      this.expressForm = {
        id: temp.id,
        name: temp.name,
      }
    },
    // 根据id删除快递公司
    async deleteExpress(id) {
      //弹框询问是否删除，确认删除返回值为confirm，取消删除返回值为cancel
      const res = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (res === 'confirm') {
        const res = await Express.delete(id)
        if (res.data.code === 20000) {
          this.$notify({title: '成功', message: '删除成功', type: "success" });
          this.getexpressList()
        } else {
          this.$notify({title: '删除失败', message: res.data.message, type: "error" });
        }
      } else {
        this.$notify({title: '取消', message: '取消删除', type: "info" });
      }
    },
    handlePreview(obj) {
      this.dialogVisible = true
      this.preViewImg = obj.response.data.url
    },
    handleRemove() {
      this.expressForm.pic=''
    },
    uploadSuccess(response, file, fileList) {
      if (response.code !== 20000) return this.$message.error('上传失败')
      this.expressForm.pic=response.data.path
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

<style lang="less" scoped>

</style>
