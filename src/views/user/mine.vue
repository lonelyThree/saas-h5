<template>
    <div class="main-content mine-content">
        <div class="empty"></div>
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
                    <div class="auth-div" v-if="userInfo.status == 5">已认证账号</div>
                    <div class="auth-btn" v-else-if="userInfo.status == 1" @click="goAuthClick">去认证<van-icon name="arrow" color="#fff" size="0.32rem"/></div>
                    <div class="auth-div" v-else-if="userInfo.status == 3">待审核</div>
                    <div class="auth-btn" v-else-if="userInfo.status == 4" @click="goAuthClick">审核失败，去认证<van-icon name="arrow" color="#fff" size="0.32rem"/></div>
                    <div class="auth-btn" v-else>去注册</div>
                    <div class="chain-name">{{userInfo.chain_name}}</div>
                </div>
            </div>
            <div class="info-credit" flex="dir:left cross:center main:justify">
                <div class="credit-left" @click="goCreditClick">
                    <div class="credit-label">积分</div>
                    <div class="credit-credit">{{userInfo.credit}}</div>
                </div>
                <div class="credit-left" @click="goCoinClick">
                    <div class="credit-label">星币</div>
                    <div class="credit-credit">{{userInfo.balance}}</div>
                </div>
                <div class="credit-btn" flex="dir:left cross:center  main:center" @click="goShopClick">
                    <img src="../../assets/img/mine/credit-icon.png">
                    <div>奖品兑换</div>
                </div>
                
            </div>
        </div>

        <!-- <div class="change-div" flex="dir:left cross:center  main:justify" @click="changeTypeClick">
            <div>奖励领取方式 <van-icon name="question" color="#C4C4C4" size="0.42rem" @click="changeTipClick"/></div>
            <div flex="dir:left cross:center  main:justify">
                <div class=" change-radio" :class="userInfo.receive_type == 1 ? 'radio-checked' : ''" flex="dir:left cross:center  main:justify">
                    <van-icon name="checked"  size="0.42rem" /> 红包
                </div>
                <div  class="change-radio"  :class="userInfo.receive_type != 1 ? 'radio-checked' : ''" flex="dir:left cross:center  main:justify">
                    <van-icon name="checked"  size="0.42rem" /> 积分
                </div>
            </div>
        </div> -->

        <!-- <div class="activity-div" v-if="userInfo.status != 5"  @click="goAuthClick">
            <img src="../../assets/img/mine/activity-auth.png ">
        </div> -->

        <div class="more-div">
            <div class="more-title"><div></div> 更多设置</div>
            <div class="more-cell" flex="dir:left cross:center  main:justify" @click="goEditClick">
                <div class="more-cell-item">
                    <img src="../../assets/img/mine/info-icon.png">
                    个人资料修改
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div>
            <div class="more-cell" flex="dir:left cross:center  main:justify" @click="goAuthClick">
                <div class="more-cell-item">
                    <img src="../../assets/img/mine/review-icon.png">
                    身份认证审核
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div>
            <div class="more-cell" flex="dir:left cross:center  main:justify" @click="goRecordClick">
                <div class="more-cell-item">
                    <img src="../../assets/img/mine/join-icon.png">
                    活动参与记录
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div>
            <!-- <div class="more-cell" flex="dir:left cross:center  main:justify">
                <div class="more-cell-item">
                    <img src="../../assets/img/mine/record-icon.png">
                    我的活动记录
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div> -->

            <!-- <div class="more-cell" v-if="jumpWeAppId" flex="dir:left cross:center  main:justify" @click="goMiniPurchaseClick">
                <div class="more-cell-item">
                    <img src="../../assets/icons/m_icon_yg.png">
                    我的课程
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div>
            <div class="more-cell"  v-if="jumpWeAppId" flex="dir:left cross:center  main:justify" @click="goMiniCredClick">
                <div class="more-cell-item">
                    <img src="../../assets/icons/m_icon_wdzs.png">
                    我的证书
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div>
            <div class="more-cell"  v-if="jumpWeAppId" flex="dir:left cross:center  main:justify" @click="goMiniExamRecordClick">
                <div class="more-cell-item">
                    <img src="../../assets/icons/m_icon_ksjl.png">
                    考试记录
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div> -->
            <div class="more-cell" flex="dir:left cross:center  main:justify" @click="goCustomerClick">
                <div class="more-cell-item">
                    <img src="../../assets/img/mine/invite-icon.png">
                    领取红包
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div>

            <!-- <div class="more-cell" flex="dir:left cross:center  main:justify" @click="goQuestionClick">
                <div class="more-cell-item">
                    <img src="../../assets/icons/m_icon_question.png">
                    常见问题及说明
                </div>
                <van-icon name="arrow" color="#1E2633" size="0.32rem"/>
            </div> -->
            
        </div>

    <van-action-sheet
        v-model:show="sheetShow"
        :actions="actions"
        cancel-text="取消"
        description="开通红包后, 自动按税后金额发放, 根据国家相关规定需扣除20%偶然所得税，点击可设置为积分兑换方式（无需扣除）"
        close-on-click-action
        @select="onSelect"
     />

       
    </div>

    <van-popup v-model:show="showPop" class="red-packet-pop" closeable 
    :close-on-click-overlay="true" close-icon="close">
        <div class="reg-packet-bg">
            <div class="money">{{ money }}</div>
            <div class="reb-pop-btn" @click="receiveClick"></div>
        </div>
        

    </van-popup>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";
