<template>
  <div class="indexcls">
    <div class="navleft">
      <LeftNav @selectMenu="selectMenu"></LeftNav>
    </div>
    <div class="navright">
      <div>
        <VHeader :selectMenuObj="selectMenuObj"></VHeader>
      </div>
      <div class="navdetail" >
        <router-view></router-view>
      </div>
      <div style="Index-footer">
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>

<script>
import VHeader from "../components/VHeader";
import LeftNav from "../components/LeftNav";
import Footer from "../components/Footer";
import memoryUtils from "../utils/memoryUtils";
import storageUtils from "../utils/storageUtils";

export default {
  name: "index",

  mounted() {
    const user = storageUtils.getUser();
    // 如果内存没有存储user ==> 当前没有登陆
    if (!user || !user._id) {
      // 自动跳转到登陆(在render()中)
      // return <Redirect to="/login" />;
      this.$router.replace("/login");
    }
  },
  data() {
   return {
      selectMenuObj: {}
   }
  },
  components: {
    VHeader,
    LeftNav,
    Footer
  },
  methods: {
    selectMenu({ index, indexPath }) {
      this.selectMenuObj.index = index;
      this.selectMenuObj.indexPath = indexPath;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.indexcls {
  width: 100%;
  display: flex;
  background: #f0f2f5;
  box-sizing: border-box;
  min-height: 100%;
}
.navleft {
  position: relative;
  background: #001529;
  transition: all 0.2s;
  flex: 0 0 200px;
  max-width: 200px;
  min-width: 200px;
  width: 200px;
  overflow: hidden;
}
.navright {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  background: #f0f2f5;
  box-sizing: border-box;
}
.navdetail {
  flex: 1;
  background: #fff;
  margin: 20px;
  box-sizing: border-box;
}
</style>
