<template>
    <div class="main-content vote"
        :style="{ '--theme-color': themeColor, '--font-color': fontColor, '--theme-color-rgba': themeColor + '4d' }">
        <van-swipe :autoplay="3000" lazy-render class="top-swipe">
            <van-swipe-item v-for="url in info.imgs" :key="url" @click="gotoUrlPath(item.link)">
                <div>
                    <img :src="url" />
                </div>

            </van-swipe-item>
        </van-swipe>
        <div class="title-div">
            {{ info.title }}
        </div>
        <div class="desc-div">
            <div class="num-div-div" flex="dir:left cross:center" v-if="info.vote_type == 1">
                <div class="num-div">
                    <div class="num">{{ info.user_total || '--' }}</div>
                    <div>参与选手</div>
                </div>
                <div class="num-div">
                    <div class="num">{{ info.vote_total || '--' }}</div>
                    <div>累计票数</div>
                </div>
                <div class="num-div">
                    <div class="num"> {{ info.view || '--' }}</div>
                    <div>访问量</div>
                </div>
            </div>
            <van-count-down :time="time">

                <template #default="timeData">
                    距离活动结束还有：
                    <span>{{ ('0' + timeData.days).slice(-2) }}</span>天<span>{{ ('0' +
                        timeData.hours).slice(-2) }}</span>时<span>{{ ('0' + timeData.minutes).slice(-2)
                        }}</span>分<span>{{ ('0' + timeData.seconds).slice(-2) }}</span>秒
                </template>

            </van-count-down>
        </div>

        <div v-if="info.number_type == 1 || info.rank_type == 1">
            <van-search v-model="selKeyword" show-action shape="round" class="search-wrap"
                placeholder="请输入选手名称/编号查询">
                <template #action>
                    <div @click="onSearch">搜索</div>
                </template>
            </van-search>
        </div>
        <div class="class-tab">
            <div :class="tabSelIndex == 1 ? 'active' : ''" v-if="info.number_type == 1" @click="selectTab(1)">编号排序</div>
            <div :class="tabSelIndex == 2 ? 'active' : ''" v-if="info.rank_type == 1" @click="selectTab(2)">排行榜</div>
            <div :class="tabSelIndex == 3 ? 'active' : ''" @click="selectTab(3)">规则详情</div>
        </div>
        <van-list v-model:loading="loading" :finished="finished" v-model:error="error" error-text="请求失败，点击重新加载"
            finished-text="没有更多了~" style="flex-direction: column;" @load="onLoad" v-if="tabSelIndex == 1">
            <div class="vote-user-item-card" v-for="(item, index) in list" :key="index" @click="goClick(item)">
                <div flex="dir:left main:center cross:top">
                    <div class="left-div" flex="dir:top main:left cross:top ">
                        <div class="user-div" flex="dir:left main:left  cross:center">
                            <img class="vote-avatar" :src="item.avatar" />
                            <div flex="dir:top main:center cross:top">
                                <div class="user-nickname"> {{ item.nickname }}</div>
                                <div class="user-chain-name">{{ item.chainName }}</div>
                            </div>
                        </div>
                        <img class="vote-img" :src="item.imgs" />
                    </div>

                    <div class="right-div">
                        <div class="vote-name"> {{ item.vote_name }}</div>
                        <van-text-ellipsis rows="3" class="vote-info" :content="item.info" />
                        <div flex="dir:left main:justify cross:center">
                            <div class="vote-num">{{ item.vote_num }}票</div>
                            <div class="vote-btn vote-click" @click.stop="voteVoteClick(item)" v-if="item.vote_op_type == 2">立即投票</div>
                            <div class="vote-btn vote-click disable" disable  v-else-if="item.vote_op_type == 3">已投票</div>

                        </div>
                    </div>
                </div>
                <div class="vote-index-div">{{ item.vote_index }}号</div>
            </div>
            <van-empty v-if="list.length === 0" description="暂无选手">
                <div class="vote-btn" v-if="info.vote_status == 1" @click.stop="voteClick">{{ info.btn_name }}</div>
            </van-empty>
        </van-list>
        <van-list v-model:loading="loadingNum" :finished="finishedNum" v-model:error="errorNum" error-text="请求失败，点击重新加载"
            finished-text="没有更多了~" style="flex-direction: column;" @load="onLoadNum" v-else-if="tabSelIndex == 2">
           <div class="vote-user-item-card" v-for="(item, index) in listNum" :key="index" @click="goClick(item)">
                <div flex="dir:left main:center cross:top">
                    <div class="left-div" flex="dir:top main:left cross:top ">
                        <div class="user-div" flex="dir:left main:left  cross:center">
                            <img class="vote-avatar" :src="item.avatar" />
                            <div flex="dir:top main:center cross:top">
                                <div class="user-nickname"> {{ item.nickname }}</div>
                                <div class="user-chain-name">{{ item.chainName }}</div>
                            </div>
                        </div>
                        <img class="vote-img" :src="item.imgs" />
                    </div>

                    <div class="right-div">
                        <div class="vote-name"> {{ item.vote_name }}</div>
                        <van-text-ellipsis rows="3" class="vote-info" :content="item.info" />
                        <div flex="dir:left main:justify cross:center">
                            <div class="vote-num">{{ item.vote_num }}票</div>
                            <div class="vote-btn vote-click" @click.stop="voteVoteClick(item)" v-if="item.vote_op_type == 2">立即投票</div>
                            <div class="vote-btn vote-click disable" disable  v-else-if="item.vote_op_type == 3">已投票</div>

                        </div>
                    </div>
                </div>
                <div class="vote-index-div">{{ item.vote_index }}号</div>
            </div>
            <van-empty v-if="listNum.length === 0" description="暂无选手">
                <div class="vote-btn" v-if="info.vote_status == 1" @click="voteClick">{{ info.btn_name }}</div>
            </van-empty>
        </van-list>
        <div class="content" v-html="info.content" v-else></div>

        <div class="fixed-bottom fixed-textarea">
            <div class="div-bottom" flex="dir:left cross:center">
                <div class="vote-btn" @click.stop="voteClick" v-if="info.vote_status == 1">{{ info.btn_name }}</div>
                <div class="vote-btn btn-default" @click.stop="voteClick"><van-icon name="share-o" />分享当前活动</div>
            </div>

        </div>
    </div>


    <van-popup v-model:show="showNoStartPop" class="red-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg" />
    </van-popup>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showDialog } from "vant";


