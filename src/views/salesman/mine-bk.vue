<template>
    <div class="main-content mine-content">
        

        <div class="reg-bg"
            :style="{ backgroundImage: 'url(' + regBg + ')', backgroundSize: '100% 21.28rem', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="top-div"><img src="../../assets/img/address-top.png" /></div>
            <div> <input
                name
                v-model.trim="addressInfo.name" 
                placeholder="收货人姓名（真实姓名）"
                maxlength="10"
            > </div>

            <div> <input
                name
                v-model.trim="addressInfo.idCard" 
                placeholder="身份证号码"
                maxlength="20"
            > </div>

            <div> <input
                name
                v-model.trim="addressInfo.mobile" 
                placeholder="收货人手机号"
                maxlength="11"
            > </div>

            



            <!-- <div class="captcha-div" flex="dir:left main:center cross:center">
                <input
                name
                v-model.trim="addressInfo.captcha" 
                placeholder="请输入右侧验证码"
                maxlength="4">
                <img :src="captchaUrl" alt="点击更换" @click="getPicCaptcha">
            </div>

            <div class="sms-code-div"  flex="dir:left main:center cross:center"> 
                <input
                    name
                    v-model.trim="addressInfo.smscode" 
                    placeholder="请输入短信验证码"
                    maxlength="5"
                >
                <div class="code-btn"  @click="sendCode" v-if="!sendTime">获取验证码</div>
                <div class="code-btn gray"   v-else>{{ time +'s再次发送' }}</div>
            </div> -->


            <div class="area-div"> <input
                name
                v-model.trim="addressInfo.areaInfo" 
                placeholder="省、市、区"
                maxlength="30"
                readonly
                @click="showAreaClick"
            >  <img src="../../assets/img/loc-icon.png" /></div>

            <div class="area-div area-detail-div"> <textarea
                name
                v-model.trim="addressInfo.address" 
                placeholder="请填写收货人详细地址"
                maxlength="50"
                cols="30" rows="10"
            /> <img src="../../assets/img/edit-icon.png" /></div>

            <div class="submit-btn" @click="submitInfo"> 提交</div>

            <div class="tip-div" @click="cServiceClick">
                <van-icon name="warning" color="#EFA52D"/>
                一等奖需要<span class="num-span">联系客服</span>提交信息哦~
            </div>
        </div>
    </div>
    <van-popup
        position="bottom"
        v-model:show="showArea">
        <van-area title="选择收货地址" :area-list="areaList" @confirm="confirmAreaClick" />
    </van-popup>

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


setToastDefaultOptions({ duration: 2000 });

function showAreaClick() {
    showArea.value = true
}

function cServiceClick() {
    if (cservice_url) {
        window.location.replace(cservice_url)
    }
}

function confirmAreaClick(obj) {
    const selectedOptions = obj.selectedOptions
    // console.log("confirmAreaClick",  obj, selectedOptions)
    addressInfo.value.areaDetail.provinceName = selectedOptions[0].text
    addressInfo.value.areaDetail.provinceId = selectedOptions[0].value

    addressInfo.value.areaDetail.cityName = selectedOptions[1].text
    addressInfo.value.areaDetail.cityId = selectedOptions[1].value

    addressInfo.value.areaDetail.countyName = selectedOptions[2].text
    addressInfo.value.areaDetail.countyId = selectedOptions[2].value

    addressInfo.value.areaInfo = addressInfo.value.areaDetail.provinceName + addressInfo.value.areaDetail.cityName + addressInfo.value.areaDetail.countyName

    console.log("confirmAreaClick", addressInfo.value)
    showArea.value= false
}

//验证手机号
function checkMobile() {
    // 校验手机号 true 正确 false 不正确
    let reg = /^1\d{10}$/,
    mobile = addressInfo.value.mobile;
    if (!mobile) {
        showToast("请输入手机号");
        return false;
    } else if (!reg.test(mobile)) {
        showToast("请确认手机号码是否输入正确");
        return false;
    }
    return true;
}

/**
 * 身份证15位编码规则：dddddd yymmdd xx p dddddd：6位地区编码 yymmdd: 出生年(两位年)月日，如：910215 xx:
 * 顺序编码，系统产生，无法确定 p: 性别，奇数为男，偶数为女
 * 
 * 身份证18位编码规则：dddddd yyyymmdd xxx y dddddd：6位地区编码 yyyymmdd:
 * 出生年(四位年)月日，如：19910215 xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女 y: 校验码，该位数值可通过前17位计算获得
 * 
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ] 验证位
 * Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 ) i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
 */
function checkIdCard() {
    let idCard = addressInfo.value.idCard
    if (!idCard) {
        showToast("请输入身份证号码");
        return false;
    }
	// 15位和18位身份证号码的正则表达式
	var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

	// 如果通过该验证，说明身份证格式正确，但准确性还需计算
	if (regIdCard.test(idCard)) {
		return true;
	} else {
        showToast("身份证格式不正确");
		//alert("身份证格式不正确!");
		return false;
	}
}



 // 绑定手机号确定按钮
function submitInfo() {
    if(!addressInfo.value.name.trim()) {
        showToast("请输入姓名");
        return false;
    }
    if(!checkIdCard()) {
        return false;
    }

    if(!checkMobile()) {
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
        // this.showLoading = false;
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
        // this.showLoading = false;
        // self.prevent = false;
    });
    }
function getActivity() {
    // console.log("proxy", process)
    // console.log("domain", proxy.$config.domain)
    proxy.$axios.get(proxy.$config.domain + 'Activity/GetInfo?type=index&id='+aid).then(response => {
        console.log(response)
        if (response.data.code === 200) {

            const d = response.data.data
            
            if(d.ask_status == 10) {
                router.replace({name: routerName, query:{'id':aid}})
            } else if(d.ask_status != 9) {
                router.replace({ path: '/404', query: { msg:'未中奖， 不需要填写收货地址' } })
            }

            if (d.cservice_url) {
                cservice_url = d.cservice_url
            }
            


            

        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

onMounted(() => {
    

    // getActivity()



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
    background: linear-gradient( 360deg, rgba(7,122,217,0.18) 0%, rgba(48,227,152,0.18) 100%), #FFFFFF;
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
</style>