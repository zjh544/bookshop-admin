<template>
  <div>
    <!-- 面包屑导航区域 图标分隔符 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>出版社管理</el-breadcrumb-item>
          <el-breadcrumb-item>出版社列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card class="box-card">
        <!-- 搜索框 -->
          <el-row :gutter="20">
              <el-col :span="10" class="table-tool">
                  <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="getPublisherList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="2">
                  <el-button type="primary" @click="addDialogVisible = true; publisherAdd = true;
                    publisherDialogTitle = '添加出版社'">添加出版社</el-button>
              </el-col>
          </el-row>
          <!-- 出版社列表 -->
          <el-table
            :data="publisherList"
            style="width: 100%" stripe border>
            <el-table-column label="#" type="index" align="center"></el-table-column>
            <el-table-column label="出版社名称" prop="name" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                    {{ scope.row.createTime | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="90px">
            <template slot-scope="scope">
                 <!-- 编辑按钮 -->
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPublisherDialog(scope.row)">编辑</el-button>
                 <!-- 删除按钮 -->
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePublisher(scope.row.id)">删除</el-button>
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
          <!-- 添加出版社模态框 -->
          <el-dialog
            :title="publisherDialogTitle"
            :visible.sync="addDialogVisible"
            width="50%" @close="reset">
            <el-form label-width="120px" :model="publisherForm" :rules="addFormRules" ref="publisherForm">
                <el-form-item label="ID：" hidden>
                  <el-input v-model="publisherForm.id"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="出版社名称：">
                  <el-input v-model="publisherForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addPublisher('publisherForm')">确 定</el-button>
            </span>
          </el-dialog>
      </el-card>
  </div>
</template>

<script>
import Publisher from '../api/publisher.js'
export default {
  data() {
    return {
      addDialogVisible: false, // 添加出版社框是否可见
      publisherForm: {
        id: '',
        name: '',
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入出版社名称', trigger: 'blur' },
        ],
      },
      publisherAdd: true,
      publisherDialogTitle: '添加出版社',
      publisherList:[],
      queryInfo: {
        currPage: 1, // 当前页码
        pageSize: 5, // 每页条目数
        search: ''
      },
    }
  },
  // 页面初始化
  created() {
    this.getPublisherList()
  },
  methods: {
    async getPublisherList() {
      const res = await Publisher.list(this.queryInfo)
      if (res.data.code === 20000) {
        this.publisherList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$notify({title: '获取出版社列表失败', message: res.data.message, type: "error" })
      }
    },
    // 每页条目数切换
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.queryInfo.currPage = 1
      this.getPublisherList()
    },
    // 当前页切换
    handleCurrentChange(newCurrPage) {
      this.queryInfo.currPage = newCurrPage
      this.getPublisherList()
    },
    // 重置表单
    reset () {
      this.$refs.publisherForm.resetFields()
      this.publisherForm.id = ''
    },
    // 添加/编辑出版社
    addPublisher(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = {}
          if (this.publisherAdd) {
            res = await Publisher.add(this.publisherForm)
          } else {
            res = await Publisher.update(this.publisherForm)
          }
          if (res.data.code === 20000) {
            this.$notify({title: '成功', message: this.publisherAdd ? '添加成功' : '编辑成功', type: "success" });
            this.addDialogVisible = false
            this.getPublisherList()
          } else {
            this.$message.error(res.data.message)
            this.$notify({title: '失败', message: this.publisherAdd ? '添加失败' : '编辑失败', type: "error" })
          }
        }
      })
    },
    // 出版社编辑框
    editPublisherDialog (row) {
      this.addDialogVisible = true
      this.publisherAdd = false
      this.publisherDialogTitle = '编辑出版社'
      let temp = JSON.parse(JSON.stringify(row))
      this.publisherForm = {
        id: temp.id,
        name: temp.name,
      }
    },
    // 根据id删除出版社
    async deletePublisher(id) {
      //弹框询问是否删除，确认删除返回值为confirm，取消删除返回值为cancel
      const res = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (res === 'confirm') {
        const res = await Publisher.delete(id)
        if (res.data.code === 20000) {
          this.$notify({title: '成功', message: '删除成功', type: "success" });
          this.getPublisherList()
        } else {
          this.$notify({title: '删除失败', message: res.data.message, type: "error" });
        }
      } else {
        this.$notify({title: '取消', message: '取消删除', type: "info" });
      }
    },
  }
}
</script>

<style lang="less" scoped>

</style>
