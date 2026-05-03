<template>
    <div class="main-content">


        <div class="reg-bg">
            <div class="top-div" flex="dir:left main:center cross:center">
                <div class="top-info">
                    <div class="top-title">欢迎注册</div>
                    <div class="top-desc">数字化营销服务平台</div>
                </div>

                <img src="../../assets/img/mine/reg-top-img.png" />
            </div>
            <div class="top-div-line">
                <div></div>
            </div>
            <div class="input-div" v-if="regInfo.display_type == 1 || regInfo.display_type == 2">
                <input  v-model.trim="regInfo.name" placeholder="请输入您的姓名" maxlength="10"> <img
                    src="../../assets/img/mine/input-user-icon.png" />
            </div>
            <div class="chain-div input-div" v-if="userTypeOptions.length > 1 && (regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input value="行业" placeholder="行业" readonly maxlength="20">
                <img src="../../assets/img/mine/input-card-icon.png" />
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center">
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.user_type" :options="userTypeOptions" />
                    </van-dropdown-menu>
                </div>
            </div>
            <div class="chain-div input-div"
                v-if="regInfo.user_type == 1 && (regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input 
                    v-model.trim="regInfo.chain_name" placeholder="请选择连锁" readonly clickable @click="showPick()"
                    maxlength="20" /> 
                <img src="../../assets/img/mine/input-chain-icon.png" /> 
                <van-icon name="arrow" />
            </div>


            <div class="chain-div input-div"
                v-if="regInfo.user_type == 1 && (regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input 
                    v-model.trim="regInfo.store_name" placeholder="请选择门店" readonly clickable @click="showStorePick()"
                    maxlength="20" /> 
                <img src="../../assets/img/mine/input-store-icon.png" /> 
                <van-icon name="arrow" />

            </div>
            

            <div class="chain-div input-div"
                v-if="regInfo.user_type == 2 && (regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input 
                    v-model.trim="regInfo.business_name" placeholder="请选择企业" readonly clickable @click="showBusinessPick()"
                    maxlength="20" /> 
                <img src="../../assets/img/mine/input-chain-icon.png" /> 
                <van-icon name="arrow" />
            </div>
            <div class="chain-div input-div" v-if="regInfo.user_type == 2 && (regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input  value="二级部门" placeholder="二级部门" readonly maxlength="20">
                <img src="../../assets/img/mine/input-card-icon.png" />
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center">  
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.business_department_id" :options="businessDepartmentTypeOptions" />
                    </van-dropdown-menu>
                </div>
            </div>

            <div class="chain-div input-div"
                v-if="regInfo.user_type == 3 && (regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input  v-model.trim="regInfo.clinic_name" placeholder="请输入您的诊所名称" maxlength="100"> 
                <img src="../../assets/img/mine/input-chain-icon.png" />
            </div>

            <div class="chain-div input-div" v-if="(regInfo.display_type == 1 || regInfo.display_type == 3 || regInfo.display_type == 4)"> 
                <input  value="身份" placeholder="身份" readonly maxlength="20">
                <img src="../../assets/img/mine/input-card-icon.png" />
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center" v-if="regInfo.user_type == 1">  
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.type" :options="idTypeOptions" />
                    </van-dropdown-menu>
                </div>
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center" v-else-if="regInfo.user_type == 2">
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.business_id_type" :options="businessUserTypeOptions" />
                    </van-dropdown-menu>
                </div>
                <div class="chain-sel-btn-div" flex="dir:left main:center cross:center" v-else-if="regInfo.user_type == 3">
                    <van-dropdown-menu active-color="#0AC97A">
                        <van-dropdown-item v-model="regInfo.clinic_id_type" :options="clinicUserTypeOptions" />
                    </van-dropdown-menu>
                </div>
            </div>
            <div class="input-div" v-if="regInfo.display_type == 1 || regInfo.display_type == 2 "> 
                <input  v-model.trim="regInfo.mobile"
                    placeholder="请输入您的手机号" maxlength="11">
                <img src="../../assets/img/mine/input-phone-icon.png" />
            </div>

            <div class="captcha-div input-div" v-if="regInfo.display_type == 1 || regInfo.display_type == 2 ">
                <input  v-model.trim="regInfo.captcha" placeholder="请输入右侧验证码" maxlength="4">
                <img src="../../assets/img/mine/input-code-icon.png" />
                <img class="captcha-img" :src="captchaUrl" alt="点击更换" @click="getPicCaptcha">
            </div>

            <div class="sms-code-div input-div" v-if="regInfo.display_type == 1 || regInfo.display_type == 2">
                <input  v-model.trim="regInfo.smscode" placeholder="请输入短信验证码" maxlength="5">
                <img src="../../assets/img/mine/input-code-icon.png" />
                <div class="code-btn" @click="sendCode" v-if="!sendTime">获取验证码</div>
                <div class="code-btn gray" v-else>{{ time + 's再次发送' }}</div>
            </div>

            <div class="submit-btn skip" v-if="regInfo.display_type == 4" @click="skipRegClick">跳过 >></div>

        
            <div class="submit-btn" @click="submitInfo" v-if="isReg"> 确认注册</div>
            <div class="submit-btn" @click="submitInfo" v-else-if="regInfo.display_type == 1 || regInfo.display_type == 2"> 确认修改</div>
            <div class="submit-btn" @click="submitInfo" v-else> 确认完善信息</div>
            
            <div class="question-link" flex="dir:left main:center cross:center">
                <van-checkbox v-model="checked" shape="square" checked-color="#0AC97A" icon-size="0.4rem">我同意
                    <span>《会员隐私政策》</span></van-checkbox>

            </div>
            <div class="question-link" @click="showQuestionPop">注册遇到问题？</div>
            <div class="question-link"><span class="quesstion-tip">请填写真实信息，否则不能审核通过</span></div>
        </div>
        <van-popup v-model:show="chainSelPop" position="bottom" :style="{ height: '70vh' }" @close='closePopUp'>
            <div flex="dir:top main:center" style="height: 70vh;">
                <div>
                    <van-search v-model="selKeyword" show-action shape="round" class="search-wrap"
                        :formatter="formatter" placeholder="请输入搜索关键词" @update:model-value="onUpdate">
                        <template #action>
                            <div @click="onSearch">搜索</div>
                        </template>
                    </van-search>
                </div>
                <div style="overflow-y: auto;flex: 1;">
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有找到想要的，单体店请搜索选择“其它非指定连锁” "
                        :immediate-check="false">
                        <van-cell v-for="(item, index) in chainList" clickable :key="item.id" :title="item.name"
                            @click="chainSelClick(item)">
                        </van-cell>
                        <!-- 自定义没有更多数据时的显示内容 -->
                        <template #finished>
                            <div class="noData">
                                <div class="noData_txt">没有找到想要的，单体店请搜索选择“其它非指定连锁”</div>
                                <div class="question-link" @click="showQuestionPop">注册遇到问题？</div>
                            </div>
                        </template>
                    </van-list>
                </div>
            </div>
        </van-popup>

        <van-popup v-model:show="storeSelPop" position="bottom" :style="{ height: '70vh' }" @close='closeStorePopUp'>
            <div flex="dir:top main:center" style="height: 70vh;">
                <div>
                    <van-search v-model="selStoreKeyword" show-action shape="round" class="search-wrap"
                        :formatter="formatter" placeholder="请输入门店全称，如XX大药房XX店" @update:model-value="onPoiUpdate">
                        <template #action>
                            <div @click="onStoreSearch">搜索</div>
                        </template>
                    </van-search>
                </div>
                <div style="overflow-y: auto;flex: 1;">
                    <van-list v-model:loading="storeLoading" :finished="storeFinished"
                        finished-text="如查询不到门店可搜索选择“其它门店”" :immediate-check="false">
                        <van-cell v-for="(item, index) in storeList" clickable :key="item.uid" :title="item.name"
                            :label="item.address" @click="storeSelClick(item)">
                        </van-cell>
                        <!-- 自定义没有更多数据时的显示内容 -->
                        <template #finished>
                            <div class="noData">
                                <div class="noData_txt">如查询不到门店可搜索选择“其它门店”</div>
                                <div class="question-link" @click="showQuestionPop">注册遇到问题？</div>
                            </div>
                        </template>
                    </van-list>
                </div>
            </div>
        </van-popup>
        <van-popup v-model:show="questionPop" position="bottom" :style="{ height: '80vh' }">
            <iframe src="https://m.ai-xbys.com/app/ldy_common-214-carticle.htm?id=d2d2dc509c812c096f923349ce309e4c"
                scrolling="auto" frameborder="0" id="iframe" width="100%" height="100%"></iframe>
        </van-popup>
        <van-popup v-model:show="businessSelPop" position="bottom" :style="{ height: '70vh' }" @close='closePopUp'>
            <div flex="dir:top main:center" style="height: 70vh;">
                <div>
                    <van-search v-model="businessSelKeyword" show-action shape="round" class="search-wrap"
                        :formatter="formatter" placeholder="请输入公司名称或关键词进行搜索" @update:model-value="onBusinessUpdate">
                        <template #action>
                            <div @click="onBusinessSearch">搜索</div>
                        </template>
                    </van-search>
                </div>
                <div style="overflow-y: auto;flex: 1;">
                    <van-list v-model:loading="businessLoading" :finished="businessFinished" finished-text="请输入公司名称或关键词进行搜索 "
                        :immediate-check="false">
                        <van-cell v-for="(item, index) in businessList" clickable :key="item.id" :title="item.name"
                            @click="businessSelClick(item)">
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

