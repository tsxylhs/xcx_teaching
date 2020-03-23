<template lang="pug">
  .w-100
    nav-bar(:title="'我的读书笔记'" )
    .w-100(v-if="isLogged")
      .df-col-ac-jc.text-dark(v-if="epOrder" style="margin-top: 200rpx;")
        .ep-order
        .mt-10p.mr-20p 还没有笔记
      ul.last-border-2(v-if="!epOrder")
        li.pl-20p.py-20p(@click="toDetail(ord)" v-for="(ord,ins) in domain" :key="ins")
          .df-row-ac-jb.pr-20p
            .df-row-ac
              //.merchant
              .pf-subheadp 笔记编号：{{ord.id}}
          .mt-10p.d-flex.pr-20p.border-bottom.py-10p
            .ml-10p.py-5p.flex-1
              .df-row-jb.pf-subhead
                .pf-subhead 标题：{{ord.title}}
                .ml-20p
                  div
                    span 《{{ord.bookName}}》
                  div.fr.text-dark.fs-12
                    span {{ord.bookAuthor}}
              .d-flex.fs-12.mt-10p.text-dark
                span 创建时间:
                span.ml-5p {{ord.createdAt}}
              .df-row-ac.fs-12.text-dark.mt-5p
                span 更新时间:
                span.ml-5p {{ord.updatedAt}}
    .w-100.mt-50p(v-else)
      .df-col-ac.p-20p
        .login-none
        .mt-10p 请先登录，以查看笔记。
        button.btn-main.mt-10p(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录

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
        epOrder: true
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
      toDetail (ord) {
        wx.navigateTo({
          url: '/pages/addNotes/main?notesId=' + ord.id
        })
      },
      checkUser (e) {
        loginInfo(e, this, this.loadNotes)
      },
      loadNotes (options) {
        let user = wx.getStorageSync('user')
        let params = {userId: user.id}
        params = Object.assign(params, options)
        API.notes.list(params).then(res => {
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
    mounted () {
      this.loadNotes()
    },
    onShow () {
      let user = wx.getStorageSync('user')
      if (user) {
        this.isLogged = true
      }
    }
  }
</script>

<style scoped>
</style>
