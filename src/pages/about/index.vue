<template lang="pug">
  .w-100
    nav-bar(:title="'关于ElB'" :backVisible="true" :home-path="'/pages/index/main'")
    .p-20p
      .text-indent 自助学习系统
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
