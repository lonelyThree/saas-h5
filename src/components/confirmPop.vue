<template>
  <div class="confirm-pop">
    <van-popup v-model:show="show" class="vant-detail-pop" :position="position" overlay-class="mask-style" :close-on-click-overlay="maskClose">
      <div class="confirm-box">
        <div class="confirm-content-text">{{options.title}}</div>
        <slot></slot>
        <div class="confirm-btn-box">
          <div class="confirm-btn confirm-btn-left" @click="btnLeft">{{options.leftText}}</div>
          <div class="confirm-btn confirm-btn-right" @click="btnRight">{{options.rightText}}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import { Popup } from 'vant'
export default {
  name: 'confirmPop',
  data () {
    return {
      show:false
    }
  },
  watch: {
    'confirmPop'(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.show = newVal
    }
  },
  props: {
    position: {
      type: String,
      default: 'center'
    },
    maskClose: {
      type: Boolean,
      default: false
    },
    confirmPop: {
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
          btnLeftCB: function () {},
          btnRightCB: function () {},
          title: '',
          leftText: '',
          rightText: ''
        }
      }
    }
  },
  methods: {
    btnLeft: function () {
      // 调用回掉函数
      if(typeof this.options.btnLeftCB === 'function') {
        this.options.btnLeftCB();
      }
    },
    btnRight: function () {
      // 调用回掉函数
      if(typeof this.options.btnRightCB === 'function') {
        this.options.btnRightCB();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-box {
  background: rgba(255,255,255,1);
  box-shadow: 0rem 0rem 0.03rem 0rem rgba(0,0,0,0.5);
  border-radius: 0.16rem;
  border: 1px solid rgba(174,174,176,1);
  width: 7.17rem;
}
.confirm-content-text {
  font-size: 0.37rem;
  color: rgba(24,24,24,1);
  line-height: 0.53rem;
  padding: 0.67rem 1rem 0.64rem 1rem;
  text-align: center;
}
.confirm-btn-box {
  border-top: 1px solid #eee;
  height: 1.33rem;
  line-height: 1.33rem;
  display: flex;
  flex-direction: row;
}
.confirm-btn {
  font-size: 0.43rem;
  font-weight: 500;
  color: rgba(24,24,24,1);
  width: 50%;
  text-align: center;
}
.confirm-btn:last-child {
  border-left: 1px solid #eee;
}
</style>
<style scoped>
.vant-detail-pop {
  background: transparent;
}
.confirm-pop >>> .mask-style {
  background-color:rgba(0,0,0,0.48);
}
</style>

