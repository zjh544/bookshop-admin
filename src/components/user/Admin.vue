
<template>
  <div>
    <!-- 面包屑导航区域 图标分隔符 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>员工列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card class="box-card">
        <!-- 搜索框 -->
          <el-row :gutter="20">
              <el-col :span="10" class="table-tool">
                  <el-input placeholder="请输入账号或姓名" v-model="query" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="2">
                  <el-button type="primary" @click="addDialogVisible = true; usernameDisabled = false;
                    userDialogTitle = '添加账号'">添加员工</el-button>
              </el-col>
          </el-row>
          <!-- 用戶列表 -->
          <el-table
            :data="adminList"
            style="width: 100%" stripe border>
            <el-table-column label="#" type="index" align="center"></el-table-column>
            <el-table-column label="账号" prop="username" align="center"></el-table-column>
            <el-table-column label="姓名" prop="name" align="center"></el-table-column>
            <el-table-column label="性别" align="center">
              <template slot-scope="scope">
                    {{ scope.row.sex == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column label="年龄" align="center">
              <template slot-scope="scope">
                    {{ scope.row.birthday | getAge }}
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                    {{ scope.row.createTime | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="90px">
            <template slot-scope="scope">
                 <!-- 编辑按钮 -->
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserDialog(scope.row)">编辑</el-button>
                 <!-- 删除按钮 -->
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currPage"
            :page-sizes="[5, 10, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="rows">
          </el-pagination>
          <!-- 添加账号模态框 -->
          <el-dialog
            :title="userDialogTitle"
            :visible.sync="addDialogVisible"
            width="50%" @close="reset">
            <el-form label-width="120px" :model="userForm" :rules="addFormRules" ref="userForm">
                <el-form-item prop="id" label="ID：" hidden>
                  <el-input v-model="userForm.id"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="账号：">
                  <el-input v-model="userForm.username" :disabled="usernameDisabled"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <span slot="label"><font color="#F56C6C">*</font> 密码：</span>
                  <el-input type="password" v-model="userForm.password"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="confirmPwd" :hidden="usernameDisabled">
                  <span slot="label"><font color="#F56C6C">*</font> 确认密码：</span>
                  <el-input type="password" v-model="userForm.confirmPwd"></el-input>
                </el-form-item> -->
                <el-form-item prop="name" label="姓名：">
                  <el-input v-model="userForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别：">
                  <el-radio-group v-model="userForm.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="birthday" label="出生日期：">
                  <el-date-picker v-model="userForm.birthday" type="date" placeholder="请选择出生日期" :picker-options="pickerOptions"/>
                </el-form-item>
                <el-form-item prop="phone" label="手机号：">
                  <el-input v-model="userForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addManager()">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="分配角色"
            :visible.sync="roleDialogVisible"
            width="50%">
            <el-form label-width="100px">
              <el-form-item label="账号：">
                <el-input disabled v-model="currUser.mgName"></el-input>
              </el-form-item>
              <el-form-item label="角色：">
                <el-select v-model="theRoles" multiple placeholder="请选择" filterable>
                  <el-option
                    v-for="item in roles"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="roleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="allotRoles">确 定</el-button>
            </span>
          </el-dialog>
      </el-card>
  </div>
</template>

<script>
import user from '../../api/user.js'
import role from '../../api/role.js'
export default {
  data() {
    var validateEmail = (rule, value, callback) => {//value：需要校验的值，callback：回调函数
      if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(value)) {
        return callback()
      }
      callback(new Error('请填入正确格式的邮箱'))
    }
    var validateMobile = (rule, value, callback) => {
      if (/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        return callback()
      }
      callback(new Error('请填入正确格式的号码'))
    }
    var validateConfirmPwd = (rule, value, callback) => {
      if (this.usernameDisabled || value === this.userForm.mgPwd) {
        return callback()
      }
      callback(new Error('请确保密码和确认密码一致'))
    }
    var validateName = (rule, value, callback) => {
      if (this.usernameDisabled) {
        return callback()
      }
      this.$http.get('/admin/validateName', { params: { username: value } }).then(res => {
        console.log(res)
        if (!res.data.data.data) {
          return callback()
        }
        callback(new Error('该账号已经存在'))
      })
    }
    var validatePassword = (rule, value, callback) => {
      if (this.usernameDisabled || (value.length >= 6 && value.length <= 15)) {
        return callback()
      }
      callback(new Error('密码长度6-15'))
    }
    return {
      currPage: 1, // 当前页码
      pageSize: 5, // 每页条目数
      rows: 0, // 总条目数
      adminList: [], // 员工列表
      query: '', // 查询参数
      active_value: 0,
      inactive_value: 1, // 为开关设置不开启的值
      addDialogVisible: false, // 添加账号框是否可见
      userForm: {
        id: '',
        username: '',
        password: '',
        name: '',
        sex: '',
        birthday: '',
        phone: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '账号长度3-10', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
          // { min: 6, max: 15, message: '密码长度6-15', trigger: 'blur' }
          { validator: validatePassword, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'blur' }
        ],
        mgEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        confirmPwd: [
          // { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validateConfirmPwd, trigger: 'blur' }
        ]
      },
      usernameDisabled: false,
      userDialogTitle: '添加账号',
      roleDialogVisible: false,
      currUser: {},
      theRoles: [],
      roles: [],
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now(); //今天之后禁用
          return time.getTime() > Date.now()- 3600 * 1000 * 24; //今天之前禁用，减去一天的毫秒数，否则今天也将禁用
          //Data.now()返回1970/01/01以来的毫秒数
        }
      },
    }
  },
  // 頁面初始化
  created() {
    this.getUsers()
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    // 獲取用戶列表
    async getUsers() {
      const res = await this.$http.get('/admin/' + this.currPage + '/' + this.pageSize, { params: { query: this.query } })
      if (res.data.code === 20000) {
        this.adminList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$message({ 'message': res.data.message,
          'type': 'info'
        })
      }
    },
    // 每页条目数切换
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize
      this.currPage = 1
      this.getUsers()
    },
    // 當前頁切換
    handleCurrentChange(newCurrPage) {
      this.currPage = newCurrPage
      this.getUsers()
    },
    // 账号状态编辑
    stateChanged(data) {
      this.$http.put('/bookshop/shs-backend-manager', data).then(res => {
        console.log(data)
        console.log(res)
        if (res.data.code === 20000) {
          this.$message.success('更新状态成功')
        } else {
          this.$message.error(res.data.message)
          data.isDeleted = !data.isDeleted
        }
      })
    },
    // 重置表单
    reset () {
      this.$refs.userForm.resetFields()
      this.userForm.id = ''
    },
    // 添加/编辑账号
    addManager () {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          let res = {}
          if (!this.usernameDisabled) {
            res = await this.$http.post('/admin', this.userForm)
          } else {
            res = await this.$http.put('/admin', this.userForm)
          }
          if (res.data.code === 20000) {
            this.$message.success(this.usernameDisabled ? '编辑成功' : '添加成功')
            this.addDialogVisible = false
            this.getUsers()
          } else {
            this.$message.error(res.data.message)
          }
        }
      })
    },
    // 账号编辑框
    editUserDialog (row) {
      this.addDialogVisible = true
      this.usernameDisabled = true
      this.userDialogTitle = '编辑账号'
      let temp = JSON.parse(JSON.stringify(row))
      this.userForm = {
        id: temp.id,
        username: temp.username,
        password: temp.password,
        name: temp.name,
        sex: temp.sex,
        birthday: temp.birthday,
        phone: temp.phone
      }
    },
    // 根据id删除账号
    async deleteUser(id) {
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
        let res = await user.deleteUser(id)
        console.log(res)
        if (res.data.code === 20000) {
          this.$message.success('删除成功')
          this.getUsers()
        } else {
          this.$message.error(res.data.message)
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
    // 分配角色Dialog
    roleDialogShow(row) {
      this.roleDialogVisible = true
      this.currUser = row
      const res = role.list()
      res.then(r1 => {
        if (r1.data.code !== 20000) {
          this.$message.error('获取角色列表失败')
        } else {
          this.roles = r1.data.data.data
        }
      })
      const res2 = user.userRole(row.mgId)
      res2.then((r2) => {
        if (r2.data.code !== 20000) {
          return this.$message.error('获取账号角色失败')
        } else {
          this.theRoles = r2.data.data.data
        }
      }, console)
    },
    // 分配角色
    async allotRoles() {
      // console.log(this.currUser.mgId)
      // console.log(this.theRoles)
      const res = await user.allotRoles(this.currUser.mgId, this.theRoles)
      if (res.data.code !== 20000) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.roleDialogVisible = false
    }
  },
}
</script>

<style lang="less" scoped>

</style>
