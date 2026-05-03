<template>
    <div class="pop-content" v-if="popFlag">
      <div class="pop-con">
          <img @click="closePop" src="static/img/doctor/close-pop.png" alt="">
          <p>为保证签署数据真实有效 <br>
请先完成实名认证</p>
          <button @click="goAuth">去认证</button>
      </div>
      <div class="mark-bg"></div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            popFlag:''
        }
    },
    props:{
        isShow:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        isShow(val1,val2){
            console.log(val1,val2,323223)
            this.popFlag = val1
        }
    },
    methods:{
        goAuth(){
            this.$emit('gotoAtuh')
            
    },
    closePop(){
        this.$emit('closeAuthPop')
    }
}}
</script>
<style lang="scss">
 .pop-content{
  .pop-con{
    width:7.1rem;
    height:3.7rem;
    background: #fff;
    border-radius: 0.16rem;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index: 1000;
    img{
      width:0.65rem; height:0.65rem; position: absolute; right:0.2rem; top:0.2rem;
    }
    p{text-align: center; font-size:0.37rem; color:#181818; line-height: 0.5rem; padding-top:0.64rem; margin-bottom: 0.64rem;}
    button{width: 3.68rem; padding:0;
height: 0.85rem; line-height: 0.85rem; display: block; margin: 0 auto;
background: #01B7C5;
border-radius: 0.1rem;
border: 1px solid #8C72D8;font-size: 0.37rem; color:#fff;
}
  }
  .mark-bg{
    z-index: 999;
  }
}
</style>