// pages/myqaList/myqaList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    uid: null,
    page: 1,
    pageSize: 15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: app.globalData.id
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
    this.getQuestionList()
  },
  getQuestionList() {
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/getTopicContentByUser?uid=${that.data.uid}&page=${that.data.page}&pageSize=20`,
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'x-uid': app.globalData.id
      },
      success(val) {
        console.log(val)
        if (val.data.ret === 0) {
          if (val.data.lists.length) {
            that.setData({
              lists: that.data.lists.concat(val.data.lists),
              page: ++that.data.page
            })
          } else {
            wx.showToast({
              title: '已经到底了',
              icon: 'success',
              duration: 500
            });
          }
          // 隐藏加载框
          wx.hideLoading();
        } else if (res.data.ret === -4){
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
  bindViewTap: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.obj)
    e.currentTarget.dataset.obj.content = encodeURIComponent(e.currentTarget.dataset.obj.content)
    var obj = JSON.stringify(e.currentTarget.dataset.obj)
    console.log(obj)
    wx.navigateTo({
      url: '../answer/answer?params=' + obj,
    })
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
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    this.getQuestionList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})