<template>
    <div class="main-content article">
        <van-swipe :autoplay="3000" lazy-render class="top-swipe">
            <van-swipe-item v-for="url in info.imgs" :key="url" @click="gotoUrlPath(item.link)">
                <div style="margin: 0 0.42rem;">
                    <img :src="url"  :style="{  borderRadius:'0.4rem 0.4rem 0.7rem 0.7rem'}" />
                </div>
                
            </van-swipe-item>
         </van-swipe>
        <div class="title-div">
            {{ info.title }}
        </div>
        <div class="author-div">
            {{ info.author }}
        </div>
        <div class="content"  v-html="info.content"></div>
        <div class="author-div">
            阅读 {{ info.view }}
        </div>
        <CommentList :comments="comments" @reply="handleReply" />
  
        <!-- <div class="fixed-bottom">
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
        </div> -->

        <!-- <CommentList :comments="comments" @reply="handleReply" /> -->

        <div class="fixed-bottom fixed-textarea" >
         <div class="chat-bottom" flex="dir:left cross:center">
            <div class="chat-input">
                <textarea class="text-area" v-model="inputMessage" type="text" autocomplete="off" id="comment-textarea" placeholder="说点什么，万一火了呢"
    @input="adjustHeight"
                ></textarea>
            </div>
            <div class="send-btn" v-if="isShowSendBtn && inputMessage" @click="sendClick">发送</div>
            <div class="weui-icon-clear cancel-btn"  v-if="isShowSendBtn" @click="cancleSendClick"><van-icon name="clear" color="#b2b2b2" /></div>
            <div class="comment-good-div weui-flex"  flex="dir:left cross:center" v-if="!isShowSendBtn"
            @click="goodClick"
            >
                <div class="comment-good-icon good"  v-if="info.is_thumps_up == 1" ref="commentIcon"></div>
                <div class="comment-good-icon"  v-else ref="commentIcon"></div>
                <div class="good-num">{{ info.thumps_up || 0 }}</div>
            </div>
            <div class="comment-num-div"  flex="dir:left cross:center" v-if="!isShowSendBtn"  @click="openInputClick">
                <div class="m-icon-div"><i class="comment-num-icon m-icon"></i></div>
                <div class="comment-num">{{ info.comment_total > 0  ? info.comment_total : '评论' }}</div>
            </div>
        </div>
            
        </div>
    </div>


    <van-popup v-model:show="showNoStartPop" class="red-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg" />
    </van-popup>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance} from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showDialog } from "vant";


import { activityInfoStatus } from '@/constants/ActivityInfoStatus'
import mojs from '@mojs/core'
// import CommentList from '@/components/comment/CommentList.vue'
// import CommentInput from '@/components/comment/CommentInput.vue'


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()



let info = ref({})

let aid = ''
let uid = ''

const showPop = ref(false)

const showNoStartPop = ref(false)
const noStartImg = ref("")


const down = ref(10)
const isShowSendBtn = ref(false)
let InterValObj = 0

const isNoExpand = ref(true)

const comments = ref([
  {
    id: 1,
    user: '小美',
    avatar: 'https://i.pravatar.cc/40?img=3',
    content: '这张照片好好看呀～',
    likes: 12,
    liked: false,
    replies: [
      { id: 11, user: 'Luna', content: '真的超级好看！', likes: 2, liked: false },
    ],
  },
])

const showInput = ref(false)
const replyTo = ref(null)
const totalComments = ref(99)
const textareaHeight = ref(40)

const inputMessage = ref('')
const commentIcon = ref(null)

const isTumpsUping = ref(false)



