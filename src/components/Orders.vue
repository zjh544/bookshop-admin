<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
          <el-col :span="10" class="table-tool">
              <el-input placeholder="请输入内容" v-model="queryInfo.search" clearable @clear="getOrdersList">
                  <el-button slot="append" icon="el-icon-search" @click="queryInfo.page = 1;getOrdersList()"></el-button>
              </el-input>
          </el-col>
      </el-row>

      <el-table :data="ordersList" style="width: 100%" stripe border>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 标签页 -->
            <el-tabs tab-position="left" style="height: 200px;">
              <el-tab-pane label="物流详情">
                <el-button type="primary" v-if="scope.row.orders.expressNo==null" @click="deliverGoods(scope.row.orders)">发货</el-button>
                <div v-if="scope.row.orders.expressId!=null">
                  <div class="track-tpl-title">
                    <el-image class="track-tpl-title-icon" :src="scope.row.express.pic"></el-image>
                    <div class="track-tpl-title-content">
                      <p class="text-sm text-black">
                      物流公司：{{scope.row.express.name}}
                      </p> 
                      <p class="text-sm text-black">
                      快递单号：{{scope.row.orders.expressNo}}
                      </p>
                      <p class="text-sm text-black">
                      发货时间：{{scope.row.orders.deliveryTime | dateFormat}}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- 编辑按钮 -->
                <el-button v-if="scope.row.orders.expressNo!=null" type="primary" icon="el-icon-edit" size="mini" @click="editDeliverDialog(scope.row.orders)">编辑</el-button>
              </el-tab-pane>
              <el-tab-pane label="收货地址">
                <el-card shadow="never" class="address" :body-style="{ padding: '40px 20px' }" style="padding-top: 0px;">
                <p>
                  <span class="address-name">{{scope.row.addressVo.name}}</span>
                  <span class="address-phone">{{scope.row.addressVo.phone}}</span>
                </p>
                <div class="detail">
                  <p>{{addressCodeToText(scope.row.addressVo.area)}} {{scope.row.addressVo.detail}}</p>
                </div>
              </el-card>
              </el-tab-pane>
              <el-tab-pane label="图书详情">
                <el-table :data="scope.row.orderGoodsList" style="width: 100%" stripe border :show-header="false">
                  <el-table-column prop="goodsPic" width="100px">
                    <template slot-scope="scope">
                    <el-image :src="scope.row.goodsPic"></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodsName"></el-table-column>
                  <el-table-column prop="goodsNumber">
                    <template slot-scope="scope">
                      ×{{scope.row.goodsNumber}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodsPrice">
                    <template slot-scope="scope">
                      ￥{{scope.row.goodsPrice}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <!-- <el-tab-pane label="订单详情">
                {{scope.row.orders.payTime}}
              </el-tab-pane> -->
            </el-tabs>
            <!-- <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="出版社">
                <span>{{ scope.row.publisher.name }}</span>
              </el-form-item>
              <el-form-item label="ISBN">
                <span>{{ scope.row.goodsDetail.isbn }}</span>
              </el-form-item>
              <el-form-item label="翻译者">
                <span>{{ scope.row.goodsDetail.translator }}</span>
              </el-form-item>
              <el-form-item label="简介">
                <span>{{ scope.row.goodsDetail.introduction }}</span>
              </el-form-item>
              <el-form-item label="页数">
                <span>{{ scope.row.goodsDetail.pages }}</span>
              </el-form-item>
              <el-form-item label="开本">
                <span>{{ scope.row.goodsDetail.format }}</span>
              </el-form-item>
              <el-form-item label="装帧">
                <span>{{ scope.row.goodsDetail.binding }}</span>
              </el-form-item>
              <el-form-item label="版次">
                <span>{{ scope.row.goodsDetail.edition }}</span>
              </el-form-item>
              <el-form-item label="印次">
                <span>{{ scope.row.goodsDetail.impression }}</span>
              </el-form-item>
            </el-form> -->
          </template>
        </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="订单编号" prop="orders.orderNo" width="250px" align="center"></el-table-column>
                <el-table-column label="订单金额" prop="orders.price" align="center"></el-table-column>
                <el-table-column label="支付状态" prop="orders.state" align="center">
                  <template slot-scope="scope" align="center">
                    <el-tag v-if="scope.row.orders.state == '0'" type="danger">未付款</el-tag>
                    <el-tag v-if="scope.row.orders.state == '1'" type="success">已付款</el-tag>
                    <el-tag v-if="scope.row.orders.state == '2'" type="info">已取消</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="发货状态" prop="orders.deliveryTime" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.orders.deliveryTime == null" type="danger">未发货</el-tag>
                    <el-tag v-if="scope.row.orders.deliveryTime != null" type="success">已发货</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.orders.createTime | dateFormat }}
                    </template>
                </el-table-column>
            </el-table>

      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 30, 40]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rows">
      </el-pagination>

      <!-- 添加物流模态框 -->
      <el-dialog
        :title="deliverDialogTitle"
        :visible.sync="addDialogVisible"
        width="50%" @close="reset">
        <el-form label-width="120px" :model="deliverForm" :rules="addFormRules" ref="addDeliverFormRef">
          <el-form-item label="快递名称：" prop="expressId">
            <el-select v-model="deliverForm.expressId" filterable placeholder="请选择">
              <el-option
                v-for="item in expressList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="expressNo" label="快递单号：">
            <el-input type="number" v-model="deliverForm.expressNo"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addExpress()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { CodeToText } from 'element-china-area-data'
