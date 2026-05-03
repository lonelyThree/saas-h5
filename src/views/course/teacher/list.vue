<template>
    <div class="main-content info-content">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        v-model:error="error"
        error-text="请求失败，点击重新加载"
        finished-text="暂时没有更多名师了~"
        style="flex-direction: column;"
        @load="onLoad"
      >

          <div class="teacher-div"  flex="dir:left main:left cross:top"  v-for="(item,index) in list" :key="item.id" @click="goClick(item)">
                    <div class="teacher-avatar">
                        <img :src="item.avatar" />
                    </div>
                    <div class="teacher-info">
                        <div class="teacher-name" flex="dir:left main:left cross:baseline">
                           <div>{{ item.name }}</div>
                           <div class="teacher-title">{{ item.title }}</div>
                        </div>
                        <div class="teacher-desc">{{ item.desc }}</div>
                        <div class="course-num">{{item.course_num}}门课程 . {{item.view}}人浏览</div>
                    </div>
            </div>
        <van-empty description=""  image-size="4rem"   v-if=" list.length == 0" />
      </van-list>

      
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance} from "vue"

import { useRouter } from 'vue-router'


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const logs = ref([])
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const page = ref(1)
const list = ref([])

const errorTip = ref('暂无名师')
function onLoad() {
    proxy.$axios.get(proxy.$config.domain + 'Course/TeacherList?page='+page.value).then(response => {
        if (response.data.code === 200) {
            page.value = page.value + 1
            const d = response.data.data
            if (d && d.length > 0) {
                list.value = list.value.concat(d)
            }
            if (!d || d.length < 8) {
                finished.value = true
            }
            loading.value = false
        } else {
            loading.value = false
            error.value = true
            errorTip.value = "请求失败"
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
       
    })
        .catch(e => {
            loading.value = false
            error.value = true
            errorTip.value = "请求失败"
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function goClick(item) {
    if  (item?.link && item?.link.indexOf('http') == 0) {
        window.open(item.link)
    } else {
        router.replace({ name: 'CourseTeacher', query: { id: item.id, type: 'loc' } })
    }
}



onMounted(() => {

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content.info-content {
    background: #F4F4F4;
    
    .teacher-div{
        
        margin: 0.3rem 0.3rem  0 0.3rem;
        background: #fff;
        padding: 0.3rem 0.4rem 0.3rem;
        border-radius: 0.2rem;
        .teacher-avatar {
            img {
                width: 1.94rem;
                height: 1.94rem;
                border-radius: 50%;
            }
            margin-right: 0.4rem;
        }
        .teacher-name {
            font-size: 0.48rem;
            color: #393939;
            .teacher-title {
                margin-left: 0.15rem;
                font-size: 0.33rem;
                color: #A6A2A2;
            }
        }
        .teacher-desc {
                font-size: 0.33rem;
                color: #605E5E;
                margin-top: 0.15rem;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                
            }
        .course-num {
            font-size: 0.33rem;
                color: #605E5E;
                margin-top: 0.15rem;
                line-height: 1.5;
        }
    }
}

</style>