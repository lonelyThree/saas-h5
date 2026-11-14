<template>
    <div class="main-content ">
        <!-- 达标待领取 / 已领取终态 -->
        <div class="result-bg" v-if="result.status == WatchVideoStatus.Award || result.status == WatchVideoStatus.Awarded">
            <div class="topic-bg" flex="dir:left cross:center" >
                <div class="topic-num" >
                    <div>很不错哦！</div>
                    <span v-if="result.status == WatchVideoStatus.Award">
                        <span v-if="result.money == 0">恭喜您通过本次考试</span>
                        <span v-else>恭喜您将获得本次活动{{ result.award_type == 2 ? '积分' : (result.award_type == 3?'星币':'元红包') }}</span>
                    </span>
                    <span v-else>奖励已领取{{ result.awardTimes > 1 ? '，已达参与上限' : '' }}</span>
                </div>
                <img src="../../assets/img/award-img.png" />
            </div>
            <div class="content">

                <div class="border-bg">
                    <div class="answer-num">
                        总得分<div><span>{{ (result.correctNum * 100 / result.cnt).toFixed(0) }}</span></div>分
                    </div>
                    <div class="round-tip" v-if="result.awardTimes > 1">已完成 {{ result.awardCnt }}/{{ result.awardTimes }} 轮 · 剩余 {{ result.awardTimes - result.awardCnt }} 次</div>
                    <div class="total-tip" v-if="result.awardTimes > 1 && result.totalReceived > 0">累计已领<span v-if="result.award_type == 3"> {{ result.totalReceived / 100 }} 星币</span><span v-else-if="result.award_type == 2"> {{ result.totalReceived }} 积分</span><span v-else> ￥{{ result.totalReceived / 100 }}</span></div>
                    <img  v-if="result.award_type == 2 || result.award_type == 3" src="../../assets/img/credit-big-img.png">
                    <img v-else src="../../assets/img/red-big-img.png">

                    <div v-if="result.money != 0">

                    <div class="money-div " v-if="result.award_type == 3"><span>＋{{ result.money/100 }}</span></div>
                    <div class="money-div " v-else-if="result.award_type == 2"><span>＋{{ result.money }}</span></div>
                    <div class="money-div " v-else>￥<span>{{ result.money/100 }}</span></div>
                    <div class="award-btn " @click="receiveClick" v-if="result.status == WatchVideoStatus.Award && (result.award_type == 2 || result.award_type == 3)">{{ receiving ? '领取中…' : '点击领取' }}</div>

                    <div class="award-btn " @click="receiveClick" v-else-if="result.status == WatchVideoStatus.Award">{{ receiving ? '领取中…' : '点击提现' }}</div>

                    <div class="award-btn gray" v-else-if="result.award_type == 2 || result.award_type == 3">已领取</div>
                        <div class="award-btn gray"  v-else>已提现</div>
                    </div>
                </div>

            </div>
        </div>
        <!-- 本轮已领取，可继续下一轮 -->
        <div class="result-bg" v-else-if="result.status == WatchVideoStatus.Continue && result.is_award == WatchVideoIsAward.ReceivedContinue">
            <div class="topic-bg" flex="dir:left cross:center" >
                <div class="topic-num" >
                    <div>本轮奖励已领取！</div>
                    <span>可继续参与下一轮答题</span>
                </div>
                <img src="../../assets/img/award-img.png" />
            </div>
            <div class="content">

                <div class="border-bg">
                    <div class="answer-num">
                        总得分<div><span>{{ (result.correctNum * 100 / result.cnt).toFixed(0) }}</span></div>分
                    </div>
                    <div class="round-tip" v-if="result.awardTimes > 1">已完成 {{ result.awardCnt }}/{{ result.awardTimes }} 轮 · 剩余 {{ result.awardTimes - result.awardCnt }} 次</div>
                    <div class="total-tip" v-if="result.totalReceived > 0">累计已领<span v-if="result.award_type == 3"> {{ result.totalReceived / 100 }} 星币</span><span v-else-if="result.award_type == 2"> {{ result.totalReceived }} 积分</span><span v-else> ￥{{ result.totalReceived / 100 }}</span></div>
                    <div class="award-btn " @click="nextRound">继续参与下一轮</div>
                </div>

            </div>
        </div>
        <!-- 已达参与次数上限 -->
        <div class="result-bg" v-else-if="result.status == WatchVideoStatus.Limit">
            <div class="topic-bg" flex="dir:left cross:center" >
                <div class="topic-num" >
                    <div>很遗憾</div>
                    <span>已达到参与次数上限</span>
                </div>
                <img src="../../assets/img/award-no-img.png" />
            </div>
            <div class="content">

                <div class="border-bg">
                    <div class="answer-num">
                        总得分<div><span>{{ (result.correctNum * 100 / result.cnt).toFixed(0) }}</span></div>分
                    </div>
                    <div class="tip-div">本次活动参与次数已用完，敬请期待下次活动</div>
                    <div class="award-btn gray" @click="goIndex">我知道了</div>
                </div>

            </div>
        </div>
        <!-- 未达标，可重新答题 -->
        <div class="result-bg" v-else-if="result.status != 0">

            <div class="topic-bg" flex="dir:left cross:center" >
                    <div class="topic-num" >
                        <div>很遗憾</div>
                        <span v-if="result.money == 0">考试成绩不合格</span>
                        <span v-else>没有达标，无法领取{{ result.award_type == 2 ? '积分' : (result.award_type == 3?'星币':'红包') }}</span>
                    </div>
                    <img src="../../assets/img/award-no-img.png" />
                </div>
                <div class="content">

              
                    <div class="border-bg">
                        <div class="answer-num">
                           总得分<div><span>{{ (result.correctNum * 100 / result.cnt).toFixed(0) }}</span></div>分
                        </div>
                        
                        <img src="../../assets/img/red-big-no-img.png">
                        <div class="tip-div">总得分超过{{(result.standardNum * 100 / result.cnt).toFixed(0) }}分才能领取奖励哦</div> 
                        <div class="award-btn " @click="reAnswer">重新答题（{{ result.failNum }}/{{ result.joinNum }}）</div>
                    </div>

                </div>
        </div>
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { showDialog, showToast } from "vant";

