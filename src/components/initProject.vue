<template>
  <div>
    <Spin size="large" fix v-if="isLoad"></Spin>
    <Steps :current="current">
      <Step title="选择初始化数据文件" content="初次安装可跳过"></Step>
      <Step title="选择存放数据文件的路径" content="将数据文件缓存到的路径, 以便下次安装时可以导入"></Step>
      <Step title="完成" content="初始化设置全部完成, 开始使用"></Step>
    </Steps>

    <div v-show="current === 0" style="min-height: 300px;min-width: 200px; padding: 50px 20px">
      <Input v-model="selectDataBaseFilePath" style="width: 300px" />
      <Button icon="ios-cloud-upload-outline"  @click="handleSelectDataBaseFile">点击选择数据库文件</Button>
      <Button type="primary"
              @click="function() {
                handleConfirmDBPath()
              }">确认</Button>
    </div>

    <div v-show="current === 1" style="min-height: 300px;min-width: 200px; padding: 50px 20px">
      <Input v-model="selectCacheDataBaseFilePath" style="width: 300px" :disabled="true" />
      <Button icon="ios-cloud-upload-outline" @click="handleSelectCacheDataBaseFile">点击设置路径</Button>
      <Button type="primary"
              @click="function() {
              handleConfirmCacheDBPath()
              }">确认</Button>
    </div>

    <div v-show="current === 2">
      <Button icon="ios-cloud-upload-outline">点击设置路径</Button>
    </div>


  </div>
</template>

<script>
	export default {
		name: "initProject",
    props: {
      success:{
        type: Function,
        default: function (event, file, fileList) {
          return { message: '成功回调' }
        },
        required: true
      }
    },
    data: () =>{
      return {
        current: 0,
        selectDataBaseFilePath: '',
        selectCacheDataBaseFilePath: '',
        isLoad: false
      }
    },
    methods:{
      handleSpinShow (show) {
        if (show) {
          this.$Spin.show();
        }else{
          this.$Spin.hide();
        }
      },
      handleConfirmDBPath(){
        this.isLoad = true
        let result = ipcRenderer.sendSync('load_database_file', this.selectDataBaseFilePath)

        setTimeout(()=>{
          this.isLoad = false
          if (result) {
            console.log('handleConfirmDBPath',result)
            this.current ++;
          }else {
            this.$Message.warning('加载数据库文件失败, 请重新选择文件')
          }
        },2000)
      },
		  handleSelectDataBaseFile(){
        ipcRenderer.send('open_select_database_file_dialog');

        ipcRenderer.on('selected_database_file', (event, path) => {
          this.selectDataBaseFilePath = path[0]
          console.log('selected_database_file', path)
        })
      },
      handleSelectCacheDataBaseFile(){
        ipcRenderer.send('open_select_cache_database_directory_dialog');

        ipcRenderer.on('selected_database_cache_file', (event, path) => {
          this.selectCacheDataBaseFilePath = path[0]
        })
      },
      handleConfirmCacheDBPath(){
        if (!this.selectCacheDataBaseFilePath){
          this.$Message.warning('必须选择一个文件夹');
          return
        }
        let result = ipcRenderer.sendSync('set_cache_path_param_file', this.selectCacheDataBaseFilePath)
        if (result.result) {
          this.current ++;
          this.success()
        }else{
          this.$Message.warning(result.msg);
        }
        console.log(result)
      }
    }
	}
</script>

<style scoped>

</style>
