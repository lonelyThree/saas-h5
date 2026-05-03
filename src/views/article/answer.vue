<template>
    <div class="main-content">
        <div class="answer-bg">

            <div class="topic-num"><span>请回答问题</span> {{ askIndex }}/{{ askSum }}</div>
            <div class="content">
                
                <div class="topbg">
                     <div class="down-div hide-down"  v-if="showDownIndex != 1 ">
                        <img src="../../assets/img/time.png" />
                    </div>
                    <div class="down-div" flex="dir:left cross:center" v-else>
                        <div>倒计时</div>
                        <div class="down-num">{{ down }}</div>
                        <div class="s-div">s</div>
                    </div>

                     <div v-if="showDownIndex == 1  || showDownIndex == 2 ">{{ askName }}</div>
                </div>
                <div class="border-bg">
                    <div  v-if="showDownIndex != 1 && showDownIndex != 2">
                        <p v-if="showDownIndex == 11 ">预备</p>
                        <p v-if="showDownIndex == 12 ">开始</p>
                        <p v-if="showDownIndex == 13 ">第{{ askIndex }}题</p>
                        
                    </div>
                    <div v-else>
                        <div class="answer-bg-div" v-for="(item, index) in askList" :key="index" :class="item.cla" @click="answerClick(item)">
                            <img :src="require('../../assets/img/err-rgb.png')" v-if="item.cla == 'error'"/>

                            <img src="../../assets/img/suc-rgb.png" v-if="item.cla == 'success'"/>
                            <span>{{ item.index }}</span>
                            {{ item.answer }}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="fixed-bottom" v-if="lockClick && topicType == 2">
            <div class="p end">
                确认
            </div>
        </div>
        <div class="fixed-bottom" flex="dir:left cross:top" v-else-if=" topicType == 2">
            <div class="p" @click="answerMulClick()">
                确认
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { showDialog, showToast } from "vant";

import { useRouter } from 'vue-router'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()



const down = ref(10)
const askIndex = ref(0)
const askSum = ref(30)
const showDownIndex = ref(13)
const topicType = ref(1)

const askName = ref("")


let topicLogId = ""
let logId = ""

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
    // lockClick = true
    item.cla = "sel"
    if(topicType.value == 2) {
        return
    }
    
    window.clearInterval(InterValObj);
    InterValObj = 0
    showDownIndex.value = 2
    // showDownIndex.value = true
    lockClick = true

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


function answerMulClick() {
    if(lockClick) {
        return
    }
    
    
    let answer = ''
    askList.value.forEach(el => {
        if(el.cla == "sel") {
            answer += ','+el.index
        }
    });
    if (answer.length == 0) {
        showToast('请先选择答案')
    }

    answer = answer.substring(1)

    lockClick = true

    window.clearInterval(InterValObj);
    InterValObj = 0
    showDownIndex.value = 2
    // showDownIndex.value = true

    answerActivity(answer, downTimeout - down.value)
}

function getActivity() {
    // console.log("proxy", process)
    proxy.$axios.post(proxy.$config.domain + 'Activity/WatchVideoTopicInfo', {
        id:aid
    }).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.status == 2) {
                router.replace({name: 'VideoResult', query:{id:aid, type: route.query.type }})
                return
            }
            if (d.status != 1 ) {
                router.replace({name: 'VideoVideo', query:{id:aid, type: route.query.type }})
                return
            }

            logId = d.logId
            topicLogId = d.topicLogId

            askSum.value = d.cnt

            

            askList.value = d.answers
            
            
            downTimeout = d.timeout
            showDownIndex.value = 11

            askIndex.value = d.askIndex
            askName.value = d.name

            down.value = downTimeout

            topicType.value = d.type

            downTip = 3
            resetTipInterValObj()
        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试' } })
        }
    }).catch(error => {
        router.replace({ path: '/404', query: { msg: '网络连接错误，请刷新重试' } })
    });
}

function answerActivity(answer, duration) {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.post(proxy.$config.domain + 'Activity/AnswerWatchVideInfo', {
        aid:aid,
        answer:answer,
        topicLogId:topicLogId,
        logId: logId,
        duration:duration,
    }, { toJSON: true }).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data

            for (let index = 0; index < askList.value.length; index++) {
                let el = askList.value[index]
                if(el.index == d.result.correct || d.result.correct.indexOf(el.index) != -1) {
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
                if (d.status == 2) {
                router.replace({name: 'VideoResult', query:{id:aid, type: route.query.type }})
                return
            }
            if (d.status != 1 ) {
                router.replace({name: 'VideoVideo', query:{id:aid, type: route.query.type }})
                return
            }
                showDownIndex.value = 13

                
                logId = d.logId
                topicLogId = d.topicLogId

                askList.value = d.answers
                lockClick = false

                askIndex.value = d.askIndex
                askName.value = d.name

                down.value = downTimeout

                topicType.value = d.type

                downTip = 1
                resetTipInterValObj()
                


            }, 3000);
           
            

            // this.patientLilst = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
        } else {
            showDialog({
                message: '网络连接错误，请刷新重试',
            }).then(() => {
                 router.replace({ name: 'VideoVideo', query: { id: aid, type: route.query.type } })
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
                router.replace({ name: 'VideoVideo', query: { id: aid, type: route.query.type } })
                // on close
             });
        });
}



