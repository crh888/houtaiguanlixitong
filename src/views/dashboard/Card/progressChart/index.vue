<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
export default {
  name: 'progressChart',
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏 x 轴
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏 y 轴
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'orange',
          // 柱状图的宽度
          barWidth: 10,
          // 背景颜色的设置
          showBackground: true,
          // 设置背景的颜色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本的设置
          label: {
            show: true,
            // 改变文本标签的内容
            formatter: '|',
            // 文本标签的位置
            position: 'right',
            // 文本标签的颜色
            color: 'orange'
          }
        }
      ],
      // 布局的调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
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
