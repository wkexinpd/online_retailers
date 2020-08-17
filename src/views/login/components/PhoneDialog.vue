<template>
  <el-form ref="loginForm" :model="loginPhoneForm" :rules="loginPhoneRules" autocomplete="on" label-position="left" class="phoneForm">

    <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
      <el-input
        ref="phone"
        v-model="loginPhoneForm.phone"
        placeholder="phone"
        name="phone"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
    </el-form-item>

    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handlePhoneLogin">登录</el-button>
  </el-form>
</template>

<script>
  export default {
    name: "PhoneDialog",
    data() {
      const validatePhone = (rule, value, callback) => {
        const values = value.trim()
        const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$/
        console.log(values);
        if(!values){
           callback('请输入手机号')
        }else if(reg.test(values)){
          callback(new Error('请输入正确的手机号'))
        }else {
          callback()
        }
      }
      return {
        loginPhoneForm: {
        },
        loginPhoneRules: {
          phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
        },
        loading: false,
        redirect: undefined,
        otherQuery: {}
      }
    },
    methods:{
      handlePhoneLogin() {

      }
    }
  }
</script>

<style lang="scss" scoped>
.phoneForm{
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    color: #000000;
  }
}
</style>
