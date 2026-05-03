<template>
    <div class="main-content empty" v-if="showEmpty">
        <van-empty :description="tipMessage"  />
    </div>

    <div class="main-content awardinfo" v-else>
        <div class="award-bg">
            <div class="empty"></div>
            <div class="award-pro-bg">
                <div class="empty"></div>
                <div class="tip-title">中奖啦!</div>
                <img class="award-icon" src="../../assets/img/award-pro-icon.png" />
                <img class="award-pro" :src="awardInfo.img" />
                <div class="pro-title">{{awardInfo.title}}</div>
                <div class="tip">恭喜你咯！获得{{awardInfo.name}}！</div>
                <div class="user-div" flex="dir:left cross:center main:center">
                    <div class="info" flex="dir:top cross:center main:center">
                        <img :src="awardInfo.avatar" />
                        <div class="nick">{{awardInfo.nickname}}</div>
                    </div>
                    <div class="rank-div" flex="dir:top cross:baseline main:left">
                        <div class="rank">排名<span>NO.{{rankIndex}}</span></div>
                        <div class="score" v-if="totalScore > 0"><span class="score">{{totalScore}}</span><span class="span">分</span></div>
                        <div class="score" v-else><span class="score"></span></div>
                    </div>
                </div>
            </div>
            <div class="start-btn-bg end"  v-if="aStatus == 10">
                已领取
            </div>
            <div class="start-btn-bg" @click="addressClick"  v-if="aStatus == 9">
                立即领取
            </div>
            <div class="btn-bottom-empty"></div>
        </div>
    </div>
    
   
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"
import { showDialog } from "vant";


import tabbar from '../../components/custom_tabbar.vue'
import { useRouter } from 'vue-router'


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const tipMessage=ref("正在加载中")
const showEmpty = ref(false)


const aStatus = ref(0)

let aid = ""
let routerName = ""
let aType = ""
let aAType = ''

const rankIndex = ref(0)
const totalScore = ref(0)

const awardInfo = ref({
    avatar: "",
    img: "",
    name: "",
    nickname: "",
    title: ""
})




function getActivity() {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Activity/AwardInfo?type='+aType+'&id='+aid).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            showEmpty.value = false
            const d = response.data.data
            if(d.title) {
                document.title = d.title
            }
            if(d.status != 9 && d.status != 10) {
                router.replace({ path: '/404', query: { msg:'未中奖' } })
            }

        
            aStatus.value = d.status

            if (d.rankIndex) {
                rankIndex.value = d.rankIndex
            }


            if (d.totalScore) {
                totalScore.value = d.totalScore
            }

            if (d.award) {
                awardInfo.value = d.award
            }

            


            

        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
            // showEmpty.value = true
            // tipMessage.value = response.data.msg ?response.data.msg:'网络连接错误，请刷新重试'
            // this.$toast(response.data.message)
        }
    })
        .catch(error => {
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            
            console.log(error)
        });
}



function addressClick() {
    router.replace({name: 'AwardAddress', query:{id:aid, type:aType, atype:aAType, page:routerName}})
}



onMounted(() => {
   
    let id = route.query.id
    if(id && typeof id === 'string') {
        aid = id
    }

    let types = route.query.type
    if(types && typeof types === 'string') {
        aType = types
    }

    let atype = route.query.atype
    if(atype && typeof atype === 'string') {
        aAType = atype
    }



    if (aid == "") {
        router.replace({ path: '/404', query: { msg:'活动不存在' } })
        return
    }

    getActivity()


    let page = route.query.page
    if(page && typeof page === 'string') {
        routerName = page
    }
    getActivity()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    background: #fff5e4;
}
.main-content.empty{
    background: #fff;
}
.main-content.result{
    background: #ffedcd;
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

    position: relative;

    .index-edit {
        width: 1.6rem;
        position: absolute;
        top: 0;
        left: -0.5rem;
    }

    .down-div {
        width: 5.5rem;
            display: inline-flex;
            img {
                width: 0.92rem;
                height: 0.92rem;
                margin-right: .2rem;
            }
            .down {
                flex: 1;
                text-align: right;
                width: 5.2rem;
                padding: 0 0.1rem;
            }
        }
}
.start-btn-bg.end{
    background: url(../../assets/img/btn-bg-gray.png);
    background-size: 100% 100%;
}


.award-bg{
    background: url(../../assets/img/award-bg.png);
    background-size: 100% 21.28rem;

    background-repeat: no-repeat;
    background-color: #e12c22;
    width: 10rem;
    min-height: 100vh;
    // height: 21.28rem;
    .empty{
        width: 0;
        height: 1rem;
    }
    .award-pro-bg {
        margin: 0 0.28rem;
        height: 15.76rem;
        background: url(../../assets/img/award-pro-bg.png);
        background-size: 100% 15.76rem;
        text-align: center;
        position: relative;
        .empty {
            width: 0;
            height: 2.5rem;
        }
        .tip-title {
            color: #FF7C08;
        }
        .award-icon {
            width: 5.36rem;
            position: absolute;
            top: 4.6rem;
            left: 2rem;
            margin: 0;
        }
        .award-pro {
            width: 3.6rem;
            height: 3.6rem;
            margin: 0.6rem auto 0.3rem;
        }
        .pro-title {
            font-size: 0.43rem;
            color: #333333;
            line-height: 0.57rem;
        }
        .tip {
            margin-top: 0.35rem;
            font-size: 0.66rem;
            color: #FFAE00;
            font-weight: 500;
        }
        .user-div {
            // width: 8.35rem;
            height: 4.04rem;
            background: #ECF2F4;
            border-radius: 0.13rem;
            position: absolute;
            bottom: 0.72rem;
            left: 0.55rem;
            right: 0.55rem;
            .info {
                // width: 4rem;
                // height: 0.45rem;
                font-size: 0.48rem;
                font-weight: 500;
                color: #333333;
                line-height: 0.66rem;
                
                img {
                    width: 1.82rem;
                    height: 1.82rem;
                    border-radius: 50%;
                    margin-top: .2rem;
                }
                .nick {
                    margin: 0.15rem 0.2rem 0.6rem;
                    width: 3.6rem;

                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
        }
        .user-div {
            background: #FFF6E1;
        }
        .rank-div {
            flex: 1;
            .rank {
                height: 0.6rem;
                font-size: 0.66rem;
                font-weight: 500;
                color: #333333;
                line-height: 1rem;
                span {
                    font-size: 0.48rem;
                    color: #AAAAAA;
                    line-height: 1rem;
                    margin-left: 0.2rem;
                }
            }
            .score {

                // height: 0.57rem;
                font-size: 0.66rem;
                font-weight: 400;
                color: #333333;
                line-height: 1;

                margin-top: .8rem;
                position: relative;
                
                .score {

                    //height: 0.93rem;
                    font-size: 1.27rem;
                    font-family: Gilroy;
                    font-weight: 800;
                    color: #FF6F00;
                   // line-height: 0.66rem;


                    margin-right: 0.2rem;
                }
                .span {
                    position: absolute;
                    bottom: 0.185rem;
                }
            }
        }
        .rank-div {
            flex: 1;
            .rank {
                span {
                    font-size: 0.66rem;
                    color: #FF6F00;
                    font-weight: 800;
                }
            }
        }
    }
    .award-btn {
        margin: 0.12rem 0.76rem 0.8rem;
        width: 8.4rem;
    }
    .btn-bottom-empty {
        width: 0;
        height: .5rem;
    }
    // .start-btn-bg {
    //     padding-bottom: .5rem;
    // }
}   

</style>