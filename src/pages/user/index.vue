<template lang="pug">
  .w-100
    nav-bar(:title="'我的'")
    .w-100
      .p-20p
        .df-row-ac.py-3.user-top
          img.wh-50p(style="border-radius:50px" :src="user.avatarUrl" )
          .ml-10p.df-row-jb.flex-1
            div
              .df-row-ac
                .pf-title {{user.nickName}}
            div
              button.btn-main(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录
        .shadow.borRadius-5.p-20p
          .df-row-ac-jb
            .pf-subhead 查看个人信息
          .df-row-jb.mt-10p
            .df-col-ac.pointer(@click="toOrder(1)")
              .major
              .text-dark.mt-2 年级
              .text-dark.mt-2(v-if="user.className") {{user.className}}
              .text-dark.mt-2(v-else) --
            .df-col-ac.pointer(@click="toOrder(2)")
              .student
              .text-dark.mt-2 姓名
              .text-dark.mt-2(v-if="user.userName") {{user.userName}}
              .text-dark.mt-2(v-else) --
            .df-col-ac.pointer(@click="toOrder(4)")
              .point
              .text-dark.mt-2 目标绩点
              .text-dark.mt-2(v-if="user.userName") 8
              .text-dark.mt-2(v-else) --
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toinfom")
          .df-row-ac
            .edit
            span.ml-10p.fs-16 绑定学号信息
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toAbout")
          .df-row-ac
            .aboutdr
            span.ml-10p.fs-16 关于本程序
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toAdderror")
          .df-row-ac
            .customer
            span.ml-10p.fs-16 提交错误日志及意见
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="loginout")
          .df-row-ac
            .customer
            span.ml-10p.fs-16 退出微信
          .arrow.pr-20p
    van-toast#van-toast
</template>
<script>
  import NavBar from '@/components/NavBar.vue'
  import {loginInfo, CallPhone} from '../../utils/login'
  import Toast from '../../../static/vant/toast/toast'

  export default {
    name: 'AlarmInfo',
    components: {
      NavBar
    },
    onShareAppMessage (object) {
      object.title = '教学辅助系统'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {

        disable: false,
        user: {},
        sharePop: false,
        shopId: '',
        userId: '',
        shop: {},
        imageurl: '',
        canvasDialog: false
      }
    },
    methods: {
      saveImage () {
        var that = this
        that.canvasDialog = false
        wx.saveImageToPhotosAlbum({
          filePath: that.imageurl,
          success (res) {
            wx.showModal({
              content: '图片已保存到相册',
              showCancel: false,
              confirmText: '好的',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户确定了')
                }
              }
            })
          }
        })
      },
      shareImage () {
        let url = '/pages/restaurantCard/main'
        wx.navigateTo({
          url: url
        })
      },
      shareDialog () {
        this.sharePop = true
      },
      onClose (item) {
        if (item === 'sharePop') {
          this.sharePop = false
        } else if (item === 'canvasDialog') {
          this.canvasDialog = false
        }
      },
      callPhone () {
        let params = {
          phone: this.shop.bdMobile,
          callSuccess: this.callSuccess,
          callFail: this.callFail,
          completeSuccess: this.completeSuccess
        }
        CallPhone(params)
      },
      callSuccess (e) {
      },
      callFail (e) {

      },
      loginout () {
        wx.removeStorageSync('user')
        wx.switchTab({
          url: '/pages/index/main'
        })
      },
      scanQrCode () {
        wx.scanCode({
          success (res) {
            console.log(res.result)
            Toast(res.result + '门已开锁，请取走你的物品')
          }
        })
      },
      completeSuccess (e) {
      },
      checkUser (e) {
        loginInfo(e, this, this.getMessage)
      },
      getMessage () {
      },
      toRestaurant () {
        if (!this.disable) {
          return
        }
        if ((!this.shop.name) || (!this.shopId && this.shopId + '' === '0')) {
          wx.navigateTo({
            url: '/pages/restaurantForm/main'
          })
        } else {
          wx.navigateTo({
            url: '/pages/restaurant/main?showEdit=' + true + '&showNotice=' + false
          })
        }
      },
      popClose () {
        this.show = false
      },
      submit () {
        this.show = true
      },
      toOrder (item) {
        getApp().globalData.tabIndex = item
        wx.switchTab({
          url: '/pages/myhomework/main'
        })
      },
      toAdderror () {
        wx.navigateTo({
          url: '/pages/errorMessage/main'
        })
      },
      toinfom () {
        wx.navigateTo({
          url: '/pages/infForm/main?userId=' + this.user.id
        })
      },
      toFeedBack () {
        wx.navigateTo({
          url: 'FeedBack'
        })
      },
      toAbout () {
        wx.navigateTo({
          url: '/pages/about/main'
        })
      }
    },
    // mounted () {
    //   let user = wx.getStorageSync('user')
    //   this.user = user
    //   if (user) {
    //     this.loadUser()
    //   }
    //   // this.shopId = wx.getStorageSync('shopId')
    //   this.getMessage()
    // },
    onLoad () {
      this.shopId = wx.getStorageSync('shopId')
      this.getMessage()
      console.log('检查登录态')
      let user = wx.getStorageSync('user')
      this.user = user
      // if (user) {
      //   this.loadUser()
      //   return
      // }
      // wx.navigateTo({
      //   url: '/pages/login/main'
      // })
    },
    onShow () {
      this.shopId = wx.getStorageSync('shopId')
      this.getMessage()
      let user = wx.getStorageSync('user')
      if (user) {
        this.disable = true
      }
      this.user = user
    }
  }
</script>
<style scoped>
</style>