import { onMounted, onBeforeUnmount, ref, getCurrentInstance, proxyRefs } from "vue"

import { jsonp } from 'vue-jsonp'

import tabbar from '../../components/custom_tabbar.vue'
import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()


const regBg = ref("https://wximg.ai-xbys.com/images/global/m46E64gDawH4Et69mwMVe0YwG0TryW.png")
// const 


const aid = ref("")
const routerName = ref("")
const aType = ref("")
const skipAuth = ref(false)
const uid = ref("")
const authType = ref(1)

const isReg = ref(true)

const idTypeOptions = ref([
    { text: '店长', value: 1 },
    { text: '店员', value: 2 },
    { text: '药师', value: 3 },
    { text: '其他', value: 4 },
]);
const businessUserTypeOptions = ref([
    { text: '业务员', value: 1 },
    { text: '开票员', value: 2 },
    { text: '采购员', value: 3 },
    { text: '其他', value: 4 },
]);
const clinicUserTypeOptions = ref([
    { text: '医生', value: 1 },
    { text: '护士', value: 2 },
    { text: '其他', value: 3 },
]);

const userTypeOptions = ref([
    { text: '零售', value: 1 },
    { text: '商业', value: 2 },
    { text: '诊所', value: 3 },
]);

const businessDepartmentTypeOptions = ref([])

