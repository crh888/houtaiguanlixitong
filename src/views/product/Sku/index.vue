<template>
  <div>
    <!-- 表格 -->
    <el-table border stripe width="100%" :data="records">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="70"
      ></el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template v-slot="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="70"></el-table-column>
      <el-table-column prop="price" label="价格" width="70"></el-table-column>
      <el-table-column prop="" label="操作">
        <template v-slot="{ row, $index }">
          <el-button
            type="success"
            size="mini"
            @click="sale(row)"
            icon="el-icon-bottom"
            v-if="row.isSale == 0"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            @click="cancel(row)"
            icon="el-icon-top"
            v-else
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            @click="edit"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            @click="getSkuInfo(row)"
            icon="el-icon-info"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            @click=""
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="text-align: center"
      @current-change="getSkuList"
      @size-change="sizeChange"
      :current-page="1"
      :page-sizes="[3, 5, 10]"
      :page-size="10"
      layout="prev, pager, next, jumper, ->, sizes,total"
      :total="total"
      background
    >
      :pager-count="7">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="show"
      :direction="direction"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">11</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              size="mini"
              effect="dark"
              v-for="(attr, index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              @close=""
              style="margin-right: 10px"
              >{{ attr.attrId }}:{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="251px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1, // 代表当前页码
      limit: 10, // 代表当前页面有几条数据
      records: [], // 存储 SKU 列表的数据
      total: 0, // 存储分页器一共展示的数据
      skuInfo: {}, // 存储 sku 详情信息
      show: false, // 控制抽屉的显示与隐藏
      direction: 'rtl' // 控制抽屉效果的打开放向
    }
  },
  mounted() {
    // 获取 sku 列表的方法
    this.getSkuList()
  },
  methods: {
    // 获取 Sku 列表数据的方法
    async getSkuList(pages = 1) {
      this.page = pages
      // 解构出默认参数
      const { page, limit } = this
      let res = await this.$API.sku.reqSkuLists(page, limit)
      if (res.code === 200) {
        this.records = res.data.records
        this.total = res.data.total
      }
    },
    // 分页器展示条数发生改变的回调
    sizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      let res = await this.$API.sku.reqSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message({
          type: 'success',
          message: '上架成功'
        })
      }
    },
    // 上架
    async cancel(row) {
      let res = await this.$API.sku.reqCancel(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message({
          type: 'success',
          message: '下架成功'
        })
      }
    },
    // 编辑
    edit() {
      this.$message('正在开发中')
    },
    // 获取Sku详情的方法
    async getSkuInfo(sku) {
      // 展示抽屉
      this.show = true
      // 获取 Sku 数据
      let res = await this.$API.sku.reqSkuById(sku.id)
      if (res.code === 200) {
        this.skuInfo = res.data
      }
    }
  }
}
</script>

<style>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: 700;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: pink;
  border-radius: 5px;
}
</style>
