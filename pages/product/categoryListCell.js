// pages/pruduct/categoryListCell.js
const util = require('../../utils/util.js');
const request = require('../../utils/request.js');
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addflag: false,  //判断是否显示搜索框右侧部分
    addimg: '../../images/activity_add.png',
    searchstr: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var CategoryId = options.CategoryId;
    var that = this
    console.log(options.index)
    let url = config.productAllUrl
    let para = {
      "currentPage": 1,
      "showCount": 20
      //"serviceSecondCategoryId": CategoryId,
      //"serviceAreaName": "云南省 玉溪市"
    }
    util.RequestManager(url, para, function (res, fail) {
      console.log(res)
      that.setData({ list: res.data.dataList })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 搜索框右侧 事件
  addhandle() {
    console.log('触发搜索框右侧事件')
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
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
  },
  //清空搜索框
  activity_clear(e) {

    this.setData({
      searchstr: ''
    })
  },


})