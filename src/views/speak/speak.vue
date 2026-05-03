<template>
    <div class="main-content speak" ref="speak_content">
        <van-swipe class="my-swipe" :loop="false" :show-indicators="false" @change="swipeChange">
            <van-swipe-item v-for="(topic, index) in topics" :key="index"
                @touchstart="onTouchStart" 
                @touchmove="onTouchMove"
                 >
                <div class="top" flex="dir:left cross:center">
                    <div class="tip">请阅读以下文字</div>
                    <div class="money" flex="dir:left cross:center">
                        <img src="../../assets/img/speak/credit.png" v-if="receive_type==2 || receive_type==3" />
                        <img src="../../assets/img/speak/red.png"  v-else />
                        <div v-if="receive_type == 3"><span>{{ money }}</span>星币</div>
                        <div  v-else-if="receive_type == 2"><span>{{ money }}</span>积分</div>
                        <div v-else><span>{{ money }}</span>元红包</div>
                    </div>
                </div>
                <div class="name-div">
                    <div class="name">{{topic.name }}</div>
                    <div class="index-div">
                        <div class="index"><span>{{ index + 1 }}</span>/{{ topics.length }}</div>
                        <img src="../../assets/img/speak/recive-bg.png" v-if="topic.awardStatus == 3" />
                    </div>
                    
                </div>
                <div class="speak" flex="dir:top main:justify box:justify" :class="{'mini-speak': miniCla }">
                    <div>
                    <div class="tip" flex="dir:left cross:center">
                        <div class="name">需要成功练习<span>{{ topic.num }}</span>次方可获得奖励哦</div>
                        <div><span>{{ topic.finishNum }}</span>/{{ topic.num }}</div>
                    </div>
                    <div class="score-num" flex="dir:left cross:left" >
                        <div class="empty" :style="'width:'+ topic.score+'%;'" ></div>
                        <div class="score-num-bg" :class="{'hidden':topic.score < 0}">{{ topic.score }}</div>
                    </div>
                    <div class="score-div" flex="dir:left cross:center">
                        <div>0</div>
                        <div class="score-bg">
                            <div class="score" :class="{'fail':topic.tip == 2}" :style="'width:'+ (topic.score<0?0: topic.score)+'%;'"></div>
                            <div class="score-tip" :style="'left:' +topic.standardScore  + '%;'"></div>
                        </div>
                        <div>100</div>
                    </div>
                    </div>
                    <div  class="op-tip" v-if="topic.canvas">
                        <canvas :id="'canvas-'+index"></canvas>
                        <!-- <span style="padding: 0 10%;"></span> -->
                    </div>
                    <div class="suc-tip op-tip " flex="dir:top cross:center main:center" v-else-if="topic.tip == 1">
                        <img src="../../assets/img/speak/suc.png"/>
                        <div>达标啦，说得真棒!</div>
                    </div>
                    <div class="fail-tip op-tip" flex="dir:top cross:center main:center" v-else-if="topic.tip == 2">
                        <img src="../../assets/img/speak/fail.png" />
                        <div>{{ topic.standardScore }}分才达标哦<br />吐字清晰些、声音洪亮些再来一次吧</div>
                    </div>
                    <div class="op-div" flex="dir:left cross:center">
                        <div  flex="dir:top cross:center" @click="speakBackClick(topic)">
                            <img src="../../assets/img/speak/play-back.png" />
                            <div >回放</div>
                        </div>
