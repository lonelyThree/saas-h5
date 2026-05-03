<template>
    <div class="main-content">
        

        <div class="reg-bg">
            <div class="top-div">
                <div class="top-info">
                    <div class="top-title">欢迎注册</div>
                    <div class="top-desc">数字化营销服务平台</div>
                </div>
            </div>
            <!-- <div class="top-div-line">
                <div></div>
            </div> -->
            <div class="input-div"  v-if="regInfo.display_type == 1 || regInfo.display_type == 2"> 
                <input 
                name="name"
                v-model.trim="regInfo.name" 
                placeholder="请输入您的姓名"
                maxlength="10"
            > <img src="../../assets/img/mine/input-user-icon.png" />  </div>
            <div class="input-div"  v-if="regInfo.display_type == 1 || regInfo.display_type == 2"> <input 
                name="mobile"
                v-model.trim="regInfo.mobile" 
                placeholder="请输入您的手机号"
                maxlength="11"
            >  <img src="../../assets/img/mine/input-phone-icon.png" /> </div>

            <div class="captcha-div input-div">
                <input 
                v-model.trim="regInfo.captcha" 
                placeholder="请输入右侧验证码"
                maxlength="4"  v-if="regInfo.display_type == 1 || regInfo.display_type == 2"
                >
                <img src="../../assets/img/mine/input-code-icon.png" /> 
                <img class="captcha-img" :src="captchaUrl" alt="点击更换" @click="getPicCaptcha">
            </div>

            <div class="sms-code-div input-div"  v-if="regInfo.display_type == 1 || regInfo.display_type == 2"> 
                <input
                    name="smscode"
                    v-model.trim="regInfo.smscode" 
                    placeholder="请输入短信验证码"
                    maxlength="5" 
                >
                <img src="../../assets/img/mine/input-code-icon.png" /> 
                <div class="code-btn"  @click="sendCode" v-if="!sendTime">获取验证码</div>
                <div class="code-btn gray"   v-else>{{ time +'s再次发送' }}</div>
            </div>

            <div class="chain-div input-div"
                v-if="regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4"> 
                <input 
                    v-model.trim="regInfo.company_name" placeholder="请选择企业" readonly clickable @click="showCompanyPick()"
                    maxlength="20" /> 
                <img src="../../assets/img/mine/input-chain-icon.png" /> 
                <van-icon name="arrow" />
            </div>
            <div class="chain-div input-div" v-if="regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4"> 
                <input  value="二级部门" placeholder="二级部门" readonly maxlength="20">
                <img src="../../assets/img/mine/input-card-icon.png" />
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center">  
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.company_department_id" :options="companyDepartmentTypeOptions" />
                    </van-dropdown-menu>
                </div>
            </div>

             <div class="chain-div input-div" v-if="(regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input  value="身份" placeholder="身份" readonly maxlength="20">
                <img src="../../assets/img/mine/input-card-icon.png" />
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center">
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.company_id_type" :options="companyUserTypeOptions" />
                    </van-dropdown-menu>
                </div>
            </div>

            <!-- <div class="input-div"  v-if="(regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> <input 
                v-model.trim="regInfo.area" 
                placeholder="请输入意向推广区域"
                maxlength="200"
            >  <img src="../../assets/img/mine/input-area-icon.png" /> </div> -->
            <!-- <div>
                <input
                    name
                    v-model.trim="regInfo.chainName" 
                    placeholder="请选择连锁名称"
                    maxlength="20"
                    readonly
                    clickable
                    @click="showPick()"
                >            
            </div> -->


            

             
<!-- 
            <div v-if="_from == 'test'"> <input 
                v-model.trim="regInfo.storeName" 
                placeholder="请输入门店名称"
                maxlength="20"
            > </div> -->

             <div class="submit-btn" @click="submitInfo" v-if="isReg"> 确认注册</div>
            <div class="submit-btn" @click="submitInfo" v-else-if="regInfo.display_type == 1 || regInfo.display_type == 2"> 确认修改</div>
            <div class="submit-btn" @click="submitInfo" v-else> 确认完善信息</div>
            <div  class="question-link"><span class="quesstion-tip">请填写真实信息，否则不能审核通过</span></div>
        </div>
        <van-popup v-model:show="companySelPop" position="bottom" :style="{ height: '70vh' }" @close='closePopUp'>
            <div flex="dir:top main:center" style="height: 70vh;">
                <div>
                    <van-search v-model="companySelKeyword" show-action shape="round" class="search-wrap"
                       placeholder="请输入公司名称或关键词进行搜索" @update:model-value="onCompanyUpdate">
                        <template #action>
                            <div @click="onCompanySearch">搜索</div>
                        </template>
                    </van-search>
                </div>
                <div style="overflow-y: auto;flex: 1;">
                    <van-list v-model:loading="companyLoading" :finished="companyFinished" finished-text="请输入公司名称或关键词进行搜索 "
                        :immediate-check="false">
                        <van-cell v-for="(item, index) in companyList" clickable :key="item.id" :title="item.name"
                            @click="companySelClick(item)">
                        </van-cell>
                        <!-- 自定义没有更多数据时的显示内容 -->
                        <template #finished>
                            <div class="noData">
                                <div class="noData_txt">请输入公司名称或关键词进行搜索</div>
                            </div>
                        </template>
                    </van-list>
                </div>
            </div>
        </van-popup>
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

