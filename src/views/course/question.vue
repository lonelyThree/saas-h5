<template>
    <div class="main-content question">
        <div class="empty-div"></div>
        <div class="title-div">
            {{ info.name }} 试卷
        </div>
        <div class="desc-div" >
            <div class="desc-div-left">试卷类型：随机组卷</div>
            <div>试卷难度：{{ info.difficulty_type == 1 ? '易' :(info.difficulty_type == 2 ? '中':'难') }}</div>
        </div>
        <div class="desc-div"  >
            <div class="desc-div-left">总题目数：{{ info.each_num  }}</div>
            <div>达标题目数：{{ info.standard_num  }}</div>
        </div>
        <div class="desc-div" >
            <div class="desc-div-left">考试人数：{{ info.exam_num  }}</div>
            <div>考试奖励：{{ info.award_type == 2 ? info?.money:((info?.money ?? 0) / 100).toFixed(2)}} {{ info.award_type == 2 ? '积分':(info.award_type == 3 ? '星币':'元红包') }}</div>
        </div>

        <div class="btn" @click="startClick">进入做题</div>
    
    </div>
</template>


<script lang="ts" setup>

import { showToast } from "vant";
import { onMounted, onBeforeUnmount, ref, getCurrentInstance, nextTick, shallowRef } from "vue"

import { useRouter } from 'vue-router'
import func from "vue-temp/vue-editor-bridge";


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()




let courseId = ''
let questionId = ''

const info = ref({})

function startClick() {
    router.replace({ name: 'CourseAnswer', query: { id: questionId} })
}


function getInfo() {
 
    proxy.$axios.get(proxy.$config.domain + 'Course/QuestionInfo?course_id=' + courseId +"&id="+questionId ).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.name) {
                document.title = d.name + "试卷介绍"
            }
            info.value = d   


        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误' } })
        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:  '网络连接错误' } })
        });
}





onMounted(() => {


    let id = route.query.id
    if (id && typeof id === 'string') {
        questionId = id
    }

    let course_id = route.query.course_id
    if (course_id && typeof course_id === 'string') {
        courseId = course_id
    }

    if (questionId == "" ) {
        router.replace({ path: '/404', query: { msg: '问卷不存在' } })
        return
    }
    
    getInfo()

})

onBeforeUnmount(() => {

})
</script>

<style lang="scss" scoped>
.main-content.question {
    background: #f7f7f7;
    background-color: #f7f7f7;
    padding-bottom: 2.5rem;
    .empty-div {
        height: 1rem;
    }
    .title-div {
        border-bottom: 1px solid #f7f7f7;
        background: #fff;
        text-align: center;
        line-height: 1.5;
        font-size: 0.39rem;
        color: #000;
        padding: 0.3rem 0;
    }
    .desc-div {
        background: #fff;
        border-bottom: 1px solid #f7f7f7;
        line-height: 1rem;
        height: 1rem;
        font-size: 0.39rem;
        color: #333;
        text-align: center;
        position: relative;
        .desc-div-left {
            float: left;
            width: 5rem;
            flex: 1;
            border-right: 1px solid #f7f7f7;;
        }
    }

    .btn {
                margin: 2rem 1rem;
                width: 8rem;
                height: 1.09rem;
                background: #1248e8;
                border-radius: 1rem;

                font-size: 0.45rem;
                color: #FFFFFF;
                line-height: 1.09rem;

                text-align: center;
            }
}


</style>