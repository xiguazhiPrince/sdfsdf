<template>
  <div>
    <Steps :current="current">
      <Step title="选择初始化数据文件" content="初次安装可跳过"></Step>
      <Step title="选择存放数据文件的路径" content="将数据文件缓存到的路径, 以便下次安装时可以导入"></Step>
      <Step title="完成" content="初始化设置全部完成, 开始使用"></Step>
    </Steps>

    <div v-show="current === 0">
      <Button icon="ios-cloud-upload-outline">点击选择数据库文件</Button>
    </div>

    <div v-show="current === 1">
      <Button icon="ios-cloud-upload-outline">点击设置路径</Button>
    </div>

    <div v-show="current === 2">
      <Button icon="ios-cloud-upload-outline">点击设置路径</Button>
    </div>
    <Button type="primary"
            @click="function() {
              current++
            }">下一步</Button>

  </div>
</template>

<script>
	export default {
		name: "initProject",
    data: () =>{
      return {
        current: 0
      }
    }
	}
</script>

<style scoped>

</style>
