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
      proSum: 0,
      proPrice: 0,
      // 使用data数据对象设置样式名  
      minusStatus: 'disabled',
      table: {
        id: 0,
        meetDate: '',
        meetStartTime: '06:00',
        meetEndTime: '06:00',
        meetRoomID: '',
        meetName: '',
        specialdemand: '',
        emailNotification: '',
        goodsDetailList: [],
      },
      goodsList: [],  //商品列表存储
      prompt: '',
      goodsTitle: '',
      totalPage: '',
      totalResult: '',
      index: 0,
      goodsResource: config.hostManage,
      modiOperation:false, //false 添加 true 修改
      numberList:[],
    },
    onLoad: function(options) {
      // getApp().auth();
      // 页面初始化 options为页面跳转所带来的参数
      this.queryGoodData();
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
        //接口返回
        var x2js = new X2JS();
        let orderDetails = x2js.xml2js(res.data)
        let orderDetail = typeof(orderDetails) == 'undefined' ? [] : orderDetails.orderDetail;
        orderDetail.meetDate = util.formatTime(new Date(orderDetail.meetDate));
        orderDetail.createTime = new Date(orderDetail.createTime).toISOString();
        orderDetail.updateTime = new Date().toISOString();
        console.log(orderDetail);
        that.setData({
          table: orderDetail,
          goodsDetailList: typeof (orderDetail.goodsDetailList) == 'undefined' ? [] : orderDetail.goodsDetailList,
          modiOperation: true,
        })
        //汇总金额
        that.getProPriceSum();
        that.goodNumCountList();
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
          roomIndex: roomIndex,
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

        let detailList = details == null || details == '' || typeof (details) == 'undefined' ? [] : details.orderDetails;
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
      var meetName = that.data.table.meetName;
      let glideNo = that.data.table.glideNo;
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
      var curdate = util.formatTime(d);
      var curhhmm = util.formatTime3(d);
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
      if (meetStartTime.toString() == meetEndTime.toString()){
        wx.showToast({
          title: '开始时间和结束时间不能相同',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        return;
      }
      if (meetName == undefined || meetName==''){
        wx.showToast({
          title: '会议主题不能为空',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        return;
      }
      
      var x2js = new X2JS();
      //调用会议查询接口
      request.meetList({
        'meetDate': meetDate,
        'meetStartTime': meetStartTime,
        'meetEndTime': meetEndTime,
        'meetRoomID': meetRoomID[0]
      }, function (res) {
        //接口返回
        let detailList =[];
        if (res.data!=''){
          let details = x2js.xml2js(res.data)
          let orderDetails = typeof (details) == 'undefined' ? undefined : details.orderDetails;
          detailList = typeof (orderDetails) == 'undefined' ? [] : details.orderDetails.orderDetail;
        }
        if (detailList !=undefined && detailList.length != 0) {
          debugger
          if (glideNo == null || glideNo == undefined ) {
            let flag = false;
            for (let i = 0; i < detailList.length; i++) {
              let detail = detailList[i];
              if (detail.errCode[0] != 3) {
                flag = true;
                break;
              } else {
                flag = false;
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
            for (let i = 0; i < detailList.length; i++) {
              let detail = detailList[i];
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
        //调用会议查询接口
        let xmlStr = x2js.js2dom(that.data.table);
        console.log(JSON.stringify(that.data.table));
        if (that.data.modiOperation == false) {
          request.roomOrderAdd(that.data.table, function (res) {
            debugger
            if (res.data==true) {
              wx.showModal({
                title: '预约成功!',
                content: '会议预约成功',
                confirmText: '知道了',
                showCancel: false,
                success: function (res) {
                  wx.reLaunch({
                    url: '../orders/orders',
                  })

                }
              })
            }else{
              wx.showModal({
                title: '预约失败',
                content: '会议预约失败',
                confirmText: '知道了',
                showCancel: false,
                success: function () {
                  wx.reLaunch({
                    url: '../orders/orders',
                  })
                }
              })
            }
          })
        } else {
          request.roomOrderUpdate(that.data.table, function (res) {
            //接口返回
            debugger
            if (res.data == true) {
              wx.showToast({
                title: '预约修改成功!',
                icon: 'success',
                duration: 1000,
                mask: true,
                success:function(){
                  wx.reLaunch({
                    delta: 1
                  })
                }
              })
            } else {
              wx.reLaunch({
                title: '预约修改失败!',
                icon: 'error',
                duration: 1000,
                mask: true
              })
            }
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
    },
    //搜索回调
    endsearchList(e) {
      console.log('查询数据')
      this.setData({
        goodsList: [],
      });
       this.queryGoodData(this.data.searchstr);

    },
    // 取消搜索
    cancelsearch() {
      this.setData({
        searchstr: '',
        goodsList: [],
      });
       this.queryGoodData(this.data.searchstr);
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
        this.queryGoodData(that.data.info);
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
    queryGoodData: function(info) {
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
        // debugger
        console.log(JSON.stringify(goods));
        let goodsList = goods == null || goods == '' || typeof(goods) == 'undefined' ? [] : goods.goodsInfoes.goodsInfo;
        goodsList = typeof (goodsList) == 'undefined' ? [] : goodsList;
        // // debugger      
        let totalPage = goodsList.length==0 ? 1 : goodsList[0].pageCount[0].totalPage;
        let totalResult = goodsList.length == 0 ? 0 : goodsList[0].pageCount[0].totalResult;
        //给页面赋值
        that.setData({
          goodsList: that.data.goodsList.concat(goodsList),
          prompt: typeof(goodsList) == 'undefined' ? false : true,
          goodsTitle: goodsList == null ? '暂无预商品信息' : "",
          totalPage: totalPage,
          totalResult: totalResult,
          stopLoadMoreTiem: false
        })
      })
    },
    /* 点击减号 */
    bindMinus: function(e) {
      let goodsDetailList = this.data.table.goodsDetailList;
      let id = e.currentTarget.dataset.id;
      let index;
      let goodsDetail;
      debugger
      for (let i = 0; i < goodsDetailList.length; i++) {
        goodsDetail = goodsDetailList[i];
        if (goodsDetail.ginfoId[0] == id) {
          index = i;
          break;
        }
      }
      if( index != null && index != undefined){
        goodsDetail = goodsDetailList[index];
        if (goodsDetail.num > 0) {
          goodsDetail.num--
            //更新商品明细
          this.updateGoodDetail(-1, goodsDetail.num, id);
        }

        // 只有大于一件的时候，才能normal状态，否则disable状态  
        let minusStatus = (goodsDetailList[index].num) <= 0 ? 'disabled' : 'normal';
        goodsDetailList[index].minusStatus = minusStatus;
        this.getProPriceSum();
      }
    },
    /* 点击加号 */
    bindPlus: function(e) {
      let that = this;
      let id = e.currentTarget.dataset.id;
      let product = this.getProById(id);
      let goodsDetailList = that.data.goodsDetailList == undefined ? [] : that.data.goodsDetailList;
      let index;
      debugger
        // // 现订单中查找商品  
      for (let i = 0; i < goodsDetailList.length; i++) {
        if (goodsDetailList[i].ginfoId[0] == id) {
          index = i;
          break;
        }
      }
      let num = 1;
      if (index != undefined) { 
        num = parseInt(goodsDetailList[index].num) +1 ;
      }

      //更新商品明细
      this.updateGoodDetail(1, num, id);
      this.getProPriceSum();
    
    },
    getProById: function(id) {
      let productlList = this.data.goodsList;
      for (let i = 0; i < productlList.length; i++) {
        if (productlList[i].id == id[0]) {
          return productlList[i];
        }
      }
    },
    getProPriceSum:function() {
      let goodsDetailList = this.data.table.goodsDetailList;
      let proPrice = 0;
      let proSum = 0;
      if (goodsDetailList != null){
        console.log("goodsDetailList=>" + JSON.stringify(goodsDetailList));
        for (let i = 0; i < goodsDetailList.length; i++) {
          let amount = goodsDetailList[i].amount;
          proSum += parseInt(goodsDetailList[i].num);
          if (this.isArray(amount)){
            proPrice += parseFloat(goodsDetailList[i].amount[0]);
          }else{
            proPrice += parseFloat(goodsDetailList[i].amount);
          }
        }
      }
      let searchTitle = '预订数量:' + proSum + "件.总计:" + proPrice + '元';
      this.setData({
        'proPrice': proPrice,
        'proSum': proSum,
        'searchTitle': searchTitle
      });
    },
    updateGoodDetail: function(opt, pnumber, proId) {
      let datalList = this.data.table.goodsDetailList == undefined ? [] : this.data.table.goodsDetailList;
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
            datalList[i].num++;
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
        'table.goodsDetailList': datalList,
      });
      this.goodNumCountList();
    },

  //商品计数、计算总价、显示到页面
  goodNumCountList: function () {
    debugger
    let goodsDetailList = this.data.table.goodsDetailList;
    let numberList = [];
    let goodsList = this.data.goodsList;
    let proSum = 0;
    
    for (let i = 0; i < goodsList.length; i++) {
      numberList.push({
        "id": goodsList[i].id,
        "num": 0
      });
    }
    for (let i = 0; i < goodsList.length; i++) {
      let goodsInfo = goodsList[i];
      let goodsIndex;
      for (let j = 0; j < goodsDetailList.length;j++){
        let goodsDetail = goodsDetailList[j];
        if (goodsDetail.ginfoId[0] == goodsInfo.id[0]){
            goodsIndex =j;
            break;
        }
      }
      if (goodsIndex != undefined ){
        numberList[i].num = goodsDetailList[goodsIndex].num;
      }
    }
    
    this.setData({
      numberList: numberList
    });
  },
    
  
    // --------------------  商品列表事件 end  ------------------------
    isArray: function (o) {
      return Object.prototype.toString.call(o) == '[object Array]';
    },
  },
  bindinput))