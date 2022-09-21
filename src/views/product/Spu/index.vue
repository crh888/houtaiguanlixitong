<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这个地方有三个部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示 SPU 列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table border stripe style="width: 100%" :data="records">
          <el-table-column label="序号" prop="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button
              ><hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="currentChange"
          @size-change="sizeChange"
          background
        >
          :pager-count="7">
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- table 展示 sku 列表 -->
      <el-table :data="skuList" border stripe v-loading="loading">
        <el-table-column label="名称" prop="skuName" width="width">
        </el-table-column>
        <el-table-column label="价格" prop="price" width="width">
        </el-table-column>
        <el-table-column label="重量" prop="weight" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template v-slot="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 不同分类的 id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的可操作性
      // show: true,
      page: 1, // 分页器当前的页码
      limit: 3, // 每一页需要展示数据的条数
      records: [], // spu 数据列表
      total: 0, //分页器一共要展示数据的条数
      scene: 0, // 代表展示spu 列表 1-添加|修改spu 2-添加 sku
      dialogTableVisible: false, // 控制查看 sku 对话框的显示与隐藏
      spu: {},
      skuList: [], // 存储的是sku列表的数据
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，把子组件的相应的 id 传递给父组件
    // 并获取 spu 数据信息
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 清除 二 三 级的id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取 SPU 列表数据进行展示
        this.getSpuList()
      }
    },

    // 获取 SPU 列表数据的方法
    async getSpuList() {
      const { page, limit, category3Id } = this
      const res = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (res.code === 200) {
        this.records = res.data.records
        this.total = res.data.total
      }
    },

    // 点击分页器第几页按钮的回调
    currentChange(page) {
      this.page = page
      this.getSpuList()
    },

    // 当分页器某一页展示数据的条数发生变化的回到
    sizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },

    // 添加 spu 按钮的图标
    addSpu() {
      this.scene = 1
      // 通知子组件发起请求（两个）
      this.$refs.spu.addSpuData(this.category3Id)
    },

    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1
      // 获取子组件 SpuForm 子组件
      this.$refs.spu.initSpuData(row)
    },

    // 自定义事件回调（SpuForm）
    changeScene({ scene, flag }) {
      // flag 形参区分添加还是修改功能
      this.scene = scene
      // 子组件通知父组件切换场景，需要再次获取 spu 列表的数据进行展示
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        // 如果 spu 信息的数组个数 < 1 返回上一页
        this.getSpuList(this.records.length > 1 ? this.page : (this.page -= 1))
      }
    },

    // 添加 sku 按钮的回调
    addSku(row) {
      // 切换场景
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求 --- 三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // skuform 子组件自定义事件的回调
    changeScenes(scene) {
      // 修改 scene
      this.scene = scene
    },
    // 查看 sku 按钮的回调
    async handler(spu) {
      // dialog 显示
      this.dialogTableVisible = true
      // 保存 spu 信息
      this.spu = spu
      // 获取 sku 列表数据进行展示
      let res = await this.$API.sku.reqSkuList(spu.id)
      if (res.code === 200) {
        this.skuList = res.data
        // loading 遮罩层隐藏
        this.loading = false
      }
    },
    // dialog 关闭的回调
    close(done) {
      // loading 设置为 true
      this.loading = true
      // 清空 skuList 列表的数据
      this.skuList = []
      // 关闭 dialog
      done() // P173
    }
  }
}
</script>

<style></style>
