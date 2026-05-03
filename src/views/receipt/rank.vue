<template>
    <div class="main-content empty" v-if="showEmpty">
        <van-empty :description="tipMessage" />
    </div>

    <div class="main-content" v-else>
        <div class="rank-bg"
            :style="{ backgroundImage: 'url(' + rankBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="rank-top" flex="dir:left cross:center">
                <div class="top-li" :class="'top-li-'+index" flex="dir:top cross:center" v-for="(item, index) in rankTopList"  :key="item.openid">
                    <div class="top-avatar" >
                        <img :src="item.avatar"  v-if="item.avatar" />
                        <img src="https://vipimg.ai-xbys.com/base/base/rank-avatar.png"  v-else/>
                        
                    </div>
                    <div class="name">{{item.name}}</div>
                    <div class="score">{{ awardType == 2 ? item.score : (item.score / 100)}}</div>
                    <div class="time">{{item.costTime}}张</div>
                </div>
            </div>
            <!-- <div class="rank-div"> -->

            <van-list
                class="rank-div"
                v-model:loading="loading"
                :finished="finished"
                finished-text=""
                v-model:error="error"
                error-text="请求失败，点击重新加载"
                @load="onLoadRank"
                >
                <van-cell  v-for="(item, index) in rankList" :key="item.openid">
                    <div class="rank-li"  flex="dir:left cross:center">
                        <div class="index">{{index + 4}}.</div>

                        <img :src="item.avatar"  v-if="item.avatar" />
                        <img src="https://vipimg.ai-xbys.com/base/base/rank-avatar.png"  v-else/>
                        <div class="name">{{item.name}}</div>
                        <div class="time">{{item.costTime}}张</div>
                        <div class="score">{{ awardType == 2 ? item.score : (item.score / 100)}}</div>
                    </div>
                </van-cell>
            </van-list>
                <!-- <div class="min"></div> -->
            <!-- </div> -->
            <div class="tip-div">
                <van-icon name="warning" color="#EFA52D"/>
                当前有<span class="num-span">{{joinNum}}</span>名小伙伴参与了问答
            </div>
        </div>
        <!-- <div class="">
            <img :src="indexBg" />
        </div>
         -->

    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import tabbar from '../../components/custom_tabbar.vue'
import { useRouter } from 'vue-router'
import { showToast } from "vant";

import { formatTimeUnixCustom} from "../../js/time"

const { currentRoute } = useRouter();
const route = currentRoute.value;

const { proxy } = getCurrentInstance()

const active = ref(0);
const awardType = ref(1)

const tipMessage = ref("正在加载中")
const showEmpty = ref(true)
const rankBg = ref("")
// const 

let aid = ""

let page = 1
// let lockGet = 0

const rankTopList = ref([
    {
        name: '??',
        avatar: '',
        costTime: '??',
        score: 0,
    },
    {
        name: '??',
        avatar: '',
        costTime: '??',
        score: 0,
    },{
        name: '??',
        avatar: '',
        costTime: '??',
        score: 0,
    }
])
const rankList = ref([])

const joinNum = ref(0)

const loading = ref(true)
const finished = ref(false)
const error = ref(false)

const aStatus = ref(9)

function getActivity() {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Activity/ReceiptRank?type=rank&id=' + aid).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            showEmpty.value = false
            const d = response.data.data
            if (d.title) {
                document.title = d.title + "-活动排行榜"
            }
            rankBg.value = d.rank_bg
            if (d.joinNum) {
                joinNum.value = d.joinNum
            }
            
            if(d.award_type) {
                awardType.value = d.award_type
            }

            if(d.ranks) {
                if (d.ranks.length > 0) {
                    rankTopList.value[1] = d.ranks[0]
                }

                if (d.ranks.length > 1) {
                    rankTopList.value[0] = d.ranks[1]
                }

                if (d.ranks.length > 2) {
                    rankTopList.value[2] = d.ranks[2]
                }
                if (d.ranks.length > 2) {
                    rankList.value = d.ranks.slice(3)
                }
                if (d.ranks.length < 20) {
                    finished.value = true
                }
            
            } else {
                finished.value = true
            }
            
            //  d.ranks = d.ranks.concat(d.ranks)
            //   d.ranks = d.ranks.concat(d.ranks)
            loading.value = false
            page = page + 1
            
           
           
           

            // this.patientList = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
        } else {
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            // showToast(response.data.message)
           
        }
    })
        .catch(error => {
            //  showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            console.log(error)
        });
}


