<template>
    <div class="main-content vote-detail" :style="{ '--theme-color': themeColor, '--font-color': fontColor, '--theme-color-rgba': themeColor + '4d' }">
        <div class="user-div" flex="dir:left main:left  cross:center">
                            <img class="vote-avatar" :src="voteUserInfo.avatar" />
                            <div flex="dir:top main:center cross:top">
                                <div class="user-nickname"> {{ voteUserInfo.nickname }}</div>
                                <div class="user-chain-name">{{ voteUserInfo.chainName }}</div>
                            </div>
                        </div>
        <van-swipe :autoplay="10000" lazy-render style="margin-top: 0.5rem;" >
            <van-swipe-item v-for="item in voteUserInfo.imgList" :key="item">
                <img :src="item"   />
                
            </van-swipe-item>
         </van-swipe>
        <div class="vote-info">
            <div class="title-div" v-if="voteUserInfo.vote_name">
                {{ voteUserInfo.vote_name }}
            </div>
             <div class="num-div-div" flex="dir:left cross:center" v-if="voteInfo.vote_type == 1">
                <div class="num-div">
                    <div class="num">{{ voteUserInfo.vote_index || '--' }}</div>
                    <div>编号</div>
                </div>
                <div class="num-div">
                    <div class="num">{{ voteUserInfo.rank || '--' }}</div>
                    <div>排名</div>
                </div>
                <div class="num-div">
                    <div class="num"> {{ voteUserInfo.vote_num || 0 }}</div>
                    <div>票数</div>
                </div>
                <div class="num-div">
                    <div class="num"> {{ voteUserInfo.rank_pre || '--' }}</div>
                    <div>距前名</div>
                </div>
            </div>
            <div class="vote-user-desc"   v-html="voteUserInfo.info"></div>

            <div v-for="item in infoList" :key="item.id">

            <!-- 案例名称 -->
            <div class="title-div" v-if="item.type == 3">
                {{ item.answer }}
            </div>

          
            <!-- 案例描述 -->
            <div class="vote-user-desc" v-else-if="item.type == 4"  v-html="item.answer"></div>

             <!-- 上传图片 -->
            <div class="vote-user-imgs" v-else-if="item.type == 5">
            <van-swipe :autoplay="3000" lazy-render style="margin-top: 0.5rem;" >
                <van-swipe-item v-for="item in item.answer" :key="item">
                    <img :src="item.url"   />
                
                </van-swipe-item>
            </van-swipe>
            </div> 


            <!-- 多选 -->
            <div class="vote-user-desc" v-else-if="item.type == 2">
                {{ item.title }}：{{ item.answer ? item.answer.join(',') : '--' }}
            </div>

            <!-- 单选 -->
            <div class="vote-user-desc" v-else-if="item.type == 1">
                {{ item.title }}：{{ item.answer || '--' }}
            </div>
            
            <div class="vote-video" v-else-if="item.type == 6">
                 <video  muted loop playsinline controls style="width: 100%;">
            <source :src="item.answer.video[0].url" type="video/mp4">
            <!-- 降级背景图片 -->
            <div class="fallback-bg"></div>
        </video>
            </div>



        </div>

        </div>


        <div class="fixed-bottom fixed-textarea">
            <div class="div-bottom" flex="dir:left cross:center">
                <div class="vote-btn btn-default" @click.stop="voteIndexClick">
                    <van-icon name="wap-home-o" />
                    <div>首页</div>
                </div>
                <div class="vote-btn vote-click" @click.stop="shareClick" v-if="voteUserInfo.vote_op_type == 1" >邀请别人为自己投票</div>
                <div class="vote-btn vote-click" @click.stop="voteClick" v-else-if="voteUserInfo.vote_op_type == 2">立即投票</div>
                <div class="vote-btn vote-click disable" disable  v-else>已投票</div>
                <div class="vote-btn btn-default" @click.stop="shareClick">
                    <van-icon name="share-o" />
                    <div>分享</div>
                </div>
            </div>

        </div>


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

const themeColor = ref('#FF814D')
const fontColor = ref('#333333')


const aid = ref("")
const voteId = ref("")



const infoList = ref([
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
    vote_type : 0
})

const voteUserInfo = ref({
    name: '',
    info: '',
    imgs: '',
    imgList: [],
    avatar: '',
})

setToastDefaultOptions({ duration: 3000 });


function shareClick() {
    showToast('暂不支持分享');
}

function voteClick() {
    if (voteUserInfo.value.vote_op_type == 2) {
        proxy.$axios.post(proxy.$config.domain + 'Vote/VoteLike?vote_id=' + voteId.value + '&id=' + aid.value).then(response => {
        if (response.data.code === 200) {
            voteUserInfo.value.vote_op_type = 3
            voteUserInfo.value.vote_num = voteUserInfo.vote_num + 1
            showToast('投票成功');
        } else {
            showToast(response.data.msg ? response.data.msg : '请求失败');
        }
    })
        .catch(error => {
            showToast('投票失败');
        });
    }
}

