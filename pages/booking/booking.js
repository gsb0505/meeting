// pages/booking/booking.js
const app = getApp();
const util = require('../../utils/util.js');
const request = require('../../utils/request.js')
const X2JS = require('../../utils/we-x2js.js')
const bindinput = require('../../utils/bindinput.js')
Page(Object.assign({
  data:{
    chosens: false,
    options: false,
    daytime: ['06:00', '06:30', '07:00', '07:30','08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
    roomArray: [],
    roomIndex:0,
    endTime: 0,
    startTime: 0,
    num: 0,
    regionDataSeat:[],
    regionDataRoom:[],
    userChosen: '',
    isSubmit:false,
    checkSubmit:false,
    table: {
      id:'',
      meetDate:'',
      meetStartTime: '06:00',
      meetEndTime: '06:00',
      meetRoomID:'',
      meetName:'',
      specialdemand:'',
      emailNotification:''
    }
  },
  onLoad:function(options){
    // getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
   
    this.setData({
      'table.meetDate':util.formatTime(new Date),
      'table.id': options.id
    });
    this.queryRoomData();
    if (options.id){
       console.log("dd=" + options.id)
      let id = options.id;
      this.queryData(id);
    }
    
  },
  //会议数据查询方法
  queryData: function (id) {
    let ids = id
    const that = this
    //调用会议查询接口
    request.meetDetailList({
      id: ids
    }, function (res) {
      // debugger
      //接口返回
      var x2js = new X2JS();

      let orderDetails = x2js.xml2js(res.data)
      // debugger
      let orderDetail = orderDetails == null || orderDetails == '' || typeof (orderDetails) == 'undefined' ? [] : orderDetails.orderDetail;
      //给页面赋值
      that.setData({
        table: orderDetail
      })
    })
  },

  //会议室查询方法
  queryRoomData: function () {
    const that = this
    // debugger
    //调用会议查询接口
    request.roomAllList( function (res) {
      //接口返回
      var x2js = new X2JS();
      let details = x2js.xml2js(res.data)
      let detailList = details == null || details == '' || typeof (details) == 'undefined' ? [] : details.meetRooms.meetRoom;
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
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
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
  bindPickerOrderEnd: function (e) {
    // 结束时间
    this.setData({
      'table.meetEndTime': this.data.daytime[e.detail.value],
      endTime: e.detail.value
    });
  },
  bindChooseRoom: function(e){
    console.log(e.detail.value + "----" + this.data.roomArray[e.detail.value].id)
    // 会议室
    this.setData({
      'table.meetRoomID': this.data.roomArray[e.detail.value].id,
       roomIndex: e.detail.value
    });
  },
  formSubmit: function(e){
    const that = this
    if (that.checkSubmit== true) {
      return 
    }else{
      that.setData({
        checkSubmit:true
      })
    }
      debugger
    //调用会议查询接口
    let x2js = new X2JS();
    let xmlStr = x2js.js2dom(that.data.table);
    debugger
    request.roomOrderAdd(that.data.table,function (res) {
      //接口返回
      debugger
    
      let details = x2js.xml2js(res.data)

    })
  },
  getScanning: function () {
    app.getScanning()
  },
},bindinput))