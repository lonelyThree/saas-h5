<template>
    <div class="main-content receipt" ref="receipt_content">
        <div class="img-content">
            <div class="empty"></div>
            <div class="op-right-div" flex="dir:right cross:top">
                <div class="op-right-item" flex="dir:top cross:center"  @click="descUrlClick">
                    <img src="../../assets/icons/desc-icon.png" />活动说明
                </div>

                <div class="op-right-item" flex="dir:top cross:center"   @click="rankClick">
                    <img src="../../assets/icons/rank-icon.png" />{{ awardType.value == 2 ? '积分' : (awardType.value == 3 ?'星币':'红包') }}排行
                </div>
                <div class="op-right-item" flex="dir:top cross:center" v-if="isReceive"  @click="receiveAwardClick">
                    <img src="../../assets/icons/award-icon.png" />领取奖品
                </div>

                <div class="op-right-item" flex="dir:top cross:center" v-if="warehouse.warehouse_id"  @click="warehouseClick">
                    <img src="../../assets/icons/warehouse-icon.png" />拍入库单
                </div>
            </div>
            <div class="receipt-bg">
                 <div class="answer-bg"
                 @click="showPreImg"
                :style="{ backgroundImage: 'url(' + receiptImg + ')', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }"></div>
            </div>
            <div class="tip-div err" v-if="showTip == 2">
                小票校验失败，请重新上传!!!
            </div>
            <div class="tip-div suc" v-else-if="showTip == 1">
                小票校验成功!!!
            </div>
            <div class="tip-div" v-else-if="showTip == 3">
                请求中
            </div>
            <div class="tip-div" v-else @click="ruleImgClick">
                拍照示例<van-icon name="question" v-if="descImg" />
            </div>
            <div class="title-div-div">
                <div class="title-div">
                    {{ showTip == 2 ? '错误提示' : '活动规则'}}
                    <div class="title-bg"></div>
                </div>
            </div>
            <div class="tip-text-div" v-if="showTip == 2">
                <div class="text-div" flex="dir:left cross:top">
                   <span class="tip"> {{ errMsg }}</span>
                </div>
                <div class="cService-div" flex="dir:left  cross:center main:center"  @click="cServiceClick">
                     <img src="../../assets/img/cservice.png" />联系客服
                </div>
            </div>
            <div class="tip-text-div" v-else>
                <img :src="ruleImg" />
                <!-- <div class="text-div" flex="dir:left cross:top">
                    <div class="num">01.</div>
                    <div>请确保小票<span class="tip">平整拍摄</span>(可用尺子进行固定)</div>
                </div>
                <div class="text-div" flex="dir:left cross:top">
                    <div class="num">02.</div>
                    <div>拍摄时最好将小票<span class="tip">放置在纯色背景</span> (白纸) 上</div>
                </div>
                <div class="text-div" flex="dir:left cross:top">
                    <div class="num">03.</div>
                    <div>需拍摄<span class="tip">完整的小票信息</span></div>
                </div>
                <div class="text-div" flex="dir:left cross:top">
                    <div class="num">04.</div>
                    <div>如上传识别不成功，可将照片<span class="tip">空白区域裁剪</span>后上传</div>
                </div> -->
            </div>
        </div>
        <div class="fixed-bottom" flex="dir:left cross:top" v-if="showBtnType == 3">
            <div class="p" @click="uploadClick">
                重新上传
                <uploadImg @func="uploadSectionFile" :reSize="2000" v-if="!errorLimit"></uploadImg>
            </div>
            <div class="p manual" @click.stop="manualClick">
                人工审核 {{ manualNum }}/{{ limit }}
            </div>
        </div>
        <div class="fixed-bottom" v-else-if="showBtnType == 7">
            <div class="p end">
                活动已结束
            </div>
        </div>
        <div class="fixed-bottom" v-else>
            <div class="p" @click="uploadClick">
                {{ showBtnType == 2 ?'重新上传':(showBtnType == 1 ? '再次上传':'点击拍照') }} 
                <uploadImg @func="uploadSectionFile" :reSize="2000"  v-if="!errorLimit"></uploadImg>
            </div>
        </div>

        

    </div>
           
    <van-popup v-model:show="showPop" class="red-packet-pop" :close-on-click-overlay="false">
        <div class="reg-packet-bg" :style="{ backgroundImage: 'url(' + regPacketBg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }">
            <div class="money">{{ money }}</div>
            <div class="reb-pop-btn" @click="receiveClick"></div>
        </div>
        

    </van-popup>
    <van-popup
      v-model:show="showPop"
      round
      :overlay="false"
      position="bottom"
      :style="{ height: '1.6rem' }"
    >
                <div class="manual-p-receipt" @click="manualNumClick">
                    {{ awardType.value == 2 ? '积分' : (awardType.value == 3 ?'星币':'金额') }}有误，申请人工审核
                </div>
    </van-popup>
    <van-action-sheet
          v-model:show="show"
          :actions="actions"
          :overlay="false"
        />

    <van-popup v-model:show="showNoStartPop" class="red-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg" />
    </van-popup>

    <van-dialog
        class="warn-pop"
        v-model:show="warnShow"
        show-cancel-button
        :before-close="onClose"
        theme="round-button"
    >
        <div class="warn-title" v-if="popType == 2" flex="dir:left cross:center main:center">活动规则</div>
        <div class="warn-title" v-else flex="dir:left cross:center main:center"><svg t="1717216989984" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478" width="0.43rem" height="0.43rem"><path d="M1004.657 801.716 602.263 91.599c-49.213-86.817-129.646-86.817-178.866 0L21.004 801.716c-49.207 86.906-8.949 157.798 89.388 157.798l804.877 0C1013.606 959.514 1053.825 888.622 1004.657 801.716zM544.635 832.216l-63.649 0 0-63.649 63.649 0L544.635 832.216zM544.635 641.27l-63.649 0L480.986 259.377l63.649 0L544.635 641.27z" p-id="1479" fill="#F56C6C"></path></svg>风险警告</div>
        <div class="warn-info" v-html="popInfo"></div>
        <template #footer>
            <div class="warn-footer" flex="dir:left cross:center main:center" v-if="popType != 3">
                <van-button class="warn-confirm-btn btn-gray" v-if="warnCountdown" type="danger" disabled>我知道了（{{ warnCountdown }} s）</van-button>
                <van-button class="warn-confirm-btn" v-else type="danger" @click="submitPopConfirmClick">我知道了</van-button>
            </div>
            <div class="warn-footer ban-footer" flex="dir:left cross:center main:center" v-else>
            </div>
        </template>
    </van-dialog>

    <img class="slide-tip-pop" src="../../assets/img/speak/slide-tip.png" v-if="showTipPop" />
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showLoadingToast, closeToast, showDialog, showImagePreview } from "vant";


