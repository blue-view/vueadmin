<template>
  <div class="category">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="display:flex;justify-content: space-between">
          <div>
            <div v-if="parentId === '0'">一级分类列表</div>
            <div v-else>
              <el-button @click="showCategorys" type="text">一级分类列表</el-button>
              <i class="el-icon-right"></i>
              <span>{{parentName}}</span>
            </div>
          </div>
          <el-button
            @click="addOrUpdateCategory({id:''})"
            style="height:40px"
            type="primary"
            icon="el-icon-plus"
          >添加</el-button>
        </div>
      </div>
      <div class="listdatacls">
        <el-table
          ref="category"
          @row-click="onRow"
          :data="categorys"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column label="操作"  width="300">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateCategory(scope.row)">修改分类</el-button>
              <el-button v-if="parentId==='0'" type="text" @click="showSubCategory(scope.row)">查看子分类</el-button>
            </template>
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
    <CategoryForm
      :parentId="parentId"
      :categorydialog="categorydialog"
      :category="category"
      :categorys="categorys"
      @updateCategory="getCategorys"
    ></CategoryForm>
  </div>
</template>

<script>
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../api";
import CategoryForm from "../components/CategoryForm";
export default {
  name: "category",
  data() {
    return {
      categorydialog: {
        show: false,
        title: ""
      },
      paginations: {
        page_index: 1,
        total: 0,
        page_size: 5,
        page_sizes: [5, 10, 15, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      loading: false, // 是否正在获取数据中
      categorys: [], // 一级分类列表
      parentId: "0", // 当前需要显示的分类列表的父分类ID
      parentName: "", // 当前需要显示的分类列表的父分类名称
      showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
      allCategorys: [],
      category: {} // 选中的role
    };
  },
  components: { CategoryForm },
  created() {
    this.getCategorys();
  },
  methods: {
    addOrUpdateCategory(category) {
      if (category._id) {
        this.categorydialog = {
          show: true,
          title: "修改分类"
        };
        this.category = category;
      } else {
        this.categorydialog = {
          show: true,
          title: "添加分类"
        };
        this.category = {
          name: ""
        };
      }
    },
    showCategorys() {
      this.parentId = "0";
      this.parentName = "";
      this.getCategorys();
    },
    showSubCategory(category) {
      this.parentId = category._id;
      this.parentName = category.name;
      console.log("parentId", this.parentId); // '0'
      this.getCategorys();
    },
    async getCategorys(parentId) {
      this.loading = true;
      parentId = parentId || this.parentId;
      const result = await reqCategorys(parentId);
      this.loading = false;
      // debugger;
      if (result.status === 0) {
        const categorys = result.data;
        this.allCategorys = categorys;
        this.categorys = categorys;
        this.setPaginations();
      } else {
        this.$message({
          message: "获取分类列表失败",
          type: "success"
        });
      }
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.categorys = this.allCategorys.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      let index = this.paginations.page_size * (page - 1);
      let nums = this.paginations.page_size * page;
      let tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allCategorys[i]) {
          tables.push(this.allCategorys[i]);
        }
      }
      this.categorys = tables;
    },
    setPaginations() {
      this.paginations.total = this.allCategorys.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;

      this.categorys = this.allCategorys.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onRow(row, column, event) {
      console.log("row onClick()", row);
      this.category = row;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
</style>
