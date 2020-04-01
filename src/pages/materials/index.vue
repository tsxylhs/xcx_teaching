<template lang="pug">
  .w-100
    nav-bar(:title="'学习资料'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100
      ul.last-border-2
        li.pl-20p.py-20p(@click="" v-for="(ord,ins) in domain" :key="ins")
          .df-row-ac-jb.pr-20p
            .df-row-ac
              //.merchant
              .pf-subheadp 成绩编号：{{ord.id}}
          .mt-10p.d-flex.pr-20p.border-bottom.py-10p
            .ml-10p.py-5p.flex-1
              .df-row-jb.pf-subhead
                .pf-subhead 资料名称：{{ord.materialsDesc}}
              .d-flex.fs-12.mt-10p.text-dark
                span 位置:
                span.ml-5p {{ord.materialsUrl}}
              .d-flex.fs-12.mt-10p.text-dark
                .fs-14.mr-10p(style="color:#0066CC" @click="download(ord)") 下载资料
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Data from '@/utils/data'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'
  import Moment from 'moment'

  export default {
    components: {NavBar},
    data () {
      return {
        isLogged: false,
        active: 0,
        data: Data,
        domain: [],
        user: {},
        epOrder: true,
        bind: true
      }
    },
    onShareAppMessage (object) {
      object.title = '在线ELB'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    watch: {},
    methods: {
      download (val) {
        wx.downloadFile({
          url: 'http://localhost:8081/materials/download/' + val.id,
          success: function (res) {
            var filePath = res.tempFilePath
            console.log(res)
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
              },
              fail: function (err) {
                console.log(err)
              }
            })
          }
        })
      },
      savefiles (val) {
        const fileName = val.materialsDesc
        let $this = this
        wx.downloadFile({
          url: 'http://localhost:8081/materials/download/' + val.id,
          success: (res) => {
            var filePath = res.tempFilePath
            let manager = wx.getFileSystemManager()
            // 判断目录是否存在
            manager.access({
              path: `${wx.env.USER_DATA_PATH}/download`,
              success: (res) => {
                // console.log('已存在path对应目录',res)
                // 保存文件之前查看是否存在此文件
                manager.access({
                  path: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                  success (res) {
                    // console.log('已存在此文件', res);
                    return false
                  },
                  // eslint-disable-next-line handle-callback-err
                  fail (err) {
                    console.log('不存在此文件')
                    manager.saveFile({
                      tempFilePath: filePath,
                      filePath: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                      success: (res) => {
                        $this.getLocalFiles(manager, $this)
                      },
                      fail: (err) => {
                        console.log(err)
                      }
                    })
                  }
                })
              },
              fail: () => {
                // console.log(err, '不存在path对应目录')
                // 创建保存文件的目录
                manager.mkdir({
                  dirPath: `${wx.env.USER_DATA_PATH}/download`,
                  recursive: false,
                  success: (res) => {
                    // 将临时文件保存到目录  / download
                    manager.saveFile({
                      tempFilePath: filePath,
                      filePath: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                      success: (res) => {
                        // console.log(res)
                        $this.getLocalFiles(manager, $this)
                      },
                      fail: (err) => {
                        console.log(err)
                      }
                    })
                  },
                  fail: (err) => {
                    console.log(err)
                  }
                })
              }
            })
          },
          fail: (err) => {
            console.log(err, '下载失败')
          }
        })
      },
      toaddnotes () {
        wx.navigateTo({url: '/pages/addNotes/main'})
      },
      toDetail (ord) {
        wx.navigateTo({
          url: '/pages/addNotes/main?notesId=' + ord.id
        })
      },
      checkUser (e) {
        loginInfo(e, this, this.loadNotes)
      },
      loadgrade (options) {
        let user = wx.getStorageSync('user')
        if (user.studentId === 0) {
          return
        }
        var param = {
          conditions: {
            userId: this.user.studentId
          }
        }
        API.materials.list(param).then(res => {
          this.isLogged = true
          if (res.data === undefined || res.data.length <= 0) {
            this.epOrder = true
            console.log('没有')
          } else {
            res.data.forEach(order => {
              if (order.createdAt) {
                order.createdAt = Moment(order.createdAt).format('YYYY-MM-DD HH:mm')
                order.updatedAt = Moment(order.updatedAt).format('YYYY-MM-DD HH:mm')
              }
            })
            this.domain = res.data
            console.log('有笔记')
            this.epOrder = false
          }
        }).catch((err) => {
          console.log('err', err)
        })
      }
    },
    onShow () {
      let user = wx.getStorageSync('user')
      this.user = user
      this.loadgrade()
      if (user) {
        if (user.studentId === 0 || user.studentId === '') {
          this.bind = false
        }
        this.isLogged = true
      }
    }
  }
</script>

<style scoped>
</style>
