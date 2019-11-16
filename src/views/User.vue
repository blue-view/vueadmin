<template>
  <div class="role">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="handleAdd">创建用户</el-button>
      </div>
      <div class="listdatacls">
        <el-table @row-click="onRow" :data="users" border style="width: 100%" highlight-current-row>
          <el-table-column prop="username" label="用户名" min-width="100"></el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="100"></el-table-column>
          <el-table-column prop="phone" label="电话" min-width="100"></el-table-column>
          <el-table-column prop="create_time" label="注册时间" min-width="100">
            <template slot-scope="scope">{{ scope.row.create_time|formater }}</template>
          </el-table-column>
          <el-table-column prop="role_id" label="所属角色" min-width="100">
            <template slot-scope="scope">{{roleNames[scope.row.role_id]}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="text" @click="updateOrAddUser">修改</el-button>
            <el-button type="text" @click="deleteUser">删除</el-button>
          </el-table-column>
        </el-table>
      </div>
      <div class="listpagination" style="text-align:right;padding:20px 20px 0 20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="paginations.page_index"
          :page-sizes="paginations.page_sizes"
          :page-size="paginations.page_size"
          :layout="paginations.layout"
          :total="paginations.total"
        ></el-pagination>
      </div>
    </el-card>
    <UserForm :userdialog="userdialog" :user="user" :roles="roles" @update="getUsers"></UserForm>
  </div>
</template>

<script>
import { reqUsers, reqDeleteUser } from "../api";
import { formateDate } from "../utils/dateUtils.js";
import UserForm from "../components/UserForm";
import { Row } from "element-ui";

export default {
  name: "role",
  data() {
    return {
      roles: [],
      roleNames: {},
      allUsers: [],
      users: [],
      user: {},
      userdialog: {},
      paginations: {
        page_index: 1,
        total: 0,
        page_size: 5,
        page_sizes: [5, 10, 15, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      }
    };
  },
  components: {
    UserForm
  },
  created() {
    this.getUsers();
  },
  filters: {
    formater: function(value) {
      if (!value) return "";
      return formateDate(value);
    }
  },
  methods: {
    async getUsers() {
      const result = await reqUsers();
      // debugger;
      if (result.status === 0) {
        const { users, roles } = result.data;
        this.allUsers = users;
        this.users = users;
        this.roles = roles;
        const roleNames = roles.reduce((pre, role) => {
          pre[role._id] = role.name;
          return pre;
        }, {});
        // 保存
        this.roleNames = roleNames;
        //设置分页数据
        this.setPaginations();
      }
    },
    handleSizeChange(page_size) {
      // console.log(`每页 ${val} 条`);
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.users = this.allUsers.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // console.log(`当前页: ${val}`);
      let index = this.paginations.page_size * (page - 1);
      let nums = this.paginations.page_size * page;
      let tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allUsers[i]) {
          tables.push(this.allUsers[i]);
        }
      }
      this.users = tables;
    },
    setPaginations() {
      this.paginations.total = this.allUsers.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;

      this.users = this.allUsers.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onRow(row, column, event) {
      console.log("row onClick()", row);
      this.user = Object.assign({}, row);
    },
    handleAdd() {
      this.userdialog = {
        show: true,
        title: "添加用户"
      };
      this.user = {
        username: "",
        password: "",
        phone: "",
        email: "",
        role_id: ""
      };
    },
    updateOrAddUser() {
      this.userdialog = {
        show: true,
        title: "更新用户"
      };
    },
    deleteUser() {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const result = await reqDeleteUser(this.user._id);
          // 根据结果提示/更新列表显示
          if (result.status === 0) {
            this.$message({
              message: "删除用户成功",
              type: "success"
            });
            this.getUsers();
          } else {
            this.$message({
              message: "删除用户失败",
              type: "success"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
