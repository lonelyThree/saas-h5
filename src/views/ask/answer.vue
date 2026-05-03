<template>
    <div class="main-content empty" v-if="showEmpty">
        <van-empty :description="tipMessage" />
    </div>
    <div class="main-content" v-else>
        <div class="answer-bg"
            :style="{ backgroundImage: 'url(' + answerBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="content">
                
                <div class="topbg">
                     <div class="down-div hide-down"  v-if="showDownIndex != 1 ">
                        <img src="../../assets/img/time.png" />
                    </div>
                    <div class="down-div" flex="dir:left cross:center" v-else>
                        <img src="../../assets/img/time.png" />
                        <div>倒计时</div>
                        <div class="down-num">{{ down }}</div>
                        <div class="s-div">s</div>
                    </div>
                </div>
                <div class="border-bg">
                    <div  v-if="showDownIndex != 1 && showDownIndex != 2">
                        <p v-if="showDownIndex == 11 ">预备</p>
                        <p v-if="showDownIndex == 12 ">开始</p>
                        <p v-if="showDownIndex == 13 ">第{{ askIndex }}题</p>
                        
                    </div>
                    <div v-else>
                        <div class="empty"></div>
                        <div class="ask-bg-div" flex="dir:left">
                            <img class="ask-avatar" src="../../assets/img/ask-avatar.png" />
                            <div class="ask-name" flex="dir:top cross:center  box:last">
                                <div>{{ askName }}</div>
                                <div class="num-div">
                                    (<span class="num-num">{{ askIndex }}</span>/<span class="num-sum">{{ askSum }}</span>)
                                </div>
                            </div>
                            
                        </div>
                        <div class="answer-bg-div" v-for="(item, index) in askList" :key="index" :class="item.cla" @click="answerClick(item)">
                            <img :src="require('../../assets/img/icon-err.png')" v-if="item.cla == 'error'"/>

                            <img src="../../assets/img/icon-suc.png" v-if="item.cla == 'success'"/>
                            {{ item.answer }}
                        </div>
                    </div>
                </div>

                <img src="../../assets/img/ask3.png" />
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { showDialog } from "vant";

import { useRouter } from 'vue-router'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const active = ref(0);

const tipMessage = ref("正在加载中")
const showEmpty = ref(true)
const answerBg = ref("")
// const 


const down = ref(10)
const askIndex = ref(0)
const askSum = ref(30)
const showDownIndex = ref(13)

const askName = ref("")


let askNum = ""
let downTimeout = 30


const askList = ref(
    []
);

let aid = ""

let InterValObj = 0
let TipInterValObj = 0

let lockClick = false

let downTip = 0


//将时间减去1秒，计算天、时、分、秒 
function SetTipRemainTime() {
    if (downTip > 1) {
        
        downTip = downTip- 1
        if (downTip ==   3) {
            showDownIndex.value = 11
        }else if (downTip == 2) {
            showDownIndex.value = 12
        } else if (downTip==  1){
            showDownIndex.value = 13
        }
    } else {//剩余时间小于或等于0的时候，就停止间隔函数 
        window.clearInterval(TipInterValObj);
        TipInterValObj = 0;

        showDownIndex.value = 1
        
        resetInterValObj()
        
    }
}

function resetTipInterValObj() {
    if (TipInterValObj) {
        window.clearInterval(TipInterValObj)
        TipInterValObj = 0
    }
    TipInterValObj = window.setInterval(SetTipRemainTime, 500); //间隔函数，200ms执行
    
}

function resetInterValObj() {
    if (InterValObj) {
        window.clearInterval(InterValObj)
        InterValObj = 0
    }
    InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
    
}

