<template lang="pug">
  .w-100
    nav-bar(:title="'提交错误信息或意见'" :back-visible="true" :home-path="'/pages/index/main'")
    van-cell-group
      van-field( clearable label="bug及意见"  placeholder="请输入" type='textarea'  v-model="domain.content"  @change="handleContent")
    .mt-20p.w-90.m-auto
      van-button(size="large" round custom-class="btn-black" @click="onSave") 提交
    van-toast#van-toast
</template>

<script>
  import API from '@/api/api'
  import NavBar from '@/components/NavBar.vue'
  import Toast from '../../../static/vant/toast/toast'

  export default {
    name: 'InfForm',
    components: {
      NavBar
    },
    data () {
      return {
        domain: {}
      }
    },
    methods: {
      handleContent (event) {
        this.domain.content = event.mp.detail
      },

      onSave () {
        API.wxError.create(this.domain).then((res) => {
          Toast('提交成功！')
          wx.switchTab({
            url: '/pages/user/main'
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped>

</style>
