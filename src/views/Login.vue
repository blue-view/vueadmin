<template>
  <div class="login">
    <header class="login-header">
      <img :src="imgurl" alt="logo" />
      <h1>vue项目: 后台管理系统</h1>
    </header>
    <section class="login-content">
      <h2>用户登陆</h2>
      <el-form :model="userForm" status-icon :rules="rules" ref="userForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="用户名"
            style="color: rgba(0,0,0,.25)"
            v-model="userForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-goods"
            placeholder="密码"
            style="color: rgba(0,0,0,.25)"
            v-model="userForm.password"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-form-button" type="primary" @click="submitForm('userForm')">登录</el-button>
        </el-form-item>
        <div style="text-align:right;font-size:14px">
          <label>用户名和密码初始均为</label>
          <label style="color:red">admin</label>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import logo from "../assets/logo.png";
import { Message } from "element-ui";
import { reqLogin } from "../api";
import memoryUtils from "../utils/memoryUtils";
import storageUtils from "../utils/storageUtils";
export default {
  name: "login",
  data() {
    return {
      imgurl: logo,
      userForm: {
        username: "admin",
        password: "admin"
      },
      rules: {
        username: [
          { required: true, message: "用户名必须输入", trigger: "blur" },
          { min: 4, max: 12, message: "长度在4到12个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码必须输入", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // alert("submit!");
          // console.log('提交登陆的ajax请求', values)
          // 请求登陆
          const { username, password } = this.userForm;
          const result = await reqLogin(username, password); // {status: 0, data: user}  {status: 1, msg: 'xxx'}
          // console.log('请求成功', result)
          if (result.status === 0) {
            // 登陆成功
            // 提示登陆成功
            Message.success("登陆成功");
            // 保存user
            const user = result.data;

            memoryUtils.user = user; // 保存在内存中
            storageUtils.saveUser(user); // 保存到local中

            // 跳转到管理界面 (不需要再回退回到登陆)
            // this.props.history.replace("/");
            this.$router.replace("/");
          } else {
            // 登陆失败
            // 提示错误信息
            Message.error(result.msg);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url("../assets/login/bg.jpg");
  background-size: 100% 100%;
  .login-header {
    display: flex;
    align-items: center;
    height: 80px;
    background-color: rgba(21, 20, 13, 0.5);
    img {
      width: 40px;
      height: 40px;
      margin: 0 15px 0 50px;
    }
    h1 {
      font-size: 30px;
      color: white;
    }
  }

  .login-content {
    width: 400px;
    height: 300px;
    background-color: #fff;
    margin: 50px auto;
    padding: 20px 40px;
    h2 {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .login-form {
      .login-form-button {
        width: 100%;
      }
    }
  }
}
</style>
