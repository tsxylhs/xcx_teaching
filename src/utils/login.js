import API from '@/api/api'

export function loginInfo (e, t, reback) {
  if (e.mp.detail.userInfo) {
    console.log(e.mp.detail.userInfo)
    t.userInfo = e.mp.detail.userInfo
    t.isHide = false
    doLogin(t, reback)
  } else {
  }
}

function doLogin (t, reback) {
  let that = t
  // 查看是否授权
  wx.getSetting({
    success (res) {
      if (res.authSetting['scope.userInfo']) {
        that.isHide = false
        wx.getUserInfo({
          success (res) {
            that.userInfo = res.userInfo
            that.userInfo.encryptedData = res.encryptedData
            that.userInfo.errMsg = res.errMsg
            that.userInfo.iv = res.iv
            that.userInfo.rowData = res.rawData
            that.userInfo.signature = res.signature
            console.log('UserInfo', res.userInfo)
            wx.login({
              success: function (res) {
                if (res.code) {
                  wx.setStorageSync('code', res.code)
                  that.userInfo.code = res.code
                  console.log('携带 userinfo 登录', res)
                  API.login(that.userInfo).then((res) => {
                    that.user = res
                    wx.setStorageSync('user', res)
                    reback()
                  }).catch(() => {
                  })
                } else {
                  console.log('获取用户登录信息失败！')
                }
              }
            })
          },
          fail (err) {
            console.log(err)
          }
        })
      } else {
        // 用户没有授权
        that.isHide = true
      }
    }
  })
}

export function CallPhone (Message) {
  wx.makePhoneCall({
    phoneNumber: Message.phone,
    success: Message.callSuccess,
    fail: Message.callFail,
    complete: Message.completeSuccess
  }
  )
}

export function wxLocation (address, getshops) {
  wx.chooseLocation({
    success: function (res) {
      address = res.address
      wx.setStorageSync('address', res.address)
      getshops(res.address)
    },
    fail: function () {
      wx.getSetting({
        success: function (res) {
          let statu = res.authSetting
          if (!statu['scope.userLocation']) {
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则将无法检索附近的商店',
              success: function (tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data.authSetting['scope.userLocation'] === true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        // 授权成功之后，再调用chooseLocation选择地方
                        wx.chooseLocation({
                          success: function (res) {
                            wx.setStorageSync('address', res.address)
                            getshops(res.address)
                          }
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '调用授权窗口失败',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }
  })
}
export function getPhoneNumber (e, reback) {
  console.log(e)
  let encryptedDataStr = e.target.encryptedData
  let iv = e.target.iv
  let user = wx.getStorageSync('user')
  let openId = user.openid
  let sessionKey = user.session_key
  console.log(user)
  if (e.target.errMsg === 'getPhoneNumber:ok') {
    // 判断登录是否过期
    wx.checkSession({
      success: function (e) {
        decodePhone(sessionKey, encryptedDataStr, iv, openId, reback)
      },
      fail: function () {
      }
    })
  } else {
    console.log('拒接了授权')
  }
}
export function decodePhone (sessionKey, encryptedDataStr, iv, openId, reback) {
  let data = {
    encryptedData: encryptedDataStr,
    sessionKey: sessionKey,
    iv: iv,
    openId: openId
  }
  API.open.decodePhone(data).then((res) => {
    console.log('当前手机号', res)
    wx.setStorageSync('phoneNumber', res.phoneNumber)
    let user = wx.getStorageSync('user')
    user.mobile = res.phoneNumber
    wx.setStorageSync('user', user)
    reback()
  }).catch((res) => {
    console.log('err')
  })
}
