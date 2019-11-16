<template>
  <div>
    <template v-for="list in menuList">
      <template v-if="hasAuth(list)">
        <el-submenu v-if="list.children" :key="list.label" :index="list.key">
          <template slot="title">
            <i :class="list.icon"  class="icls"></i>
            <span slot="title">{{ list.label}}</span>
          </template>
          <Menu :menuList="list.children"></Menu>
        </el-submenu>
        <el-menu-item v-else :index="list.key" :key="list.label">
          <i :class="list.icon" class="icls"></i>
          <span>{{list.label}}</span>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>
<style>
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>
<script>
import menuList from "../config/menuConfig2";
import memoryUtils from "../utils/memoryUtils";
import storageUtils from "../utils/storageUtils";

export default {
  name: "Menu", //模板名称
  data() {
    return {
      hasAuth: function(item) {
        const { key, isPublic } = item;
        const user = storageUtils.getUser();
        const menus = user.role.menus||[];
        const username = user.username;
        // console.log(item);
        /*
        1. 如果当前用户是admin
        2. 如果当前item是公开的
        3. 当前用户有此item的权限: key有没有menus中
      */
        if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
          return true;
        } else if (item.children) {
          // 4. 如果当前用户有此item的某个子item的权限
          return !!item.children.find(child => menus.indexOf(child.key) !== -1);
        }

        return false;
      }
    };
  },
  methods: {},
  created() {
    // console.log(this.menuList);
  },
  // props: ["menuList"]
  props: {
    menuList: Array
  }
};
</script>
<style >
.icls{
  margin-right: 10px;
  color: #fff;
}
</style>