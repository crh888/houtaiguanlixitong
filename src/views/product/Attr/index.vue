<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 展示平台属性数据 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template v-slot="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column width="width" label="属性值名称">
            <template v-slot="{ row, $index }">
              <!-- input 与 span 来回切换 -->
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column width="width" label="操作">
            <template v-slot="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除要删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash 当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性的字段
      attrList: [],
      // 控制表格的显示与隐藏
      isShowTable: true,
      // 收集新增属性 / 修改属性的数据
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值有多个
          // {
          //   attrId: 0, // 相应的属性名的 id
          //   valueName: ''
          // }
        ],
        categoryId: 0, // 三级分类的 id
        categoryLevel: 3 // 服务器也需要区分等级
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // 通过 level 判断 id 的等级，并存储在父组件中
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 发起请求获取平台属性数据
        this.getAttrList()
      }
    },

    // 获取平台属性的数据
    async getAttrList() {
      // 获取分类的 id
      const { category1Id, category2Id, category3Id } = this
      const res = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      if (res.code === 200) return (this.attrList = res.data)
    },

    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        // attrId 是相应属性的 id，添加属性而言，没有 id。
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以新增属性值，需要加上属性的 ID 值
        // 相应属性值的名称
        valueName: '',
        flag: true // 给每一个属性值添加一个标记，用于切换查看模式与编辑模式
      })
      // input 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },

    // 添加属性按钮的回调
    addAttr() {
      // 切换 table 的显示与隐藏
      this.isShowTable = false
      // 清除新增/修改属性的值 并且 收集三级分类的 id
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值有多个
          // {
          //   attrId: 0, // 相应的属性名的 id
          //   valueName: ''
          // }
        ],
        categoryId: this.category3Id, // 收集三级分类的 id
        categoryLevel: 3 // 服务器也需要区分等级
      }
    },

    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      // 由于数据解构当中存在对象里面套数组，数组里面套对象，因此需要是要使用深拷贝
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性元素添加上 flag 标记
      this.attrInfo.attrValueList.forEach((item) => {
        // vue 无法探测普通的属性，item.flag 这样书写的并非响应式数据
        //  item.$set(对象, '新的响应式属性名', 属性值)
        this.$set(item, 'flag', false)
      })
    },

    // 失去焦点事件——切换为查看模式
    toLook(row) {
      // 如果属性值如空，不能作为属性值
      if (row.valueName.trim() === '') {
        this.$message({
          type: 'warning',
          message: '属性名不应为空'
        })
        return
      }
      // 新增的属性值不能重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          // row 是 attrValueList 数组最后一项
          // row !== item 代表排除最后一项（本身）
          return row.valueName === item.valueName
        }
      })
      if (isRepeat)
        return this.$message({
          type: 'warning',
          message: '属性名不应重复'
        })
      row.flag = false
    },

    // 点击 span 的回调，变成编辑模式
    toEdit(row, index) {
      row.flag = true
      // 获取 input 节点，并自动聚焦
      // 点击 span 会触发页面重绘，使用 $nextTick 延迟执行
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // 气泡确认框的确定按钮的回调
    deleteAttrValue(index) {
      // 当前删除操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1)
    },

    // 保存按钮，进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数
      // 数值的值不应该为空， flag 字段应剔除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不为空
          if (item.valueName !== '') {
            // 删除掉 flag
            delete item.flag
            return true
          }
        }
      )
      try {
        // 发请求
        await this.$API.attr.reqAddAttr(this.attrInfo)
        // 展示平台属性列表
        this.isShowTable = true
        // 提示消息
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 保存成功以后，再次获取平台属性
        this.getAttrList()
      } catch (error) {}
    }
  }
}
</script>

<style></style>
