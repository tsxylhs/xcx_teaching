<template lang="pug">
  .w-100
    nav-bar(:title="'关于ElB'" :backVisible="true" :home-path="'/pages/index/main'")
    .p-20p
      .text-indent ElB是一个为学生提供网上预约，借阅图书，图书馆导航等功能。
</template>

<script>
  import NavBar from '@/components/NavBar.vue'

  export default {
    components: {
      NavBar
    },
    data () {
      return {
      }
    },
    methods: {
    },
    mounted () {
    }
  }
</script>

<style >
</style>
