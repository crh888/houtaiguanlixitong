<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
export default {
  name: 'barChart',
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏 x 轴
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: {
        // 隐藏 y 轴
        show: false
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [10, 7, 33, 4, 8, 40, 99, 20, 33, 22, 9],
          color: 'pink'
        }
      ],
      // 布局的调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      // 提示插件
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
