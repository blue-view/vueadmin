<template>
  <div class="authform" id="el-tree-container">
    <el-dialog
      :title="roledialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="roledialog.show"
    >
      <el-row type="flex" class="el-row">
        <el-col :span="4" class="el-col">角色名称：</el-col>
        <el-col :span="20">
          <el-input class="inline" v-model="roleRight.name" disabled></el-input>
        </el-col>
      </el-row>

      <el-tree
        ref="tree"
        :props="props"
        :default-expand-all="true"
        :data="menuList"
        node-key="key"
        show-checkbox
        @check="checkClick"
      ></el-tree>
      <div class="text_right">
        <el-button @click="roledialog.show=false">取消</el-button>
        <el-button type="primary" @click="okHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import menuList from "../config/menuConfig";
import { reqUpdateRole } from "../api";
import memoryUtils from "../utils/memoryUtils";
import storageUtils from "../utils/storageUtils.js";

export default {
  name: "authform",
  props: {
    roledialog: Object,
    roleRight: Object
  },
  data() {
    return {
      menuList: menuList,
      props: {
        label: "label",
        children: "children"
      }
    };
  },

  updated() {
    this.$nextTick(() => {
      let tree = this.$refs.tree;
      if (tree) {
        tree.setCheckedKeys(this.roleRight.menus);
      }
    });
  },
  methods: {
    async okHandle() {
      this.roleRight.auth_time = Date.now();
      this.roleRight.auth_name = memoryUtils.user.username;
      // 请求更新
      const result = await reqUpdateRole(this.roleRight);
      if (result.status === 0) {
        this.roledialog.show = false;
        // this.getRoles()
        // 如果当前更新的是自己角色的权限, 强制退出
        if (this.roleRight._id === memoryUtils.user.role_id) {
          memoryUtils.user = {};
          storageUtils.removeUser();
          this.$router.replace("/login");
          this.$emit("updateAuth");
          this.$message({
            message: "当前用户角色权限成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "设置角色权限成功",
            type: "success"
          });
        }
      }
    },
    checkClick(dataObj, treeStatus) {
      // console.log('dataObj',dataObj);
      // console.log('treeStatus',treeStatus);
      this.roleRight.menus = treeStatus.checkedKeys;
    }
  }
};
</script>
<style scoped lang="scss">
.text_right {
  text-align: right;
  margin-top: 30px;
}
.inline {
  display: inline-block;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  line-height: 40px;
  vertical-align: middle;
}
#el-tree-container .el-tree-node__content {
  height: 35px;
}
</style>