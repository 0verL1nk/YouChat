<script setup lang="js">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { reactive, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const locale = zhCn
const config = reactive({
  max: 1
})
</script>

<template>
  <el-config-provider :locale="zhCn" :message="config">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-config-provider>
</template>

<style lang="less">
// @import './assets/css/styles.less';
</style>
