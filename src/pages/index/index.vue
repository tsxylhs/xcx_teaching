<template lang="pug">
  .w-100
    nav-bar(:title="'ElB自助系统'")
    .bg-top.w-100.df-row-jc(style="position: relative")
      .bg-white.py-20p.w-90.border.borRadius-5.shadow.df-row-ac-jb.buttonBg(style="position: absolute;bottom:5%")
        .flex-1.df-col-ac.px-10p.border-right(@click="toLine")
          .icon-delivery
          .mt-10p.text-black  成绩
        .flex-1.df-col-ac.px-10p.border-right(@click="toLinelibrary")
          .icon-qrcode
          .mt-10p.text-black 签到
        .flex-1.df-col-ac.px-10p.border-right(@click="toLineUp")
          .calendar
          .mt-10p.text-black 考试
    .shadow.borRadius-5.p-20p.mt-20p
      .df-row-ac-jb
        .pf-subhead 我的
      .df-row-jb.mt-10p
        .df-col-ac.pointer(@click="toOrder(1)")
          .order1
          .text-dark.mt-2 作业
        .df-col-ac.pointer(@click="toOrder(2)")
          .order2
          .text-dark.mt-2 平时成绩
        .df-col-ac.pointer(@click="toOrder(4)")
          .order3
          .text-dark.mt-2 提醒
        .df-col-ac.pointer(@click="scanQrCode")
          .order4
          .text-dark.mt-2 资料


    van-toast#van-toast
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Swiper from '@/components/swiper'
  import Data from '@/utils/data'
  // import API from '@/api/api'
  // import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar,
      Swiper
    },
    onShareAppMessage (object) {
      object.title = '在线ELB'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {
        queueTotal: '',
        user: {},
        val1: -1,
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
        shop: {
          name: '未选择图书馆'
        },
        shopId: '0',
        address: '',
        filter: {p: 1, ps: 10},
        total: 0
      }
    },
    methods: {},
    mounted () {
      this.address = wx.getStorageSync('address')
      this.getlibrarys()
    },
    onShow () {
      // this.checkLocation()
    }
  }
</script>

<style>
</style>