//将时间减去1秒，计算天、时、分、秒 
function SetRemainTime() {
    // console.log("SetRemainTime", down.value, showDownIndex.value)
    if (down.value > 1) {
        down.value  = down.value  - 1
        showDownIndex.value = 1
    } else {//剩余时间小于或等于0的时候，就停止间隔函数 
        window.clearInterval(InterValObj);
        InterValObj = 0;
        //这里可以添加倒计时时间为0后需要执行的事件 
        down.value = 0
        // askList.value.forEach(el => {
        //     el.cla = "error"
        // });

        // setTimeout(() => {
        lockClick = true
        answerActivity('', downTimeout)
        // }, 2000);
        //  getActivity()
    }
}


function answerClick(item) {
    if(lockClick) {
        return
    }
    lockClick = true
    item.cla = "sel"
    
    window.clearInterval(InterValObj);
    InterValObj = 0
    showDownIndex.value = 2
    // showDownIndex.value = true

    answerActivity(item.index, downTimeout - down.value)
//     if(item.index == 'B') {
//         item.cla = "success"
//     } else {
//          item.cla = "error"
//     }
//     setTimeout(() => {
//         getActivity()
//     }, 2000);
}

function getActivity() {
    // console.log("proxy", process)
    console.log("domain", proxy.$config.domain)
    proxy.$axios.post(proxy.$config.domain + 'Activity/AskInfo', {
        id:aid
    }).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            showEmpty.value = false
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.status == 5) {
                router.replace({name: 'UserReg', query:{id:aid, page:'AskAnswer'}})
                return
            }
            if (d.status != 1 ) {
                router.replace({name: 'AskIndex', query:{id:aid}})
                return
            }
            answerBg.value = d.ask_bg
            askNum = d.askNum

            askSum.value = d.dayCnt

            askList.value = d.answers
            
            downTimeout = d.timeout
            showDownIndex.value = 11

            askIndex.value = d.askIndex
            askName.value = d.name

            down.value = downTimeout

            downTip = 3
            resetTipInterValObj()


            // if(!InterValObj) {
                
            //     InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
            // }

            
            
            // this.patientLilst = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
        } else {
            showEmpty.value = true
            tipMessage.value = response.data.msg ?response.data.msg:'网络连接错误，请刷新重试'
            // this.$toast(response.data.message)
        }
    })
        .catch(error => {
            showEmpty.value = true
            tipMessage.value = '网络连接错误，请刷新重试'
            console.log(error)
        });
}