function goodClick() { 
    isTumpsUping.value = true
    /** 扩散*/
    let burst = new mojs.Burst({
        // 爆炸范围
        radius: { 0: 50 },
        // 动画挂载父元素，默认改在到body上
        parent: commentIcon.value,
        // 动画延时函数
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        // 动画延时时间
        duration: 1500,
        // 动画等待时间
        delay: 300,
        // 扩散的粒子配置
        children: {
            duration: 750,
            // 随机数范围爆炸
            radius: { 0: "rand(5,25)" },
            shape: ["circle", "rect", "polygon"],
            // 粒子可选色
            fill: [
                "#1abc9c",
                "#2ecc71",
                "#00cec9",
                "#3498db",
                "#9b59b6",
                "#fdcb6e",
                "#f1c40f",
                "#e67e22",
                "#e74c3c",
                "#e84393",
            ],
            degreeShift: "rand(-90, 90)",
            delay: "stagger(0, 40)",
        },
        // 透明度
        opacity: 0.6,
        // 生成粒子数量
        count: 10,
        onStart() {
        },
    });
    /** aperture （红晕） */
    let aperture = new mojs.Transit({
        parent: commentIcon.value,
        duration: 2000,
        type: "circle",
        radius: { 0: 20 },
        fill: "transparent",
        stroke: "#1fcdb6",
        strokeWidth: { 20: 0 },
        opacity: 0.6,
        isRunless: true,
        easing: mojs.easing.bezier(0, 1, 0.5, 1),
    });
    /**bounce 心跳 */
    let bounce = new mojs.Tween({
        duration: 1200,
        onUpdate: (progress) => {
           
        },
    });
    let time = new Date().getTime();
    // 汇报阅读进度
        // console.log('汇报阅读进度')
        // console.log('Like=progress')
        proxy.$axios.post(proxy.$config.domain + 'Article/Like', {id: aid, op_type: info.value.is_thumps_up == 2 ? 1 :2 },  { hideLoading: true, toJSON: true }).then(response => {
            isTumpsUping.value = false
            let timeout = new Date().getTime() - time
            if (timeout < 600) {
                timeout = 600 - timeout
            } else {
                timeout = 10
            }
            // console.log('Like=progress', info.value.is_thumps_up, timeout, info.value.thumps_up, new Date().getTime() - time)
            setTimeout(() => {
                // console.log('Like=progress---',info.value.is_thumps_up)
                if (info.value.is_thumps_up == 1) {
                    info.value.is_thumps_up = 2
                    let thumps_up = info.value.thumps_up
                    if (thumps_up > 0) {
                        info.value.thumps_up -= 1
                    }
                } else {
                    info.value.thumps_up += 1
                    info.value.is_thumps_up = 1
                }
                // console.log('Like=progress--2-',info.value.is_thumps_up)
            }, timeout);

        }).catch(error => {
            isTumpsUping.value = false
        });
    new mojs.Timeline().add(burst, aperture, bounce).play();
}
    
function cancleSendClick() {
    inputMessage.value = ''
    isShowSendBtn.value = false
}

function openInputClick(){
    showToast('暂未开放评论')
    // isShowSendBtn.value = true
}
function sendClick() {
    showToast('暂未开放评论')
}
function adjustHeight (e){
    // console.log('adjustHeight', e.target.scrollHeight)
    isShowSendBtn.value = e.target.value.trim().length > 0
//   e.target.style.height = 'auto'
//   textareaHeight.value = Math.min(e.target.scrollHeight, 300)
}

function openInput(comment = null) {
  replyTo.value = comment
  showInput.value = true
}
function closeInput() {
  showInput.value = false
  replyTo.value = null
}
function handleReply(comment) {
  openInput(comment)
}



function resetInterValObj() {
    if (InterValObj) {
        window.clearInterval(InterValObj)
        InterValObj = 0
    }
    InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
    
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
        
        // 汇报阅读进度
        // console.log('汇报阅读进度')
        proxy.$axios.post(proxy.$config.domain + 'Article/Result', {id: aid, uuid:uid },  { hideLoading: true, toJSON: true }).then(response => {
           
        }).catch(error => {
        });

        //同步倒计时记录
    }
}





