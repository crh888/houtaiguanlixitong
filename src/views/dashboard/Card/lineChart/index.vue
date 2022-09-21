<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
export default {
  name: 'lineChart',
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏 x 轴
        show: false,
        type: 'category'
      },
      yAxis: {
        // 隐藏 y 轴
        show: false
      },
      // 系列
      series: [
        {
          smooth: true,
          type: 'line',
          data: [10, 7, 33, 4, 8, 40, 99, 20],
          // 拐点的样式设置
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'purple'
          },
          // 区域填充样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'purple' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
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
