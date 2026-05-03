<!--底部按钮置灰不可点击-->
<template>
  <div class="main-content bottom-btn">
    <div class="flex-wrap">
      <div class="btn" :class="{'dis-btn': isDisabled}" @click="submitInfo">{{name}}<span class="titlt-desc">{{titleDesc}}</span></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bottomBtn',
  data () {
    return {
    
    }
  },
  props: {
    // 按钮不用字号的副标题
    titleDesc: String,
    name: String,
    // 按钮是否可以 点击 false表示可以点击 true表示不可以点击
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 从父组件传过来的参数
    options:{
      type: Object,
      default: function () {
        return {
          // 需要提交的数据
          data: null,
          // 回掉函数
          callback: function () {},
          // 跳转链接
          link: ''
        }
      }
    }
  },
  methods: {
    submitInfo: function () {
      if(this.isDisabled) {
        return;
      }
      if(this.options.link) {
        this.$router.push({ path: this.options.link});
      }
      // 调用回掉函数
      if(typeof this.options.callback === 'function') {
        this.options.callback();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .btn {
    max-width: 10rem;
    margin: 0 auto;
    height:1.33rem;
    line-height:1.33rem;
    background:#01B7C5;
    box-shadow:0rem 0.04rem 0rem 0rem rgba(255,255,255,0.5);
    text-align: center;
    font-size:0.43rem;
    font-weight:500;
    color:rgba(255,255,255,1);
    letter-spacing:2px;
  }
  .dis-btn {
    background:rgba(234,234,234,1);
    box-shadow:0rem 0.03rem 0.03rem 0rem rgba(0,0,0,0.05);
    border:0.01rem solid rgba(231,231,231,1);
  }
  .titlt-desc {
    font-size: 0.37rem;
    letter-spacing: 0;
  }
}
</style>


