<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >

    <!-- 嵌套对话框 -->
    <el-dialog
      :title="form.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="form.tmName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          label-width="100px"
          required
          prop="logoUrl"
        >
          <!-- 图片上传这里不能使用 v-model，因为不是表单元素 
           action 是图片上传的地址 
           :on-success：可以检测到图片上传成功，并触发该方法
           :before-upload：在上传图片之前会执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- el 表格组件 -->
    <el-table border :data="list">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" prop="logoUrl">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 
      current-page: 当前第几页
      total: 代表分页器一共需要展示数据条数
      page-size: 代表每一页需要展示多少条数据
      page-sizes: 可以设置每一页可以展示多少条数据
      layout：实现分页器的布局
      pager-count: 按钮的数量。如果是9 连续页码是7
      @size-change="handleSizeChange": 当分页器某一页需要展示的数据发生变化的时候会触发
      @current-change="handleCurrentChange" ： 当前页码发生变化会触发
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="this.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页数展示数据的条数
      limit: 3,
      // 总共的数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏的参数
      dialogFormVisible: false,

      // 收集品牌的信息
      form: {
        tmName: '',
        logoUrl: ''
      },

      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        // 品牌 LOGO 的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌的图片', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    // 获取品牌列表数据的方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList(pages = 1) {
      this.page = pages
      // 获取品牌列表的接口
      const result = await this.$API.trademark.reqTradeMarkList(
        this.page,
        this.limit
      )
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(pager) {
      // 修改当前页的参数
      // this.page = pager
      this.getPageList(pager)
    },
    handleSizeChange(limit) {
      // 修改展示数据的条数
      this.limit = limit
      this.getPageList()
    },

    // 显示新增品牌对话框
    showDialog() {
      this.dialogFormVisible = true
      this.form = { tmName: '', logoUrl: '' }
    },

    // 修改某一个品牌
    updateTradeMark(row) {
      // 当前选中的品牌信息
      this.dialogFormVisible = true
      // 使用浅拷贝
      this.form = { ...row }
    },

    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res 是上传成功之后返回给前端的数据
      // file 是
      this.form.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 添加按钮（添加 | 修改品牌）
    addOrUpdateTradeMark() {
      // 当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          const res = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.form
          )
          if (res.code === 200) {
            // 弹出信息：添加 | 修改品牌成功
            this.$message({
              message: this.form.id ? '修改品牌成功' : '添加品牌成功',
              type: 'success'
            })
            // 添加或者修改品牌之后，需要重新获取品牌列表数据进行展示
            this.getPageList()
          }
          this.form = { tmName: '', logoUrl: '' }
          this.dialogFormVisible = false
        } else {
          console.log('error submit!')
          return false
        }
      })
    },

    // 删除指定品牌数据
    deleteTradeMark(row) {
      this.$confirm(`您确定要删除${row.tmName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 当用户点击确定按钮的时候会触发
          const res = await this.$API.trademark.reqDeleteTradeMark(row.id)
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 再次获取品牌列表的数据
            this.getPageList(this.list > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          // 当用户点击取消按钮的时候会触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