import { activityInfoStatus } from '@/constants/ActivityInfoStatus'
import mojs from '@mojs/core'
import func from "vue-temp/vue-editor-bridge";
// import CommentList from '@/components/comment/CommentList.vue'
// import CommentInput from '@/components/comment/CommentInput.vue'


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()



let info = ref({
    vote_type: 0,
    number_type: 2,
    rank_type: 2,
    vote_status: 2,
    btn_name: '我要报名',
})

const aid = ref('')
let uid = ''


const showNoStartPop = ref(false)
const noStartImg = ref("")


const down = ref(10)
const isShowSendBtn = ref(false)
let InterValObj = 0




const themeColor = ref('#FF814D')
const fontColor = ref('#333333')
const time = ref(-30 * 60 * 60 * 1000)
const tabSelIndex = ref(3)

function selectTab(index) {
    tabSelIndex.value = index
    if (index == 2 && listNum.value.length == 0 && finishedNum.value == false) {
        getList(2)
    }
}

const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const page = ref(1)
const loadingNum = ref(false)
const finishedNum = ref(false)
const errorNum = ref(false)
const pageNum = ref(1)
const selKeyword = ref("")

const list = ref([])
const listNum = ref([])



setToastDefaultOptions({ duration: 2000 });

function voteVoteClick(item) {
    if (item.vote_op_type == 2 || 1) {
        proxy.$axios.post(proxy.$config.domain + 'Vote/VoteLike?vote_id=' + aid.value + '&id=' + item.id).then(response => {
        if (response.data.code === 200) {
            item.vote_op_type = 3
            item.vote_num = item.vote_num + 1
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

function goClick(item) {
    router.replace({ name: 'VoteDetail', query: { vote_id: aid.value, id : item.id } })
}

function onLoad() {
    getList(1)

}

function onLoadNum() {
    getList(2)
}

function onSearch() {
    if (selKeyword.value == '') {
        return
    }
    if (tabSelIndex.value == 1) {
        page.value = 1
    } else if (tabSelIndex.value == 2) {
        pageNum.value = 1
    }
    getList(tabSelIndex.value)
}

function getList(sort) {
    if (sort == 1 && loading.value) {
        return
    } else if (sort == 2 && loadingNum.value) {
        return
    }
    proxy.$axios.get(proxy.$config.domain + 'Vote/UserList?voteId=' + aid.value + '&page=' + (sort == 1 ? page.value : pageNum.value) + '&limit=10&sort=' + sort + '&keyword=' + selKeyword.value).then(response => {
        if (response.data.code === 200) {

            const d = response.data.data
            if (sort == 1) {
                if (page.value == 1) {
                    list.value = []
                }
                page.value = page.value + 1
                if (d && d.length > 0) {
                    list.value = list.value.concat(d)
                }
                if (!d || d.length < 10) {
                    finished.value = true
                }
                loading.value = false
            } else {
                if (pageNum.value == 1) {
                    listNum.value = []
                }
                pageNum.value = pageNum.value + 1
                if (d && d.length > 0) {
                    listNum.value = listNum.value.concat(d)
                }
                if (!d || d.length < 10) {
                    finishedNum.value = true
                }
                loadingNum.value = false
            }
        } else {
            if (sort == 1) {
                loading.value = false
                error.value = true
            } else {
                loadingNum.value = false
                errorNum.value = true
            }
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }

    })
        .catch(e => {
            if (sort == 1) {
                loading.value = false
                error.value = true
            } else {
                loadingNum.value = false
                errorNum.value = true
            }
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });

}

function voteClick() {
    router.replace({
        name: 'VoteReg', query: {
            id: aid.value,
            type: 1,
        }
    })
}

function getJsTicket() {
    let url = window.location.href.split('#')[0]
    proxy.$axios.get(proxy.$config.domain + 'User/GetTicketSign?url=' + encodeURIComponent(url)).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            wx.config({
                debug: false,
                appId: d.appId,
                timestamp: d.timestamp,
                nonceStr: d.nonceStr,
                signature: d.signature,
                jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
                openTagList: ['wx-open-launch-weapp']
            })
            wx.ready(function () {
                let sharedata = {
                    title: info.value.title,
                    desc: info.value.desc,
                    link: info.value.share_url,
                    imgUrl: info.value.thumb,
                    success: function () { },
                    cancel: function () { }
                };
                wx.updateAppMessageShareData(sharedata);
                wx.updateTimelineShareData(sharedata);
            });
            wx.error(function (res) {
                console.log(res)
            })


        } else {
            console.log('成功了')
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
        .catch(error => {
            console.log('成功了--error', error)
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function getActivity(adcode) {

    proxy.$axios.get(proxy.$config.domain + 'Vote/Info?id=' + aid.value + '&uuid=' + uid + '&adcode=' + adcode).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            if (d.title) {
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
                    router.replace({
                        name: 'UserReg', query: {
                            id: aid.value, page: 'VideoVideo',
                            auth_type: d.auth_type
                        }
                    })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '认证成功后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'UserMine', query: { id: aid.value, page: 'VideoVideo' } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusLimitAuth) {
                showDialog({
                    message: d.tip_img,
                    showConfirmButton: false,
                })

                return
            } else if (d.status == 3 || d.status == 5 || d.status == 6) {
                showNoStartPop.value = true
                noStartImg.value = d.tip_img
            } else {
            }

            info.value = d

            // down.value = d.standard_times
            // getJsTicket()
            // if(d.is_upload) {
            //     resetInterValObj()
            // }
            var end = new Date(d.end_time).getTime();
            var start = new Date().getTime();
            time.value = (end - start)
            if (info.value?.number_type == 1) {
                tabSelIndex.value = 1
                getList(1)
            } else if (info.value?.rank_type == 2) {
                tabSelIndex.value = 2
                getList(2)
            }

        } else {
            router.replace({ path: '/404', query: { msg: response.data.msg ? response.data.msg : '网络连接错误，请刷新重试' } })
        }
    })
        .catch(error => {

            console.log(error)
        });
}


function showGeoPosition(position) {
    // console.log(position, "showGeoPosition=====")
    getActivity(position.adcode)
    // getJsTicket()
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
        aid.value = id
    }

    if (aid.value == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }

    let uuid = route.query.uuid
    if (uuid && typeof uuid === 'string') {
        uid = uuid
    }


    if (route.query.type == 'loc') {
        GetGeo()
    } else {
        getActivity('')
    }

})

onBeforeUnmount(() => {

})
</script>

<style lang="scss" scoped>
.main-content.vote {

    background: #f7f7f7;
    background-color: #f7f7f7;
    padding-bottom: 3rem;

    .title-div {
        margin: 0.4rem;
        font-size: 0.49rem;
        font-weight: bold;
        color: var(--font-color);
        line-height: 1.5;
        text-align: center;
    }

    .desc-div {
        margin: 0.270rem;
        padding: 0.3rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(255, 255, 255);
        border-radius: 0.15rem;
        text-align: center;
        font-size: 0.33rem;
        line-height: 1.5;
        color: var(--font-color);

        span {
            color: var(--theme-color);

        }

        .num-div-div {
            font-size: 0.39rem;
            padding-bottom: 0.3rem;
            border-bottom: 1px solid #f1f1f1;
            margin-bottom: 0.3rem;

            .num-div {
                width: 33%;

                .num {
                    font-size: 0.49rem;
                    font-weight: bold;
                    color: var(--theme-color);
                }
            }


        }
    }

    .class-tab {
        margin: 0.270rem;
        display: flex;
        justify-content: space-around;
        // width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        // line-height: 1.5;
        font-size: 0.39rem;
        color: var(--font-color);
        background: #fff;
        justify-items: center;
        align-items: center;
        font-weight: bold;
    }

    .class-tab div {
        /*height: 100%;*/
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .class-tab .active {
        color: var(--theme-color);
        border-bottom: 4px solid var(--theme-color);
    }


    .content {
        margin: 0.270rem;
        background: #FFFFFF;
        padding: 0.2rem 0.270rem;

        font-size: 0.37rem;
        color: var(--font-color);
        line-height: 0.65rem;
    }

    .vote-btn {
        background: var(--theme-color-rgba);
        width: 3.7rem;
        border-radius: 0.2rem;
        color: var(--theme-color);
        font-size: 0.37rem;
        height: 1.1rem;
        line-height: 1.1rem;
        text-align: center;
    }


    .desc-img {
        margin: 0.5rem;
        width: 9rem;
    }

    .img-bg {
        width: 10rem;
        // height: 5rem;
        background: #12CB7B32;
        // margin-top: -2rem;


        padding-bottom: 2rem;
    }

    .vote-user-item-card {
        margin: 0 0.27rem 0.3rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 6px 0rem rgba(154, 172, 191, 0.4);
        border-radius: 0.16rem;
        position: relative;
        padding: .27rem;

        .user-div {
            flex: 1;
            margin-bottom: 0.2rem;

            .vote-avatar {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
                margin-right: 0.08rem;
            }

            .user-nickname {
                font-size: 0.2rem;
                color: #000000;
                height: 0.2rem;
            }

            .user-chain-name {
                margin-top: 0.08rem;
                font-size: 0.16rem;
                color: #999999;
                height: 0.2rem;
                max-width: 1.6rem;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

        }

        .vote-index-div {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 0.35rem;
            color: #fff;
            background: rgba(0, 0, 0, .25);
            min-width: 0.6rem;
            height: 0.7rem;
            padding: 0 .25rem;
            text-align: center;
            line-height: 0.7rem;
            border-radius: 0.16rem 0 0.21rem;
        }

        .vote-img {
            width: 2.43rem;
            height: 2.43rem;
        }

        .right-div {
            text-align: left;
            flex: 1;
            margin-left: 0.5rem;

            .vote-name {
                font-weight: 500;
                font-size: 0.39rem;
                color: #000000;
                height: 0.4rem;
                line-height: 0.4rem;

            }

            .vote-info {
                margin-top: 0.2rem;
                height: 1.48rem;
                line-height: 0.49rem;
                font-size: 0.37rem;
                color: #000000;
                // max-width: 5.2rem;
            }

            .vote-num {
                font-size: 0.39rem;
                color: var(--theme-color);
                line-height: 0.8rem;
    margin-top: 0.3rem;
            }

            .vote-btn {
                margin-top: 0.3rem;
                width: 2rem;
                height: .8rem;
                font-size: 0.37rem;
                line-height: .8rem;
                color: var(--theme-color);
            }
        }

        .status-icon {
            width: 0.5rem;
            margin-right: 0.2rem;
        }

        .status-icon.fail {
            width: 1.08rem;
            // margin-right: 0.5rem;
        }

        .awiting-div {
            font-weight: bold;
            font-size: 0.37rem;
            color: #139EFF;
        }

        .money-div {
            font-family: Gilroy;
            font-weight: bold;
            font-size: 0.48rem;
            color: #FE8E09;
        }
    }

    .fixed-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        width: 10rem;
        height: 1.44rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215, 215, 215);
        border-radius: 0.05rem 0.05rem 0rem 0rem;


        line-height: 1.44rem;

        font-size: 0.4rem;
        // font-family: PingFang SC;
        // font-weight: 500;
        color: #333333;

        .div-bottom {
            margin: 0.17rem 0.5rem;
            gap: 0.5rem;

            .vote-btn {
                flex: 1;
            }

            .vote-btn.btn-default {
                color: #FFFFFF;
                background: var(--theme-color);
            }

        }




    }

}

.red-packet-pop {
    background-color: transparent;
    padding-bottom: 2rem;
    max-width: 100%;

}
</style>