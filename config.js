/**
 * 小程序配置文件
 */

//服务端http api 的host http://106.14.61.179:8090/meetCore
const host = 'http://127.0.0.1:8082/meetCore';
const hostManage = 'http://127.0.0.1:8081/meetManage';
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
    //商品列表查询
    goodsListUrl: `${host}/goodsInfo/query`,
  },

  //硬编码的词典
  dictionary: {
    wholeDay: '全天24小时'
  }
};

module.exports = config;