import func from "vue-temp/vue-editor-bridge";

const showPop = ref(false)


const userInfo = ref({
    avatar:'',
    name:'无名氏',
    status:0,
    chain_name:'老百姓大药房连锁有限公司',
    credit:'-',
    balance:'-',
    receive_type:1,
    store_name:'',
    nickname:'',
})

const sheetShow = ref(false)
const actions = [
      { name: '红包', val:1 },
      { name: '积分', val:2},
];

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const creditUrl = ref('')
const coinUrl = ref('')
const shopUrl = ref('')

const { proxy } = getCurrentInstance()


const jumpMiniProgram = ref(false)
const jumpWeAppId = ref('')

const regBg = ref("https://wximg.ai-xbys.com/images/global/m46E64gDawH4Et69mwMVe0YwG0TryW.png")
// const 


let aid = ""
let routerName = ""


const addressInfo = ref({
    askId:'',
    name:'',
    idCard:'',
    mobile:'',
    areaInfo:'',
    areaDetail: {
        provinceId:0,
        provinceName:'',
        cityId:0,
        cityName:'',
        countyId:0,
        countyName:'',

    },
    address:'',
})


const showArea = ref(false)
const money = ref(0.01)

let cservice_url = ''


setToastDefaultOptions({ duration: 2000 });

function gotoUrl(name, query) {
    if(!jumpMiniProgram.value) {
        router.replace({name: name,  query:query})
        return
    }
    let toQuery = query
    if (route.query.wx_appid) {
        toQuery.wx_appid = route.query.wx_appid
    }
   
    let url = router.resolve({name: name,  query:toQuery})
    let urlPath = encodeURIComponent(window.location.origin + url.href)
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/h5_jump/index?url=' + urlPath})
            return
       }
       router.replace({name: name,  query:query})

    })
}

function gotoUrlPath(url) {
    if(!url) {
        return
    }
    if(!jumpMiniProgram.value) {
        window.location.replace(url)
        return
    }
    let urlPath = encodeURIComponent(url)
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/h5_jump/index?url=' + urlPath})
            return
       }
       window.location.replace(url)

    })
}

function goAuthClick() {
    gotoUrl('UserAuth', {page: 'UserMine'})
}

function goCustomerClick() {
    gotoUrl('UserAward', {aid: ''})
}

function receiveClick() {
    gotoUrl('UserAward', {aid: ''})
}

function goEditClick() {
    gotoUrl('UserReg', {page: 'UserMine'})
}

function goRecordClick() {
    gotoUrl('UserActivityRecord', {page: 'UserMine'})
}

function goCreditClick() {
    gotoUrlPath(creditUrl.value)
}

function goCoinClick() {
    gotoUrlPath(coinUrl.value)
}

function goShopClick() {
    gotoUrlPath(shopUrl.value)
}

function goQuestionClick() {
    gotoUrlPath('https://shop.ai-xbys.com/wap/17/pagesCustom/index/index?pageId=305')
}

function changeTypeClick() {
    sheetShow.value = true
    
}
function changeTipClick(){
    showToast("开通红包后，自动按税后金额发放，根据国家相关规定需扣除20%偶然所得税，点击可设置为积分兑换方式（无需扣除）");
}

function goMiniPurchaseClick() {
    // 或者
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/user/purchased/index'})
            return
       }
       window.location.href='weixin://dl/business/?appid=wxaa0372751024ab27&path=pages/user/purchased/index'

    })


}

function goMiniCredClick() {
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/user/cred/index'})
            return
       }
       window.location.href='weixin://dl/business/?appid=wxaa0372751024ab27&path=pages/user/cred/index'

    })
    
}

