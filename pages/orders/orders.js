// pages/orders/orders.js
const request = require('../../utils/request.js')
const Parser = require('../../utils/dom-parser.js')
const dom = require('../../utils/dom.js')
const entities = require('../../utils/entities.js')
const sax = require('../../utils/sax.js')
var app = getApp()
const page_size = 5;
Page({
  data:{
    Left:'5%',
    hidden: false,
    prompt: true,
    ordersTitle: '暂无预定',
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    totalResult:0,
    seach:{
      creator:"",
      currentPage:"",
      pageSize:""
    },
    room:[{
      date:'2017-02-07 10:00-12:00',
      floor:'4F',
      roomNo:'4022',
      complate:true
    },{
      date:'2017-02-07 14:00-16:00',
      floor:'1F',
      roomNo:'1011',
      complate:true
    },{
      date:'2017-02-05 14:00-16:00',
      floor:'17F',
      roomNo:'1736',
      complate:false
    }],
    seat:[{
      date:'2017-02-04 10:00-12:00',
      floor:'1F',
      roomNo:'B',
      seatNo:'A1',
      complate:true
    },{
      date:'2017-02-07 09:30-10:45',
      floor:'5F',
      roomNo:'A',
      seatNo:'B1',
      complate:true
    },{
      date:'2017-02-08 14:00-16:00',
      floor:'1F',
      roomNo:'A',
      seatNo:'A11',
      complate:false
    },{
      date:'2017-02-09 10:00-11:30',
      floor:'3F',
      roomNo:'F',
      seatNo:'A13',
      complate:false
    }]

  },
  onLoad:function(){
    getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
      this.setData({
          colLeft:'#b02923',
          borLeft:'3px solid #b02923'
      });
  },
  onShow: function(){
   
    this.setData({
      pageNumber: 1,
      room: []
    }),
      this.queryData()
  },

  queryData: function () {
    const that = this
    let userId = app.globalData.userId;
    request.meetList({creator: userId, currentPage: this.data.pageNumber, pageSize: page_size }, function (res) {
      debugger
      var XMLParser = new Parser.DOMParser()
      var curData = XMLParser.parseFromString(res.data)
      // let curData = JSON.parse(res.data)
      //debugger
      let arr = curData.getElementsByTagName('orderDetails').childNodes;
      that.setData({
        tables: arr,
        // totalPage: arr.totalPage,
        // totalResult: curData.totalResult,
        stopLoadMoreTiem: false
      })
    })
  },
})