// pages/new/new.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inuptPlaceHolder: '当前类别',
    tId: null,
    autoFocus: true,
    judgeActive: false,
    bbsTopicContent: {
      uid: null,
      tid: null,
      content: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.tId)
    console.log(options.typeName)
    this.setData({
      inuptPlaceHolder: '当前类别:' + options.typeName + '!!! 请输入有关的问题呦',
      'bbsTopicContent.tid': Number(options.tId),
      'bbsTopicContent.uid': app.globalData.id
    })
    console.log(app.globalData.id)
  },
  watchValue(event) {
    if (event.detail.value) {
      this.setData({
        judgeActive: true,
        'bbsTopicContent.content': event.detail.value
      })
    } else {
      this.setData({
        judgeActive: false,
        'bbsTopicContent.content': event.detail.value
      })
    }
  },
  confirmNewBtn() {
    if (!app.globalData.id) {
      wx.showModal({
        title: '提示',
        content: '还未登录，去登录吧',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/home/home',
            }) 
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (!this.data.bbsTopicContent.content) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'success',
        duration: 500
      });
      return
    }
    console.log(this.data.bbsTopicContent)
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/saveTopicContent`,
      method: 'post',
      data: that.data.bbsTopicContent,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'x-uid': app.globalData.id
      },
      success(val) {
        console.log(val)
        if (val.data.ret === 0) {
          wx.showToast({
            title: '新建成功',
            icon: 'success',
            duration: 1000
          });
          
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/test/test',
            })
          }.bind(this), 200)
        } else if (val.data.ret === -4) {
          wx.showModal({
            title: '提示',
            content: val.data.msg,
            success(res) {
              if (res.confirm) {
               
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})