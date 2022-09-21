<template>
  <div>
    <el-card class="card-head">
      <div slot="header" class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- card body -->
      <div>
        <el-row :gutter="10">
          <el-col :span="12" :offset="0">
            <lineChart></lineChart>
          </el-col>
          <el-col :span="12" :offset="0">
            <lineChart></lineChart>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="" label="排名" width="80" type="index">
          </el-table-column>
          <el-table-column prop="" label="搜索关键字" width="">
          </el-table-column>
          <el-table-column prop="" label="用户数" sortable> </el-table-column>
          <el-table-column prop="" label="周涨幅" sortable> </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          layout="prev, pager, next"
          :total="1000"
          class="pagination"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import lineChart from './LineChart'
export default {
  name: 'Search',
  data() {
    return {
      tableData: [{}]
    }
  },
  components: {
    lineChart
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
>>> .el-card__header {
  border-bottom: 1px solid #ccc !important;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.pagination {
  float: right;
}
</style>