onMounted(() => {
    let id = route.query.id
    if (!id || typeof id !== 'string') {
        router.replace({ path: '/404', query: { msg: '未找到活动' } })
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
.main-content {
    background: #fff;

    background: url(../../assets/img/speak/speak-top-bg.png);
    background-size:100% 8.12rem;
    background-repeat: no-repeat;

    padding-bottom: 1rem;
}
.answer-bg {
    padding-bottom: 2rem;
    width: 10rem;
    // height: 21.28rem;

    .topic-num {
        height: 2.5rem;
        font-size: 0.67rem;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 2.5rem;
        text-shadow: 0rem 0rem 0rem #16B771;
        padding-left: 0.61rem;
        span {
            font-size: 0.48rem;
            font-weight: normal;
        }
    }

    .empty {
        width: 0;
        height: 4.92rem;
    }

    .content {

        margin-left: 0.44rem;
        width: 9.12rem;

        .topbg {

            background: #FFFFFF;
            border: 0.05px solid #FFFFFF;
            border-radius: 0.27rem;
            position: relative;

            padding: 1.5rem 0.6rem .9rem;

            font-size: 0.53rem;
            font-weight: bold;
            color: #333333;
            line-height: 0.72rem;

            .down-div {
                width: 3.2rem;
                height: 1.27rem;

                background: url(../../assets/img/down-bg.png);
                background-size: 100% 100%;

                position: absolute;
                top: -0.4rem;
                left: 1.97rem;
                display: inline-flex;

                font-size: 0.45rem;
                font-weight: normal;
                color: #FFFFFF;
                line-height: 0.9rem;

                padding: 0 1rem 0.35rem;

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
                    margin: 0.15rem auto;
                }
            }
        }

        .border-bg {
            // margin: 17.36rem 1.47rem auto 1.8rem;
            margin-top: 0.5rem;
            min-height: 1.6rem;

            background: #FFFFFF;
            border: 0.05px solid #FFFFFF;
            border-radius: 0.27rem;



            font-size: 0.43rem;
            color: #333;
            // font-weight: 500;
            line-height: 0.63rem;
            min-height: 6rem;
            // padding: 0 0.88rem;

            padding: 0.3rem 0 0.5rem;
            // padding-bottom: 0.2rem;

            // .empty {
            //     width: 0;
            //     height: 0.4rem;
            // }
            p {
                line-height: 6rem;
                text-align: center;
                font-size: 1.2rem;
                font-weight: normal;
            }

            .answer-bg-div {
                margin:0.43rem 0.4rem 0;

                text-align: left;
                padding: 0.41rem 0.5rem;
                position: relative;

                span {
                    font-size: 0.48rem;
                    font-weight: bold;
                }
                img {
                    width: 0.47rem;
                    position: absolute;
                    top: 50%;
                    right: 0.4rem;
                    margin-top: -0.24rem;
                }
            }
            .answer-bg-div.success span {
                color: #12CB7B;

            }

            .answer-bg-div.error span {
                color: #FF1F1F;

            }

            .answer-bg-div.success, .answer-bg-div.correct {
                background: rgba(18,203,123,0.1);
                border-radius: 0.64rem;
                padding-right: 1rem;
            }

            .answer-bg-div.error {
                background: rgba(203,18,40,0.05);
                border-radius: 0.64rem;
                padding-right: 1rem;
            }

            .answer-bg-div.sel {
                background: rgba(18,203,123,0.05);
                border-radius: 0.64rem;
            }

            word-wrap: break-word;
            table-layout: fixed;
            word-break: break-all;

            p {
                word-wrap: break-word;
            }
        }

    }


}
.fixed-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        width: 10rem;
        height: 1.84rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215,215,215);
        border-radius: 0.65rem 0.65rem 0rem 0rem;


        line-height: 1.1rem;
        font-size: 0.45rem;
        color: #FFFFFF;
        text-align: center;

        .p {
            margin:0.37rem 0.4rem;
            width: 9.2rem;
            height: 1.1rem;
            background: #12CB7B;
            border-radius: 0.27rem;
            position: relative;
        }

        .p.end {
            background: #b8b8b8;

        }
    }
</style>