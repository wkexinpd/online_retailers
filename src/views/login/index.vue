<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="username" :class="showPhoneDialog?'hidden':''">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual :class="showPhoneDialog?'hidden':''">
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="phones" :class="showPhoneDialog?'':'hidden'">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phones"
          v-model="loginForm.phones"
          placeholder="请输入手机号"
          name="phones"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item prop="identify" :class="showPhoneDialog?'':'hidden'" class="identify">
        <el-input v-model="loginForm.identify" placeholder="请输入验证码"/>
        <el-button type="button" @click="sendCode" :disabled="disabled" v-if="disabled===false">发送验证码</el-button>
        <el-button type="button" @click="sendCode" :disabled="disabled" v-if="disabled===true">{{btntxt}}</el-button>
      </el-form-item>
      <el-button class="registerButton" @click="sendRegister">没有账号，点击注册</el-button>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <div class="social-signup-container">
          <div class="sign-btn">
            <span class="phone-container" :class="showPhoneDialog?'':'hidden'" @click="submit">账号密码登录</span>
            <span class="phone-container" :class="showPhoneDialog?'hidden':''" @click="phoneSubmit">手机短信登录</span>
          </div>
          |
          <div class="sign-btn" @click="showWXDialog=true">
            <span class="wx-svg-container"><i class="iconfont icon-weixin icon" /></span>
            <!--      微信-->
          </div>
          <div class="sign-btn" @click="showQQDialog=true">
            <span class="qq-svg-container"><i class="iconfont icon-QQ icon" /></span>
            <!--      QQ-->
          </div>
        </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import PhoneDialog from './components/PhoneDialog'
import { sendSms } from '@/api/user'
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入正确形式的密码'))
  } else {
    callback()
  }
}
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
export default {
  name: 'Login',
  components: { PhoneDialog },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        phones: '',
        identify: ''
      },
      loginRules: {
        username: [{ trigger: 'blur', validator: !this.disabled&&validateUsername }],
        password: [{ trigger: 'blur', validator: !this.disabled&&validatePassword }],
        phones: [{ trigger: 'blur', validator: this.disabled&&validatePhone }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showPhoneDialog: false,
      redirect: undefined,
      otherQuery: {},
      disabled:false,
      btntxt: '重新发送',
      time: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    disabled:{
      handler: function () {
        this.loginRules = {
          username: [{ trigger: 'blur', validator: !this.disabled&&validateUsername }],
          password: [{ trigger: 'blur', validator: !this.disabled&&validatePassword }],
          phones: [{ trigger: 'blur', validator: this.disabled&&validatePhone }]
        }
      }
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        // console.log(valid);
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // test().then(()=>{
              //   this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              //   this.loading = false
              //   resolve()
              // }).catch(error => {
              //   reject(error)
              // })
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    submit(){
      this.showPhoneDialog=false
      this.$refs.loginForm.resetFields()

    },
    phoneSubmit(){
      this.showPhoneDialog=true
      this.$refs.loginForm.resetFields()
      this.time = 0;
      this.btntxt = "获取验证码";
      this.disabled = false;
    },
    sendCode() {
      const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if(this.loginForm.phones === ''){
        this.$message({
          message:'手机号不能为空',
          center: true
        })
        return
      }
      if (!reg.test(this.loginForm.phones)) {
        this.$message({
          message:'请输入正确的手机号',
          center:true
        })
        return
      } else {
        // console.log(this.loginForm.phones);
        let phone = this.loginForm.phones
        sendSms(phone).then(response => {
          this.$message({
            message: '发送成功',
            type: 'success',
            center:true
          });
          this.time = 60;
          this.disabled = true;
          this.timer();
          resolve()
        }).catch(error=>{
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
    sendRegister(){
      this.$router.push(`/register?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

.hidden{
  display: none;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
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
  .el-button{
    margin-left: 0px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 120px 35px 0;
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
}
.social-signup-container {
  color: #eee;
  display: flex;
  line-height: 60px;
  justify-content: center;
  .sign-btn {
    display: inline-block;
    cursor: pointer;
  }
  .icon {
    color: #fff;
    font-size: 24px;
    margin-top: 8px;
  }
  .phone-container{
    cursor: pointer;
    color: #fff;
    margin-right: 20px;
  }
  .phone-container:hover{
    color: #40a1fc;
  }
  .wx-svg-container,
  .qq-svg-container {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding-top: 1px;
    border-radius: 4px;
    margin-right: 5px;
  }
  .wx-svg-container {
    margin-left: 20px;
    background-color: #24da70;
  }
  .qq-svg-container {
    background-color: #6BA2D6;
    margin-left: 10px;
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
  .registerButton{
    /*position: absolute;*/
    /*right: 0;*/
    float: right;
    border: none;
    background: none;
    color: #fff;
    margin-top: -10px;
    margin-bottom: 10px;
  }
  .registerButton:hover{
    color: #6BA2D6;
  }
</style>
