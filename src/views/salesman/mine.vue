<template>
    <div class="main-content mine-content">
        <div class="top-top-div">
            <div class="empty-div"></div>
            <div class="header-div">
                <div class="name-top" flex="dir:left cross:top">
                    <div class="top-avatar" >
                        <img :src="userInfo.avatar"  v-if="userInfo.avatar" />
                        <img src="https://vipimg.ai-xbys.com/base/base/rank-avatar.png"  v-else/>
                    </div>
                    <div class="top-info">
                        <div class="name" flex="dir:left cross:center">
                            <div>{{userInfo.name}}</div>
                            <img src="../../assets/img/mine/auth-icon.png" v-if="userInfo.status == 5">
                        </div>
                        <div class="auth-btn" v-if="userInfo.status == 3">待审核</div>
                        <div class="auth-btn" v-else-if="userInfo.status == 4">审核失败</div>
                        <div class="auth-div" v-else>已认证账号</div>
                        <div class="chain-name">{{userInfo.mobile}}</div>
                    </div>
                </div>
                <div class="info-credit" flex="dir:left cross:center main:justify">
                    <div class="credit-left">
                        <div class="credit-label">可提现金额(元)</div>
                        <div class="credit-credit">{{(userInfo.money / 100).toFixed(2)}}</div>
                        <div class="credit-labeled">已提现金额(元)</div>
                        <div class="credit-credited">{{(userInfo.out_money / 100).toFixed(2)}}</div>
                    </div>
                    <div class="credit-btn" flex="dir:right cross:center  main:center">
                        <img src="../../assets/img/mine/exchange-icon.png">
                    </div>
                    
                </div>
            </div>
            <div class="qr-div-div" @click="getShareImgClick">
                <div  class="qr-div" flex="dir:left cross:center  main:center">
                    <van-icon name="qr" color="#0486F0" />
                    <div class="qr-text">推广二维码</div>
                    <van-icon name="arrow" color="rgba(30, 38, 51, 0.4)" />
                </div>
            </div>
        </div>
        <div class="info-div" flex="dir:left cross:center  main:center">
            <div class="left-div" flex="dir:left cross:center  main:center">
                <div class="info-num-div">
                    <div class="info-title">我的客户</div>
                    <div class="info-num">{{userInfo.user_num}}</div>
                </div>
                <img src="../../assets/img/mine/client.png">
            </div>
            <div class="right-div" flex="dir:left cross:center  main:center">
                <div class="info-num-div">
                    <div class="info-title">提现明细(笔)</div>
                    <div class="info-num">{{userInfo.out_num}}</div>
                </div>
                <img src="../../assets/img/mine/credit-detail.png">

            </div>
        </div>

        <div class="rank-div" flex="dir:left cross:center  main:justify">
            <div flex="dir:left cross:center  main:justify">
                <img src="../../assets/img/mine/rank.png">
                <div class="rank-label">邀请排行榜</div>
            </div>
            <div>
                快来看看自己的排名吧 <van-icon name="arrow" />
            </div>
        </div>

        

       
    </div>
    <van-popup
        position="bottom"
        v-model:show="showArea">
        <van-area title="选择收货地址" :area-list="areaList" @confirm="confirmAreaClick" />
    </van-popup>

    <van-image-preview v-model:show="showShareImg" :images="shareImgs" className="share_img_preview"
    close-on-click-image="false" closeable="true">
        <template v-slot:index><div>长按保存至相册，可分享至微信好友、朋友圈</div></template>
    </van-image-preview>


</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";

const userInfo = ref({
    avatar:'',
    name:'无名氏',
    status:3,
    mobile:'176****0000',
    money:0,
    out_money:0,
    out_num:0,
    user_num:0,
})


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const showShareImg = ref(false)
const shareImgs = ref([])



let aid = ""
let routerName = ""


setToastDefaultOptions({ duration: 2000 });

