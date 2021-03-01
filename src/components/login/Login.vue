<template>
<div class="login pr">
    <!-- <div style = "width:60%;height:100%;position:relative;display:flex;justify-content:center;align-items:center"> -->
        <!-- <img :src="maxLogo" alt="" key="max-logo" style="position:absolute;top:0;left:0"> -->
        <!-- <div class='df dfc dfac'>
            <h1 class='cff fw7' style='font-size: 54px; '>中银粤财</h1>
            <h1 class='cff fw7' style='font-size: 54px; '>FOP-基金投资管理平台</h1>
            <img :src='imgRight' alt="" style="margin-top: 32px">
        </div> -->
    <!-- </div> -->
    <div class="login-con">
      <!-- <img class='login-right-img' style='width: 680px;' :src='imgRight' alt=""> -->
      <!-- <Card icon="log-in" title="欢迎登录 DIOP中银粤财投资管理系统" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card> -->
      <div class="form-con bgfff pr" style='padding: 30px;'>
        <login-form @on-success-valid="handleSubmit"></login-form>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from './login-form'
// import maxLogo from '../../assets/images/logo.png'
export default {
  name: 'Login',
  components: {
    LoginForm
  },
  data() {
    return {}
  },
  //  方法集合
  methods: {
    handleSubmit(){}
  },
  // 生命周期-挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>