<!-- 
                                @touchstart="touchstart"
                                @touchend="touchend"
                                @touchmove="touchmove" -->
                        <div class="speak-btn"

                              @click="speakClick(topic, index)"
                              v-if="topic.awardStatus != 1 && topic.awardStatus != 3"
                            >
                            <Transition name="bounce">
                                <div class="speak-icon" :class="{ 'speaking': btRecoding }" ></div>
                            </Transition>
                            

                            <div>{{btRecoding?'轻按停止':'轻按录音'}}</div>
                        </div>
                        <div class="speak-btn"
                                v-else>
                                <div class="speak-icon speaked"></div>
                            </div>
                        <div  flex="dir:top cross:center" @click="speakAuditionClick(topic)">
                            <img src="../../assets/img/speak/audition.png" />
                            <div >试听</div>
                        </div>
                    </div>
                    <div class="speak-tip">轻点按钮，说出上方文字即可获得奖励！</div>
                </div>
            </van-swipe-item>
            <!-- <van-swipe-item>2</van-swipe-item>
            <van-swipe-item>3</van-swipe-item>
            <van-swipe-item>4</van-swipe-item> -->
        </van-swipe>
        <!-- <div class="home" style="margin:1vw;display:none;">
    <Button type="success" @click="getPermission()" style="margin:1vw;">获取麦克风权限</Button>
    <br/>
    <Button type="info" @click="startRecorder()"  style="margin:1vw;">开始录音</Button>
    <Button type="info" @click="resumeRecorder()" style="margin:1vw;">继续录音</Button>
    <Button type="info" @click="pauseRecorder()" style="margin:1vw;">暂停录音</Button>
    <Button type="info" @click="stopRecorder()" style="margin:1vw;">结束录音</Button>
    <br/>
    <Button type="success" @click="playRecorder()" style="margin:1vw;">录音播放</Button>
    <Button type="success" @click="pausePlayRecorder()" style="margin:1vw;">暂停录音播放</Button>
    <Button type="success" @click="resumePlayRecorder()" style="margin:1vw;">恢复录音播放</Button>
    <Button type="success" @click="stopPlayRecorder()" style="margin:1vw;">停止录音播放</Button>
    <br/>
    <Button type="info" @click="getRecorder()" style="margin:1vw;">获取录音信息</Button>
    <Button type="info" @click="downPCM()" style="margin:1vw;">下载PCM</Button>
    <Button type="info" @click="downWAV()" style="margin:1vw;">下载WAV</Button> -->
    <!-- <Button type="info" @click="getMp3Data()" style="margin:1vw;">下载MP3</Button> -->
    <!-- <br/>
    <Button type="error" @click="destroyRecorder()" style="margin:1vw;">销毁录音</Button>
    <br/> -->
    <!-- <div style="width:100%;height:200px;border:1px solid red;">
      <canvas id="canvas"></canvas>
      <span style="padding: 0 10%;"></span>
      <canvas id="playChart"></canvas>
    </div> -->
  <!-- </div> -->
    </div>
    <van-popup v-model:show="showPop"  class="reg-packet-pop" :close-on-click-overlay="false">
        <div class="reg-packet-bg" :style="{ backgroundImage: 'url(' + regPacketBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
            <div class="money">{{ money }}</div>
            <div class="reb-pop-btn" @click="receiveClick"></div>
        </div>
    </van-popup>

    <van-popup v-model:show="showNoStartPop"  class="reg-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg"/>
    </van-popup>

    <img class="slide-tip-pop" src="../../assets/img/speak/slide-tip.png" v-if="showTipPop"/>


</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance, nextTick } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showLoadingToast, closeToast, showDialog } from "vant";
import { activityInfoStatus } from '@/constants/ActivityInfoStatus'



const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()



let aliyunOssToken = {accessid: "",
    callback: "",
    dir: "",
    expire: 0,
    host: "",
    policy: "",
    signature: "",
    url:''}


let loop = ''
const btRecoding = ref(false)
const blackBoxSpeak= ref(true)
let startY = ''
let timeOutEvent = 0

let aid = ''

const money = ref(0)
const receive_type = ref(1)
const topics = ref([])
const speak_content = ref()
const miniCla = ref(false)
const showPop = ref(false)

const showTipPop = ref(false)
const showNoStartPop = ref(false)
const noStartImg = ref("")

let startX = 0

let topicIndex = 0
let audioPlay = 0

const regPacketBg = ref('https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736785033766.png')

import Recorder from 'js-audio-recorder'

// const lamejs = require('lamejs')
const recorder = new Recorder({
    sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
// compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
})

let //波浪图-录音
        drawRecordId = null,
        oCanvas = null,
        ctx = null
        // //波浪图-播放
        // drawPlayId = null,
        // pCanvas =null,
        // pCtx = null
 
//   // 绑定事件-打印的是当前录音数据
//   recorder.onprogress = function(params) {
//     // console.log('--------------START---------------')
//     // console.log('录音时长(秒)', params.duration);
//     // console.log('录音大小(字节)', params.fileSize);
//     // console.log('录音音量百分比(%)', params.vol);
//     // console.log('当前录音的总数据([DataView, DataView...])', params.data);
 