// 

function onLoadRank() {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    // page = 0
    proxy.$axios.get(proxy.$config.domain + 'Activity/ReceiptRank?type=more&page='+page+'&id=' + aid).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            page = page + 1
            if (d.ranks && d.ranks.length > 0) {

                rankList.value = rankList.value.concat(d.ranks)

                 if (d.ranks.length < 20) {
                    finished.value = true
                 }
            } else {
                finished.value = true
            }
            loading.value = false
            
            
            
            
            // if (d.ranks.length > 2) {
                
            // }
            
            
           
           

            // this.patientList = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
        } else {
            error.value = true
            loading.value = false
            
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            // showToast(response.data.message)
           
        }
    })
        .catch(err => {
            error.value = true
            loading.value = false
            //  showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            // console.log(error)
        });
}



onMounted(() => {
    let id = route.query.id
    if (!id || typeof id !== 'string') {
        tipMessage.value = "未找到活动"
        return
    }
    aid = id
    getActivity()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    padding-bottom: 1.45rem;
     background: #ffedcd;
}
.main-content.empty{
    background: #fff;
}
.rank-bg {
    width: 10rem;
    height: 19.19rem;

    .empty {
        width: 0;
        height: 2.2rem;
    }

    .tip-div {
        height: 0.63rem;
        font-size: 0.35rem;
        color: #333333;
        line-height: 0.63rem;
        text-align: center;
        .num-span {
            color:#FF690E
        }
    }

    .rank-top{
        margin-left: 0.47rem;
        width: 9.08rem;
        height: 5.091rem;
        background: url(../../assets/img/rank-top.png);
        background-size:100% 100%;
        font-size: 0.35rem;
        // font-weight: 400;
        color: #333;
        // line-height: 1.3rem;
        text-align: center;

        .top-li {
            flex: 1;
            width: 3.026rem;
            .top-avatar {
                margin-top: 0.5rem;
                width: 1.28rem;
                height: 1.61rem;
                background: url(../../assets/img/rank-2.png);
                background-size:100% 100%;
                position: relative;
                img {
                    position: absolute;
                    bottom: 0.04rem;
                    left: 0.05rem;
                    /* right: 0.4rem; */
                    width: 1.18rem;
                    height: 1.155rem;
                    border-radius: 50%;
                }
            }
            .name {
                height: 0.55rem;
                line-height: 0.55rem;
                margin-top: 0.1rem;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 2.2rem;
            }
            .score {
                font-size: 0.72rem;
                font-family: Gilroy;
                font-weight: 800;
                color: #989898;
                height: 0.75rem;
                line-height: 0.75rem;
            }
            .time {
                padding: 0 0.33rem;
                height: 0.52rem;
                background: #FFAE0040;
                // opacity: 0.15;
                border-radius: 0.28rem;
     
                font-size: 0.35rem;
                font-family: Gilroy;
                color: #FF7200;
                line-height: 0.52rem;

                margin-top: .1rem;
            }

        }
        .top-li.top-li-1 {
            .top-avatar {
                width: 1.73rem;
                height: 2.16rem;
                background: url(../../assets/img/rank-1.png);
                background-size:100% 100%;
                img {
                    position: absolute;
                    bottom: 0.06rem;
                    left: 0.06rem;
                    /* right: 0.4rem; */
                    width: 1.61rem;
                    height: 1.61rem;
                }
                
            }
            .score {    
                color: #FFAE00;
            }
        }
         .top-li.top-li-2 {
            .top-avatar {
                background: url(../../assets/img/rank-3.png);
                background-size:100% 100%;
            }
            
            .score {         
                color: #BD8349;
            }
        }
    }

    .rank-div {
        margin: 0.15rem 0.64rem 0.4rem;
        height: 9.51rem;
        background: #FFFFFF;
        border: 0.08px solid #FFFFFF;
        border-radius: 0.13rem 0.13rem 0.4rem 0.4rem;
        overflow-y: auto;
        .rank-li {
            
            font-weight: bold;
            color: #333333;
            text-align: left;

            .index {
                font-size: 0.4rem;
                font-family: Gilroy;
                font-weight: 800;
            }
            img {
                width: 0.88rem;
                height: 0.88rem;
                border-radius: 50%;
                margin-left: 0.28rem;
                margin-right: 0.28rem;
            }
            .name {
                flex: 1;
                font-size: 0.35rem;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .time {
                padding: 0 0.28rem;
                height: 0.56rem;
                background: #FFAE0040;
                // opacity: 0.15;
                border-radius: 0.28rem;
     
                font-size: 0.35rem;
                font-family: Gilroy;
                color: #FF7200;
                line-height: 0.56rem;


                margin-left: 0.28rem;
                margin-right: 0.28rem;
            }


            .score {

                font-size: 0.45rem;
                font-family: Gilroy;
                font-weight: bold;
                color: #313131;
            }

        }
    }

    

    .start-btn-bg {
        // margin: 17.36rem 1.47rem auto 1.8rem;
        height: 1.6rem;
        background: url(../../assets/img/btn-bg.png);
        background-size: 100% 100%;
        margin-left: 1.8rem;
        width: 6.65rem;


        font-size: 0.7rem;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 1.6rem;
        text-align: center;
    }
}
.showDetail {
    height: 7rem;
    overflow: unset;
    background: url(../../assets/img/pop.png);
    background-size:100% 100%;
    text-align: center;
    .avatar {
        position: absolute;
        top: -1.25rem;
        width: 2.5rem;
        height: 2.5rem;
        left:50%;
        margin-left:-1.25rem;
        border-radius: 50%;
    }
    .name {
        margin-top: 1.6rem;
        font-size: 0.4rem;
        font-weight: bold;
        color: #333333;
        line-height: 0.4rem;
        margin-bottom: 0.2rem;
    }
    .desc {
        margin-top: 0.15rem;
        font-size: 0.37rem;
        color: #FF7200;
        line-height: 0.4rem;
    }
    .score {
        margin-top: 0.3rem;
        font-size: 0.43rem;
        font-weight: bold;
        color: #333333;
        line-height: 0.51rem;

        span {
            font-size: 0.6rem;
            font-family: Gilroy;
            font-weight: bold;
            color: #F19838;
            line-height: 0.51rem;
        }

    }
    .score-num {
        margin-top: 0.5rem;
    }
    .time-div {
        margin-top: 0.2rem;
        .time {
            background: #FFAE0025;
            // opacity: 0.15;
            border-radius: 0.33rem;
            padding: 0.14rem 0.63rem 0.14rem 1.22rem;
            margin-top: 0.3rem;
            font-size: .4rem;
            line-height: 0.67rem;
            text-align: center;
            

            color: #FF7200;
            
            position: relative;

            img {
                width: 0.92rem;
                position: absolute;
                left: 0;
                top: -0.125rem;
            }
        }

    }
    
    .answer-time {
        margin-top: 0.2rem;
        font-size: 0.35rem;
        color: #999;
    }
}
.start-btn-bg.end{
    background: url(../../assets/img/btn-bg-gray.png);
    background-size: 100% 100%;
}
</style>