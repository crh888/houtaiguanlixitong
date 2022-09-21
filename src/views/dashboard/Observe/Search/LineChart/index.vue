<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <svg
        t="1663059412828"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2665"
        width="26"
        height="26"
      >
        <path
          d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016C958.016 757.952 757.952 958.016 512 958.016zM512 129.984C301.344 129.984 129.984 301.344 129.984 512c0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016C894.016 301.344 722.624 129.984 512 129.984z"
          p-id="2666"
        ></path>
        <path
          d="M512 304m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z"
          p-id="2667"
        ></path>
        <path
          d="M512 768c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 753.696 529.664 768 512 768z"
          p-id="2668"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-title">223432</span>
      <span class="main-content">13.1</span>
      <svg
        t="1663059869229"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3767"
        width="16"
        height="16"
      >
        <path
          d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
          p-id="3768"
          fill="#d81e06"
        ></path>
      </svg>
      <svg
        t="1663059974188"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4715"
        width="16"
        height="16"
      >
        <path
          d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
          p-id="4716"
          fill="#1afa29"
        ></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
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
            color: 'skyblue'
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
                  color: 'skyblue' // 0% 处的颜色
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
.header {
  display: flex;
  align-items: center;
}
.search-header {
  margin-right: 20px;
  color: #333333;
}
.main {
  margin: 10px 0;
}
.main-title {
  margin-right: 30px;
}
.main-content {
  margin-right: 15px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>
