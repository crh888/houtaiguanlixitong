<template>
  <div>
    <!-- 
      inline：行内表单
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      // 一级分类的数据
      list1: [],

      // 二级分类的数据
      list2: [],

      // 三级分类的数据
      list3: [],
      // 收集相应的一级二级三级分类的 ID
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  props:['show'],
  // 组件加载完毕，获取一级分类数据
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) return (this.list1 = res.data)
    },

    // 一级分类的 select 事件回调 （当一级分类的 option 发生变化时候获取对应的二级分类数据）
    async handler1() {
      // 清除二、三级数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 解构出一级分类的 id
      const { category1Id } = this.cForm
      // 给父组件传值
      this.$emit('getCategoryId', {categoryId:category1Id, level: 1})
      const res = await this.$API.attr.reqCategory2List(category1Id)
      if (res.code === 200) return (this.list2 = res.data)
    },

    // 二级分类的 select 事件回调（获取三级分类的数据）
    async handler2() {
      // 清除三级数据
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', {categoryId:category2Id, level: 2})
      const res = await this.$API.attr.reqCategory3List(category2Id)
      if (res.code === 200) return (this.list3 = res.data)
    },

    // 三级分类的 select 事件回调
    handler3() {
      // 获取三级分类的id
      const {category3Id} = this.cForm
      this.$emit('getCategoryId', {categoryId:category3Id, level: 3})
    }
  }
}
</script>

<style></style>
