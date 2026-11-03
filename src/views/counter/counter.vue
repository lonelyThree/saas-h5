<template>
    <div class="main-content course" ref="course_content">
        <div class="top-div">
        <van-swipe :autoplay="10000" lazy-render style="margin-top: 0.5rem;" v-if="info.imgList && info.imgList?.length > 0"  class="top-swipe">
            <van-swipe-item v-for="item in info.imgList" :key="item">
                <img :src="item"   />
                
            </van-swipe-item>
        </van-swipe>
        <img :src="info.imgs" v-else />
        <div class="title-div">
            {{ info.title }}
        </div>
        <div class="award-div-div" flex="dir:left main:left cross:center"><div class="award-div" v-if="info?.award_type == 2" flex="dir:left main:left cross:center">
            <img src="../../assets/icons/credit.png"/>
            <span>积分</span>
            ＋{{ info.money }}
        </div>
    
        <div class="award-div" v-else-if="info?.award_type == 3" flex="dir:left main:left cross:center">
            <img src="../../assets/icons/credit.png"/>
            <span>星币</span>
            ＋{{ (info.money / 100 || 0 ).toFixed(2) }}
        </div>
        <div class="award-div" v-else flex="dir:left main:left cross:center">
            <img src="../../assets/icons/red.png"  />
            <span>红包</span>
            ＋{{ (info.money / 100  || 0).toFixed(2)}}
        </div>
        </div>
        <div class="desc-div"  flex="dir:left main:left cross:center">
            <div>活动数：{{ info.bind_count || 0 }}</div>
            <div>参与人数：{{ info.join}}</div>
        </div>
        </div>
        
        <van-tabs v-model:active="active" :border="true" @change="onChange">
            <van-tab title="简介">
                <div class="content"  v-html="info.desc"></div>
            </van-tab>
            <van-tab title="活动">
                <div class="bind-list"  v-if="info?.bind_list?.length > 0">
                    <div class="bind-div" v-for="item in info.bind_list" :key="item.id" 
                         @click="goToClick(item)" >
                          <img :src="item.img"  />
                        <div class="bind-title">{{ item.name }}</div>
                        <div class="bind-desc" flex="dir:left main:justify cross:center">
                            <div>
                               活动奖励：
                               <span>{{ item.award_type == 2 ? item.money: (item.money / 100.0).toFixed(2)}} </span>
                                {{ item.award_type == 2 ? '积分':(item.award_type == 3 ? '星币':'元') }}
                            </div>
                        </div>
                        <div class="footer"  flex="dir:left main:justify cross:center"> 
                            <div class="award-btn footer-btn"  @click.stop="goRewardClick(item)">奖励明细</div>
                            <div class="detail-btn footer-btn" @click.stop="goQrcodeClick(item)">生成邀请码</div>
                        </div>
                        
                    </div>
                </div>
                <van-empty description="暂无活动"  image-size="4rem"  v-else/>
            </van-tab>
             <van-tab title="打卡明细">
                <div v-if="loading && !checkinList.length" class="loading-container">
        <van-loading type="spinner" color="#1989fa" />
    </div>
    
    <div v-else-if="checkinList.length === 0" class="empty-container">
        <van-empty description="暂无打卡记录" image-size="4rem" />
    </div>
    
    <van-list
        v-else
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="checkin-list"
    >
        <!-- 去掉 van-cell，改用自定义 div 结构 -->
        <div
            v-for="(item, index) in checkinList"
            :key="index"
            class="checkin-item-custom"
        >
           <!-- 标题行：店名 + 状态 + 奖励 -->
            <div class="item-header" flex="dir:left main:justify cross:center">
                <div class="item-left">
                    <div class="store-name-container">
                        <div class="store-name">{{ item.store_name }}</div>
                        <div v-if="getExceptionText(item)" class="status-exception">异常</div>
                    </div>
                    <!-- 时间行 -->
                    <div class="checkin-time-label">
                        <div>到店打卡：{{ getTimeString(item.arrive_at) }}</div>
                        <div>离店打卡：{{ item.leave_at > 0 ? getTimeString(item.leave_at) : '未打卡' }}</div>
                        <div class="exception-div">{{ getExceptionText(item) }}</div>
                    </div>
                </div>
                
                <div class="item-right" flex="dir:center main:center cross:center">
                    <div v-if="item.award_status == 5 || item.award_status == 6" class="reward-amount">
                        +{{ item.money > 0 ? (item.award_type == 2 ? item.money : (item.money / 100).toFixed(2)) : 0 }} 
                    </div>
                    <div v-else-if="item.award_status === 8" class="action-btn failed">
                        审核失败
                    </div>
                    <div v-else-if="item.award_status == 3 && item.money > 0" class="action-btn pending"  @click="claimReward(item.checkin_id)">
                        领取奖励
                    </div>
                    
                    <div v-else-if="item.award_status === 4 || item.award_status === 7" class="action-btn failed">
                        待审核
                    </div>
                </div>
            </div>

            
        </div>
    </van-list>
            </van-tab>
            <van-tab title="排行榜">
                <van-empty description="暂无排行榜"  image-size="4rem" />
            </van-tab>
        </van-tabs>
  
        <div class="fixed-bottom" v-if="active == '0'">
            <div class="bottom-div" flex="dir:left cross:center">
                <div class="btn"  v-if="info.is_arrive &&info.is_arrive == 2 " @click="startClick('')">离店打卡</div>
                <div class="btn" v-else @click="startClick('')">到店打卡</div>
     
                
            </div>
        </div>


         <van-image-preview v-model:show="showShareImg" :images="shareImgs" className="share_img_preview"
         :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.98)' }"
    close-on-click-image="false" :closeable="true">
        <template v-slot:index><div></div></template>
        <!-- 自定义覆盖内容，显示两行文字 -->
    <template #cover>
      <div class="share-qrcode-content">
        <p class="share-qrcode-title">{{ shareTitle }}</p>
        <p class="share-qrcode-desc">长按保存至相册，可分享至微信好友、朋友圈</p>
      </div>
    </template>
    </van-image-preview>

    </div>


    <van-popup v-model:show="showNoStartPop" class="red-packet-pop" :close-on-click-overlay="false">
        <img :src="noStartImg" />
    </van-popup>

   


    <van-overlay :show="showGuide" @click="showGuide = false">
      <img class="guide-img" src="../../assets/img/guide.png">
