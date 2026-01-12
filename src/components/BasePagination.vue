<template>
  <div class="pagination-wrapper">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  total: number
  currentPage?: number
  pageSize?: number
}>()

const emits = defineEmits<{
  change: [{ page: number; size: number }]
}>()

const currentPage = ref(props.currentPage || 1)
const pageSize = ref(props.pageSize || 20)

watch(
  () => props.currentPage,
  (val) => {
    if (val) currentPage.value = val
  }
)

const handleChange = () => {
  emits('change', { page: currentPage.value, size: pageSize.value })
}
</script>

<style scoped>
.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}
</style>
