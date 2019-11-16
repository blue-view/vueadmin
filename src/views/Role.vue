<template>
  <div class="role">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="handleAdd">创建角色</el-button>
        <el-button :disabled="!role._id" type="primary" @click="handleSetRole">设置角色权限</el-button>
      </div>
      <div class="listdatacls">
        <el-table
          ref="Table"
          @row-click="onRow"
          :data="roles"
          border
          style="width: 100%"
          @selection-change="chooseInstance"
          @current-change="currentChange"
        >
          <el-table-column type="selection" min-width="55"></el-table-column>
          <el-table-column prop="name" label="角色名称" min-width="100"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" min-width="100">
            <template slot-scope="scope">{{ scope.row.create_time|formater }}</template>
          </el-table-column>
          <el-table-column prop="auth_time" label="授权时间" min-width="100">
            <template slot-scope="scope">{{ scope.row.auth_time|formater }}</template>
          </el-table-column>
          <el-table-column prop="auth_name" label="授权人"></el-table-column>
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
    <AddForm :dialog="dialog" :formData="formData" @update="getRoles"></AddForm>
    <AuthForm ref="authform" :roleRight="role" :roledialog="roledialog" @updateAuth="updateAuth"></AuthForm>
  </div>
</template>

<script>
import { reqRoles } from "../api";
import memoryUtils from "../utils/memoryUtils.js";
import { formateDate } from "../utils/dateUtils.js";
import storageUtils from "../utils/storageUtils.js";
import AddForm from "../components/AddForm";
import AuthForm from "../components/AuthForm";

export default {
  name: "role",
  data() {
    return {
      dialog: {
        show: false,
        title: ""
      },
      roledialog: {
        show: false,
        title: ""
      },
      formData: {
        roleName: ""
      },
      paginations: {
        page_index: 1,
        total: 0,
        page_size: 5,
        page_sizes: [5, 10, 15, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      templateSelection: null,
      templateRadio: -1,
      allRoles: [],
      roles: [], // 所有角色的列表
      role: {}, // 选中的role
      isShowAdd: false, // 是否显示添加界面
      isShowAuth: false // 是否显示设置权限界面
    };
  },
  filters: {
    formater: function(value) {
      if (!value) return "";
      return formateDate(value);
    }
  },
  components: {
    AddForm,
    AuthForm
  },
  created() {
    this.getRoles();
  },
  methods: {
    currentChange(val) {
      this.$refs.Table.toggleRowSelection(val);
    },
    chooseInstance(val) {
      if (val.length > 1) {
        this.$refs.Table.clearSelection();
        this.$refs.Table.toggleRowSelection(val.pop());
      } else {
      }
    },
    async getRoles() {
      const result = await reqRoles();
      // debugger;
      if (result.status === 0) {
        const roles = result.data;
        this.allRoles = roles;
        this.roles = roles;
        // console.log('this.roles',role);
        //设置分页数据
        this.setPaginations();
      }
    },
    handleSizeChange(page_size) {
      // console.log(`每页 ${val} 条`);
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.roles = this.allRoles.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // console.log(`当前页: ${val}`);
      let index = this.paginations.page_size * (page - 1);
      let nums = this.paginations.page_size * page;
      let tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allRoles[i]) {
          tables.push(this.allRoles[i]);
        }
      }
      this.roles = tables;
    },
    setPaginations() {
      this.paginations.total = this.allRoles.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;

      this.roles = this.allRoles.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    getTemplateRow(index, row) {
      //获取选中数据
      this.templateSelection = row;
      console.log(row);
    },
    onRow(row, column, event) {
      console.log("row onClick()", row);

      this.role = row;
      // console.log(row);
      // console.log(column);
      // console.log(event);
    },
    updateAuth(checkedKeys) {
      this.getRoles();
    },
    handleAdd() {
      this.dialog = {
        show: true,
        title: "角色名称"
      };
      this.formData = {
        roleName: "",
        id: ""
      };
    },
    handleSetRole() {
      this.roledialog = {
        show: true,
        title: "设置角色权限"
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>
