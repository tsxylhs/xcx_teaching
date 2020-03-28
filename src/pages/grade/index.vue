<template lang="pug">
  .w-100
    nav-bar(:title="'我的成绩'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100(v-if="isLogged")
      .df-col-ac-jc.text-dark(v-if="epOrder||!bind" style="margin-top: 200rpx;")
        .ep-order
        .mt-10p.mr-20p 还没有成绩或者未绑定信息
      ul.last-border-2(v-if="!epOrder")
        li.pl-20p.py-20p(@click="toDetail(ord)" v-for="(ord,ins) in domain" :key="ins")
          .df-row-ac-jb.pr-20p
            .df-row-ac
              //.merchant
              .pf-subheadp 成绩编号：{{ord.id}}
          .mt-10p.d-flex.pr-20p.border-bottom.py-10p
            .ml-10p.py-5p.flex-1
              .df-row-jb.pf-subhead
                .pf-subhead 学科：{{ord.courseName}}
                .ml-20p
                  div
                    span 总成绩: {{ord.courseGrade}}
                  div.fr.text-dark.fs-12
                    span 代课老师 {{ord.teachName}}
              .d-flex.fs-12.mt-10p.text-dark
                span 考试成绩:
                span.ml-5p {{ord.testScores}}
              .d-flex.fs-12.mt-10p.text-dark
                span 签到成绩:
                span.ml-5p {{ord.signin}}
              .df-row-ac.fs-12.text-dark.mt-5p
                span 课堂表现成绩:
                span.ml-5p {{ord.showGrades}}
    .w-100.mt-50p(v-else)
      .df-col-ac.p-20p
        .login-none
        .mt-10p 请先登录，以查看成绩。
        button.btn-main.mt-10p( open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录

</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Data from '@/utils/data'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'
  import Moment from 'moment'

  export default {
    components: {NavBar},
    data () {
      return {
        isLogged: false,
        active: 0,
        data: Data,
        domain: [],
        user: {},
        epOrder: true,
        bind: true
      }
    },
    onShareAppMessage (object) {
      object.title = '在线ELB'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    watch: {},
    methods: {

      toaddnotes () {
        wx.navigateTo({url: '/pages/addNotes/main'})
      },
      toDetail (ord) {
        wx.navigateTo({
          url: '/pages/addNotes/main?notesId=' + ord.id
        })
      },
      checkUser (e) {
        loginInfo(e, this, this.loadNotes)
      },
      loadgrade (options) {
        let user = wx.getStorageSync('user')
        if (user.studentId === 0) {
          return
        }
        var param = {
          conditions: {
            userId: this.user.studentId
          }
        }
        API.grade.list(param).then(res => {
          this.isLogged = true
          if (res.data === undefined || res.data.length <= 0) {
            this.epOrder = true
            console.log('没有')
          } else {
            res.data.forEach(order => {
              if (order.createdAt) {
                order.createdAt = Moment(order.createdAt).format('YYYY-MM-DD HH:mm')
                order.updatedAt = Moment(order.updatedAt).format('YYYY-MM-DD HH:mm')
              }
            })
            this.domain = res.data
            console.log('有笔记')
            this.epOrder = false
          }
        }).catch((err) => {
          console.log('err', err)
        })
      }
    },
    onShow () {
      let user = wx.getStorageSync('user')
      this.user = user
      this.loadgrade()
      if (user) {
        if (user.studentId === 0 || user.studentId === '') {
          this.bind = false
        }
        this.isLogged = true
      }
    }
  }
</script>

<style scoped>
</style>
