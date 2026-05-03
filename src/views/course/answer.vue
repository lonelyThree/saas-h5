<template>
    <div class="main-content course-answer">
        <div class="topic-num">
            <span> {{ topicType == 2 ? '多选题' : (topicType == 3 ? '判断题' : '单选题') }}</span>
            {{ askIndex }}/{{ askSum }}
        </div>
        <div class="progress-div">
            <van-progress :percentage="50" pivot-color="#4196E4" :show-pivot="false" />
        </div>
        <div class="topic-name">
            {{ askName }}

        </div>
        <div class="answer-div">
            <div class="answer-item" v-for="(item, index) in askList" :key="index" :class="item.sel"
                @click="answerClick(item)" flex="dir:left cross:center">
                <div class="answer-index" :class="{ 'answer-checkbox': topicType == 2 }">
                    {{ item.index }}
                </div>
                <div class="answer-content">
                    {{ item.answer }}
                    <img src="../../assets/img/err-rgb.png" v-if="item.cla == 'error'" />
                    <img src="../../assets/img/suc-rgb.png" v-if="item.cla == 'success'" />
                </div>
            </div>
        </div>
        <div class="answer-btn" @click="answerMulClick()" v-if="result.status != 2 && result.status != 3">
            确认答案
        </div>

        <div class="result-div-div" v-else>
            <div class="empty-div"> </div>
            <div class="result-div">
                <div class="result-title">答案</div>
                <div class="result-answer">
                    正确答案<span class="result-correct"> {{ result.correct }}</span>
                    我的答案<span class="result-mine" :class="{ 'result-suc': result.correct == result.answer }"> {{
                        result.answer }}</span>
                </div>
                <div class="line-div"></div>
                <div class="result-title">
                    答案解析
                </div>
                <div class="result-answer">
                    {{ result.analysis || '暂无' }}
                </div>
            </div>
        </div>


        <div class="fixed-bottom" flex="dir:right cross:top">
            <div class="answer-btn jump-btn" @click="downClick()">
                {{ askIndex >= askSum ? '交卷' : '下一题' }}
            </div>
            <div class="answer-btn jump-btn" @click="upClick()" :class="{ 'dis-btn': askIndex <= 1 }">
                上一题
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { showDialog, showToast } from "vant";

import { useRouter } from 'vue-router'
import func from "vue-temp/vue-editor-bridge";

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
const result = ref({
    status: 1,
    correct: '',
    answer: '',
})


let topicLogId = ""
let logId = ""

let downTimeout = 30


const askList = ref(
    [{
        "index": "A",
        "answer": "",
        "sel": "",
        "cla": ""
    }
    ]
);

let aid = ""



let lockClick = false



function answerClick(item) {

    if (lockClick) {
        return
    }
    // 多选
    if (topicType.value == 2) {
        if (item.sel == "sel") {
            item.sel = ""
        } else {
            item.sel = "sel"
        }
        return
    }
    askList.value.forEach(el => {
        if (el.sel == "sel" && el.index != item.index) {
            el.sel = ""
        } else if (el.index == item.index) {
            el.sel = "sel"
        }
    });
}


function answerMulClick() {
    if (lockClick) {
        return
    }


    let answer = ''
    askList.value.forEach(el => {
        if (el.sel == "sel") {
            answer += ',' + el.index
        }
    });
    if (answer.length == 0) {
        showToast('请先选择答案')
        return
    }

    answer = answer.substring(1)

    lockClick = true


    answerActivity(answer, 1)
}

function upClick() {
    if(askIndex.value <= 1) {
        return
    }
    switchClick(2)
}

function downClick() {
    if(!lockClick) { 
        showToast('请先确认答案')
        return

    }
    switchClick(1)
}

function switchClick(page_type) {
    proxy.$axios.post(proxy.$config.domain + 'Course/QuestionTopicSwitch', {
        aid: aid,
        topic_log_id: topicLogId,
        log_id: logId,
        page_type: page_type,
    }, { toJSON: true }).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data

            if (d.status == 2) {
                router.replace({ name: 'CourseResult', query: { id: aid, type: route.query.type } })
                return
            }
            if (d.status != 1) {
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
                return
            }

             formatInfo(d)


        } else {
            showDialog({
                message: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试',
            }).then(() => {
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
            });
        }
    })
        .catch(error => {
            showDialog({
                message: '网络连接错误，请刷新重试',
            }).then(() => {
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
                // on close
            });
        });
}

