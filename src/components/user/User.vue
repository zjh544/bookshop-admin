
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">

          <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="10" class="table-tool">
                    <el-input placeholder="请输入内容" v-model="query" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
                    </el-input>
                </el-col>
                <!-- <el-col :span="2">
                    <el-button type="primary" @click="addDialogVisible = true; nameDisabled = false;
                      userDialogTitle = '添加用户'">添加用户</el-button>
                </el-col> -->
            </el-row>

            <!-- 用戶列表 -->
            <el-table
                :data="userList"
                style="width: 100%" stripe border>
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column label="账号" prop="username" align="center"></el-table-column>
                <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
                <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
                <el-table-column label="性别" prop="sex" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.sex|toSex }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                      <i class="el-icon-time"></i>
                        {{ scope.row.createTime | dateFormat }}
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分頁組件 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currPage"
              :page-sizes="[5, 10, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rows">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>

export default {
  data() {
    return {
      currPage: 1, // 當前頁碼
      pageSize: 5, // 每頁條目數
      rows: 0, // 縂條目數
      userList: [], // 用戶列表
      query: '', // 查詢參數
      active_value: 0,
      inactive_value: 1, // 为开关设置不开启的值
      dialogVisible: false, // 添加用户框是否可见
      currUser: {},
      addFormRules: {
        mgName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '账号长度3-10', trigger: 'blur' } ]
      },
      apiBase: 'http://47.106.245.151:18080'
    }
  },
  // 頁面初始化
  created() {
    this.getUsers()
  },
  methods: {
    // 獲取用戶列表
    async getUsers() {
      const res = await this.$http.get(this.apiBase + '/bookshop/user/' + this.currPage + '/' + this.pageSize, { params: { query: this.query } })
      if (res.data.code === 20000) {
        this.userList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$message({ 'message': res.data.message,
          'type': 'info'
        })
      }
    },
    // 每頁條目數切換
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize
      this.currPage = 1
      this.getUsers()
    },
    // 當前頁切換
    handleCurrentChange(newCurrPage) {
      this.currPage = newCurrPage
      this.getUsers()
    }
  },
  filters: {
    toSex (value) {
      var sex
      if(value==0){
        sex='保密'
      }
      if(value==1){
        sex='男'
      }
      if(value==2){
        sex='女'
      }
      return sex
    }
  }
}
</script>

<style lang="less" scoped>

</style>
