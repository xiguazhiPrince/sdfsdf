const fs = require('fs');

const {ipcMain, dialog} = require('electron')

const paramFileName = 'initProjectParam.json';
let isNeedInit = false;

// 读取本地参数文件
function readMyData() {
  // 读取文件内容
  var data = fs.readFileSync(paramFileName, {encoding: 'utf-8',flag: 'w+'});

  let paramString = data.toString();
  // 如果有参数
  if (paramString.length > 0) {
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
    console.log(result.canceled)
    console.log(result.filePaths)
    if (result.filePaths.length > 0){
      event.sender.send('selected_database_file', result.filePaths)
    }

  }).catch(err => {
    console.log(err)
  })

})

// filters FileFilter[] (可选)
// properties String[] (optional) - Contains which features the dialog should use. The following values are supported:
//   openFile - 允许选择文件
// openDirectory - 允许选择文件夹
// multiSelections-允许多选。
// showHiddenFiles-显示对话框中的隐藏文件。
// createDirectory macOS - Allow creating new directories from dialog.
//   promptToCreate Windows - Prompt for creation if the file path entered in the dialog does not exist. 这并不是真的在路径上创建一个文件，而是允许返回一些不存在的地址交由应用程序去创建。
// noResolveAliases macOS - Disable the automatic alias (symlink) path resolution. Selected aliases will now return the alias path instead of their target path.
//   treatPackageAsDirectory macOS - Treat packages, such as .app folders, as a directory instead of a file.
//   dontAddToRecent Windows - Do not add the item being opened to the recent documents list.
//   message String (optional) macOS - Message to display above input boxes.
//   securityScopedBookmarks Boolean (optional) macOS mas - Create security scoped bookmarks when packaged for the Mac App Store.
          // 参数设置流程走完后, 渲染进程将参数发送给主进程, 主进程创建本地的参数文件
    // 如果有本地参数文件, 并且各个字段也都有, 那么告知渲染进程, 已经设置过参数了

