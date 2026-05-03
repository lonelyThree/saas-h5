<template>
    <div class="main-content">
        

        <div class="reg-bg"
            :style="{ backgroundImage: 'url(' + regBg + ')', backgroundSize: '100% 21.28rem', backgroundRepeat: 'no-repeat' }">
            <div class="empty"></div>
            <div class="top-div"><img src="../../assets/img/reg-top.png" /></div>
            <div> <input
                name
                v-model.trim="regInfo.name" 
                placeholder="请输入您的姓名"
                maxlength="10"
            > </div>
            <div> <input
                name
                v-model.trim="regInfo.mobile" 
                placeholder="请输入您的手机号"
                maxlength="11"
            > </div>

            <div class="captcha-div" flex="dir:left main:center cross:center">
                <input
                name
                v-model.trim="regInfo.captcha" 
                placeholder="请输入右侧验证码"
                maxlength="4">
                <img :src="captchaUrl" alt="点击更换" @click="getPicCaptcha">
            </div>

            <div class="sms-code-div"  flex="dir:left main:center cross:center"> 
                <input
                    name
                    v-model.trim="regInfo.smscode" 
                    placeholder="请输入短信验证码"
                    maxlength="5"
                >
                <div class="code-btn"  @click="sendCode" v-if="!sendTime">获取验证码</div>
                <div class="code-btn gray"   v-else>{{ time +'s再次发送' }}</div>
            </div>
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


            <div class="chain-div"> <input
                name
                v-model.trim="regInfo.chain_name" 
                placeholder="请选择连锁"
                readonly
                clickable
                @click="showPick()"
                maxlength="20"
            > <van-icon name="arrow" /></div>


             <div class="chain-div" > <input
                name
                v-model.trim="regInfo.store_name" 
                placeholder="请选择门店"
                readonly
                clickable
                @click="showStorePick()"
                maxlength="20"
            > <van-icon name="arrow" /></div>

             <div class="question-link" @click="showQuestionPop">注册遇到问题？</div>
<!-- 
            <div v-if="_from == 'test'"> <input
                name
                v-model.trim="regInfo.storeName" 
                placeholder="请输入门店名称"
                maxlength="20"
            > </div> -->

            <div class="submit-btn" @click="submitInfo"> 提交</div>
        </div>
         <van-popup v-model:show="chainSelPop" position="bottom" :style="{ height: '70vh' }" @close='closePopUp'>
            <div  flex="dir:top main:center" style="height: 70vh;"> 
                <div>
                    <van-search
                        v-model="selKeyword"
                        show-action
                        shape="round"
                        class="search-wrap"
                        :formatter="formatter"
                        placeholder="请输入搜索关键词"
                        @update:model-value="onUpdate"
                    >
                        <template #action>
                            <div @click="onSearch">搜索</div>
                        </template>
                    </van-search>
                </div>
                <div style="overflow-y: auto;flex: 1;">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有找到想要的，单体店请搜索选择“其它非指定连锁” "
                        :immediate-check="false"
                        >
                        <van-cell
                            v-for="(item, index) in chainList"
                            clickable
                            :key="item.id"
                            :title="item.name"
                            @click="chainSelClick(item)"
                            >
                        </van-cell>
                    </van-list>
                </div>
            </div>
        </van-popup>

         <van-popup v-model:show="storeSelPop" position="bottom" :style="{ height: '70vh' }" @close='closeStorePopUp'>
            <div  flex="dir:top main:center" style="height: 70vh;"> 
                <div>
                    <van-search
                        v-model="selStoreKeyword"
                        show-action
                        shape="round"
                        class="search-wrap"
                        :formatter="formatter"
                        placeholder="请输入搜索关键词"
                        @update:model-value="onPoiUpdate"
                    >
                        <template #action>
                            <div @click="onStoreSearch">搜索</div>
                        </template>
                    </van-search>
                </div>
                <div style="overflow-y: auto;flex: 1;">
                    <van-list
                        v-model:loading="storeLoading"
                        :finished="storeFinished"
                        finished-text="查找不到想要的，可以把所在地区的名称放在前面；药店或者药房放后面"
                        :immediate-check="false"
                        >
                        <van-cell
                            v-for="(item, index) in storeList"
                            clickable
                            :key="item.uid"
                            :title="item.name"
                            :label="item.address"
                            @click="storeSelClick(item)"
                            >
                        </van-cell>
                    </van-list>
                </div>
            </div>
        </van-popup>
        <van-popup v-model:show="questionPop" position="bottom" :style="{ height: '80vh' }"  >
            <iframe src="https://m.ai-xbys.com/app/ldy_common-214-carticle.htm?id=d2d2dc509c812c096f923349ce309e4c" scrolling="auto" frameborder="0" id="iframe" width="100%" height="100%"></iframe>
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


let aid = ""
let routerName = ""
let aType = ""


const regInfo = ref({
    name:'',
    mobile:'',
    captcha:'',
    smscode:'',
    img:'',
    chain_id:0,
    chain_name:'',

    adcode:'',
    lat:'',
    lng:'',
    city:'',

    store_adcode:'',
    store_uid:'',
    store_name:'',

})

const captchaUrl = ref('')
const sendTime = ref(0)
const time = ref(60)


const chainSelPop = ref(false)
const selKeyword=ref('')
const loading = ref(false)
const finished = ref(true)

const chainList = ref([
])


const storeSelPop = ref(false)
const selStoreKeyword=ref('')
const storeLoading = ref(false)
const storeFinished = ref(true)

const storeList = ref([
])


const questionPop = ref(false)


let _poiSource = null
let _chainSource = null