//     // console.log('--------------END---------------')
//   }

 /**
    //    * 波浪图配置
    //    * */
    // function  startCanvas(){
    //     //录音波浪
    //     oCanvas = document.getElementById('canvas');
    //     ctx = oCanvas.getContext("2d");
    //     //播放波浪
    //     // pCanvas = document.getElementById('playChart');
    //     // pCtx = pCanvas.getContext("2d");
    //   }
 
/**
 *  录音的具体操作功能
 * */
// 开始录音
function startRecorder () {
    recorder.start().then(() => {
        drawRecord();//开始绘制图片
    }, (error) => {
        // 出错了
        showToast('开始录音失败， 请刷新页面重试')
        console.log(`${error}`);
    });
}
// 结束录音
function stopRecorder () {
    recorder.stop()
    drawRecordId && cancelAnimationFrame(drawRecordId);
    drawRecordId = null;
}
// 录音播放
function playRecorder () {
    recorder.play();
    // drawPlay();//绘制波浪图
}

// 停止录音播放
function stopPlayRecorder () {
    recorder.stopPlay();
}
// 销毁录音
function destroyRecorder () {
    recorder.destroy().then(function() {
        recorder = null;
        drawRecordId && cancelAnimationFrame(drawRecordId);
        drawRecordId = null;
    });
}

      

function random_string(len) {
　　len = len || 3;
　　var chars = 'abcdefhijkmnprstwxyz';   
　　var maxPos = chars.length;
　　var pwd = '';
　　for (let i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
/**
 *  获取录音文件
 * */
function getRecorder(){
    let toltime = recorder.duration;//录音总时长
    if (toltime > 59) {
        showToast('录音时间太长')
        return
    } else if (toltime < 1.5) {
        showToast('录音时间太短')
        return
    }
    // let fileSize = recorder.fileSize;//录音总大小

    //录音结束，获取取录音数据
    // let PCMBlob = recorder.getPCMBlob();//获取 PCM 数据
    let wav = recorder.getWAVBlob();//获取 WAV 数据
    uploadSectionFile(wav)

    // let channel = recorder.getChannelData();//获取左声道和右声道音频数据

}

function uploadFile(wavBlob){
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        // message: '正在上传录音',
    })
    // toast.message = "正在上传录音"

    var filename = random_string(8) + new Date().getTime() + '.wav';
    var formData = new FormData();
    //注意formData里append添加的键的大小写
    formData.append('x-oss-forbid-overwrite', 'true')
    formData.append('key', aliyunOssToken.dir + filename); //存储在oss的文件路径
    formData.append('OSSAccessKeyId', aliyunOssToken.accessid); //accessKeyId
    formData.append('policy', aliyunOssToken.policy); //policy
    formData.append('Signature', aliyunOssToken.signature); //签名
    formData.append('success_action_status', '404'); //签名
    formData.append('callback', aliyunOssToken.callback); //签名
    formData.append("file", wavBlob);
    var url = aliyunOssToken.host;
    var fileUrl = aliyunOssToken.host + '/' + aliyunOssToken.dir + filename;

    proxy.$axios.post(url, formData, { hideLoading:true, customRequst: true, headers: {'Content-type': 'application/octet-stream'} }).then(response => {
        console.log(url, response, "url---response")
        // showLoading = false;
        if (response.data.code === 200) {
        
            topics.value[topicIndex].backUrl = aliyunOssToken.url + aliyunOssToken.dir + filename

            submitInfo(aliyunOssToken.dir + filename)
        } else {
            showToast(response.data.msg ? response.data.msg : '上传失败');
            // self.prevent = false;
        }

    }).catch(error => {
        showToast("上传失败！");
    });

    
}

function uploadSectionFile(wavBlob) {
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        // message: '正在上传录音',
    })
    if (aliyunOssToken.expire * 1000 < new Date().getTime()) {
        getPolicyToken(wavBlob)
        return
    }
    uploadFile(wavBlob)
}

/**
 *  下载录音文件
 * */
//下载pcm
// function downPCM(){
// //这里传参进去的时文件名
//     recorder.downloadPCM('新文件');
// }
//下载wav
// function downWAV(){
// //这里传参进去的时文件名
//     recorder.downloadWAV('新文件');
// }
/**
 *  获取麦克风权限
 * */
function getPermission(){
    Recorder.getPermission().then(() => {
        showToast('录音权限获取成功')
    }, (error) => {
        showToast('录音权限获取失败， 请刷新页面重试')
        // console.log(`${error.name} : ${error.message}`);
    });
}
      
 
/**
 * 绘制波浪图-录音
 * */
