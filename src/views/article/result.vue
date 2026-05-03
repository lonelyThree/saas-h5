<template>
    <div class="main-content ">
        <div class="result-bg" v-if="result.status == 4 || result.status == 5">
            <div class="topic-bg" flex="dir:left cross:center">
                <div class="topic-num">
                    <div>很不错哦！</div>
                    <span>恭喜您将获得本次活动{{ result.award_type == 2 ? '积分' : (result.award_type == 3 ? '星币' : '元红包') }}</span>
                </div>
                <img src="../../assets/img/award-img.png" />
            </div>
            <div class="content">


                <div class="border-bg">
                    <div class="answer-num">
                        答对<div><span>{{ result.correctNum }}</span>/{{ result.cnt }}</div>题
                    </div>
                    <img v-if="result.award_type == 2 || result.award_type == 3"
                        src="../../assets/img/credit-big-img.png">
                    <img v-else src="../../assets/img/red-big-img.png">

                    <div class="money-div " v-if="result.award_type == 3"><span>＋{{ result.money / 100 }}</span></div>
                    <div class="money-div " v-else-if="result.award_type == 2"><span>＋{{ result.money }}</span></div>
                    <div class="money-div " v-else>￥<span>{{ result.money / 100 }}</span></div>
                    <div class="award-btn " @click="receiveClick"
                        v-if="result.status == 4 && (result.award_type == 2 || result.award_type == 3)">点击领取</div>

                    <div class="award-btn " @click="receiveClick" v-else-if="result.status == 4">点击提现</div>

                    <div class="award-btn " v-else-if="result.award_type == 2 || result.award_type == 3">已领取</div>
                    <div class="award-btn " v-else>已提现</div>
                </div>

            </div>
        </div>
        <div class="result-bg" v-else-if="result.status != 0">

            <div class="topic-bg" flex="dir:left cross:center">
                <div class="topic-num">
                    <div>很遗憾</div>
                    <span>没有达标，无法领取红包</span>
                </div>
                <img src="../../assets/img/award-no-img.png" />
            </div>
            <div class="content">


                <div class="border-bg">
                    <div class="answer-num">
                        答对<div><span>{{ result.correctNum }}</span>/{{ result.cnt }}</div>题
                    </div>
                    <img src="../../assets/img/red-big-no-img.png">
                    <div class="tip-div">答对{{ result.standardNum }}题才能领取红包哦</div>
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

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const result = ref({
    award_type: 1,
    cnt: 10,
    correctNum: 0,
    failNum: 0,
    joinNum: 3,
    money: 10,
    msg: "",
    standardNum: 3,
    status: 0,
    title: "测试看视频",
})


let aid = ""

function reAnswer() {
    if (result.value.failNum >= result.value.joinNum) {
        showToast("已达到重新答题上限， 敬请期待下次活动")
    } else {
        router.replace({ name: 'VideoVideo', query: { id: aid, type: route.query.type } })
    }
}

function receiveClick() {

    proxy.$axios.post(proxy.$config.domain + "Activity/WatchVideoAward", { id: aid }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {

            let d = response.data.data
            showToast(d ? d : '领取成功，预计1分钟到账')

            setTimeout(() => {
                getActivity()

            }, 1500);



        } else {
            showToast(response.data.msg ? response.data.msg : '领取失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("提现失败！");
    });

}

function getActivity() {
    // console.log("proxy", process)
    proxy.$axios.get(proxy.$config.domain + 'Activity/WatchVideoResult?id=' + aid).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            result.value = d
            // if (d.status == 2) {
            //     router.replace({ name: 'VideoResult', query: { id: aid, type: route.query.type } })
            //     return
            // }
            if (d.status == 3) {
                router.replace({ name: 'VideoVideo', query: { id: aid, type: route.query.type } })
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
        router.replace({ path: '/404', query: { msg: '未找到活动' } })
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
            width: 2.37rem;
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
        }

    }


}
</style>