import uploadImg from '../../components/uploadImg.vue'

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

let warehouse = ref({
    warehouse_id:'',
    type:''
})

const receiptImg = ref('https://vipimg.ai-xbys.com/saas/img/655e28d6/0770f31d/mxwtndhf1699852248302.png')
const regPacketBg = ref('https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736785033766.png')

const warnShow = ref(false);
const warnCountdown = ref(5); // 倒计时5秒
const popInfo = ref('')
const popType = ref(1)
 
 
const countdownTimer = () => {
  if (warnCountdown.value > 0) {
    setTimeout(() => {
      warnCountdown.value -= 1;
      countdownTimer();
    }, 1000);
  }
};

function showPreImg() {
    showImagePreview([receiptImg.value]);
}

function ruleImgClick() {
    if(descImg.value) {
        showImagePreview([descImg.value]);
    }
}

function descUrlClick() {
     if (descUrl.value) {
        window.location.replace(descUrl.value)
    }
}

function rankClick() {
    router.replace({name: 'ReceiptRank', query:{id:aid}})
}

function warehouseClick() {
    router.replace({name: 'ReceiptReceipt', query:{id:warehouse.value.warehouse_id, type:warehouse.value.type}})
    aid = warehouse.value.warehouse_id
    aType = warehouse.value.type

    initInfo()

    if (aType == 'loc') {
        GetGeo()
    } else {
        getActivity('')
    }


    
}

function receiveAwardClick() {
    router.replace({name: 'AwardInfo', query:{id:aid, type:'receipt', atype:aType, page:'ReceiptReceipt'}})
}


