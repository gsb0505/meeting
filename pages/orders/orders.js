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
    Left:'1%',
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
    
  },
  onLoad:function(){
    // getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
      this.setData({
        colLeft:'#be9d6d',
        borLeft:'3px solid #be9d6d'
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