<template>
  <div class="main-content bottom-btn" v-if="showLoading" id="vue-loading">
    <div class="flex-wrap">
      <van-loading size="24px" color="#FFFFFF" vertical><span class="loading-text">{{loadingText}}</span></van-loading>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { Loading } from 'vant';

export default {
  name: 'bottomBtn',
  data () {
    return {
    
    }
  },
  props: {
    // 按钮是否可以 点击 false表示可以点击 true表示不可以点击
    loadingText: {  
      type: String,
      default: ""
    },
    showLoading: {
      type: Boolean,
      default: false
    },
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.flex-wrap {
  position: fixed;
  top: 50%;
  left: 50%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: content-box;
  width: 88px;
  max-width: 70%;
  min-height: 88px;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;
  background-color: rgba(50,50,51,.88);
  border-radius: 8px;
  -webkit-transform: translate3d(-50%,-50%,0);
  transform: translate3d(-50%,-50%,0);
}
.loading-text {
  color: #fff;
}
</style>


