<template>
    <div class="main-content vote-reg">
        <div v-if="regVoteInfo.name_type == 1 || regVoteInfo.name_type == 2">
            <!-- 案例名称 -->
            <van-cell-group >
                <van-field v-model="voteInfo.name" label="案例名称" placeholder="请输入内容">
                    <template #right-icon>
                        <span class="field-tip required">{{ regVoteInfo.name_type == 1 ? '必填' : '选填' }}/公开</span>
                    </template>
                </van-field>
            </van-cell-group>
        </div>
        <div v-if="regVoteInfo.info_type == 1 || regVoteInfo.info_type == 2">

            <!-- 案例描述 -->
            <van-cell-group>
                <van-cell title="案例说明">
                    <template #right-icon>
                        <span class="field-tip required">{{ regVoteInfo.info_type == 1 ? '必填' : '选填' }}/公开</span>
                    </template>
                </van-cell>
                <van-field v-model="voteInfo.info" label="" type="textarea" rows="4" autosize placeholder="请输入内容，不限数字">
                </van-field>
            </van-cell-group>

        </div>
        <div v-if="regVoteInfo.img_type == 1 || regVoteInfo.img_type == 2">

            <!-- 上传图片 -->
            <van-cell-group>
                <van-cell title="案例图片">
                    <template #right-icon>
                        <span class="field-tip required">{{ regVoteInfo.img_type == 1 ? '必填' : '选填' }}//公开</span>
                    </template>
                </van-cell>

                <div class="upload-wrapper">
                    <van-uploader v-model="voteInfo.imgs" :max-size="20 * 1024 * 1024" :after-read="afterReadImage"
                        :max-count="10" preview-size="3.9rem" @oversize="onImgOversize">
                        <div class="upload-box">
                            <van-icon name="plus" size="24" />
                            <span>最大支持20M</span>
                        </div>
                    </van-uploader>
                </div>
            </van-cell-group>
        </div>

        <div v-for="item in regList" :key="item.id">

            <!-- 案例名称 -->
            <van-cell-group v-if="item.type == 3">
                <van-field v-model="item.answer" :label="item.title" placeholder="请输入内容">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}/{{ item.public_type ==
                            1 ? '公开' : '不公开'}}</span>
                    </template>
                </van-field>
            </van-cell-group>

            <!-- 案例描述 -->
            <van-cell-group v-else-if="item.type == 4">
                <van-cell :title="item.title">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}/{{ item.public_type ==
                            1 ? '公开' : '不公开'}}</span>
                    </template>
                </van-cell>
                <van-field v-model="item.answer" label="" type="textarea" rows="4" autosize placeholder="请输入内容，不限数字">
                </van-field>
            </van-cell-group>


            <!-- 上传图片 -->
            <van-cell-group v-else-if="item.type == 5">
                <van-cell :title="item.title">
                    <template #right-icon>
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}/{{ item.public_type ==
                            1 ? '公开' : '不公开'}}</span>
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
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}/{{ item.public_type ==
                            1 ? '公开' : '不公开'}}</span>
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
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}/{{ item.public_type ==
                            1 ? '公开' : '不公开'}}</span>
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
                        <span class="field-tip required">{{ item.require_type == 1 ? '必填' : '选填' }}/{{ item.public_type ==
                            1 ? '公开' : '不公开'}}</span>
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

        <div class="submit-btn" @click="submitInfo"> 保存</div>


    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"
import { uploadToOSS } from '../../js/utils/ossUpload'


import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()


const aid = ref("")
const aType = ref(1)



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

const regVoteInfo = ref({
    name_type: 3,
    info_type: 3,
    img_type: 3,
})

const voteInfo = ref({
    name: '',
    info: '',
    imgs: [],
})

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
    if (regVoteInfo.value.name_type == 1 && !voteInfo.value.name) {
        showToast('请填写案例名称')
        return
    }
    if (regVoteInfo.value.info_type == 1 && !voteInfo.value.info) {
        showToast('案例说明')
        return
    }
    if (regVoteInfo.value.img_type == 1 && !voteInfo.value.imgs.length) {
        showToast('请上传案例图片')
        return
    }
    let submitValue = {}
    // regList.value.forEach(item => {
    //     console.log('item', item)
    //     // if (item.type == 1) {
    //     //     submitValue.push({
    //     //         id: item.id,
    //     //         type: item.type,
    //     //         answer: item.answer
    //     //     })
    //     // } else if (item.type == 2) {
    //     //     submitValue.push({
    //     //         id: item.id,
    //     //         type: item.type,
    //     //         answer: item.answer
    //     //     })
    //     // } else if (item.type == 3) {}
    // });
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
    // console.log('submitInfo', submitValue);
    // const isCheckBase = regInfo.value.display_type == 1 || regInfo.value.display_type == 2
    // const isCheckChain = regInfo.value.display_type == 1 || regInfo.value.display_type == 3 || regInfo.value.display_type == 4
    // if (!regInfo.value.name.trim() && isCheckBase) {
    //     showToast("请输入姓名");
    //     return false;
    // }

    // if (!regInfo.value.chain_name.trim() && isCheckChain) {
    //     showToast("请输入选择连锁");
    //     return false;
    // }

    // if (!regInfo.value.chain_id && isCheckChain) {
    //     showToast("请输入选择连锁");
    //     return false;
    // }

    // if (!regInfo.value.store_name.trim() && isCheckChain) {
    //     showToast("请选择门店");
    //     return false;
    // }

    // if (!regInfo.value.store_uid && isCheckChain) {
    //     showToast("请选择门店");
    //     return false;
    // }

    // if (isCheckBase && !checkMobile()) {
    //     return;
    // }
    // if (isCheckBase && !checkCode()) {
    //     return;
    // }
    // if (typeof regInfo.value.store_adcode == 'string') {
    //     regInfo.value.store_adcode = parseInt(regInfo.value.store_adcode)
    // }



    proxy.$axios.post(proxy.$config.domain + "Vote/TopicSave", {
        type: aType.value,
        id: aid.value,
        vote_info: voteInfo.value,
        answers: submitValue,
    }, { toJSON: true }).then(response => {
        // this.showLoading = false;
        if (response.data.code === 200) {
            const d = response.data.data
            showToast('保存成功！')

            setTimeout(() => {
                if (d.topic_type == 1) {
                    aType.value = 2
                    getRegInfo()
                } else {
                    router.replace({
                        name: 'VoteVote', query: {
                            id: aid.value,
                        }
                    })
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



function getRegInfo() {
    proxy.$axios.get(proxy.$config.domain + 'Vote/RegInfo?type=' + aType.value + '&id=' + aid.value).then(response => {
        if (response.data.code === 200) {
            if (response.data.data.vote_user_id) {
                router.replace({ name: 'VoteDetail', query: { vote_id: aid.value, id : response.data.data.vote_user_id } })
            }


            regVoteInfo.value = response.data.data.vote_info
            regList.value = response.data.data.list
        } else {
            router.replace({ path: '/404', query: { msg:response.data.msg ? response.data.msg : '请求失败'} })
        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })
        });
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

    getRegInfo()


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