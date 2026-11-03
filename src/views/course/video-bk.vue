<template>
    <div class="main-content course" ref="course_content">
        <div id="dplayer" style="width: 10rem;"></div>
        <div class="top-div">
        <div class="title-div">
            {{ title }}
        </div>
        <div class="desc-div">
            <div>共{{ list.length }}课时</div>
        </div>
        </div>
        <div class="video-div" >
            <div class="video-label">目录</div>
            <div class="video-list-div" ref="videoListDiv">
                <div class="video-list">
                    <div class="video-item" v-for="(item,index) in list" :key="index" @click="itemClick(index, item)"
                        :class=" index == itemIndex ? 'active' : '' "> 
                        <div class="video-icon">视频</div>
                        <div class="video-title">{{ item.name }}</div>
                        <div class="video-desc" flex="dir:left main:center cross:center">
                            <div class="video-money"> {{ awardType == 2 ? item.money : ((item?.money ?? 0) / 100).toFixed(2)}}  {{ awardType == 2 ? '积分':(awardType == 3 ? '星币':'元红包') }}</div>
                            <div class="video-process">{{ item.view_time + 1>= item.total_time ? 100 : (item.view_time * 100 /item.total_time || 0 ).toFixed(0) }}%</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="btn" @click="backClick">返回课程页面</div>

        <van-popup v-model:show="showPop" class="red-packet-pop" :close-on-click-overlay="false">
            <div class="reg-packet-bg" :style="{ backgroundImage: 'url(' + regPacketBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
                <div class="money">{{ money }}</div>
                <div class="reb-pop-btn" @click="receiveClick"></div>
            </div>
        </van-popup>
    
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance, nextTick, shallowRef } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showLoadingToast, closeToast, showDialog, showImagePreview } from "vant";


import DPlayer from 'dplayer';
import { comma } from "postcss/lib/list";
import func from "vue-temp/vue-editor-bridge";


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()




let  dplay = null

let courseId = ''
let videoId = ''

const title = ref('')
const list = ref([
    {
        title:'--',
        log_id: '',
        view_time: 0,
        is_award: 0,
        money: 0,
        url: '',
        last_view_time: 0,
        
        
    },
])
const awardType = ref(1)
const itemIndex = ref(0)

const showPop = ref(false)

const regPacketBg = ref('https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736785033766.png')
const money = ref(0)
const logId = ref('')




const lastValidTime = ref(0)

function backClick() {
    router.replace({ name: 'CourseCourse', query: { id: courseId, type: '' } })
}

function receiveClick() {

    proxy.$axios.post(proxy.$config.domain + "Course/VideoReceiptAward", { id:logId.value, course_id:courseId}, { toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            let d = response.data.data
            if (d.status == 0) {
                showToast(d.msg)
            } else if (d.status == 200 ) {
                showPop.value = false
                showToast(d.msg)
                if(list.value[itemIndex.value].is_award == 1){
                    list.value[itemIndex.value].is_award = 2
                }
            } else {
                showToast(response.data.msg ? response.data.msg : '领取失败');
            }
            
        } else {
            showToast(response.data.msg ? response.data.msg : '领取失败');
            // self.prevent = false;
        }
    }).catch(error => {
            showToast("领取失败！");
        });

}

function updatePlayInfo(index, item) { 
    itemIndex.value = index
    dplay.switchVideo({
        url: item.url
    })
    lastValidTime.value = item.view_time
    dplay.seek(item.view_time)
    showToast('上次观看到'+parseInt(item.view_time)+'秒')

    if(item.is_award == 1 && item.money > 0) {
        logId.value = item.log_id
        if (awardType.value != 2) {
                    money.value = item.money / 100.0
                } else {
                   money.value = item.money
                }
                showPop.value = true
    }
    if(item.is_award == 2 && item.money > 0) {
        showToast('已领取观看奖励')
    }
}


function itemClick(index, item) {
    if(index == itemIndex.value ) {
        return
    }
    list.value[itemIndex.value].view_time = dplay.video.currentTime
    updatePlayInfo(index, item)
}






setToastDefaultOptions({ duration: 2000 });

function SaveVideoProcess(item, index, viewTime) {
    if (item.is_award != 0) {
        return
    }
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.post(proxy.$config.domain + 'Course/SaveVideoProcess', {
        id:item.log_id,
        course_id:courseId,
        video_id:item.id,
        view_time:Math.ceil(viewTime),
    }, { toJSON: true, hideLoading: true }).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.log_id && !item.log_id) {
                item.log_id = d.log_id
                list.value[index].log_id = d.log_id
            }
            
            if(d.is_award == 1) {
                list.value[index].is_award = d.is_award
                if (awardType.value != 2) {
                    money.value = d.money / 100.0
                } else {
                   money.value = d.money
                }
                logId.value = item.log_id
                showPop.value = true

            } else if (d.is_award == 2) { 
                list.value[index].is_award = d.is_award
            }
        } else {
            showToast('网络连接错误，请刷新重试')
        }
    })
        .catch(error => {
            showToast('网络连接错误，请刷新重试')
        });
}