function getActivity() {
    // console.log("proxy", process)
    proxy.$axios.post(proxy.$config.domain + 'Course/QuestionTopicInfo', {
        id: aid
    }).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.status == 2) {
                router.replace({ name: 'CourseResult', query: { id: aid, type: route.query.type } })
                return
            }
            if (d.status != 1) {
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
                return
            }

            formatInfo(d)


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
    proxy.$axios.post(proxy.$config.domain + 'Course/AnswerQuestionInfo', {
        aid: aid,
        answer: answer,
        topicLogId: topicLogId,
        logId: logId,
        duration: duration,
    }, { toJSON: true }).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            formatInfo(d)
        } else {
            showDialog({
                message: '网络连接错误，请刷新重试',
            }).then(() => {
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
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
                router.replace({ name: 'CourseQuestion', query: { id: aid, type: route.query.type } })
                // on close
            });
        });
}


function formatInfo(d) {
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
    result.value = d.result
    if (d.result && d.result.correct) {
        lockClick = true
        result.value.correct = d.result.correct.replaceAll(',', '')
        result.value.answer = d.result.answer.replaceAll(',', '')
        return
    }
    lockClick = false
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

})
</script>
<style lang="scss" scoped>
.main-content {
    background: #fff;
}

.main-content.course-answer {
    padding-bottom: 3rem;
    padding: auto;
    width: 10rem;
    // height: 21.28rem;

    .topic-num {
        margin-top: 0.2rem;
        height: 1.2rem;
        font-size: 0.42rem;
        font-weight: bold;
        color: #242424;
        ;
        line-height: 1.2rem;
        padding-left: 0.36rem;

        span {
            font-size: 0.42rem;
            font-weight: normal;
            color: #4196E4;
        }
    }

    .progress-div {
        margin: 0 0.36rem;
    }

    .topic-name {
        margin: 0.36rem;
        font-size: 0.49rem;
        color: #242424;
        line-height: 1.5;
    }

    .answer-div {
        margin: 0 0.36rem 0.36rem 0.36rem;

        .answer-item {
            margin: 0.6rem 0;

            .answer-index {
                width: 1.06rem;
                height: 1.06rem;
                background: #eaeaea;
                border-radius: 0.58rem;
                line-height: 1.06rem;
                flex-shrink: 0;
                text-align: center;
                margin-right: 0.3rem;
                font-size: 0.49rem;
                color: #242424;
            }

            .answer-index.answer-checkbox {
                border-radius: 0.2rem;
            }

            .answer-content {
                line-height: 1.5;
                font-size: 0.42rem;
                color: #242424;

                img {
                    width: 0.47rem;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }

        .answer-item.sel {
            .answer-index {
                color: #fff;
                background: #4196E4;
            }

            .answer-content {
                color: #4196E4;
            }
        }

    }

    .answer-btn {
        margin: 1rem 0.36rem 0.36rem;
        background: #4196E4;
        border-radius: 0.2rem;
        color: #fff;
        text-align: center;
        font-size: 0.42rem;
        height: 1.2rem;
        line-height: 1.2rem;
    }

    .answer-btn.jump-btn {
        width: 2.5rem;
    }

    .result-div-div {
        margin-top: 0.5rem;

        .empty-div {
            width: 10rem;
            height: 0.1rem;
            background: #E8E8E8;
        }

        .result-div {
            margin: 0.36rem;

            .result-title {
                font-size: 0.41rem;
                color: #242424;
                line-height: 1rem;
                height: 1rem;
            }

            .result-answer {
                font-size: 0.36rem;
                color: #66676A;
                line-height: .5rem;
                height: .5rem;

                span {
                    margin: 0 0.2rem;
                    font-size: 0.36rem;
                    color: #EB706A;

                }

                .result-correct {
                    color: #38CDA7;
                    margin-right: 0.5rem;
                }

                .result-suc {
                    color: #38CDA7;
                }
            }

        }

        .line-div {
            margin: 0.4rem 0 .2rem;
            width: 100%;
            height: 1px;
            background: #E8E8E8;
        }
    }


    .fixed-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.4rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215, 215, 215);
        border-radius: 0.2rem 0.2rem 0rem 0rem;


        line-height: 1rem;
        color: #FFFFFF;

        .answer-btn {
            margin: 0;
            margin-right: 0.36rem;
            margin-top: 0.2rem;
            line-height: 1rem;
            height: 1rem;
            font-size: 0.36rem;
        }

        .dis-btn {
            background: #D8D8D8;
        }
    }


}
</style>