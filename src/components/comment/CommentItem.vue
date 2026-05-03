<template>
  <div class="comment-item">
    <img :src="comment.avatar" class="avatar" />
    <div class="main">
      <div class="user">{{ comment.user }}</div>
      <div class="text">{{ comment.content }}</div>

      <div class="actions">
        <span class="reply" @click="$emit('reply', comment)">回复</span>
        <span class="like" @click="toggleLike">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="like-icon"
            :class="{ liked: comment.liked }"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z"
            />
          </svg>
          {{ comment.likes }}
        </span>
      </div>

      <!-- 二级回复 -->
      <div v-if="comment.replies.length" class="replies">
        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
          <span class="reply-user">{{ reply.user }}：</span>
          {{ reply.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ comment: Object })
function toggleLike() {
  props.comment.liked = !props.comment.liked
  props.comment.likes += props.comment.liked ? 1 : -1
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.main {
  flex: 1;
}

.user {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.text {
  font-size: 14px;
  color: #111;
  margin-top: 4px;
  line-height: 1.4;
}

.actions {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

.reply,
.like {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 3px;
}

.like-icon {
  width: 14px;
  height: 14px;
  transition: color 0.2s;
}

.like-icon.liked {
  color: #ef4444;
}

.replies {
  margin-left: 28px;
  margin-top: 8px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px 10px;
}

.reply-item {
  font-size: 13px;
  color: #444;
  margin-top: 4px;
}

.reply-user {
  font-weight: 600;
  color: #333;
}
</style>
