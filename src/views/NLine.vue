<template>
  <div class="bar">
    <el-card class="box-card">
      <el-button type="primary" @click="update">更新</el-button>
    </el-card>
    <el-card>
      <div id="main" style="width: 100%;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
// var option =
export default {
  name: "bar",
  data() {
    return {
      barData: {
        sales: [5, 20, 36, 10, 10, 20], // 销量的数组
        stores: [6, 10, 25, 20, 15, 10] // 库存的数组
      }
    };
  },
  mounted() {
    this.drawBar(this.barData);
  },
  watch: {
    barData: {
      handler(newVal, oldVal) {
        this.drawBar(newVal);
      },
      deep: true
    }
  },
  methods: {
    update() {
      this.barData.sales = this.barData.sales.map(sale => sale + 1);
      this.barData.stores = this.barData.stores.reduce((pre, store) => {
        pre.push(store - 1);
        return pre;
      }, []);
    },
    drawBar(barData) {
      var myChart = echarts.init(document.getElementById("main"));
      myChart.clear();
      myChart.setOption({
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        legend: {
          data: ["销量", "库存"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "line",
            data: barData.sales
          },
          {
            name: "库存",
            type: "line",
            data: barData.stores
          }
        ]
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
