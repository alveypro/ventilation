<template>
  <div class="not-found-page">
    <div class="content">
      <div class="icon">🫧</div>
      <h1>页面未找到</h1>
      <p>你访问的页面不存在，可能已移动或被删除。</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.content {
  text-align: center;
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

h1 {
  margin-bottom: 10px;
  color: #303133;
}

p {
  color: #909399;
  margin-bottom: 20px;
}
</style>
