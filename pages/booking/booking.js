// pages/booking/booking.js
const app = getApp();
const util = require('../../utils/util.js');
const request = require('../../utils/request.js')
const X2JS = require('../../utils/we-x2js.js')
const bindinput = require('../../utils/bindinput.js')
var config = require('../../config.js')
Page(Object.assign({
    data: {
      chosens: false,
      options: false,
      daytime: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
      roomArray: [],
      roomIndex: 0,
      endTime: 0,
      startTime: 0,
      num: 0,
      regionDataSeat: [],
      regionDataRoom: [],
      searchTitle: '点击搜索商品...',
      userChosen: '',
      isSubmit: false,
      checkSubmit: false,
      hiddenPlan: true,
      addflag: true, //判断是否显示搜索框右侧部分
      addimg: '../../images/activity_add.png',
      searchstr: '',
      page_size: 5,
      // 当前页
      pageNumber: 1,
      // 总页数
      totalPage: 1,
      totalResult: 0,
      orderDetailList: [],
      numberList: [],
      proSum: 0,
      proPrice: 0,
      // 使用data数据对象设置样式名  
      minusStatus: 'disabled',
      table: {
        id: '',
        meetDate: '',
        meetStartTime: '06:00',
        meetEndTime: '06:00',
        meetRoomID: '',
        meetName: '',
        specialdemand: '',
        emailNotification: '',
        goodsDetailList: [],
      },
      goodsList: [],
      prompt: '',
      goodsTitle: '',
      totalPage: '',
      totalResult: '',
      index: 0,
      goodsResource: config.hostManage
    },
    onLoad: function(options) {
      // getApp().auth();
      // 页面初始化 options为页面跳转所带来的参数

      this.setData({
        'table.meetDate': util.formatTime(new Date),
        'table.id': options.id
      });
      this.queryRoomData();
      if (options.id) {
        console.log("dd=" + options.id)
        let id = options.id;
        this.queryData(id);
      }

    },
    //会议数据查询方法
    queryData: function(id) {
      let ids = id
      const that = this
      //调用会议查询接口
      request.meetDetailList({
        id: ids
      }, function(res) {
        // debugger
        //接口返回
        var x2js = new X2JS();

        let orderDetails = x2js.xml2js(res.data)
        // debugger
        let orderDetail = orderDetails == null || orderDetails == '' || typeof(orderDetails) == 'undefined' ? [] : orderDetails.orderDetail;
        //给页面赋值
        that.setData({
          table: orderDetail
        })
      })
    },

    //会议室查询方法
    queryRoomData: function() {
      const that = this
      // debugger
      //调用会议查询接口
      request.roomAllList(function(res) {
        //接口返回
        var x2js = new X2JS();
        let details = x2js.xml2js(res.data)
        let detailList = details == null || details == '' || typeof(details) == 'undefined' ? [] : details.meetRooms.meetRoom;
        //给页面赋值
        that.setData({
          roomArray: detailList,
          'table.meetRoomID': detailList[0].id,
        })
        var roomIndex = 0
        for (var i = 0; i < detailList.length; i++) {
          let detail = detailList[i];
          if (detail.id == that.data.roomIndex) {
            roomIndex = i
            break
          }
        }
        that.setData({
          roomIndex: roomIndex
        })
      })
    },
    //我的预约查询方法
    queryOrderDetailData: function(param) {
      const that = this
      // debugger
      //调用会议查询接口
      request.meetList(param, function(res) {
        //接口返回
        var x2js = new X2JS();
        let details = x2js.xml2js(res.data)
        let detailList = details == null || details == '' || typeof(details) == 'undefined' ? [] : details.meetRooms.meetRoom;
        return detailList;
      })
    },
    onReady: function() {
      // 页面渲染完成
    },
    onShow: function() {
      // 页面显示

    },
    onHide: function() {
      // 页面隐藏
    },
    onUnload: function() {
      // 页面关闭
    },
    bindDateChange: function(e) {
      // 日期
      this.setData({
        'table.meetDate': e.detail.value
      });
    },
    bindPickerOrderStrart: function(e) {
      // 开始暗
      this.setData({
        'table.meetStartTime': this.data.daytime[e.detail.value],
        startTime: e.detail.value
      });
    },
    bindPickerOrderEnd: function(e) {
      // 结束时间
      this.setData({
        'table.meetEndTime': this.data.daytime[e.detail.value],
        endTime: e.detail.value
      });
    },
    bindChooseRoom: function(e) {
      console.log(e.detail.value + "----" + this.data.roomArray[e.detail.value].id)
      // 会议室
      this.setData({
        'table.meetRoomID': this.data.roomArray[e.detail.value].id[0],
        roomIndex: e.detail.value
      });
    },
    addzero:  function (v) {
      if(v < 10) return '0' + v;
      return v.toString();
    },
    formSubmit: function(e) {
      const that = this
      var meetDate = that.data.table.meetDate;
      var meetStartTime = that.data.table.meetStartTime;
      var meetEndTime = that.data.table.meetEndTime;
      var meetRoomID = that.data.table.meetRoomID;
      if (!meetDate || !meetStartTime || !meetEndTime || !meetRoomID) {
        wx.showToast({
          title: '请输入预约信息.',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        return;
      }

      var d = new Date();
      var year = d.getFullYear(); //年
      var month = d.getMonth() + 1; //月
      var day = d.getDate(); //日

      var hh = d.getHours(); //时
      var mm = d.getMinutes(); //分
      var curdate = year + '-' + this.addzero(month) + '-' + this.addzero(day);
      var curhhmm = this.addzero(hh) + ':' + this.addzero(mm);
      if (meetDate.toString() == curdate.toString()) {
        if (meetStartTime.toString() < curhhmm.toString()) {
          wx.showToast({
            title: '请选择大于当前的日期',
            icon: 'loading',
            duration: 1000,
            mask: true
          })
          return;
        }
      } else if (meetDate < curdate) {
        wx.showToast({
          title: '请选择大于当前的日期',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        return;
      }

      let param = {
        'meetDate': meetDate,
        'meetStartTime': meetStartTime,
        'meetEndTime': meetEndTime,
        'meetRoomID': meetRoomID[0]
      };

      let odList = this.queryOrderDetailData(param);
      console.log(JSON.stringify(odList));

      if (odList.length != 0) {
        // out.print(false);
        if (glideNo == null) {
          for (let i = 0; i < odList.length; i++) {
            let detail = odList[i];
            if (detail.getErrCode() == 3) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          }
          if (flag == true) {
            wx.showToast({
              title: '该时间已被预约!',
              icon: 'loading',
              duration: 1000,
              mask: true
            })
            return;
          }

        } else {
          for (let i = 0; i < odList.length; i++) {
            let detail = odList[i];
            if (detail.getGlideNo().equals(glideNo) && detail.getErrCode() != 3) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          }
          if (flag == false) {
            wx.showToast({
              title: '该时间已被预约!',
              icon: 'loading',
              duration: 1000,
              mask: true
            })
            return;
          }

        }
      }


      if (that.checkSubmit == true) {
        return
      } else {
        that.setData({
          checkSubmit: true
        })
      }
      debugger
      //调用会议查询接口
      let x2js = new X2JS();
      let xmlStr = x2js.js2dom(that.data.table);
      console.log(JSON.stringify(that.data.table));
      request.roomOrderAdd(that.data.table, function(res) {
        //接口返回
        debugger
        let details = x2js.xml2js(res.data)
        console.log(JSON.stringify(res.data));
        if (details) {
          wx.showToast({
            title: '预约成功!',
            icon: 'success',
            duration: 1000,
            mask: true
          })
        }
      })
    },
    getScanning: function() {
      app.getScanning()
    },
    searchFocus: function(e) {
      console.log("聚焦。。");
    },
    openSearchFocus: function(e) {
      this.setData({
        hiddenPlan: !this.data.hiddenPlan
      });
      //加载全部会议数据
      this.queryData(null);
    },
    // --------------------  商品列表事件 begin  ------------------------
    activity_clear: function() {
      this.triggerEvent("activity_clear");
    },
    // 搜索框右侧 事件
    addhandle() {
      //console.log('触发搜索框右侧事件')
      this.setData({
        hiddenPlan: !this.data.hiddenPlan
      })
    },
    //搜索框输入时触发
    searchList(ev) {
      let e = ev.detail;
      this.setData({
        searchstr: e.detail.value
      })
      //this.queryData(searchstr);
    },
    //搜索回调
    endsearchList(e) {
      console.log('查询数据')
      this.setData({
        goodsList: [],
      });
      this.queryData(this.data.searchstr);

    },
    // 取消搜索
    cancelsearch() {
      this.setData({
        searchstr: '',
        goodsList: [],
      });

      this.queryData(this.data.searchstr);
    },
    //清空搜索框
    activity_clear(e) {
      this.setData({
        searchstr: ''
      })
    },
    /**
     * 滚动条加载
     */
    lower: function() {
      var that = this;
      // debugger
      if (that.data.stopLoadMoreTiem) {
        return;
      }
      // 当前页+1
      let pageNumber = that.data.pageNumber + 1;
      let errCode = that.data.errCode;

      that.setData({
        pageNumber: pageNumber,
        stopLoadMoreTiem: false
      })

      if (pageNumber <= that.data.totalPage) {
        wx.showLoading({
          title: '玩命加载中',
        })
        this.queryData("");
        wx.hideLoading();
      } else {
        wx.showLoading({
          title: '已到最后一页',
        })
        setTimeout(() => {
          wx.hideLoading();
          return
        }, 1000)
      }

    },
    //商品数据查询方法
    queryData: function(info) {
      const that = this;
      //获取userid公共变量
      let userId = app.globalData.userId;
      let page_size = that.data.page_size;
      // debugger
      //调用会议查询接口
      request.goodsList({
        creator: userId,
        status: "1",
        goodsName: info,
        pageCount: {
          currentPage: this.data.pageNumber,
          showCount: page_size
        }
      }, function(res) {
        //接口返回
        var x2js = new X2JS();
        let goods = x2js.xml2js(res.data);
        console.log(JSON.stringify(goods));
        let goodsList = goods == null || goods == '' || typeof(goods) == 'undefined' ? [] : goods.goodsInfoes.goodsInfo;
        // // debugger      
        let totalPage = goodsList == null ? 1 : goodsList[0].pageCount[0].totalPage;
        let totalResult = goodsList == null ? 0 : goodsList[0].pageCount[0].totalResult;

        let numberList = that.data.numberList;
        for (let i = 0; i < goodsList.length; i++) {
          let id = goodsList[i].id;
          let numb = numberList[i];
          if (numb == null || numb == '' || typeof(numb) == 'undefined') {
            numberList.push({
              "id": id,
              "num": 0
            });
          }
        }
        //给页面赋值
        that.setData({
          goodsList: that.data.goodsList.concat(goodsList),
          prompt: typeof(goodsList) == 'undefined' ? false : true,
          goodsTitle: goodsList == null ? '暂无预商品信息' : "",
          totalPage: totalPage,
          totalResult: totalResult,
          stopLoadMoreTiem: false,
          numberList: numberList,
        })
      })
    },
    /* 点击减号 */
    bindMinus: function(e) {
      let pnumber = this.data.numberList;
      let proSum = this.data.proSum;
      let id = e.currentTarget.dataset.id;
      let index;
      for (let i = 0; i < pnumber.length; i++) {
        if (pnumber[i] && pnumber[i].id[0] == id) {
          index = i;
          break;
        }
      }
      if (pnumber[index].num > 0) {
        pnumber[index].num--
          // 如果大于0时，才可以减
          proSum--
          //更新商品明细
          this.updateGoodDetail(-1, pnumber[index].num, id);
      }

      // 只有大于一件的时候，才能normal状态，否则disable状态  
      let minusStatus = (pnumber[index].num) <= 0 ? 'disabled' : 'normal';
      pnumber[index].minusStatus = minusStatus;

      let searchTitle = '预订数量:' + proSum + "件.总计:" + this.getProPriceSum();
      // 将数值与状态写回  
      this.setData({
        proSum: proSum,
        numberList: pnumber,
        searchTitle: searchTitle,
      });
    },
    /* 点击加号 */
    bindPlus: function(e) {
      let id = e.currentTarget.dataset.id;
      let pnumber = this.data.numberList;
      let proSum = this.data.proSum;
      let index;
      // 数量+1  
      for (let i = 0; i < pnumber.length; i++) {
        if (pnumber[i] && pnumber[i].id[0] == id) {
          index = i;
          break;
        }
      }
      proSum++;
      pnumber[index].num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      let minusStatus = pnumber[index].num < 0 ? 'disabled' : 'normal';
      pnumber[index].minusStatus = minusStatus;

      //更新商品明细
      let datalList = this.updateGoodDetail(1, pnumber[index].num, id);
      let searchTitle = '预订数量:' + proSum + "件.总计:" + this.getProPriceSum();

      console.log(JSON.stringify(this.data.table.goodsDetailList));
      // 将数值与状态写回  
      this.setData({
        proSum: proSum,
        numberList: pnumber,
        searchTitle: searchTitle,
      });
    },
    /* 输入框事件 */
    bindManual: function(e) {
      var pnumber = this.data.numberList;
      var id = e.currentTarget.dataset.id;
      var proCount = this.data.proCount;

      //修改订单列表
      //updateGoodDetail(index, pnumber, );

      // 将数值与状态写回  
      // this.setData({
      //   pnumber: pnumber
      // });

    },
    getProById: function(id) {
      let productlList = this.data.goodsList;
      for (let i = 0; i < productlList.length; i++) {
        if (productlList[i].id == id[0]) {
          return productlList[i];
        }
      }
    },
    getProPriceSum() {
      let numberList = this.data.table.goodsDetailList;
      var proPrice = 0;
      for (let i = 0; i < numberList.length; i++) {
        proPrice += numberList[i].amount;
      }
      this.setData({
        'proPrice': proPrice
      });
      return proPrice;
    },
    updateGoodDetail: function(opt, pnumber, proId) {
      let datalList = this.data.table.goodsDetailList;
      let productlList = this.data.goodsList;
      let product = this.getProById(proId);

      //移除指定商品id，商品的数量
      if (opt == -1) {
        for (let i = 0; i < datalList.length; i++) {
          if (datalList[i].ginfoId == proId[0]) {
            datalList[i].num--
              datalList[i].amount = parseFloat((pnumber * (datalList[i].price)).toFixed(2));
            if (datalList[i].num <= 0)
              datalList.splice(i);
            break;
          }
        }
      }
      if (opt == 1) {
        let exit = false;
        for (let i = 0; i < datalList.length; i++) {
          if (datalList[i].ginfoId == proId[0]) {
            datalList[i].num++
              datalList[i].amount = parseFloat((pnumber * (datalList[i].price)).toFixed(2));
            exit = true;
            break;
          }
        }

        //添加商品信息到订单列表
        if (!exit) {
          let detail = {
            'ginfoId': product.id[0],
            'goodsName': product.goodsName[0],
            'num': pnumber,
            'price': product.price[0],
            'storeCode': product.storeCode[0],
            'typeCode': product.typeCode[0],
            'userID': app.globalData.userId,
            'amount': parseFloat((pnumber * (product.price[0])).toFixed(2))
          };
          datalList.push(detail);
        }
      }
      this.setData({
        'table.goodsDetailList': datalList
      });
    }

    // --------------------  商品列表事件 end  ------------------------

  },
  bindinput))