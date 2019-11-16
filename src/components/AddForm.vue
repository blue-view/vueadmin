<template>
  <div class="addform">
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="dialog.show"
    >
      <el-form ref="ruleForm" :model="formData" label-width="80px" :rules="form_rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item class="text_right" label-width="100px">
          <el-button @click="dialog.show=false">取消</el-button>
          <el-button type="primary" @click="onSubmit('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { reqAddRole } from "../api";
export default {
  name: "addform",
  data() {
    return {
      form_rules: {
        roleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 19, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    dialog: Object,
    formData: Object
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 请求添加
          const result = await reqAddRole(this.formData.roleName);
          // 根据结果提示/更新列表显示
          if (result.status === 0) {
            this.$message({
              message: "添加角色成功",
              type: "success"
            });

            // const role = result.data;
            this.dialog.show = false;
            this.$emit("update");
            this.$refs[formName].resetFields();
          } else {
            this.$message({
              message: "添加角色失败",
              type: "success"
            });
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
<style scoped>
.text_right {
  text-align: right;
}
</style>