<template>
  <div class="comment-list">
    <CommentItem
      v-for="item in comments"
      :key="item.id"
      :comment="item"
      @reply="$emit('reply', item)"
    />
  </div>
</template>

<script setup>
import CommentItem from './CommentItem.vue'
defineProps({ comments: Array })
</script>

<style scoped>
.comment-list {
  padding: 12px;
}
</style>
