<template>
    <div class="main-content empty" v-if="showEmpty">
        <van-empty :description="tipMessage"  />
    </div>
    <div class="main-content" v-else-if="askStatus == 0 ||  askStatus == 1 || askStatus == 2 || askStatus == 3  || askStatus == 4">
        <div class="index-bg" :style="{ backgroundImage: 'url(' + indexBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="start-btn-bg" @click="startAnswer" v-if="askStatus == 2 || askStatus == 3">
                <img class="index-edit" src="../../assets/img/edit.png" />
                开始答题
            </div>
            <div class="start-btn-bg time"  v-if="askStatus == 1">
                <div class="down-div" flex="dir:left cross:center">
                        <img src="../../assets/img/time.png" />
                        <div>倒计时</div>
                        <div class="down">{{downStr}}</div>
                    </div>
            </div>
            <div class="start-btn-bg end"  v-if="askStatus == 4">
                活动结束
            </div>
        </div>
        <!-- <div class="">
            <img :src="indexBg" />
        </div>
         -->
        
        <tabbar :index="0" :aid="aid" v-if="aid"/>
    </div>

    <div class="main-content result" v-else-if="askStatus == 5 || askStatus == 6 || askStatus == 7">
        <div class="result-bg" :style="{ backgroundImage: 'url(' + resultBg + ')', backgroundSize: '10rem 21.28rem', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="content">
                
                <div class="topbg">答题结果公布</div>
                <div class="border-bg">
                    <div class="result-bg-div" flex="dir:left cross:center main:center">
                        <img src="../../assets/img/like.png" />
                        <div>答对<span>{{lastCorrect}}</span>题</div>
                    </div>
                    <div class="result-num">+{{lastScore}}</div>
                    <div class="result-time-div">
                        <span class="result-time"><img src="../../assets/img/time.png" />用时 {{lastCost}}s</span>
                    </div>
                    <div class="rank-bg-div">
                        <div class="top">目前总分：<span>{{totalScore}}</span>分</div>
                        <div v-if="rankIndex > 0">暂时排名：第<span>{{rankIndex}}</span>名</div>
                        <div v-else>暂未上榜～</div>
                        <div class="tip" flex="dir:left cross:center main:center">
                            <img v-if="askStatus != 7" src="../../assets/img/edit.png" />
                            <div v-if="askStatus == 7">活动结束后通知最终中奖结果</div>
                            <div v-else-if="askStatus == 5">继续努力哦~</div>
                            <div v-else>明天继续努力哦~</div>
                        </div>
                    </div>
                </div>

                <img src="../../assets/img/ask3.png" />
            </div>
            <div class="start-btn-bg" @click="startAnswer" v-if="askStatus == 5">
                继续答题
            </div>
            <div class="start-btn-bg end down" @click="downBtnClick"  v-if="askStatus == 6">
                <div  flex="dir:left cross:center main:center">
                    <div>继续答题</div>
                    <div class="down">({{contiueDownStr}})</div>
                </div>
            </div>
        </div>
        <!-- <div class="">
            <img :src="indexBg" />
        </div>
         -->
        
        <tabbar :index="0" :aid="aid"/>
    </div>
    <div class="main-content" v-else-if="askStatus == 8">
        <div class="award-no-bg">
            <div class="empty"></div>
            <div class="award-pro-bg">
                <div class="empty"></div>
                <div class="tip-title">很遗憾</div>
                <img class="award-icon" src="../../assets/img/award-no-pro-icon.png" />
                <div class="tip">本次活动没能中奖<br />下次继续努力哦</div>
                <div class="user-div" flex="dir:left cross:center main:center">
                    <div class="info" flex="dir:top cross:center main:center">
                        <img :src="awardInfo.avatar" />
                        <div class="nick">{{awardInfo.nickname}}</div>
                    </div>
                    <div class="rank-div" flex="dir:top cross:baseline main:left">
                        <div class="rank">排名<span>未上榜</span></div>
                        <div class="score"><span class="score">{{totalScore}}</span><span class="span">分</span></div>
                    </div>
                </div>
            </div>
            <img class="award-btn" src="../../assets/img/award-no-btn.png" />
        </div>
        <!-- <div class="">
            <img :src="indexBg" />
        </div>
         -->
        
        <tabbar :index="0" :aid="aid"/>
    </div>
    <div class="main-content" v-else-if="askStatus == 9 || askStatus == 10">
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
                        <div class="score"><span class="score">{{totalScore}}</span><span class="span">分</span></div>
                    </div>
                </div>
            </div>
            <div class="start-btn-bg end"  v-if="askStatus == 10">
                已领取
            </div>
            <div class="start-btn-bg" @click="addressClick"  v-if="askStatus == 9">
                立即领取
            </div>
            <div class="btn-bottom-empty"></div>
        </div>
        <tabbar :index="0" :aid="aid"/>
    </div>
    <div class="main-content result" v-else>
        <div class="result-bg" :style="{ backgroundImage: 'url(' + resultBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
        </div>
        
        <tabbar :index="0" :aid="aid"/>
    </div>
    
   
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"
import { showDialog } from "vant";


