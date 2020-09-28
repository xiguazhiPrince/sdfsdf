# my-vue-electron

> A DIY Vue.js - electron project

## Build Setup

```
echo "# sdfsdf" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/xiguazhiPrince/vue-iview-electron-example.git
git push -u origin master
```


# 如果下载依赖包失败
### electron-builder依赖包下载失败（winCodeSign）
> https://www.jianshu.com/p/ccaf2dccd15b 看这个解决方案


# electron build打包时在package.json的配置
```
 {
   "name": "my-vue-electron",
   "version": "1.0.0",
   "description": "A DIY Vue.js - electron project",
   "author": "xpf",
   "license": "MIT",
   "private": true,
   "productName": "项目名称",
   "main": "main.js",
   "scripts": {
     "start": "electron .",
     "pack": "electron-builder --dir",
     "dist": "electron-builder"
   },
   "dependencies": {
   },
   "build": {
     "appId": "com.xpf.myvueelectron",
     "productName": "myvueelectron",
     "copyright": "Copyright © 2020 ${author}",
     "directories": {
       "output": "build"
     },
     "files": [
        "**/*",
        "!node_modules/"
      ],
     "nsis": {
       "oneClick": false,
       "allowElevation": true,
       "allowToChangeInstallationDirectory": true,
       "perMachine": true,
       "installerIcon": "./icons/icon.ico",
       "uninstallerIcon": "./icons/icon.ico",
       "installerHeaderIcon": "./icons/icon.ico",
       "createDesktopShortcut": true,
       "createStartMenuShortcut": true,
       "shortcutName": "customList",
       "include": "./script/installer.nsh"
     },
     "win": {
       "target": [
         {
           "target": "nsis",
           "arch": [
              "x64",
              "ia32"
            ]
         }
       ],
       "icon": "./icons/icon.png"
     },
     "electronDownload": {
       "mirror": "https://npm.taobao.org/mirrors/electron/"
     }
   },
   "devDependencies": {
     "electron-packager": "^15.1.0",
     "electron": "^10.1.2",
     "electron-builder": "^22.8.1"
   }
 }
```
