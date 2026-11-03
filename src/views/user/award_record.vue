<template>
    <div class="main-content record-content">
        <div class="top-div" flex="dir:left main:center cross:center">
            <div class="top-info">
                <div class="top-title">奖励记录</div>
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
        finished-text="暂时没有更多记录了~"
        style="flex-direction: column;"
        @load="onLoad"
      >
      <van-cell class="log-item-card" v-for="(item,index) in logs" :key="index">
        <div flex="dir:left main:center cross:center"> 
             <div class="item-left">
                <div class="item-title">{{ item.activity_name }}</div>
                <div class="time">
                    {{ getTimeString(item.create_at) }}
                </div>
                <div class="remark" v-if="item.remark">{{ item.remark }}</div>

             </div>
             <div class="item-right"  flex="dir:left main:center cross:center">
            <img class="status-icon" src="../../assets/icons/credit-icon.png"  v-if="item.award_type == 2"/>
            <img class="status-icon" src="../../assets/icons/coins-icon.png"  v-else-if="item.award_type == 3"/>
            <img class="status-icon" src="../../assets/icons/money-icon.png" v-else />
            <div class="money-div" >+{{ item.award_type == 2 ? item.money.toFixed(2)  : (item.money / 100).toFixed(2) }}</div>

             </div>
            
            
           
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
		return formatTimeUnixCustom(time, 'yyyy-MM-dd hh:mm')
	}

function onLoad() {
    proxy.$axios.get(proxy.$config.domain + 'User/AwardList?page='+page.value).then(response => {
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
        margin: 0 0 0.3rem;
        background: #FFFFFF;
       // box-shadow: 0rem 0rem 6px 0rem rgba(154,172,191,0.4);
        // border-bottom: 1px solid #f1f1f1;
       // border-radius: 0.27rem;
       padding: 0.3rem 0.5rem;
        // width: 9rem;
        .item-left {
            flex: 1;
            text-align: left;
            .item-title {
                font-size: 0.39rem;
                color: #000000;
                line-height: 0.4rem;

                 display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
               

            }
            .time, .remark {
                margin-top: 0.2rem;
                height: 0.35rem;
                line-height: 0.35rem;
                font-size: 0.33rem;
                color: #999999;
            }
        }
        .status-icon{
            width: 0.5rem;
            margin-right: 0.2rem;
             margin-left: 0.5rem;
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
             min-width: 1.5rem;
        }
    }
}

</style>