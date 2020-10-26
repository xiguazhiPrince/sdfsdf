<template>
  <div>

    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>新增客户</BreadcrumbItem>
    </Breadcrumb>
    <Button
      style="margin: 24px"
      @click="function() {
			    $router.back(-1);
      }">返回
    </Button>

    <Spin fix v-if="isLoad" size="large"/>

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
              @click="handleAddDexie">提交
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

  </div>
</template>

<script>
  import dexieUtil from '../assets/db/dexieUtil'

  export default {
      name: "customerAdd",
      data() {
        return {
          isLoad: false,
          defaultCustomer: {
            name: '',
            mobile: '',
            idNumber: '',
            businessName: '',
            systemCreateTime: null,
            systemUpdateTime: null
          },
          customer: {
          }
        }
      },
      mounted() {
        this.customer = Object.assign({}, this.defaultCustomer);
      },
      methods: {
          handleAddDexie(){
              this.$refs.form.validate(async (valid) => {
                  if (valid) {

                      let mobileResult = await dexieUtil.findByMobile(this.customer.mobile);
                      if (mobileResult) {
                        this.$Message.info('手机号已存在');
                        return
                      }

                      let idNumberResult = await dexieUtil.findByIdNumber(this.customer.idNumber);
                      if (idNumberResult) {
                        this.$Message.info('身份证号已存在');
                        return
                      }

                      this.isLoad = true;
                      dexieUtil.add({
                        data: this.customer,
                        onSuccess: (value)=>{
                          this.$Message.success('添加成功');
                          this.customer = Object.assign({}, this.defaultCustomer);
                          this.$refs.form.resetFields()
                        },
                        onerror: (error)=>{
                          console.error(error)
                        },
                        complete: ()=>{
                          this.isLoad = false;
                        }
                      });
                  }
              })
          },
      }
  }
</script>

<style scoped>

</style>
