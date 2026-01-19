<template>
  <div class="ai-assistant">
    <el-button class="assistant-trigger" type="primary" @click="drawerOpen = true">
      AI 专家
    </el-button>

    <el-drawer v-model="drawerOpen" size="420px" direction="rtl" class="assistant-drawer">
      <template #header>
        <div class="assistant-header">
          <div>
            <h3>呼吸睡眠 AI 专家</h3>
            <p>基于公开指南与站内知识库的辅助问答。</p>
          </div>
          <el-tag size="small" type="info">全国通用</el-tag>
        </div>
      </template>

      <div class="assistant-body">
        <div class="assistant-notice">
          仅供学习参考，不替代医生诊疗建议。如有严重症状，请及时就医。
        </div>

        <div class="assistant-messages">
          <div
            v-for="item in messages"
            :key="item.id"
            :class="['assistant-message', item.role]"
          >
            <div class="message-bubble">
              <p>{{ item.content }}</p>
              <span class="message-time">{{ item.time }}</span>
            </div>
          </div>
        </div>

        <div class="assistant-suggestions" v-if="!messages.length">
          <p>可以从这些问题开始：</p>
          <div class="suggestion-list">
            <el-button
              v-for="prompt in suggestedPrompts"
              :key="prompt"
              size="small"
              @click="usePrompt(prompt)"
            >
              {{ prompt }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="assistant-footer">
        <el-input
          v-model="inputValue"
          type="textarea"
          :rows="2"
          placeholder="输入你的问题，例如：AHI 下降但仍困怎么办？"
          @keyup.enter.exact.prevent="sendMessage"
        />
        <div class="assistant-actions">
          <el-button size="small" @click="clearChat">清空记录</el-button>
          <el-button type="primary" size="small" :loading="sending" @click="sendMessage">
            发送
          </el-button>
        </div>
        <p class="assistant-hint" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { sendAiChat } from '@/services/aiClient'
import { publicUserLibraryData } from '@/data/public-user-library'
import { clinicalHandbookData } from '@/data/clinical-handbook'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const drawerOpen = ref(false)
const inputValue = ref('')
const sending = ref(false)
const errorMessage = ref('')
const messages = ref<ChatMessage[]>([])
const sessionId = ref('')

const suggestedPrompts = [
  'AHI 下降但仍很困怎么办？',
  '面罩漏气严重怎么处理？',
  'CPAP 和 APAP 有什么区别？',
  '呼吸机需要每天清洁吗？',
]

const storageKey = computed(() => `ai-chat-history:${sessionId.value}`)

const loadHistory = () => {
  const raw = localStorage.getItem(storageKey.value)
  if (raw) {
    try {
      messages.value = JSON.parse(raw)
    } catch (error) {
      messages.value = []
    }
  }
}

const saveHistory = () => {
  localStorage.setItem(storageKey.value, JSON.stringify(messages.value))
}

const buildSessionId = () => {
  const existing = localStorage.getItem('ai-chat-session')
  if (existing) {
    sessionId.value = existing
    return
  }
  const id = `session-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
  sessionId.value = id
  localStorage.setItem('ai-chat-session', id)
}

const toTimestamp = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const scoreItem = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase()
  return tokens.reduce((score, token) => (lower.includes(token) ? score + 1 : score), 0)
}

const buildContext = (query: string) => {
  const tokens = query
    .toLowerCase()
    .split(/[\s,，。；;、/\\|]+/)
    .filter(Boolean)
    .slice(0, 8)
  if (!tokens.length) return ''

  const candidates = [...publicUserLibraryData, ...clinicalHandbookData]
  const ranked = candidates
    .map(item => {
      const text = `${item.title} ${item.summary} ${(item.keywords || []).join(' ')}`
      return { item, score: scoreItem(text, tokens) }
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  if (!ranked.length) return ''

  return ranked
    .map(({ item }) => {
      const points = (item.keyPoints || []).slice(0, 4).join('；')
      return `标题：${item.title}\n摘要：${item.summary}\n要点：${points || '无'}`
    })
    .join('\n\n')
}

const sendMessage = async () => {
  const content = inputValue.value.trim()
  if (!content || sending.value) return
  errorMessage.value = ''
  sending.value = true

  messages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content,
    time: toTimestamp(),
  })
  inputValue.value = ''
  saveHistory()

  try {
    const context = buildContext(content)
    const payload = {
      sessionId: sessionId.value,
      context,
      source: 'airivo-web',
      messages: messages.value.map(item => ({
        role: item.role,
        content: item.content,
      })),
    }
    const response = await sendAiChat(payload)
    messages.value.push({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response.reply || '抱歉，暂时无法回答这个问题。',
      time: toTimestamp(),
    })
    saveHistory()
  } catch (error) {
    errorMessage.value = 'AI 服务暂不可用，请稍后重试。'
  } finally {
    sending.value = false
  }
}

const clearChat = () => {
  messages.value = []
  saveHistory()
}

const usePrompt = (prompt: string) => {
  inputValue.value = prompt
  sendMessage()
}

onMounted(() => {
  buildSessionId()
  loadHistory()
})
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1200;
}

.assistant-trigger {
  border-radius: 999px;
  padding: 10px 18px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
}

.assistant-header h3 {
  margin: 0 0 4px;
  font-size: 18px;
  color: #0f172a;
}

.assistant-header p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.assistant-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 240px);
  overflow: hidden;
}

.assistant-notice {
  font-size: 12px;
  color: #9ca3af;
  border: 1px dashed #e5e7eb;
  padding: 8px 12px;
  border-radius: 10px;
}

.assistant-messages {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.assistant-message {
  display: flex;
  margin-bottom: 12px;
}

.assistant-message.user {
  justify-content: flex-end;
}

.assistant-message.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 78%;
  background: #f3f4f6;
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 13px;
  color: #111827;
  line-height: 1.6;
  position: relative;
}

.assistant-message.user .message-bubble {
  background: #2563eb;
  color: #fff;
}

.message-time {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6px;
}

.assistant-message.assistant .message-time {
  color: #94a3b8;
}

.assistant-suggestions p {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.assistant-footer {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assistant-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assistant-hint {
  font-size: 12px;
  color: #ef4444;
}
</style>