function voteIndexClick() {
    router.replace({ name: 'VoteVote', query: { id: voteId.value } })
}


function getDetailInfo() {
    proxy.$axios.get(proxy.$config.domain + 'Vote/Detail?vote_id=' + voteId.value + '&id=' + aid.value).then(response => {
        if (response.data.code === 200) {

            voteInfo.value = response.data.data.vote_info
            infoList.value = response.data.data.list
            voteUserInfo.value = response.data.data.vote_user_info
            if (voteUserInfo.value.imgs && voteUserInfo.value.imgs.length > 0) {
                voteUserInfo.value.imgList = voteUserInfo.value.imgs.split(',') 
            }
            if (voteInfo.value.theme_color) {
                themeColor.value = voteInfo.value.theme_color
            }
            if (voteInfo.value.font_color) {
                fontColor.value = voteInfo.value.font_color
            }
        } else {
            showToast(response.data.msg ? response.data.msg : '请求失败');
        }
    })
        .catch(error => {
        });
}


onMounted(() => {
    let vote_id = route.query.vote_id
    if (vote_id && typeof vote_id === 'string') {
        voteId.value = vote_id
    }

    let id = route.query.id

    if (id && typeof id === 'string') {
        aid.value = id
    }

    getDetailInfo()


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

.vote-detail {
    width: 10rem;
    // height: 21.28rem;
    min-height: 100vh;
    background: #F7F7F7;
    padding: 0 0 1.5rem;

    .user-div {
        background: #FFFFFF;
        padding: 0.375rem 0.75rem;

            .vote-avatar {
                width: 1.42rem;
                height: 1.42rem;
                border-radius: 50%;
                margin-right: 0.2rem;
            }

            .user-nickname {
                font-size: 0.46rem;
                color: #2A2A2A;;
                height: 0.5rem;
            }

            .user-chain-name {
                margin-top: 0.3rem;
                font-size: 0.33rem;
                color: #C5C5C5;
                height: 0.5rem;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

        }

    // van-cell-group {
    //     margin: 0.0125rem;
    // }
    .empty-div {
        height: 0.4rem;

    }

    .vote-btn {
        color: #FFFFFF;
        background: var(--theme-color);
        width: 3.7rem;
        border-radius: 0.5rem;
        font-size: 0.37rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
    }

    .vote-info {
        margin: 0.375rem;
        padding: 0.375rem;
        background: #FFF;
        font-size: 0.39rem;
        line-height: 1.2;

        color: var(--font-color);
        .title-div {
            font-size: 0.49rem;
            font-weight: bold;
            color: var(--font-color);
            line-height: 1;
            text-align: center;
            margin-bottom: 0.5rem;
        }
        .num-div-div {
            font-size: 0.39rem;
            padding-bottom: 0.3rem;
            border-bottom: 1px solid #f1f1f1;
            margin-bottom: 0.5rem;
            text-align: center;
            margin-bottom: 0.5rem;

            .num-div {
                width: 25%;

                .num {
                    font-size: 0.49rem;
                    font-weight: bold;
                    color: var(--theme-color);
                }
            }


        }
        .vote-user-desc {
            margin-bottom: 0.5rem;
        }

        .vote-user-imgs {
            margin-bottom: 0.5rem;
             img {
                width: 100%;
                border-radius: 0.16rem;
            }
        }

        .vote-video {
            width: 100%;
            border-radius: 0.16rem;
            overflow: hidden;
             video {
                width: 100%;
            }
             .fallback-bg {
                width: 100%;
                height: 3.2rem;
                background: #f1f1f1;
             }
            }
    }

    .fixed-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        width: 10rem;
        height: 1.5rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215, 215, 215);
        border-radius: 0.05rem 0.05rem 0rem 0rem;


        line-height: 1.5rem;

        font-size: 0.4rem;
        // font-family: PingFang SC;
        // font-weight: 500;
        color: #333333;

        .div-bottom {
            margin: 0.1rem 0.5rem;
            gap: 1rem;

            .vote-btn.vote-click {
                flex: 1;
            }

            .vote-btn.btn-default {
                
                width: 1.33rem;
                height: 1.33rem;
                border-radius: 50%;
                line-height: 0.5rem;
                .van-icon {
                    font-size: 0.5rem;
                        margin-top: 0.1rem;
                }
            }

            .vote-btn.vote-click.disable { 
                background: #C5C5C5;
                color: #FFFFFF;
            }


        }




    }



}
</style>