let aid = ''
let aType = ''
const awardType = ref(1)

const money = ref(0)
const showPop = ref(false)

const showTipPop = ref(false)
const showNoStartPop = ref(false)
const noStartImg = ref("")

const showTip = ref(0)
const showBtnType = ref(0)

const errMsg = ref("")

const errorLimit = ref(false)
const limit = ref(3)
const manualNum = ref(0)

const ruleImg = ref("")

const descImg = ref("")
const descUrl = ref("")

const isReceive = ref(false)


let logId = ""

let cservice_url = ''

function initInfo() {
    money.value = 0
    showPop.value = false

    showTipPop.value = false

    showNoStartPop.value = false
    noStartImg.value = ''

    showTip.value = 0
    showBtnType.value = 0 
    errMsg.value = ''    
    errorLimit.value = false
    limit.value = 3
    manualNum.value = 0 
    ruleImg.value = ''    
    descImg.value = ''
    descUrl.value = ''    
    isReceive.value = false


    logId =  ''
    cservice_url = ''

    warehouse.value = {
        warehouse_id:'',
        type:''
    }

    receiptImg.value = 'https://vipimg.ai-xbys.com/saas/img/655e28d6/0770f31d/mxwtndhf1699852248302.png'
    
}

function cServiceClick() {
    if (cservice_url) {
        window.location.replace(cservice_url)
    }
}

function  uploadClick() {
    if (errorLimit.value) {
        showToast('你已当到达错误上限，请1小时后再重试')
    }
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

function uploadFile(fileInfo) {
    showTip.value = 3
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        // message: '正在上传录音',
    })
    // toast.message = "正在上传录音"
    // console.log(fileInfo.fileName, fileInfo, "uploadFile")

    var filename = random_string(8) + new Date().getTime() +'.'+ fileInfo.fileName.match(/[^\.]\w*$/g)[0];
    var formData = new FormData();
    //注意formData里append添加的键的大小写
    formData.append('x-oss-forbid-overwrite', 'true')
    formData.append('key', aliyunOssToken.dir + filename); //存储在oss的文件路径
    formData.append('OSSAccessKeyId', aliyunOssToken.accessid); //accessKeyId
    formData.append('policy', aliyunOssToken.policy); //policy
    formData.append('Signature', aliyunOssToken.signature); //签名
    formData.append('success_action_status', '404'); //签名
    formData.append('callback', aliyunOssToken.callback); //签名
    formData.append("file", fileInfo.file);
    var url = aliyunOssToken.host;
    // var fileUrl = aliyunOssToken.host + '/' + aliyunOssToken.dir + filename;

    proxy.$axios.post(url, formData, { hideLoading: true, customRequst: true, headers: { 'Content-type': 'application/octet-stream' } }).then(response => {
        // console.log(url, response, "url---response")
        // showLoading = false;
        if (response.data.code === 200) {
            receiptImg.value = aliyunOssToken.url + aliyunOssToken.dir + filename


            submitInfo(aliyunOssToken.dir + filename)
        } else {
            showToast(response.data.msg ? response.data.msg : '上传失败');
            // self.prevent = false;
        }

    }).catch(error => {
        showToast("上传失败！");
    });


}

function uploadSectionFile(fileInfo) {
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        // message: '正在上传录音',
    })
    if (aliyunOssToken.expire * 1000 < new Date().getTime()) {
        getPolicyToken(fileInfo)
        return
    }
    uploadFile(fileInfo)
}



setToastDefaultOptions({ duration: 3000 });


function receiveClick() {

    proxy.$axios.post(proxy.$config.domain + "Activity/ReceiptAward", { aid: aid, id: logId }, { toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            let d = response.data.data
            if (d.status == 0) {
                showToast(d.msg)
            } else if (d.status == 200 ) {
                showPop.value = false
                showToast(d.msg)
            } else {
                showToast(response.data.msg ? response.data.msg : '领取失败');
            }
            if (d.pop_info && d.pop_info.pop_info) {
                setTimeout(() => {
                    warnShow.value = true
                    warnCountdown.value = 5
                    popInfo.value = d.pop_info.pop_info
                    popType.value  = d.pop_info.pop_type
                    countdownTimer()
                }, 1000)
                
            }
            
        } else {
            showToast(response.data.msg ? response.data.msg : '领取失败');
            // self.prevent = false;
        }
    }).catch(error => {
            showToast("领取失败！");
        });

}

