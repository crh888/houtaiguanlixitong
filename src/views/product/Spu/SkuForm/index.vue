<template>
  <div>
    <el-form ref="form" label-width="80px" :inline="false" size="normal">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称" size="normal">
        <el-input
          placeholder="SKU名称"
          size="normal"
          clearable
          v-model="skuInfo.skuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" size="normal">
        <el-input
          placeholder="价格(元)"
          size="normal"
          clearable
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)" size="normal">
        <el-input
          placeholder="重量(千克)"
          size="normal"
          clearable
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述" size="normal">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          size="normal"
          clearable
          v-model="skuInfo.skuDesc"
          @change=""
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" size="normal">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="attr.attrName"
            size="normal"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择"
              value=""
              @change=""
              v-model="attr.attrIdAndValueId"
            >
              <el-option
                :label="attrValue.valueName"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="saleAttr.saleAttrName"
            size="normal"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              value=""
              clearable
              filterable
              v-model="saleAttr.attrIdAndValueId"
              @change=""
            >
              <el-option
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" size="normal">
        <el-table
          border
          stripe
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="80" type="selection"></el-table-column>
          <el-table-column label="图片" width="">
            <template v-slot="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="">
          </el-table-column>
          <el-table-column label="操作" width="">
            <template v-slot="{ row, $index }">
              <el-button
                type="primary"
                size="default"
                @click=""
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item size="normal">
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储照片的信息
      spuImageList: [],
      // 存储销售属性的数组
      spuSaleAttrList: [],
      // 存储平台属性的数组
      attrInfoList: [],
      // 收集 sku 数据的字段
      skuInfo: {
        // 第一类收集的数据，父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定 v-model 收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类：需要自己书写代码
        // 默认图片
        skuDefaultImg: '',
        // 收集图片的字段
        skuImageList: [
          /*  {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            isDefault: 'string',
            skuId: 0,
            spuImgId: 0
          } */
        ],
        // 平台属性
        skuAttrValueList: [
          /* {
            attrId: 0,
            valueId: 0
          } */
        ],
        // 销售属性
        skuSaleAttrValueList: [
          /* {
            id: 0,
            saleAttrId: 0,
            saleAttrName: 'string',
            saleAttrValueId: 0,
            saleAttrValueName: 'string',
            skuId: 0,
            spuId: 0
          } */
        ]
      },
      spu: {},
      // 收集图片的数据字段(缺少 isDefault 字段，将来提交服务器需要整理参数)
      imageList: []
    }
  },
  methods: {
    // 获取 skuform 数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      let resImg = await this.$API.sku.reqSpuImageList(spu.id)
      if (resImg.code === 200) {
        let list = resImg.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      let resSaleAttr = await this.$API.sku.reqSpuSaleAttrList(spu.id)
      if (resSaleAttr.code === 200) {
        this.spuSaleAttrList = resSaleAttr.data
      }
      let resAttrInfo = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      )
      if (resAttrInfo.code === 200) {
        this.attrInfoList = resAttrInfo.data
      }
    },
    // table 表格复选框按钮的事件
    handleSelectionChange(params) {
      // params 获取到用户选中图片的信息数据，但是缺少 isDefault 字段
      this.imageList = params
    },
    // 设置默认按钮的事件回调
    changeDefault(row) {
      // 排他
      this.spuImageList.forEach(item => {
        // 全部的 isDefault 字段设置 0 
        item.isDefault = 0
      })
      // 当前点击的图片的 isDefault 字段设置为 1 
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的回调
    cancel() {
      // 自定义事件，让父组件切换场景为 0 
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的回调
     async save() {
      // 整理参数
      // 整理平台属性
      // 整理平台属性方法一
      const {attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      /* let arr = []
      attrInfoList.forEach(item => {
        // 当前平台属性用户进行选择
        if(item.attrIdAndValueId) {
           const [attrId, valueId] = item.attrIdAndValueId.split(':')
          //  携带给服务器的参数应该是对象
          let obj = {attrId, valueId}
          arr.push(obj)
        }
      }) */
      // 将整理好的数据赋值给相应字段
      
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [ saleAttrId, saleAttrValueId ] = item.attrIdAndValueId.split(':')
          prev.push({  saleAttrId, saleAttrValueId  })
        }
        return prev
      }, [])
      // 整理图片的数据
      // map映射出一个新数组并返回一个新数组
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      let res = await this.$API.sku.reqAddSku(skuInfo)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.cancel();
      }
    }
  }
}
</script>

<style></style>
