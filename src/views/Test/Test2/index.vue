<template>
  <div>
    <el-button
      type="primary"
      size="default"
      @click=""
      v-show="$store.state.user.buttons.indexOf('btn.Add3') != -1"
      >添加按钮3</el-button
    >
  </div>
</template>

<script>
export default {
  name: 'Test1'
}
</script>

<style></style>
