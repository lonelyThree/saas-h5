<template>
    <div class="main-content speak">
        <van-swipe class="my-swipe" :loop="false" :show-indicators="false">
            <van-swipe-item>
                <div class="top" flex="dir:left cross:center">
                    <div class="tip">请阅读以下文字</div>
                    <div class="money" flex="dir:left cross:center">
                        <img src="../../assets/img/speak/red.png" />
                        <div><span>5</span>元红包</div>
                    </div>
                </div>
                <div class="name-div">
                    <div class="name">枸橡酸莫沙必利可以促进消化道动力， 主治消化不良</div>
                    <div class="index"><span>4</span>/7</div>
                </div>
                <div class="speak" flex="dir:top main:justify box:justify">
                    <div>
                    <div class="tip" flex="dir:left cross:center">
                        <div class="name">需要成功练习<span>3</span>次方可获得奖励哦</div>
                        <div><span>0</span>/3</div>
                    </div>
                    <div class="score-num" flex="dir:left cross:left">
                        <div class="empty" style="width:37%;"></div>
                        <div>7</div>
                    </div>
                    <div class="score-div" flex="dir:left cross:center">
                        <div>0</div>
                        <div class="score-bg">
                            <div class="score fail" style="width:37%;"></div>
                        </div>
                        <div>10</div>
                    </div>
                    </div>
                    <div style="width:100%;height:50px;border:1px solid red;flex:0;">
                        <canvas id="canvas"></canvas>
                        <!-- <span style="padding: 0 10%;"></span> -->
                    </div>
                    <div class="suc-tip" flex="dir:top cross:center main:center ">
                        <img src="../../assets/img/speak/suc.png" />
                        <div>恭喜你，及格了!</div>
                    </div>
                    <div class="fail-tip" flex="dir:top cross:center">
                        <img src="../../assets/img/speak/fail.png" />
                        <div>恭喜你，及格了!</div>
                    </div>
                    <div class="op-div" flex="dir:left cross:center">
                        <div  flex="dir:top cross:center">
                            <img src="../../assets/img/speak/play-back.png" />
                            <div>回放</div>
                        </div>
                        <div class="speak-btn"
                          @click="speakClick">
                            <div :class="{ 'speaking': btRecoding }" catchtouchmove="true"></div>
                        </div>
                        <div  flex="dir:top cross:center">
                            <img src="../../assets/img/speak/audition.png" />
                            <div>试听</div>
                        </div>
                    </div>
                    <div class="speak-tip">按住按钮，说出上方文字即可获得奖励!</div>
                </div>
            </van-swipe-item>
            <van-swipe-item>2</van-swipe-item>
            <van-swipe-item>3</van-swipe-item>
            <van-swipe-item>4</van-swipe-item>
        </van-swipe>
        <div class="home" style="margin:1vw;display:none;">
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
    <Button type="info" @click="downWAV()" style="margin:1vw;">下载WAV</Button>
    <!-- <Button type="info" @click="getMp3Data()" style="margin:1vw;">下载MP3</Button> -->
    <br/>
    <Button type="error" @click="destroyRecorder()" style="margin:1vw;">销毁录音</Button>
    <br/>
    <!-- <div style="width:100%;height:200px;border:1px solid red;">
      <canvas id="canvas"></canvas>
      <span style="padding: 0 10%;"></span>
      <canvas id="playChart"></canvas>
    </div> -->
  </div>
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import tabbar from '../../components/custom_tabbar.vue'
import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";
import { areaList } from '@vant/area-data';




const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()


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

let cservice_url = ''

let aliyunOssToken = {accessid: "LTAI5tRTaHTJYndqwtSVSZ44",
callback: "eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9ybWthcGkuYWkteGJ5cy5jb20vQWRtaW4vTG9naW4iLCJjYWxsYmFja0JvZHkiOiJmaWxlbmFtZT0ke29iamVjdH1cdTAwMjZzaXplPSR7c2l6ZX1cdTAwMjZtaW1lVHlwZT0ke21pbWVUeXBlfVx1MDAyNmhlaWdodD0ke2ltYWdlSW5mby5oZWlnaHR9XHUwMDI2d2lkdGg9JHtpbWFnZUluZm8ud2lkdGh9IiwiY2FsbGJhY2tCb2R5VHlwZSI6ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCJ9",
dir: "pcm/655e28d6/",
expire: 1698243573,
host: "https://vipimage.oss-cn-qingdao.aliyuncs.com",
policy: "eyJleHBpcmF0aW9uIjoiMjAyMy0xMC0yNVQxNjo1MToyNVoiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwxMDQ4NTc2MDBdLFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl1dfQ==",
signature: "KcCQkw+0PqgxCDkA5hKWMS+ZgS8="}


