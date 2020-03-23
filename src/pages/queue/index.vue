<template lang="pug">
  .w-100
    nav-bar(:title="'预约位置'" :back-visible="true" :home-path="'/pages/index/main'")
    .mt-20p.df-col-ac-jc(v-if="domain.length === 0")
      span 暂无图书馆可预约
    .first-padding
      .d-flex.border-bottom.pa( v-if="domain.length !== 0" v-for="(item, index) in domain" :key="index" @click="onChange(item)")
        //img( :src="item.cover.prefixUri + item.cover.relativePath" style="width:60px;height:60px")
        img(:src="item.image" style="width:60px;height:60px")
        .df-col-jb.flex-1.ml-20p
          div.df-row-jb
            .fs-16.flex-1(style="font-weight:bold") {{item.name}}
            .fs-13.flex-1.text-pink( @click="toapply(item)") 预约位置
          .df-row-jb.mt-10p.text-dark
            .fs-14.flex-1.text-overflow2 {{item.address}}
            .fs-14.ml-10p {{item.distanceDisplay }}
      van-popup(:show="addapplyFlag", position="center",overlay="false", @close="applyClose" safe-area-inset-top="true" custom-style="width: 90%;height: 300px;border-radius: 10px !important;")
        .p-20p.van-border.bg-dark.mt-20p
          van-field(required clearable label="学号" placeholder="输入学号" v-model="apply.num" @change="handlenum" )
          van-field( clearable label="姓名"  placeholder="请输入姓名" v-model="apply.name" @change="handlename" )
          van-field(required clearable readonly label="选择"  placeholder="选择位置"  icon="arrow" v-model="apply.site" input-class="text-black" @click="choose" )
          van-field( clearable label="预约时间"  placeholder="填写预约时间" v-model="apply.time"  @click="chooseT" )
          van-button(size="large" round custom-class="btn-blue" @click="submint") 确认预约
      van-popup(:show='show', position='bottom', overlay='false', @close='onClose' safe-area-inset-top="true" custom-style="height: 50% !important")
        van-picker(show-toolbar='', v-if="resType === true" title='位置', :columns='columns', @cancel='onCancel', @confirm='TonConfirm')
      van-popup(:show='timeshow', position='bottom', overlay='false', @close='onClose' safe-area-inset-top="true" custom-style="height: 50% !important")
        van-datetime-picker(type='datetime'  :value='currentDate'  :min-date='minDate'  :max-date='maxDate' @cancel="cancelTime"  @confirm="timeS")

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
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2019, 10, 1).getTime(),
        currentDate: new Date().getTime(),
        timeshow: false,
        show: false,
        resType: false,
        apply: {},
        addapplyFlag: false,
        user: {},
        showCode: false,
        domain: {},
        userId: '',
        item: {},
        columns: [],
        image: ''
      }
    },
    methods: {
      cancelTime () {
        this.timeshow = false
      },
      timeS (event) {
        this.timeshow = false
        var currentDate = event.mp.detail.value
        this.apply.time = currentDate
      },
      chooseT () {
        this.timeshow = true
      },
      onClose () {
        this.timeshow = false
        this.show = false
      },
      choose (val) {
        this.resType = true
        this.show = true
      },
      onConfirm (event) {
        this.timeshow = false
        this.show = false
        this.resType = false
        console.log(event.mp.detail.value)
      },
      TonConfirm (event) {
        this.timeshow = false
        this.show = false
        this.resType = false
        console.log(event.mp.detail.value)
        this.apply.site = event.mp.detail.value
      },
      onCancel () {
        this.resType = false
        this.show = false
        // Toast('取消')
      },
      ShowCodes (item) {
        this.showCode = true
      },

      handlenum (event) {
        this.apply.num = event.mp.detail
      },
      handlename (event) {
        this.apply.name = event.mp.detail
      },
      applyClose () {
        this.showCode = false
        this.addapplyFlag = false
      },
      toapply (item) {
        this.item = item
        var params = {
          id: item.id
        }
        API.table.list(params).then((res) => {
          console.log(res)
          this.addapplyFlag = true
          if (res.data.length <= 0) {
            this.columns = ['位置已满']
          } else {
            res.data.forEach((r) => {
              console.log(r)
              this.columns = []
              if (r.status === '1') {
                this.columns.push(r.location + ':' + r.name)
              }
            })
          }
        }).catch(() => {
        })
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