function answerActivity(answer, duration) {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.post(proxy.$config.domain + 'Activity/AnswerAsk', {
        askId:aid,
        answer:answer,
        askNum:askNum,
        duration:duration,
    }, { toJSON: true }).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            showEmpty.value = false
            const d = response.data.data

            for (let index = 0; index < askList.value.length; index++) {
                let el = askList.value[index]
                if(el.index == d.result.correct) {
                    el.cla = (el.cla == 'sel'?'success':'correct')
                } else if(el.cla == 'sel') {
                    el.cla = 'error'
                }
                
            }

            

            // if(TipInterValObj) {
            //     window.clearInterval(TipInterValObj);
            //     TipInterValObj = 0
            // }

            setTimeout(() => {
                if (d.status != 1 ) {
                    router.replace({name: 'AskIndex', query:{'id':aid}})
                    return
                }

                showDownIndex.value = 13

                askNum = d.askNum

                askList.value = d.answers
                lockClick = false

                askIndex.value = d.askIndex
                askName.value = d.name

                down.value = downTimeout

                downTip = 1
                resetTipInterValObj()
                


            }, 1000);
           
            

            // this.patientLilst = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
        } else {
            showDialog({
                message: '网络连接错误，请刷新重试',
            }).then(() => {
                router.replace({name: 'AskIndex', query:{'id':aid}})
                // on close
             });
            // showEmpty.value = true
            // tipMessage.value = response.data.message ?response.data.message:'获取问题失败，请重试'
            // this.$toast(response.data.message)
        }
    })
        .catch(error => {
            // tipMessage.value = "获取问题失败，请重试"
            // console.log(error)
            showDialog({
                message: '网络连接错误，请刷新重试',
            }).then(() => {
                router.replace({name: 'AskIndex', query:{'id':aid}})
                // on close
             });
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
    if (InterValObj) {
        window.clearInterval(InterValObj)
        InterValObj = 0
    }
    if (TipInterValObj) {
        window.clearInterval(TipInterValObj)
        TipInterValObj = 0
    }

})
</script>
<style lang="scss" scoped>
.main-content.empty{
    background: #fff;
}
.answer-bg {
    width: 10rem;
    height: 21.28rem;

    .empty {
        width: 0;
        height: 4.92rem;
    }

    .content {

        margin-left: 0.44rem;
        width: 9.12rem;

        .topbg {
            width: 9.12rem;
            height: 1.72rem;
            background: url(../../assets/img/ask1.png);
            background-size: 100% 1.72rem;
            font-size: 0.4rem;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 1.72rem;
            text-align: center;
            vertical-align: middle;
            font-weight: 500;
            .down-div {
                width: 3.8rem;
                display: inline-flex;
                img {
                    width: 0.92rem;
                    height: 0.92rem;
                    margin-right: .2rem;
                }
                .down-num {
                    flex: 1;
                    text-align: right;
                    font-size: 0.64rem;
                    font-family: Gilroy;
                    font-weight: bold;
                    color: #FFFFFF;
                    margin-left: .2rem;
                    margin-right: .02rem;
                }
                .s-div {

                    font-size: 0.64rem;
                    font-family: Gilroy;
                    font-weight: bold;
                    color: #FFFFFF;
                }
            }
            .down-div.hide-down {
                img {
                    margin: 0.35rem auto;
                }
            }
        }

        .border-bg {
            // margin: 17.36rem 1.47rem auto 1.8rem;
            min-height: 1.6rem;
            background: url(../../assets/img/ask2.png);
            background-size: 100% 10.29rem;



            font-size: 0.43rem;
            color: #333;
            font-weight: 500;
            line-height: 0.63rem;
            min-height: 6rem;
            // padding: 0 0.88rem;

            .empty {
                width: 0;
                height: 0.4rem;
            }
            p {
                line-height: 6rem;
                text-align: center;
                font-size: 1.2rem;
                font-weight: normal;
            }

            .ask-bg-div {
                width: 7.39rem; //8.11-0.72
                background: #FFF9ED;
                border-radius: 0.21rem;
                margin-left: 0.43rem;
                padding: 0.36rem;
               

                .ask-avatar {
                    width: 1.37rem;
                    height: 2.21rem;
                    margin-right: 0.36rem;
                }
                .ask-name {
                    flex: 1;
                    // margin-top: 0.57rem;
                    min-height: 0.44rem;
                    div {
                        width: 100%;
                    }
                }
                .num-div {
                    text-align: right;
                    color: #999999;
                    margin-top: 0.3rem;
                    width: 100%;
                    .num-num {
                        color: #333;
                    }
                }
            }
            .answer-bg-div {
                margin:0.43rem 0.9rem 0;
                background: url(../../assets/img/answer.png);
                background-size: 100% 100%;
                text-align: center;
                padding: 0.41rem 0.9rem;
                position: relative;
                img {
                    width: 0.47rem;
                    position: absolute;
                    top: 50%;
                    left: 0.4rem;
                    margin-top: -0.24rem;
                }
            }

            .answer-bg-div.success, .answer-bg-div.correct {
                background: url(../../assets/img/answer-suc.png);
                background-size: 100% 100%;
                color: #fff;
            }

            .answer-bg-div.error {
                background: url(../../assets/img/answer-err.png);
                background-size: 100% 100%;
                color: #fff
            }

            .answer-bg-div.sel {
                background: url(../../assets/img/answer-sel.png);
                background-size: 100% 100%;
            }

            word-wrap: break-word;
            table-layout: fixed;
            word-break: break-all;

            p {
                word-wrap: break-word;
            }
        }

    }


}</style>