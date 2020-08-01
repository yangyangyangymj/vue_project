<template>
  <div id="main" style="width: 600px;height:400px;"></div>
</template>
<script>
import echarts from "echarts";
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "近一周订单数量",
      },
      tooltip: {},
      legend: {
        data: ["近一周订单数量"],
      },
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "line",
          data: [300, 350, 120, 480, 400, 700, 820],
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>
<style>
</style>