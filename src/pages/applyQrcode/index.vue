<template lang="pug">
  .w-100
    nav-bar(:title="'申请图书馆二维码'" :back-visible="true" :home-path="'/pages/index/main'")
    .mt-20p.df-col-ac-jc(v-if="domain.length === 0")
      span 暂无图书馆
    .first-padding
      .d-flex.border-bottom.pa( v-if="domain.length !== 0" v-for="(item, index) in domain" :key="index" @click="onChange(item)")
        //img( :src="item.cover.prefixUri + item.cover.relativePath" style="width:60px;height:60px")
        img(:src="item.image" style="width:60px;height:60px")
        .df-col-jb.flex-1.ml-20p
          div.df-row-jb
            .fs-16.flex-1(style="font-weight:bold") {{item.name}}
            .fs-13.flex-1.text-pink(v-if="item.apply.id==='0'" @click="toapply(item)") 申请二维码
            .fs-13.flex-1.text-dark(v-else @click="ShowCodes(item)") 出示二维码
          .df-row-jb.mt-10p.text-dark
            .fs-14.flex-1.text-overflow2 {{item.address}}
            .fs-14.ml-10p {{item.distanceDisplay }}
      van-popup(:show="addapplyFlag", position="center",overlay="false", @close="applyClose" safe-area-inset-top="true" custom-style="width: 90%;height: 300px;border-radius: 10px !important;")
        .p-20p.van-border.bg-dark.mt-20p
          van-field(required clearable label="学号" placeholder="输入学号" v-model="apply.num" @change="handlenum" )
          van-field( clearable label="姓名"  placeholder="请输入姓名" v-model="apply.name" @change="handlename" )
          van-field( clearable label="学院"  placeholder="请输入学院" v-model="apply.school" @change="handleschool")
          van-field( clearable label="班级" placeholder="输入班级" v-model="apply.calss" @change="handleclass")
          van-field(required clearable label="电话"  placeholder="请输入电话" v-model="apply.phone" @change="handlephone" )
          van-button(size="large" round custom-class="btn-blue" @click="submint") 确认申请
      van-popup(:show="showCode", position="center",overlay="false", @close="applyClose" safe-area-inset-top="true" custom-style="width: 90%;height: 300px;border-radius: 10px !important;")
        img(:src="image" style="width: 100%;height: 300px")
</template>

<script>
  import API from '@/api/api'
  import NavBar from '@/components/NavBar.vue'

  export default {
    name: 'InfForm',
    components: {
      NavBar
    },
    data () {
      return {
        apply: {},
        addapplyFlag: false,
        user: {},
        showCode: false,
        domain: {},
        userId: '',
        item: {},
        image: ''
      }
    },
    methods: {
      ShowCodes (item) {
        this.showCode = true
      },

      handlenum (event) {
        this.apply.num = event.mp.detail
      },
      handlename (event) {
        this.apply.name = event.mp.detail
      },
      handleclass (event) {
        this.apply.class = event.mp.detail
      },
      handleschool (event) {
        this.apply.school = event.mp.detail
      },
      handlephone (event) {
        this.apply.phone = event.mp.detail
      },
      applyClose () {
        this.showCode = false
        this.addapplyFlag = false
      },
      toapply (item) {
        this.item = item
        this.addapplyFlag = true
      },
      submint () {
        this.apply.libraryId = this.item.id
        this.apply.userId = this.user.id
        API.apply.create(this.apply).then((res) => {
          console.log('ok')
          this.addapplyFlag = false
        }).catch(() => {
          this.addapplyFlag = false
        })
      },
      getlibrarys () {
        API.books.applylibrary(this.user.id).then((res) => {
          this.domain = res.data
        }).catch(() => {
        })
      }
    },
    mounted () {
      this.getlibrarys()
    },
    onShow () {
      this.image = '../../static/images/show.png'
      this.user = wx.getStorageSync('user')
      this.getlibrarys()
    }
  }
</script>

<style scoped>

</style>
