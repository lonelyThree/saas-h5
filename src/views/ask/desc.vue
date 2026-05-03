<template>
    <div class="main-content empty" v-if="showEmpty">
        <van-empty :description="tipMessage" />
    </div>
    <div class="main-content" v-else>
        <div class="desc-bg"
            :style="{ backgroundImage: 'url(' + descBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="content">
                <div class="topbg">活动规则</div>
                <!-- <img src="../../assets/img/sm1.png" /> -->
                <div class="border-bg" v-if="descStatus == 1" v-html="desc"></div>
                <div class="border-bg" v-else><img :src="descImg" /></div>
                
                <img src="../../assets/img/desc3.png" />
            </div>
            
        </div>

        <!-- <div class="">
            <img :src="indexBg" />
        </div>
         -->
         <div class="tip-div"  @click="cServiceClick">
                <van-icon name="warning" color="#EFA52D"/>
                活动最终解释权归公司所有  <span class="num-span">联系客服</span>
            </div>

        <tabbar :index="1" :aid="aid" />
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import tabbar from '../../components/custom_tabbar.vue'
import { useRouter } from 'vue-router'

const { currentRoute } = useRouter();
const route = currentRoute.value;

const { proxy } = getCurrentInstance()

const active = ref(0);

const tipMessage = ref("正在加载中")
const showEmpty = ref(true)
const descBg = ref("")
// const 


const descStatus = ref(1)
const descImg = ref("")
const desc = ref("")

let aid = ref('')

let cservice_url = ''

function cServiceClick() {
    if (cservice_url) {
        window.location.replace(cservice_url)
    }
}


function getActivity() {
    // console.log("proxy", process)
    console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Activity/GetInfo?type=desc&id=' + aid.value).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            showEmpty.value = false
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            cservice_url = d.cservice_url
            descBg.value = d.desc_bg
            descImg.value = d.desc_img
            desc.value  = d.desc
            descStatus.value = d.desc_status
            // this.patientLilst = response.data.data || []
            // setTimeout(() => {
            //   //$('.fixed-patient').css('bottom', -$('.fixed-patient').outerHeight())

            // }, 1000)
        } else {
            // this.$toast(response.data.message)
        }
    })
        .catch(error => {
            console.log(error)
        });
}



onMounted(() => {
    let id = route.query.id
    if (!id || typeof id !== 'string') {
        tipMessage.value = "未找到活动"
        return
    }
    aid.value = id
    getActivity()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    padding-bottom: 1.45rem;

    background: #fff6e1;
}
.main-content.empty{
    background: #fff;
}
.desc-bg {
    width: 10rem;
    height: 16rem;

    .empty {
        width: 0;
        height: 1.6rem;
    }
    .content {

        margin-left: 0.43rem;
        width: 9.12rem;
        .topbg{
            width: 9.12rem;
            height: 1.11rem;
            background: url(../../assets/img/desc1.png);
            background-size:100% 1.11rem;
            font-size: 0.64rem;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 1.3rem;
            text-align: center;
        }
        .border-bg {
            // margin: 17.36rem 1.47rem auto 1.8rem;
            min-height: 1.6rem;
            background: url(../../assets/img/desc2.png);
            background-size: 100% 10.12rem;
            


            font-size: 0.4rem;
            color: #333;
            line-height: 0.63rem;
            padding: 0 0.88rem;

            word-wrap:break-word;
            table-layout:fixed;
            word-break:break-all;
            p {word-wrap: break-word;}
        }

    }

    
}
.tip-div {
    margin: .5rem auto 1rem;
        height: 0.63rem;
        font-size: 0.35rem;
        color: #333333;
        line-height: 0.63rem;
        text-align: center;
        .num-span {
            color:#FF690E
        }
    }
</style>