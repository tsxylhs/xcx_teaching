<template lang="pug">
  .w-100.df-col-as.h-100
    div
      nav-bar(:backVisible="true" title="欢迎光临" :home-path="'/pages/index/main'")
      div
        .df-row-ac.p-20p(@click="tolibrary")
          div
            img(:src="library.image" style="width:60px;height:60px" v-if="library.image !=='' && library.image !==undefined")
            img(src="https://mtms.letsit.vip/default-library.png" style="width:60px;height:60px" v-else)
          .ml-20p.flex-1
            .df-row-ac.text-overflow250
              .pf-title {{library.name}}
              div 去这里
              .arrow.ml-5p
            .mt-5p.d-flex
              div
                .location
              .ml-5p  {{library.address}}
            .mt-5p.d-flex
              div
                .time-bg
              .ml-5p 营业时间: 周一至周日
      .shadow-bg
      van-notice-bar(left-icon='https://img.yzcdn.cn/1.png', text='闭馆通知:为做好防控疫情发展，抑制病毒传播，本图书馆将闭馆，开馆时间另行通知')
      div
        van-search(@search="search" placeholder="搜索图书")
    .van-tree-select.flex-1
      .p-10p
        .mt-20p.d-flex(v-for="(it, index) in domains" :key="index"  @click="toDetail(it.id)")
          img(class="cover" :src="it.image")
          .ml-10p.df-col-jb.pb-5p.flex-1
            div
              .fs-16 {{it.name}}
              .df-row-ac.flex-wrap
                .mt-10p.bg-tag.px-5p.py-2p.text-center.fs-10.mr-5p
                  span {{it.introduction}}
            .df-row-ac-jb.w-100.mt-5p
              .text-red {{it.location}}
              button.btn-main1(v-if="it.status==='0'" open-type="getUserInfo" @getuserinfo="getUserInfo" lang="zh_CN" type="primary") 扫码借阅
              button.btn-main2(v-else  lang="zh_CN" type="") 已借出

    van-popup(:show="addBorrowFlag", position="center",overlay="false", @close="BorrowClose" safe-area-inset-top="true" custom-style="width: 90%;height: 300px;border-radius: 10px !important;")
      .p-20p.van-border.bg-dark.mt-20p
        .pf-title.text-center {{library.name}}
        .mt-10p.text-red.text-center {{borrow.name}}
        .mt-10p
          div 借阅时间：{{startTime}}
        .mt-10p.df-row-ac-jb
          div 归还时间：{{endTime}}
        .mt-10p.text-center 请在规定时间内归还此书，否则将产生扣费！
        .mt-20p
          van-button(size="large" round custom-class="btn-blue" @click="toConfirm") 确认借阅
    van-toast#van-toast
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'
  import {formatTime, GetDateStr} from '../../utils'
  import Toast from '../../../static/vant/toast/toast'

  export default {
    components: {NavBar},
    data () {
      return {
        addBorrowFlag: false,
        endTime: '',
        library: {},
        items: [],
        domains: [],
        user: {},
        borrow: {},
        secondNav: [],
        thirdNav: [],
        activeId: '1',
        userInfo: {},
        firstCagories: [],
        libraryId: '0',
        categoryId: '0',
        startTime: '',
        isHide: false,
        searchKey: ''
      }
    },
    onShareAppMessage: function onShareAppMessage (object) {
      object.title = this.library.name
      if (this.library.name === '') {
        object.title = 'ElB商铺'
      }
      object.path = '/pages/kind/main?libraryId=' + this.libraryId
      if (this.library.coverUrl.length > 0) {
        object.imageUrl = this.library.coverUrl
      } else {
        object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      }
      return object
    },
    methods: {
      tolibrary () {
        wx.openLocation({
          latitude: 31.2138167200,
          longitude: 121.4511417500,
          scale: 28
        })
      },
      toConfirm () {
        // 更新书本状态并添加到我的借阅
        var params = {
          bookId: this.borrow.id,
          userId: this.user.id,
          libraryId: this.libraryId,
          startTime: this.startTime,
          endTime: this.endTime
        }

        API.mybooks.updatebooks(params).then((res) => {
          this.addBorrowFlag = false
          this.loadData()
          Toast('借阅成功， 请到我的借阅中查看')
        }).catch((res) => {
          this.addBorrowFlag = false
          this.loadData()
          Toast('借阅成功， 请到我的借阅中查看')
        })
      },
      BorrowClose () {
        this.addBorrowFlag = false
      },
      search (param) {
        this.searchKey = param.mp.detail
        this.refreshDishes()
      },
      getUserInfo (e) {
        if (!wx.getStorageSync('user')) {
          loginInfo(e, this, this.updateBooks())
        } else {
          this.user = wx.getStorageSync('user')
          this.updateBooks()
        }
      },
      updateBooks () {
        var that = this
        if (that.user) {
          wx.scanCode({
            success (res) {
              console.log(res.result)
              API.books.get(res.result).then((res) => {
                that.borrow = res
                that.addBorrowFlag = true
                that.endTime = GetDateStr(1)
                that.startTime = formatTime(new Date())
              }).catch((err) => {
                console.log('err', err)
              })
            }
          })
        }
      },
      toShopDetail () {
        wx.navigateTo({
          url: '/pages/shopDetail/main'
        })
      },
      handleCart (itemId) {
        wx.navigateTo({
          url: '/pages/productDetail/main?itemId=' + itemId + '&auto=true'
        })
      },
      onClickNav (index, item) {
        this.activeId = item.id
        this.categoryId = item.id
        // this.loadDataRight(item.id)
        // console.log('loadDataRightloadDataRight', item.id, index)
        this.refreshDishes()
      },
      onClickItem (item) {
        wx.navigateTo({
          url: '/pages/itemList/main?cid=' + item.id + '&title=' + item.name
        })
      },
      refreshDishes () {
        let args = {
          libraryId: this.libraryId,
          categoryId: this.categoryId,
          name: this.searchKey
        }
        API.items.list(args).then(res => {
          console.log('get the items by gived categoryId', res)
          this.items = res.data
        })
      },
      loadData () {
        let filter = {
          libraryId: this.libraryId
        }
        API.books.list(filter).then((res) => {
          this.domains = res.data
          this.refreshDishes()
        }).catch(() => {
        })
      }
    },
    onLoad (options) {
      let _this = this
      if (_this.libraryId === '' || _this.libraryId === '0') {
        if (options.scene) {
          let scene2 = decodeURIComponent(options.scene)
          var str = scene2.split('=')
          wx.setStorageSync('libraryId', str[1])
        } else {
          let scene2 = decodeURIComponent(options.query.scene)
          let str = scene2.split('=')
          if (str.length > 1) {
            wx.setStorageSync('libraryId', str[1])
          }
        }
      }
    },
    mounted () {
      this.items = []
      this.libraryId = wx.getStorageSync('libraryId')

      API.library.get(this.libraryId).then(res => {
        console.log(res)
        this.library = res
        this.library.distanceDisplay = this.library.distance
        if (this.library.distance < 1000) {
          this.library.distanceDisplay = this.library.distance.toFixed(2) + '米'
        } else {
          let dis = this.library.distance / 1000
          this.library.distanceDisplay = dis.toFixed(2) + '公里'
        }
      })
      if (getApp().globalData.activeIndex > -1) {
        this.activeId = getApp().globalData.activeIndex
      } else {
        this.activeId = '1'
      }
      this.loadData()
      getApp().globalData.activeIndex = -1
    }
  }
</script>

<style>
</style>
