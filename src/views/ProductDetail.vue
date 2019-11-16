<template>
  <div class="detail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button class="backcls" @click="back" type="text" icon="el-icon-back">&nbsp;</el-button>
        <span>商品详情</span>
      </div>
      <div>
        <span class="left">商品名称：</span>
        <span>{{product.name}}</span>
      </div>
      <el-divider></el-divider>
      <div>
        <span class="left">商品描述：</span>
        <span>{{product.desc}}</span>
      </div>
      <el-divider></el-divider>
      <div>
        <span class="left">商品价格：</span>
        <span>{{product.price}}</span>
      </div>
      <el-divider></el-divider>
      <div>
        <span class="left">所属分类：</span>
        <span>{{cName1}} {{cName2 ? ' --> '+cName2 : ''}}</span>
      </div>
      <el-divider></el-divider>
      <div class="productpic">
        <span class="left">商品图片:</span>
        <span >
          <el-image style="width:150px;height:150px;    margin-right: 10px;" :src="BASE_IMG_URL + img" v-for="(img,index) in product.imgs" :key="index"></el-image>
        </span>
      </div>
      <el-divider></el-divider>
      <div>
        <span class="left">商品详情：</span>
        <span>{{product.desc}}</span>
      </div>
    </el-card>
  </div>
</template>
<script>
import { BASE_IMG_URL } from "../utils/constants";
import { reqCategory } from "../api";

export default {
  name: "detail",
  data() {
    return {
      BASE_IMG_URL: "",
      product: {},
      cName1: "",
      cName2: ""
    };
  },
  created() {
    this.BASE_IMG_URL = BASE_IMG_URL;
    this.product = this.$route.params.product;
    this.getCatefory();
  },
  methods: {
      back(){
          this.$router.back();
      },
    async getCatefory() {
      const { pCategoryId, categoryId } = this.product;
      if (pCategoryId === "0") {
        // 一级分类下的商品
        const result = await reqCategory(categoryId);
        const cName1 = result.data.name;
        this.cName1 = cName1;
      } else {
        // 二级分类下的商品
        /*
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
      const result2 = await reqCategory(categoryId) // 获取二级分类
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

        // 一次性发送多个请求, 只有都成功了, 才正常处理
        const results = await Promise.all([
          reqCategory(pCategoryId),
          reqCategory(categoryId)
        ]);
        const cName1 = results[0].data.name;
        const cName2 = results[1].data.name;
        this.cName1 = cName1;
        this.cName2 = cName2;
      }
    }
  }
};
</script>
<style scoped>
.productpic{
    display: flex;
    height: 150px;
    align-items: center
}
.left {
    margin-right: 15px;
    font-size: 20px;
    font-weight: 700;
}
.backcls{
    font-size: 20px;
    margin-right: 10px;
}
</style>