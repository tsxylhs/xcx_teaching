<template lang="pug">
  .w-100
    nav-bar(:title="'门店'" :backVisible="true" :home-path="'/pages/index/main'")
    div
      .df-row-ac.p-20p
        div
          img(:src="shop.coverUrl" style="width:60px;height:60px" v-if="shop.coverUrl !='' && shop.coverUrl != undefined")
          img(src="https://mtms.letsit.vip/default-shop.png" style="width:60px;height:60px" v-else)
        .ml-20p
          .df-row-ac.text-overflow250
            .pf-title {{shop.name}}
            .arrow.ml-5p
          .mt-5p.d-flex
            div
              .location
            .ml-5p  {{shop.address}}
          .mt-5p.d-flex
            div
              .time-bg
            .ml-5p 营业时间: 周一至周日 {{shop.openingTime}}
      .p-20p
        .mt-50p.borRadius-5.bg-pink.p-20p(style="position: relative")
          .pd(style="position: absolute;left: 50%;transform: translate(-50%, -50%)")
          div.df-col-ac(style="margin-top: 60px")
            .mt-5p.app-red.pf-title 预约排队，健康守护
            .mt-5p.fs-12.text-pink 请提前排队，进店请佩戴口罩
            .mt-10p.w-100
              van-field( clearable placeholder="请输入您的手机号" v-model="filter.mobile" @change="handleMobile" :error-message="errMessage.mobile")
            .mt-20p.w-100
              van-button(v-if="!user" size="large" open-type="getUserInfo" @getuserinfo="checkUser" round custom-class="btn-red" @click="checkUser") 请先授权登录
              van-button(v-if="user" size="large" round custom-class="btn-red" @click="toSuccess") 确认取号
            <!--van-button(size="large" custom-class="borRadius-5" @click="toSuccess" color="#EF282C") -->
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
        errMessage: {
          name: '',
          mobile: ''
        },
        user: {},
        shop: {},
        filter: {
          shopId: '',
          mobile: ''
        }
      }
    },
    methods: {
      checkUser (e) {
        loginInfo(e, this)
      },
      handleMobile (e) {
        this.filter.mobile = e.mp.detail
        console.log('电话号', this.filter.mobile)
        if (this.filter.mobile) {
          if (/^1(3|4|5|7|8)\d{9}$/.test(this.filter.mobile)) {
            this.errMessage.mobile = ''
            return true
          } else {
            this.errMessage.mobile = '您输入的手机号码有误'
            return false
          }
        }
      },
      toSuccess () {
        API.order.queueSave(this.filter).then(res => {
          console.log('返回信息00000', res)
          if (res) {
            wx.navigateTo({
              url: '/pages/queueOrder/main?queueSuccess=true&shopId=' + this.filter.shopId + '&orderId=' + res.id
            })
          }
        })
      }
    },
    onShow () {
      this.user = wx.getStorageSync('user')
      this.filter.shopId = wx.getStorageSync('shopId')
      this.filter.mobile = this.user.mobile
      if (this.filter.shopId) {
        API.shop.get(this.filter.shopId).then(res => {
          this.shop = res
          console.log('店铺详情', res)
        })
      }
      console.log('-------', this.filter)
    }
  }
</script>

<style >
</style>
