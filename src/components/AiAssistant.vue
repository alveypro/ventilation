<template>
  <div class="ai-assistant">
    <el-button class="assistant-trigger" type="primary" @click="drawerOpen = true">
      AI 专家
    </el-button>

    <el-drawer v-model="drawerOpen" :size="drawerSize" direction="rtl" class="assistant-drawer">
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

        <div class="assistant-upload">
          <div class="upload-header">
            <span>文档/图片</span>
            <el-tag size="small" type="info">本地保存</el-tag>
          </div>
          <div class="upload-actions">
            <el-button size="small" @click="triggerFile">上传文件</el-button>
            <el-button size="small" text @click="clearDocs" :disabled="!docs.length">清空文档</el-button>
            <input ref="fileInput" type="file" class="hidden-input" :accept="acceptTypes" @change="handleFile" />
          </div>
          <p class="upload-hint">支持 PDF/DOCX/PPTX/TXT/图片，单文件 ≤ 20MB。</p>
          <p class="upload-hint" v-if="docs.length">已选 {{ selectedDocIds.length }} / {{ docs.length }} 份</p>
          <div class="doc-list" v-if="docs.length">
            <div class="doc-item" v-for="doc in docs" :key="doc.id">
              <el-checkbox v-model="selectedDocIds" :label="doc.id">{{ doc.name }}</el-checkbox>
              <span class="doc-meta">{{ formatSize(doc.size) }}</span>
              <el-button text size="small" @click="removeDoc(doc.id)">删除</el-button>
            </div>
          </div>
          <p class="upload-error" v-if="uploadError">{{ uploadError }}</p>
        </div>

        <div ref="messagesContainer" class="assistant-messages">
          <div v-if="!messages.length && !sending" class="assistant-empty">
            <p>还没有对话，先问一个与你当前症状或设备参数相关的问题。</p>
          </div>
          <div
            v-for="item in messages"
            :key="item.id"
            :class="['assistant-message', item.role]"
          >
            <div class="message-bubble">
              <p class="message-content">{{ item.content }}</p>
              <div class="message-meta">
                <span class="message-time">{{ item.time }}</span>
                <el-button v-if="item.role === 'assistant'" text size="small" @click="copyMessage(item.content)">
                  复制
                </el-button>
              </div>
            </div>
          </div>
          <div v-if="sending" class="assistant-message assistant">
            <div class="message-bubble typing">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
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
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="输入你的问题，例如：AHI 下降但仍困怎么办？"
          @keydown="handleInputKeydown"
        />
        <div class="assistant-actions">
          <span class="assistant-shortcut">Enter 发送 · Shift+Enter 换行</span>
          <div class="assistant-action-buttons">
            <el-button size="small" @click="clearChat">清空记录</el-button>
            <el-button size="small" :disabled="!lastQuestion || sending" @click="retryLastQuestion">重试</el-button>
            <el-button type="primary" size="small" :loading="sending" :disabled="cannotSend" @click="sendMessage()">
              发送
            </el-button>
          </div>
        </div>
        <p class="assistant-hint" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { sendAiChat } from '@/services/aiClient'
import { publicUserLibraryData } from '@/data/public-user-library'
import { clinicalHandbookData } from '@/data/clinical-handbook'
import { clearDocs as clearDocStore, deleteDoc, listDocs, saveDoc } from '@/utils/docStore'
import type { StoredDoc } from '@/utils/docStore'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import JSZip from 'jszip'
import mammoth from 'mammoth'

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
const docs = ref<StoredDoc[]>([])
const selectedDocIds = ref<string[]>([])
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const messagesContainer = ref<HTMLDivElement | null>(null)
const lastQuestion = ref('')
const isMobile = ref(false)

const acceptTypes = '.pdf,.docx,.pptx,.txt,.jpg,.jpeg,.png,.webp'
const MAX_FILE_SIZE = 20 * 1024 * 1024

const suggestedPrompts = [
  'AHI 下降但仍很困怎么办？',
  '面罩漏气严重怎么处理？',
  'CPAP 和 APAP 有什么区别？',
  '呼吸机需要每天清洁吗？',
]

