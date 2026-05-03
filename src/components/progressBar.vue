<template>
  <div class="main-content progress-bar-wrap" :class="{'progress-max-width': barInfo.barList.length == 2}">
    <div class="progress-bar-item" flex="dir:top main:center" v-for="(item, index) in barInfo.barList" :key="index" :class="{'progress-finish': barInfo.step > index}">
      <p class="progress-bar" flex="dir:left main:center cross:center">
        <span class="progress-circle"></span>
        <span class="progress-line" v-if="index != 0"></span>
      </p>
      <p class="progress-text">{{item.text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    barInfo: {
      default: Object
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
.progress-bar-wrap{
  width:10rem;
  padding:0 0.93rem;
  box-sizing: border-box;
  height:1.49rem;
  background:rgba(255,255,255,1);
  box-shadow:0rem 0.03rem 0.05rem 0rem rgba(0,0,0,0.04);
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: space-between;
  .progress-bar-item {
    width: 1.5rem;
    text-align: center;
    .progress-text {
      height:0.53rem;
      line-height:0.53rem;
      color: rgba(102,102,102,1);
      font-size:0.32rem;
      font-weight:500;
      color:rgba(102,102,102,1);
    }
    .progress-bar {
      position: relative;
      height: 0.3rem;
      justify-content: center;
      margin-bottom: 0.16rem;
      .progress-circle {
        width:0.27rem;
        height:0.27rem;
        background: url('../../static/img/doctor/progress-circle.png') no-repeat 0 0;
        background-size: 100%;
        position: relative;
        z-index: 3;
      }
      .progress-line {
        width: 3.33rem;
        height: 1px;
        background: #EEEEEE;
        position: absolute;
        right: 0.72rem;
        top: 0.13rem;
        z-index: 2;
      }
    }
  }
  .progress-finish {
    .progress-text {
      font-size: 0.37rem;
      font-weight: 600;
      color: #01B7C5;
    }
    .progress-line {
      background: #01B7C5 !important;
    }
    .progress-circle{
      background: url('../../static/img/doctor/progress-circle-h.png') no-repeat 0 0 !important;
      background-size: 100% !important;
    }
  }
}
.progress-max-width {
  padding: 0 1.39rem;
  .progress-bar-item {
    width: 2.34rem;
  }
  .progress-line {
    width: 5rem !important;
    right: 1.1rem !important;
  }
}
</style>


