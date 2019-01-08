var app = getApp();
Page({
  data: {
    winHeight: "100%",//窗口高度
    currentTab: 0, //预设当前项的值
    preIndex: null,
    changeTimeCount: 1,
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234
    }],
    qaClassList: app.globalData.qaTypeList,
    hotqaClassList: [],
    // qaClassList: [
    //   {title: '测试1'},
    //   {title: '测试2'},
    //   {title: '测试3'},
    //   {title: '测试4'},
    //   {title: '测试5'}
    // ],
    lists: [],
    isActiveMore: false,
    moreBtnPic: './img/more.png',
    animationData: '',
    tId: null,
    typeName: '',
    stopUserQuSwiper: true
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
      lists: [],
      stopUserQuSwiper: false
    });
    this.getCurTypeId()
    // this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log(e)
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  // 点击替换当前类型标题
  changeCurType(e) {
    // 判断当前类别里面有没有要替换的
    for(var i = 0; i < this.data.hotqaClassList.length; i++) {
      if (this.data.hotqaClassList[i].id == e.currentTarget.dataset.obj.id) {
        this.setData({
          currentTab: i
        })
        this.moreBtn()
        return
      }
    }
    console.log(e.currentTarget.dataset.obj)
    console.log(this.data.currentTab)
    console.log(this.data.hotqaClassList)
    this.data.hotqaClassList.splice(this.data.currentTab, 1, e.currentTarget.dataset.obj)

    this.setData({
      hotqaClassList: this.data.hotqaClassList,
      tId: e.currentTarget.dataset.obj.id,
      typeName: e.currentTarget.dataset.obj.title
    })
    // 修改全局的热门类别，新建之后跳转防止更新
    app.globalData.hotqaTypeList = this.data.hotqaClassList
    this.getCurTypeQList(e.currentTarget.dataset.obj.id)
    this.moreBtn()
  },
  changeEnd(detail) {
    console.log(detail)
    if (detail.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0 && this.data.currentTab > 1)  {
        this.setData({ currentTab: this.data.preIndex });
        console.log(this.data.preIndex)
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: this.data.currentTab});
        console.log(this.data.preIndex)
      }
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    console.log(this.data.currentTab)
    // this.setData({
    //   scrollLeft: 65 * this.data.currentTab
    // })
    // if (this.data.currentTab > 4) {
    //   this.setData({
    //     scrollLeft: 300
    //   })
    // } else {
    //   this.setData({
    //     scrollLeft: 0
    //   })
    // }
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/getTopic`,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(val) {
        console.log(val)
        that.setData({
          qaClassList: val.data.lists
        })
        val.data.lists.sort((a, b) => {
          return b.contentCount - a.contentCount
        })
        that.setData({
          hotqaClassList: val.data.lists.slice(0, 5)
        })
        that.getCurTypeId()
      },
      fail(err) {
        console.log(err)
      }
    })
    //  高度自适应
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log(res)
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth;
    //     var calc = clientHeight * rpxR - 180;
    //     console.log(calc)
    //     that.setData({
    //       winHeight: calc
    //     });
    //   }
    // });
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
  moreBtn() {
    if (!this.data.isActiveMore) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
        delay: 0
      })
      this.animationData = animation
      animation.translateY(0).step()
      this.setData({
        moreBtnPic: './img/moreA.png',
        isActiveMore: true,
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.translateY('100%').step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    } else {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
        delay: 0
      })
      this.animationData = animation
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          isActiveMore: false,
          moreBtnPic: './img/more.png'
        })
      }.bind(this), 200)
    }
  },
  onShow: function () {
  },
  getCurTypeId() {
    console.log(this.data.hotqaClassList)
    this.data.hotqaClassList.forEach( (item, index) => {
      if (index  === this.data.currentTab) {
        this.setData({
          tId: item.id,
          typeName: item.title
        })
        console.log(item)
        this.getCurTypeQList(item.id)
        return
      }
    })
  },
  getCurTypeQList(tid) {
    // 获取问题列表
    var that = this
    wx.request({
      url: `https://asr.itinga.cn/dialogueCollection/getTopicContent?tid=${tid}&page=1&pageSize=20`,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(val) {
        console.log(val)
        that.setData({
          lists: val.data.lists
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  newTypeQ(e) {
    console.log(e)
    wx.navigateTo({
      url: '../new/new?tId=' + this.data.tId + '&typeName=' + this.data.typeName,
    })
  },
  //转发
  shareBtn() {
    wx.showShareMenu({
      withShareTicket: true,
      success(e) {
        console.log(e)
      },
      error(err) {
        console.log(err)
      }
    })
  },
  // 右上角分享
  onShareAppMessage: function (ops) {
    console.log(ops)
    wx.showShareMenu({
      withShareTicket: true,
    })
    return {
      title: '转发',
      path:'pages/test/test',
      success: res => {
        console.log(res)
      },
      fail: function(err) {
        console.log(err)
      }
    }
  },
  footerTap: app.footerTap
})