function drawRecord () {
    // 用requestAnimationFrame稳定60fps绘制
    drawRecordId = requestAnimationFrame(drawRecord);

    // 实时获取音频大小数据
    let dataArray = recorder.getRecordAnalyseData(),
        bufferLength = dataArray.length;

    // 填充背景色
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);

    // 设定波形绘制颜色
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(18, 203, 123)';

    ctx.beginPath();

    var sliceWidth = oCanvas.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
            x = 0;          // 绘制点的x轴位置

    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * oCanvas.height / 2;

        if (i === 0) {
        // 第一个点
        ctx.moveTo(x, y);
        } else {
        // 剩余的点
        ctx.lineTo(x, y);
        }
        // 依次平移，绘制所有点
        x += sliceWidth;
    }

    ctx.lineTo(oCanvas.width, oCanvas.height / 2);
    ctx.stroke();
}
      
 

setToastDefaultOptions({ duration: 2000 });

function getAudioElement() {
    
    var audio = document.getElementsByTagName("audio")
    if (audio.length == 0) {
        let audio = document.createElement("audio");
        audio.controls = true;
        document.body.appendChild(audio);
        audio.loop = false; //禁止循环播放，如果视频video没有设置loop参数，可以不用写
        audio.addEventListener('ended', function () {
            // console.log("getAudioElement===", audioPlay)
            if (audioPlay == 1) {
                showToast('试听完成');
            } else if (audioPlay == 2) {
                showToast('回放完成');
            }

            audioPlay = 0
        }, false);
        return audio
    } else {
        return audio[0]
    }
    
}

function speakAuditionClick(topic) {
    if (btRecoding.value) {
        showToast('正在录音')
        return
    }
    var audio = getAudioElement()
    audioPlay = 1
    audio.src = topic.url;
    audio.play();
}

function speakBackClick(topic) {
    if (!topic.backUrl) {
        showToast('您还没有录音');
        return
    }
    if (btRecoding.value) {
        showToast('正在录音')
        return
    }
    var audio = getAudioElement()
    audioPlay = 2
    audio.src = topic.backUrl;
    audio.play();
    
}

function speakClick(topic, index) {
    if (audioPlay == 1) {
        showToast('正在试听， 请试听完毕后再录音')
        return
    }
    if (audioPlay == 2) {
        showToast('正在回放， 请回放完毕后再录音')
        return
    }
    // console.log("speakClick===topic", topic, index, btRecoding, btRecoding.value)
    if (btRecoding.value) {
        btRecoding.value = false
        showLoadingToast({
            duration: 0,
            forbidClick: true,
            // message: '正在获取录音文件',
        });
        // blackBoxSpeak.value = false
        stopRecorder()
        //获取录音文件
        // showToast("获取录音文件")
        getRecorder()
    } else {
        showToast("开始录音")
        topicIndex = index
        // 调用录音方法
        btRecoding.value = true
        topics.value[index].canvas = true
        nextTick(() => {
            oCanvas = document.getElementById('canvas-'+index);
            ctx = oCanvas.getContext('2d');
            startRecorder()
        })
    }
}

function swipeChange(index) {
    topicIndex = index
    if (topics.value[topicIndex].awardStatus == 1) {
        showPop.value = true
    }
}

function receiveClick() {
    let topic = topics.value[topicIndex]

    proxy.$axios.post(proxy.$config.domain + "Activity/SpeakAward", { aid: aid, id: topic.topicId }, {toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            showPop.value = false
            topics.value[topicIndex].awardStatus = 3
            let d = response.data.data
            showToast(d?d:'领取成功，预计1分钟到账')
        } else {
            showToast(response.data.msg ? response.data.msg : '领取失败');
            // self.prevent = false;
        }
    })
    .catch(error => {
        showToast("领取失败！");
    });
    
}

 // 绑定手机号确定按钮