setToastDefaultOptions({ duration: 2000 });

const formatter = value => {
    // 逻辑判断
    const reg = /[~!@#$%^&*()_+|}{":?><,./;'[\]\=` 、]|(null)|(NULL)/g
    if (reg.test(value)) {
        showToast('不能输入特殊字符 ~!@#$%^&* \\()_+|}{":?><,./;=]`、[')
    }
    return value.replace(reg, '')
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
    proxy.$axios.get(proxy.$config.domain + 'User/ChainList?name='+ selKeyword.value+'&min=', {
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

function getPicCaptcha() {
    proxy.$axios.get(proxy.$config.domain + 'User/Captcha?id=' + aid, {responseType: 'blob',hideLoading:true}).then(response => {
        let blob = new Blob([response.data]);   // 返回的文件流数据
          let url = window.URL.createObjectURL(blob);  // 将他转化为路径
          captchaUrl.value = url  // 将转换出来的路径赋值给变量，其实和上一步结合就可以
        //   console.log(response, blob, url, 'User/Captcha')
    })
        .catch(error => {
            console.log(error)
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
            getPicCaptcha()
            showToast(response.data.msg?response.data.msg:'验证码发送失败');
        }
    })
    .catch(error => {
        console.log(error)
        showToast("验证码发送失败");
    });
}

//获取取消函数和取消令牌
function  createCancelToken() {
      const cancelToken = proxy.$axios.CancelToken;
      const source = cancelToken.source();

      return {
        token: source.token,
        cancel: source.cancel
      };
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
    if(!regInfo.value.name.trim()) {
        showToast("请输入姓名");
        return false;
    }

    if(!regInfo.value.chain_name.trim()) {
        showToast("请输入选择连锁");
        return false;
    }

    if (!regInfo.value.chain_id) {
        showToast("请输入选择连锁");
        return false;
    }

    if(!regInfo.value.store_name.trim()) {
        showToast("请选择门店");
        return false;
    }

    if (!regInfo.value.store_uid) {
        showToast("请选择门店");
        return false;
    }

    if (!checkMobile()) {
        return;
    }
    if (!checkCode()) {
        return;
    }
    

    proxy.$axios.post(proxy.$config.domain + "User/UpdateInfo", regInfo.value, { toJSON: true}).then(response => {
        // this.showLoading = false;
        if (response.data.code === 200) {
            showToast('保存成功！')
            setTimeout(()=> {
                if (routerName == "") {
                    router.replace({ path: '/404', query: { msg: '保存成功' } })
                    return
                }
                router.replace({ name: routerName, query: { 'id': aid, 'type': route.query.type } })
                
                // self.$router.replace({name: 'BaseInfo'})
            }, 1000)
        } else {
            showToast(response.data.msg?response.data.msg:'保存失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("保存失败！");
        // this.showLoading = false;
        // self.prevent = false;
    });
}

function showPick() {
    chainSelPop.value = true
}


function showStorePick() {
    storeSelPop.value = true
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
    if (item.tag.indexOf('药店') < 0) {
        showToast('请选择药店')
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
    getPicCaptcha()
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

//    var url = "http://api.map.baidu.com/place/v2/search?query=ATM机&tag=银行&region=北京&output=json&ak=F552bedbee2ec8fa6bae7b7a08201&callback=callback";

//             $.ajax({
//                 type: "get",
//                 async: false,
//                 url: url,
//                 dataType: "jsonp",
//                 jsonp: "callback",
//                 jsonpCallback: "callback",
//                 success: function (data) {
//                     var json = JSON.stringify(data);
//                     console.log(json);
//                 },
//                 error: function (err) {
//                     console.log(err);
//                 }
//             });
//radius_limit
// console.log(selStoreKeyword, '==selStoreKeyword===selStoreKeyword')
//    proxy.$axios.get('/place/v2/suggestion?'+toBuildQuery({
//         q: selStoreKeyword.value,
//         region: _position.city,
//         // tag:'药店',
//         ak: 'oZr5my9iZyhZcj8RpGWrfM5nVFGor4Ni',
//         city_limit:false,
//         extensions_adcode:true,
//         scope:2,
//         output:'json',
//         // center:_position.lat+','+_position.lng,
//         location:_position.lat+','+_position.lng,
//         // radius:20000000,
//         // radius_limit:false,
//         coord_type:'gcj02ll',
//         ret_coordtype:'gcj02ll',
//         // filter:'sort_name:distance',
//         page_num:0,
//         page_size:20}), { hideLoading: true,cancelToken: _poiSource.token})
    proxy.$axios.get(proxy.$config.domain + 'User/StoreList?'+toBuildQuery({
        query: selStoreKeyword.value,
        region: regInfo.value.city,
        lat:regInfo.value.lat,
        lng:regInfo.value.lng}), {
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
    
    GetGeo()
    let id = route.query.id
    if(id && typeof id === 'string') {
        aid = id
    }

    let page = route.query.page
    if(page && typeof page === 'string') {
        routerName = page
    }

    let atype = route.query.atype
    if(atype && typeof atype === 'string') {
        aType = atype
    }
})


onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    // padding-bottom: 1.45rem;

    background: #fff6e1;
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
    input {
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
    input::placeholder {
        color: #999999;
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
    .chain-div {
        position: relative;
        i {
            position: absolute;
            right: 1.9rem;
            top: 0.4rem;
            font-size: 0.5rem;
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

    .question-link {
        margin: 0.3rem 1.8rem;
        color: #0b24f9;
        font-size: 0.4rem;
    }
    
}

</style>

<style>
.van-list__finished-text{
    font-size: 10px;
}
</style>