function getVideoList() {
 
    proxy.$axios.get(proxy.$config.domain + 'Course/Video?course_id=' + courseId ).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
                title.value = d.title
            }

            if (d.list) {
                list.value = d.list
            }
            awardType.value = d.award_type

            if (videoId != '') {
                for (let i = 0; i < d.list.length; i++) {
                    const item = d.list[i]
                    if (item.id == videoId) {
                        itemIndex.value = i
                        break
                    }
                }
            }


            if (awardType.value == 2) {
                regPacketBg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736788632404.png'
            } else if (awardType.value == 3) {
                regPacketBg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736788918168.png'
            }


            

            const item = list.value[itemIndex.value]

    

            dplay = new DPlayer({
                container: document.getElementById('dplayer'),
                color: "#f00", //主题色
                lang: 'zh-cn',
                hotkey:false,
                playbackSpeed:[],
                contextmenu:[],
                video: {
                    url: item.url,
                },
            });

            dplay.on('timeupdate', function () {
                const currentTime = dplay.video.currentTime
                if (currentTime - lastValidTime.value > 2) { // 检测到异常跳转
                    dplay.seek(lastValidTime.value)
                    showToast('禁止快进操作', 2000) // 提示显示2秒
                }
                lastValidTime.value = currentTime
                
                list.value[itemIndex.value].view_time = dplay.video.currentTime
                if(dplay.video.currentTime - list.value[itemIndex.value].last_view_time > 10 || dplay.video.currentTime >= dplay.video.duration) {
                    list.value[itemIndex.value].last_view_time = dplay.video.currentTime
                    SaveVideoProcess(list.value[itemIndex.value], itemIndex.value, dplay.video.currentTime)
                }
            });

            

            // 保存原来的 notice
dplay.notice = function (text, time, opacity) {
    // 屏蔽快退/快进提示
    if (text.includes('快进') || text.includes('快退')) {
        return;
    }
};
updatePlayInfo(itemIndex.value, item)


            


        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试' } })
        }
    })
        .catch(error => {

            console.log(error)
        });
}





onMounted(() => {


    let id = route.query.id
    if (id && typeof id === 'string') {
        courseId = id
    }

    let video_id = route.query.video_id
    if (video_id && typeof video_id === 'string') {
        videoId = video_id
    }

    if (courseId == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }
    
    getVideoList()

})

onBeforeUnmount(() => {

})
</script>

<style lang="scss" scoped>
.main-content.course {
    background: #f7f7f7;
    background-color: #f7f7f7;
    padding-bottom: 2.5rem;
    .top-div {
        background: #fff;
    }
    .video-player {
       // background-color: black;
        width: 10rem;
        //height: 6.25rem;
    }

   .title-div {
        margin: 0 0.5rem 0.5rem;
        font-size: 0.54rem;
        font-weight: bold;
        color: #000000;
        line-height: 0.54rem;
        padding-top: 0.8rem;
    }
    
        
   
    .video-div {
        background: #fff;
        padding-bottom: 0.5rem;
        .video-label {
            font-size: 0.48rem;
            color: #393939;
            padding: 0.4rem;
            width: 100%; /* 确保容器有明确宽度约束 */
        }
        .video-list-div {
            padding-left: 0.35rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            
        .video-list {
            display: flex;
            flex-wrap: nowrap;
            white-space: nowrap;
           

            .video-item {
                flex: 0 0 4.5rem; /* 同时设置flex-basis与禁止伸缩 */
                width: 4.5rem;
                min-height: 2.5rem;
                margin-right: 0.25rem;
                border: none;
                background: #f7f7f7; 
                border-radius: 0.15rem 0.2rem;
                .video-icon {
                    background:  #1248e8;
                    font-size: 0.28rem;
                    padding: 0.12rem 0.2rem;
                    margin-right: 0.15rem;
                    line-height: 0.28rem;
                    border-radius:0.1rem 0  0.1rem 0;
                    width: 0.7rem;
                    color: #fff;
                }
                .video-title { 
                    margin-top: 0.2rem;
                    font-size: 0.35rem;
                    line-height: 0.6rem;
                    min-height: 1.2rem;
                    color: #515353;
                    padding: 0 0.4rem;
                    text-wrap: wrap;
                     display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
                    
                }
                .video-desc {
                    margin-top: 0.2rem;
                    font-size: 0.33rem;
                    padding: 0 0.4rem;
                    color: #A6A2A2;
                    .video-money {
                        flex: 1;
                    }
                    .video-process {
                        color: #04D809;
                    }
                    margin-bottom: 0.2rem;
                }
            }

            .video-item.active{
                    background:  #fff;
                border: 1px solid #1248e8;

            }
         }
        }

    }

    .desc-div {
        margin: 0 0.5rem 0.3rem;
        font-size: 0.33rem;
        color: #A6A2A2;
        padding-bottom: 0.5rem;
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
    .btn {
                margin: 2rem 1rem;
                width: 8rem;
                height: 1.09rem;
                background: #1248e8;
                border-radius: 1rem;

                font-size: 0.45rem;
                color: #FFFFFF;
                line-height: 1.09rem;

                text-align: center;
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

<style lang="scss" >
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
</style>