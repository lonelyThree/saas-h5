<template>
    <div class="main-content customer-content">
        <div class="order-header">
            <div :class="isSelect==0?'active':''" @click="select('0')">全部</div>
            <div :class="isSelect==5?'active':''" @click="select('5')">待付款</div>
            <div :class="isSelect==1?'active':''" @click="select('1')">待发货</div>
            <div :class="isSelect==2?'active':''" @click="select('2')">待收货</div>
            <div :class="isSelect==3?'active':''" @click="select('3')">已完成</div>
            <!-- <div :class="isSelect==4?'active':''" @click="select('4')">已关闭</div> -->
        </div>
        <div class="oder-box">
      <van-list
        v-if="priceInfo.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        style="flex-direction: column;"
        @load="onLoad"
      >
      <van-cell class="oder-card" v-for="(item,index) in priceInfo" :key="index" @click="goDetail(item)" v-if="item.status != -1">
        <div class="order-card-title">
          <div class="order-card-title-time">下单时间：{{item.create_time}}</div>
          <div class="order-card-title-go" v-if="item.status==1">待发货</div>
          <div class="order-card-title-go" v-if="item.status==2">待收货</div>
          <div class="order-card-title-go" v-if="item.status==5">待支付</div>
          <div class="order-card-title-close" v-if="item.status==4 || item.status == 6 || item.status == 7">已关闭</div>
        </div>
        <div class="order-card-list" v-for="(itt,kk) in item.pret" v-if="item.m_type == 1">
          <div class="order-card-list-item">
            <div class="order-card-list-left">
              <div class="order-card-list-name">
                <p>{{itt.name}} {{itt.spec}}</p>
                <p>{{itt.company_name}}</p>
              </div>
            </div>
            <div class="order-num">x{{itt.num}}</div>
          </div>
        </div>

        <herb-info :pret_info = 'item.pret_info.herb_info' :pret_num = 'item.pret_info.num' v-if="item.m_type == 2"></herb-info>

        <div class="order-bottom">
          <div class="order-bottom-go" v-if="item.type==2">到店自提</div>
          <div class="order-bottom-go" v-if="item.type==3">送药到家</div>
          <div class="order-bottom-totle">合计：<p><span>￥</span><i>{{item.money}}</i></p></div>
        </div>
        <div class="order-bottom order-remind-time" v-if="item.remind_time> 0 && item.status == 5">
          <van-count-down :time="item.remind_time" format="DD天HH时mm分ss秒后订单关闭"  @finish="timeFinish(item)"  />
        </div>
        
        <div class="btn-box">
            <div class="btn btn-gray" @click.stop="goConsult(item)">
              <span>联系客服</span>
            </div>
            <div class="btn btn-red" v-if="item.status == 4 || item.status == 6 || item.status == 7" @click.stop="goDel(item)"> <!--2 专医开方-->
                <span>删除订单</span>
              </div>
            <div class="btn btn-red" v-if="item.status == 5" @click.stop="goCancel(item)"> <!--2 专医开方-->
              <span>取消订单</span>
            </div>
            <div class="btn"  v-if="item.status == 5" @click.stop="goPay(item)">
              <span>去支付

              </span>
            </div>
            <div class="btn btn-gray" v-if="item.status == 2 || item.status == 3" @click.stop="goExpress(item)"> <!--2 专医开方-->
                <span>查看物流</span>
              </div>
            <div class="btn btn-red" v-if="item.status == 2" @click.stop="goRecipt(item)"> <!--2 专医开方-->
              <span>确认收货</span>
            </div>
          </div>
      </van-cell>
      </van-list>
      <div v-if="priceInfo.length == 0 && !isdian" class="no-result" flex="dir:top main:center cross:center">
        <div>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";

const router = useRouter()

const { proxy } = getCurrentInstance()

const priceInfo= ref([])
const isSelect=ref(0)


let aid = ""
let uid = ""

const qrcode = ref('')

const regBg = ref("https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1728915183315.png")


setToastDefaultOptions({ duration: 2000 });



function getGuideInfo() {
    // proxy.$axios.get(proxy.$config.domain + 'User/GuideInfo?type=customer&aid='+aid).then(response => {
    //     if (response.data.code === 200) {
    //         const d = response.data.data
    //         if (d.title) {
    //             document.title = d.title
    //         }
    //         if (d.qrcode) {
    //             qrcode.value = d.qrcode
    //         }
    //     } else {
    //         // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
    //     }
    // })
    //     .catch(error => {
    //         // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    //     });
}

onMounted(() => {
    aid = proxy.$route.query.aid
    uid = proxy.$route.query.uid?? ''
    getGuideInfo()



})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    // padding-bottom: 1.45rem;

    background: #fff;
}
.main-content.customer-content {
    .no-result {
  background: #fff;
  height: calc(100vh - 54px);
  img {
    width: 3rem;
    height: 3rem;
  }
  p {
    line-height:0.56rem;
    font-size:0.37rem;
    color:rgba(178,178,178,1);
    margin-top: 0.4rem;
    text-align: center;
    padding-bottom: 1.5rem;
  }
}
  .order-header{
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 44px;
    background: #fff;
    justify-items: center;
    align-items: center;
  }
  .order-header div{
    /*height: 100%;*/
    position: relative;

    height: 100%;
    display: flex;
    align-items: center;
  }
  .order-header .active{
    /*width: 32px;*/
    height: 44px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #01B7C5;
  }
  .order-header .active:before{
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: .05333rem;
    background: #01B7C5;
  }
  .oder-box{
    margin-top: 10px;
    height: calc(100vh - 54px);
    overflow-y: auto;
  }
    .img-div {
        height: 18.8rem;
        position: relative;
        img {
            width: 4.8rem;
            height: 4.8rem;
            position: absolute;
            left: 2.58rem;
            top: 6.833rem;
        }
    }
}

</style>