import tabbar from '../../components/custom_tabbar.vue'
import { useRouter } from 'vue-router'

import { activityInfoStatus } from '@/constants/ActivityInfoStatus'


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const tipMessage=ref("正在加载中")
const showEmpty = ref(false)

const indexBg = ref("https://wximg.ai-xbys.com/images/global/XC4bcrB4UWcxcbwcH4rbB4cbkzBU8H.png")
const resultBg = ref("")

const askStatus = ref(0)

const downStr = ref("99时00分01秒")
const contiueDownStr = ref("00分01秒")
// const 

let aid = ref('')
let startTime = 0
let contineTime = 0

let InterValObj = 0
let ContinueInterValObj = 0

let lockGet = 0

const rankIndex = ref(0)
const lastCorrect = ref(0)
const lastScore = ref(0)
const lastCost = ref(0)
const totalScore = ref(0)

const awardInfo = ref({
    avatar: "",
    img: "",
    name: "",
    nickname: "",
    title: ""
})

//将时间减去1秒，计算天、时、分、秒 
function SetRemainTime() {
    let down = startTime - parseInt((new Date()).getTime() / 1000)
    if (down > 1) {

        // down = down - 1
        downStr.value = PrefixInteger(Math.floor(down/(60*60)))+"时" + PrefixInteger(Math.floor((down % 3600)/60)) +
        "分"+PrefixInteger((down % 60)) +"秒"

    } else {//剩余时间小于或等于0的时候，就停止间隔函数 
        window.clearInterval(InterValObj);
        InterValObj = 0;
        //这里可以添加倒计时时间为0后需要执行的事件 
        down = 0

        let timeout = 2000

        if ((new Date()).getMilliseconds() - lockGet < 10000 ) {
            timeout = 30000
        }
        
        lockGet = (new Date()).getMilliseconds()

        setTimeout(() => {
            // console.log("getActivity")
            getActivity()
        }, timeout);
        //  getActivity()
    }
}


//将时间减去1秒，计算天、时、分、秒 
function SetContinueRemainTime() {
    let down = contineTime - parseInt((new Date()).getTime() / 1000)
    // console.log(contineTime, contiueDown.value, "SetContinueRemainTime")
    if (down > 1) {
        // if(down >= 3600) {
        //     contiueDownStr.value = PrefixInteger(Math.floor(down/(60*60)))+"时" + PrefixInteger(Math.floor((down % 3600)/60)) +"分"

        // } else {
            // down = 86400
            contiueDownStr.value = PrefixInteger(Math.floor(down /60)) +"分"+PrefixInteger((down % 60)) +"秒"
        // }

    } else {//剩余时间小于或等于0的时候，就停止间隔函数 
        window.clearInterval(ContinueInterValObj);
        ContinueInterValObj = 0;
        //这里可以添加倒计时时间为0后需要执行的事件 
        contiueDownStr.value = ""

        let timeout = 2000

        if ((new Date()).getMilliseconds() - lockGet < 10000 ) {
            timeout = 30000
            lockGet = (new Date()).getMilliseconds()
        }


        setTimeout(() => {
            // console.log("getActivity")
            getActivity()
        }, timeout);
        //  getActivity()
    }
}

