<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      @keyup.enter.native="handleLogin(loginForm)"
    >
      <div class="title-container">
        <img class="title logo-img" src="/logo.png" /> 
      </div>

      <el-form-item prop="email">
        <i class="icon el-icon-user"></i>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="UserName"
          name="email"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <i class="icon el-icon-lock"></i>
        <el-input
          ref="password"
          :key="passwordType"
          v-model="loginForm.password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span @click="showPwd" class="show-pwd">
          <i
            :class="
              passwordType === 'password' ? 'el-icon-turn-off' : 'el-icon-open'
            "
            class="icon"
          />
        </span>
      </el-form-item>
       
      <el-button 
        @click.native.prevent="handleLogin(loginForm)"
        type="success"
        class="login-btn" 
        >Авторизоваться</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'empty',
  middleware: ['authUser'],
  data() {
    return {
      loginForm: {
        email: 'admin@admin.com', 
        password: '123456'
      }, 
      loginRules: {
        email: [
          {
            type: 'email',
            required: true,
            min: 6,
            trigger: ['blur', 'change']
          }
        ],
        password: [{ required: true, min: 2, trigger: 'blur' }]
      }, 
      passwordType: 'password'
    }
  },
  methods: {
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
    handleLogin(loginForm) {
      this.loading = true
      try {
        this.$refs.loginForm.validate( async valid => {
          if (!valid) {
            this.$message.error("Форма невалидная!");
          } else { 

            let formdata = {
              email: this.loginForm.email,
              password: this.loginForm.password
            } 
            
            await this.$store.dispatch('auth/login', formdata)
  
            await this.$router.push('/admin')
 
          }
        })
      } catch (err) {
        throw err
      }
    }
  },
  mounted(){
    const {mess} = this.$route.query
    
    switch (mess) {
      case 'login' :  
         this.$message.error("Для доступа к этой странице нужно быть авторизованным в системе!");
        break;  
    }
  }
}
</script>

<style lang="scss">

$bg: #305635;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

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
    background: rgba(255, 255, 255, 0.15);
    border-radius: 5px;
    color: #454545;
  }
 
  background: url(/login-back.jpg) no-repeat;
  background-size: cover;
  background-repeat: no-repeat;
}

.logo-img{
  width: 30%;
  margin-left: 35% !important;
}
</style>

<style lang="scss" scoped>

$bg: #305635;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 200px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .icon {
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
      margin: 0px auto 10px auto;
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

.login-btn{
  width:100%;
  margin-bottom:30px;
  font-size: 1.2em;
}
</style>
