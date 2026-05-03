<template>
    <div class="main-content">
        <div>
            <img src="https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1740333855918.png" />
        </div>
        <div class="title-div-div">
            <div class="title-div">
                活动列表
                <div class="title-bg"></div>
            </div>
        </div>
        <div v-for="(item, index) in list" class="speak-li" :key="item.speakId" @click="goClick(item)">
            <img :src="item.img">
            <div class="speak-li-btn" flex="dir:left cross:center">

                <img src="../../assets/icons/coins-icon.png" v-if="item.award_type==3" />
                <img src="../../assets/icons/credit-icon.png" v-else-if="item.award_type==2" />
                <img src="../../assets/icons/money-icon.png"  v-else />
                <div v-if="item.award_type==3">星币</div>
                <div v-else-if="item.award_type==2">积分</div>
                <div v-else>红包</div>
                <div class="money" v-if="item.award_type==3" >＋{{ item.money/ 100.0  }}</div>
                <div class="money" v-else-if="item.award_type==2" >＋{{ item.money   }}</div>
                <div class="money"  v-else>￥{{ item.money / 100.0 }}</div>
                <div class="speak-btn" flex="dir:left cross:center main:center">
                    <div>立即参与</div>
                </div>
            </div>
        </div>
        
        <div class="tip-div" flex="dir:left cross:center main:center">
            <img src="../../assets/img/speak/no-more.png" />
            <div>暂时没有更多活动了~</div>
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

const list = ref([
//     {
//     locFlag: false,
//     speakId: '',
//     img: '',
//     money: 0,
//     title: '',
// }
]);

function showGeoPosition(position) {
    // console.log(position, "showGeoPosition=====")
    getActivity(position.adcode)
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

function getActivity(adcode) {
    proxy.$axios.get(proxy.$config.domain + 'Activity/WatchVideoIndex?adcode=' + adcode).then(response => {
        if (response.data.code === 200) {
            //e6d84195f69dc66565846609e208da2b_wx5e9598ed6f805441
            const d = response.data.data
            list.value = d
        } else {
            // console.log(response.data.code, "response.data.code", response)
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            showToast(response.data.msg? response.data.msg :'活动获取失败')

        }
    }).catch(error => {
        // showToast('活动获取失败')
        console.log(error, '活动获取失败')
    });
}

function goClick(item) {
    router.replace({ name: 'VideoVideo', query: { id: item.id, type: 'loc' } })
    
}


onMounted(() => {
    GetGeo()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content {
    padding-bottom: 0.8rem;
    background: #FFFFFF;
}
.title-div-div {
    position: relative;
    .title-div {
        position: absolute;
        left: 0;
        right: 0;
        top: -0.5rem;

        font-size: 0.5rem;
        font-weight: bold;
        color: #333333;
        padding:0.3rem 0.6rem;
        background: #FFFFFF;
        border-radius: 0.53rem 0.53rem 0rem 0rem;
        .title-bg {
            width: 2.17rem;
            height: 0.13rem;
            background: #12CB7B;
            opacity: 0.58;
            border-radius: 0.05rem;
            position: absolute;
            top: 0.75rem;
            left: 0.5rem;
        }
    }
}
.speak-li {
    margin: 0.4rem 0.45rem;
    background: #FFFFFF;
    border-radius: 0.27rem;
    padding: 0.15rem 0.15rem 0.3rem;
    box-shadow:0rem 0rem 0.5rem 0rem rgba(128,99,163,0.18);
    .speak-li-btn {
        margin: 0.3rem 0.1rem 0.1rem 0.1rem;
        font-size: 0.37rem;
        font-weight: 500;
        color: #333333;
        line-height: 0.8rem;
        img {
            width: 0.67rem;
            margin-right: 0.1rem;
        }
        .money {
            margin-right: 0.1rem;
            font-size: 0.48rem;
            font-family: Gilroy;
            font-weight: bold;
            color: #FE8E09;
            flex: 1;
        }
        .speak-btn {
            width: 1.97rem;
            height: 0.8rem;
            background: #12CB7B30;
            border-radius: 0.27rem;

            font-size: 0.4rem;
            font-weight: bold;
            color: #12CB7B;

            img {
                width: 0.33rem;
            }
        }
    }
}
.tip-div {
    font-size: 0.4rem;
    line-height: 1rem;
    color: #aaa;
    img {
        width:0.68rem;
        margin-right: 0.1rem;
    }
}

</style>