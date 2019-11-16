<template>
  <div class="home">
    <div style="display:flex;height:280px">
      <el-card class="home-card" style="width:220px;margin-right:20px;">
        <div slot="header" class="clearfix">
          <span>商品总量</span>
          <i class="el-icon-refresh-right" style="float: right; padding: 3px 0"></i>
        </div>
        <div style class="tongji">
          <div class="ant-statistic-content">
            <span style="font-weight:600">1,128,163</span>
            <span style="font-size:15px;padding-left:5px">个</span>
          </div>
          <div class="ant-statistic-content">
            <span style="font-size:15px;">周同比15 %</span>
            <span style="padding-left:8px">
              <svg
                viewBox="64 64 896 896"
                font-size="15"
                color="red"
                data-icon="arrow-down"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0 0 48.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z"
                />
              </svg>
            </span>
          </div>
          <div class="ant-statistic-content">
            <span style="font-size:15px">日同比15 %</span>
            <span style="padding-left:8px">
              <svg
                viewBox="64 64 896 896"
                font-size="15"
                color="green"
                data-icon="arrow-up"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M868 545.5L536.1 163a31.96 31.96 0 0 0-48.3 0L156 545.5a7.97 7.97 0 0 0 6 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"
                />
              </svg>
            </span>
          </div>
        </div>
      </el-card>
      <div id="main_line" style="height:280px;width:75%;"></div>
    </div>
    <el-card class="home-content">
      <div slot="header" class="clearfix_header">
        <div class="home-menu">
          <span
            :class="isVisited ? 'home-menu-active home-menu-visited' : 'home-menu-visited'"
            @click="handleChange(true)"
          >访问量</span>
          <span :class="isVisited ? '' : 'home-menu-active'" @click="handleChange(false)">销售量</span>
        </div>
        <div style="padding: 3px 0">
          <el-date-picker
            v-model="nowdate"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
          ></el-date-picker>
        </div>
      </div>
      <div style="display:flex;justify-content: space-between">
        <el-card class="box-card" style="width:60%">
          <div slot="header" class="clearfix">
            <span>{{isVisited ? '访问趋势' : '销售趋势'}}</span>
            <i class="el-icon-refresh-right" style="float: right; padding: 3px 0"></i>
            <div id="main_bar" style="width: 100%;height:350px;"></div>
          </div>
        </el-card>
        <el-card class="box-card" style="width:330px;">
          <div slot="header" class="clearfix">
            <span>任务</span>
            <i class="el-icon-refresh-right" style="float: right; padding: 3px 0"></i>
          </div>
          <el-timeline>
            <el-timeline-item
              :hide-timestamp="true"
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >
              <div v-html="activity.content"></div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "home",
  data() {
    return {
      nowdate:'',
      isVisited: true,
      activities: [
        {
          content: "新版本迭代会",
          timestamp: "2018-04-12 20:46",
          color: "#52c41a"
        },
        {
          content: "完成网站设计初版",
          timestamp: "2018-04-03 20:46",
          color: "#52c41a"
        },
        {
          content: "<p>联调接口</p><p>功能验收</p>",
          timestamp: "2018-04-03 20:46",
          color: "#f5222d"
        },
        {
          content: " <p>登录功能设计</p><p>权限验证</p><p>页面排版</p>",
          timestamp: "2018-04-03 20:46",
          color: "#1da57a"
        }
      ]
    };
  },
  mounted() {
    this.drawBar();
    this.drawLine();
  },
  methods: {
    handleChange(isVisited) {
      this.isVisited = isVisited;
    },
    drawLine() {
      var myChart_line = echarts.init(document.getElementById("main_line"));
      myChart_line.clear();
      myChart_line.setOption({
        title: {
          // text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {}
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });
    },
    drawBar() {
      var myChart = echarts.init(document.getElementById("main_bar"));
      myChart.clear();
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ["#3398DB"],
        xAxis: {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "seles",
            data: [38, 52, 61, 145, 48, 38, 28, 38, 68, 38, 58, 90],
            type: "bar"
          }
        ]
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home {
  padding: 24px;
  background: #fff;
  min-height: 850px;
  .home-card {
    float: left;
  }
  .home-content {
    position: absolute;
    top: 420px;
    width: 76%;
    border: 1px solid #e8e8e8;
    .home-menu {
      font-size: 20px;
      span {
        cursor: pointer;
      }
      .home-menu-active {
        border-bottom: 2px solid #3398db;
        color: #3398db;
        padding: 0 0 16px 0;
      }
      .home-menu-visited {
        margin-right: 40px;
      }
    }
    .home-table-left {
      float: left;
      width: 60%;
    }
    .home-table-right {
      float: right;
      width: 330px;
    }
  }
}
.tongji {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
}
.tongji span {
  display: inline-block;
}
.ant-statistic-content {
  margin-bottom: 8px;
  text-align: center;
  font-size: 24px;
  font-family: Tahoma, Helvetica Neue, -apple-system, BlinkMacSystemFont,
    Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
.clearfix_header{
  display: flex;
  justify-content: space-between;
}
</style>
