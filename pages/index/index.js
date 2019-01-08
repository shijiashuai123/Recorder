//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
// const audioDom = wx.createAudioContext('myAudio')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    options: {
      duration: 5000, //指定录音的时长
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 48000, //编码码率
      format: 'mp3' //音频格式
    },
    audioSrc: '',
    paramsObj: {
      title: '你好豆丁',
      format: 'mp3',
      gender: '1',
      openId: null
    },
    judgeCurMotion: false,
    result: {
      title: '',
      content: ''
    },
    chooseSize: false,
    animationData: {},
    operateArray: [
      {
        message: '录音说明：长按“长按录音”按钮开始，读出框中的内容。松开按钮，会提示录音结果。'
      }
    ],
    loading: false,
    manChecked: true,
    womanChecked: false,
    judgeIslongTauch: false,
    timer: {},
    judgeIsUploadAudio: false,
    audioDuration: null,
    recorderCount: '',
    userId: null,
    hasShowRedPack: false,
    recorderText: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    // this.data.recorderManager = wx.getRecorderManager()
    recorderManager.onStop(res => {
      if (this.data.judgeIsUploadAudio) {
        clearTimeout(this.data.timer)
        // var tempFilePath = res.tempFilePath
        // console.log(tempFilePath)
        this.setData({
          audioSrc: res.tempFilePath,
          audioDuration: res.duration
        })
        wx.nextTick(() => {
          this.data.timer = setTimeout(() => {
            this.upload()
          }, 300)
        })
        // 录音结束 关闭动画
        this.setData({
          judgeCurMotion: false
        })
        //判断录音长度
        var title = '时间太短'
        if (this.data.judgeIslongTauch) {
          title = '录音结束'
        } else {
          title = '时间太短'
        }
        // 显示录音结果
        wx.showToast({
          title: title,
          icon: 'success'
        })
      }
      // recorderManager.stop();
    })
    // 判断是否授权
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log('已经授权')
    //       this.setData({
    //         recorderText: '长按录音'
    //       })
    //       wx.getUserInfo({
    //         withCredentials: true,
    //         success: res => {
    //           console.log(res)
    //           // 更新全局变量的用户信息
    //           app.globalData.userInfo = res.userInfo
    //           var paramObj = {
    //             encryptedData: res.encryptedData,
    //             iv: res.iv,
    //             js_code: ''
    //           }
    //           var userInfoObj = {
    //             nickName: res.userInfo.nickName,
    //             avatarUrl: res.userInfo.avatarUrl,
    //             city: res.userInfo.city,
    //             unionId: '',
    //             gender: res.userInfo.gender,
    //             country: res.userInfo.country,
    //             province: res.userInfo.province
    //           }
    //           this.loginFun(paramObj, userInfoObj)
    //         }
    //       })
    //     } else {
    //       console.log('还未授权')
    //       this.setData({
    //         recorderText: '点击授权'
    //       })
    //       // this.getUserInfo()
    //     }
    //   }
    // })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function() {
  },
  onShow:function() {
    // 判断是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权')
          // 隐藏授权按钮
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
          this.setData({
            recorderText: '长按录音'
          })
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res)
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
        } else {
          console.log('还未授权')
          this.setData({
            recorderText: '点击授权'
          })
          // this.getUserInfo()
        }
      }
    })
  },
  getUserInfo: function(e) {
    withCredentials: true,
    console.log(e)
    if (!e.detail.userInfo) {
      return
    }
    // 授权成功
    this.setData({
      recorderText: '长按录音'
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    // console.log(app.globalData)
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
      gender: e.detail.userInfo.gender ? e.detail.userInfo.gender: '',
      country: e.detail.userInfo.country ? e.detail.userInfo.country : '',
      province: e.detail.userInfo.province ? e.detail.userInfo.province : ''
    }
    this.loginFun(paramObj, userInfoObj)
    // 上传参数
    // var paramsObj = {
    //   id: app.globalData.id,
    //   openId: app.globalData.openid,
    //   unionId: app.globalData.unionId,
    //   nickName: app.globalData.userInfo.nickName,
    //   gender: app.globalData.userInfo.gender == 1 ? '男' : '女',
    //   headImg: app.globalData.userInfo.avatarUrl,
    //   country: app.globalData.userInfo.country,
    //   province: app.globalData.userInfo.province,
    //   city: app.globalData.userInfo.city
    // }
    // console.log(paramsObj)
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
            that.getUserRecorderNum(val.data.msg.id)
            app.globalData.id = val.data.msg.id
            that.setData({
              userId: val.data.msg.id,
              'paramsObj.openId': val.data.msg.openid
            })
          },
          error(err) {
            console.log(err)
          }
        })
      }
    })
  },
  getUserRecorderNum(id) {
    id = id || this.data.userId
    // 获取用户录音次数
    console.log(id)
    var that = this
    wx.request({
      url: `${app.globalData.url}/collectAudio/getSuccessTimes?id=${id}`,
      method: 'get',
      header: { 'content-type': 'application/json' },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.send) {
            // that.setData({
            //   hasShowRedPack: true
            // })
          } else {
            that.setData({
              recorderCount: res.data
            })
          }
        } else {
          //获取录音次数失败
        }
      },
      error(error) {
        console.log(error)
      }
    })
  },
  selectedValue(e) {
    // console.log(e)
    // this.setData({
    //   'paramsObj.title': e.detail.value
    // })
  },
  start() {
    recorderManager.start(this.data.options)
  },
  stop() {
    this.setData({
      judgeIsUploadAudio: true
    })
    recorderManager.stop();
  },
  play() {
      this.setData({
        judgeIsUploadAudio: false
      })
    // this.innerAudioContext.pause()
    // 播放的时候判断不上传录音
      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.onError((res) => {
      })
      this.innerAudioContext.src = this.data.audioSrc
      recorderManager.start()
      this.innerAudioContext.play()
      // this.innerAudioContext.pause()
      wx.nextTick(() => {
        recorderManager.stop()
      })
      // innerAudioContext.src = this.data.audioSrc
  },
  funplay() {
    console.log('开始播放')
  },
  funended() {
    console.log('播放结束')
  },
  touchStart() {
    console.log('开始')
    recorderManager.stop();
    this.setData({
      judgeIslongTauch: false
    })
    // console.log(this.data.paramsObj.title)
    // if (!this.data.paramsObj.title) {
    //   this.setData({
    //     'result.title': '提示',
    //     'result.content': '请填写要录音的内容'
    //   })
    //   this.createModal(this.data.result)
    //   return
    // } else {
    //   console.log('触摸开始')
    //   this.setData({
    //     judgeCurMotion: true
    //   })
    //   wx.showToast({
    //     title: '正在录音',
    //     icon: 'success'
    //   })
    //   this.start()
    // }
  },
  touchEnd() {
    if (!this.data.paramsObj.title) {
      return
    } else {
      console.log('触摸结束')
      this.stop()
      // this.setData({
      //   judgeCurMotion: false
      // })
      // var title = '时间太短'
      // if (this.data.judgeIslongTauch) {
      //   title = '录音结束'
      // } else {
      //   title = '时间太短'
      // }
      // wx.showToast({
      //   title: title,
      //   icon: 'success'
      // })
    }
  },
  tap() {
    if (!this.data.paramsObj.title) {
      return
    } else {
      // console.log('长触摸')
      // wx.showToast({
      //   title: '时间太短',
      //   icon: 'success'
      // })
    }
  },
  longTouch() {
    if (!this.data.paramsObj.title) {
      this.setData({
        'result.title': '提示',
        'result.content': '请填写要录音的内容'
      })
      this.createModal(this.data.result)
      return
    } else {
      console.log('触摸开始')
      this.setData({
        judgeCurMotion: true,
        judgeIslongTauch: true
      })
      wx.showToast({
        title: '正在录音',
        icon: 'success'
      })
      this.start()
    }
    this.data.timer = setTimeout(() => {
      this.stop()
    }, 4700)
  },
  touchcancelFun() {
    console.log('异常弹窗')
    this.setData({
      judgeCurMotion: false
    })
  },
  upload() {
    this.setData({
      loading: true
    })
    var that = this
    var urls = `${app.globalData.url}/collectAudio/getAudio`;
    var filePaths = this.data.audioSrc
    console.log('urls:' + urls)
    console.log('filePaths:' + filePaths)
    console.log(that.data.paramsObj)
    wx.uploadFile({
      url: urls,
      filePath: filePaths,
      name: 'audioData',
      formData: this.data.paramsObj,
      header: {
        'content-type': 'multipart/form-data',
        'accept': 'application/json'
      },
      success: function(res) {
        console.log('返回结果', res)
        let datas = JSON.parse(res.data)
        var status = res.statusCode
        if (status == 200) {
          var ret = datas.ret
          var msg = datas.msg
          if (ret == 0) {
            that.setData({
              'result.title': '录制成功',
              'result.content': msg
            })
            that.createModal(that.data.result, datas.send)
            clearTimeout(that.data.timer)
            // 弹出红包
            // if (datas.send) {
            //   that.setData({
            //     hasShowRedPack: true
            //   })
            // }
            that.getUserRecorderNum()
          } else {
            that.setData({
              'result.title': '录制失败',
              'result.content': msg
            })
            that.createModal(that.data.result)
          }
        } else {
          that.setData({
            'result.title': '录制失败',
            'result.content': datas.message
          })
          that.createModal(that.data.result)
        }
      },
      fail: function(res) {
        console.log(res)
        that.setData({
          'result.title': '录制失败',
          'result.content': '远程连接失败,请检查网络并重试'
        })
        that.createModal(that.data.result)
      }
    });
  },
  createModal(data, judge) {
    var that = this
    console.log('是否能发红包', judge)
    that.setData({
      loading: false
    })
    wx.showModal({
      title: data.title,
      content: data.content,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (judge) {
            // that.setData({
            //   hasShowRedPack: true
            // })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
          if (judge) {
            // that.setData({
            //   hasShowRedPack: true
            // })
          }
        }
      }
    })
  },
  showOperate: function(e) {
    console.log('显示操作文档')
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    console.log(animation)
    that.animation.translateY(400).step()
    that.setData({
      chooseSize: true,
      animationData: that.animation.export()
    })
    console.log(that.data.animationData)
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: that.animation.export()
      })
    }, 200)
  },
  hideModal: function(e) {
    console.log(e)
    if (e.target.id == 'maskLayer') {
      var that = this
      var animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease-end'
      })
      that.animation = animation
      that.animation.translateY(400).step()
      that.setData({
        animationData: that.animation.export()
      })
      setTimeout(function() {
        animation.translateY(0).step
        that.setData({
          animationData: that.animation.export(),
          chooseSize: false
        })
      }, 100)
    }
  },
  radioChange: function(e) {
    console.log(e)
    if (e.detail.value == '2') {
      this.setData({
        womanChecked: true,
        manChecked: false,
        'paramsObj.gender': '2'
      })
    } else {
      this.setData({
        manChecked: true,
        womanChecked: false,
        'paramsObj.gender': '1'
      })
    }
  },
  offShareAppMessage: function(e) {
    console.log(e)
  },
  // 长按实现二维码
  previewImage: function (e) {
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  // 关闭二维码
  closeQrcode(e) {
    console.log(e)
    if (e.target.id == 'closeQr') {
      this.setData({
        hasShowRedPack: false
      })
    }
  }
})