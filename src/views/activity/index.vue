<template>
    <div class="main-content">
        <div :style="{background: 'linear-gradient(to bottom,'+bgColor+' 0%, '+bgColor+'88 50%, '+bgColor+'10 100%', height: '3.91rem', marginBottom: '-3rem'}">
        </div>
        <van-swipe :autoplay="3000" lazy-render class="top-swipe">
            <van-swipe-item v-for="item in topList" :key="item.img" @click="gotoUrlPath(item.link)">
                <div style="margin: 0 0.42rem;">
                    <img :src="item.img"  :style="{  borderRadius:'0.4rem 0.4rem 0.7rem 0.7rem'}" />
                </div>
                
            </van-swipe-item>
         </van-swipe>

         <div class="top-items">
           <ul>
             <li v-for="(item,index) in btnList"  :key="item.title"   @click="gotoUrlPath(item.link)">
               <p><img :src="item.img" alt=""></p>
               <p>{{item.title}}</p>
             </li>
           </ul>
        </div>

        <van-swipe :autoplay="3000" lazy-render style="margin-top: 0.5rem;" >
            <van-swipe-item v-for="item in centerList" :key="item.img" @click="gotoUrlPath(item.link)">
                <img :src="item.img"   />
                
            </van-swipe-item>
         </van-swipe>

        <div class="title-div-div">
            <div class="title-div" flex="dir:left cross:center">
                <div class="title-bg" :style="{ background:  bgColor }"></div>
                活动列表
                
            </div>
        </div>
        <div v-for="(item, index) in hotList" class="speak-li" :key="item.img"  @click="gotoUrlPath(item.link)">
            <img :src="item.img">
        </div>
        
        <div class="tip-div" flex="dir:left cross:center main:center">
            <img src="../../assets/img/speak/no-more.png" />
            <div>暂时没有更多活动了~</div>
        </div>

    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast } from "vant";

const { currentRoute } = useRouter()
const router = useRouter()

const { proxy } = getCurrentInstance()

const route = currentRoute.value;

const bgColor = ref('#1248e8')
const topList = ref([])
const btnList = ref([])
const centerList = ref([])
const hotList = ref([])


const jumpMiniProgram = ref(false)


function getActivity() {
    proxy.$axios.get(proxy.$config.domain + 'Activity/ActivityIndex').then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            d.forEach(item => {
                if(item.type == 1) {
                    bgColor.value = item.title
                } else if (item.type == 2) {
                    topList.value = topList.value.concat(item)
                } else if (item.type == 3) {
                    btnList.value = btnList.value.concat(item)
                } else if (item.type == 4) {
                    centerList.value = centerList.value.concat(item)
                } else if (item.type == 5) {
                    hotList.value = hotList.value.concat(item)
                }
                
            });
            
        } else {
            // console.log(response.data.code, "response.data.code", response)
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            showToast(response.data.msg? response.data.msg :'活动获取失败')

        }
    }).catch(error => {
        // showToast('活动获取失败')
        console.log(error, '活动获取失败')
    });
}

function gotoUrlPath(url) {
    if(!url) {
        return
    }
    if(!jumpMiniProgram.value) {
        window.location.replace(url)
        return
    }
    let urlPath = encodeURIComponent(url)
    
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/h5_jump/index?url=' + urlPath})
            return
       }
       window.location.replace(url)

    })
}

function getJsTicket() {
    let url = window.location.href.split('#')[0]
    proxy.$axios.get(proxy.$config.domain + 'User/GetTicketSign?url='+ encodeURIComponent(url)).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            wx.config({
                debug: false,
                appId: d.appId,
                timestamp: d.timestamp,
                nonceStr: d.nonceStr,
                signature: d.signature,
                jsApiList: ['chooseImage'],
                openTagList: ['wx-open-launch-weapp']
            })
            wx.ready(function () {
                console.log('成功了')
            })
            wx.error(function (res) {
                console.log(res)
            })


        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
    .catch(error => {
        // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    });
}

onMounted(() => {
    let channel_name = route.query.channel_name
    if(channel_name && typeof channel_name === 'string' && channel_name == 'weapp') {
        jumpMiniProgram.value = true
        getJsTicket()
    }
    getActivity()
    

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content {
    padding-bottom: 0.8rem;
    background: #FFFFFF;
}
.title-div-div {
    .top-swipe {
        img {
            margin: 0 0,42rem;
            border: 1px solid #12CB7B;
        }
    }
   
    .title-div {
        margin-top: 0.2rem;
        font-size: 0.5rem;
        font-weight: bold;
        color: #494948;
        padding:0.3rem 0;
        background: #FFFFFF;
        .title-bg {
            width: 0.08rem;
            height: 0.68rem;
            background: #12CB7B;
            margin-right: 0.28rem;
            margin-left: 0.42rem;
        }
    }
}

.top-items{ 
        display: flex; 
          margin-top: 0.5rem;
          background:#fff;
          ul{
            display: flex; padding:0 1rem;width:100%; 
            justify-content: space-between;
            li{
            box-sizing: border-box;
              text-align: center;flex:none;
              img{width:1.13rem; height:1.13rem;}
              p{color: #494948;; font-size:0.28rem; margin-top:0.1rem;}
            }
        }
    }
.speak-li {
    margin: 0rem 0.42rem 0.4rem;
    background: #FFFFFF;
    border-radius: 0.27rem;
    box-shadow:0rem 0rem 0.5rem 0rem rgba(128,99,163,0.18);
}
.tip-div {
    font-size: 0.4rem;
    line-height: 1rem;
    color: #aaa;
    img {
        width:0.68rem;
        margin-right: 0.1rem;
    }
}

</style>