const storageKey = computed(() => `ai-chat-history:${sessionId.value}`)

const selectedDocs = computed(() => docs.value.filter(doc => selectedDocIds.value.includes(doc.id)))
const cannotSend = computed(() => !inputValue.value.trim() || sending.value)
const drawerSize = computed(() => (isMobile.value ? '100%' : '440px'))

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

const initPdfWorker = () => {
  try {
    GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
  } catch (error) {
    // ignore
  }
}

const toTimestamp = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const scoreItem = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase()
  return tokens.reduce((score, token) => (lower.includes(token) ? score + 1 : score), 0)
}

const buildContext = (query: string, docText: string) => {
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

  const knowledge = ranked
    .map(({ item }) => {
      const points = (item.keyPoints || []).slice(0, 4).join('；')
      return `标题：${item.title}\n摘要：${item.summary}\n要点：${points || '无'}`
    })
    .join('\n\n')
  const parts = [knowledge, docText].filter(Boolean)
  return parts.join('\n\n')
}

const triggerFile = () => {
  uploadError.value = ''
  fileInput.value?.click()
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

const readText = async (file: File) => {
  return file.text()
}

const readPdfText = async (file: File) => {
  initPdfWorker()
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await getDocument({ data }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const line = content.items.map((item: any) => item.str).join(' ')
    pages.push(line)
  }
  const text = pages.join('\n').trim()
  if (text.length >= 40) {
    return text
  }

  // Fallback for scanned PDFs: OCR the first few pages.
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('chi_sim+eng')
  const maxPages = Math.min(pdf.numPages, 5)
  const ocrTexts: string[] = []
  for (let i = 1; i <= maxPages; i += 1) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) continue
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, viewport }).promise
    const { data } = await worker.recognize(canvas)
    if (data?.text) {
      ocrTexts.push(data.text)
    }
  }
  await worker.terminate()
  const ocrText = ocrTexts.join('\n').trim()
  return ocrText || text
}

const readDocxText = async (file: File) => {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return result.value || ''
}

const readPptxText = async (file: File) => {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide'))
  const texts: string[] = []
  for (const name of slideFiles) {
    const xml = await zip.files[name].async('string')
    const matches = Array.from(xml.matchAll(/<a:t>(.*?)<\/a:t>/g))
    matches.forEach(match => texts.push(match[1]))
  }
  return texts.join('\n')
}

const readImageText = async (file: File) => {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('chi_sim+eng')
  const { data } = await worker.recognize(file)
  await worker.terminate()
  return data.text || ''
}

const extractText = async (file: File) => {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return readPdfText(file)
  if (name.endsWith('.docx')) return readDocxText(file)
  if (name.endsWith('.pptx')) return readPptxText(file)
  if (name.endsWith('.txt')) return readText(file)
  if (name.match(/\.(jpg|jpeg|png|webp)$/)) return readImageText(file)
  return ''
}

const handleFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  uploadError.value = ''
  if (file.size > MAX_FILE_SIZE) {
    uploadError.value = '文件过大，请控制在 20MB 以内。'
    target.value = ''
    return
  }
  try {
    const text = await extractText(file)
    const doc: StoredDoc = {
      id: `doc-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      name: file.name,
      type: file.type || 'unknown',
      size: file.size,
      createdAt: Date.now(),
      text: text.trim(),
    }
    await saveDoc(doc)
    docs.value = await listDocs()
    selectedDocIds.value = docs.value.map(item => item.id)
  } catch (error) {
    uploadError.value = '解析失败，请更换文件重试。'
  } finally {
    target.value = ''
  }
}

const removeDoc = async (id: string) => {
  await deleteDoc(id)
  docs.value = await listDocs()
  selectedDocIds.value = selectedDocIds.value.filter(item => item !== id)
}

const clearDocs = async () => {
  await clearDocStore()
  docs.value = []
  selectedDocIds.value = []
}

const scrollToBottom = () => {
  nextTick(() => {
    if (!messagesContainer.value) return
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  })
}

const updateDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('回答已复制')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const buildReplyText = (reply: string, sources?: string[]) => {
  if (!sources?.length) return reply
  const links = sources.slice(0, 4).map((item, index) => `${index + 1}. ${item}`).join('\n')
  return `${reply}\n\n参考来源：\n${links}`
}

const sendMessage = async (presetContent?: string) => {
  const content = (presetContent ?? inputValue.value).trim()
  if (!content || sending.value) return
  errorMessage.value = ''
  sending.value = true
  lastQuestion.value = content

  messages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content,
    time: toTimestamp(),
  })
  inputValue.value = ''
  saveHistory()
  scrollToBottom()

  try {
    if (docs.value.length && !selectedDocIds.value.length) {
      selectedDocIds.value = docs.value.map(item => item.id)
    }
    const docTextRaw = selectedDocs.value
      .map(doc => `文档：${doc.name}\n${doc.text.slice(0, 3000)}`)
      .join('\n\n')
      .slice(0, 8000)
    const docText = docTextRaw
      ? `以下为用户上传文档的提取内容，请基于其回答：\n${docTextRaw}`
      : docs.value.length
        ? '提示：用户已上传文档，但未提取到可用文本。'
        : ''
    const context = buildContext(content, docText)
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
      content: buildReplyText(response.reply || '抱歉，暂时无法回答这个问题。', response.sources),
      time: toTimestamp(),
    })
    saveHistory()
    scrollToBottom()
  } catch (error) {
    const detail = error instanceof Error ? error.message : ''
    errorMessage.value = detail
      ? `AI 服务暂不可用：${detail}`
      : 'AI 服务暂不可用，请稍后重试或点“重试”。'
    messages.value.push({
      id: `assistant-error-${Date.now()}`,
      role: 'assistant',
      content: detail
        ? `服务暂不可用：${detail}`
        : '服务暂时拥堵，请稍后重试。建议把问题拆短一点再发送。',
      time: toTimestamp(),
    })
    saveHistory()
    scrollToBottom()
  } finally {
    sending.value = false
  }
}

const clearChat = () => {
  messages.value = []
  errorMessage.value = ''
  saveHistory()
}

const usePrompt = (prompt: string) => {
  sendMessage(prompt)
}

const retryLastQuestion = () => {
  if (!lastQuestion.value || sending.value) return
  sendMessage(lastQuestion.value)
}

const handleInputKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' || event.shiftKey) return
  event.preventDefault()
  sendMessage()
}

watch(() => messages.value.length, scrollToBottom)
watch(sending, scrollToBottom)
watch(drawerOpen, value => {
  if (!value) return
  scrollToBottom()
})

onMounted(() => {
  updateDevice()
  window.addEventListener('resize', updateDevice)
  buildSessionId()
  loadHistory()
  listDocs().then(items => {
    docs.value = items
    selectedDocIds.value = items.map(item => item.id)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDevice)
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

.assistant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

.assistant-upload {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  background: #f8fafc;
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
  color: #0f172a;
}

.upload-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 6px;
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: #1f2937;
}

.doc-meta {
  color: #94a3b8;
  margin-left: auto;
  margin-right: 8px;
}

.upload-error {
  color: #ef4444;
  font-size: 12px;
  margin: 6px 0 0;
}

.hidden-input {
  display: none;
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

.assistant-empty {
  border: 1px dashed #dbeafe;
  background: #f8fbff;
  border-radius: 12px;
  padding: 10px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
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

.message-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.assistant-message.user .message-bubble {
  background: #2563eb;
  color: #fff;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 6px;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.assistant-message.assistant .message-time {
  color: #94a3b8;
}

.typing {
  width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #94a3b8;
  animation: blink 1.1s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.16s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.32s;
}

@keyframes blink {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
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
  gap: 8px;
}

.assistant-shortcut {
  font-size: 11px;
  color: #94a3b8;
}

.assistant-action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assistant-hint {
  font-size: 12px;
  color: #ef4444;
}

@media (max-width: 768px) {
  .ai-assistant {
    right: 16px;
    bottom: 16px;
  }

  .assistant-trigger {
    padding: 10px 14px;
  }

  .assistant-body {
    height: calc(100vh - 220px);
  }

  .assistant-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
