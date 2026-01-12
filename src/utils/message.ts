import { ElMessage } from 'element-plus'

export const showSuccess = (message: string = '操作成功') => {
  ElMessage.success(message)
}

export const showError = (message: string = '操作失败') => {
  ElMessage.error(message)
}

export const showWarning = (message: string = '警告') => {
  ElMessage.warning(message)
}

export const showInfo = (message: string = '提示') => {
  ElMessage.info(message)
}
