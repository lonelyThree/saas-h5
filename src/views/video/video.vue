<template>
    <div class="main-content receipt" ref="receipt_content">
        <div id="dplayer" style="width: 10rem;"></div>
        <div class="title-div">

            <img src="../../assets/img/credit-txt.png" v-if="info.award_type==2" />
            <img src="../../assets/img/balance-txt.png" v-else-if="info.award_type==3"/>
            <img src="../../assets/img/red-txt.png" v-else />
            {{ info.title }}
        </div>
        <div class="content"  v-html="info.desc" :class="{'no-expand':isNoExpand}"></div>
        <div class="expand-div" v-if="isNoExpand" @click="expandClick">
            <div class="expand-mask"></div>
            <div class="expand-btn">展开更多<van-icon name="arrow-down" /></div>
        </div>
        <div class="expand-div" v-else  @click="expandClick">
            <div class="expand-btn">收起<van-icon name="arrow-up" /></div>
        </div>
        <div class="img-bg">

            <img class="desc-img" :src="info.rule_img" />
        </div>
  
        <div class="fixed-bottom">
            <div class="bottom-div" flex="dir:left cross:center">
                <img src="../../assets/img/speak/credit.png" v-if="info.award_type==2 || info.award_type==3"/>

                <img src="../../assets/img/speak/red.png" v-else />

                <div class="tip" v-if="info.award_type==2">{{info.money}}积分奖励</div>

                <div class="tip" v-else-if="info.award_type==3">{{info.money/100}}星币奖励</div>
                <div class="tip" v-else>{{info.money/100}}元红包奖励</div>

                <div class="btn" @click="startClick" v-if="showType == 1">观看视频</div>
                <div class="btn"  v-else-if="showType == 2">{{ down }}s后开始答题</div>
                <div class="btn" v-else @click="startClick">开始答题</div>
            </div>
        </div>

        

    </div>
        

    <van-popup v-model:show="showNoStartPop" class="red-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg" />
    </van-popup>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance, nextTick, shallowRef } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showLoadingToast, closeToast, showDialog, showImagePreview } from "vant";


import DPlayer from 'dplayer';
import { activityInfoStatus } from '@/constants/ActivityInfoStatus'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()



let aliyunOssToken = {
    accessid: "",
    callback: "",
    dir: "",
    expire: 0,
    host: "",
    policy: "",
    signature: "",
    url: ''
}


let info = ref({})

let dplay = null

let aid = ''

const showPop = ref(false)

const showNoStartPop = ref(false)
const noStartImg = ref("")


const down = ref(10)
const showType = ref(1)
let InterValObj = 0

const isNoExpand = ref(true)

function expandClick() {
    isNoExpand.value = !isNoExpand.value
}

function handlePlayEvent(log) {
    // console.log('Basic player event====type', log.type)
    // console.log('Basic player event', log)
    log.pause()
}


//将时间减去1秒，计算天、时、分、秒 
function SetRemainTime() {
    if (down.value > 1) {
        down.value = down.value - 1
    } else {//剩余时间小于或等于0的时候，就停止间隔函数 
        window.clearInterval(InterValObj);
        InterValObj = 0;
        //这里可以添加倒计时时间为0后需要执行的事件 
        down.value = 0
        showType.value = 3

        //同步倒计时记录
    }
}

function startClick() {
    if (showType.value == 1) {
        dplay.play()
    } else if (showType.value == 3){
        proxy.$axios.post(proxy.$config.domain + 'Activity/WatchVideoInit', {id: aid } ).then(response => {
            if (response.data.code === 200 || response.data.msg == '保存失败') {
                jumpAnswer()

            } else {
                showToast( response.data.msg ? response.data.msg : '网络连接错误，请刷新重试')
            }
        }).catch(error => {
            showToast('网络连接错误，请刷新重试')
        });
    } else if (showType.value == 4) {
        jumpAnswer()
    }
    

}

function jumpAnswer() {
    router.replace({ name: 'VideoAnswer', query: { id: aid, type: route.query.type } })
}



setToastDefaultOptions({ duration: 2000 });



