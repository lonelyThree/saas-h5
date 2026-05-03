<template>
    <div class="main-content class-content">
        <img v-if="companyListImg" :src="companyListImg" />
        <img v-else src="../../assets/img/mine/reg-top-bg.png" />
        <div class="top-div-line">
            <div></div>
        </div>
        <div class="class-tab" :style="{'--active-color': activeColor}">
            <div :class="sort==1?'active':''" @click="select(1)">综合排序</div>
            <div :class="sort==2?'active':''" @click="select(2)">最多浏览</div>
            <div :class="sort==3?'active':''" @click="select(3)">参加人数</div>
            <div :class="sort==4?'active':''" @click="select(4)">最新入住</div>
        </div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        v-model:error="error"
        error-text="请求失败，点击重新加载"
        finished-text="暂时没有更多机构了~"
        style="flex-direction: column;"
        @load="onLoad"
      >
      <van-cell class="log-item-card" v-for="(item,index) in logs" :key="index" @click="goClick(item)">
        <div flex="dir:left main:center cross:center"> 
            <img class="receipt-img" :src="item.logo" />
            <div class="status-div">
                <div class="status-title"> {{ item.name }}</div>
                <div class="status-desc">{{item.view}}人浏览 <span>|</span> {{ item.join }}人参加 <span>|</span> {{ item.avtivity_num }}个活动</div>
            </div>
        </div>
      </van-cell>
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
const sort = ref(1)
const activeColor = ref('#01B7C5')
const companyListImg = ref('')
function onLoad() {
    proxy.$axios.get(proxy.$config.domain + 'Company/List?page='+page.value+"&sort="+sort.value).then(response => {
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

function getSetting() {
    proxy.$axios.get(proxy.$config.domain + 'Company/ListSetting').then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d && d.company_list_img) {
                companyListImg.value = d.company_list_img
            }
            if (d && d.title_color) {
                activeColor.value = d.title_color
            }
        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
       
    })
        .catch(e => {

        });
}

function select(selectedSort) {
    page.value = 1
    sort.value = selectedSort
    logs.value = []
    onLoad()
}

function goClick(item) {
    if  (item.link.indexOf('http') == 0) {
        window.open(item.link)
    } else {
        router.replace({ name: 'CompanyInfo', query: { id: item.link, type: 'loc' } })
    }

}

onMounted(() => {
    getSetting()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content.class-content {
    background: #FFFFFF;
    
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
        // border-radius: 0.27rem;
        width: 10rem;
        .receipt-img {
            width: 1.7rem;
            height: 1.7rem;
            border-radius: 50%;
        }
        .status-div {
            text-align: left;
            flex: 1;
            .status-title {
                font-weight: 500;
                font-size: 0.43rem;
                color: #333333;
                line-height: 0.6rem;
                margin: 0.2rem 0.2rem .4rem 0.5rem;

            }
            .status-desc {
                height: 0.32rem;
                line-height: 0.32rem;
                font-size: 0.32rem;
                color: #969799;
                margin: 0.2rem 0.2rem .2rem 0.5rem;
                overflow: hidden;
                span {
                    margin: 0 0.05rem;

                }
            }
        }
    }
    .class-tab{
        margin-top:-.2rem;
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.35rem;
    color: #999999;
    background: #fff;
    justify-items: center;
    align-items: center;
    margin-bottom: .5rem;
  }
  .class-tab div{
    /*height: 100%;*/
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .class-tab .active{
    font-weight: 500;
    color: var(--active-color);
  }
}

</style>