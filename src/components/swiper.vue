<template lang="pug">
  swiper.swiper(:indicator-dots="indicatorDots" :disabled="false" :autoplay="autoplay" :interval="interval" circular="true" :duration="duration" :style="{'z-index': '-999 !important', height: hei + '!important'}")
    block(v-for="(item, index) in images" :key="index" v-if="item.url != ''")
      swiper-item
        image.slide-image(:src="item.url" mode="widthFix")
</template>

<script>
  export default {
    props: {
      autoplay: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      images: {
        type: Array
      }
    },
    data () {
      return {
        indicatorDots: true,
        interval: 5000,
        duration: 2000,
        hei: ''
      }
    },
    methods: {
      imgH () {
        // 图片适配手机
        let winWid = wx.getSystemInfoSync().windowWidth
        let imgh = 200
        let imgw = 690
        let swiperH = winWid * imgh / imgw + 'px'
        this.hei = swiperH
      }
    },
    mounted () {
      this.imgH()
    }
  }
</script>

<style lang="scss" scoped>
  .swiper {
    position: relative !important;
    margin-top: -20rpx;
    /*padding: 10px;*/
    /*height: 376rpx !important;*/
  }

  image {

    /*height: 100%;*/
    width: 100%;
    /*background-repeat: no-repeat no-repeat;*/
    /*background-size:100% 100%;*/
    /*border-radius: 5px;*/
  }
</style>