import { useRouter } from 'vue-router'

import { WatchVideoStatus, WatchVideoIsAward } from '@/constants/WatchVideoStatus'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const result = ref({
    award_type:1,
    cnt: 10,
    correctNum: 0,
    failNum: 0,
    joinNum: 3,
money: 10,
msg: "",
standardNum: 3,
status: 0,
title: "测试看视频",
    is_award: 0,
    awardCnt: 0,
    awardTimes: 1,
    totalReceived: 0,
})

// 领取防重锁，避免快速多次点击“点击领取”重复发奖
const receiving = ref(false)

let aid = ""

function reAnswer() {
    if (result.value.failNum >= result.value.joinNum) {
        showToast("已达到重新答题上限， 敬请期待下次活动")
    } else {
        console.log("重新答题", "CourseQuestion", aid)
        router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
    }
}

// 本轮已领取、可开启下一轮：直接进入答题（InitUser 已幂等完成）
function nextRound() {
    router.replace({ name: 'CourseAnswer', query: { id: aid, type: route.query.type } })
}

function goIndex() {
    router.replace({ name: 'CourseIndex' })
}

function receiveClick() {
    if (receiving.value) {
        return
    }
    receiving.value = true

    proxy.$axios.post(proxy.$config.domain + "Course/QuestionAward", { id: aid }).then(response => {
        if (response.data.code === 200) {

            let d = response.data.data
            // 后端成功文案已区分终态/可继续，直接透传
            showToast(d?d:'领取成功，预计1分钟到账')

            // 本地先行置为“本轮已领取”态，避免回包间隙重复点击，再延迟拉取真实状态
            result.value.status = WatchVideoStatus.Continue
            result.value.is_award = WatchVideoIsAward.ReceivedContinue

            setTimeout(() => {
                getActivity()
                receiving.value = false
            }, 1500);

        } else {
            // 失败 msg 透传后端，不再统一提示“领取失败”
            showToast(response.data.msg ? response.data.msg : '领取失败');
            receiving.value = false
        }
    }).catch(error => {
        showToast('网络连接错误，请刷新重试');
        receiving.value = false
    });

}

