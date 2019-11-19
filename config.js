/**
 * 小程序配置文件
 */

//服务端http api 的host
const host = 'http://106.14.61.179:8090/meetCore';
var config = {
  host: host,
  //服务端http api
  service: {
    // 登录接口
    loginUrl: `${host}/user/wxLogin`,

    //modifyPasswordUrl: `${host}/user/updatePassWord`,

    //我的预定
    meetListUrl: `${host}/orderDetail/query`
  },

  //硬编码的词典
  dictionary: {
    wholeDay: '全天24小时'
  }
};

module.exports = config;