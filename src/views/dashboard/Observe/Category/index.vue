<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="radio1" size="small">
            <el-radio-button label="上海"></el-radio-button>
            <el-radio-button label="北京"></el-radio-button>
            <el-radio-button label="广州"></el-radio-button>
            <el-radio-button label="深圳"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="charts" ref="charts"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Category',
  data() {
    return {
      radio1: '上海',
      radio2: '上海',
      radio3: '上海',
      radio4: '上海'
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.charts)
    myChart.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    myChart.on('mouseover', (params) => {
      // 获取鼠标移上去那条数据
      const { value, name } = params.data
      // 重新设置标题
      myChart.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
>>> .el-card__header {
  border-bottom: 1px solid #ccc !important;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
