<template lang="pug">
  .w-100
    nav-bar(:title="'绑定学号'" :back-visible="true" :home-path="'/pages/index/main'")
    van-cell-group
      van-field( clearable label="昵称"  placeholder="请输入你的学号" :disable="true" v-model="user.nickName"  @change="handlenickName")
      van-field(required clearable label="姓名" placeholder="输入姓名" v-model="user.userName" @change="handleUserName" :error-message="errMessage.name")
      van-field( clearable label="学号"  placeholder="请输入你的学号" v-model="user.studentId" @change="handleStudent")
      van-field( clearable label="班级"  placeholder="请输入你的班级" v-model="user.className" @change="handleClass")
      van-field( clearable label="联系电话"  placeholder="请输入你的联系电话" v-model="user.mobile" @change="handleMobile")
    .mt-20p.w-90.m-auto
      van-button(size="large" round custom-class="btn-black" @click="onSave") 绑定

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

      handleStudent (event) {
        this.user.studentId = event.mp.detail
      },
      handleClass (event) {
        this.user.className = event.mp.detail
      },
      handleUserName (event) {
        this.user.userName = event.mp.detail
      },
      handleMobile (event) {
        this.user.mobile = event.mp.detail
      },
      handlenickName (event) {
        this.user.nickName = event.mp.detail
      },
      loadUser (id) {
        API.wxUser.get(id).then((res) => {
          this.user = res.data
          console.log('this.user', this.user)
        }).catch(() => {
        })
      },
      onSave () {
        API.wxUser.update(this.user).then((res) => {
          wx.setStorageSync('user', res.data)
          wx.navigateTo({
            url: '/pages/user/main'
          })
        }).catch(() => {
        })
      }
    },
    onLoad () {
      this.user = wx.getStorageSync('user')
      if (this.user) {
        this.loadUser(this.user.id)
      }
    }
  }
</script>

<style scoped>

</style>
