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
                .border.px-10p.py-5p.ml-10p.text-dark.fs-12( v-if="disable" plain size="mini" @click="toInf") 修改
              //.df-row-ac.mt-5p
                .merchant
                .text-muted.ml-5p(v-if="!shopId")  当前:{{user.shopName || '未设置门店'}}
                .text-muted.ml-5p(v-if="shop.name")  当前:{{shop.name || '未设置门店'}}
            div
              button.btn-main(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录
        .shadow.borRadius-5.p-20p
          .df-row-ac-jb
            .pf-subhead 查看个人信息
          .df-row-jb.mt-10p
            .df-col-ac.pointer(@click="toOrder(1)")
              .major
              .text-dark.mt-2 年级
              .text-dark.mt-2 --
            .df-col-ac.pointer(@click="toOrder(2)")
              .student
              .text-dark.mt-2 姓名
              .text-dark.mt-2 --
            .df-col-ac.pointer(@click="toOrder(4)")
              .point
              .text-dark.mt-2 绩点
              .text-dark.mt-2 --

      .pl-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toinfom")
          .df-row-ac
            .delivery
            span.ml-10p.fs-16 修改个人信息
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toAbout")
          .df-row-ac
            .info
            span.ml-10p.fs-16 关于本程序
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toAbout")
          .df-row-ac
            .info
            span.ml-10p.fs-16 更多信息
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toAbout")
          .df-row-ac
            .info
            span.ml-10p.fs-16 绑定学号
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
      object.title = '在线Elb'
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
        // debugger
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
      shareQrcode () {
        let url = '/pages/shareCard/main?shopId=' + this.shopId
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
          url: '/pages/mybook/main'
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