function getActivity() {
    // console.log("proxy", process)
    proxy.$axios.get(proxy.$config.domain + 'Course/QuestionResult?id='+aid).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            result.value = d
            // if (d.status == 2) {
            //     router.replace({ name: 'CourseResult', query: { id: aid, type: route.query.type } })
            //     return
            // }
            if (d.status == WatchVideoStatus.Error) {
                // 未 InitUser/未答题直接进 Result，回试卷页
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
                return
            }

            
        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试' } })
        }
    }).catch(error => {
        router.replace({ path: '/404', query: { msg: '网络连接错误，请刷新重试' } })
    });
}




onMounted(() => {
    let id = route.query.id
    if (!id || typeof id !== 'string') {
        router.replace({ path: '/404', query: { msg: '未找到活动'} })
        return
    }
    aid = id
    getActivity()

})


</script>
<style lang="scss" scoped>
.main-content {
    background: #fff;

    background: url(../../assets/img/speak/speak-top-bg.png);
    background-size: 100% 8.12rem;
    background-repeat: no-repeat;

    padding-bottom: 1rem;
}

.result-bg {
    width: 10rem;
    // height: 21.28rem;
    .topic-bg {
        .topic-num {
            flex: 1;
            // height: 2.5rem;
            font-size: 0.67rem;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 0.8rem;
            text-shadow: 0rem 0rem 0rem #16B771;
            padding-left: 0.61rem;

            span {
                font-size: 0.48rem;
                font-weight: normal;
            }
        }
        img {
            width:2.37rem;
            margin-top: 0.3rem;
            margin-right: 0.76rem;
        }

    }

    .empty {
        width: 0;
        height: 4.92rem;
    }

    .content {

        margin-left: 0.44rem;
        width: 9.12rem;

        
        .border-bg {
            // margin: 17.36rem 1.47rem auto 1.8rem;
            margin-top: 0.3rem;
            min-height: 1.6rem;

            background: #FFFFFF;
            border: 0.05px solid #FFFFFF;
            border-radius: 0.27rem;



            font-size: 0.43rem;
            color: #333;
  

            .answer-num {
                width: 9.12rem;
                height: 2.19rem;
                background: #E7FAF2;
                border-radius: 0 0 50% 50%;

                font-size: 0.64rem;
                font-weight: bold;
                color: #333333;
                line-height: 2.19rem;
                text-align: center;
                div {
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                    display: inline-block;
                }

                span {
                    font-size: 0.96rem;
                    color: #12CB7B;
                }
            }

            img {
                margin: 0.83rem 2.62rem 0.6rem;
                width: 3.96rem;
            }

            .award-btn {
                margin-top: 1rem;
                margin-left: 0.57rem;
                width: 8.05rem;
                height: 1.17rem;
                background: #FE8E09;
                border-radius: 0.27rem;

                text-align: center;
                font-size: 0.48rem;
                font-weight: bold;

                color: #FFFFFF;
                line-height: 1.17rem;

                margin-bottom: 1rem;
            }

            .award-btn.gray {
                background: #b8b8b8;
            }

            .money-div {
                font-size: 1rem;
                font-weight: 500;
                color: #FE8E09;
                line-height: 0.9rem;
                text-align: center;

                span {
                    font-size: 1.36rem;
                    font-family: Gilroy;
                    font-weight: bold;
                }
            }

            .tip-div {
                text-align: center;
                font-size: 0.53rem;
                font-weight: normal;
                color: #FE8E09;
            }

            .round-tip {
                margin-top: 0.3rem;
                text-align: center;
                font-size: 0.43rem;
                color: #12CB7B;
            }

            .total-tip {
                margin-top: 0.2rem;
                text-align: center;
                font-size: 0.43rem;
                color: #FE8E09;
            }
        }

    }


}</style>
