<template>
  <div class="left-nav">
    <router-link to="/" class="left-nav-header">
      <img :src="logo" alt="logo" />
      <h1>Admin</h1>
    </router-link>
    <el-menu
      @select="selectMenu"
      :default-active="defaultKey"
      class="el-menu-vertical-demo"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#409EFF"
      :router="isRouter"
    >
      <Menu :menuList="menuList"></Menu>
    </el-menu>
  </div>
</template>

<script>
import logo from "../assets/logo.png";
import menuList from "../config/menuConfig2";
import memoryUtils from "../utils/memoryUtils";
import Menu from "./Menu"; //引进菜单模板

export default {
  name: "leftNav",
  data() {
    return {
      logo,
      menuList,
      isRouter: true,
      defaultKey: "/home"
    };
  },
  created() {
    this.defaultKey = this.$route.path;
    console.log(this.$route.path);
  },
  components: { Menu },
  methods:{
    selectMenu(index,indexPath){
     this.$emit("selectMenu",{index,indexPath});
      // console.log('indexPath',indexPath);
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.left-nav {
  height: 100%;
  margin-top: -0.1px;
  padding-top: 0.1px;
  .left-nav-header {
    display: flex;
    align-items: center;
    height: 80px;
    background-color: #002140;
    img {
      margin: 0 15px;
      width: 40px;
      height: 40px;
    }

    h1 {
      color: white;
      font-size: 20px;
      margin-bottom: 0;
    }
  }
}
</style>
