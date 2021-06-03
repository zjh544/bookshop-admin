<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">图书管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">图书列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加图书</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
                title="添加图书信息"
                type="info"
                center
                show-icon>
            </el-alert>
            <el-steps :active="parseInt(stepActive)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="详细信息"></el-step>
                <el-step title="图书图片"></el-step>
                <el-step title="内容图片"></el-step>
            </el-steps>
            <el-form label-width="120px" :model="goodAddForm" :rules="goodAddRules" ref="goodAddRef" label-position="top">
                <el-tabs tab-position="left" @tab-click="tabClick" :before-leave="tabLeave"  v-model="stepActive">
                    <el-tab-pane label="基本信息" name="1">
                      <el-form-item label="分类：" prop="catIds">
                            <el-cascader
                                v-model="goodAddForm.catIds"
                                :options="secondCategorys"
                                :props="{ expandTrigger: 'hover', label: 'name', value: 'id'}"
                                clearable
                                filterable>
                            </el-cascader>
                        </el-form-item>
                         <el-form-item prop="name">
                            <span slot="label"> 名称：</span>
                            <el-input v-model="goodAddForm.name"></el-input>
                        </el-form-item>
                         <el-form-item prop="author">
                            <span slot="label"> 作者：</span>
                            <el-input v-model="goodAddForm.author"></el-input>
                        </el-form-item>
                        <el-form-item prop="originalPrice">
                            <span slot="label"> 原价（元）：</span>
                            <el-input type="number" v-model="goodAddForm.originalPrice"></el-input>
                        </el-form-item>
                        <el-form-item prop="price">
                            <span slot="label"> 现价（元）：</span>
                            <el-input type="number" v-model="goodAddForm.price"></el-input>
                        </el-form-item>
                        <el-form-item prop="stock">
                            <span slot="label"> 库存（本）：</span>
                            <el-input type="number" v-model="goodAddForm.stock"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="详细信息" name="2">
                      <el-form-item label="出版社：" prop="publisherId">
                        <el-select v-model="goodAddForm.publisherId" filterable placeholder="请选择">
                          <el-option
                            v-for="item in publisherList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        </el-form-item>
                         <el-form-item prop="isbn">
                            <span slot="label"> ISBN：</span>
                            <el-input v-model="goodAddForm.isbn"></el-input>
                        </el-form-item>
                         <el-form-item prop="translator">
                            <span slot="label"> 翻译者：</span>
                            <el-input v-model="goodAddForm.translator"></el-input>
                        </el-form-item>
                         <el-form-item prop="introduction">
                            <span slot="label"> 简介：</span>
                            <el-input v-model="goodAddForm.introduction"></el-input>
                        </el-form-item>
                        <el-form-item prop="pages">
                            <span slot="label"> 页数（页）：</span>
                            <el-input type="number" v-model="goodAddForm.pages"></el-input>
                        </el-form-item>
                        <el-form-item prop="format">
                            <span slot="label"> 开本（开）：</span>
                            <el-input type="number" v-model="goodAddForm.format"></el-input>
                        </el-form-item>
                        <el-form-item prop="binding">
                            <span slot="label"> 装帧：</span>
                            <el-input v-model="goodAddForm.binding"></el-input>
                        </el-form-item>
                        <el-form-item prop="edition">
                            <span slot="label"> 版次：</span>
                            <el-input type="number" v-model="goodAddForm.edition"></el-input>
                        </el-form-item>
                        <el-form-item prop="impression">
                            <span slot="label"> 印次：</span>
                            <el-input type="number" v-model="goodAddForm.impression"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="图书图片" name="3">
                      <el-alert
                          title="只需一张"
                          type="info"
                          center
                          show-icon>
                      </el-alert>
                        <el-upload
                        class="upload-demo"
                        action="http://47.106.245.151:18080/bookshop/goods/upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :headers="uploadHeader"
                        list-type="picture"
                        :limit='1'
                        :on-success="uploadSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="内容图片" name="4">
                        <el-upload
                        class="upload-demo"
                        action="http://47.106.245.151:18080/bookshop/goods/upload"
                        :on-preview="handlePreview1"
                        :on-remove="handleRemove1"
                        :headers="uploadHeader"
                        list-type="picture"
                        :on-success="uploadSuccess1">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                        <div class="addBtn"><el-button type="primary" @click="addGoods">提交</el-button></div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <el-dialog
                title="图片预览"
                :visible.sync="dialogVisible"
                width="50%">
                <img :src="preViewImg" style="width:100%">
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="图片预览"
                :visible.sync="dialogVisible1"
                width="50%">
                <img :src="preViewImg1" style="width:100%">
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false">取 消</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Category from '../../api/goods/category.js'
import Goods from '../../api/goods/goods.js'
import Param from '../../api/goods/param.js'
import Publisher from '../../api/publisher.js'
import Editor from '../../api/editor.js'
import _ from 'lodash'
export default {
  data() {
    var validName = (rule, value, cb) => {
      if (this.nameDisabled) {
        return cb()
      }
      Goods.checkName(value).then(res => {
        console.log(res)
        if (!res.data.data.data) {
          return cb()
        }
        cb(new Error('该图书名称已经存在'))
      })
    }
    return {
      stepActive: '1',
      goodAddForm: {
        name: '',
        catIds: [],
        author: '',
        originalPrice: '',
        price: '',
        stock: '',
        goodsPic: '',
        publisherId: '',
        isbn: '',
        translator: '',
        introduction: '',
        pages: '',
        format: '',
        binding: '',
        edition: '',
        impression: '',
        contentPic:[]
      },
      goodAddRules: {
        catIds: [{ required: true, message: '请选择图书分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入图书名称', trigger: 'blur' },
          // { validator: validName, trigger: 'blur' }
          ],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        price: [{ required: true, message: '请输入图书价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        publisherId: [{ required: true, message: '请选择出版社', trigger: 'blur' }],
        isbn: [{ required: true, message: '请输入国际标准书号', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        pages: [{ required: true, message: '请输入页数', trigger: 'blur' }],
        format: [{ required: true, message: '请输入开本', trigger: 'blur' }],
        binding: [{ required: true, message: '请输入装帧', trigger: 'blur' }],
        edition: [{ required: true, message: '请输入版次', trigger: 'blur' }],
        impression: [{ required: true, message: '请输入印次', trigger: 'blur' }],
      },
      secondCategorys: [],
      publisherList:[],
      manyAttr: [],
      onlyAttr: [],
      theManyAttr: [],
      theOnlyAttr: [],
      editorOption: Editor,
      dialogVisible: false,
      dialogVisible1: false,
      preViewImg: '',
      preViewImg1:'',
      queryInfo: {
        currPage: -1, // 當前頁碼
        pageSize: -1, // 每頁條目數
        search: ''
      },
    }
  },
  created() {
    this.getCategoryList()
    this.getPublisherList()
    this.getGoodsList()
  },
  methods: {
    tabClick(obj) {
      this.stepActive = obj.name
    },
    secondCategorysChange(oldValue) {
      // if (this.goodAddForm.catIds.length)
      this.getOnlyAttrs()
      this.getManyAttrs()
    },
    async getCategoryList() {
      const res = await Category.list(-1, -1, 3)
      // console.log(res)
      if (res.data.code !== 20000) {
        this.$message.error(res.data.message)
      }
      this.secondCategorys = res.data.data.rows
    },
    async getPublisherList() {
      const res = await Publisher.list(this.queryInfo)
      if (res.data.code !== 20000) {
        this.$message.error(res.data.message)
      }
      this.publisherList = res.data.data.rows
    },
    tabLeave(activeName, oldActiveName) {
      if (oldActiveName === '1') {
        if (this.goodAddForm.catIds.length !== 3) {
          this.$message.info('请先选择图书分类')
          return false
        }
      }
    },
    async getManyAttrs() {
      const res = await Param.list(this.catId, 'many')
      if (res.data.code !== 20000) return this.$message.error('获取参数失败')
      this.manyAttr = res.data.data.data
      this.handlerAttrs(this.manyAttr)
      this.theManyAttr = _.cloneDeep(this.manyAttr)
    },
    async getOnlyAttrs() {
      const res = await Param.list(this.catId, 'only')
      if (res.data.code !== 20000) return this.$message.error('获取属性失败')
      this.onlyAttr = res.data.data.data
      // this.handlerAttrs(this.onlyAttr)
      // this.theOnlyAttr = _.cloneDeep(this.onlyAttr)
    },
    handlerAttrs(data) {
      data.forEach(element => {
        element.attrVals = element.attrVals ? element.attrVals.split(',') : []
      })
    },
    handlePreview(obj) {
      this.dialogVisible = true
      this.preViewImg = obj.response.data.url
    },
    handleRemove() {
      this.goodAddForm.goodsPic=''
    },
    handlePreview1(obj) {
      this.dialogVisible1 = true
      this.preViewImg1 = obj.response.data.url
    },
    handleRemove1(obj) {
      const path = obj.response.data.url
      const index = this.goodAddForm.contentPic.indexOf(path)
      this.goodAddForm.contentPic.splice(index, 1)
    },
    async addGoods() {
      this.$refs.goodAddRef.validate(async valid => {
        // console.log(this.theManyAttr)
        // console.log(this.onlyAttr)
        // if (!valid) return
        // if (this.goodAddForm.goodsPic.length === 0) return this.$message.info('请上传图书图')
        // this.goodAddForm.goodsAttr = []
        // this.theManyAttr.forEach(many => {
        //   console.log(many)
        //   const attr = { attrId: many.attrId, attrValue: many.attrVals.join(',') }
        //   this.goodAddForm.goodsAttr.push(attr)
        // })
        // this.onlyAttr.forEach(many => {
        //   console.log(many)
        //   const attr = { attrId: many.attrId, attrValue: many.attrVals }
        //   this.goodAddForm.goodsAttr.push(attr)
        // })
        // console.log(this.goodAddForm)
        if (valid) {
          const goods=this.$route.query.goods
          let res = {}
          if(goods==null){
            res = await Goods.add(this.goodAddForm)
          }else{
            res = await Goods.edit(goods.goods.id,goods.goodsDetail.id,this.goodAddForm)
          }
          if (res.data.code === 20000) {
            this.$notify({title: '成功', message: goods==null?'添加成功':'编辑成功', type: "success" });
            this.$router.push('/goods')
          }else{
            this.$notify({title: '失败', message: '添加失败', type: "error" });
          }
        } else {
          console.log("error submit!!");
          this.$notify({title: '添加失败', message: '请把信息填写完整', type: "error" });
          return false;
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.code !== 20000) return this.$message.error('上传失败')
      this.goodAddForm.goodsPic=response.data.path
    },
    uploadSuccess1(response, file, fileList) {
      if (response.code !== 20000) return this.$message.error('上传失败')
      this.goodAddForm.contentPic.push(response.data.path)
    },
    getGoodsList(){
      const goodsList=this.$route.query.goods
      this.goodAddForm= {
        name: goodsList.goods.name,
        catIds: [goodsList.goods.cate1,goodsList.goods.cate2,goodsList.goods.cate3,],
        author: goodsList.goods.author,
        originalPrice: goodsList.goods.originalPrice,
        price: goodsList.goods.price,
        stock: goodsList.goods.stock,
        publisherId: goodsList.goodsDetail.publisherId,
        isbn: goodsList.goodsDetail.isbn,
        translator: goodsList.goodsDetail.translator,
        introduction: goodsList.goodsDetail.introduction,
        pages: goodsList.goodsDetail.pages,
        format: goodsList.goodsDetail.format,
        binding: goodsList.goodsDetail.binding,
        edition: goodsList.goodsDetail.edition,
        impression: goodsList.goodsDetail.impression,
      }
    }
  },
  computed: {
    catId() {
      return this.goodAddForm.catIds[2]
    },
    uploadHeader() {
      const Authorization = window.sessionStorage.getItem('token')
      return { Authorization }
    }
  },
  mounted() {
    Editor.initButton()
    // console.log(this.$quill)
    Editor.register(this.$quill)
  }
}
</script>

<style lang="less" scoped>
.el-steps{
    margin:15px 0 25px 0;
}
</style>
