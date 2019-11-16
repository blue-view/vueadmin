<template>
  <div class="Categoryform">
    <el-dialog
      :title="categorydialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="categorydialog.show"
    >
      <el-row type="flex" class="el-row" v-if="parentId==='0'">
        <el-col :span="4" class="el-col">一级分类:</el-col>
        <el-col :span="20">
          <el-input class="inline" v-model="category.name"></el-input>
        </el-col>
      </el-row>

      <el-row class="el-row" v-else>
        <el-col :span="4" class="el-col">二级分类:</el-col>
        <el-col :span="20">
          <el-input class="inline" v-model="category.name"></el-input>
        </el-col>
      </el-row>
      <div class="text_right">
        <el-button @click="categorydialog.show=false">取消</el-button>
        <el-button type="primary" @click="okHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reqUpdateCategory, reqAddCategory } from "../api";

export default {
  name: "categoryform",
  props: {
    categorydialog: Object,
    category: Object,
    categorys: Array,
    parentId: String
  },
  data() {
    return {};
  },
  methods: {
    async okHandle() {
      // 请求更新
      let result = "";
      let info_success = "";
      let info_fail = "";
      if (this.category._id) {
        console.log(this.parentId, this.category.name);
        result = await reqUpdateCategory({
          categoryName: this.category.name,
          categoryId: this.category._id
        });
        info_success = "更新分类成功";
        info_fail = "更新分类失败";
      } else {
        result = await reqAddCategory(this.category.name, this.parentId);
        info_success = "添加分类成功";
        info_fail = "添加分类失败";
      }
      if (result.status === 0) {
        this.categorydialog.show = false;
        this.$emit("updateCategory");
        this.$message({
          message: info_success,
          type: "success"
        });
      } else {
        this.categorydialog.show = false;
        this.$message({
          message: info_fail,
          type: "success"
        });
      }
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
</style>