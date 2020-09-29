const fs = require('fs')

const paramFileName = 'initProjectParam.json';

// 读取本地参数文件
function readMyData(fd) {
  // 读取文件内容
  var data = fs.readFileSync(paramFileName, {encoding: 'utf-8',flag: 'w+'});

  // 转成json
  let paramString = data.toString();
  let jsonParam = JSON.parse(paramString);
  if (jsonParam) {
    // 判断是否有选择初始化的数据库文件
    // 判断是否有设置数据库文件的缓存路径

  }

}
    // 如果没有本地参数文件, 告知渲染进程是第一次安装该软件, 开始走参数设置流程
          // 参数设置流程走完后, 渲染进程将参数发送给主进程, 主进程创建本地的参数文件
    // 如果有本地参数文件, 并且各个字段也都有, 那么告知渲染进程, 已经设置过参数了