const regInfo = ref({
    name: '',
    mobile: '',
    captcha: '',
    smscode: '',
    img: '',
    chain_id: 0,
    chain_name: '',

    adcode: '',
    lat: '',
    lng: '',
    city: '',

    store_adcode: 0,
    store_uid: '',
    store_name: '',

    user_type: 1,
    type: 2,
    business_id_type: 1,
    clinic_id_type: 1,

    uid: '',
    aid: '',

    business_id: 0,
    business_name: '',
    business_department_id: 0,
    clinic_name: '',

    display_type: 1,
})

const checked = ref(false)

const captchaUrl = ref('https://img1.baidu.com/it/u=1070984255,945844267&fm=253&fmt=auto&app=138&f=PNG?w=491&h=236')
const sendTime = ref(0)
const time = ref(60)


const chainSelPop = ref(false)
const selKeyword = ref('')
const loading = ref(false)
const finished = ref(true)

const chainList = ref([
])


const storeSelPop = ref(false)
const selStoreKeyword = ref('')
const storeLoading = ref(false)
const storeFinished = ref(true)

const storeList = ref([
])

const businessSelPop = ref(false)
const businessSelKeyword = ref('')
const businessLoading = ref(false)
const businessFinished = ref(true)
const businessList = ref([
])


const questionPop = ref(false)


