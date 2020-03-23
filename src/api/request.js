let Fly = require('flyio/dist/npm/wx')
let fly = new Fly()

fly.config.timeout = 5000
fly.config.baseURL = process.env.baseURI
fly.interceptors.response.use(
  (response) => {
    return response.data
  }
)

// const white = [
//   '/v1/user',
//   '/v1/login',
//   '/v1/items',
//   '/v1/skus',
//   '/v1/saleAttrs',
//   '/v1/categories',
//   '/v1/mer_shop',
//   '/v1/notes',
//   '/v1/orders',
//   '/v1/cart',
//   '/v1/headerImages']

fly.interceptors.request.use((request, promise) => {
  request.headers['agent'] = 'mp'
  return request
  // var url = request.url
  // var str = url.split('/')
  // var requesturl = '/' + str[1] + '/' + str[2]
  // if (white.indexOf(requesturl) > -1) {
  //   return request
  // }
  // if (request.url.indexOf('/v1/item') > -1) {
  //   return request
  // }
  // if (request.url.indexOf('/v1') === -1) {
  // return request
  // }
  // 首先检查微信的登陆态 start
  // wx.checkSession({
  //   success () {
  //     console.log(request.url)
  //     // 成功之后检查系统的登陆态
  //     console.log('session_key 未过期，并且在本生命周期一直有效')
  //     let user = wx.getStorageSync('user')
  //     if (user) {
  //       return request
  //     }
  //     // 跳转登录页面
  //     wx.redirectTo({
  //       url: '/pages/login/main'
  //     })
  //     return promise.reject()
  //   },
  //   fail () {
  //     console.log('session_key 已经失效，需要重新执行登录流程')
  //     wx.redirectTo({
  //       url: '/pages/login/main'
  //     })
  //   }
  // })
  // 首先检查微信的登陆态 end
  // return request
})

export default fly
