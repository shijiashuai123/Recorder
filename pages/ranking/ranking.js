// pages/ranking/ranking.js
const app = getApp()
const getCity = require('../../utils/city.js')
var sliderWidth = 110;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [],
    // tabs: ["今日", "全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    judgeIsDownRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  tabClick(e) {
    console.log(this.data.activeIndex)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.getAudioList(this.data.activeIndex)
  },
  getAudioList(type) {
    var that = this
    type = Number(type) ? 'true' : 'false'
    console.log(type)
    that.setData({
      rankList: []
    })
    wx.request({
      url: `${app.globalData.url}/dialogueCollection/getUserPointsRank?page=1&pageSize=15`,
      method: 'get',
      header: { 'content-type': 'application/json', 'x-uid': app.globalData.id},
      success(res) {
        console.log(res)
        if (res.data.ret === 0) {
          if (res.statusCode == 200) {
            // 城市的拼音转为汉字
            res.data.lists.forEach( item => {
              item.programUser.city = getCity(item.programUser.city)
              console.log(item)
            })
            that.setData({
              rankList: res.data.lists
            })
            // 判断是否下载刷新
            if (that.data.judgeIsDownRefresh) {
              // 隐藏导航栏加载框
              wx.hideNavigationBarLoading();
              // 停止下拉动作
              wx.stopPullDownRefresh();
              that.setData({
                judgeIsDownRefresh: false
              })
            }
          } else {
          }
        } else if (res.data.ret === -4) {
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
      error(error) {
        console.log(error)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAudioList(this.data.activeIndex)
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
    // 显示顶部刷新图标
    // wx.showNavigationBarLoading();
    this.setData({
      judgeIsDownRefresh: true
    })
    console.log('下拉开始')
    this.getAudioList(this.data.activeIndex)
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