<template>
    <div class="main-content vote-reg">

        <div>
            <!-- 定位 -->
            <van-cell-group >
               <van-field
               type="textarea"
               v-model="regInfo.addr"
               readonly
               label="当前位置"
               placeholder="正在定位"
               />

            </van-cell-group>

        </div>
        
        <div>
            <!-- 案例名称 -->
            <van-cell-group >
                <van-field
               v-model="regInfo.store_name"
               readonly
               label="当前门店"
               placeholder="正在定位"
               v-if="regInfo.checkin_id"
               />
               <van-field
  v-model="regInfo.store_name"
  is-link
  readonly
  name="picker"
  label="选择门店"
  placeholder="点击选择门店"
  v-else
  @click="storeSelPop = true"
/>
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
                            </div>
                        </template>
                    </van-list>
                </div>
            </div>
        </van-popup>
            </van-cell-group>
        </div>

        <div v-for="item in regList" :key="item.id">

            <!-- 案例名称 -->
            <van-cell-group v-if="item.type == 3">
                <van-field v-model="item.answer" :label="item.title" placeholder="请输入内容">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}</span>
                    </template>
                </van-field>
            </van-cell-group>

            <!-- 案例描述 -->
            <van-cell-group v-else-if="item.type == 4">
                <van-cell :title="item.title">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}</span>
                    </template>
                </van-cell>
                <van-field v-model="item.answer" label="" type="textarea" rows="4" autosize placeholder="请输入内容，不限数字">
                </van-field>
            </van-cell-group>


            <!-- 上传图片 -->
            <van-cell-group v-else-if="item.type == 5">
                <van-cell :title="item.title">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}</span>
                    </template>
                </van-cell>

                <div class="upload-wrapper">
                    <van-uploader v-model="item.answer" :max-size="20 * 1024 * 1024" :after-read="afterReadImage"
                        :max-count="10" preview-size="3.9rem" @oversize="onImgOversize">
                        <div class="upload-box">
                            <van-icon name="plus" size="24" />
                            <span>最大支持20M</span>
                        </div>
                    </van-uploader>
                </div>
            </van-cell-group>


            <van-cell-group v-else-if="item.type == 2">
                <van-cell :title="item.title">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}</span>
                    </template>
                </van-cell>
                <van-field name="checkboxGroup" label="">
                    <template #input>
                        <van-checkbox-group v-model="item.answer" direction="horizontal" checked-color="#0AC97A">
                            <van-checkbox class="checkbox-item" :name="answer" shape="square" v-for="answer in item.answers" :key="answer">{{
                                answer }}</van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
            </van-cell-group>

            <van-cell-group v-else-if="item.type == 1">
                <van-cell :title="item.title">
                    <template #right-icon>
                        
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}</span>
                    </template>
                </van-cell>
                <van-field name="radio" label="">
                    <template #input>
                        <van-radio-group v-model="item.answer" direction="horizontal"  checked-color="#0AC97A">
                            <van-radio class="radio-item" :name="answer" v-for="answer in item.answers" :key="answer">{{ answer
                                }}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
            </van-cell-group>







            <!-- 上传视频 -->
            <van-cell-group v-else-if="item.type == 6">
                <van-cell :title="item.title">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}</span>
                    </template>
                </van-cell>

                <div class="video-wrapper">
                    <van-uploader v-model="item.answer.video" accept="video/*" :max-size="200 * 1024 * 1024"
                        :max-count="1" :after-read="afterReadVideo" @oversize="onVideoOversize">
                        <div class="video-box dashed">
                            <van-icon name="play-circle-o" size="26" />
                            <div>添加视频</div>
                            <div class="tip">最大支持200M</div>
                        </div>
                    </van-uploader>

                    <div class="video-box dashed video-cover">
                        <div class="upload-wrapper">
                            <van-uploader v-model="item.answer.img" :max-size="20 * 1024 * 1024"
                                :after-read="afterReadImage" :max-count="1" preview-size="2.5rem"
                                @oversize="onImgOversize">
                                <div class="upload-box">
                                    <van-icon name="plus" size="24" />
                                    <span>点击选择封面</span>
                                </div>
                            </van-uploader>
                        </div>
                    </div>
                </div>
            </van-cell-group>



            <div class="empty-div"></div>
        </div>

        <!-- <div class="submit-btn disabled" disabled>已报名成功</div> -->

        <div class="submit-btn" @click="submitInfo"> {{regInfo.checkin_id ? '离店打卡' : '到店打卡'}} </div>


        <van-popup v-model:show="showNoStartPop" class="red-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg" />
    </van-popup>
    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"