let loop = ''
let btRecoding = ref(false)
let blackBoxSpeak= ref(true)
let startY = ''
let timeOutEvent = 0

import Recorder from 'js-audio-recorder'

import jwx from "weixin-js-sdk"

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
        ctx = null,
        //波浪图-播放
        drawPlayId = null,
        pCanvas =null,
        pCtx = null
 
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
       * 波浪图配置
       * */
    function  startCanvas(){
        //录音波浪
        oCanvas = document.getElementById('canvas');
        ctx = oCanvas.getContext("2d");
        //播放波浪
        // pCanvas = document.getElementById('playChart');
        // pCtx = pCanvas.getContext("2d");
      }
 
      /**
       *  录音的具体操作功能
       * */
      // 开始录音
     function startRecorder () {
        recorder.start().then(() => {
          drawRecord();//开始绘制图片
        }, (error) => {
          // 出错了
          console.log(`${error}`);
        });
      }
      // 继续录音
     function resumeRecorder () {
        recorder.resume()
      }
      // 暂停录音
     function pauseRecorder () {
        recorder.pause();
        drawRecordId && cancelAnimationFrame(drawRecordId);
        drawRecordId = null;
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
        drawPlay();//绘制波浪图
      }
      // 暂停录音播放
      function pausePlayRecorder () {
        recorder.pausePlay()
      }
      // 恢复录音播放
      function resumePlayRecorder () {
        recorder.resumePlay();
        drawPlay();//绘制波浪图
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
        let fileSize = recorder.fileSize;//录音总大小
 
        //录音结束，获取取录音数据
        let PCMBlob = recorder.getPCMBlob();//获取 PCM 数据
        let wav = recorder.getWAVBlob();//获取 WAV 数据
 
        let channel = recorder.getChannelData();//获取左声道和右声道音频数据

// accessid: "LTAI5tRTaHTJYndqwtSVSZ44"
// callback: "eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9ybWthcGkuYWkteGJ5cy5jb20vQWRtaW4vTG9naW4iLCJjYWxsYmFja0JvZHkiOiJmaWxlbmFtZT0ke29iamVjdH1cdTAwMjZzaXplPSR7c2l6ZX1cdTAwMjZtaW1lVHlwZT0ke21pbWVUeXBlfVx1MDAyNmhlaWdodD0ke2ltYWdlSW5mby5oZWlnaHR9XHUwMDI2d2lkdGg9JHtpbWFnZUluZm8ud2lkdGh9IiwiY2FsbGJhY2tCb2R5VHlwZSI6ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCJ9"
// dir: "pcm/655e28d6"
// expire: 1698253407
// host: "https://vipimage.oss-cn-qingdao.aliyuncs.com"
// policy: "eyJleHBpcmF0aW9uIjoiMjAyMy0xMC0yNVQxNzowMzoyN1oiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwxMDQ4NTc2MDBdLFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl1dfQ=="
// signature: "7PRIPmvNZmkzx0/tpuag0SydxDk="

        let aliyunOssToken = {accessid: "LTAI5tRTaHTJYndqwtSVSZ44",
callback: "eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9ybWthcGkuYWkteGJ5cy5jb20vQWRtaW4vTG9naW4iLCJjYWxsYmFja0JvZHkiOiJmaWxlbmFtZT0ke29iamVjdH1cdTAwMjZzaXplPSR7c2l6ZX1cdTAwMjZtaW1lVHlwZT0ke21pbWVUeXBlfVx1MDAyNmhlaWdodD0ke2ltYWdlSW5mby5oZWlnaHR9XHUwMDI2d2lkdGg9JHtpbWFnZUluZm8ud2lkdGh9IiwiY2FsbGJhY2tCb2R5VHlwZSI6ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCJ9",
dir: "pcm/655e28d6/",
expire: 1698243573,
host: "https://vipimage.oss-cn-qingdao.aliyuncs.com",
policy: "eyJleHBpcmF0aW9uIjoiMjAyMy0xMC0yNVQxNjo1MToyNVoiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwxMDQ4NTc2MDBdLFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl1dfQ==",
signature: "KcCQkw+0PqgxCDkA5hKWMS+ZgS8="}

        var filename = new Date().getTime();
        var formData = new FormData();
        //注意formData里append添加的键的大小写
        formData.append('x-oss-forbid-overwrite', true)
        formData.append('key', aliyunOssToken.dir + filename + '.pcm'); //存储在oss的文件路径
        formData.append('OSSAccessKeyId', aliyunOssToken.accessid); //accessKeyId
        formData.append('policy', aliyunOssToken.policy); //policy
        formData.append('Signature', aliyunOssToken.signature); //签名
        formData.append('success_action_status', '404'); //签名
        formData.append('callback', aliyunOssToken.callback); //签名
        formData.append("file", PCMBlob);
        var url = aliyunOssToken.host;
        var fileUrl = aliyunOssToken.host +'/'+ aliyunOssToken.dir + filename;

        proxy.$axios.post(url, formData, {customRequst:true,headers:{'referer':'','X-NLS-Token':'999----6c569fc546164222842fd6a6ae4360bd','Content-type':'application/octet-stream', 'Content-Length':94616, 'Host': 'nls-gateway-cn-beijing.aliyuncs.com'}}).then(response => {
            console.log(url, response, "url---response")
        // showLoading = false;
        if (response.data.code === 200) {
            showToast('保存成功！')
            setTimeout(()=> {
                // router.replace({name: routerName, query:{'id':aid}})
                // self.$router.replace({name: 'BaseInfo'})
            }, 1000)
        } else {
            showToast(response.data.msg?response.data.msg:'保存失败');
            // self.prevent = false;
        }
        


        // proxy.$axios.post('https://nls-gateway-cn-beijing.aliyuncs.com/stream/v1/asr?appkey=k7CvBBSuqgmOj0j9', PCMBlob, {customRqu:true,headers:{'referer':'','X-NLS-Token':'999----6c569fc546164222842fd6a6ae4360bd','Content-type':'application/octet-stream', 'Content-Length':94616, 'Host': 'nls-gateway-cn-beijing.aliyuncs.com'}}).then(response => {
        // // showLoading = false;
        // if (response.data.code === 200) {
        //     showToast('保存成功！')
        //     setTimeout(()=> {
        //         // router.replace({name: routerName, query:{'id':aid}})
        //         // self.$router.replace({name: 'BaseInfo'})
        //     }, 1000)
        // } else {
        //     showToast(response.data.msg?response.data.msg:'保存失败');
        //     // self.prevent = false;
        // }
    })
    .catch(error => {
        showToast("保存失败！");
        // showLoading = false;
        // self.prevent = false;
    });

        console.log(toltime, fileSize, PCMBlob, wav, channel)
 
      }

      /**
       *  下载录音文件
       * */
      //下载pcm
      function downPCM(){
        //这里传参进去的时文件名
        recorder.downloadPCM('新文件');
      }
      //下载wav
      function downWAV(){
        //这里传参进去的时文件名
        recorder.downloadWAV('新文件');
      }
      /**
       *  获取麦克风权限
       * */
      function getPermission(){
        Recorder.getPermission().then(() => {
          showToast('获取权限成功')
        }, (error) => {
          console.log(`${error.name} : ${error.message}`);
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
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);
 
        // 设定波形绘制颜色
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
 
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
      /**
       * 绘制波浪图-播放
       * */
      function drawPlay () {
        // 用requestAnimationFrame稳定60fps绘制
        drawPlayId = requestAnimationFrame(drawPlay);
 
        // 实时获取音频大小数据
        let dataArray = recorder.getPlayAnalyseData(),
                bufferLength = dataArray.length;
 
        // 填充背景色
        pCtx.fillStyle = 'rgb(200, 200, 200)';
        pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
 
        // 设定波形绘制颜色
        pCtx.lineWidth = 2;
        pCtx.strokeStyle = 'rgb(0, 0, 0)';
 
        pCtx.beginPath();
 
        var sliceWidth = pCanvas.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
                x = 0;          // 绘制点的x轴位置
 
        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * pCanvas.height / 2;
 
          if (i === 0) {
            // 第一个点
            pCtx.moveTo(x, y);
          } else {
            // 剩余的点
            pCtx.lineTo(x, y);
          }
          // 依次平移，绘制所有点
          x += sliceWidth;
        }
 
        pCtx.lineTo(pCanvas.width, pCanvas.height / 2);
        pCtx.stroke();
      }
 

setToastDefaultOptions({ duration: 2000 });

function speakClick() {
    if (btRecoding.value) {
        btRecoding.value = false
        //获取录音文件
        showToast("获取录音文件==")
        console.log("touchend", "获取录音文件", "====")


        jwx.stopRecord({
            success: function (res) {
                var localId = res.localId;
                showToast("停止录音：" + localId)
                jwx.translateVoice({
                    localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        showToast(res.translateResult)
                        // alert(res.translateResult); // 语音识别的结果
                    }, fail: function (res) {
                        showToast("识别识别")
                    }
                });


            },
            fail: function (res) {
                showToast("停止录音err：")
                console.log("停止录音err：", res)
            },
        });
    } else {
        showToast("开始录音")
        // 调用录音方法
        btRecoding.value = true
        // startRecorder()
        jwx.startRecord()

    }
}
// 手指开始触发
function touchstart(e) {
    let i = 1
    blackBoxSpeak.value = true
    startY = e.clientY

    timeOutEvent = 0
    // 长按1000毫秒后执行
    timeOutEvent = setTimeout(() => {
        
        startRecord()
    }, 800)
    return false
}
// 长按超过1000毫秒
function  startRecord(){
    showToast("开始录音")
    // 调用录音方法
    btRecoding.value = true
    // startRecorder()
    jwx.startRecord()


    
}
// 短按
function  startRecordClick(){
    // 长按没有超过1000毫秒
}
// 手指离开屏幕触发
function  touchend() {

    clearTimeout(timeOutEvent)
    btRecoding.value = false
    blackBoxSpeak.value = false
    // stopRecorder()
    //获取录音文件
    showToast("获取录音文件==")
    console.log("touchend", "获取录音文件", "====")
    

    jwx.stopRecord({
        success: function (res) {
            var localId = res.localId;
            showToast("停止录音：" + localId)
            jwx.translateVoice({
                localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    showToast(res.translateResult)
                    // alert(res.translateResult); // 语音识别的结果
                }, fail:function(res) {
                    showToast("识别识别")
                }
            });


        },
        fail: function (res) {
            showToast("停止录音err：")
            console.log("停止录音err：", res)
        },
    });
    // getRecorder()

}
// 滑动触发
function  touchmove(e) {
    const endY = e.clientY
    if (startY < endY) {
        showToast("手指移动")
        blackBoxSpeak = true
    } else {
        blackBoxSpeak = false
    }
}



 // 绑定手机号确定按钮
