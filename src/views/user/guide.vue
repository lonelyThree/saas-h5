<template>
    <div class="main-content guide-content">
        <div class="img-div">
            <img :src="item" v-for="(item,index) in imgUrls"  :key="item"/>
        </div>
        <div class="bottom-btn" @click="btnClick">点击注册立即领取</div>
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";

const router = useRouter()

const { proxy } = getCurrentInstance()


let aid = ""
let uid = ""

const imgUrls = ref({})



setToastDefaultOptions({ duration: 2000 });

function btnClick() {
    router.replace({name: 'UserReg', query:{uid:uid,aid:aid,atype:'invite'} })
}


function getGuideInfo() {
    console.log(proxy.$config.domain + 'User/GuideInfo?aid='+aid)
    proxy.$axios.get(proxy.$config.domain + 'User/GuideInfo?aid='+aid).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.guide_imgs) {
                imgUrls.value = d.guide_imgs
            }
        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
    })
        .catch(error => {
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

onMounted(() => {
    aid = proxy.$route.query.aid
    uid = proxy.$route.query.uid
    getGuideInfo()



})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    // padding-bottom: 1.45rem;

    background: #fff;
}
.main-content.guide-content {
    .bottom-btn {
        background: #FF841A;
        border-radius: 0.27rem;
        // margin: .7rem 0.375rem;
        height: 1.3rem;
        font-size: 0.43rem;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.3rem;
        box-shadow: 0px 1px 0.05rem  #646566;
        position: relative;
        bottom: 0.3rem;
        position: absolute;
    bottom: 0.2rem;
    left: 0.375rem;
    right: 0.375rem;
    }
}

</style>