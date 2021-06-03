<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>图书管理</el-breadcrumb-item>
            <el-breadcrumb-item>图书列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="10" class="table-tool">
                    <el-input placeholder="请输入图书名称" v-model="queryInfo.search" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="toGoodsAdd">添加图书</el-button>
                </el-col>
            </el-row>

            <el-table
                :data="goodList"
                style="width: 100%" stripe border>
                <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="出版社：">
                <span>{{ scope.row.publisher.name }}</span>
              </el-form-item>
              <el-form-item label="ISBN：">
                <span>{{ scope.row.goodsDetail.isbn }}</span>
              </el-form-item>
              <el-form-item label="翻译者：" v-if="scope.row.goodsDetail.translator!=''">
                <span>{{ scope.row.goodsDetail.translator }}</span>
              </el-form-item>
              <el-form-item label="简介：">
                <span>{{ scope.row.goodsDetail.introduction }}</span>
              </el-form-item>
              <el-form-item label="页数：">
                <span>{{ scope.row.goodsDetail.pages }}</span>
              </el-form-item>
              <el-form-item label="开本：">
                <span>{{ scope.row.goodsDetail.format }}</span>
              </el-form-item>
              <el-form-item label="装帧：">
                <span>{{ scope.row.goodsDetail.binding }}</span>
              </el-form-item>
              <el-form-item label="版次：">
                <span>{{ scope.row.goodsDetail.edition }}</span>
              </el-form-item>
              <el-form-item label="印次：">
                <span>{{ scope.row.goodsDetail.impression }}</span>
              </el-form-item>
              <!-- <el-form-item label="图书状态">
                <span>{{ scope.row.goods_state }}</span>
                <span>已审核</span>
              </el-form-item> -->
              <!-- <el-form-item label="添加时间">
                <span>{{ scope.row.add_time | dateFormat }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ scope.row.upd_time | dateFormat }}</span>
              </el-form-item>
              <el-form-item label="是否是热销品">
                <i style="color:green;font-size:18px;" v-if="scope.row.is_promote" class="el-icon-success"></i>
                <i style="color:red;font-size:18px;" v-else class="el-icon-error"></i>
              </el-form-item>
              <el-form-item label="热销品数量">
                <span>{{ scope.row.hot_mumber }}</span>
              </el-form-item> -->
            </el-form>
          </template>
        </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="图片" prop="goods.pic" width="100px" align="center">
                  <template slot-scope="scope">
                        <el-image :src="scope.row.goods.pic"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="goods.name" align="center"></el-table-column>
                <el-table-column label="作者" prop="goods.author" align="center"></el-table-column>
                <el-table-column label="价格" align="center">
                  <template slot-scope="scope">
                    <span>￥{{scope.row.goods.price | rounding}}</span>
                    <span v-if="scope.row.goods.originalPrice!=null" class="original-price"><i>￥</i>{{scope.row.goods.originalPrice | rounding}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="库存" prop="goods.stock" align="center"></el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.goods.createTime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteById(scope.row.goods.id)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>

            <!-- 分頁組件 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.currPage"
              :page-sizes="[5, 10, 30, 40]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rows">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import Goods from '../../api/goods/goods.js'

export default {
  created() {
    this.getList()
  },
  data() {
    return {
      queryInfo: {
        currPage: 1, // 當前頁碼
        pageSize: 5, // 每頁條目數
        search: ''
      },
      rows: 0, // 縂條目數
      goodList: [], // 图书列表,
      active_value: 1,
      inactive_value: 0 // 为开关设置不开启的值
    }
  },
  methods: {
    async getList() {
      const res = await Goods.list(this.queryInfo)
      if (res.data.code === 20000) {
        this.goodList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$message({ 'message': res.data.message,
          'type': 'info'
        })
      }
    },
    // 每頁條目數切換
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.queryInfo.currPage = 1
      this.getList()
    },
    // 當前頁切換
    handleCurrentChange(newCurrPage) {
      this.queryInfo.currPage = newCurrPage
      this.getList()
    },
    async deleteById(id) {
      const res = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log(res)
      if (res === 'confirm') {
        let res = await Goods.delete(id)
        if (res.data.code === 20000) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.data.message)
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
    toGoodsAdd() {
      this.$router.push('/goods/add')
    },
    stateChanged(data, type) {
      this.$http.put('/bookshop/shs-backend-goods', data).then(res => {
        // console.log(data)
        // console.log(res)
        if (res.data.code === 20000) {
          if (type === 1) {
            if (data.goodsState === 1) {
              this.$message.success('编辑状态审核通过')
            } else {
              this.$message.success('编辑状态审核不通过')
            }
          } else if (type === 2) {
            if (data.isPromote === 1) {
              this.$message.success('编辑状态为促销')
            } else {
              this.$message.success('编辑状态为非促销')
            }
          } else if (type === 3) {
            if (data.isBanner === 1) {
              this.$message.success('请通知发布者添加banner图')
            } else {
              this.$message.success('已经取消banner展示')
            }
          } else if (type === 4) {
            if (data.isSlide === 1) {
              this.$message.success('请通知发布者添加轮播图')
            } else {
              this.$message.success('已经取消轮播图展示')
            }
          } else if (type === 5) {
            if (data.isSlide === 1) {
              this.$message.success('请通知发布者添加广告图')
            } else {
              this.$message.success('已经取消广告图展示')
            }
          }
        } else {
          this.$message.error(res.data.message)
          data.isDeleted = !data.isDeleted
        }
      })
    },
    //编辑图书
    editGoods (row) {
      let temp = JSON.parse(JSON.stringify(row))
      this.$router.push(
      {
      //添加需要传值到那个页面的路径
      path:'/goods/add', 
      //携带需要传递的参数
      query:{goods:temp}
      })
    },
  },
  filters: {
    rounding (value) {
      return value.toFixed(2)
    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 80%;
}
.original-price{
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}
.original-price i{
  font-style: normal;
}
</style>
