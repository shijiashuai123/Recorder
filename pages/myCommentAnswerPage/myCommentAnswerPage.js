// pages/myCommentAnswerPage/myCommentAnswerPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bbsTopicContent: {},
    commentUser: {},
    commnetAnserList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.params))
    console.log(decodeURIComponent(JSON.parse(options.params).content))
    this.setData({
      bbsTopicContent: JSON.parse(options.params).bbsTopicContent,
      commentUser: JSON.parse(options.params).programUser,
      'commentUser.content': decodeURIComponent(JSON.parse(options.params).content)
    })
    console.log(JSON.parse(options.params).replyCount)
    if (JSON.parse(options.params).replyCount) {
      var getAnswerCommentListObj= {
        tid: JSON.parse(options.params).tid,
        pid: JSON.parse(options.params).id,
        page: 1,
        pageSize: 20,
        type: 'A'
      }
      var that = this
      wx.request({
        url: `https://asr.itinga.cn/dialogueCollection/getTopicBack`,
        method: 'get',
        data: getAnswerCommentListObj,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(val) {
          console.log(val)
          that.setData({
            commnetAnserList: val.data.lists
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    } else {
      console.log('没有回复评论的')
    }
  },
  toQuestionPage(e) {
    if (e.currentTarget.id == 'questionP') {
      wx.navigateTo({
        url: '../answer/answer?params=' + JSON.stringify(this.data.bbsTopicContent)
      })
    }
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