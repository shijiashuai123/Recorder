// pages/home/home.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    curUesrIntegral: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUserInfo: function (e) {
    console.log(e)

    if (!e.detail.userInfo) {
      return
    }
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    })
    var paramObj = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      js_code: ''
    }
    var userInfoObj = {
      nickName: e.detail.userInfo.nickName ? e.detail.userInfo.nickName : '',
      avatarUrl: e.detail.userInfo.avatarUrl ? e.detail.userInfo.avatarUrl : '',
      city: e.detail.userInfo.city ? e.detail.userInfo.city : 1,
      unionId: '',
      gender: e.detail.userInfo.gender ? e.detail.userInfo.gender : '',
      country: e.detail.userInfo.country ? e.detail.userInfo.country : '',
      province: e.detail.userInfo.province ? e.detail.userInfo.province : ''
    }
    this.loginFun(paramObj, userInfoObj)
  }, 
  loginFun(obj, userInfoObj) {
    // 用户授权之后来登录
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        obj.js_code = res.code
        console.log(obj)
        console.log(userInfoObj)
        // console.log(res)
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
            app.globalData.id = val.data.msg.id
            that.getCurUserIntegral(val.data.msg.id)
            // app.globalData.id = val.data.msg.id
          },
          error(err) {
            console.log(err)
          }
        })
      }
    })
  },
  bindViewTap: function() {
    if (!app.globalData.id) {
      wx.showModal({
        content: '请登录',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return
    }
    wx.navigateTo({
      url: '../myqaList/myqaList',
    })
  },
  toMyanswerPage() {
    if (!app.globalData.id) {
      wx.showModal({
        content: '请登录',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return
    }
    wx.navigateTo({
      url: '../myCommentList/myCommentList',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res)
              this.setData({
                userInfo: res.userInfo
              })
              // 更新全局变量的用户信息
              app.globalData.userInfo = res.userInfo
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
  },
  getCurUserIntegral(id) {
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/getPointsByUser?uid=${id}`,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'x-uid': app.globalData.id
      },
      success(val) {
        console.log(val)
        that.setData({
          curUesrIntegral: val.data.msg
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 右上角分享
  onShareAppMessage: function (ops) {
    console.log(ops)
    // if (ops.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(ops.target)
    // }
    return {
      title: '小程序',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log(res)
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})