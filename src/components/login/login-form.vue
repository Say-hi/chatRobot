<template>
  <el-form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <div style='text-align: center;'>
      <!-- <span>中银粤财</span> -->
      <span style='font-size: 18px; color: #ff7524;margin-left: 10px;'>智能客服在线系统</span>
    </div>
    <!-- <p class='c303e5f f20 fw7' style="margin-top: 70px">欢迎登录 中银粤财FOP-基金投资管理平台</p> -->
    <el-form-item prop="phone" class='mt20' style="margin-top: 50px;">
      <div class='f12 c303e5f'>手机号</div>
      <el-input v-model="form.phone" placeholder="请输入用户名">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <div class='f12 c303e5f'>密码</div>
      <el-input type="password" v-model="form.password" placeholder="请输入密码">
      </el-input>
    </el-form-item>
    <!-- <Checkbox class='f12' v-model="remember">记住用户名</Checkbox> -->
    <el-form-item>
      <div class='login-btn pointer' @click="handleSubmit" type="primary" long style="height: 48px; line-height: 48px;">
        登录
      </div>
    </el-form-item>
    <div class='visitor'>
      <span @click='handleSubmit("visitor")' class='pointer'>游客登录</span>
    </div>
  </el-form>
</template>

<script>
import md5 from 'js-md5'
import ChatApi from "@/api/chat-api";
import { mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      form: {},
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  //  方法集合
  methods: {
    ...mapMutations(['setUserInfo']),
    handleSubmit (type) {
      if (type === 'visitor') {
        ChatApi.userLogin({
          loginType: 0
        }).then(res => {
          this.setUserInfo(res)
          this.$router.push({name: 'Chat'})
        })
        return
      }
      this.$refs.loginForm.validate(flag => {
        flag && ChatApi.userLogin({
          phone: this.form.phone,
          password: md5(this.form.password),
          loginType: 1
        }).then(res => {
          this.setUserInfo(res)
          this.$router.push({name: 'Chat'})
        }).catch(err => {
          console.log('err',err)
        })
        // flag && (this.$router.push({name: 'Chat'}))
      })
    }
  },
  // 生命周期-挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>
<style scoped>
.login-btn {
  background: linear-gradient(135deg, #85c5ff 0%, #5b9dff 100%);
  width: 100%;
  text-align: center;
  color: #fff;
  font-weight: 700;
  border-radius: 4px;
}
.visitor {
  text-align: center;
  color: rgb(146, 142, 142);
}
</style>