function submitInfo(fileName) {
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        // message: '正在比对录音',
    });
    let topic = topics.value[topicIndex]

    proxy.$axios.post(proxy.$config.domain + "Activity/SpeakResult", {aid:aid,id:topic.topicId, fileName: fileName }, { hideLoading: true, toJSON: true})
    .then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            const d = response.data.data

            topics.value[topicIndex].canvas = false
            topics.value[topicIndex].score = d.score
            if (d.status == 1) {
                topics.value[topicIndex].tip = 1
                topics.value[topicIndex].finishNum = d.finishNum
                if (d.awardStatus == 1) {
                    setTimeout(() => {
                        
                        topics.value[topicIndex].awardStatus = 1
                        swipeChange(topicIndex)
                    }, 500);
                }
            } else {
                topics.value[topicIndex].tip = 2
            }

            
            
            // console.log(response, "===response===")
            // showToast('请求成功！')
            closeToast()
        } else {
            showToast(response.data.msg?response.data.msg:'比对失败');
            // self.prevent = false;
        }
    })
    .catch(error => {
        showToast("比对失败！");
        // showLoading = false;
        // self.prevent = false;
    });
}
function getActivity(adcode) {
    //https://pqjc.site/api/v1/client/subscribe?token=fb1cd28cc014c90ddaa498c65d08d3bf
    //https://pqjc.site/api/v1/client/subscribe?token=fb1cd28cc014c90ddaa498c65d08d3bf
    //
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Activity/SpeakInfo?id='+aid+'&adcode='+adcode).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            if(d.title) {
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
                    router.replace({ name: 'UserReg', query: { id: aid, page: 'SpeakSpeak', type:  route.query.type, 
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '认证成功后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'UserMine', query: { id: aid, page: 'CourseCourse', type:  route.query.type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitAuth) {
                showDialog({
                    message: d.tip_img,
                    showConfirmButton: false,
                })

                return
            }
            if(d.receive_type) {
                receive_type.value = d.receive_type
            }

            if(receive_type.value == 2) {
                money.value = d.money
            } else {
                money.value = d.money / 100.0
            }

            if (receive_type.value == 2) {
                regPacketBg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736788632404.png'
            } else if (receive_type.value == 3) {
                regPacketBg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736788918168.png'
            }

            

            let topicList = []
            d.topics.forEach(el => {
                el.tip = 1
                el.canvas = true
                el.backUrl = ''
                el.score = -1
                topicList.push(el)
            });
            topics.value = topicList

            if (d.status == 3 || d.status == 5 || d.status == 6) {
                showNoStartPop.value = true
                noStartImg.value = d.tip_img
            } else {
                getPolicyToken(null)
                getPermission()
                swipeChange(0)
                

                if (!localStorage.getItem("speak_slide_tip")) {
                    showTipPop.value = true
                    nextTick(() => {
                        setTimeout(() => {
                            localStorage.setItem("speak_slide_tip", "1");
                            showTipPop.value = false
                        }, 2000)
                    })

                }
            }


            

            

            
            
            

        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
            // showEmpty.value = true
            // tipMessage.value = response.data.msg ?response.data.msg:'网络连接错误，请刷新重试'
            // this.$toast(response.data.message)
        }
    })
        .catch(error => {
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            
            console.log(error)
        });
}
function getPolicyToken(wavBlob) {
    proxy.$axios.get(proxy.$config.domain + 'Oss/GetPolicyToken?type=wav&id='+aid, { hideLoading: true}).then(response => {
        console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            aliyunOssToken = d
            if (wavBlob) {
                uploadFile(wavBlob)
            }

        } else {
            if (wavBlob) {
                showToast('语音上传失败')
            }

        }
    }).catch(error => {
        if (wavBlob) {
            showToast('语音上传失败')
        }
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    });
}


// 记录初始滑动位置
function onTouchStart(e) {
    e = e || event
    // e.preventDefault()
    startX = e.touches[0].clientX
}
// 记录每次滑动位置
function onTouchMove(e) {
    e = e || event
    // e.preventDefault()
    let surrentStartX
    if (e.touches.length == 1) {
        surrentStartX = e.touches[0].clientX
    }
    if (surrentStartX != startX) {
        if (btRecoding.value) {
            showToast('正在录音， 请勿滑动')
            e.stopPropagation()
        }
        
    } 
}

function showGeoPosition(position) {
    console.log(position, "showGeoPosition=====")
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
    if(id && typeof id === 'string') {
        aid = id
    }

    if (aid == "") {
        router.replace({ path: '/404', query: { msg:'活动不存在' } })
        return
    }
    if (route.query.type == 'loc') {
        GetGeo()
    } else {
        getActivity('')
    }

   
    
    


    // let page = route.query.page
    // if(page && typeof page === 'string') {
    //     routerName = page
    // }

    // startCanvas();

    


    nextTick(() => {
        if (speak_content.value.clientHeight / speak_content.value.clientWidth < 1.6) {
            miniCla.value = true
        }
    })

})