import Orders from '../api/orders.js'
import Express from '../api/express.js'
export default {
  data(){
    return{
      queryInfo: {
        page: 1,
        limit: 5,
        search: ''
      },
      ordersList: [],
      rows: 0,
      addDialogVisible: false, // 发货框是否可见
      deliverForm: {
        id:'',
        expressId: '',
        expressNo: '',
      },
      expressList:[],
      addFormRules: {
        expressId: [
          { required: true, message: '请选择快递', trigger: 'blur' },
        ],
        expressNo: [
          { required: true, message: '请输入快递单号', trigger: 'blur' },
        ],
      },
      deliverAdd:true,
      deliverDialogTitle: '发货',
      queryExpress: {
        currPage: 1, // 当前页码
        pageSize: 5, // 每页条目数
        search: ''
      },
    }
  },
  created() {
    this.getOrdersList()
    this.getExpressList()
  },
  methods: {
    async getOrdersList() {
      const res = await Orders.list(this.queryInfo)
      if (res.data.code !== 20000) return this.$message.error(res.data.message)
      this.rows = res.data.data.total
      this.ordersList = res.data.data.rows
    },
    async getExpressList() {
      const res = await Express.list(this.queryExpress)
      if (res.data.code !== 20000) {
        this.$message.error(res.data.message)
      }
      this.expressList = res.data.data.rows
    },
    deliverGoods (row) {
      this.addDialogVisible = true
      let temp = JSON.parse(JSON.stringify(row))
      this.deliverForm = {
        id: temp.id,
      }
    },
    addExpress () {
      this.$refs.addDeliverFormRef.validate(async valid => {
        if (valid) {
          let res = {}
          if (this.deliverAdd) {
            res = await this.$http.post('/orders/deliver', this.deliverForm)
          } else {
            res = await this.$http.put('/orders/deliver', this.deliverForm)
          }
          if (res.data.code === 20000) {
            this.$message.success(this.deliverAdd ? '添加成功' : '编辑成功')
            this.addDialogVisible = false
            this.getOrdersList()
          } else {
            this.$message.error(res.data.message)
          }
        }
      })
    },
    // 重置表单
    reset () {
      this.$refs.addDeliverFormRef.resetFields()
      this.deliverForm.id = ''
    },
    addressCodeToText(code) {
      return CodeToText[code[0]]+CodeToText[code[1]]+CodeToText[code[2]]
    },
    // 每页条目数切换
    handleSizeChange(newPageSize) {
      this.queryInfo.limit = newPageSize
      this.currPage.page = 1
      this.getOrdersList()
    },
    // 当前页切换
    handleCurrentChange(newCurrPage) {
      this.queryInfo.page = newCurrPage
      this.getOrdersList()
    },
    editDeliverDialog (row) {
      this.addDialogVisible = true
      this.deliverAdd=false
      this.deliverDialogTitle = '编辑快递信息'
      let temp = JSON.parse(JSON.stringify(row))
      this.deliverForm = {
        id: temp.id,
        expressId: temp.expressId,
        expressNo: temp.expressNo,
      }
    },
  },
}
</script>

<style lang="less" scoped>
/* 布局 */
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.address {
  width: 236px;
  overflow: hidden;
}
.address-name,.address-phone {
  font-size: 16px;
  color: #333;
}
.address-phone{
  padding-left: 16px;
}
</style>