let routerName = ""
let aType = ""


const regInfo = ref({
    name:'',
    mobile:'',
    captcha:'',
    smscode:'',
    area:'',
    aid:'',

    company_id: 0,
    company_name: '',
    company_department_id: 0,
    company_id_type: 0, // 企业用户身份 1 经理 2 主管 3 业务代表 4 其他

    display_type: 1,
})

const companyUserTypeOptions = ref([
    { text: '经理', value: 1 },
    { text: '主管', value: 2 },
    { text: '业务代表', value: 3 },
    { text: '其他', value: 4 },
]);

const captchaUrl = ref('')
const sendTime = ref(0)
const time = ref(60)
const isReg = ref(true)

const companySelPop = ref(false)
const companySelKeyword = ref('')
const companyLoading = ref(false)
const companyFinished = ref(true)
const companyList = ref([
])

const companyDepartmentTypeOptions = ref([])

let _companySource = null

setToastDefaultOptions({ duration: 1000 });

function getPicCaptcha() {
    proxy.$axios.get(proxy.$config.domain + 'User/Captcha?id=' + regInfo.value.aid, {responseType: 'blob',hideLoading:true}).then(response => {
        
        let blob = new Blob([response.data]);   // 返回的文件流数据
          let url = window.URL.createObjectURL(blob);  // 将他转化为路径
          captchaUrl.value = url  // 将转换出来的路径赋值给变量，其实和上一步结合就可以
        //   console.log(response, blob, url, 'User/Captcha')
    })
        .catch(error => {
            // console.log("getPicCaptcha", error)
        });
}

//验证手机号
function checkMobile() {
    // 校验手机号 true 正确 false 不正确
    let reg = /^1\d{10}$/,
    mobile = regInfo.value.mobile;
    if (!mobile) {
        showToast("请输入手机号");
        return false;
    } else if (!reg.test(mobile)) {
        showToast("请确认手机号码是否输入正确");
        return false;
    }
    return true;
}
// 验证图形验证码
function checkPicCode() {
    let reg = /^\d{4}$/
    if (!regInfo.value.captcha) {
        showToast("请输入图片验证码");
        return false;
    } else if (!reg.test(regInfo.value.captcha)) {
        showToast("请确认图片验证码是否输入正确");
        return false;
    }
    return true;
}
// 验证验证码
function checkCode() {
    let reg = /^\d{5}$/,
    verifyCode = regInfo.value.smscode;
    if (!verifyCode) {
        showToast("请输入短信验证码");
        return false;
    } else if (!reg.test(verifyCode)) {
        showToast("请确认验证码是否输入正确");
        return false;
    }
    
    return true;
}
// 发送验证码
function sendCode() {
    if (sendTime.value) {
        return;
    }
    if (!checkMobile()) {
        return;
    }
    if (!checkPicCode()) {
        return;
    }
    let p = {
        mobile: regInfo.value.mobile,
        captcha: regInfo.value.captcha
    };
    proxy.$axios.post(proxy.$config.domain + "User/SendSmsCode", p)
    .then(response => {
        if (response.data.code === 200) {
        showToast("验证码已发送");
        time.value = 60;
        sendTime.value = window.setInterval(function() {
            if (time.value === 0) {
            window.clearInterval(sendTime.value);
            sendTime.value = 0;
            }
            time.value--;
        }, 1000);
        } else {
            showToast(response.data.msg?response.data.msg:'验证码发送失败');
            setTimeout(()=>{
                getPicCaptcha()
            }, 2000)
        }
    })
    .catch(error => {
        console.log(error)
        showToast("验证码发送失败");
    });
}

// 清除倒计时
function clearTime(){
    if(sendTime.value) {
        window.clearInterval(sendTime.value)
        sendTime.value = 0
    }
   ;
}


 // 绑定手机号确定按钮