function PrefixInteger(num) {
    if (num > 100) {
        return num
    }
    return (Array(2).join('0') + num).slice(-2)
}



function getActivity() {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Activity/GetInfo?type=index&id='+aid.value).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            showEmpty.value = false
            const d = response.data.data
            if(d.title) {
                document.title = d.title
            }
            // d.ask_status = 5
            indexBg.value = d.start_bg
            resultBg.value = d.result_bg
            // this.patientList = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
            askStatus.value = d.ask_status
            if (d.status == activityInfoStatus.ActivityInfoStatusMobile) {
                let dialogMessage = '注册认证成功后才能参加活动哦'
                let dialogConfirmButtonText = '去注册认证'
                if (d.auth_type != 1) {
                    dialogMessage = '注册后才能参加活动哦'
                    dialogConfirmButtonText = '去注册'

                }
                showDialog({
                    message: dialogMessage,
                    confirmButtonText: dialogConfirmButtonText,
                }).then(() => {
                    router.replace({ name: 'UserReg', query: { id: aid.value, page: 'AskAnswer',
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '认证成功后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'UserMine', query: { id: aid.value, page: 'AskAnswer' } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitAuth) {
                showDialog({
                    message: d.tip_img,
                    showConfirmButton: false,
                })

                return
            } else if (d.ask_status == 1) {
                //
                startTime = d.start_time
                if(!InterValObj) {
                    InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                }
            } else if (d.ask_status == 6) {
                contineTime = parseInt((new Date(new Date().setHours(0, 0, 0, 0))).getTime() / 1000) + 86400
                if (!ContinueInterValObj) {
                    ContinueInterValObj = window.setInterval(SetContinueRemainTime, 1000); //间隔函数，1秒执行
                }
            }

            if (d.rankIndex) {
                rankIndex.value = d.rankIndex
            }
            if (d.lastCorrect) {
                lastCorrect.value = d.lastCorrect
            }
            if (d.lastScore) {
                lastScore.value = d.lastScore
            }
            if (d.lastCost) {
                lastCost.value = d.lastCost
            }

            if (d.totalScore) {
                totalScore.value = d.totalScore
            }

            if(d.award) {
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

function startAnswer() {
    if (askStatus.value == 3) {
         router.replace({name: 'UserReg', query:{id:aid.value, page:'AskAnswer'}})
    } else {
         router.replace({name: 'AskAnswer', query:{id:aid.value}})
    }
   
}

function addressClick() {
    router.replace({name: 'UserAddress', query:{id:aid.value, page:'AskIndex'}})
}

function downBtnClick() {
    showDialog({
        message: '今日已题目答完，明天再继续哦',
    }).then(() => {
    // on close
    });
}



onMounted(() => {
    let id = route.query.id
    if(!id || typeof id !== 'string') {
        showEmpty.value = true
        tipMessage.value = "未找到活动"
        return
    }
    aid.value = id
    getActivity()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    padding-bottom: 1.45rem;
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

.start-btn-bg.down{
    width: 7rem;
    height: 1.68rem;
    line-height: 1.68rem;
}

.start-btn-bg.time{
    font-size: 0.4rem;
}
.index-bg{
    width: 10rem;
    height: 19.96rem;
    .empty{
        width: 0;
        height: 15.9rem;
    }
}
.result-bg{
    width: 10rem;
    min-height: calc(100vh - 1.45rem);
    // height: 21.28rem;
    .empty{
        width: 0;
        height: 1.2rem;
    }
    .content {

        margin-left: 0.44rem;
        width: 9.12rem;

        .topbg {
            width: 9.12rem;
            height: 1.72rem;
            background: url(../../assets/img/ask1.png);
            background-size: 100% 1.72rem;
            font-size: 0.51rem;
            // font-weight: 500;
            color: #FFFFFF;
            line-height: 1.72rem;
            text-align: center;
            vertical-align: middle;
        }

        .border-bg {
            // margin: 17.36rem 1.47rem auto 1.8rem;
            min-height: 1.6rem;
            background: url(../../assets/img/ask2.png);
             background-size: 100% 10.29rem;



            font-size: 0.43rem;
            color: #333;
            // font-weight: 500;
            line-height: 0.63rem;
            min-height: 6rem;
            // padding: 0 0.88rem;
             p {
                line-height: 6rem;
                text-align: center;
                font-size: 1.2rem;
                font-weight: normal;
            }
            .result-bg-div {
                // width: 7.39rem; //8.11-0.72
                // border-radius: 0.21rem;
                // margin-left: 0.43rem;
                font-weight: 500;
                padding-top: 0.4rem;
                img {
                    width: 0.88rem;
                    margin-right: 0.39rem;
                }
                span {
                    color:#FFB505;
                    font-family: Gilroy;
                }
            }

            .result-num {
                margin-top: 0.1rem;
                font-size: 2rem;
                font-family: Gilroy;
                font-weight: bold;
                color: #FFB505;
                line-height: 2rem;
                text-align: center;
            }

            .result-time-div{
                text-align: center;
                margin-top: 0.3rem;
                .result-time {
                    // height: 0.67rem;
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

            

            
            .rank-bg-div {
                margin:0.6rem 1rem 0;
                background: url(../../assets/img/res-rank.png);
                background-size: 100% 100%;
                text-align: center;
                height: 4.36rem;
                position: relative;
                font-weight: 500;
                color: #333333;
                // padding-top: 0.63rem;
                line-height: 0.83rem;
                .top {
                    padding-top: 0.4rem;
                }
                span {
                    font-size: 0.48rem;
                    font-family: Gilroy;
                    font-weight: bold;
                    color: #F19838;
                }
                .tip {

                    margin-top: 0.8rem;
                    img {
                        width: 0.95rem;
                        margin-right: 0.39rem;
                    }
                }
                
            }

            
        }
        
    }
    .start-btn-bg {
        margin-top: 0.4rem;
        .down {
            font-size: 0.48rem;
            padding-left: 0.1rem;
        }
    }
    

}
.award-no-bg,  .award-bg{
    background: url(../../assets/img/award-no-bg.png);
    background-size: 100% 21.28rem;
    background-repeat: no-repeat;
    background-color: #fff6e1;;

    width: 10rem;
    min-height: calc(100vh - 1.45rem);
    // height: 21.28rem;
    .empty{
        width: 0;
        height: 1rem;
    }
    .award-pro-bg {
        margin: 0 0.28rem;
        height: 15.76rem;
        background: url(../../assets/img/award-no-pro-bg.png);
        background-size: 100% 15.76rem;
        text-align: center;
        position: relative;
        .empty {
            width: 0;
            height: 2.5rem;
        }
        .tip-title {
            
            // height: 1.07rem;
            font-size: 1.17rem;
            font-family: FZShaoEr-M11;
            font-weight: 500;
            color: #9D9D9D;
        }
        .award-icon {
            margin: 0.3rem 2.36rem 0.5rem;
            width: 4.72rem;
        }
        .tip {
            font-size: 0.48rem;
            // font-weight: 500;
            color: #333333;
            line-height: 0.72rem;
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
    }
    .award-btn {
        margin: 0.12rem 0.76rem 0.8rem;
        width: 8.4rem;
    }
}

.award-bg{
    background: url(../../assets/img/award-bg.png);
    background-size: 100% 21.28rem;

    background-repeat: no-repeat;
    background-color: #e12c22;
    .award-pro-bg {
        background: url(../../assets/img/award-pro-bg.png);
        background-size: 100% 15.76rem;
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
            background: #FFF6E1;
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