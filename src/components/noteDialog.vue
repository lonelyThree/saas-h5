<template>
  <div class="main-content note-pop">
    <van-popup v-model="show" class="vant-detail-pop" :position="position" overlay-class="mask-style" :close-on-click-overlay="maskClose">
      <div class="note-box">
        <div class="note-title" v-if="options.title">{{options.title}}</div>
        <div class="note-content-text" v-html="options.content"></div>
        <div class="note-btn" @click="btn">{{options.btnText}}</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import { Popup } from 'vant';
Vue.use(Popup);
export default {
  name: 'noteDialog',
  data () {
    return {
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
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
          btnCB: function () {},
          title: '',
          content: '',
          btnText: '',
        }
      }
    }
  },
  methods: {
    btn: function () {
      // 调用回掉函数
      if(typeof this.options.btnCB === 'function') {
        this.options.btnCB();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.note-box {
  background: rgba(255,255,255,1);
  box-shadow: 0rem 0rem 0.03rem 0rem rgba(0,0,0,0.5);
  border-radius: 0.16rem;
  border: 1px solid rgba(174,174,176,1);
  width: 7.17rem;
  padding: 0.67rem 0 0;
}
.note-title {
  height:0.59rem;
  font-size:0.43rem;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(24,24,24,1);
  line-height:0.59rem;
  margin-bottom: 0.37rem;
  text-align: center;
}
.note-content-text {
  font-size: 0.37rem;
  color: rgba(24,24,24,1);
  line-height: 0.53rem;
  text-align: left;
  text-align: justify;
  padding: 0 0.4rem 0.64rem;
  text-align: center;
}
.note-btn {
  height: 1.33rem;
  line-height: 1.33rem;
  border-top: 1px solid #eee;
  font-size: 0.43rem;
  font-weight: 500;
  color: rgba(24,24,24,1);
  text-align: center;
}
.note-btn:last-child {
  border-left: 1px solid #eee;
}
</style>
<style scoped>
.vant-detail-pop {
  background: transparent;
}
.note-pop >>> .mask-style {
  background-color:rgba(0,0,0,0.48);
}
</style>

