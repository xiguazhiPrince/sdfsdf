const fs = require('fs');
const path = require('path')

const {ipcMain, dialog, app} = require('electron')

let {initSql} = require('../assets/utils/sqljsUtil')

const paramFileName = 'initProjectParam.json';
let isNeedInit = false;

let db;

// 读取本地参数文件
function readMyData() {
  console.log('加载initProject.js');
  // 读取文件内容
  let data;
  try {
    data = fs.readFileSync(paramFileName, {encoding: 'utf-8',flag: 'r'});
  }catch (e) {
    isNeedInit = true
  }

  // 如果有参数
  if (data) {
    let paramString = data.toString();
    // 判断是否有设置数据库文件的缓存路径
    let cachePath = JSON.parse(paramString).cachePath;
    // 如果没有设置缓存路径
    if (!cachePath) {
      // 如果没有本地参数文件, 告知渲染进程是第一次安装该软件, 开始走参数设置流程
      isNeedInit = true
    }
  }else{ // 如果没参数
    isNeedInit = true
  }
}

function initSQl(dataBasefilePath){
  return new Promise(resolve => {
    let dataBaseFilebuffer;
    if (dataBasefilePath) {
      dataBaseFilebuffer = fs.readFileSync(dataBasefilePath);
    }
    initSql(dataBaseFilebuffer).then(result =>{
      db = result;
      resolve(result)
    });
  });

}

readMyData();

ipcMain.on('check_init_project', (event, arg) => {
  event.returnValue = isNeedInit
});

ipcMain.on('open_select_database_file_dialog', (event) => {
  dialog.showOpenDialog({
    title:'选择要导入的数据库文件',
    buttonLabel: '选择',
    filters:[
      { name: 'SQLITE', extensions: ['sqlite'] }
    ],
    properties: ['openFile']
  }).then(result => {
    // console.log(result.canceled)
    // console.log(result.filePaths)
    if (result.filePaths.length > 0){
      event.sender.send('selected_database_file', result.filePaths)
    }

  }).catch(err => {
    console.log(err)
  })
});

ipcMain.on('load_database_file', (event, arg) => {

    initSQl(arg).then(result =>{
      console.log(result)
      if (result) {
        event.returnValue = true
      }else{
        event.returnValue = false
      }
    });
});


ipcMain.on('open_select_cache_database_directory_dialog', (event) => {
  dialog.showOpenDialog({
    title:'选择要缓存数据库文件的路径',
    buttonLabel: '选择',
    properties: ['openDirectory']
  }).then(result => {
    console.log('result',result)
    if (result.filePaths.length > 0){
      event.sender.send('selected_database_cache_file', result.filePaths)
    }

  }).catch(err => {
    console.log(err)
  })
});


ipcMain.on('set_cache_path_param_file', (event, arg) => {

  if (!arg){
    event.returnValue = {
      result: false,
      msg: '必须选择一个文件夹'
    };
    return
  }

  let cacheFilePath = paramFileName;

  // 判断是否是在安装目录中
  let installDir = app.getPath('exe');
  let lastIndex = installDir.lastIndexOf('\\');
  installDir = installDir.substring(0, lastIndex);

  console.log('cacheFilePath', cacheFilePath);
  if (cacheFilePath.indexOf(installDir) !== -1) {
    event.returnValue = {
      result: false,
      msg: '不能选择安装目录'
    };
  }
  // 检查同目录是否有同名文件
  // try {
  //   fs.accessSync(cacheFilePath);
  //   event.returnValue = {
  //     result: false,
  //     msg: '有同名文件,请更换文件夹1'+cacheFilePath
  //   };
  // } catch (err) {
  // }

  // 打开或创建文件
  fs.open(cacheFilePath, 'w+', (err, fd) => {
    if (err) {
      // if (err.code === 'EEXIST') {
      //   event.returnValue = {
      //     result: false,
      //     msg: '有同名文件,请更换文件夹2'+cacheFilePath
      //   };
      //   return;
      // }
      event.returnValue = {
        result: false,
        msg: '打开或创建文件失败'
      };
      throw err;
    }
    writeData(fd);
  });

  function writeData(fd) {

    let param = {
      cachePath: path.join(arg, 'customer.sqlite')
    };

    try{
      // 文件中写入json字符串
      fs.writeSync(fd, JSON.stringify(param), 0, 'utf-8')
      event.returnValue = {
        result: true,
        msg: '写入成功'
      };
    }catch (e) {

    }finally {
      // 关闭文件
      fs.closeSync(fd);
    }
  }
});