function submitInfo() {

    const isCheckBase = regInfo.value.display_type == 1 || regInfo.value.display_type == 2
    const isCheckCompany =  regInfo.value.display_type == 1 || regInfo.value.display_type == 3 || regInfo.value.display_type == 4
    if (!regInfo.value.name.trim() && isCheckBase) {
        showToast("请输入姓名");
        return false;
    }


    if (!regInfo.value.company_id && isCheckCompany ) {
        showToast("请输入选择企业");
        return false;
    }

    if (!regInfo.value.company_department_id && isCheckCompany) {
        showToast("请选择部门");
        return false;
    }

    if (isCheckBase && !checkMobile()) {
        return;
    }
    if (isCheckBase && !checkCode()) {
        return;
    }
    

    // if(!regInfo.value.area.trim() && isCheckCompany) {
    //     showToast("请输入意向推广区域");
    //     return false;
    // }
    

    proxy.$axios.post(proxy.$config.domain + "SalesMan/UpdateInfo", regInfo.value, { toJSON: true}).then(response => {

        if (response.data.code === 200) {
            const d = response.data.data
            isReg.value = false
           
            if (!d.display_type) {
                showToast(d.msg)
                return
            }
            showToast('保存成功！')
            setTimeout(() => {
        

            if (d.display_type == 7 || d.display_type == 6) { 
                if (routerName == "" || routerName == "UserMine") {
                    router.replace({ name: 'SalesmanMine' })
                    return
                }
                router.replace({ name: routerName, query: { 'id': regInfo.value.aid, 'type': route.query.type } })
                return
            }

            regInfo.value.display_type = d.display_type
        }, 1000)
            
        } else {
            showToast(response.data.msg ? response.data.msg : '保存失败');
        
            window.clearInterval(sendTime.value);
            sendTime.value = 0;
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("保存失败！");
        // this.showLoading = false;
        // self.prevent = false;
    });
}


function onLoad() {
//     getChainList()
}

function getUserProfileInfo() {
    proxy.$axios.get(proxy.$config.domain + 'SalesMan/UserProfileInfo').then(response => {
        if (response.data.code === 200) {
            regInfo.value = { ...regInfo.value, ...response.data.data.info }
            regInfo.value.display_type = response.data.data.display_type
            if (regInfo.value.mobile != "") {
                isReg.value = false
            }


            if(regInfo.value.company_id && regInfo.value.company_id > 0) {
                companySelClick({id:regInfo.value.company_id,name:regInfo.value.company_name})
            }

            getPicCaptcha()
        } else {
            getPicCaptcha()
            showToast(response.data.msg ? response.data.msg : '验证码发送失败');
        }
    })
        .catch(error => {
            getPicCaptcha()
            console.log(error)
        });
}

function getCompanyList() {

    if (_companySource) {
        _companySource.cancel('Operation canceled by the user.');
    }
    // 创建一个新的取消令牌源
    _companySource = proxy.$axios.CancelToken.source();
    if (companySelKeyword.value == '') {
        companyFinished.value = true
        companyLoading.value = false
        companyList.value = []
        return
    }
    companyFinished.value = false
    companyLoading.value = true
    // 取消上面的请求
    // if (cancel) {
    //     // cancel();
    // }

    // if (_source) {
    //     _source.cancel('Operation canceled by the user.');
    //   }

    // 创建CancelToken
    //   _source = proxy.$axios.CancelToken.source();

    // loading.value = true
    proxy.$axios.get(proxy.$config.domain + 'SalesMan/CompanyList?name=' + companySelKeyword.value + '&min=', {
        hideLoading: true,
        cancelToken: _companySource.token,
    }).then(response => {
        companyLoading.value = false
        if (response.data.code === 200) {
            const d = response.data.data
            companyList.value = d
            companyFinished.value = true
            companyLoading.value = false
        } else {
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            showToast(response.data.msg ? response.data.msg : '企业获取失败')

        }
    }).catch(error => {
        // loading.value = false
        if (proxy.$axios.isCancel(error)) {
            //   console.log('Request canceled', error.message);
        } else {
            // handle other errors
            //   console.error(error);
        }

        // showToast('连锁获取失败')
        // console.log(error)
        companyLoading.value = false
        companyFinished.value = true
    });
}

function onCompanyUpdate() {
    getCompanyList()
}


function showCompanyPick() {
    companySelPop.value = true
}

function onCompanySearch() {
    companyList.value = []
    getCompanyList()
}
function companySelClick(item) {
    proxy.$axios.get(proxy.$config.domain + "SalesMan/CompanyDepartmentList?company_id=" + item.id)
        .then(response => {
            if (response.data.code === 200) {
                
                regInfo.value.company_id = item.id
                regInfo.value.company_name = item.name
                const d = response.data.data
                companyDepartmentTypeOptions.value = d.map(item => {
                    return {
                        value: item.id,
                        text: item.name
                    }
                })
                if (d.length == 1) {
                    regInfo.value.company_department_id = d[0].id
                }

                companySelPop.value = false
            } else {
                showToast(response.data.msg ? response.data.msg : '二级部门获取失败');
            }
        })
        .catch(error => {
            // console.log(error)
            showToast("二级部门获取失败");
        });
}


onMounted(() => {
    let id = route.query.aid
    if(id && typeof id === 'string') {
        regInfo.value.aid  = id
    }


    getPicCaptcha()
    

    let page = route.query.page
    if(page && typeof page === 'string') {
        routerName = page
    }

    let atype = route.query.atype
    if(atype && typeof atype === 'string') {
        aType = atype
    }

    getUserProfileInfo()
})


onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    padding-bottom: 1.45rem;

    background: #F9FAFA;
}
.main-content.empty{
    background: #fff;
}
.reg-bg {
    width: 10rem;
    // height: 21.28rem;
    min-height: 100vh;

    .top-div {
        background-image: url(../../assets/img/mine/reg-top-bg.png);
        
        // background: linear-gradient(94.83deg, rgba(18, 219, 132, 1) 0%, rgba(0, 174, 255, 1) 100%);
        background-size: 100% 4.91rem;
        // background-color: #FFFFFF;
        background-repeat: no-repeat;
        height: 4.91rem;
        .top-info {
            flex: 1;
            .top-title {
                padding: 1.28rem 0.375rem 0;
                font-weight: 500;
                font-size: 0.59rem;
                color: #FFFFFF;
            }
            .top-desc {
                padding: 0.15rem 0.375rem 0.875rem;
                font-size: 0.51rem;
                color: #FFFFFF;
            }
        }
        margin-bottom: -1.2rem;
    }
    .top-div-line {
        margin-top:-.6rem;
        height: 1rem;
        border-radius: 0.52rem;
        background: #FFFFFF;
        position: relative;
        margin-bottom:-.5rem;
    }
    .input-div {
        position: relative;
        img {
            position: absolute;
            width: 0.5rem;
            height: 0.5rem;
            left: 0.85rem;
            top: 0.6rem;
        }

         .chain-sel-btn-div {
            position: absolute;
            top: 0.25rem;
            right: 1.2rem;

            .chain-sel-btn {
                margin-left: 0.3rem;
                width: 2.29rem;
                height: 0.77rem;
                border-radius: 0.21rem;
                font-size: 0.37rem;
                border: 0.03rem solid #EDF1F5;
                text-align: center;
                line-height: 0.77rem;
            }

            .chain-sel-btn.sel {
                color: #0AC97A;
                border: 0.03rem solid #0AC97A;
            }


        }
    }
    input {
        margin: 0.15rem 0.375rem;
        // height: 1rem;
        // background: url(../../assets/img/btn-bg-reg.png);
        // background-size: 100% 100%;
        font-size: 0.4rem;
        width: 6.8rem;
        padding: 0 1.2rem;
        color: #333333;
        background: #FFFFFF;
        // border: 3px solid #FFB200;
        // border-radius: 0.67rem;
        height: 1.44rem;
        border-radius: 0.21rem;
    }
    input::placeholder {
        color: #999999;
    }
    .captcha-div {
        // position: relative;
        .captcha-img {
            // position: absolute;
            width: 2.4rem;
            // margin-right: 1.6rem;
            font-size: .3rem;
            height: 1rem;
            top: 0.35rem;
            left: auto;
            right: 1rem;
        }
    }
    .sms-code-div {
       
        .code-btn {
            position: absolute;
            width: 3rem;
            height: 1.44rem;
            right: 0;
            top: 0.15rem;
            line-height: 1.44rem;
            font-size: 0.37rem;
        }
        .code-btn.gray {
            color: #aaa;
        }
    }
    .chain-div {
        position: relative;
        i {
            position: absolute;
            right: 0.875rem;
            top: 0.65rem;
            font-size: 0.5rem;
        }
    }
    .submit-btn {
        background: #0AC97A;
        border-radius: 0.27rem;
        margin: .7rem 0.375rem;
        height: 1.33rem;
        font-size: 0.43rem;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.33rem;
    }

    .question-link {
        margin: 0.3rem 0;
        font-size: 0.32rem;
        color: #2A82E4;
        text-align: center;
        span {
            color: #2A82E4;
        }
        .van-checkbox {
            display: flex;
        }
        .quesstion-tip {
            color: #969799;
        }
    }
    
}

</style>

<style>
.van-list__finished-text{
    font-size: 10px;
}
</style>