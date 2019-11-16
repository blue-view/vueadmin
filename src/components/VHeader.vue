<template>
  <div class="Vheader">
    <div class="header-top">
      <span>欢迎, {{username}}</span>
      <el-button type="text" @click="handleClose">退出</el-button>
    </div>
    <div class="header-bottom">
      <div class="header-bottom-left">{{title}}</div>
      <div class="header-bottom-right">
        <span>{{currentTime}}</span>
        <img :src="dayPictureUrl" alt />
        <span>{{weather}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { reqWeather } from "../api";
import menuList from "../config/menuConfig2";
import { formateDate } from "../utils/dateUtils";
import memoryUtils from "../utils/memoryUtils";
import storageUtils from "../utils/storageUtils";
export default {
  name: "Vheader",
  data() {
    return {
      intervalId: 0,
      title: "",
      username: "",
      weather: "",
      dayPictureUrl: "",
      currentTime: ""
    };
  },
  props: {
    selectMenuObj: Object
  },
  watch:{
    
  },
  updated() {
    this.$nextTick(() => {
      this.getTitle(this.$route.path);
    });
  },
  mounted() {
    this.username = storageUtils.getUser().username;
    this.getWeather();
    this.getTime();
    this.getTitle();
  },
  methods: {
    getTitle(selectPath) {
      // 得到当前请求路径
      let path = selectPath || this.$route.path;
      // console.log(path);

      let title = "";
      menuList.forEach(item => {
        if (item.key === path) {
          // 如果当前item对象的key与path一样,item的title就是需要显示的title
          title = item.label;
        } else if (item.children) {
          // 在所有子item中查找匹配的
          const cItem = item.children.find(
            cItem => path.indexOf(cItem.key) === 0
          );
          // 如果有值才说明有匹配的
          if (cItem) {
            // 取出它的title
            title = cItem.label;
          }
        }
      });
      this.title = title;
    },
    handleClose(done) {
      this.$confirm("确认退出吗？")
        .then(_ => {
          // console.log("OK", this);
          // 删除保存的user数据
          storageUtils.removeUser();
          memoryUtils.user = {};
          // 跳转到login
          this.$router.replace("/login");
          done();
        })
        .catch(_ => {});
    },
    async getWeather() {
      // 调用接口请求异步获取数据
      const { dayPictureUrl, weather } = await reqWeather("福州");
      // 更新状态
      this.dayPictureUrl = dayPictureUrl;
      this.weather = weather;
    },
    getTime() {
      var self = this;
      this.currentTime = formateDate(Date.now());
      // 每隔1s获取当前时间, 并更新状态数据currentTime
      this.$nextTick(function() {
        this.intervalId = setInterval(() => {
          const currentTime = formateDate(Date.now());
          self.currentTime = currentTime;
        }, 1000);
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Vheader {
  height: 80px;
  background-color: #fff;
  .header-top {
    height: 40px;
    line-height: 40px;
    padding-right: 30px;
    text-align: right;
    border-bottom: 1px solid #1da57a;
    span {
      margin-right: 10px;
    }
  }
  .header-bottom {
    height: 40px;
    display: flex;
    align-items: center;
    .header-bottom-left {
      position: relative;
      width: 25%;
      text-align: center;
      font-size: 20px;
      &::after {
        content: "";
        position: absolute;
        right: 50%;
        top: 100%;
        transform: translateX(50%);
        border-top: 20px solid white;
        border-right: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-left: 20px solid transparent;
      }
    }
    .header-bottom-right {
      width: 75%;
      text-align: right;
      margin-right: 30px;
      img {
        margin: 0 15px;
        width: 30px;
        height: 20px;
      }
    }
  }
}
</style>
