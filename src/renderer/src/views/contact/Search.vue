<template>
  <ContentPanel>
    <div class="search-form">
      <el-input
        v-model="contactId"
        clearable
        placeholder="请输入用户或群组ID"
        size="large"
        @keydown.enter="search"
      ></el-input>
      <div class="search-btn iconfont icon-search" @click="search"></div>
    </div>
  </ContentPanel>
</template>
<script setup>
import { getCurrentInstance, ref } from 'vue'
const { proxy } = getCurrentInstance()
const contactId = ref()
const searchResult = ref({})
const search = async () => {
  if (!contactId.value) {
    proxy.Message.warning('输入ID为空')
    return
  }
  let result = await proxy.Request({
    url: proxy.Api.search,
    params: {
      contactId: contactId.value,
      token: localStorage.getItem('token')
    }
  })
  if (!result) {
    return
  }
  proxy.Message.success('查询成功')
  searchResult.value = result.data
}
</script>

<style lang="scss" scoped>
.search-form {
  padding-top: 50px;
  display: flex;
  align-items: center;
  :deep(.el-input__wrapper) {
    border-radius: 4px 0px 0px 4px;
    border-right: none;
  }
  .search-btn {
    background: #1a9ad1;
    color: #fff;
    line-height: 40px;
    width: 80px;
    text-align: center;
    border-radius: 0px 5px 5px 0px;
    cursor: pointer;
    &:hover {
      background: #5ebde6;
    }
  }
}
.no-data {
  padding: 30px 0px;
}
.search-result-panel {
  .search-result {
    padding: 30px 20px 20px 20px;
    background: #fff;
    border-radius: 5px;
    margin-top: 10px;
    position: relative;
    .contact-type {
      position: absolute;
      left: 0;
      top: 0;
      background: #2cb6fe;
      padding: 2px 5px;
      color: white;
      border-radius: 5px 0px 0px 0px;
      font-size: 12px;
    }
    .op-btn {
      border-radius: 5px;
      margin-top: 10px;
      padding: 10px;
      background: white;
      text-align: center;
    }
  }
}
</style>
