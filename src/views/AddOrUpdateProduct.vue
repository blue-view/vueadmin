<template>
  <div class="addOrUpdate">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button class="backcls" @click="back" type="text" icon="el-icon-back">&nbsp;</el-button>
        <span>{{isUpdate ? '修改商品' : '添加商品'}}</span>
      </div>
      <el-form
        :model="product"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="product.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input v-model="product.desc" placeholder="请输入商品描述" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            :precision="2"
            v-model="product.price"
            controls-position="right"
            :min="1"
            placeholder="请输入商品价格"
          ></el-input-number>元
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryIds">
          <el-cascader
            v-if="isUpdate"
            placeholder="请指定商品分类"
            v-model="product.categoryIds"
            :options="options"
          ></el-cascader>
          <el-cascader
            v-else
            placeholder="请指定商品分类"
            v-model="product.categoryIds"
            :options="options"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgs">
          <el-upload
            action="/adminApi/manage/img/upload/"
            list-type="picture-card"
            :auto-upload="true"
            :on-change="handleChange"
            :file-list="fileList"
            accept="image/*"
            name="image"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            :limit="limit"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <quill-editor
            ref="myQuillEditor"
            v-model="product.detail"
            :config="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          ></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { reqCategorys, reqAddOrUpdateProduct, reqDeleteImg } from "../api";
import { BASE_IMG_URL } from "../utils/constants";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "addorupdate",
  components: {
    quillEditor
  },
  data() {
    var that = this;
    return {
      editorOption: {
        // something config
      },
      headers: { headers: { "Content-Type": "multipart/form-data" } },
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      product: {},
      rules: {
        name: [
          { required: true, message: "必须输入商品名称", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "必须输入商品描述", trigger: "blur" }
        ],
        price: [
          { required: true, message: "必须输入商品价格", trigger: "blur" },
          { validator: this.validatePrice, trigger: "blur" }
        ],
        categoryIds: [
          { required: true, message: "必须指定商品分类", trigger: "blur" }
        ]
      },
      limit: 4,
      //  categoryIds: [],
      isUpdate: false,
      options: [],
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          // debugger;
          const { level, value } = node;

          // 根据选中的分类, 请求获取二级分类列表
          const subCategorys = await that.getCategorys(value);
          // 二级分类数组有数据
          if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
              value: c._id,
              label: c.name,
              leaf: level > 0
            }));
            // 关联到当前option上
            resolve(childOptions);
          }
        }
      },
      handleChange: (file, fileList) => {
        console.log("handleChange()", file);
        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if (file.status === "success") {
          const result = file.response; // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
          if (result.status === 0) {
            this.$message({
              message: "上传图片成功",
              type: "success"
            });
            const { name, url } = result.data;
            file = fileList[fileList.length - 1];
            file.name = name;
            file.url = url;
          } else {
            this.$message({
              message: "上传图片失败",
              type: "success"
            });
          }
        }

        this.fileList = fileList;
      }
    };
  },
  computed: {
    // editor() {
    //   return this.$refs.myQuillEditor.quill;
    // }
  },
  mounted() {
    // this.str = this.escapeStringHTML(content);
  },
  created() {
    this.product = Object.assign(
      { categoryIds: [] },
      this.$route.params.product
    );
    console.log("this.product", this.product);
    this.isUpdate = !!this.product._id;
    // 保存商品(如果没有, 保存是{})
    const { pCategoryId, categoryId, imgs, detail } = this.product;
    const categoryIds = [];
    if (this.isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
      this.product.categoryIds = categoryIds;
      this.getCategorys("0");

      if (imgs && imgs.length > 0) {
        let fileList = [];
        fileList = imgs.map((img, index) => ({
          uid: -index, // 每个file都有自己唯一的id
          name: img, // 图片文件名
          status: "done", // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
          url: BASE_IMG_URL + img
        }));
        this.fileList = fileList;
      }
    }
  },
  methods: {
    validatePrice: (rule, value, callback) => {
      console.log(value, typeof value);
      if (value * 1 > 0) {
        callback(); // 验证通过
      } else {
        callback(new Error("价格必须大于0")); // 验证没通过
      }
    },
    onEditorBlur(editor) {
      // console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      // console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      // console.log("editor ready!", editor);
    },
    async handleRemove(file, fileList) {
      console.log(file.name);
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        // message.success("删除图片成功!");
        this.$message({
          message: "删除图片成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "删除图片失败",
          type: "success"
        });
      }
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initOptions(categorys) {
      // 根据categorys生成options数组
      const options = categorys.map(c => ({
        value: c._id,
        label: c.name,
        leaf: false // 不是叶子
      }));

      // 如果是一个二级分类商品的更新
      const { isUpdate, product } = this;
      const { pCategoryId } = product;
      if (isUpdate && pCategoryId !== "0") {
        // 获取对应的二级分类列表
        const subCategorys = await this.getCategorys(pCategoryId);
        // 生成二级下拉列表的options
        const childOptions = subCategorys.map(c => ({
          value: c._id,
          label: c.name,
          leaf: true
        }));

        // 找到当前商品对应的一级option对象
        const targetOption = options.find(
          option => option.value === pCategoryId
        );

        // 关联对应的一级option上
        targetOption.children = childOptions;
      }
      // 更新options状态
      this.options = options;
    },
    async getCategorys(parentId) {
      const result = await reqCategorys(parentId); // {status: 0, data: categorys}
      if (result.status === 0) {
        const categorys = result.data;
        // 如果是一级分类列表
        if (parentId === "0") {
          this.initOptions(categorys);
        } else {
          // 二级列表
          return categorys; // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
        }
      }
    },
    back() {
      this.$router.back();
    },
    getImgs() {
      return this.fileList.map(file => file.name);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // alert("submit!");
          // 1. 收集数据, 并封装成product对象
          console.log("this.product", this.product);
          const { name, desc, price, imgs, detail } = this.product;
          let pCategoryId, categoryId;
          if (this.product.categoryIds.length === 1) {
            pCategoryId = "0";
            categoryId = this.product.categoryIds[0];
          } else {
            pCategoryId = this.product.categoryIds[0];
            categoryId = this.product.categoryIds[1];
          }
          let images = this.fileList.length > 0 ? this.getImgs() : imgs;
          const product = {
            name,
            desc,
            price,
            imgs: images,
            detail,
            pCategoryId,
            categoryId
          };

          // 如果是更新, 需要添加_id
          if (this.isUpdate) {
            product._id = this.product._id;
          }

          // 2. 调用接口请求函数去添加/更新
          const result = await reqAddOrUpdateProduct(product);

          // 3. 根据结果提示
          if (result.status === 0) {
            this.$message({
              message: `${this.isUpdate ? "更新" : "添加"}商品成功!`,
              type: "success"
            });
            this.back();
          } else {
            this.$message({
              message: `${this.isUpdate ? "更新" : "添加"}商品失败!`,
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
.productpic {
  display: flex;
  height: 150px;
  align-items: center;
}
.left {
  margin-right: 15px;
  font-size: 20px;
  font-weight: 700;
}
.backcls {
  font-size: 20px;
  margin-right: 10px;
}
</style>