<template>
  <el-dialog v-model="isVisible" :title="title" width="80%">
    <slot></slot>
    <template #footer>
      <el-button @click="isVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  visible: boolean
}>()

const emits = defineEmits<{
  close: []
  confirm: []
}>()

const isVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) emits('close')
  },
})

const handleConfirm = () => {
  emits('confirm')
}
</script>
