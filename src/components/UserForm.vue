<template>
  <div class="userform">
    <el-dialog
      :title="userdialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="userdialog.show"
    >
      <el-form :model="user" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!user._id">
          <el-input type="password" v-model="user.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="user.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="user.role_id" placeholder="请选择">
            <el-option v-for="item in roles" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="userdialog.show=false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { reqAddOrUpdateUser } from "../api";

export default {
  name: "userform",
  data() {
    return {};
  },
  props: {
    userdialog: Object,
    user: Object,
    roles: Array
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 请求添加
          const result = await reqAddOrUpdateUser(this.user);
          // 根据结果提示/更新列表显示
          if (result.status === 0) {
            if (this.user._id) {
              this.$message({
                message: "更新用户成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "添加用户成功",
                type: "success"
              });
            }
            // const role = result.data;
            this.userdialog.show = false;
            this.$emit("update");
            this.$refs[formName].resetFields();
          } else {
            if (this.user._id) {
              this.$message({
                message: "更新用户失败",
                type: "success"
              });
            } else {
              this.$message({
                message: "添加用户失败",
                type: "success"
              });
            }
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
<style scoped lang="scss">
</style>