setToastDefaultOptions({ duration: 2000 });


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
                jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData' ],
                openTagList: ['wx-open-launch-weapp']
            })
            wx.ready(function () {
                let sharedata = {
                    title: info.value.title,
                    desc: info.value.desc,
                    link: info.value.share_url,
                    imgUrl: info.value.thumb,
                    success: function(){},
                    cancel: function(){}
                };
                wx.updateAppMessageShareData(sharedata);
                wx.updateTimelineShareData(sharedata);
            });
            wx.error(function (res) {
                console.log(res)
            })


        } else {
             console.log('成功了')
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
    .catch(error => {
         console.log('成功了--error', error)
        // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    });
}

function getActivity(adcode) {
 
    proxy.$axios.get(proxy.$config.domain + 'Article/Info?id=' + aid + '&uuid='+uid+'&adcode=' + adcode).then(response => {
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

            down.value = d.standard_times
            getJsTicket()
            if(d.is_upload) {
                resetInterValObj()
            }
            




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
    // getJsTicket()
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

    let uuid = route.query.uuid
    if (uuid && typeof uuid === 'string') {
        uid = uuid
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
.main-content.article {

    background: #fff;
    background-color: #fff;
    padding-bottom: 3rem;
    .top-swipe {
        margin-top: 0.5rem;
    }
    .title-div {
        margin: 0.4rem;
        font-size: 0.49rem;
        font-weight: bold;
        color: #333333;
        line-height: 1.5;
    }
    .author-div {
        margin: 0.4rem;
        height: 0.3rem;
        font-size: 0.3rem;
        color: #898787;
        line-height: 0.3rem
    }

    .content {
        margin: 0.5rem 0.4rem 0;

        font-size: 0.35rem;
        color: #333333;
        line-height: 0.65rem;
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
        height: 1.4rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215,215,215);
        border-radius: 0.65rem 0.65rem 0rem 0rem;


        line-height: 1.4rem;

        font-size: 0.4rem;
        // font-family: PingFang SC;
        // font-weight: 500;
        color: #333333;
        .chat-bottom {
            margin: 0.2rem;

        }

       .m-icon-div {
    width: .4rem;
    height: .4rem;
    overflow: hidden;
    position: relative;
    display: inline-block;
    vertical-align: middle;
}

.m-icon {
    position: absolute;
    width: 18.3rem;
    height: 6rem;
    left: 0px;
    top: 0px;
    background: url(../../assets/img/comment/icon_slices.png) no-repeat;
    background-size: cover;
}

 input {
    min-height: 1rem;
    height: 1rem;
    line-height: 1rem;
    box-sizing: border-box;
    border: none;
    outline: none;
    resize: none;
    font-size: 0.4rem;
    color: #222;
    padding: 0.2rem .42rem;
    box-sizing: border-box;
    background: #f6f6f6;
    border-radius: 0.85rem;
    -webkit-border-radius:0.85rem;
    -moz-border-radius: 0.85rem;
    -o-border-radius: 0.85rem;
    -ms-border-radius: 0.85rem;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    flex-shrink: 1;
    width: 100%;
}
textarea.text-area {
    min-height: 1rem;
    height: 1rem;
    line-height: 0.6rem;
    box-sizing: border-box;
    border: none;
    outline: none;
    resize: none;
    font-size: 0.4rem;
    color: #222;
    padding: 0.2rem .42rem;
    box-sizing: border-box;
    background: #f6f6f6;
    border-radius: 0.85rem;
   -webkit-border-radius:0.85rem;
    -moz-border-radius: 0.85rem;
    -o-border-radius: 0.85rem;
    -ms-border-radius: 0.85rem;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    flex-shrink: 1;
    width: 100%;
}
.chat-bottom .send-btn {
    width: 1.7rem;
    height: 0.85rem;
    line-height: 0.85rem;
    border-radius: 0.12rem;
    text-align: center;
    margin-left: 0.3rem;
    font-size: 0.45rem;
    background: #1fcdb6;
    box-shadow: 0rem 0rem 4px 0rem rgba(0, 0, 0, 0.04);
    border: 1px solid #1fcdb6;
    color: #fff;
    flex-shrink: 0;
}
.chat-bottom .cancel-btn {
    font-size: 0.6rem;
    margin-left: .2rem;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
}

.chat-bottom .chat-input {
    flex-shrink: 0;
    width: 100%;
    position: relative;
    font-size: .4rem;
    flex-shrink: 1;
    height: 1rem;
}
.chat-bottom .chat-input label{
    position:absolute;
    top: .12rem;
    left:  .24rem;
    color: #999;
}

        .comment-num-div, .comment-good-div{
    color: #333;
    align-items: center;
    justify-content: center;
    line-height: 1;
    margin: 0 0.2rem;
    flex-shrink: 0;
}
 .comment-num-div {margin-left: .1rem;}
 .comment-good-div .m-icon-div {
    width: 0.6rem;
    height: 0.6rem;
    transform: scale(1.2);
    -webkit-transform:scale(1.2);
    -moz-transform:scale(1.2);
    -o-transform: scale(1.2);
    margin-right: .12rem;
}
.comment-num-div .m-icon-div {
    width: 0.68rem;
    height: 0.68rem;
    margin-right: .12rem;
}
.comment-num-icon {
    background-position: -5.23rem -2.46rem;
}
.comment-good-icon {
    width: 0.68rem;
    height: 0.68rem;
    position: relative;
    margin-right: 0.12rem;
    background: url(../../assets/img/comment/good.png);
    background-size: 0.68rem 0.68rem;
}
.comment-good-icon.good {
    background: url(../../assets/img/comment/goods.png);
    background-size: 0.68rem 0.68rem;
}

.comment-div-div .like-div {
    background: url(https://vipimg.ai-xbys.com/base/icon/heart.png) no-repeat;
    background-position: 0 0;
    background-size: 41.42rem 1.42rem;
    cursor: pointer;
    -webkit-transition: background-position 1s steps(28);
    transition: background-position 1s steps(28);
    -webkit-transition-duration: 0s;
    transition-duration: 0s;
    margin-top: -0.5rem;
    width: 1.42rem;
    height: 1.42rem;
    margin-bottom: -0.35rem;
}
.like-div.like {
    -webkit-transition-duration: 1s;
    transition-duration: 1s;
    background-position: -70rem 0;
}
.comment-div-div .comment-content .ccspan {
    display: inline-block;
    margin-right: .17rem;
}

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

    .content-area {
  flex: 1;
  overflow-y: auto;
}

.post-image {
  width: 100%;
}

.post-desc {
  font-size: 14px;
  color: #333;
  padding: 12px;
  line-height: 1.5;
}

.comment-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;
  background: #fff;
  padding: 8px 12px;
}

.comment-placeholder {
  flex: 1;
  text-align: left;
  font-size: 14px;
  color: #999;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #f9f9f9;
}

.comment-count {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
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