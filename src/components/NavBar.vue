<template lang="pug">
  .comp-navbar
    .placeholder-bar(:style="{height: navBarHeight + 'px'}")
    <!-- 导航栏主体 -->
    .navbar(:style="{height: navBarHeight + 'px',backgroundColor:navBackgroundColor}")
      <!-- 状态栏 -->
      .nav-statusbar(:style="{height: statusBarHeight + 'px'}")
      <!-- 标题栏 -->
      .nav-titlebar(:style="{height: titleBarHeight + 'px' }")
        <!-- home及后退键 -->
        .bar-options.ml-10p
          .opt.opt-back(v-if="backVisible" @click="backClick(flag)")
            .back
          .opt.opt-back(v-if="backWhite" @click="backClick()")
            .back-w
          <!--.line-nav(v-if="backVisible && homePath || (backWhite && homeWhite)")-->
          .mx-10p(style="display: block;width: 2px;height: 15px;background-color: #e3e7ef;" v-if="backVisible && homePath || (backWhite && homeWhite)")
          .opt.opt-home(v-if="homePath" @click="homeClick()")
            .home-nav
          .opt.opt-home(v-if="homeWhite" @click="homeWhiteClick()")
            .home-w
        <!-- 标题 -->
        .bar-title(:style="{color: titleColor}") {{title}}
</template>

<script>
  export default {
    name: 'NavBar',
    props: {
      // 导航栏背景色
      navBackgroundColor: {
        default: '#ffffff'
      },
      // 标题文字
      title: {
        required: false,
        default: ''
      },
      // 是否显示后退按钮
      backVisible: {
        required: false,
        default: false
      },
      // 是否显示后退按钮
      flag: {
        required: false,
        default: false
      },
      // 是否显示白色后退按钮
      backWhite: {
        required: false,
        default: false
      },
      // home按钮的路径
      homePath: {
        required: false,
        default: ''
      },
      // home白色按钮的路径
      homeWhite: {
        required: false,
        default: ''
      },
      titleColor: {
        default: '#000000'
      }
    },
    data () {
      return {
        statusBarHeight: '', // 状态栏高度
        titleBarHeight: '', // 标题栏高度
        navBarHeight: '', // 导航栏总高度
        platform: '',
        model: '',
        brand: '',
        system: ''
      }
    },
    beforeMount () {
      const self = this
      wx.getSystemInfo({
        success (system) {
          console.log(`system:`, system)
          self.statusBarHeight = system.statusBarHeight
          self.platform = system.platform

          let platformReg = /ios/i
          if (platformReg.test(system.platform)) {
            self.titleBarHeight = 44
          } else {
            self.titleBarHeight = 48
          }

          self.navBarHeight = self.statusBarHeight + self.titleBarHeight
        }
      })
    },
    methods: {
      backClick (flag) {
        if (flag) {
          wx.navigateTo({
            url: '/pages/login/main'
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
        // if (getCurrentPages().length === 1) {
        //   // 打开分享卡片无法回退
        //   wx.redirectTo({
        //     url: this.homePath
        //   })
        // } else {
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // }
      },
      homeClick () {
        wx.switchTab({
          url: this.homePath
        })
      },
      homeWhiteClick () {
        wx.switchTab({
          url: this.homeWhite
        })
      }
    },
    mounted () {
      // console.log(`this.backVisible:`, this.backVisible, this.homePath)
    }
  }
</script>
