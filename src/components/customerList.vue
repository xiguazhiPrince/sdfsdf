<template>
    <div>
      <Breadcrumb :style="{margin: '16px 0'}">
        <BreadcrumbItem>首页</BreadcrumbItem>
        <BreadcrumbItem>客户列表</BreadcrumbItem>
      </Breadcrumb>
      <Button @click="function() {
			    $router.back(-1);
      }">返回</Button>

      <Button @click="function() {
			    $router.push({
            path: '/customerAdd',
            query: {}
        });
      }">新增</Button>
      <Table :columns="columns" :data="list"></Table>
    </div>
</template>

<script>

  import indexDbUtil from '../assets/db/customerDb'

  export default {
        name: "customerList",
        data() {
          return {
            columns: [
              {
                title: '姓名',
                key: 'name'
              },
              {
                title: '手机号',
                key: 'mobile'
              },
              {
                title: '身份证号',
                key: 'idNumber'
              },
              {
                title: '套餐名',
                key: 'businessName'
              },
              {
                title: '创建时间',
                key: 'systemCreateTime'
              },
              {
                title: '更新时间',
                key: 'systemUpdateTime'
              }
            ],
            list: [],
            total: 0
          }
        },
      mounted(){
          let _this = this
        indexDbUtil.createDB_And_InitTables('customer_info',
                                            function () {
                                              console.log('回调成功')
                                              indexDbUtil.listDataByPage('customer_info', _this.handleGetList, 1, 10)
                                            },
                                            function () {
                                              console.log('fail')
                                            })
      },
      methods:{
          handleGetList(list, total){
            this.list = list;
            this.total = total
          }
      }
    }
</script>

<style scoped>

</style>
