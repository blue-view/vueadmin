<template>
  <div class="product">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="display:flex;justify-content: space-between">
          <el-form :inline="true" :model="product" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="searchType" placeholder="按名称搜索">
                <el-option label="按名称搜索" value="productName"></el-option>
                <el-option label="按描述搜索" value="productDesc"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchName" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-button @click="addOrUpdateProduct({})" style="height:40px" type="primary" icon="el-icon-plus">添加商品</el-button>
        </div>
      </div>
      <div class="listdatacls">
        <el-table
          ref="product"
          @row-click="onRow"
          :data="products"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="name" label="商品名称" min-width="100"></el-table-column>
          <el-table-column prop="desc" label="商品描述" min-width="100">
            <template slot-scope="scope">{{ scope.row.desc}}</template>
          </el-table-column>
          <el-table-column prop="price" label="价格" min-width="100">
            <template slot-scope="scope">{{'¥'+ scope.row.price }}</template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-button
                @click="updateStatus(scope.row)"
                type="primary"
              >{{scope.row.status===1 ? '下架' : '上架'}}</el-button>
              <div>{{scope.row.status===1 ? '在售' : '已下架'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="showProductDetail(scope.row)">详情</el-button>
              <el-button type="text" @click="addOrUpdateProduct(scope.row)">修改</el-button>
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
  </div>
</template>

<script>
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../api";

export default {
  name: "product",
  data() {
    return {
      loading: false,
      products: [],
      product: {},
      allProducts: [],
      searchType: "",
      searchName: "",
      paginations: {
        page_index: 1,
        total: 0,
        page_size: 5,
        page_sizes: [5, 10, 15, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      }
    };
  },
  components: {},
  created() {
    this.getProducts();
  },
  methods: {
    addOrUpdateProduct(product) {
      this.$router.push({ name: "addOrUpdate", params: { product } });
    },
    showProductDetail(product) {
      console.log(product);
      this.$router.push({ name: "detail", params: { product } });
    },
    async getProducts() {
      const result = await reqProducts(
        this.paginations.page_index,
        this.paginations.page_size
      );
      if (result.status === 0) {
        const { total, list } = result.data;
        // console.log("list", list);
        this.allProducts = list;
        this.products = list;
        //设置分页数据
        this.setPaginations(
          total,
          this.paginations.page_index,
          this.paginations.page_size
        );
      }
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.getProducts();
    },
    handleCurrentChange(page) {
      this.paginations.page_index = page;
      this.getProducts();
    },
    setPaginations(total, page_index, page_size) {
      this.paginations.total = total;
      this.paginations.page_index = page_index;
      this.paginations.page_size = page_size;
    },
    getTemplateRow(index, row) {
      //获取选中数据
      this.templateSelection = row;
      console.log(row);
    },
    onRow(row, column, event) {
      console.log("row onClick()", row);
      this.product = row;
    },

    handleAdd() {
      this.dialog = {
        show: true,
        title: "商品管理"
      };
      this.product = {
        name: "",
        desc: "",
        price: "",
        _id: ""
      };
    },
    async search() {
      this.loading = true;
      const { searchName, searchType } = this;
      let result;
      if (searchName) {
        result = await reqSearchProducts({
          pageNum: this.paginations.page_index,
          pageSize: this.paginations.page_size,
          searchName,
          searchType
        });
      } else {
        // 一般分页请求
        result = await reqProducts(
          this.paginations.page_index,
          this.paginations.page_size
        );
      }
      this.loading = false;
      if (result.status === 0) {
        // 取出分页数据, 更新状态, 显示分页列表
        const { total, list } = result.data;
        this.allProducts = list;
        this.products = list;
        //设置分页数据
        this.setPaginations(
          total,
          this.paginations.page_index,
          this.paginations.page_size
        );
      }
    },
    async updateStatus(product) {
      const { status, _id } = product;
      const newStatus = status === 1 ? 2 : 1;
      const result = await reqUpdateStatus(_id, newStatus);
      if (result.status === 0) {
        this.$message({
          message: "更新商品成功",
          type: "success"
        });
        this.getProducts();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
</style>