import { uploadToOSS } from '../../js/utils/ossUpload'


import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showDialog, showConfirmDialog } from "vant";
import { activityInfoStatus } from '@/constants/ActivityInfoStatus'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()


const aid = ref("")
const aType = ref(1)

const showNoStartPop=ref(false)
const noStartImg = ref('')


const storeSelPop = ref(false)
const selStoreKeyword = ref('')
const storeLoading = ref(false)
const storeFinished = ref(true)

const storeList = ref([
])
let _poiSource = null





const regList = ref([
    {
        answers: [],
        id: '',
        title: '',
        public_type: 1,
        require_type: 2,
        type: 1
    }

])


const regInfo = ref({
    aid: '',

    adcode: 0,
    lat: 0,
    lng: 0,
    city: '',

    store_adcode: 0,
    store_uid: '',
    store_name: '',
    store_lat: 0,
    store_lng: 0,

    checkin_id: '',
    addr: '',

    answers: {},

    is_force: 2, 
})

const formatter = value => {
    // 逻辑判断
    const reg = /[~!@#$%^&*()_+|}{":?><,./;'[\]\=` 、]|(null)|(NULL)/g
    if (reg.test(value)) {
        showToast('不能输入特殊字符 ~!@#$%^&* \\()_+|}{":?><,./;=]`、[')
    }
    return value.replace(reg, '')
}


setToastDefaultOptions({ duration: 3000 });

const onImgOversize = () => {
    showToast('图片大小不能超过20M')
}

const onVideoOversize = () => {
    showToast('视频大小不能超过200M')
}

const selectCover = () => {
    showToast('选择视频封面')
}


const afterReadImage = async (file) => {
    // console.log('获取新的', file.name, regList.value)
    file.status = 'uploading'
    file.message = '上传中 0%'

    try {
        const url = await uploadToOSS(file.file, {
            dir: `vote-img`,
            dirs: ['vote-img', 'vote-video'],
            domain: proxy.$config.domain,
            onProgress: (p) => {
                file.message = `上传中 ${p}%`
            }
        })
        file.status = 'done'
        file.url = url
        file.content = ''
    } catch (e) {
        // console.log(e)
        file.status = 'failed'
        file.message = '上传失败'
    }
}

const afterReadVideo = async (file) => {
    file.status = 'uploading'
    file.message = '上传中 0%'

    try {
        const url = await uploadToOSS(file.file, {
            dir: `vote-video`,
            dirs: ['vote-img', 'vote-video'],
            domain: proxy.$config.domain,
            onProgress: (p) => {
                file.message = `上传中 ${p}%`
            }
        })

        file.status = 'done'
        file.url = url
        file.content = ''
    } catch (e) {
        console.log(e)
        file.status = 'failed'
        file.message = '上传失败'
    }
}

// 绑定手机号确定按钮
function submitInfo() {
    saveInfo(2)
}


// 绑定手机号确定按钮
function saveInfo(is_force) {
    if (regInfo.value.lat == '' || regInfo.value.lng == '') {
        showToast('请先等待位置信息获取')
        return
    }
    if (regInfo.value.store_name == '') {
        showToast('请选择门店')
        return
    }
    let submitValue = {}
    for (let i = 0; i < regList.value.length; i++) {
        const item = regList.value[i];
        if (item.type == 1) { // 单选
            if (item.require_type == 1 && (!item.answer || !item.answer.trim())) {
                showToast("请先选择" + item.title);
                return false;
            }
            if (item.answer && item.answer.trim()) {
                submitValue[item.id] = [item.answer]
            }
        } else if (item.type == 2) { // 多选
            if (item.require_type == 1 && (!item.answer || item.answer.length < 1)) {
                showToast("请至少选择一项" + item.title);
                return false;
            }
            if (item.answer && item.answer.length > 0) {
                submitValue[item.id] = [...item.answer] // 确保返回的是字符串数组
            }
        } else if (item.type == 3) { // 文本输入
            if (item.require_type == 1 && (!item.answer || !item.answer.trim())) {
                showToast("请输入" + item.title);
                return false;
            }
            if (item.answer && item.answer.trim()) {
                submitValue[item.id] = [item.answer]
            }
        } else if (item.type == 4) { // 文本域
            if (item.require_type == 1 && (!item.answer || !item.answer.trim())) {
                showToast("请输入" + item.title);
                return false;
            }
            if (item.answer && item.answer.trim()) {
                submitValue[item.id] = [item.answer]
            }
        } else if (item.type == 5) { // 图片上传
            if (item.require_type == 1 && (!item.answer || item.answer.length === 0)) {
                showToast("请上传" + item.title);
                return false;
            }
            if (item.answer && item.answer.length > 0) {
                const urls = item.answer.filter(file => file.url).map(file => file.url);
                submitValue[item.id] = urls
            }
        } else if (item.type == 6) { // 视频上传
            if (item.require_type == 1) { // 必填：验证视频和封面都存在
                if (!item.answer.video || item.answer.video.length === 0
                    || !item.answer.img || item.answer.img.length === 0) {
                    showToast("请上传" + item.title);
                    return false;
                }
            } else { // 非必填：如果有视频，则必须有封面
                if (item.answer.video && item.answer.video.length > 0) { // 如果有视频
                    if (!item.answer.img || item.answer.img.length === 0) { // 检查是否有封面
                        showToast("请上传视频封面");
                        return false;
                    }
                }
            }

            // 只有当视频和封面都存在时才添加到提交数据中
            if (item.answer && item.answer.video && item.answer.video.length > 0 && item.answer.img && item.answer.img.length > 0) {
                const videoUrl = item.answer.video[0].url;
                const coverUrl = item.answer.img[0].url;
                submitValue[item.id] = [videoUrl, coverUrl]
            }
        }
        // console.log('item', item);
        // if (item.type == 1) {
        //     if (!item.answer.trim()) {
        //         showToast("请输入" + item.title);
        //         return false;
        //     }
        // } else if (item.type == 2) {
        //     if (!item.answer.trim()) {
        //         showToast("请输入" + item.title);
        //     }
        // }
    }
    regInfo.value.answers = submitValue
    regInfo.value.aid = aid.value
    regInfo.value.is_force = is_force



    proxy.$axios.post(proxy.$config.domain + "Counter/CheckinSave", regInfo.value, { toJSON: true }).then(response => {
        // this.showLoading = false;
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.display_type == 2) {
                showConfirmDialog({
                    message: d.msg,
                    confirmButtonText:'异常打卡',
                }).then(() => {
                    saveInfo(1)
                }) .catch(() => {
    // on cancel
  });
                return
            } else if (d.display_type == 3) {
                showDialog({
                    message: d.msg,
                    confirmButtonText:'确定',
                }).then(() => {
                    goCounterCounter()
                });
                return
            } else if (d.display_type == 1) {
                showDialog({
                    message: d.msg,
                    confirmButtonText:'确定',
                }).then(() => {
                    goCounterResult()
                });
                return
            }
            showToast(d.msg)

            goCounterCounter()

        } else {
            showToast(response.data.msg ? response.data.msg : '打卡失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("打卡失败！");
        // this.showLoading = false;
        // self.prevent = false;
    });
}


function getRegInfo() {
    proxy.$axios.get(proxy.$config.domain + 'Counter/CheckCheckinInfo?id=' + aid.value).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data

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
                    router.replace({ name: 'SalesmanReg', query: { id: aid.value, page: 'CounterCheckin', type: aType.value,
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '审核通过后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'SalesmanMine', query: { id: aid.value, page: 'CounterCheckin', type: aType.value } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitAuth) {
                showDialog({
                    message: d.tip_img,
                    showConfirmButton: false,
                })

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitChain) {
                showDialog({
                    message: '仅限指定连锁参加，你暂未获得活动参与权限！',
                    confirmButtonText: '去学习中心',
                }).then(() => {
                    router.replace({ name: 'CounterIndex' })
                });

                return
            }   else if (d.status == 3 || d.status == 5 || d.status == 6) {
                showNoStartPop.value = true
                noStartImg.value = d.tip_img
            } else {
            }


            if (d.checkin_id) {
                regInfo.value.checkin_id = d.checkin_id
                regInfo.value.store_name = d.store_name
                regInfo.value.store_uid = d.store_uid
            }
            
            regList.value = response.data.data.topic_list
        } else {
            router.replace({ path: '/404', query: { msg:response.data.msg ? response.data.msg : '请求失败'} })
        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })
        });
}



