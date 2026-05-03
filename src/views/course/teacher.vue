<template>
    <div class="main-content teacher">
        <div class="top-div">
            <img :src="info.avatar" />
            <div class="name-div">
            {{info.name}}
        </div>
        </div>
        

        <div class="teacher-title-div">
            <span class="teacher-title">{{info.title}}</span>
        </div>

        <div class="desc-div"> {{ info.desc }}</div>

        <div class="title-div-div"  v-if="list.length >0">
            <div class="title-div" flex="dir:left cross:center">
                <div class="title-bg" :style="{ background:  bgColor }"></div>
                主讲课程 <span v-if="list.length >0"> {{ list.length }}</span>
                
            </div>
        </div>

        <div class="course-div"  v-for="item in list" :key="item.id" flex="dir:left cross:center main:center"
         @click="goCourseClick(item)"
        >
           <div class="course-info">
                <div class="course-title">{{ item.title }}</div>
                <div class="course-free">免费</div>
           </div>
           <img :src="item.img" />
        </div>

    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast } from "vant";

const { currentRoute } = useRouter()
const router = useRouter()

const { proxy } = getCurrentInstance()

const route = currentRoute.value;

const bgColor = ref('#1248e8')

const list = ref([])
const info = ref({})


const aid = ref(proxy.$route.query.id)
const adcode = ref('')

function goCourseClick(item) {
    router.replace({ name: 'CourseCourse', query: { id: item.id, type: item.limit_type == 3 ?'loc':'' } })
}

function getInfo() {
    proxy.$axios.get(proxy.$config.domain + 'Course/TeacherInfo?id='+aid.value+"&adcode"+adcode.value).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            info.value = d.info
            list.value = d.list
            
        } else {
            showToast(response.data.msg? response.data.msg :'讲师获取失败')

        }
    }).catch(error => {
         showToast('讲师获取失败')
        console.log(error, '讲师获取失败')
    });
}


function showGeoPosition(position) {
    adcode.value = position.adcode
    // console.log(position, "showGeoPosition=====")
    getInfo()
};

function showGeoErr() {
    // alert('定位失败')
    router.replace({ path: '/404', query: { msg: '获取位置失败' } })
};

function GetGeo() {
    var geolocation = new qq.maps.Geolocation('SZOBZ-HGB3J-UZWF6-DJFLD-6YX7F-FGFRR', 'saas')
    // 获取位置信息, ip定位， 非精确定位
    geolocation.getIpLocation(showGeoPosition, showGeoErr)
}


onMounted(() => {
    GetGeo()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content.teacher {
    padding-bottom: 0.8rem;
    background: #f7f7f7;
    .title-div-div {
        .title-div {
        margin-top: 0.2rem;
        font-size: 0.5rem;
        font-weight: bold;
        color: #494948;
        padding:0.3rem 0;
        background: #FFFFFF;
        .title-bg {
            width: 0.08rem;
            height: 0.68rem;
            background: #12CB7B;
            margin-right: 0.28rem;
            margin-left: 0.42rem;
        }
        span {
            margin-left: 0.1rem;
        }
    }
    }
    .top-div {
        position: relative;
    .name-div {
        height: 1.5rem;
        background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0), 
    rgba(0, 0, 0, 0.1) 20%, 
    rgba(0, 0, 0, 0.3) 50%, 
    rgba(0, 0, 0, 0.6) 100%);
        font-size: 0.59rem;
        color: #FFFFFF;
        line-height: 1.5rem;
        padding-left: 0.4rem;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
}
    .teacher-title-div {
        height: 1.2rem;
        background-color: #fff;
        
        padding-top: 0.3rem;
        .teacher-title {
            margin-left: 0.4rem;
            font-size: 0.33rem;
            color: #676767;
            border-radius: 0.3rem;
            background: #f7f7f7;
            padding: 0.1rem 0.3rem;
        }
    }
   
    .desc-div {
        margin-top:0.1rem;
        padding: 0.5rem 0.5rem 0.5rem;

        font-size: 0.35rem;
        color: #333333;
        line-height: 0.65rem;
        background: #ffff;

        white-space: pre-line;
    }
    .course-div {
        margin-top: 1px;
        background: #ffff;
        padding: 0.4rem;
        img {
            width: 3.78rem;
            height: 2.14rem;
            margin-left: 0.2rem;
        }
        .course-info {
            flex: 1;
        }
        .course-title {
            height: 1.2rem;
            font-size: 0.45rem;
            color: #333333;
            margin-bottom: 0.2rem;
              display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
        }
        .course-free {
            font-size: 0.39rem;
            color: #464444;
        }
    }

    

}

</style>