function getUserInfo() {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'SalesMan/UserInfo?type=index&id='+aid).then(response => {
        if (response.data.code === 200) {

            const d = response.data.data
            
            if(d.status != 3 && d.status != 4 && d.status != 5) {
                router.replace({name: 'SalesmamReg', query:{'aid':aid}})
                return
            }
            
            userInfo.value = d


            

        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function getShareImgClick() {
    proxy.$axios.get(proxy.$config.domain + 'SalesMan/GetQrcode').then(response => {
        if (response.data.code === 200) {

            const d = response.data.data
            if(d.url) {
                let arr = [];
                arr.push(d.url)
                shareImgs.value = arr
                showShareImg.value = true
                return
            }
            
            

            

        }
         showToast(response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' )

        
    })
        .catch(error => {
            showToast('网络连接错误，请刷新重试' )
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

onMounted(() => {
    let id = route.query.aid
    if(id && typeof id === 'string') {
        aid  = id
    }


    getUserInfo()



})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    // padding-bottom: 1.45rem;

    background: #fff;
}
.main-content.mine-content {
    .top-top-div{
    background: linear-gradient( 360deg,rgba(7,122,217,0.05) 0%,  rgba(7,122,217,0.18) 60%, rgba(48,227,152,0.18) 100%), #FFFFFF;
    .empty-div {
            height: 0.8rem;
        }
    .header-div {
        // width: 9.25rem;
        margin: 0 0.375rem;
        border-radius: 0.75rem;
        // height: 4.67rem;
        background: linear-gradient( 3deg, #40A9FF 0%, #30E398 100%), #FFFFFF;
        padding: 0.6rem 0.375rem;
        .top-avatar {
            img {
                width: 1.7rem;
                height: 1.7rem;
                border-radius: 50%;
                margin-right: 0.3rem;
            }
        }
        .top-info {
            .name {
                font-size: 0.48rem;
                color: #FFFFFF;
                font-weight: 500;
                height: 0.48rem;
                img {
                    width: 0.9rem;
                    height: 0.9rem;
                }
            }
            .auth-div {
                width: 2.2rem;
                height: 0.5rem;
                background: #FFFFFF;
                border-radius: 1.6rem;
                font-size: 0.32rem;
                color: #0AC97A;
                margin-top: 0.2rem;
                line-height: 0.5rem;
                text-align: center;
            }
            .auth-btn {
                height: 0.5rem;
                font-size: 0.32rem;
                color: #fff;
                margin-top: 0.2rem;
                line-height: 0.5rem;
                text-align: left;
            }
            .chain-name {
                margin-top: 0.16rem;
                font-size: 0.32rem;
                color: #FFFFFF;
                line-height: 0.32rem;
            }

        }
        .info-credit {
            font-size: 0.37rem;
            color: #fff;
            margin-bottom: 0.6rem;
            .credit-label {
                margin-top: 0.5rem;
            }
            .credit-credit {
                margin-top: 0.1rem;
                font-weight: 500;
                font-size: 0.64rem;
                color: #FFFFFF;
                line-height: 0.64rem;
            }
            .credit-labeled {
                margin-top: 0.3rem;
            }
            .credit-credited {
                margin-top: 0.1rem;
                font-size: 0.48rem;
                color: #FFFFFF;
            }
            .credit-btn {
                flex: 1;
                position: relative;
                img {
                    width: 2.59rem;
                    height: 0.96rem;
                    position: absolute;
                    right:  -0.375rem;;
                }
            }
        }
        
    }
    .qr-div-div {
        border-radius: 0.32rem 0.32rem 0 0;
        height: 1.6rem;
        background: rgba(255, 255, 255, 0.88);
        margin-top: -0.8rem;
        font-size: 0.4rem;
        line-height: 1.6rem;
        color: #000;
        .qr-div {
            margin-left:0.75rem;
            margin-right:0.75rem;
            .qr-text {
                margin-left: 0.2rem;
                flex: 1;
            }

        }
    }}
    .info-div {
        font-size: 0.37rem;
        color: #777E8C;
        img {
            width: 0.85rem;
            height: 0.85rem;
            margin-right: 0.375rem;
        }
        .info-num-div {
            flex: 1;
            margin-left: 0.375rem;
            .info-num {
                font-size: 0.53rem;
                color: #1E2633;
            }
        }
        .left-div {
            width: 4.44rem;
            height: 2.37rem;
            background: #E0EFFF;
            border-radius: 0.43rem

        }
        .right-div {
            margin-left: 0.37rem;
            width: 4.4rem;
            height: 2.37rem;
            background: #FDEBE4;
            border-radius: 0.43rem
        }

    }
    .rank-div {
        margin: 0.53rem 0.375rem 0;
        border-radius: 0.21rem;
        height: 1.52rem;
        background: rgba(234,228,255,0.5);
        border-radius: 0.43rem 0.43rem 0.43rem 0.43rem;
        font-size: 0.37rem;
        color: #996CF6;
        padding: 0 0.32rem;
        img {
            width: 0.43rem;
            margin-right: 0.3rem;
        }
        .rank-label {
            font-weight: bold;
        }
    }
}
.main-content.empty{
    background: #fff;
}

</style>
<stype lang="scss">
.share_img_preview {
    .van-image-preview__index {
        top: auto;
        bottom: 0.3rem;
        // color: #0AC97A;
        font-size: 0.32rem;
    }
}
</stype>