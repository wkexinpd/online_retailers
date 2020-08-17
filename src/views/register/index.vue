<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">系统注册</h3>
      </div>
      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="手机号"
          name="phone"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="大写" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="code" class="identify">
        <el-input v-model="registerForm.code" placeholder="请输入验证码"/>
        <el-button type="button" @click="sendCode" :disabled="disabled" v-if="disabled===false">发送验证码</el-button>
        <el-button type="button" @click="sendCode" :disabled="disabled" v-if="disabled===true">{{btntxt}}</el-button>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
    </el-form>
  </div>
</template>
<script>
  import {registerSendSms, register} from "@/api/user";

  export default {
    name: 'Register',
    data(){
      const validatePhone = (rule, value, callback) => {
        const values = value&&value.trim()
        const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(!values){
          callback('请输入手机号')
        }else if(!reg.test(values)){
          callback(new Error('请输入正确的手机号'))
        }else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
        if(!value){
          callback('请输入密码')
        }else if (value.length < 6 || value.length > 16) {
          callback(new Error('密码长度在6-16之间'))
        }else if(!reg.test(value)){
          callback(new Error('密码形式为数字+字母'))
        } else {
          callback()
        }
      }
      return{
        redirect: undefined,
        otherQuery: {},
        registerForm: {
          phone: '',
          password:'',
          code:''
        },
        registerRules:{
          phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          code: [{ required: true, trigger: 'blur' }]
        },
        passwordType: 'password',
        capsTooltip: false,
        btntxt: '重新发送',
        disabled: false,
        loading: false
      }
    },
    watch:{
      $route: {
        handler: function (route) {
          const query = route.query
          // console.log(query);
          if(query){
            this.redirect = query.redirect
            // this.otherQuery = this.getOtherQuery(query)
            // console.log(this.otherQuery);
          }
        },
        immediate: true
      }
    },
    methods:{
      checkCapslock(e) {
        const { key } = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      sendCode() {
        const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(this.registerForm.phone === ''){
          this.$message({
            message:'手机号不能为空',
            center: true
          })
          return
        }
        if (!reg.test(this.registerForm.phone)) {
          this.$message({
            message:'请输入正确的手机号',
            center:true
          })
          return
        } else {
          let phone = this.registerForm.phone
          registerSendSms(phone).then(response => {
            this.$message({
              message: '发送成功',
              type: 'success',
              center: true
            });
            this.time = 60;
            this.disabled = true;
            this.timer();
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      },
      timer(){
        if (this.time > 0) {
          this.time--;
          this.btntxt = this.time + "s后重新获取";
          setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.btntxt = "获取验证码";
          this.disabled = false;
        }
      },
      handleRegister(){
        this.$refs.registerForm.validate(valid => {
          // console.log(valid);
          if (valid) {
            this.loading = true
            register(this.registerForm).then(response => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            }).catch(() => {
                this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .register-container .el-input input {
      color: $cursor;
    }
  }
  .register-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>
<style lang="scss" scoped>
  $bg:#283443;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .register-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .register-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }

    .identify{
      .el-button{
        position: absolute;
        right: 0;
        height: 47px;
        border: none;
        background: none;
        color: #fff;
      }
      .el-button:hover{
        color: #6BA2D6;
      }
    }
  }
</style>