function goMiniExamRecordClick() {
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/exam/examrecord?categoryid=0'})
            return
       }
       window.location.href='weixin://dl/business/?appid=wxaa0372751024ab27&path=/pages/exam/examrecord?categoryid=0'

    })
    
}

function onSelect(item) {
    proxy.$axios.post(proxy.$config.domain + "User/ChangeRecType?receiveType="+ item.val)
    .then(response => {
        // this.showLoading = false;
        if (response.data.code === 200) {
            showToast('设置成功！')
            userInfo.value.receive_type = item.val
        } else {
            showToast(response.data.msg?response.data.msg:'保存失败');
        }
    })
    .catch(error => {
        showToast("保存失败！");
    });
    
}


function getUserInfo() {
    proxy.$axios.get(proxy.$config.domain + 'User/UserInfo').then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.status == 2 || d.status == 0) {
                if(proxy.$route.query.aid && proxy.$route.query.uid) {

                    router.replace({name: 'UserGuide', query:{aid:proxy.$route.query.aid, uid:proxy.$route.query.uid}})
                } else {

                    router.replace({name: 'UserReg'})
                }
                return
            }
            userInfo.value = d
            if(d.money_status == 1) {
                showPop.value = true
                money.value = d.money_receive / 100.0
            }

            if(d.credit_url) {
                creditUrl.value = d.credit_url
            }

            if(d.shop_url) {
                shopUrl.value = d.shop_url
            }



            if(d.balance_url) {
                coinUrl.value = d.balance_url
            }

            if(d.jump_we_app_id) {
                jumpWeAppId.value = d.jump_we_app_id
                if (!jumpMiniProgram.value) {
                    getJsTicket()
                }
            }



        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function getJsTicket() {
    let url = window.location.href.split('#')[0]
    proxy.$axios.get(proxy.$config.domain + 'User/GetTicketSign?url='+ encodeURIComponent(url)).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            wx.config({
                debug: false,
                appId: d.appId,
                timestamp: d.timestamp,
                nonceStr: d.nonceStr,
                signature: d.signature,
                jsApiList: ['chooseImage'],
                openTagList: ['wx-open-launch-weapp']
            })
            wx.ready(function () {
                console.log('成功了===')
            })
            wx.error(function (res) {
                console.log(res)
            })


        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
    .catch(error => {
        // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    });
}

onMounted(() => {
    let channel_name = route.query.channel_name
    if(channel_name && typeof channel_name === 'string' && channel_name == 'weapp') {
        jumpMiniProgram.value = true
        getJsTicket()
    }
    getUserInfo()
    


})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    // padding-bottom: 1.45rem;

    background: #fff6e1;
}
.main-content.mine-content {
    background: linear-gradient( 360deg,rgba(7,122,217,0.05) 0%,  rgba(7,122,217,0.18) 60%, rgba(48,227,152,0.18) 100%), #FFFFFF;
    .header-div {
        // width: 9.25rem;
        margin: 0.8rem 0.375rem 0;
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
            .credit-label {
                margin-top: 0.5rem;
            }
            .credit-credit {
                margin-top: 0.25rem;
                margin-bottom: 0.1rem;
                font-weight: bold;
                font-size: 0.64rem;
                color: #FFFFFF;
                line-height: 0.64rem;
            }
            .credit-btn {
                width: 2.45rem;
                height: 0.69rem;
                border-radius: 1.6rem;
                font-size: 0.32rem;
                background-color: #FFFFFF;
                color: #0AC97A;
                img {
                    width: 0.42rem;
                    height: 0.42rem;
                    margin-right: .15rem;
                }
            }
        }
        
    }
    .change-div {
        margin: 0.375rem 0.375rem 0;
        border-radius: 0.21rem;
        background-color: #FFFFFF;
        font-size: 0.37rem;
        color: #000;
        height: 1.15rem;
        padding: 0 0.32rem;
        .change-radio {
            margin-left: 0.3rem;
            font-size: 0.4rem;
            i {
                color:#C4c4c4;
                margin-right: 0.05rem;
            }
        }
        .change-radio.radio-checked {
            color: #0AC97A;
            i {
                color: #0AC97A;
            }
            
        }
    }
    .activity-div {
        margin: 0.375rem;
    }
    .more-div {
        // width: 9.25rem;
        margin:  0.375rem;
        border-radius: 0.27rem;
        // height: 4.67rem;
        background:  #FFFFFF;
        padding: 0.6rem 0.375rem;
        .more-title {
            font-size: 0.37rem;
            color: #000;
            position: relative;
            div {
                width: 0.1rem;
                height: 0.35rem;
                background: #0AC97A;
                position: absolute;
                background-image: initial;
                left: -0.375rem;
                top: 0.1rem;
            }
        }
        .more-cell {
            margin: 0.67rem 0 0.18rem;
            font-size: 0.37rem;
            color: #323233;
            img {
                width: 0.53rem;
            }
        }
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
            margin-top: 0.5rem;
            // .credit-label {
            //     margin-top: 0.5rem;
            // }
            .credit-credit {
                margin-top: 0.25rem;
                margin-bottom: 0.1rem;
                font-weight: 500;
                font-size: 0.64rem;
                color: #FFFFFF;
                line-height: 0.64rem;
            }
            .credit-btn {
                width: 2.45rem;
                height: 0.69rem;
                border-radius: 1.6rem;
                font-size: 0.32rem;
                background-color: #FFFFFF;
                color: #0AC97A;
                img {
                    width: 0.42rem;
                    height: 0.42rem;
                    margin-right: .15rem;
                }
            }
        }
        
    }
}
.main-content.empty{
    background: #fff;
}
.reg-bg {
    width: 10rem;
    // height: 21.28rem;
    min-height: 100vh;

    .empty {
        width: 0;
        height: 0.8rem;
    }
    .top-div {
        margin: 0 1.47rem 0.8rem 0.88rem;
    }
    input, textarea {
        margin: 0.1rem 1.6rem;
        height: 1rem;
        // background: url(../../assets/img/btn-bg-reg.png);
        // background-size: 100% 100%;
        font-size: 0.4rem;
        width: 5.2rem;
        padding: 0 0.8rem;
        color: #333333;
        background: #FFFFFF;
        border: 3px solid #FFB200;
        border-radius: 0.67rem;
    }
    input::placeholder, textarea::placeholder {
        color: #999999;
    }
    textarea {
        height: 2rem;
        line-height: .6rem;
        padding: 0.2rem 0.8rem 0.2rem 1.3rem;
        width: 4.7rem;
    }
    .captcha-div {
        input {
            flex: 1;
            width: 0;
            margin-right: .2rem;
        }
        // position: relative;
        img {
            // position: absolute;
            width: 2.4rem;
            margin-right: 1.6rem;
            font-size: .3rem;
            height: 1rem;
        }
    }
    .area-div {
        position: relative;
        img {
            width: 0.3rem;
            position: absolute;
            top: 0.45rem;
            right: 2rem;
        }
    }

    .area-detail-div {
        position: relative;
        img {
            width: 0.4rem;
            position: absolute;
            left: 2.4rem;
        }
    }
    .sms-code-div {
        // width: 5.2rem;
        // position: relative;
         input {
            flex: 1;
            width: 0;
            margin-right: .2rem;
        }
        .code-btn {
            // position: absolute;
            // right: 0.93rem;
            // top:0.49rem;
            background: url(../../assets/img/btn-bg.png);
            background-size: 100% 100%;
            width: 2.4rem;
            height: 1rem;
            font-size: 0.35rem;
            color: #FFFFFF;
            text-align: center;
            line-height: 1rem;


            margin-right: 1.6rem;

            //  background: #FFFFFF;
            // border: 3px solid #FFB200;
            // border-radius: 0.67rem;
        }
        .code-btn.gray {
            background: url(../../assets/img/btn-bg-gray.png);
            background-size: 100% 100%;
        }
    }
    .submit-btn {
        background: url(../../assets/img/btn-bg.png);
        background-size: 100% 100%;
        margin: .7rem 2.3rem;
        height: 1.6rem;
        font-size: 0.7rem;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.6rem;
    }
    
}
</style>
<style lang="scss">

.red-packet-pop {
    background-color: transparent;
    padding-bottom: 2rem;
    max-width: 100%;
    .reg-packet-bg {
        width: 10rem;
        height: 10.36rem;
        background-image: url(../../assets/img/speak/red-pop.png);
        background-size: 100% 100%;
        .money {
            padding-top: 5.08rem;
            text-align: center;
            height: 1.92rem;
            font-size: 2.3rem;
            font-family: Gilroy;
            font-weight: bold;
            color: #FC1A11;
            line-height: 2.48rem;
        }
        .reb-pop-btn {
            margin: 1.8rem auto;
            width: 4.03rem;
            height: 0.99rem;
            background-image: url(../../assets/img/speak/red-pop-btn.png);
            background-size: 100% 100%;
        }
    }
    

}
 .tip-div {
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