function showGeoPosition(position) {
    regInfo.value.adcode = parseInt(position.adcode)
    regInfo.value.lat = position.lat
    regInfo.value.lng = position.lng
    regInfo.value.city = position.city
    regInfo.value.addr = position.addr
    // poiSearch()
    getRegInfo()
};

function showGeoErr() {
    // alert('定位失败')
    router.replace({ path: '/404', query: { msg: '获取位置失败' } })
};

function GetGeo() {
    var geolocation = new qq.maps.Geolocation('SZOBZ-HGB3J-UZWF6-DJFLD-6YX7F-FGFRR', 'saas')
    // 获取位置信息, ip定位， 非精确定位
    geolocation.getLocation(showGeoPosition, showGeoErr,
        {
          // 可选配置项
          timeout: 10000,          // 超时时间（毫秒）
          failTipFlag: true,       // 是否显示定位失败提示
        })
}

function onPoiUpdate() {
    poiSearch()
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
    console.log(item)
    regInfo.value.store_adcode = parseInt(item.adcode)
    regInfo.value.store_uid = item.uid
    regInfo.value.store_name = item.name
    regInfo.value.store_lat = item.location.lat
    regInfo.value.store_lng = item.location.lng
    storeSelPop.value = false
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


}

function toBuildQuery(obj) {
    const searchParams = new URLSearchParams();
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        searchParams.append(key, value);
    });
    return searchParams.toString();
}

