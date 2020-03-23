<template lang="pug">
  .w-100
    nav-bar(:title="'预约信息'")
    .df-col-ac-jc.text-dark(v-if="cartOrders == undefined || cartOrders.length <= 0" style="margin-top: 200rpx;")
      .ep-cart
      .mt-10p 当前预约是空的
      .mt-5p 去首页添加预约吧
    ul.last-border-2
    van-dialog#van-dialog
    van-toast#van-toast

</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  export default {
    components: {NavBar},
    watch: {
      cartOrders: function () {
        console.log('更新cartOrders')
        this.freshOrder()
      },
      count (val) {
        let j
        this.cart.forEach((co, i) => {
          if (co.supplierId + '' === this.supplier.id + '') {
            console.log('iiiiiiiii', i)
            for (j = 0; j < co.skus.length; j++) {
              let sk = co.skus[j]
              if (sk.skuId + '' === this.item.id + '') {
                sk.count = this.count + ''
                if (sk.count === '0') {
                  co.skus.splice(j, 1)
                  if (co.skus.length <= 0 || co.skus === undefined) {
                    this.cart.splice(i, 1)
                  }
                }
              }
              console.log('co.skus => ', this.cart)
            }
          }
        })
        // 刷新缓存值
        wx.setStorageSync('cart', this.cart)
        this.loadData(this.cart)
        this.freshOrder()
      }
    },
    onShareAppMessage (object) {
      object.title = '在线ELB'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {

      }
    },
    methods: {
    },
    onShow () {
    }
  }
</script>

<style>
</style>
