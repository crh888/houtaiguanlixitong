<template>
  <div>
    <el-form
      ref="form"
      label-width="80px"
      :inline="false"
      size="normal"
      :model="spu"
    >
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select
          placeholder="请选择品牌"
          clearable
          filterable
          v-model="spu.tmId"
        >
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          clearable
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <!-- 
          list-type="picture-card" 照片墙
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          value=""
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          clearable
          filterable
          v-model="attrId"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr"
            :key="unselect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前 spu 属于自己的销售属性 -->
        <el-table border stripe style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          >
          </el-table-column>
          <el-table-column label="属性名" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值列表" prop="">
            <template v-slot="{ row, $index }">
              <!-- el-tag: 用户展示已有属性值列表的数据 -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template v-slot="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      attrId: '', // 收集未选择的销售属性的 ID
      dialogImageUrl: '', // 对话框图片链接
      dialogVisible: false, // 存储 spu 信息属性
      spu: {
        category3Id: 0, // 3级分类的 id
        description: '', // spu描述
        spuImageList: [
          // 收集 spu 图片信息
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        spuName: '', // spu 的名称
        spuSaleAttrList: [
          // 销售属性与属性值的信息
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: '',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: '',
                saleAttrName: '',
                saleAttrValueName: '',
                spuId: 0
              }
            ]
          } */
        ],
        tmId: '' // 品牌的 id
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储Spu图片的数据
      saleAttrList: [] // 销售属性的数据
    }
  },
  methods: {
    // 照片删除某张图片的时候触发的回调
    handleRemove(file, fileList) {
      // file：已删除的那一张图片
      // fileList：照片墙剩余的图片
      // 收集照片墙图片的数据
      // 对于已有的图片（照片墙中显示的图片：有 name 和 url 字段）需要剔除
      this.spuImageList = fileList
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 照片墙图片上传成功的回调函数
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },

    // 初始化 SpuForm 数据
    async initSpuData(spu) {
      // 获取 spu 信息的数据
      const spuRes = await this.$API.spu.reqSpu(spu.id)
      if (spuRes.code === 200) {
        this.spu = spuRes.data
      }
      // 获取品牌的信息
      const tradeMarkRes = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取 spu 图片的数据
      const spuImageRes = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageRes.code === 200) {
        let listArr = spuImageRes.data
        // 由于照片墙显示的数组中的字段需要有 name 和 url
        // 需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 将处理好的数据赋值给 spuImageList
        this.spuImageList = listArr
      }
      // 获取平台全部的销售属性
      const saleRes = await this.$API.spu.reqBaseSaleAttrList()
      if (saleRes.code === 200) {
        this.saleAttrList = saleRes.data
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性的信息进行分隔
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(':')
      // 向 spu.spuSaleAttrList 数组中添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrId = ''
    },
    // 添加 按钮 的回调
    addSaleAttrValue(row) {
      // 显示 input 输入框
      // 挂载在销售属性身上的响应式数据 inputVisible 控制 button 与 input 的切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据 inputValue 字段收集新增的销售属性
      this.$set(row, 'inputValue', '')
    },
    // el-input 失去焦点的事件
    handleInputConfirm(row) {
      // 结构出销售属性当中收集的数据
      const { baseSaleAttrId, inputValue } = row
      // 判断销售属性值是否为空
      if (inputValue.trim() === '') {
        this.$message({ type: 'warning', message: '属性值不能为空' })
        return
      }
      // 属性值不能重复 也可以用 some （推荐 some）
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      )
      if (!result)
        return this.$message({ type: 'warning', message: '属性值不能重复！' })
      // 新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible为false，显示 button
      row.inputVisible = false
    },

    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带 imageUrl 与 imgName 字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        // 通知父组件回到场景0
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id ? '修改' : '添加'
        })
      }
    },
    // 点击添加 spu 按钮的时候发请求的函数
    async addSpuData(category3Id) {
      // 清除数据
      Object.assign(this._data, this.$options.data())
      // 添加 spu 信息的时候收集三级分类的 id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkRes = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取平台全部的销售属性
      const saleRes = await this.$API.spu.reqBaseSaleAttrList()
      if (saleRes.code === 200) {
        this.saleAttrList = saleRes.data
      }
    },
    // 取消按钮
    cancel() {
      // 通知父组件切换场景为 0
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清除数据
      // Object.assign 是ES6中新增的方法，可以合并对象
      // 组件实例的 this._data，可以操作 data 中的响应式数据
      //  this.$options 可以获取配置对象
      // this.$options.data() 返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr(row) {
      // 在已有的数组中过滤出用户需要的元素
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
