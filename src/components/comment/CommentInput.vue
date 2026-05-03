<template>
  <!-- 点击遮罩关闭输入框 -->
  <div class="comment-input-overlay" @click.self="emit('close')">
    <div class="comment-input-box">
      <textarea
        v-model="text"
        rows="1"
        class="comment-textarea"
        :placeholder="placeholder"
      ></textarea>

      <div class="comment-input-footer">
        <button class="comment-submit-btn" @click="handleSubmit">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '发表评论...'
  }
})

const emit = defineEmits(['close', 'submit'])
const text = ref('')

function handleSubmit() {
  if (!text.value.trim()) return
  emit('submit', text.value)
  text.value = ''
}
</script>

<style scoped>
.comment-input-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.comment-input-box {
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.25s ease;
}

.comment-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  box-sizing: border-box;
}

.comment-textarea:focus {
  background-color: #f0f0f0;
}

.comment-input-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.comment-submit-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.comment-submit-btn:active {
  transform: scale(0.96);
}

.comment-submit-btn:hover {
  background-color: #dc2626;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