</van-overlay>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance, nextTick, shallowRef } from "vue"

import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions, showLoadingToast, closeToast, showDialog, showImagePreview } from "vant";
import { activityInfoStatus } from '@/constants/ActivityInfoStatus'
import { initWechatShare, setShareConfig } from '../../js/wechatShare';
import { formatTimeUnixCustom } from '../../js/time.js'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const showNoStartPop=ref(false)
const noStartImg = ref('')

const showGuide = ref(false)
const isInitShare = ref(false)

const showShareImg = ref(false)
const shareTitle = ref('')
const shareImgs = ref([''])



let info = ref({})
const active = ref("")


const counterId = ref('')
const aType = ref('')

const loading = ref(false)
const finished = ref(false)
const checkinList = ref<Array<any>>([])
const hasLoaded = ref(false) // 标记是否已经加载过
const currentPage = ref(1)
const pageSize = 10


setToastDefaultOptions({ duration: 2000 });

function getTimeString(time) {
		return formatTimeUnixCustom(time, 'yyyy-MM-dd hh:mm')
	}

// 监听 active 变化，当切换到打卡明细 tab 时开始加载
function onChange(newActive) {
    console.log('tab changed', newActive)
    if (newActive == '2' && !hasLoaded.value) {
        onLoad()
    }
}


