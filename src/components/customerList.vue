<template>
    <div>
      <Breadcrumb :style="{margin: '16px 0'}">
        <BreadcrumbItem>首页</BreadcrumbItem>
        <BreadcrumbItem>客户列表</BreadcrumbItem>
      </Breadcrumb>

      <Spin fix v-if="isLoad" size="large"/>

      <Button
        style="margin: 24px"
        @click="function() {
			    $router.push({
            path: '/customerAdd',
            query: {}
        });
      }">新增</Button>

      <Table :columns="columns" :data="list"></Table>
      <Page style="margin: 24px"
            show-total
            show-sizer
            show-elevator
            :current.sync="pageIndex"
            :page-size="pageSize"
            :total="total"
            @on-change="handleChangePageIndex"
            @on-page-size-change="handleChangePageSize"/>
    </div>
</template>

<script>

  import dexieUtil from '../assets/db/dexieUtil'

  export default {
        name: "customerList",
        data() {
          return {
            isLoad: false,

            pageIndex: 1,
            pageSize: 10,
            list: [],
            total: 0,

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
          }
        },
      mounted(){
        this.handleLoadList()
      },
      methods:{
          async handleLoadList(){
            this.isLoad = true;

            let data = await dexieUtil.list(this.pageIndex, this.pageSize);

            this.isLoad = false;

            this.list = data.list;
            this.total = data.total
          },
          handleChangePageIndex: function (pageIndex) {
            this.pageIndex = pageIndex;
            this.handleLoadList();
          },
          handleChangePageSize: function (pageSize) {
            this.pageSize = pageSize;
            this.handleLoadList();
          }
      }
    }
</script>

<style scoped>

</style>
