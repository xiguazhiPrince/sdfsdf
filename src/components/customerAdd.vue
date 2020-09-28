<template>
  <div>
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>新增客户</BreadcrumbItem>
    </Breadcrumb>
    <Button @click="function() {
			    $router.back(-1);
      }">返回
    </Button>

    <Form ref="form" :model="customer" class="tab-form" :label-width="100">
      <Row class="tab-form-row" type="flex" align="middle">
        <Col :xs="24" :sm="12" :md="12" :lg="8">
          <FormItem label="姓名" prop="name" :rules="[{required: true, message: '请输入姓名'}]">
            <Input v-model="customer.name" type="text" placeholder="请输入姓名"/>
          </FormItem>
        </Col>
      </Row>
      <Row class="tab-form-row" type="flex" align="middle">
        <Col :xs="24" :sm="12" :md="12" :lg="8">
          <FormItem label="手机号" prop="mobile" :rules="[{required: true, message: '请输入手机号'}]">
            <Input v-model="customer.mobile" type="text" placeholder="请输入手机号"/>
          </FormItem>
        </Col>
      </Row>
      <Row class="tab-form-row" type="flex" align="middle">
        <Col :xs="24" :sm="12" :md="12" :lg="8">
          <FormItem label="身份证号" prop="idNumber" :rules="[{required: true, message: '请输入身份证号'}]">
            <Input v-model="customer.idNumber" type="text" placeholder="请输入身份证号"/>
          </FormItem>
        </Col>
      </Row>
      <Row class="tab-form-row" type="flex" align="middle">
        <Col :xs="24" :sm="12" :md="12" :lg="8">
          <FormItem label="套餐名" prop="businessName" :rules="[{ required: true, message: '请输入套餐名'}]">
            <Input v-model="customer.businessName" type="text" placeholder="请输入套餐名"/>
          </FormItem>
        </Col>
      </Row>
      <Row class="tab-form-row" type="flex" align="middle">
        <Col :xs="24" :sm="12" :md="12" :lg="8">
          <FormItem>
            <Button
              type="primary"
              @click="handleAdd">提交
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

  </div>
</template>

<script>

  import indexDbUtil from '../assets/db/customerDb'

  export default {
    name: "customerAdd",
    data() {
      return {
        customer: {
          name: '',
          mobile: '',
          idNumber: '',
          businessName: '',
          systemCreateTime: null,
          systemUpdateTime: null
        }
      }
    },
    mounted() {

    },
    methods: {
      handleAdd() {
        let _this = this;
        function dbInitSuccess() {
          function dbInsertSuccess(event) {
            console.log('dbInsertSuccess', event)
          }
          function dbInsertFail(event) {
            console.log('dbInsertFail', event)
          }
          _this.customer.systemCreateTime = new Date()
          indexDbUtil.insertOrUpdateData(_this.customer, 'customer_info', dbInsertSuccess, dbInsertFail)
        }
        function dbInitFail() {
          console.log('dbInitFail')
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            indexDbUtil.createDB_And_InitTables('customer_info', dbInitSuccess, dbInitFail)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