function goCounterResult() { 
    setTimeout(() => {
        router.replace({
        name: 'CounterResult', query: {
            id: regInfo.value.checkin_id,
            type: 'loc',
                    }
        })
    }, 100)
}

function goCounterCounter() { 
    setTimeout(() => {
        router.replace({
        name: 'CounterCounter', query: {
            id: aid.value,
            type: 'loc',
                    }
        })
    }, 1000)
}


onMounted(() => {
    let id = route.query.id
    if (id && typeof id === 'string') {
        aid.value = id
    }

    let ctype = route.query.type
    if (ctype && ctype == '2') {
        aType.value = 2
    }
    console.log('ctype', ctype, aType.value);

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

.vote-reg {
    width: 10rem;
    // height: 21.28rem;
    min-height: 100vh;
    background: #F7F7F7;
    padding: 0.375rem 0.375rem 1.5rem 0.375rem;

    // van-cell-group {
    //     margin: 0.0125rem;
    // }
    .empty-div {
        height: 0.4rem;

    }

    .field-tip {
        font-size: 0.32rem;
        color: #999;
    }

    .field-tip.required {
        color: #0AC97A;
    }

    .upload-wrapper {
        padding: 0.32rem;
        background: #FFF;
    }

    .upload-box {
        width: 2.6rem;
        height: 2.6rem;
        background: #f2f3f5;
        border-radius: 0.16rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #999;
        font-size: 0.32rem;
    }

    .video-wrapper {
        display: flex;
        gap: 0.32rem;
        padding: 0.32rem;
        background: #FFF;
    }

    .video-box {
        flex: 1;
        height: 3.2rem;
        width: 5rem;
        min-width: 5rem;
        border-radius: 0.16rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 0.34rem;
        color: #666;
    }

    .video-box.dashed {
        border: 1px dashed #ccc;
        padding: .2rem;
    }

    .video-box.video-cover {
        width: 3rem;
        flex: 0;
        min-width: 3rem;
    }

    .video-box .tip {
        font-size: 0.32rem;
        color: #999;
        margin-top: 4px;
    }

    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0.32rem;
        background: #fff;
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

    .submit-btn.disabled {
        background: #BBB;

    }
    .checkbox-item {
        margin-bottom: 0.5rem;
        margin-right: 0.5rem;
    }
    .radio-item {
        margin-bottom: 0.5rem;
        margin-right: 0.5rem;
    }




}
</style>