function getActivity(adcode) {
 
    proxy.$axios.get(proxy.$config.domain + 'Activity/WatchVideoInfo?id=' + aid + '&adcode=' + adcode).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.status == activityInfoStatus.ActivityInfoStatusMobile) {
                let dialogMessage = '注册认证成功后才能参加活动哦'
                let dialogConfirmButtonText = '去注册认证'
                if (d.auth_type != 1) {
                    dialogMessage = '注册后才能参加活动哦'
                    dialogConfirmButtonText = '去注册'

                }
                showDialog({
                    message: dialogMessage,
                    confirmButtonText: dialogConfirmButtonText,
                }).then(() => {
                    router.replace({ name: 'UserReg', query: { id: aid, page: 'VideoVideo',
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '认证成功后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'UserMine', query: { id: aid, page: 'VideoVideo' } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitAuth) {
                showDialog({
                    message: d.tip_img,
                    showConfirmButton: false,
                })

                return
            }  else if (d.status == 3 || d.status == 5 || d.status == 6) {
                showNoStartPop.value = true
                noStartImg.value = d.tip_img
            } else {
            }

            info.value = d

            down.value = d.wait_times


            
            showType.value = 1

            dplay = new DPlayer({
                container: document.getElementById('dplayer'),
                color: "#f00", //主题色
                lang: 'zh-cn',
                hotkey:false,
                playbackSpeed:[],
                contextmenu:[],
                video: {
                    url: d.video_url,
                    pic: d.video_cover_url,
                },
            });

            dplay.on('play', function () {
                if (down.value > 1) {
                    showType.value = 2
                    if (!InterValObj) {
                        InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                    }
                    
                }
                

            });


        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试' } })
        }
    })
        .catch(error => {

            console.log(error)
        });
}


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


onMounted(() => {


    let id = route.query.id
    if (id && typeof id === 'string') {
        aid = id
    }

    if (aid == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }
    if (route.query.type == 'loc') {
        GetGeo()
    } else {
        getActivity('')
    }

})

onBeforeUnmount(() => {

})
</script>

<style lang="scss" scoped>
.main-content {

    background: #fff;
    background-color: #fff;
    .video-player {
       // background-color: black;
        width: 10rem;
        //height: 6.25rem;
    }

    .title-div {
        margin: 0.5rem;
        font-size: 0.43rem;
        font-weight: bold;
        color: #333333;
        line-height: 1.5;


        img {
            width: 1.17rem;
            vertical-align: text-bottom;
        }
    }

    .content {
        margin: 0.5rem 0.5rem 0;

        font-size: 0.35rem;
        color: #333333;
        line-height: 0.65rem;
    }

    .content.no-expand {
        height: 6rem;
        overflow: hidden;
    }

    .expand-div {
        font-size: 0.35rem;
        color: #4e6ef2;
        text-align: center;

        margin-bottom: 0.5rem;
        position: relative;

        .expand-mask {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 2.5rem;
            background: linear-gradient(rgba(255,255,255,0) 0%,rgba(255,255,255,.8) 31%,#fff 62%);
        }
        .expand-btn {
            font-size: 0.35rem;
            color: #4e6ef2;
            text-align: center;
            position: relative;
        }
    }

    .desc-img {
        margin:0.5rem;
        width: 9rem;
    }

    .img-bg {
        width: 10rem;
        // height: 5rem;
        background: #12CB7B32;
        // margin-top: -2rem;


        padding-bottom: 2rem;
    }

    .fixed-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        width: 10rem;
        height: 1.84rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215,215,215);
        border-radius: 0.65rem 0.65rem 0rem 0rem;


        line-height: 1.84rem;

        font-size: 0.4rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;

        .bottom-div {
            margin: 0 0.5rem;
            img {
                width: 0.6rem;
                margin-right: 0.25rem;
            }

            .tip {
                flex: 1;
            }

            .btn {
                width: 4.55rem;
                height: 1.09rem;
                background: #12CB7B;
                border-radius: 0.27rem;

                font-size: 0.45rem;
                color: #FFFFFF;
                line-height: 1.09rem;

                text-align: center;
            }
        }

        
    }

    // 禁用视频右键菜单
::v-deep .dplayer-menu,.dplayer-mask {
  display: none !important;
}
//隐藏底部操作栏
r::v-deep .dplayer-controller {
   display: none;
 }
 //隐藏底部操作栏动画
::v-deep .dplayer-controller-mask {
   display: none;
 }

::v-deep .dplayer-mobile-play {
    width: 64px;
    height: 64px;
    background: url(../../assets/img/bigplay.png);
    background-size: 100% 100%;
    opacity: 1;
}
::v-deep .dplayer-mobile-play svg {
    display: none;
}

::v-deep .dplayer-playing .dplayer-mobile-play {
        background: transparent;
}
::v-deep .dplayer-playing  .dplayer-mobile-play svg {
    display: block;
}
}

.red-packet-pop {
    background-color: transparent;
    padding-bottom: 2rem;
    max-width: 100%;

}


</style>
<style>
.dplayer-menu  .dplayer-menu-item,.dplayer-mask .dplayer-menu-item{
        display: none !important;
  /* display: none !important; */
}
.dplayer-menu  .dplayer-menu-item:first-child{
    display: block !important;
}
.dplayer-controller .dplayer-setting {
   display: none !important;
 }

.dplayer-controller .dplayer-full-in-icon {
     display: none !important;
}
</style>