// async function runOnce(line) {
//   console.log(`speak: ${line}`)
//   loadIndex++

//   //let dumpFile = fs.createWriteStream(`${process.pid}.wav`, {flags:"w"})
//   let tts = new Nls.SpeechSynthesizer({
//     url: URL,
//     appkey:APPKEY,
//     token:TOKEN
//   })

//   tts.on("meta", (msg)=>{
//     console.log("Client recv metainfo:", msg)
//   })

//   tts.on("data", (msg)=>{
//     console.log(`recv size: ${msg.length}`)
//     //console.log(dumpFile.write(msg, "binary"))
//   })

//   tts.on("completed", (msg)=>{
//     console.log("Client recv completed:", msg)
//   })

//   tts.on("closed", () => {
//     console.log("Client recv closed")
//   })

//   tts.on("failed", (msg)=>{
//     console.log("Client recv failed:", msg)
//   })

//   let param = tts.defaultStartParams()
//   param.text = line
//   param.voice = "aixia"
//   try {
//     await tts.start(param, true, 6000)
//   } catch(error) {
//     console.log("error on start:", error)
//     return
//   } finally {
//     //dumpFile.end()
//   }
//   console.log("synthesis done")
//   await sleep(2000)
// }

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    background: #f1f1f1;
    padding-bottom: 0.1rem;
    // padding-bottom: 1.45rem;
    // background: url(../../assets/img/speak/speak-top-bg.png);
    // background-size:100% 8.12rem;
    // background-repeat: no-repeat;
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
.my-swipe .van-swipe-item {
    width: 10rem;
    min-height: 100vh;
    // height: 3rem;
    // height: 14.67rem;
    // // background: #FFFFFF;
    // border-radius: 0.13rem;
    // border: 1px solid #f1f1f1;

    background: url(../../assets/img/speak/speak-top-bg.png);
    background-size:100% 8.12rem;
    background-repeat: no-repeat;


    .top {
        margin: 0.6rem 0.4rem -0.01rem;
        font-size: 0.67rem;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 1.12rem;
        .tip {
            flex: 1;
            text-shadow: 0rem 0rem 0rem #16B771;
        }
        .money {

            background: url(../../assets/img/speak/red-bg.png);
            background-size:100% 100%;
            background-repeat: no-repeat;
            font-size: 0.4rem;
            color: #333333;

            img {
                width: 0.67rem;
                margin-left: 0.47rem;
                margin-right: 0.2rem;
            }
            div {
                margin-right: 0.35rem;
                span {
                    font-size: 0.53rem;
                    font-weight: 500;
                    color: #FE8E09;
                }
            }
        }
    }
    .name-div {
        background: #FFFFFF;
        border-radius: 0.27rem 0rem 0.27rem 0.27rem;
        margin: 0 0.4rem;

        font-size: 0.48rem;
        font-weight: bold;
        color: #333333;
        line-height: 0.72rem;

        .name {
            padding: 0.4rem 0.5rem 0.04rem;
            background: #FFFFFF;
            border-radius: 0.27rem 0rem 0.27rem 0.27rem;
        }
        .index-div {
            position: relative;
            .index {
                padding: 0.6rem 0.5rem 0.35rem;
                font-size: 0.43rem;
                span {
                    font-size: 0.53rem;
                    color: #12CB7B;
                }
            }
            img {
                width: 1.73rem;
                height: 1.57rem;
                position: absolute;
                right: 0.5rem;
                top: 0;
            }
        }
        
    }
    .speak {
        margin: 0.3rem 0.4rem;
        background: #FFFFFF;
        border: 0.05px solid #FFFFFF;
        border-radius: 0.27rem;
        // height: 10rem;
        height: calc(100vh - 6.5rem);
        min-height: 11.5rem;
        .tip {
            flex: 1;
            margin: 0.3rem 0.4rem;
            line-height: 0.93rem;
            height: 0.93rem;
            background: rgba(171,171,171,0.07);
            border-radius: 0.27rem;

            font-size: 0.53rem;
            font-weight: bold;

            padding-left: 0.39rem;
            padding-right: 0.39rem;

            .name {
                font-size: 0.37rem;
                font-weight: normal;
                flex: 1;
            }
            span {
                color: #FE8E09;
            }
        }

        .score-num {
            flex: 1;
            margin: 0.3rem 1.7rem 0 1.1rem;
            font-size: 0.45rem;
            font-family: Gilroy;
            font-weight: bold;
            color: #333333;
            height: 0.76rem;
            .score-num-bg {
                width: 0.87rem;
                height: 0.76rem;
                background-image: url(../../assets/img/speak/score-bg.png);
                background-size: 100% 100%;
                text-align: center;
                margin-left: -0.47rem;
            }
            .score-num-bg.hidden {
                display: none;
            }
        }
        .score-div {
            flex: 1;
            margin: 0 0.4rem;
            font-size: 0.64rem;
            font-family: Gilroy;
            font-weight: bold;
            color: #333333;
            .score-bg {
                flex: 1;
                background: #F4F4F4;
                border-radius: 0.29rem;

                margin-left: 0.3rem;
                margin-right: 0.3rem;
                height: 0.69rem;
                position: relative;

                .score-tip {
                    position: absolute;
                    left: 80%;
                    top: 0;
                    bottom: 0;
                    background: #12CB7B;
                    width: 2px;
                }

                .score{
                    background: #12CB7B;
                    border-radius: 0.29rem;
                    height: 0.69rem;
                }
                .score.fail {
                    background: #FE8E09;
                }
            }
        }
        .op-tip {
            height: 3.5rem;
            margin:0 0.4rem;
            canvas {
                height: 3.5rem;
                width: 8.4rem;
            }
        }
        .suc-tip {
            font-size: 0.48rem;
            font-weight: bold;
            color: #12CB7B;
            line-height: 1rem;
            // display: none;
            img {
                width: 1.53rem;
            }
        }
        .fail-tip {
            font-size: 0.48rem;
            font-weight: bold;
            color: #FE8E09;
            line-height: .7rem;
            text-align: center;
            img {
                width: 1.53rem;
                margin-bottom: .3rem;
            }
        }
        .op-div {
            font-size: 0.4rem;
            color: #333333;
            // line-height: 0.63rem;
            margin:auto 0.6rem;
            // flex: 1;
            height: 2.8rem;
            line-height: .8rem;
            img {
                width: 1.41rem;
            }
            .speak-btn {
                flex: 1;
                text-align: center;
                height: 2.8rem;
                .speak-icon {
                    width: 2.1rem;
                    height: 2.1rem;
                    background-image: url(../../assets/img/speak/speak.png);
                    background-size: 100% 100%;
                    margin: auto;
                }
                .speak-icon.speaking {
                    background-image: url(../../assets/img/speak/speaking.png);
                    background-size: 100% 100%;
                }
                .speak-icon.speaked {
                    background-image: url(../../assets/img/speak/speaked.png);
                    background-size: 100% 100%;
                }
            }
        }
        .speak-tip {
            width: 9.2rem;
            height: 0.99rem;
            background: #38E49710;
            // flex: 1;
            // opacity: 0.05;
            border-radius: 0.27rem;

            font-size: 0.4rem;
            color: #666666;
            line-height: 0.99rem;
            text-align: center;

            margin-top: .5rem;

        }
        
    }
    .speak.mini-speak{
        min-height: 10rem;
        .op-tip {
            // flex: 0;
            height: 2rem;
            img {
                display: none;
            }
            canvas {
                height: 2rem;
            }
        }
    }
    
    
}
.slide-tip-pop {
    width: 5.3rem;
    position: absolute;
    top: 9.2rem;
    left: 2.35rem;
}

.speak-icon.speaking {
//   animation: bounce-in 0.5s;
//   animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
  animation-name: bounce-in ; // 动画名称
animation-direction: alternate; // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
animation-timing-function: linear; // 动画执行方式，linear：匀速；ease：先慢再快后慢；ease-in：由慢速开始；ease-out：由慢速结束；ease-in-out：由慢速开始和结束；
animation-delay: 0s; // 动画延迟时间
animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
animation-duration: 1s; // 动画完成时间

}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
  animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
}
@keyframes bounce-in {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.3);
  }
  
}
audio {
    width: 0;
    height: 0;
}
</style>
<style lang="scss">
.reg-packet-pop {
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