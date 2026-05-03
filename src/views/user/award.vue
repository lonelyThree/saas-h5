<template>
    <div class="main-content user-award-content">
        <div class="top-div">
            <div class="tip-div">认证身份领{{awardList[1].money/ 100.0}}元现金红包</div>
            <div class="title-div">注册红包</div>
            <div class="sub-title-div">可获得红包奖励</div>
            <div class="money-div" flex="dir:left main:center cross:baseline"><span>{{awardList[0].money/ 100.0}}</span><span class="span">元</span></div>
            <div class="receive-btn-div" v-if="awardList[0].status == 2" @click="receiveClick(1)">点击领取</div>
            <div class="receive-btn-div" v-else-if="awardList[0].status == 3">已领取</div>
            <div class="op-btn-div" v-else-if="awardList[0].status == 1" @click="goReg">立即注册</div>
            <div class="op-btn-div" v-else @click="goCustomer">点击领取</div>
        </div>
        <div class="reb-packet-div auth-div">
            <div class="title-div">成功认证红包</div>
            <div class="sub-title-div">可获得红包奖励</div>
            <div class="money-div" flex="dir:left main:center cross:baseline"><span>{{awardList[1].money/ 100.0}}</span><span class="span">元</span></div>
            <div class="receive-btn-div" v-if="awardList[1].status == 2" @click="receiveClick(2)">点击领取</div>
            <div class="receive-btn-div" v-else-if="awardList[1].status == 3">已领取</div>
            <div class="op-btn-div" v-else @click="goAuth">立即认证</div>

        </div>
        <div class="reb-packet-div invite-div" v-if="awardList[2].money > 0">
            <div class="title-div">邀请好友注册</div>
            <div class="sub-title-div">可获得红包奖励</div>
            <div class="money-div" flex="dir:left main:center cross:baseline"><span>{{awardList[2].money/ 100.0}}</span><span class="span">元</span></div>
            <div class="receive-btn-div" v-if="awardList[2].status == 2" @click="receiveClick(3)">点击领取</div>
            <div class="receive-btn-div" v-else-if="awardList[2].status == 3">已领取</div>
            <div class="op-btn-div" v-else  @click="goShare">立即邀请</div>

        </div>

        <div class="receive-btn-div btn-bottom" @click="goMine">返回主页</div>
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue";


import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showLoadingToast, closeToast, showDialog, showImagePreview } from "vant";

const router = useRouter()

const { proxy } = getCurrentInstance()

const awardList = ref([
    {
        money: 1,
        status: 1,
    },{
        money: 1,
        status: 1,
    },{
        money: 0,
        status: 1,
    }
])


setToastDefaultOptions({ duration: 2000 });



function getAwardInfo() {
    proxy.$axios.get(proxy.$config.domain + 'User/UserAward').then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d) {
                awardList.value = d
            }
        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function receiveClick(type){
    proxy.$axios.post(proxy.$config.domain + "User/ReceiptAward", { type: type}, { toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            let d = response.data.data
            if (d.status == 0) {
                showToast(d.msg)
            } else if (d.status == 200 ) {
                showToast(d.data)
            } else {
                showToast(response.data.msg ? response.data.msg : '领取失败');
            }
            
        } else {
            showToast(response.data.msg ? response.data.msg : '领取失败');
            // self.prevent = false;
        }
        setTimeout(() => {
            getAwardInfo()
        }, 1000);
    }).catch(error => {
            showToast("领取失败！");
            setTimeout(() => {
                getAwardInfo()
            }, 1000);
        });
}

function goCustomer(){
    router.replace({name: 'UserCustomer'})
}
function goReg(){
    router.replace({name: 'UserReg'})
}

function goMine(){
    router.replace({name: 'UserMine'})
}

function goShare() {
    showToast("暂未开放...")
}

function goAuth() {
    router.replace({name: 'UserAuth'})
}



onMounted(() => {
    getAwardInfo()
})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    // padding-bottom: 1.45rem;

    background: #FEDFD5;
}
.main-content.user-award-content {
    background: #FEDFD5;
    .title-div {
        margin-top: 0.225rem;
        margin-left: 0.47rem;
        font-size: 0.45rem;
        color: #FFFFFF;
        line-height: 1rem;
        height: 1rem;
        font-weight: 500;
    }
    .sub-title-div {
        margin-top: 0.4rem;
        font-size: 0.37rem;
        color: #383838;
        line-height: 0.37rem;
        height: 0.37rem;
        text-align: center;
    }
    .money-div {
        margin-top: 0.1rem;
        font-weight: 700;
        font-size: 1.07rem;
        color: #EF3E3F;
        line-height: 1.07rem;
        text-align: center;
        .span {
            font-weight: 600;
            font-size: 0.64rem;
        }
    }
    .receive-btn-div {
        width: 4rem;
        height: 0.9rem;
        border-radius: 0.26rem;
        background: linear-gradient(242.83deg, rgba(212, 121, 231, 1) 0%, rgba(220, 87, 193, 1) 47.92%, rgba(250, 60, 114, 1) 100%);
        border: 2px solid rgba(255, 255, 255, 1);

        box-shadow:inset 0px 2px 4px  rgba(174, 55, 179, 1), 0px 2px 4px  rgba(222, 64, 47, 1);
        border: 0.05rem solid #FFFFFF;
        text-align: center;
        font-size: 0.37rem;
        color: #FFFFFF;
        line-height: 0.9rem;
        margin-left: 2.47rem;
        margin-top: 0.2rem;
    }
    .op-btn-div {
        width: 4rem;
        height: 0.9rem;
        border-radius: 1.6rem;
        background: linear-gradient(180deg, rgba(247, 227, 195, 1) 0%, rgba(245, 206, 135, 1) 100%);
        font-size: 0.37rem;
        color: #7D140A;
        text-align: center;
        line-height: 0.9rem;
        margin-left: 2.47rem;
        margin-top: 0.3rem;
        
    }
    .top-div {
        background-image: url(../../assets/img/mine/award-top.png);
        background-size: 100% 100%;
        height: 7.84rem;
        .tip-div {
            padding-top:1.95rem;
            padding-left: 0.7rem;
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: 0.32rem;
            color: #DD4836;
            text-align: left;
        }
        .title-div {
            margin-left: 1rem;
        }
        .receive-btn-div {
            margin-left: 3rem;
            margin-top: 0.5rem;
        }
        .op-btn-div {
            margin-left: 3rem;
            margin-top: 0.5rem;
        }
    }
    
    .reb-packet-div {
        background-image: url(../../assets/img/mine/award-red-packet-bg.png);
        background-size: 100% 100%;
        height: 4.66rem;
        margin:0.225rem 0.53rem;
    }
    .reb-packet-div.invite-div {
        margin-top: 0.45rem;
    }

    .btn-bottom {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }
}

</style>