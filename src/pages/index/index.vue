<template lang="pug">
  .w-100
    nav-bar(:title="'辅助教学系统'")
    .bg-top.w-100.df-row-jc(style="position: relative")
      .bg-white.py-20p.w-90.border.borRadius-5.shadow.df-row-ac-jb.buttonBg(style="position: absolute;bottom:5%")
        .flex-1.df-col-ac.px-10p.border-right(@click="tograde")
          .icon-delivery
          .mt-10p.text-black  成绩
        .flex-1.df-col-ac.px-10p.border-right(@click="scanQrCode")
          .icon-qrcode
          .mt-10p.text-black 签到
        .flex-1.df-col-ac.px-10p.border-right(@click="scanQrCodeB")
          .icon-qrcode
          .mt-10p.text-black 签退

        .flex-1.df-col-ac.px-10p.border-right(@click="totest")
          .calendar
          .mt-10p.text-black 考试
    .shadow.borRadius-5.p-20p
      .df-row-ac-jb
        .text-dark 时间
        .text-dark 周一计划
        .text-dark 19周
      .df-row(v-if="user")
        div(v-if="reminds.length>0")
          div(v-for="remind in reminds")
            van-panel( :title='remind.title', :desc='remind.reminddesc', :status='remind.status' use-footer-slot='')
              view {{remind.content}}
              div.w-100( style="text-align: right")
                van-button(size='small' @click="addpaly(remind)") 更新计划
                van-button(size='small', type='danger' @click="deleteapply(remind)") 完成计划
          .df-col-ac.p-20p
            button.btn-main.mt-10p(round @click="addremind") 添加计划
        div(v-else)
          .df-col-ac.p-20p
            button.btn-main.mt-10p(round @click="addremind") 添加计划

      .df-row(v-else)
        .df-col-ac.p-20p
          .login-none
          .mt-10p 请先登录，以查看计划。
          button.btn-main.mt-10p( open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录

    .shadow.borRadius-5.p-20p.mt-20p
      .df-row-ac-jb
        .pf-subhead
      .df-row-jb.mt-10p
        .df-col-ac.pointer(@click="tohomework()")
          .order1
          .text-dark.mt-2 作业
        .df-col-ac.pointer(@click="tomaterials")
          .order4
          .text-dark.mt-2 资料
        .df-col-ac.pointer(@click="")
          .order3
          .text-dark.mt-2 提醒(待实现)

    van-popup(:show="addapplyFlag", position="center",overlay="false", @close="applyClose" safe-area-inset-top="true" custom-style="width: 95%;height: 280px;border-radius: 10px !important;")
      .p-20p.van-border.bg-dark 添加修改计划
        van-field(required clearable label="标题" placeholder="输入标题" v-model="remind.title" @change="handletitle" )
        van-field( clearable label="简述"  placeholder="请输入简述" v-model="remind.reminddesc" @change="handledesc" )
        van-field( clearable label="状态"  placeholder="请输入状态" v-model="remind.status" @change="handlestatus" )
        van-field(clearable label="内容"   v-model="remind.content" @change="handlecontent"  type='textarea', placeholder='请输入内容', autosize='true', border='')
        van-button.mt-10p(size="large" round custom-class="btn-blue" @click="submint") 添加计划
    van-popup(:show="qrFlag", position="center",overlay="false", @close="applyClose" safe-area-inset-top="true" custom-style="width: 95%;height: 180px;border-radius: 10px !important;")
      .p-20p.van-border.bg-dark 信息
        van-field(required clearable label="课程" placeholder="输入标题" v-model="signin.crouseName"  )
        van-field( clearable label="教师"  placeholder="请输入简述" v-model="signin.teachName")
        van-button.mt-10p(size="large" round custom-class="btn-blue" @click="submintsignin") 签到
    van-toast#van-toast
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Swiper from '@/components/swiper'
  import Data from '@/utils/data'
  import {loginInfo} from '../../utils/login'
  import API from '@/api/api'
  import Toast from '../../../static/vant/toast/toast'
  // import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar,
      Swiper
    },
    onShareAppMessage (object) {
      object.title = '教学辅助系统'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {
        apply: {},
        qrFlag: false,
        addapplyFlag: false,
        queueTotal: '',
        user: {},
        flag: true,
        reminds: [],
        val1: -1,
        signin: {},
        remind: {},
        queues: [],
        lnglat: {},
        searchKey: '',
        id: '0',
        isActive: 0,
        firstCagories: [],
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
        address: '',
        filter: {p: 1, ps: 10},
        total: 0
      }
    },
    methods: {
      submintsignin () {
        this.signin.className = this.user.className
        this.signin.studentId = this.user.studentId
        this.signin.startSignin = new Date()
        API.signin.create(this.signin).then((res) => {
          debugger
          wx.setStorageSync('signin', res.data)
          this.flog = false
          Toast('签到成功！')
          this.qrFlag = false
        }).catch((err) => {
          console.log(err)
          Toast('签到失败！')
        })
      },
      deleteapply (remind) {
        API.remind.delete(remind.id).then((res) => {
          this.loadRemind()
        }).catch(() => {
        })
      },
      addremind () {
        this.addapplyFlag = true
      },
      submint () {
        this.remind.userId = this.user.id
        var api = this.remind.id ? API.remind.update : API.remind.create
        api(this.remind).then((res) => {
          this.loadRemind()
        }).catch(() => {
        })
      },
      scanQrCodeB () {
        wx.scanCode({
          success (res) {
            console.log(res.result)
            var sigins = res.result.split('&')
            var signinss = wx.getStorageSync('signin')
            debugger
            if (signinss.crouseName === sigins[1]) {
              signinss.endSignin = new Date()
              API.signin.update(signinss).then((res) => {
                Toast('签退成功！')
                wx.removeStorageSync('signin')
                this.flag = false
                Toast('签退成功！')
              }).catch(() => {
              })
            } else {
              Toast('签到失败，请核对二维码！')
            }
          }
        })
      },
      scanQrCode () {
        var that = this
        wx.scanCode({
          success (res) {
            console.log(res.result)
            var sigins = res.result.split('&')
            that.signin.crouseName = sigins[1]
            that.signin.teachName = sigins[0]
            that.qrFlag = true
          }
        })
      },
      loadRemind () {
        var param = {
          conditions: {
            userId: this.user.id
          }
        }
        API.remind.list(param).then((res) => {
          if (res.data) {
            this.reminds = res.data
          } else {
            this.reminds = []
          }
        }).catch(() => {
        })
      },
      handledesc (event) {
        this.remind.reminddesc = event.mp.detail
      },
      handletitle (event) {
        this.remind.title = event.mp.detail
      },
      handlestatus (event) {
        this.remind.status = event.mp.detail
      },
      handlecontent (event) {
        this.remind.content = event.mp.detail
      },
      tomaterials () {
        wx.navigateTo({
          url: '/pages/materials/main'
        })
      },
      totest () {
        wx.navigateTo({
          url: '/pages/test/main'
        })
      },
      tohomework () {
        wx.navigateTo({
          url: '/pages/myhomework/main'
        })
      },
      tograde () {
        wx.navigateTo({
          url: '/pages/grade/main'
        })
      },
      checkUser (e) {
        loginInfo(e, this, this.loadRemind)
      },
      addpaly (remind) {
        this.remind = remind
        this.addapplyFlag = true
      },
      applyClose () {
        this.addapplyFlag = false
      }
    },
    mounted () {
      this.user = wx.getStorageSync('user')
      if (this.user) {
        this.loadRemind()
      }
    },
    onShow () {
      if (wx.getStorageSync('signin')) {
        this.flag = false
      }
      this.user = wx.getStorageSync('user')
      if (this.user) {
        this.loadRemind()
      }
    }
  }
</script>

<style>
</style>
