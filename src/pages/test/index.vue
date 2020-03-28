<template lang="pug">
  .w-100
    nav-bar(:title="'考试安排'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100
      .df-row(v-if="user")
        div(v-if="reminds.length>0")
          div(v-for="remind in reminds")
            van-panel( :title='remind.title', :desc='remind.teachName', :status='remind.status' use-footer-slot='')
              view {{remind.content}}


</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Data from '@/utils/data'

  export default {
    components: {NavBar},
    data () {
      return {
        isLogged: false,
        active: 0,
        reminds: [{
          title: '高等数学',
          teachName: '王守义',
          reminddesc: '期中',
          status: '2020-4-17',
          content: '挂科可是要吃牌的'
        }, {
          title: '大学英语',
          teachName: '李艳茹',
          reminddesc: '期中',
          status: '2020-4-17',
          content: '挂科可是要吃牌的'
        }],
        data: Data,
        domain: [],
        user: {},
        epOrder: true,
        bind: true
      }
    },
    watch: {},
    methods: {},
    onShow () {
    }
  }
</script>

<style scoped>
</style>
