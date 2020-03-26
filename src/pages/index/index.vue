<template lang="pug">
  .w-100
    nav-bar(:title="'辅助教学系统'")
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
    .shadow.borRadius-5.p-20p
      .df-row-ac-jb
        .text-dark 时间
        .text-dark 周一计划
        .text-dark 19周
      .df-row
        van-panel(title='复习高数', desc='数列极限', status='待复习', use-footer-slot='')
          view 1.函数极限连续 ①正确理解函数的概念,了解函数的奇偶性、单调性、周期性和有界性,理解复合函数、反函数及隐函数的概念。②理解极限的概念,理解函数左、右极限的概念以及极限存在...
          div.w-100(slot='footer' style="text-align: right")
            van-button(size='small' @click="addpaly") 更新计划
            van-button(size='small', type='danger') 完成计划
    .shadow.borRadius-5.p-20p.mt-20p
      .df-row-ac-jb
        .pf-subhead
      .df-row-jb.mt-10p
        .df-col-ac.pointer(@click="tohomework()")
          .order1
          .text-dark.mt-2 作业
        .df-col-ac.pointer(@click="toOrder(2)")
          .order2
          .text-dark.mt-2 平时成绩
        .df-col-ac.pointer(@click="scanQrCode")
          .order4
          .text-dark.mt-2 资料
        .df-col-ac.pointer(@click="toOrder(4)")
          .order3
          .text-dark.mt-2 提醒(待实现)

    van-popup(:show="addapplyFlag", position="center",overlay="false", @close="applyClose" safe-area-inset-top="true" custom-style="width: 90%;height: 250px;border-radius: 10px !important;")
      .p-20p.van-border.bg-dark 添加修改计划
        van-field(required clearable label="标题" placeholder="输入标题" v-model="apply.title" @change="handlenum" )
        van-field( clearable label="简述"  placeholder="请输入简述" v-model="apply.desc" @change="handlename" )
        van-field(clearable label="内容"   v-model="apply.content" @change="handleDesc"  type='textarea', placeholder='请输入内容', autosize='true', border='')
        van-button.mt-10p(size="large" round custom-class="btn-blue" @click="submint") 添加计划


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
        apply: {},
        addapplyFlag: false,
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
        address: '',
        filter: {p: 1, ps: 10},
        total: 0
      }
    },
    methods: {
      tohomework () {
        wx.navigateTo({
          url: '/pages/user/main'
        })
      },
      addpaly () {
        this.addapplyFlag = true
      },
      applyClose () {
        this.addapplyFlag = false
      }
    },
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
