import Vue from 'vue'
import App from '@/App'
import WXP from 'minapp-api-promise'
import '@/styles/index.scss' // global css
import MpvueRouterPatch from 'mpvue-router-patch'
import 'weapp-cookie'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
Vue.prototype.$wx = WXP

App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData
