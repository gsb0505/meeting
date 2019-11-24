const util = require('./util.js')
const config = require('../config.js')
/**
 * 把input表单的值绑定到page.data上
 */
module.exports = {
  inputgetName(e) {
    // debugger
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    if (name.indexOf('.')) {
      let nameList = name.split('.')
      if (this.data[nameList[0]]) {
        nameMap[nameList[0]] = this.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      if (nameList.length == 2) {
        nameMap[nameList[0]][nameList[1]] = e.detail.value
      }
      else if (nameList.length == 3) {
        if (!nameMap[nameList[0]][nameList[1]]) {
          nameMap[nameList[0]][nameList[1]] = {}
        }
        nameMap[nameList[0]][nameList[1]][nameList[2]] = e.detail.value
      }
    } else {
      nameMap[name] = e.detail.value
    }
    this.setData(nameMap)
  },
}