<template lang="pug">
  .w-100
    nav-bar(:title="'预约中'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100(v-if="isLogged")
      .p-20p.df-col-ac-jc.mt-50p(v-if="queues.length <= 0 || queues == undefined")
        .queue-none
        .pf-subhead.mt-10p 您当前暂无预约
        .mt-10p.w-80
          van-button(size="large" round custom-class="btn-minEdit" @click="toLineUpShop") 查看可预约的图书馆
      .p-20p(v-else)
        .bg-white.pt-10p.shadow.borRadius-5.border.mt-40p(v-for="(q, i) in queues" :key="i")
          .text-center.p-10p(style="border-bottom: 1px dashed #ECEEF2")
            .pf-subhead {{q.library.name}}
            .mt-10p.text-black 您的预约桌号
            .mt-10p.pf-title {{q.site}}

          .my-20p.w-50.m-auto.text-center
            div(v-if="q.queueProcess === 'waiting'")
              van-button.w-50(size="large" round custom-class="btn-minEdit" @click="handleCancel(q)") 取消排队
            div(v-if="q.queueProcess === 'cancel'")
              span.pf-subhead 已取消
              .mt-10p
              van-button(size="large" round custom-class="btn-minEdit" @click="resubmit(q)") 重新排队取号
            div(v-if="q.queueProcess === 'finished'")
              span.pf-subhead 商家已叫号
              .mt-10p
              van-button(size="large" round custom-class="btn-minEdit" @click="toShop(q.shopId)") 查看商家
            div(v-if="q.queueProcess === 'failed'")
              .text-red
                div 排队失败
                div 非常抱歉，商家无法提供该服务

          .bg-dark.p-20p.borRadius-b
            .text-black {{q.library.name}}
            .mt-10p.d-flex
              div
                .location.mr-5p
              span {{q.library.address}}

        .mt-20p.text-center 请准时到达
        .mt-30p.w-50.m-auto
          van-button(size="large" round custom-class="btn-white" @click="toOrder") 确认离开
        van-popup(:show='showPop', position='center', overlay='false', @close='onClose' safe-area-inset-top="true" custom-style="width: 70% !important")
          .borRadius-30
            .p-20p
              .df-row-ac-jb
                .pf-subhead
                .cancel(@click='onClose')
              .mt-10p.text-center.pf-subhead.py-20p 请确认您是否要取消排队?
            .df-row-ac
              .flex-1.text-red.px-20p.py-10p.text-center(@click='onClose') 取消
              .flex-1.bg-red.px-20p.py-10p.text-white.text-center(@click='cancel') 确认

    .w-100.mt-50p(v-else)
      .df-col-ac.p-20p
        .login-none
        .mt-10p(v-if="!user") 请先登录，以查看预约。
        button.btn-main.mt-10p(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录

</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar
    },
    data () {
      return {
        queues: [],
        showPop: false,
        order: {},
        isLogged: false,
        user: {},
        phoneNumber: '',
        filter: {ps: 10, p: 1},
        total: 0
      }
    },
    methods: {
      checkUser (e) {
        loginInfo(e, this, this.viewMyQueue)
      },
      toLineUpShop () {
        wx.navigateTo({
          url: '/pages/mybook/main'
        })
      },
      toShop (id) {
        wx.navigateTo({
          url: '/pages/appointment/main?shopId=' + id
        })
      },
      toShopDetail () {
        wx.navigateTo({
          url: '/pages/shopDetail/main'
        })
      },
      toOrder () {
        API.apply.delete(this.user.id).then((res) => {
          console.log(res)
        }).catch(() => {
        })
      },
      handleCancel (order) {
        this.order = order
        this.showPop = true
      },
      onClose () {
        this.showPop = false
      },
      viewMyQueue () {
        this.user = wx.getStorageSync('user')
        if (this.user) {
          this.isLogged = true
        }
        let param = {
          userId: this.user.id,
          IsQueue: true
        }
        param = Object.assign(this.filter, param)
        API.apply.list(param).then(res => {
          if (this.filter.p > 1) {
            this.queues.push(...res.data)
          } else {
            this.queues = res.data
          }
          // 总页数
          this.total = Math.ceil(res.page.cnt / res.page.ps)
          console.log('queueOrderList====>', this.queues)
        })
      }
    },
    onPullDownRefresh () {
      console.log('下拉刷新')
      // 初始化页码
      this.filter.p = 1
      this.viewMyQueue()
    },
    onReachBottom () {
      if (this.filter.p > this.total) {
        console.log('上拉数据加载完了')
      } else {
        // 下一页
        this.filter.p = this.filter.p + 1
        this.viewMyQueue()
      }
    },
    onShow () {
      this.filter = {ps: 10, p: 1}
      this.isLogged = false
      this.user = wx.getStorageSync('user')
      this.phoneNumber = wx.getStorageSync('phoneNumber')
      if (this.user.id !== '0') {
        this.viewMyQueue()
        this.isLogged = true
      }
    }
  }
</script>

<style>
</style>
