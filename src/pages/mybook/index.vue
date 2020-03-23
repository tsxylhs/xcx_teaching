<template lang="pug">
  .w-100
    nav-bar(title="我的借阅" :backVisible="true" :home-path="'/pages/index/main'")
    .p-10p

      .mt-20p.df-col-ac-jc(v-if="domain.length === 0&&user")
        span 暂无借阅图书
        span 好好学习，天天向上
      .first-padding
        .d-flex.p-20p.border-bottom.pa( v-if="domain.length !== 0" v-for="(item, index) in domain" :key="index" @click="onChange(item)")
          //img( :src="item.cover.prefixUri + item.cover.relativePath" style="width:60px;height:60px")
          img(:src="item.book.image" style="width:60px;height:60px")
          .df-col-jb.flex-1.ml-20p
            .df-row-jb
              .fs-16.flex-1(style="font-weight:bold") {{item.book.name}}
              .fs-12.flex-1 {{item.library.name}}
            .df-row-jb.mt-10p.text-dark
              .fs-14.flex-1.text-overflow2 {{item.library.address}}
              .fs-14.ml-10p(style="color:#0066CC" @click="deleteNotes(item)") 归还
              .fs-14.ml-10p(style="color:#0066CC" @click="addNotes(item)") 添加笔记
      .w-100.mt-50p(v-if="!user")
        .df-col-ac.p-20p
          .login-none
          .mt-10p 请先登录，以查看借阅。
          button.btn-main.mt-10p(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录


    van-toast#van-toast
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Swiper from '@/components/swiper'
  import Data from '@/utils/data'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'
  // import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar,
      Swiper
    },
    onShareAppMessage (object) {
      object.title = 'ELB'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {
        user: {},
        lnglat: {},
        searchKey: '',
        id: '0',
        isActive: 0,
        images: [
          {
            url: 'https://mtms.letsit.vip/bn1.png'
          },
          {
            url: 'https://mtms.letsit.vip/bn1.png'
          }
        ],
        domain: [],
        data: Data,
        shopId: '0',
        filter: {ps: 10, p: 1},
        total: 0
      }
    },
    methods: {
      checkUser (e) {
        loginInfo(e, this, this.getBooks)
      },
      deleteNotes (item) {
        API.mybooks.delete(item.id).then((res) => {
          console.log(res)
        }).catch(() => {
        })
      },
      addNotes (item) {
        wx.navigateTo({
          url: '/pages/addNotes/main?bookId=' + item.bookId
        })
      },
      changeRange (e) {
        this.domain = []
        this.val1 = e.mp.detail
        this.checkLocation()
      },
      getBooks () {
        var params = {
          userId: this.user.id
        }
        API.mybooks.list(params).then((res) => {
          this.domain = res.data
        }).catch((err) => {
          console.log('error', err)
        })
      },
      search (param) {
        console.log('-------------------->', param.mp.detail)
        this.searchKey = param.mp.detail
      }
    },
    onPullDownRefresh () {
      console.log('下拉刷新')
      // 初始化页码
      this.filter.p = 1
      this.checkLocation()
    },
    onReachBottom () {
      if (this.filter.p > this.total) {
        console.log('上拉数据加载完了')
      } else {
        this.filter.p = this.filter.p + 1
      }
    },
    mounted () {
    },
    onShow () {
      this.filter = {ps: 10, p: 1}
      this.total = 0
      this.val1 = -1
      this.domain = []
      this.user = wx.getStorageSync('user')
      console.log('this.user', this.user)
      this.getBooks()
      // 解决之前登录的用户没有session_key的问题
    }
  }
</script>

<style>
</style>
