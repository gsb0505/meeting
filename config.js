/**
 * 小程序配置文件
 */

//服务端http api 的host http://106.14.61.179:8090/meetCore
// const host = 'http://127.0.0.1:8082/meetCore';
const host = 'http://106.14.61.179:8090/meetCore';
// const hostManage = 'http://127.0.0.1:8081/meetManage';
const hostManage = 'http://106.14.61.179:8091/meetManage/';
var config = {
  host: host,
  hostManage: hostManage,
  //资源路径
  resource:{
    product: `/resources/product`,
    header: `/resources/head`,
    meetRoom: `/resources/meetRoom`,
  },
  //服务端http api
  service: {
    // 登录接口
    loginUrl: `${host}/user/wxLogin`,

    //modifyPasswordUrl: `${host}/user/updatePassWord`,

    //我的预定
    meetListUrl: `${host}/orderDetail/query`,
    meetDetailListUrl: `${host}/orderDetail/getModel`,

    //会议室查询
    roomListUrl: `${host}/meetRoom/query`,
     //全部会议室查询
    roomAllUrl: `${host}/meetRoom/queryList`,
    roomOrderAddUrl: `${host}/orderDetail/add`,
    roomOrderUpdateUrl: `${host}/orderDetail/modify`,
    //商品列表查询
    goodsListUrl: `${host}/goodsInfo/query`,
    uploadPhotoUrl: `${host}/goodsInfo/transferTo`,
    roomOrderCancelUrl: `${host}/orderDetail/cancel`,
    meetVerifiUrl: `${host}/orderDetail/meetVerifi`,
  },

  //硬编码的词典
  dictionary: {
    wholeDay: '全天24小时'
  }
};

module.exports = config;