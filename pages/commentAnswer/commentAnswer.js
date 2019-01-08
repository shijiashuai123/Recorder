// pages/commentAnswer/commentAnswer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curAnswerObj: {},
    answerCommentList: [],
    getAnswerCommentListObj: {
      tid: null,
      pid: null,
      page: 1,
      pageSize: 15,
      type: 'A'
    },
    answerCommentObj: {
      tid: null,
      uid: null,
      content: '',
      type: 'A',
      pid: null
    },
    answerPlacholder: '说点什么',
    winHeight:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(JSON.parse(options.params))
    this.setData({
      curAnswerObj: JSON.parse(options.params),
      'curAnswerObj.content': decodeURIComponent(JSON.parse(options.params).content),
      'curAnswerObj.bbsTopicContent.content': decodeURIComponent(JSON.parse(options.params).bbsTopicContent.content),
      'getAnswerCommentListObj.tid': JSON.parse(options.params).tid,
      'getAnswerCommentListObj.pid': JSON.parse(options.params).id,
      'answerCommentObj.tid': JSON.parse(options.params).tid,
      'answerCommentObj.uid': app.globalData.id,
      'answerCommentObj.pid': JSON.parse(options.params).id
    })
    wx.nextTick(() => {
      this.getAnswerCommentList()
    })
  },
  // 获取评论回复列表
  getAnswerCommentList() {
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/getTopicBack`,
      method: 'get',
      data: that.data.getAnswerCommentListObj,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(val) {
        console.log(val)
        if (val.data.lists.length) {
          that.setData({
            answerCommentList: that.data.answerCommentList.concat(val.data.lists),
            page: that.data.getAnswerCommentListObj.page++
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
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 获取焦点
  bindfocus(e) {
    console.log(e)
    this.setData({
      winHeight: e.detail.height * 2
    })
  },
  getValue(e) {
    console.log(e)
    this.setData({
      'answerCommentObj.content': e.detail.value
    })
  },
  // 失去焦点
  bindblur(e) {
    console.log(e)
    this.setData({
      winHeight: 0
    })
  },
  // 添加评论
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
    if (!this.data.answerCommentObj.content) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'success',
        duration: 500
      });
      return
    }
    console.log(this.data.answerCommentObj)
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/saveTopicBack`,
      method: 'post',
      data: that.data.answerCommentObj,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'x-uid': app.globalData.id
      },
      success(val) {
        console.log(val)
        if (val.data.ret === 0) {
          console.log(app.globalData.userInfo)
          var obj = {
            programUser: {
              headImg: app.globalData.userInfo.avatarUrl,
              nickName: app.globalData.userInfo.nickName
            },
            content: that.data.answerCommentObj.content
          }
          console.log(obj)
          that.setData({
            answerCommentList: that.data.answerCommentList.unshift(obj),
            answerCommentList: that.data.answerCommentList
          })
          console.log(that.data.answerCommentList)
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            'answerCommentObj.content': ''
          })
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
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    this.getAnswerCommentList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})