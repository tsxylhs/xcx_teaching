<template lang="pug">
  .w-100
    nav-bar(:title="'绑定学号'" :back-visible="true" :home-path="'/pages/index/main'")
    van-cell-group
      van-field(required clearable label="姓名" placeholder="输入姓名" v-model="user.username" @change="handleUsername" :error-message="errMessage.name")
      van-field( clearable label="学号"  placeholder="请输入你的学号" v-model="user.studentId" @change="handleStudent")
      van-field( clearable label="班级"  placeholder="请输入你的院校" v-model="user.calss" @change="handleClass")
    .mt-20p.w-90.m-auto
      van-button(size="large" round custom-class="btn-black" @click="onSave") 绑定
    van-popup(:show='show', position='bottom', overlay='false', @close='onClose' safe-area-inset-top="true" custom-style="height: 50% !important")
      van-area(:area-list="areaList" @confirm="confirm" @cancel="onClose")

</template>

<script>
  import API from '@/api/api'
  import NavBar from '@/components/NavBar.vue'
  import AreaList from '@/utils/area'

  export default {
    name: 'InfForm',
    components: {
      NavBar
    },
    data () {
      return {
        user: {},
        userId: '',
        errMessage: {
          name: '',
          mobile: ''
        },
        areaList: AreaList,
        show: false

      }
    },
    methods: {
      submit () {
        this.show = true
      },
      onClose () {
        this.show = false
      },
      confirm (e) {
        let region = e.mp.detail.values
        let areaName = ''
        region.forEach(item => {
          areaName = areaName + item.name + ' '
        })
        this.show = false
        this.user.region = areaName
      },
      handleUsername (event) {
        this.user.username = event.mp.detail
        if (!this.user.username) {
          this.errMessage.name = '昵称不能为空'
          return true
        } else {
          this.errMessage.name = ''
        }
      },
      handleStudent (event) {
        this.user.studentId = event.mp.detail
      },
      handleClass (event) {
        this.user.email = event.mp.detail
      },
      loadUser (id) {
        API.user.get(id).then((res) => {
          this.user = res
          console.log('this.user', this.user)
        }).catch(() => {
        })
      },
      onSave () {
        API.user.update(this.user).then((res) => {
          wx.setStorageSync('user', res)
          wx.navigateTo({
            url: '/pages/user/main'
          })
        }).catch(() => {
        })
      }
    },
    mounted () {
      this.loadUser(this.$root.$mp.query.userId)
    },
    onLoad () {
      this.loadUser(this.$root.$mp.query.userId)
    }
  }
</script>

<style scoped>

</style>