function submitInfo() {
    if(!addressInfo.value.name.trim()) {
        showToast("请输入姓名");
        return false;
    }
    
    if (!addressInfo.value.areaDetail.countyId) {
        showToast("请选择省市区");
        return false;
    }

    if (!addressInfo.value.areaDetail) {
        
    }
    

    proxy.$axios.post(proxy.$config.domain + "User/AddressInfo", addressInfo.value, { toJSON: true})
    .then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            showToast('保存成功！')
            setTimeout(()=> {
                router.replace({name: routerName, query:{'id':aid}})
                // self.$router.replace({name: 'BaseInfo'})
            }, 1000)
        } else {
            showToast(response.data.msg?response.data.msg:'保存失败');
            // self.prevent = false;
        }
    })
    .catch(error => {
        showToast("保存失败！");
        // showLoading = false;
        // self.prevent = false;
    });
    }
function getActivity() {
    
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Oss/GetPolicyToken?type=index&id='+aid).then(response => {
        console.log(response)
        if (response.data.code === 200) {

            // const d = response.data.data
            
            // if(d.ask_status == 10) {
            //     router.replace({name: routerName, query:{'id':aid}})
            // } else if(d.ask_status != 9) {
            //     router.replace({ path: '/404', query: { msg:'未中奖， 不需要填写收货地址' } })
            // }

            // if (d.cservice_url) {
            //     cservice_url = d.cservice_url
            // }
            


            

        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
        .catch(error => {
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}


function getJsTicket() {

    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'User/GetTicketSign?url='+ encodeURIComponent('https://rmk.ai-xbys.com/speak/speak1?id=1j4v0hev00000000c&wx_appid=wxbc48b5bc6a8d1ac7')).then(response => {
        console.log(response)
        if (response.data.code === 200) {

            // const d = response.data.data

            // if(d.ask_status == 10) {
            //     router.replace({name: routerName, query:{'id':aid}})
            // } else if(d.ask_status != 9) {
            //     router.replace({ path: '/404', query: { msg:'未中奖， 不需要填写收货地址' } })
            // }

            // if (d.cservice_url) {
            //     cservice_url = d.cservice_url
            // }





        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
        .catch(error => {
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

onMounted(() => {
    // let id = route.query.id
    // if(id && typeof id === 'string') {
    //     aid = id
    //     addressInfo.value.askId = id
    // }

    // if (addressInfo.value.askId == "") {
    //     router.replace({ path: '/404', query: { msg:'活动不存在' } })
    //     return
    // }

    getActivity()
    // getJsTicket()


    // let page = route.query.page
    // if(page && typeof page === 'string') {
    //     routerName = page
    // }

    startCanvas();

    // getPermission();

    jwx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        // appId: '', // 必填，公众号的唯一标识
        // timestamp:, // 必填，生成签名的时间戳
        // nonceStr: '', // 必填，生成签名的随机串
        // signature: '',// 必填，签名
        appId: "wxbc48b5bc6a8d1ac7",
        nonceStr: "4068881qa70fnpcy",
        signature: "feb95334f04f509033c44c1f16788de418fd62f9",
        timestamp: 1698649190,
        // url: "https://rmk.ai-xbys.com/speak/speak1?id=1j4v0hev00000000c&wx_appid=wxbc48b5bc6a8d1ac7",

        // appId: "wxbc48b5bc6a8d1ac7",
        // nonceStr: "z1skmz6zoc04s9d5",
        // signature: "9933332ed29ef4d0d889ab7b02be203b6211d0cf",
        // timestamp: 1698645531,
        jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'onVoicePlayEnd',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'translateVoice',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ], // 必填，需要使用的JS接口列表
    });

    jwx.ready(function () {
        showToast('jwx ready')
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });



    jwx.error(function (res) {
        console.log('jwx error', res)
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });

    jwx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function (res) {
            showToast('end complete')
            var localId = res.localId;
        }
    });


    



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
            padding: 0.64rem 0.5rem;
            background: #FFFFFF;
            border-radius: 0.27rem 0rem 0.27rem 0.27rem;
        }
        .index {
            padding: 0rem 0.5rem 0.35rem;
            font-size: 0.43rem;
            span {
                font-size: 0.53rem;
                color: #12CB7B;
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
        min-height: 9.5rem;
        .tip {
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
            margin: 0.3rem 0rem 0;
            font-size: 0.45rem;
            font-family: Gilroy;
            font-weight: bold;
            color: #333333;
        }
        .score-div {
            margin: 0 0.4rem 0.3rem;
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
        .suc-tip {
            font-size: 0.48rem;
            font-weight: bold;
            color: #12CB7B;
            line-height: 1.12rem;
            // display: none;
            img {
                width: 1.53rem;
            }
        }
        .fail-tip {
            display: none;
            font-size: 0.48rem;
            font-weight: bold;
            color: #FE8E09;
            line-height: 1.12rem;
            img {
                width: 1.53rem;
            }
        }
        .op-div {
            font-size: 0.4rem;
            color: #333333;
            line-height: 0.63rem;
            margin:auto 0.6rem;
            img {
                width: 1.41rem;
            }
            .speak-btn {
                flex: 1;
                text-align: center;
                height: 2.45rem;
                div {
                    width: 2.45rem;
                    height: 2.45rem;
                    background-image: url(../../assets/img/speak/speak.png);
                    background-size: 100% 100%;
                    margin: auto;
                }
                div.speaking {
                    background-image: url(../../assets/img/speak/speaking.png);
                    background-size: 100% 100%;
                }
            }
        }
        .speak-tip {
            width: 9.2rem;
            height: 0.99rem;
            background: #38E49710;
            // opacity: 0.05;
            border-radius: 0.27rem;

            font-size: 0.4rem;
            color: #666666;
            line-height: 0.99rem;
            text-align: center;

        }
        
    }
    
}
</style>