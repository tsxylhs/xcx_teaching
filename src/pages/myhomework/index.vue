<template lang="pug">
  .w-100
    nav-bar(title="我的作业" :backVisible="true" :home-path="'/pages/index/main'")
    .p-10p

      .mt-20p.df-col-ac-jc(v-if="domain.length === 0&&user")
        span 暂无作业
        span 好好学习，天天向上
      .first-padding
        .d-flex.p-20p.border-bottom.pa( v-if="domain.length !== 0" v-for="(item, index) in domain" :key="index" )
          //img( :src="item.cover.prefixUri + item.cover.relativePath" style="width:60px;height:60px")
          //img(:src="item.book.image" style="width:60px;height:60px")
          .df-col-jb.flex-1.ml-20p
            .df-row-jb
              .fs-16.flex-1(style="font-weight:bold") {{item.courseName}}
              .fs-12.flex-1 {{item.teachName}}
            .df-row-jb.mt-10p.text-dark
              .fs-14.flex-1.text-overflow2 {{item.content}}
              .fs-14.ml-10p(v-if="item.status!=='finshed'" style="color:#0066CC" @click="deleteNotes(item)") 完成
              .fs-14.ml-10p(v-if="item.status!=='finshed'" style="color:#0066CC" @click="choose(item)") 上传文件
              .fs-14.ml-10p(v-if="item.status==='finshed'" style="color:#0066CC") 已完成
      .w-100.mt-50p(v-if="!user")
        .df-col-ac.p-20p
          .login-none
          .mt-10p 请先登录，以查看作业。
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
        loginInfo(e, this, this.gethomework)
      },
      deleteNotes (item) {
        var homeworked = wx.getStorageSync('homeworked')
        if (homeworked) {
          homeworked.push(item.id)
          wx.setStorageSync('homeworked', homeworked)
        } else {
          var homeed = []
          homeed.push(item.id)
          wx.setStorageSync('homeworked', homeed)
        }
        this.gethomework()
      },
      addNotes (item) {
        wx.navigateTo({
          url: '/pages/addNotes/main?bookId=' + item.bookId
        })
      },
      choose (val) {
        var that = this
        wx.chooseMessageFile({
          count: 1, // 默认9
          type: 'file',
          success: function (res) {
            debugger
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFiles
            that.addfile(tempFilePaths, val)
          }
        })
      },
      addfile (imgPath, val) {
        let that = this
        // 上传文件
        wx.uploadFile({
          url: 'http://127.0.0.1:8081/myhomework/add',
          filePath: imgPath[0].path,
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          formData: {
            'userId': that.user.id,
            'homeworkId': val.id
          },
          success: function (res) {
            debugger
            console.log('上传成功')
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            // that.files = that.files.concat(imgPath[i])
            // console.log(res.data)// 合并图片显示数组
          },
          fail: function (err) {
            debugger
            console.log(err)
            wx.hideLoading()
            // wx.showModal({
            //   title: '错误提示',
            //   content: '上传图片失败',
            //   showCancel: false,
            //   success: function (res) {
            //   }
            // })
          },
          complete: function () {
          }
        })
      },

      changeRange (e) {
        this.domain = []
        this.val1 = e.mp.detail
        this.checkLocation()
      },
      gethomework () {
        var params = {
          conditions: {
            className: this.user.className
          }
        }
        API.homework.list(params).then((res) => {
          this.domain = res.data
          var homeworked = wx.getStorageSync('homeworked')
          this.domain.forEach((res) => {
            homeworked.forEach((r) => {
              debugger
              if (res.id === r) {
                res.status = 'finshed'
              } else {
                res.status = 'finshing'
              }
            })
          })
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
      this.domain = []
      this.user = wx.getStorageSync('user')
      console.log('this.user', this.user)
      this.gethomework()
      // 解决之前登录的用户没有session_key的问题
    }
  }
</script>

<style>
</style>
