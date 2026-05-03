<template>
    <div class="main-content record-content">
        <div class="top-div" flex="dir:left main:center cross:center">
            <div class="top-info">
                <div class="top-title">历史记录</div>
                <div class="top-desc"></div>
            </div>
                
            <img src="../../assets/img/mine/record-top-img.png" />
        </div>
        <div class="top-div-line">
            <div></div>
        </div>
        
      <van-list
        v-model:loading="loading"
        :finished="finished"
        v-model:error="error"
        error-text="请求失败，点击重新加载"
        finished-text="暂时没有更多小票了~"
        style="flex-direction: column;"
        @load="onLoad"
      >
      <van-cell class="log-item-card" v-for="(item,index) in logs" :key="index">
        <div flex="dir:left main:center cross:center"> 
            <img class="receipt-img" :src="item.img" @click="imgClick(item.img)" />
            <div class="status-div">
                <div class="status-title"> {{ item.status == 5 ? '人工审核失败':(item.status == 2 ? '自动审核失败':(item.status == 3 ? '小票待审核':'奖励已领取')) }}</div>
                <div class="status-desc" v-if="item.status == 5">{{ item.reason }}</div>
                <div class="status-desc end">{{ getTimeString(item.create_at) }}</div>
            </div>
            <img class="status-icon" src="../../assets/icons/status-waiting.png" v-if="item.status == 3" />
            <img class="status-icon fail" src="../../assets/icons/status-fail.png" v-else-if="(item.status == 5 || item.status == 2)" />
            <img class="status-icon" src="../../assets/icons/award-icon.png"  v-else-if="item.award_type == 2"/>
            <img class="status-icon" src="../../assets/icons/coins-icon.png"  v-else-if="item.award_type == 3"/>
            <img class="status-icon" src="../../assets/icons/money-icon.png" v-else />
            <div class="awiting-div" v-if="item.status == 3">审核中</div>
            <div class="money-div" v-else-if="(item.status != 2 && item.status != 5)">+{{ item.award_type == 2 ? item.money : (item.money / 100).toFixed(2) }}</div>
        </div>
      </van-cell>
      </van-list>
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance} from "vue"
import { formatTimeUnixCustom } from '../../js/time.js'
import { showImagePreview } from 'vant'

const { proxy } = getCurrentInstance()

const logs = ref([])
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const page = ref(1)

function getTimeString(time) {
		return formatTimeUnixCustom(time, 'yyyy-MM-dd')
	}

function onLoad() {
    proxy.$axios.get(proxy.$config.domain + 'Activity/ReceiptRecord?page='+page.value).then(response => {
        if (response.data.code === 200) {
            page.value = page.value + 1
            const d = response.data.data
            if (d.length > 0) {
                logs.value = logs.value.concat(d)
            }
            if (d.length < 10) {
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

function imgClick(img) {
    showImagePreview([img]);
}

onMounted(() => {

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content.record-content {
    background: #FFFFFF;
    .top-div {
        background: linear-gradient(94.83deg, rgba(18, 219, 132, 1) 0%, rgba(0, 174, 255, 1) 100%);
        background-size: 100% 6rem;
        background-color: #FFFFFF;
        background-repeat: no-repeat;
        .top-info {
            flex: 1;
            .top-title {
                padding: 1.12rem 0.375rem 0;
                font-weight: 500;
                font-size: 0.64rem;
                color: #FFFFFF;
            }
            .top-desc {
                margin: 0.1rem 0.375rem 1.5rem;
                width: 0.71rem;
                height: 0.07rem;
                background: #FFFFFF;
                border-radius: 0.03rem;
            }
        }
        img {
            width: 3.04rem;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
    }
    .top-div-line {
        margin-top:-.6rem;
        height: 1rem;
        border-radius: 0.52rem;
        background: #FFFFFF;
        position: relative;
        margin-bottom:-.5rem;
    }
    .log-item-card {
        margin: 0 0.5rem 0.3rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 6px 0rem rgba(154,172,191,0.4);
        border-radius: 0.27rem;
        width: 9rem;
        .receipt-img {
            width: 2rem;
            height: 2rem;
        }
        .status-div {
            text-align: left;
            flex: 1;
            .status-title {
                font-weight: 500;
                font-size: 0.43rem;
                color: #333333;
                height: 0.4rem;
                line-height: 0.4rem;
                margin: 0.5rem 0.2rem 0.25rem 0.5rem;

            }
            .status-desc {
                height: 0.35rem;
                line-height: 0.35rem;
                font-size: 0.35rem;
                color: #999999;
                max-width: 4.6rem;
                margin: 0 0.2rem 0.2rem 0.5rem;
                overflow: hidden;
            }
        }
        .status-icon{
            width: 0.5rem;
            margin-right: 0.2rem;
        }
        .status-icon.fail{
            width: 1.08rem;
            // margin-right: 0.5rem;
        }
        .awiting-div {
            font-weight: bold;
            font-size: 0.37rem;
            color: #139EFF;
        }
        .money-div {
            font-family: Gilroy;
            font-weight: bold;
            font-size: 0.48rem;
            color: #FE8E09;
        }
    }
}

</style>