// 加载打卡记录
function onLoad() {
    console.log('onLoad', active.value, hasLoaded.value, loading.value)
    if (hasLoaded.value && !loading.value) {
        return // 已经加载过且不是正在加载，直接返回
    }
    
    loading.value = true
    
    proxy.$axios.get(proxy.$config.domain + 'Counter/CheckinList', {
        params: {
            aid: counterId.value,
            page: currentPage.value,
            page_size: pageSize
        }
    }).then(response => {
        if (response.data.code === 200) {
            const newItems = response.data.data || []

            // 添加新数据到列表
            checkinList.value.push(...newItems)

            console.log('Loaded checkin records', newItems, 'Total:', checkinList.value.length)
            
            // 更新分页信息
            currentPage.value++
            
            // 判断是否还有更多数据
            if (newItems.length < pageSize) {
                finished.value = true
            }
            
            // 标记已加载
            hasLoaded.value = true
        } else {
            showToast(response.data.msg || '获取打卡记录失败')
            finished.value = true
        }
    }).catch(error => {
        showToast('网络连接错误，请刷新重试')
        finished.value = true
    }).finally(() => {
        loading.value = false
    })
}

// 领取奖励
function claimReward(checkinId: string) {
    router.replace({
        name: 'CounterResult', query: {
            id: checkinId,
            type: 'loc',
                    }
        })
}

function startClick(item) {
    
    router.replace({ name: 'CounterCheckin', query: { id: counterId.value } })
}

