<template>
  <Layout>
    <template #left>
      <div class="drag-panel drag">
        <div class="top-search">
          <el-input
            v-model="searchKey"
            clearable
            placeholder="搜索"
            size="small"
            class="no-drag"
            @keyup="search"
          >
            <template #prefix>
              <span class="iconfont icon-search"></span>
            </template>
          </el-input>
        </div>
      </div>
      <div class="contact-list">
        <template v-for="item in partList" :key="item">
          <div class="part-title">{{ item.partName }}</div>
          <div class="part-list">
            <div
              v-for="sub in item.children"
              :key="sub"
              :class="['part-item', sub.path == route.path ? 'active' : '']"
              @click="partJump(sub)"
            >
              <div
                :class="['iconfont', sub.icon]"
                :style="{ background: sub.iconBgColor, 'border-radius': '5px' }"
              ></div>
              <div class="text">{{ sub.name }}</div>
            </div>
            <template v-for="contact in item.contactData" :key="contact"> </template>
            <template v-if="item.contactData && item.contactData.length == 0">
              <div class="no-data">
                {{ item.emptyMsg }}
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>
    <template #right>
      <div class="title-panel drag">{{ rightTitle }}</div>
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive>
            <component :is="Component" ref="componentRef"></component>
          </keep-alive>
        </transition>
      </router-view>
    </template>
  </Layout>
</template>

<script setup>
// import { it } from 'element-plus/es/locales.mjs'
import { ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()

const router = useRouter()
// router.push('/contact/blank')
const { proxy } = getCurrentInstance()
const searchKey = ref()
const rightTitle = ref()
const partList = ref([
  {
    partName: '新朋友',
    children: [
      {
        name: '搜索好友',
        icon: 'icon-search',
        iconBgColor: '#fa9d3b',
        path: '/contact/search'
      },
      {
        name: '新的朋友',
        icon: 'icon-plane',
        iconBgColor: '#08bf61',
        path: '/contact/contactNotice',
        showTitle: true,
        contKey: 'conatctApplyCount'
      }
    ]
  },
  {
    partName: '我的群聊',
    children: [
      {
        name: '新建群聊',
        icon: 'icon-add-group',
        iconBgColor: '#1485ee',
        path: '/contact/createGroup'
      }
    ],
    contactId: 'groupId',
    contactName: 'groupName',
    showTitle: true,
    contactData: [],
    contactPath: '/contact/groupDetail'
  },
  {
    partName: '加入的群聊',
    contactId: 'contactId',
    contactName: 'contactName',
    showTitle: true,
    contactData: [],
    contactPath: '/contact/groupDetail',
    emptyMsg: '暂未加入群聊'
  },
  {
    partName: '我的好友',
    children: [],
    contactId: 'contactId',
    contactName: 'contactName',
    // showTitle: true,
    contactData: [],
    contactPath: '/contact/userDetail',
    emptyMsg: '暂无好友'
  }
])
const partJump = (data) => {
  if (data.showTitle) {
    rightTitle.value = data.name
  } else {
    rightTitle.value = null
  }
  //TODO 处理右上角提示变成已读
  router.push(data.path)
}
</script>

<style lang="scss" scoped>
.drag-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 45px;
  background-color: #ffffff;
  .el-input {
    --el-input-bg-color: #f5f5f5;
    --el-input-border-color: white;
  }
}
.top-search {
  padding: 25px 10px 15px 10px;
  background-color: white;
  display: flex;
  align-items: center;
  width: 100%;
  .iconfont {
    font-size: 12px;
  }
}
.contact-list {
  border-top: 1px solid #ddd;
  height: calc(100vh - 68px);
  overflow: hidden;
  &:hover {
    overflow: auto;
  }
  .part-title {
    color: #515151;
    padding-left: 10px;
    margin-top: 10px;
  }
  .part-list {
    border-bottom: 1px solid #d6d6d6;
    .part-item {
      display: flex;
      align-items: center;
      padding: 10px 10px;
      &:hover {
        cursor: pointer;
        background-color: #e7e7e7;
      }
      .iconfont {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
      }
      .text {
        flex: 1;
        color: #000000;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .no-data {
      text-align: center;
      font-size: 12px;
      color: #9d9d9d9d;
      line-height: 30px;
    }
    .active {
      background-color: #f0f0f0f0;
      &:hover {
        background-color: #e7e7e7e7;
      }
    }
  }
}
.title-panel {
  height: 66px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 18px;
  color: black;
}
</style>
