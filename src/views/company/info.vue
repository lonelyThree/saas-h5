<template>
    <div class="main-content info-content">
        <img v-if="companyInfo.imgs" :src="companyInfo.imgs" />
        <img v-else src="../../assets/img/mine/reg-top-bg.png" />
        <div class="top-div-line">
            <img  :src="companyInfo.logo" />
            <div class="title-div">
                {{ companyInfo.name }}
            </div>
        </div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        v-model:error="error"
        error-text="请求失败，点击重新加载"
        finished-text="暂时没有更多活动了~"
        style="flex-direction: column;"
        @load="onLoad"
      >
       <img class="info-img" :src="item.img"  v-for="(item,index) in logs" :key="index"  @click="goClick(item)"/>
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
const companyInfo = ref({
    name: '',
    logo: '',
    imgs: '',
    hot: 0,
})
const aid = ref(proxy.$route.query.id)
function onLoad() {
    proxy.$axios.get(proxy.$config.domain + 'Company/ActivityList?page='+page.value+"&company_id="+aid.value).then(response => {
        if (response.data.code === 200) {
            page.value = page.value + 1
            const d = response.data.data
            if (d && d.length > 0) {
                logs.value = logs.value.concat(d)
            }
            if (!d || d.length < 10) {
                finished.value = true
            }
            loading.value = false
        } else {
            loading.value = false
            error.value = true
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
       
    })
        .catch(e => {
            loading.value = false
            error.value = true
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function getInfo() {
    proxy.$axios.get(proxy.$config.domain + 'Company/Info?company_id='+aid.value).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d ) {
                companyInfo.value  = d
            }
        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
       
    })
        .catch(e => {

        });
}

function goClick(item) {
    console.log(item, item.link)
    if  (item.link.indexOf('http') == 0) {
        window.open(item.link)
    } else {
        router.replace({ name: 'CompanyIndex', query: { id: item.link, type: 'loc' } })
    }
}



onMounted(() => {
    if (aid.value == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }
    getInfo()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content.info-content {
    background: #FFFFFF;
    
    .top-div-line {
        margin-top:-.6rem;
        height: 1rem;
        border-radius: 0.52rem;
        background: #FFFFFF;
        position: relative;
        margin-bottom:.3rem;

        padding-left: 2.7rem;
        padding-top: 0.3rem;

        font-size: 0.5rem;
        font-weight: bold;
        color: #333333;
        img {
            width: 2.1rem;
            height: 2.1rem;
            border-radius: 50%;
            position: absolute;
            top: -0.5rem;
            left: 0.3rem;
        }
    }
    .info-img {
            width: 9.4rem;
            height: auto;
            margin: .3rem .3rem 0 .3rem;

        }
}

</style>