function goQrcodeClick(item) {
    shareTitle.value = item.name
    if (item.qrcode_url != '') {
        let arr = [];
        arr.push(item.qrcode_url)
        shareImgs.value = arr
        showShareImg.value = true
        return
    }
    // showImagePreview([item.img])

    proxy.$axios.post(proxy.$config.domain + 'Counter/GetQrcode', {
        bind_id:item.bind_id,
        aid:counterId.value,
    }, { toJSON: true }).then(response => {
        if (response.data.code === 200) {

            const d = response.data.data
            if(d.url) {
                item.qrcode_url = d.url
                let arr = [];
                arr.push(d.url)
                shareImgs.value = arr
                showShareImg.value = true
                return
            }


        }
         showToast(response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' )

        
    })
        .catch(error => {
            showToast('网络连接错误，请刷新重试' )
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function goToClick(item) {
    // 活动类型 1-快问快答 2-开口说 3-拍小票 4-看视频 5-有奖分享 6-课程管理 7-投票
    let routerName = ''
    switch (item.type) {
    case 1:
        routerName = 'AskIndex'
        break;
    case 2:
        routerName = 'SpeakSpeak'
        break;
    case 3:
        routerName = 'ReceiptReceipt'
        break;
    case 4:
        routerName = 'VideoVideo'
        break;
    case 5:
        routerName = 'ArticleArticle'
        break;
    case 6:
        routerName = 'CourseCourse'
        break;
    case 7:
        routerName = 'VoteVote'
        break;
    }
    router.replace({ name: routerName, query: { id: item.activity_id, type:'loc' } })
}


function goRewardClick(item) {
    router.replace({ name: 'SalesmanAwardRecord', query: { bind_id: item.bind_id, bind_type: 8 } })
}

function imgList(imgs) {
      if (!imgs) return [];
      
      // 1. 按逗号分割
      // 2. 映射每个元素：去除首尾空格
      // 3. 过滤掉空字符串
      const cleaned = imgs.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // 4. 去重并保持顺序 (使用 Set 或 filter+indexOf)
      // 这里使用 filter + indexOf 保持兼容性，或使用 [...new Set(cleaned)]
      return [...new Set(cleaned)];
    }

function getActivity(adcode) {
 
    proxy.$axios.get(proxy.$config.domain + 'Counter/Info?id=' + counterId.value + '&adcode=' + adcode).then(response => {
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
                    router.replace({ name: 'SalesmanReg', query: { id: counterId.value, page: 'CounterCounter', type: aType.value,
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '审核通过后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'SalesmanMine', query: { id: counterId.value, page: 'CounterCounter', type: aType.value } })
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

            if (d.imgs && d.imgs.indexOf(',') >= 0) {
                d.imgList = imgList(d.imgs)
            
            }
            console.log(d, "activity info")

            info.value = d


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

function getExceptionText(row) {
      const types = [];
      // 使用 == 保持与原代码一致的类型比较行为，虽然推荐 ===，但此处为了最小化改动风险保留原意
      if (row.arrive_is_normal != 1 || (row.leave_at > 0 && row.leave_is_normal != 1)) {
        types.push('打卡位置异常');
      }
      if (row.leave_at > 0 && row.is_duration_valid != 1) {
        types.push('到店时间未达标');
      }
      if (row.leave_at < 1) {
        types.push('离店未打卡');
      }
      return types.join('、');
}

function shareClick() {
    try {
        const isWeixin = /micromessenger/i.test(navigator.userAgent);
        // 非微信：直接走兜底
        if (!isWeixin || isInitShare.value) {
          showGuide.value = true;
          return;
        }
        initWechatShare(proxy, window.location.href.split('#')[0]);

        let href = window.location.href
        if (href.indexOf('user_token=') > -1) {
          href = href.replace(/user_token=[^&]*/g, '')
        }
        
//   console.log( })

        setShareConfig({
          title: info.value.title,
          desc: info.value.desc,
          link:  href,
          imgUrl: info.value.img,
          success: () => {
            showGuide.value = true;
          },
          fail: (err) => {
            showGuide.value = true;
          }
        });
        isInitShare.value = true;
      } catch (error) {
        showGuide.value = true;
        isInitShare.value = true;
      }
}


onMounted(() => {


    let id = route.query.id
    if (id && typeof id === 'string') {
        counterId.value = id
    }

    if (counterId.value == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }
    if (route.query.type == 'loc') {
        aType.value = 'loc'
        GetGeo()
    } else {
        getActivity('')
    }

})

onBeforeUnmount(() => {

})
</script>

<style lang="scss" scoped>
.guide-img {
    width: 10rem;
}
.main-content.course {

    background: #f7f7f7;
    background-color: #f7f7f7;
    padding-bottom: 2.5rem;
    .top-div {
        background: #fff;
    }

    .top-swipe {
        img {
            margin: 0 0,42rem;
            border: 1px solid #12CB7B;
        }
    }
    .title-div {
        margin: 0.3rem 0.5rem;
        font-size: 0.54rem;
        font-weight: bold;
        color: #000000;
        line-height: 1.5;
    }
    .award-div-div{

     .award-div {
        margin: 0 0.5rem;
        font-size: 0.66rem;
        font-weight: 500;
        color: #F28B00;
        line-height: 0.66rem;
        img {
            width: 0.6rem;
            margin-right: 0.25rem;
        }

            .tip {
                flex: 1;
            }
            span {
                font-size: 0.49rem;
                color: #454444;
            }

        }
        .tip {
            // margin-left: 0.5rem;
            font-size: 0.33rem;
            color: #A1A1A1;;
        }
    }
    .desc-div {
        margin: 0.5rem 0.5rem 0.3rem;
        font-size: 0.33rem;
        color: #A6A2A2;
        div { 
            margin-right: 0.5rem;
        }
        padding-bottom: 0.5rem;
    }

    .content {
        padding: 0.5rem 0.5rem 1rem;

        font-size: 0.35rem;
        color: #333333;
        line-height: 0.65rem;
        background: #ffff;
    }

    

    .desc-img {
        margin:0.5rem;
        width: 9rem;
    }

    .img-bg {
        width: 10rem;
        // height: 5rem;
        background: #12CB7B32;
        // margin-top: -2rem;


        padding-bottom: 2rem;
    }

    .bind-list {
        display: flex;
        flex-wrap: wrap;
        .bind-div { 
            width: 4.4rem;
            margin-left: 0.4rem;
            background: #fff;
            margin-top: 0.5rem;
            img {
                width: 100%;
                height: 2.48rem;
            }
            .bind-title {
                height: 0.8rem;
                font-size: 0.38rem;
                color: #000;  
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                padding: 0.3rem;
                font-weight: bold;
            }

            .bind-desc {
                font-size: 0.33rem;
                color: #000;  
                line-height: 1.5;
                padding: 0.3rem;
                span {
                    color: #F28B00;
                }
            }
            .footer {

                padding: 0 0.3rem 0.2rem;
                .footer-btn {
                    flex: 1;
                    height: 0.8rem;
                    line-height: 0.8rem;
                    text-align: center;
                    font-size: 0.33rem;
                    color: #fff;
                }
                .award-btn {
                    background: #dde8fc;
                    border-radius: 0.1rem 0 0 0.1rem;
                    color: #000000;
                }
                .detail-btn {
                    background: #4e86f3;
                    border-radius: 0 0.1rem  0.1rem 0;
                    color: #FFFFFF;
                }
            }
        }
    }

    .checkin-list {
    background: #fff;
    
    .checkin-item-custom {
        padding: 0.3rem 0 0.3rem 0.4rem;
        border-bottom: 1px solid #e6e6e6;
        
        &:last-child {
            border-bottom: none;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.1rem;
            .store-name-container {
                 display: inline-flex;
                align-items: center;
                max-width: 100%;

            .store-name {
                font-size: 0.39rem;
                color: #000;
                /* 单行省略核心代码 */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 0.2rem;
                flex: 1;
                min-width: 0;
            }.status-normal, .status-exception {
                    font-size: 0.24rem;
                    padding: 0.05rem 0.15rem;
                    border-radius: 0.2rem;
                    flex-shrink: 0;
                }

                .status-normal {
                    color: #12CB7B;
                    background-color: #12CB7B1A;
                }

                .status-exception {
                    color: #F28B00;
                    background-color: #F28B001A;
                }
            }
            .item-left { 
                 flex: 1;
                min-width: 0;
                margin-right: 0.2rem
            }


            .item-right {
                flex-shrink: 1; /* 防止右侧内容被压缩 */
                width: 2.5rem; /* 根据内容自动调整宽度 */

                .reward-amount {
                    font-size: 0.4rem;
                    color: #F28B00;
                    // margin-right: 0.2rem;
                }

                .action-btn {
                    font-size: 0.28rem;
                    padding: 0.1rem 0.25rem;
                    border-radius: 0.3rem;
                    white-space: nowrap;
                    
                    &.pending {
                        color: #fff;
                        background-color: #F28B00;
                    }
                    
                    &.failed {
                        color: #F28B00;
                        // background-color: transparent;
                    }
                    
                    &.claim {
                        color: #fff;
                        // background-color: #F28B00;
                    }
                }
            }
        }
        
       .checkin-time-label {
            font-size: 0.33rem;
            color: #A7A7A7;
            line-height: 1.5;
            
            div {
                margin-bottom: 0.05rem;
            }
            .exception-div {
                color: #F28B00;
            }
        }

        .checkin-time-label.abnormal {
            color: #F28B00;
        }
        
        .item-footer {
            text-align: right;
            margin-top: 0.2rem;
            
            .reward-btn {
                width: 2.5rem;
                height: 0.7rem;
                font-size: 0.28rem;
                border-radius: 0.35rem;
                background-color: #F28B00;
                color: white;
            }
        }
    }
}

    .fixed-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        width: 10rem;
        height: 1.4rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem 0.1rem 0rem rgb(215,215,215);
        border-radius: 0.2rem 0.2rem 0rem 0rem;

        .bottom-div {
            margin: 0 0.5rem;
            font-size: 0.25rem;
            color: #8F8F8F;
            text-align: center;
            
            img {
                width: 0.6rem;
                margin: 0.1rem;
            }


            .btn {
                margin-top: 0.15rem;
                margin-left: 0.5rem;
                width: 4.55rem;
                height: 1.09rem;
                background: #1248e8;
                border-radius: 1rem;

                font-size: 0.45rem;
                color: #FFFFFF;
                line-height: 1.09rem;

                text-align: center;
                flex: 1;
            }
        }

        
    }

    .share-qrcode-content {
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
}
.share-qrcode-title {
  font-size: 0.37rem;
  font-weight: bold;
  margin: 0 0 4px;
}
.share-qrcode-desc {
  font-size: 0.33rem;
  margin: 0;
}

   
}


</style>

<style lang="scss" >
.red-packet-pop {
    background-color: transparent;
    padding-bottom: 2rem;
    max-width: 100%;

}
</style>