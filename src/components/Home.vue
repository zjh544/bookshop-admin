<template>
    <el-container>
      <!-- 头部区域 -->
        <el-header style="height:52px;padding: 0 22px">
          <div>
            <i class="iconfont icon-toggle-left toggle-button" @click="toggleCollapse" v-if="!isCollapse"></i>
            <i class="iconfont icon-toggle-right toggle-button" @click="toggleCollapse" v-else></i>
            <a class="logo" v-bind:href="'/#/home'">
              <i class="iconfont icon-book"></i>
              <span>文城书店管理系统</span>
            </a>
          </div>
          <!-- <el-button type='info' @click="logout">退出</el-button> -->
          <el-link class="logout" :underline="false" @click="logout">退出</el-link>
        </el-header>
        <!-- 页面主体 -->
        <el-container style="overflow:hidden">
          <!-- 侧边栏 -->
            <el-aside :width="collapseWidth">
               <el-menu active-text-color="#409eff" text-color="#666666"
                unique-opened :collapse="isCollapse" :collapse-transition="false" router
                :default-active="$route.path" >
                <!-- 一级菜单 index只接受字符串 -->
                <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                     <!-- 一级菜单模板 -->
                    <template slot="title">
                        <!-- 一级菜单图标 -->
                        <i :class="iconList[item.id]"></i>
                        <!-- 一级菜单文案 -->
                        <span slot="title">{{item.name}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="menuItem.url" v-for="menuItem in item.children" :key="menuItem.id">
                         <!-- 二级菜单模板 -->
                        <template slot="title">
                            <!-- 二级菜单图标 -->
                            <!-- <i class="el-icon-menu"></i> -->
                            <!-- 二级菜单文案 -->
                            <span slot="title">{{menuItem.name}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单列表
      menuList: [
        {
          id:1,
          name:'用户管理',
          children:[
            {
              name:'员工列表',
              url:'/admin'
            },
            {
              name:'会员列表',
              url:'/user'
            }
          ]
        },
        {
          id:2,
          name:'图书管理',
          children:[
            {
              name:'图书分类',
              url:'/categories'
            },
            {
              name:'图书列表',
              url:'/goods'
            }
          ]
        },
        {
          id:3,
          name:'订单管理',
          children:[
            {
              name:'订单列表',
              url:'/orders'
            }
          ]
        },
        {
          id:4,
          name:'广告管理',
          children:[
            {
              name:'轮播图',
              url:'/slider'
            },
          ]
        },
        {
          id:5,
          name:'出版社管理',
          children:[
            {
              name:'出版社列表',
              url:'/publisher'
            },
          ]
        },
        {
          id:6,
          name:'快递管理',
          children:[
            {
              name:'快递公司列表',
              url:'/express'
            },
          ]
        }
      ],
      iconList: {
        '1': 'iconfont icon-user11',
        '2': 'iconfont icon-books',
        '3': 'iconfont icon-orders',
        '4': 'iconfont icon-ad',
        '5': 'iconfont icon-publisher',
        '6': 'iconfont icon-express',
        // '145': 'iconfont icon-baobiao'
      },
      // 菜单是否折叠
      isCollapse: false,
      // 折叠块大小
      collapseWidth: '200px',
      // 默认链接
      // navStatus: ''
    }
  },
  created () {
    // 获取菜单
    // this.getMenuList()
    // 设置初始链接
    // this.navStatus = window.sessionStorage.getItem('navStatus')
  },
  methods: {
    // 获取菜单
    // async getMenuList() {
    //   const res = await this.$http.get('/bookshop/shs-backend-permission/menu')
    //   if (res.data.code === 20000) {
    //     this.menuList = res.data.data.data
    //     // console.log(this.menuList)
    //   } else {
    //     this.$message({ 'message': res.data.message,
    //       'type': 'info'
    //     })
    //   }
    // },
    async logout() {
      await this.$http.post('/admin/logout' )
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse() {
      this.isCollapse = !(this.isCollapse)
      // 动态切换折叠块大小
      this.collapseWidth = (this.isCollapse ? '64px' : '200px')
    },
    // saveNavStatus() {
    //   // 设置二级菜单高亮
    //   this.navStatus = this.$route.path
    //   // 保持当前页面链接到sessionStorage
    //   window.sessionStorage.setItem('navStatus', this.$route.path)
    // }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #18263c;;
  // div 分开两边 1
  display: flex;
  // div 分开两边 2
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  >div {
    display: flex;
    align-items: center;
    >span {
      margin-left: 15px;
    }
  }
}

.el-submenu .iconfont {
  margin-right: 10px;
}

// .el-aside {
//   background-color: #333744;
// }

.el-main{
  background-color: #f4f4f4;
}

// 去除子菜单右边框导致对不齐问题
.el-menu{
  border-right: 0;
}

.toggle-button{
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  margin-right: 20px;
}
.logo{
  float: left;
  text-decoration: none;
}
.logo:hover{
  cursor:pointer;
}
.logo i{
  font-size: 22px;
  color: #f4f4f4;
  vertical-align: -6%;
}
.logo span{
  font-size: 18px;
  padding-left: 10px;
  color: #f4f4f4;
  vertical-align: 2%;
}
.logout{
  color: #f4f4f4;
}
.logout:hover{
  color: #f4f4f4;
}
</style>