let _poiSource = null
let _chainSource = null
let _businessSource = null

setToastDefaultOptions({ duration: 3000 });

const formatter = value => {
    // 逻辑判断
    const reg = /[~!@#$%^&*()_+|}{":?><,./;'[\]\=` 、]|(null)|(NULL)/g
    if (reg.test(value)) {
        showToast('不能输入特殊字符 ~!@#$%^&* \\()_+|}{":?><,./;=]`、[')
    }
    return value.replace(reg, '')
}

function idTypeChangeClick(type) {
    regInfo.value.type = type
}

function getChainList() {

    if (_chainSource) {
        _chainSource.cancel('Operation canceled by the user.');
    }
    // 创建一个新的取消令牌源
    _chainSource = proxy.$axios.CancelToken.source();
    if (selKeyword.value == '') {
        finished.value = true
        loading.value = false
        chainList.value = []
        return
    }
    finished.value = false
    loading.value = true
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
    proxy.$axios.get(proxy.$config.domain + 'User/ChainList?name=' + selKeyword.value + '&min=', {
        hideLoading: true,
        cancelToken: _chainSource.token,
    }).then(response => {
        loading.value = false
        if (response.data.code === 200) {
            const d = response.data.data
            chainList.value = d
            finished.value = true
            loading.value = false
        } else {
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            showToast(response.data.msg ? response.data.msg : '连锁获取失败')

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
        storeLoading.value = false
        storeFinished.value = true
    });
}

function onUpdate() {
    getChainList()
}

function onPoiUpdate() {
    poiSearch()
}


function getBusinessList() {

    if (_businessSource) {
        _businessSource.cancel('Operation canceled by the user.');
    }
    // 创建一个新的取消令牌源
    _businessSource = proxy.$axios.CancelToken.source();
    if (businessSelKeyword.value == '') {
        businessFinished.value = true
        businessLoading.value = false
        businessList.value = []
        return
    }
    businessFinished.value = false
    businessLoading.value = true
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
    proxy.$axios.get(proxy.$config.domain + 'User/BusinessList?name=' + businessSelKeyword.value + '&min=', {
        hideLoading: true,
        cancelToken: _businessSource.token,
    }).then(response => {
        businessLoading.value = false
        if (response.data.code === 200) {
            const d = response.data.data
            businessList.value = d
            businessFinished.value = true
            businessLoading.value = false
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
        businessLoading.value = false
        businessFinished.value = true
    });
}

function onBusinessUpdate() {
    getBusinessList()
}

function getPicCaptcha() {
    proxy.$axios.get(proxy.$config.domain + 'User/Captcha?id=' + aid.value, { responseType: 'blob', hideLoading: true }).then(response => {
        let blob = new Blob([response.data]);   // 返回的文件流数据
        let url = window.URL.createObjectURL(blob);  // 将他转化为路径
        captchaUrl.value = url  // 将转换出来的路径赋值给变量，其实和上一步结合就可以
        //   console.log(response, blob, url, 'User/Captcha')
    })
        .catch(error => {
            // console.log(error)
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
    if(!checked.value) {
        showToast('请先同意会员隐私政策')
        return

    }
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
                sendTime.value = window.setInterval(function () {
                    if (time.value === 0) {
                        window.clearInterval(sendTime.value);
                        sendTime.value = 0;
                    }
                    time.value--;
                }, 1000);
            } else {
                
                
                showToast(response.data.msg ? response.data.msg : '验证码发送失败');
                 setTimeout(() => {
                    getPicCaptcha()
                 }, 1000)
            }
        })
        .catch(error => {
            // console.log(error)
            showToast("验证码发送失败");
        });
}

//获取取消函数和取消令牌
function createCancelToken() {
    const cancelToken = proxy.$axios.CancelToken;
    const source = cancelToken.source();

    return {
        token: source.token,
        cancel: source.cancel
    };
}

// 清除倒计时
function clearTime() {
    if (sendTime.value) {
        window.clearInterval(sendTime.value)
        sendTime.value = 0
    }
    ;
}

// 绑定手机号确定按钮
function submitInfo() {
    const isCheckBase = regInfo.value.display_type == 1 || regInfo.value.display_type == 2
    const isCheckChain =  regInfo.value.display_type == 1 || regInfo.value.display_type == 3 || regInfo.value.display_type == 4
    if (!regInfo.value.name.trim() && isCheckBase) {
        showToast("请输入姓名");
        return false;
    }

    if (!regInfo.value.chain_name.trim() && isCheckChain && regInfo.value.user_type == 1) {
        showToast("请输入选择连锁");
        return false;
    }

    if (!regInfo.value.chain_id && isCheckChain && regInfo.value.user_type == 1) {
        showToast("请输入选择连锁");
        return false;
    }

    if (!regInfo.value.store_name.trim() &&  isCheckChain && regInfo.value.user_type == 1) {
        showToast("请选择门店");
        return false;
    }

    if (!regInfo.value.store_uid && isCheckChain && regInfo.value.user_type == 1) {
        showToast("请选择门店");
        return false;
    }

    if (!regInfo.value.business_id && isCheckChain && regInfo.value.user_type == 2) {
        showToast("请输入选择企业");
        return false;
    }

    if (!regInfo.value.business_department_id && isCheckChain && regInfo.value.user_type == 2) {
        showToast("请选择部门");
        return false;
    }

    if (!regInfo.value.clinic_name.trim() && isCheckChain && regInfo.value.user_type == 3) {
        showToast("请输入诊所名称");
        return false;
    }

    if (isCheckBase && !checkMobile()) {
        return;
    }
    if (isCheckBase && !checkCode()) {
        return;
    }
    if (typeof regInfo.value.store_adcode == 'string') {
        regInfo.value.store_adcode = parseInt(regInfo.value.store_adcode)
    }

    proxy.$axios.post(proxy.$config.domain + "User/UpdateInfo", regInfo.value, { toJSON: true }).then(response => {
        // this.showLoading = false;
        if (response.data.code === 200) {
            const d = response.data.data
            isReg.value = false
           
            if (!d.display_type) {
                showToast(d.msg)
                return
            }
            showToast('保存成功！')
            setTimeout(() => {
            
            if (d.display_type == 6) { 
                goBack()
                return
            }

            if (d.display_type == 7) { 
                goAuth()
                return
            }

            if (d.display_type == 3 && skipAuth.value) { 
                regInfo.value.display_type = 4
            } else {
                regInfo.value.display_type = d.display_type
            }
        }, 1000)
            
        } else {
            showToast(response.data.msg ? response.data.msg : '保存失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("保存失败！");
        // this.showLoading = false;
        // self.prevent = false;
    });
}

function skipRegClick() {
    goBack()
}

function goBack() {
    // setTimeout(() => {
        if (routerName.value == "") {
            router.replace({ name: 'UserCustomer', query: { aid: regInfo.value.aid } })
            return
        } else if (routerName.value == "UserMine") {
            router.replace({ name: 'UserMine' })
            return
        }
        router.replace({ name: routerName.value, query: { 'id': aid.value, 'type': route.query.type } })

    // }
}

function goAuth() {
    if (authType.value == 2) {
        goBack()
        return
    }
    router.replace({ name: 'UserAuth' })
    return
}

function showPick() {
    chainSelPop.value = true
}


function showStorePick() {
    storeSelPop.value = true
}

function showBusinessPick() {
    businessSelPop.value = true
}

function onBusinessSearch() {
    businessList.value = []
    getBusinessList()
}
function businessSelClick(item) {
    proxy.$axios.get(proxy.$config.domain + "User/BusinessDepartmentList?business_id=" + item.id)
        .then(response => {
            if (response.data.code === 200) {
                
                regInfo.value.business_id = item.id
                regInfo.value.business_name = item.name
                const d = response.data.data
                businessDepartmentTypeOptions.value = d.map(item => {
                    return {
                        value: item.id,
                        text: item.name
                    }
                })
                if (d.length == 1) {
                    regInfo.value.business_department_id = d[0].id
                }

                businessSelPop.value = false
            } else {
                showToast(response.data.msg ? response.data.msg : '二级部门获取失败');
            }
        })
        .catch(error => {
            // console.log(error)
            showToast("二级部门获取失败");
        });
}



function onStoreLoad() {
    poiSearch()
}

function onCancel() {
    console.log("cancel")
}

function onSearch() {
    chainList.value = []
    getChainList()
}

function chainSelClick(item) {
    regInfo.value.chain_id = item.id
    regInfo.value.chain_name = item.name
    chainSelPop.value = false
}


function getUserProfileInfo() {
    proxy.$axios.get(proxy.$config.domain + 'User/UserProfileInfo', {
        params: {
            router_name: routerName.value,
            aid: aid.value
        }
    }).then(response => {
        if (response.data.code === 200) {
            regInfo.value = { ...regInfo.value, ...response.data.data.info }
            regInfo.value.display_type = response.data.data.display_type
            if (regInfo.value.mobile != "") {
                isReg.value = false
            }
            userTypeOptions.value = []
            const d = response.data.data

            if (d.business_type == 1) {
                userTypeOptions.value.push({ text: '商业', value: 2 })
                if (regInfo.value.user_type == 0) {
                    regInfo.value.user_type = 2
                }
            }

            if (d.retail_type == 1 || (d.business_type != 1 && d.clinic_type !=  1)) {
                userTypeOptions.value.push({ text: '零售', value: 1 })
                if (regInfo.value.user_type == 0) {
                    regInfo.value.user_type = 1
                }
            }
            if (d.clinic_type == 1) {
                userTypeOptions.value.push({ text: '诊所', value: 3 })
                if (regInfo.value.user_type == 0) {
                    regInfo.value.user_type = 3
                }
            }



            if(regInfo.value.business_id && regInfo.value.business_id > 0) {
                businessSelClick({id:regInfo.value.business_id,name:regInfo.value.business_name})
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


function onLoad() {
    //     getChainList()
}

function onStoreCancel() {
    console.log("cancel")
}

function onStoreSearch() {
    if (selStoreKeyword.value == '') {
        showToast('请先输入关键词')
        return
    }
    storeList.value = []
    poiSearch()
}

function storeSelClick(item) {
    if (item.tag.indexOf('药店') < 0 && item.tag.indexOf('诊所') < 0 && item.tag.indexOf('滋补') < 0 && item.tag.indexOf('门诊') < 0) {
        showToast('请选择药店或者诊所或者门诊或者滋补品店')
        return
    }
    regInfo.value.store_adcode = item.adcode
    regInfo.value.store_uid = item.uid
    regInfo.value.store_name = item.name
    storeSelPop.value = false
}



function showGeoPosition(position) {
    console.log("showGeoPosition", position)
    regInfo.value.adcode = position.adcode
    regInfo.value.lat = position.lat
    regInfo.value.lng = position.lng
    regInfo.value.city = position.city
    // poiSearch()
    getUserProfileInfo()
    // onSearch()

}

function showGeoErr() {
    // alert('定位失败')
    router.replace({ path: '/404', query: { msg: '获取位置失败' } })
}

function GetGeo() {
    var geolocation = new qq.maps.Geolocation('SZOBZ-HGB3J-UZWF6-DJFLD-6YX7F-FGFRR', 'saas')
    // 获取位置信息, ip定位， 非精确定位
    geolocation.getIpLocation(showGeoPosition, showGeoErr)
}

function test(res) {
    console.log(res, '==res==')
}

function toBuildQuery(obj) {
    const searchParams = new URLSearchParams();
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        searchParams.append(key, value);
    });
    return searchParams.toString();
}

function poiSearch() {
    if (_poiSource) {
        console.log('Operation canceled by the user.', _poiSource)
        _poiSource.cancel('Operation canceled by the user.');
    }
    // 创建一个新的取消令牌源
    _poiSource = proxy.$axios.CancelToken.source();
    if (selStoreKeyword.value == '') {
        storeFinished.value = true
        storeLoading.value = false
        storeList.value = []
        return
    }
    storeFinished.value = false
    storeLoading.value = true
    proxy.$axios.get(proxy.$config.domain + 'User/StoreList?' + toBuildQuery({
        query: selStoreKeyword.value,
        region: regInfo.value.city,
        lat: regInfo.value.lat,
        lng: regInfo.value.lng
    }), {
        hideLoading: true,
        cancelToken: _poiSource.token,
    }).then(res => {
        storeLoading.value = false
        storeFinished.value = true
        //  console.log("==poiSearch====poiSearch====", res)
        if (res && res.data.code == 200 && res.data.data) {
            const d = res.data.data
            storeList.value = d
            return
        }

        // console.log('poiSearch===2', res)
        showToast('门店获取失败')
        // console.log('poiSearch===', res)
    }).catch(error => {
        // showToast("保存失败！");
        //  console.log('poiSearch===', error)

        if (proxy.$axios.isCancel(error)) {
            //   console.log('Request canceled', error.message);
        } else {
            // 处理其他错误
            //   console.log(error);
        }
        storeLoading.value = false
        storeFinished.value = true
        // self.prevent = false;
    });

    //http://localhost:5003/place/v2/suggestion?q=%E5%85%BB%E7%94%9F%E5%A0%82%E8%8D%AF&region=%E9%B9%BF%E9%82%91%E5%8E%BF&ak=oZr5my9iZyhZcj8RpGWrfM5nVFGor4Ni&extensions_adcode=true&scope=2&output=json&location=33.86009%2C115.48443&radius=20000000&radius_limit=true&coord_type=gcj02ll&ret_coordtype=gcj02ll&filter=sort_name%3Adistance&page_num=0&page_size=20

    // https://api.map.baidu.com/place/v2/search?city_limit=false&query=%E5%85%BB%E7%94%9F%E5%A0%82&tag=%E8%8D%AF%E5%BA%97&region=%E5%91%A8%E5%8F%A3&ak=oZr5my9iZyhZcj8RpGWrfM5nVFGor4Ni&extensions_adcode=true&scope=2&output=json&page_num=1&page_size=20


    // https://api.map.baidu.com/place/v2/search?query=&region=%E5%91%A8%E5%8F%A3%E5%B8%82&tag=%E5%8C%BB%E7%96%97&ak=oZr5my9iZyhZcj8RpGWrfM5nVFGor4Ni&city_limit=false&extensions_adcode=true&scope=2&output=jsonp&center=33.86009%2C115.48443&coord_type=gcj02ll&ret_coordtype=gcj02ll&filter=sort_name%3Adistance&page_num=1&page_size=20&output=json

    // https://api.map.baidu.com/place/v2/search?query=养生堂&location=33.86009,115.48443&radius=2000000&output=json&ak=oZr5my9iZyhZcj8RpGWrfM5nVFGor4Ni&page_num=1&page_size=20&tag=%E5%8C%BB%E7%96%97

    // https://api.map.baidu.com/place/v2/search?city_limit=false&query=%E5%85%BB%E7%94%9F%E5%A0%82&tag=%E8%8D%AF%E5%BA%97&region=%E5%91%A8%E5%8F%A3&ak=0MX1Q5NDulM8CFsAIrw09DX5wR8SA1UF&extensions_adcode=true&scope=2&output=json&page_num=0&page_size=20

    //    jsonp('https://api.map.baidu.com/place/v2/search', {
    //         query: selStoreKeyword.value,
    //         region: _position.city,
    //         tag:'医疗',
    //         ak: 'oZr5my9iZyhZcj8RpGWrfM5nVFGor4Ni',
    //         city_limit:false,
    //         extensions_adcode:true,
    //         scope:2,
    //         output:'jsonp',
    //         center:_position.lat+','+_position.lng,
    //         coord_type:'gcj02ll',
    //         ret_coordtype:'gcj02ll',
    //         filter:'sort_name:distance',
    //         region_fix:0,
    //         page_num:storePage,
    //         page_size:20

    // //    })

    //     // jsonp('https://apis.map.qq.com/ws/place/v1/suggestion/?filter=category=%E8%8D%AF%E5%BA%97%E8%8D%AF%E6%88%BF',{
    //     //     keyword: selStoreKeyword.value,
    //     //     key: 'SZOBZ-HGB3J-UZWF6-DJFLD-6YX7F-FGFRR',
    //     //     output:'jsonp',
    //     //     location:_position.lat+','+_position.lng,
    //     //     region_fix:0,
    //     //     page_index:storePage,
    //     //     page_size:20
    //     }).then((res) => {

    //         storeLoading.value = false
    //         if (res && res.status == 0) {
    //             const d = res.data
    //             storeList.value = storeList.value.concat(d)
    //             if (d.length < 20) {
    //                 storeFinished.value = true
    //             }
    //             return
    //         }
    //         showToast('门店获取失败')
    //         console.log(res, '==poiSearch==jsonp')
    //     })


}

function closeQuestionPop() {
    questionPop.value = false
}

function showQuestionPop() {
    questionPop.value = true
}




onMounted(() => {

    
    let id = route.query.id
    if (id && typeof id === 'string') {
        aid.value = id
    }

    let reg_type = route.query.reg_type
    if (reg_type == 'skip' ) {
        skipAuth.value = true
    }
    let auth_type = route.query.auth_type
    if (auth_type == '2' ) {
        authType.value = 2
    }

    let page = route.query.page
    if (page && typeof page === 'string') {
        routerName.value = page
    }

    let aTypeQuery = route.query.aType
    if (aTypeQuery && typeof aTypeQuery === 'string') {
        aType.value = aTypeQuery
    }
    if (aType.value == "invite") {
        regInfo.value.aid = proxy.$route.query.aid
        regInfo.value.uid = proxy.$route.query.uid
    }
    GetGeo()
})


onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content {
    padding-bottom: 1.45rem;

    background: #F9FAFA;
}

.main-content.empty {
    background: #fff;
}

.reg-bg {
    width: 10rem;
    // height: 21.28rem;
    min-height: 100vh;

    .top-div {

        background: linear-gradient(94.83deg, rgba(18, 219, 132, 1) 0%, rgba(0, 174, 255, 1) 100%);
        background-size: 100% 6rem;
        background-color: #FFFFFF;
        background-repeat: no-repeat;

        .top-info {
            flex: 1;

            .top-title {
                padding: 0.6rem 0.375rem 0;
                font-weight: 500;
                font-size: 0.52rem;
                color: #FFFFFF;
            }

            .top-desc {
                padding: 0.15rem 0.375rem 0.875rem;
                font-size: 0.42rem;
                color: #FFFFFF;
            }
        }

        img {
            width: 4.5rem;
        }

    }

    .top-div-line {
        margin-top: -.6rem;
        height: 1rem;
        border-radius: 0.52rem;
        background: #FFFFFF;
        position: relative;
        margin-bottom: -.5rem;
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
    .submit-btn.skip { 
        font-size: 0.36rem;
         background: #F9FAFA;
         border: 1px solid #f1f1f1;
         color: #969799;
    }

}

.noData {
    .noData_txt {
        margin-top: 0.3rem;
        font-size: 12px;
        height: 30px;
        line-height: 30px;

    }

    .question-link {
        margin: .2rem 0 .6rem;
        font-size: 0.32rem;
        color: #2A82E4;
        text-align: center;
        line-height: .5rem;
    }
}
</style>

<style>
.van-list__finished-text {
    font-size: 12px;
}
</style>