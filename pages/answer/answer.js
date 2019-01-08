// pages/answer/answer.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curQuestion: {},
    answerObj: {
      tid: null,
      uid: null,
      content: '',
      type: 'Q',
      pid: null
    },
    curAnswerComment: {},
    answerCommentObj: {
      tid: null,
      uid: null,
      content: '',
      type: 'A',
      pid: null
    },
    contentValue: '',
    answerList: [],
    getAnswerListObj: {
      tid:null,
      pid:null,
      page:1,
      pageSize: 15,
      type: 'Q'
    },
    isOpenKeBoart: false,
    answerPlacholder: '说点什么',
    animationData: '',
    checkAnswerCommentIsopen: false,
    startPageY: null,
    endPageY: null,
    opacityVal: .6,
    winHeight: 0,
    judgeIsDownRefresh:false,
    isScroll: false,
    storeCurAnswerId: null,
    contentHeight: 300
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.params)
    // JSON.parse(options.params).content = decodeURIComponent(JSON.parse(options.params).content)
    this.setData({
      curQuestion: JSON.parse(options.params),
      'curQuestion.content': decodeURIComponent(JSON.parse(options.params).content),
      'curQuestion.createTime': app.timestampToTime(JSON.parse(options.params).createTime),
      'answerObj.tid': JSON.parse(options.params).tid,
      'answerObj.uid': app.globalData.id,
      'answerObj.pid': JSON.parse(options.params).id,
      'getAnswerListObj.tid': JSON.parse(options.params).tid,
      'getAnswerListObj.pid': JSON.parse(options.params).id,
      'answerCommentObj.uid': app.globalData.id
    })
    console.log(this.data.curQuestion)
    wx.nextTick(() => {
      this.getAnswerList()
    })
  },
  // 获取回复列表
  getAnswerList() {
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/getTopicBack`,
      method: 'get',
      data: that.data.getAnswerListObj,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(val) {
        console.log(val)
        if (val.data.lists.length) {
          val.data.lists.forEach(item => {
            item.replyTime = app.timestampToTime(item.replyTime)
            console.log(item.content.length)
            if (item.content.length >= 160) {
              item.judgeTextHeight = true
            } else {
              item.judgeTextHeight = false
            }
          })
          console.log(val.data.lists)
          that.setData({
            answerList: val.data.lists,
            page: that.data.getAnswerListObj.page++
          })
       
        }
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
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  getValue(e) {
    console.log(e)
    console.log(this.data.answerPlacholder)
    if (this.data.answerPlacholder == '说点什么') {
      this.setData({
        'answerObj.content': e.detail.value
      })
    } else {
      this.setData({
        'answerCommentObj.content': e.detail.value
      })
    }
  },
  onAnswerBtn(e) {
    console.log(e)
    if (!this.data.checkAnswerCommentIsopen) {
      console.log(e)
      this.setData({
        isOpenKeBoart: true,
        answerPlacholder: '说点什么'
      })
    }
  },
  // 添加回复
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
    console.log(this.data.answerObj.content)
    console.log(this.data.answerCommentObj.content)
    
    var that = this
    console.log(that.data.answerObj)
    console.log(that.data.answerPlacholder)
    // 添加问题评论
    if (that.data.answerPlacholder == '说点什么') {
      if (!this.data.answerObj.content) {
        wx.showToast({
          title: '内容不能为空',
          icon: 'success',
          duration: 500
        });
        return
      }
      wx.request({
        url: `https://asr.itinga.cn/dialogueCollection/saveTopicBack`,
        method: 'post',
        data: that.data.answerObj,
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'x-uid': app.globalData.id
        },
        success(val) {
          console.log(val)
          if (val.data.ret === 0) {
            that.setData({
              'getAnswerListObj.page': 1
            })
            that.getAnswerList()
            that.setData({
              'contentValue': ''
            })
            wx.showToast({
              title: '回复成功',
              icon: 'success',
              duration: 1000
            });
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
    } else {
    // 添加评论回复
      if (!this.data.answerCommentObj.content) {
        wx.showToast({
          title: '内容不能为空',
          icon: 'success',
          duration: 500
        });
        return
      }
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
            that.getAnswerList()
            // that.getAnswerCommentList()
            that.setData({
              'contentValue': ''
            })
            wx.showToast({
              title: '回复成功',
              icon: 'success',
              duration: 1000
            });
            that.data.answerList.forEach( item => {
              if (item.id === that.data.storeCurAnswerId){
                console.log('当前回复的')
                console.log(item)
                that.setData({
                  'item.replyCount': ++item.replyCount,
                  answerList: that.data.answerList
                })
                // item.replyCount++
              }
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
    }
  },
  // 点击回复 || 查看回复
  clickAnswerBtn(e) {
    console.log(e)
    // 点击回复
    if (e.currentTarget.id == 'answer2') {
      this.setData({
        isOpenKeBoart: true,
        answerPlacholder: '回复' + e.currentTarget.dataset.obj.programUser.nickName,
        'answerCommentObj.tid': e.currentTarget.dataset.obj.bbsTopic.id,
        'answerCommentObj.pid': e.currentTarget.dataset.obj.id,
        storeCurAnswerId: e.currentTarget.dataset.obj.id,
        answerCommentList: [],
      })
      console.log(this.data.answerCommentObj)
    } else {
      console.log(e.currentTarget.dataset.obj)
      e.currentTarget.dataset.obj.content = encodeURIComponent(e.currentTarget.dataset.obj.content)
      e.currentTarget.dataset.obj.bbsTopicContent.content = encodeURIComponent(e.currentTarget.dataset.obj.bbsTopicContent.content)
      var obj = JSON.stringify(e.currentTarget.dataset.obj)
      console.log(obj)
      wx.navigateTo({
        url: '../commentAnswer/commentAnswer?params=' + obj
      })
    }
  },
  // 获取焦点
  bindfocus(e) {
    console.log(e)
    var height = (app.globalData.windowHeight - e.detail.height )
    console.log(height)
    this.setData({
      // winHeight: e.detail.height * 2
    })
  },
  // 失去焦点
  bindblur(e){
    console.log(e)
    this.setData({
      winHeight: 0
    })
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log('到底了')
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    // page = page + 1;
    wx.request({
      url: 'https://asr.itinga.cn/dialogueCollection/getTopicBack',
      method: "GET",
      data: that.data.getAnswerListObj,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.lists.length) {
          that.setData({
            answerList: that.data.answerList.concat(res.data.lists),
            page: that.data.getAnswerListObj.page++
          })
          console.log(res)
          // 隐藏加载框
          wx.hideLoading();
        } else {
          wx.showToast({
            title: '已经到底了',
            icon: 'success',
            duration: 500
          });
        }
      }
    })
  },
  showMoreBtn(e) {
    console.log(e)
    this.data.answerList.forEach(item => {
      if (item.id == e.currentTarget.dataset.obj.id) {
        item.judgeTextHeight = false
      }
    })
  
    this.setData({
      answerList: this.data.answerList
    })
  },
  onScroll(e) {
    console.log(e)
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
    console.log('页面显示')
    this.getAnswerList()
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
  noTouch: function () {
    return;
  }, 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.setData({
    //   judgeIsDownRefresh: true
    // })
    // this.getAnswerList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})