function manualNumClick() {
    proxy.$axios.post(proxy.$config.domain + "Activity/ReceiptNumManual", { aid: aid, id: logId }, { toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {
            const d = response.data.data
     
            showToast('你的复核申请已提交，奖励审核后发放！')
            setTimeout(() => {
                showPop.value = false
            }, 500)

            if (d.pop_info && d.pop_info.pop_info) {
                setTimeout(() => {
                    warnShow.value = true
                    warnCountdown.value = 5
                    popInfo.value = d.pop_info.pop_info
                    popType.value  = d.pop_info.pop_type
                    countdownTimer()
                }, 1000)
                
            }
            

        } else {
            showToast(response.data.msg ? response.data.msg : '申请失败');
            // self.prevent = false;
        }
    }).catch(error => {
            showToast("申请失败！");
        });

}

function submitPopConfirmClick() {
    proxy.$axios.post(proxy.$config.domain + "Activity/ReceiptPopConfirm", { aid: aid }, { toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {

            warnShow.value = false


        } else {
            showToast(response.data.msg ? response.data.msg : '提交失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("提交失败");
    });

}

function manualClick() {
    proxy.$axios.post(proxy.$config.domain + "Activity/ReceiptManual", { aid: aid, id: logId }, { toJSON: true }).then(response => {
        // showLoading = false;
        if (response.data.code === 200) {

            showToast('申请成功')
            setTimeout(() => {
                showBtnType.value = 1
                showTip.value = 0
            }, 500)

            const d = response.data.data
            if (d.pop_info && d.pop_info.pop_info) {
                setTimeout(() => {
                    warnShow.value = true
                    warnCountdown.value = 5
                    popInfo.value = d.pop_info.pop_info
                    popType.value  = d.pop_info.pop_type
                    countdownTimer()
                }, 1000)
                
            }


        } else {
            showToast(response.data.msg ? response.data.msg : '申请失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("申请失败！");
    });

}

// 绑定手机号确定按钮
function submitInfo(fileName) {
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        // message: '正在比对录音',
    });

    proxy.$axios.post(proxy.$config.domain + "Activity/ReceiptResult", { aid: aid, fileName: fileName }, { hideLoading: true, toJSON: true })
        .then(response => {
             closeToast()
            // console.log(response, "response====response")
            // showLoading = false;
            if (response.data.code === 200) {
                const d = response.data.data


                if (d.status == 1) {
                    showTip.value = 1

                    showBtnType.value = 1
                    if (d.awardStatus == 3 || d.awardStatus == 4 || d.awardStatus == 7) {
                        logId = d.logId
                        setTimeout(() => {
                            if (awardType.value != 2) {
                                money.value = d.money / 100.0
                            } else {
                                money.value = d.money
                            }
                            showPop.value = true
                        }, 500)
                    }
                } else if (d.status == 2) {

                    
                    errMsg.value = d.msg
                    showTip.value = 2
                    showBtnType.value = 2
                } else if (d.status == 5) {


                    showNoStartPop.value = true
                    noStartImg.value = d.tip_img
                } else  {
                    logId = d.logId
                    errMsg.value = d.msg
                    showTip.value = 2
                    showBtnType.value = 3
                }

                if (d.errorLimit) {
                    errorLimit.value = true
                }

                 if (d.manualNum) {
                    manualNum.value = d.manualNum
                }

                if (d.pop_info) {
                    warnShow.value = true
                    warnCountdown.value = 5
                    popInfo.value = d.pop_info
                    popType.value  = 1
                    countdownTimer()
                }



                // console.log(d.status, errMsg.value, showTip.value, showBtnType.value)



                // console.log(response, "===response===")
                // showToast('请求成功！')
               
            } else {
                showBtnType.value = 2
                showTip.value = 2
                errMsg.value = response.data.msg ? response.data.msg :'校验失败'
                // showToast(response.data.msg ? response.data.msg : '比对失败');
                // self.prevent = false;
            }
        })
        .catch(error => {
            showBtnType.value = 3
            showTip.value = 1
            errMsg.value = '校验失败'
            // showToast("比对失败！");
            // showLoading = false;
            // self.prevent = false;
        });
}
function getActivity(adcode) {
 
    proxy.$axios.get(proxy.$config.domain + 'Activity/ReceiptInfo?id=' + aid + '&adcode=' + adcode).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
                document.title = d.title
            }
            if (d.rule_img) {
                ruleImg.value = d.rule_img
            }
            if (d.desc_img) {
                descImg.value = d.desc_img
            }

            if (d.desc_url) {
                descUrl.value = d.desc_url              
            }

            if (d.type == 2) {
                receiptImg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1713977042017.jpeg'
            }

            if (d.award_type) {
                awardType.value = d.award_type
            }

            if (awardType.value == 2) {
                regPacketBg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736788632404.png'
            } else if (awardType.value == 3) {
                regPacketBg.value = 'https://vipimg.ai-xbys.com/saas/img/c8591447/46f869ee/1736788918168.png'
            }

            // console.log(d.status, activityInfoStatus, activityInfoStatus.ActivityInfoStatusMobile)



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
                    router.replace({ name: 'UserReg', query: { id: aid, page: 'ReceiptReceipt', type: aType, 
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '认证成功后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'UserMine', query: { id: aid, page: 'ReceiptReceipt', type: aType } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitAuth) {
                showDialog({
                    message: d.tip_img,
                    showConfirmButton: false,
                })

                return
            } else if  (d.status == activityInfoStatus.ActivityInfoStatusNoStart || 
            d.status == activityInfoStatus.ActivityInfoStatusLimit  || 
            d.status == activityInfoStatus.ActivityInfoStatusDayLimit ) {
                showNoStartPop.value = true
                noStartImg.value = d.tip_img
            } else if (d.status == activityInfoStatus.ActivityInfoStatusEnd){
                showBtnType.value = 7
                if(d.isReceive) {
                    isReceive.value = true
                }
            

            } else {
                if (d.status == activityInfoStatus.ActivityInfoStatusNormal) {
                    showTip.value = 0

                    
                    if (d.awardStatus == 3 || d.awardStatus == 4) {
                        logId = d.logId
                        setTimeout(() => {
                            if (awardType.value != 2) {
                                money.value = d.money / 100.0
                            } else {
                                money.value = d.money
                            }
                            showPop.value = true
                        }, 500)
                    }

                    if (d.errorLimit) {
                        errorLimit.value = true
                    }
                }
                getPolicyToken(null)
            }

            if (d.cservice_url) {
                cservice_url = d.cservice_url
            }

            if (d.limit) {
                limit.value = d.limit
            }

            if (d.warehouse && d.warehouse.warehouse_id) {
                warehouse.value.warehouse_id = d.warehouse.warehouse_id
                warehouse.value.type = d.warehouse.type
            }

            if (d.pop_info) {
                warnShow.value = true
                warnCountdown.value = 5
                popInfo.value = d.pop_info
                if (d.pop_type == 2) {
                    popType.value = 2
                    warnCountdown.value = 8
                } else if (d.pop_type == 3) {
                    popType.value = 3
                    warnCountdown.value = 0
                }
                countdownTimer()
            }


        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试' } })
        }
    })
        .catch(error => {

            console.log(error)
        });
}
function getPolicyToken(fileInfo) {
    proxy.$axios.get(proxy.$config.domain + 'Oss/GetPolicyToken?type=img&id=' + aid, { hideLoading: true }).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            aliyunOssToken = d
            if (fileInfo) {
                uploadFile(fileInfo)
            }

        } else {
            if (fileInfo) {
                showToast('小票上传失败')
            }

        }
    }).catch(error => {
        if (fileInfo) {
            showToast('小票上传失败')
        }
        // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

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
        aType = 'loc'
        GetGeo()
    } else {
        getActivity('')
    }






    // let page = route.query.page
    // if(page && typeof page === 'string') {
    //     routerName = page
    // }

    // startCanvas();

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content {
    padding-bottom: 2rem;
    background: url(../../assets/img/speak/speak-top-bg.png);
    background-size: 100% 8.12rem;
    background-repeat: no-repeat;

    background-color: #f1f1f1;

    .img-content {
        width: 9.2rem;
        background: #FFFFFF;
        border-radius: 0.27rem;
        margin: 0.5rem 0.4rem;
        padding-bottom: 0.8rem;
        .empty {
            height: 0.15rem;
        }

        .receipt-bg {
            margin: 0 1.22rem;
            background: url(../../assets/img/receipt/receipt-bg.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            height: 8.1rem;
            padding: 0.75rem;
            div {
                width: 100%;
                height: 100%;
                background-position: center center;
                margin: auto;
            }
        }

        .tip-div {
            font-size: 0.45rem;
            font-weight: bold;
            color: #333333;
            line-height: 0.55rem;
            margin: 0.3rem auto 0.1rem;
            text-align: center;
        }

        .tip-div.err {
            color:#FF0404;
        }

        .tip-div.suc {
            color: #12CB7B;
        }

         .op-right-item {
            margin-top: 0.25rem;
            font-size: 0.32rem;
            color: #333;
            line-height: 0.49rem;
            margin-right: .5rem;
            margin-bottom: .8rem;
            img {
                margin-bottom: .1rem;
                width: 0.64rem;
            }
        }

        .cService-div {
            margin-top: 0.5rem;
            font-size: 0.48rem;
            font-family: Lantinghei SC;
            font-weight: 600;
            color: #3DB5E6;
            line-height: 0.49rem;
            img {
                margin-right: .1rem;
                width: 0.76rem;
            }
        }

        .title-div-div {
            position: relative;
            
            .title-div {

                font-size: 0.5rem;
                font-weight: bold;
                color: #333333;
                padding:0.3rem 0.5rem;
                background: #FFFFFF;
                border-radius: 0.53rem 0.53rem 0rem 0rem;
                .title-bg {
                    width: 2.17rem;
                    height: 0.13rem;
                    background: #12CB7B;
                    opacity: 0.58;
                    border-radius: 0.05rem;
                    position: absolute;
                    top: 0.75rem;
                    left: 0.5rem;
                }
            }
        }

        .tip-text-div {

            margin: 0 0.5rem;
            .text-div {
                font-size: 0.37rem;
                
                color: #333333;
                line-height: 0.7rem;
                div {
                    width: 7.5rem;
                }
                .num {
                    width: 0.7rem;
                    font-weight: 500;
                    font-family: Gilroy;
                }
                .tip {
                    font-weight: 500;
                    color:#FE8E09;
                }
            }
        }
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


        line-height: 1.1rem;
        font-size: 0.45rem;
        color: #FFFFFF;
        text-align: center;

        .p {
            margin:0.37rem 0.4rem;
            width: 9.2rem;
            height: 1.1rem;
            background: #12CB7B;
            border-radius: 0.27rem;
            position: relative;
        }

        .p.manual {
            margin-left: 0;
            background: #fff;
            border: 2px solid #12CB7B;
            color:#12CB7B;
        }
        .p.end {
            background: #b8b8b8;

        }
    }
    

    
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
.warn-pop {
    .warn-title {
        font-size: 0.46rem;
        margin-top: 0.64rem;
        color:#000;
        svg {
            margin-right: 0.2rem;
            width: 0.46rem;
            height: 0.46rem;
        }
    }
    .warn-info {
        font-size: 0.37rem;
        line-height: 0.6rem;
        color: #383838;
        text-align: left;
        margin: 0 0.64rem;
        margin-top: 0.4rem;
    }
    .warn-confirm-btn {
        font-size: 0.43rem;
        color:#12CB7B;
        line-height: 0.6rem;
        height: 0.6rem;
        width: 5rem;
        margin-top: 0.4rem;
        margin-bottom: 0.6rem;
        text-align: center;
    }
    .warn-confirm-btn.btn-gray {
        color:#b4b3b3;
    }

    .ban-footer {
        height: 1rem;
    }
}
.manual-p-receipt{
        margin:0.3rem 0.4rem;
            width: 9.2rem;
            height: 1rem;
            background: #12CB7B;
            border-radius: 0.27rem;
            position: relative;
            color: #fff;
            line-height: 1rem;
        font-size: 0.42rem;
        text-align: center;
    }
</style>