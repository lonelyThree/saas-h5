<template>
    <div class="main-content customer-content">
        <div class="img-div" :style="{ backgroundImage: 'url(' + regBg + ')', backgroundSize: '100% 18.8rem', backgroundRepeat: 'no-repeat' }">
            <img :src="qrcode"  />
        </div>
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

const qrcode = ref('')

const regBg = ref("https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1728915183315.png")


setToastDefaultOptions({ duration: 2000 });



function getGuideInfo() {
    proxy.$axios.get(proxy.$config.domain + 'User/GuideInfo?type=customer&aid='+aid).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.qrcode) {
                qrcode.value = d.qrcode
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
    uid = proxy.$route.query.uid?? ''
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
.main-content.customer-content {
    .img-div {
        height: 18.8rem;
        position: relative;
        img {
            width: 4.8rem;
            height: 4.8rem;
            position: absolute;
            left: 2.58rem;
            top: 6.833rem;
        }
    }
}

</style>