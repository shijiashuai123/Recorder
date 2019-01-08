//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 判断是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res)
              // 更新全局变量的用户信息
              this.globalData.userInfo = res.userInfo
              var paramObj = {
                encryptedData: res.encryptedData,
                iv: res.iv,
                js_code: ''
              }
              var userInfoObj = {
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                city: res.userInfo.city,
                unionId: '',
                gender: res.userInfo.gender,
                country: res.userInfo.country,
                province: res.userInfo.province
              }
              this.loginFun(paramObj, userInfoObj)
            }
          })
          console.log('已经授权')
        } else {
          console.log('还未授权')
          // this.getUserInfo()
        }
      }
    })
    // 获取问答的类别接口
    var that = this
    wx.request({
      url: `https://asr.itinga.cn//dialogueCollection/getTopic`,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(val) {
        console.log(val)
        that.globalData.qaTypeList = val.data.lists
        
        val.data.lists.sort((a, b) => {
          return b.contentCount - a.contentCount
        })
        that.globalData.hotqaTypeList = val.data.lists.slice(0,5)
        // if (that.qaTypeListCallback) {
        //   that.qaTypeListCallback(val.data.lists)
        // }
      },
      fail(err) {
        console.log(err)
      }
    })

    // 获取用户信息
    // wx.getSetting({
      // success: res => {
        // if (!res.authSetting['scope.record']) {
          // wx.authorize({
          //   scope: 'scope.record',
          //   success() {
          //     console.log('获取录音功能')
          //   }
          // })
        // }
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        // wx.getUserInfo({
        //   // withCredentials: true,
        //   success: res => {
        //     console.log(res)
        //     // 可以将 res 发送给后台解码出 unionId
        //     this.globalData.userInfo = res.userInfo

        //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //     // 所以此处加入 callback 以防止这种情况
        //     if (this.userInfoReadyCallback) {
        //       this.userInfoReadyCallback(res)
        //     }
        //   }
        // })
      // }
    // })
    // 获取窗口高度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.globalData.windowHeight = res.windowHeight
      }
    })
  },
  loginFun(obj, userInfoObj) {
    // 用户授权之后来登录
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        obj.js_code = res.code
        wx.request({
          url: `https://asr.itinga.cn/collectAudio/login`,
          method: 'post',
          data: {
            encryptedData: obj.encryptedData,
            iv: obj.iv,
            js_code: obj.js_code,
            userInfoObj: JSON.stringify(userInfoObj)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(val) {
            console.log(val.data)
            that.globalData.id = val.data.msg.id
          },
          error(err) {
            console.log(err)
          }
        })
      }
    })
  },
  // 时间戳转换
  timestampToTime(timestamp) {
    var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    return Y + M + D
  },
  onShow(obj) {
    console.log(obj)
    if (obj.shareTicket) {
      wx.getShareInfo({
        shareTicket: obj.shareTickets,
        success(res) {
          console.log(res)
        }
      })
    }
  },
  globalData: {
    windowHeight: null,
    userInfo: null,
    url: 'https://asr.itinga.cn',
    id: '',
    openid: '',
    session_key: '',
    qaTypeList: [],
    hotqaTypeList: []
  }
})