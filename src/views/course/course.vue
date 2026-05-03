<template>
    <div class="main-content course" ref="course_content">
        <div class="top-div">
        <img :src="info.img" />
        <div class="title-div">
            {{ info.title }}
        </div>
        <div class="award-div" v-if="info?.award_type == 2" flex="dir:left main:left cross:center">
            <img src="../../assets/icons/credit.png"/>
            <span>积分</span>
            ＋{{ info.money + info.view_money}}
        </div>
        <div class="award-div" v-else-if="info?.award_type == 3" flex="dir:left main:left cross:center">
            <img src="../../assets/icons/credit.png"/>
            <span>星币</span>
            ＋{{ ((info.money + info.view_money)/ 100 || 0 ).toFixed(2) }}
        </div>
        <div class="award-div" v-else flex="dir:left main:left cross:center">
            <img src="../../assets/icons/red.png"  />
            <span>红包</span>
            ＋{{ ((info.money + info.view_money)/ 100  || 0).toFixed(2)}}
        </div>
        <div class="desc-div"  flex="dir:left main:left cross:center">
            <div>考试奖励：{{ info.award_type == 2 ? info?.money : ((info?.money ?? 0) / 100).toFixed(2)}} {{ info.award_type == 2 ? '积分':(info.award_type == 3 ? '星币':'元红包') }}</div>
            <div>课程数：{{ info.video_list?.length || 0 }}</div>
            <div>学习人数：{{ info.view}}</div>
        </div>
        </div>
        
        <van-tabs v-model:active="active" :border="true">
            <van-tab title="简介">
                <div class="content"  v-html="info.desc"></div>
            </van-tab>
            <van-tab title="目录">
                <div class="video-list"  v-if="info.video_list?.length > 0">
                    <div class="video-div" v-for="item in info.video_list" :key="item.id" flex="dir:left main:left cross:center"
                         @click="startClick(item.id)" >
                        <div class="video-icon">视频</div>
                        <div class="video-title" flex="dir:left main:left cross:center">
                            <div>{{ item.name }}</div>
                            <img src="../../assets/img/suc-rgb.png" v-if="item.is_award == 1" />
                        </div>
                        
                        <div class="video-process">{{ item.view_time + 1>= item.total_time ? 100 : (item.view_time * 100 /item.total_time || 0).toFixed(0) }}%</div>
                    </div>
                </div>
                <van-empty description="暂无视频"  image-size="4rem"  v-else/>
            </van-tab>
            <van-tab title="老师">
                <div class="teacher-div" flex="dir:left main:left cross:top" v-if="info.teacher_info"
                  @click="goTeacherClick(info.teacher_info)">
                    <div class="teacher-avatar">
                        <img :src="info.teacher_info.avatar" />
                    </div>
                    <div class="teacher-info">
                        <div class="teacher-name" flex="dir:left main:left cross:baseline">
                           <div>{{ info.teacher_info.name }}</div>
                           <div class="teacher-title">{{ info.teacher_info.title }}</div>
                        </div>
                        <div class="teacher-desc">{{ info.teacher_info.desc }}</div>
                    </div>
                    
                </div>
            </van-tab>
            <van-tab title="试卷">
                <div class="question-list" v-if="info.question_list?.length > 0">
                    <van-cell v-for="item in info.question_list" :key="item.id" class="question-item" @click="questionClick(item.id)">
                        <div class="question-name">{{ item.name }}</div>
                        <div class="question-info" flex="dir:left cross:center main:center">
                            <div class="question-desc">
                                <span>{{ info.award_type == 2 ? item.money: item?.money.toFixed(2)}} </span>
                                {{ info.award_type == 2 ? '积分':(info.award_type == 3 ? '星币':'元') }}
                                <span class="question-view">{{ item.exam_num }}</span>
                                人考试
                            </div>
                            <div class="question-btn">
                                开始做题
                            </div>

                        </div>
                    </van-cell>
                </div>
                <van-empty description="暂无试卷" image-size="4rem"  v-else/>
            </van-tab>
        </van-tabs>
  
        <div class="fixed-bottom">
            <div class="bottom-div" flex="dir:left cross:center">
                <div class="share-div" @click="shareClick">
                    <img src="../../assets/icons/share.png" />
                    <div class="share-text">分享</div>
                </div>
     
                <div class="btn"  @click="startClick('')">开始学习</div>
            </div>
        </div>


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


const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const showNoStartPop=ref(false)
const noStartImg = ref('')

const showGuide = ref(false)
const isInitShare = ref(false)



let info = ref({})


let courseId = ''
let aType = ''


setToastDefaultOptions({ duration: 2000 });

function startClick(videoId) {
    router.replace({ name: 'CourseVideo', query: { id: courseId, video_id:videoId } })
}

function questionClick(questionId) {
    router.replace({ name: 'CourseQuestion', query: { id: questionId, course_id:courseId } })
}


function goTeacherClick(item) {
    router.replace({ name: 'CourseTeacher', query: { id: item.id } })
}

function getActivity(adcode) {
 
    proxy.$axios.get(proxy.$config.domain + 'Course/Info?id=' + courseId + '&adcode=' + adcode).then(response => {
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
                    router.replace({ name: 'UserReg', query: { id: courseId, page: 'CourseCourse', type: aType, 
                        auth_type: d.auth_type } })
                });

                return
            } else if (d.status == activityInfoStatus.ActivityInfoStatusAuth) {
                showDialog({
                    message: '认证成功后才能参加活动哦',
                    confirmButtonText: '去个人中心',
                }).then(() => {
                    router.replace({ name: 'UserMine', query: { id: courseId, page: 'CourseCourse', type: aType } })
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
                    router.replace({ name: 'CourseIndex' })
                });

                return
            }   else if (d.status == 3 || d.status == 5 || d.status == 6) {
                showNoStartPop.value = true
                noStartImg.value = d.tip_img
            } else {
            }

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
        courseId = id
    }

    if (courseId == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }
    if (route.query.type == 'loc') {
        aType = 'loc'
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
    .title-div {
        margin: 0.3rem 0.5rem;
        font-size: 0.54rem;
        font-weight: bold;
        color: #000000;
        line-height: 1.5;
    }

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

    .video-list {
        background: #fff;
        font-size: 0.37rem;
        color: #626161;
        padding: 0.4rem;
        .video-div {
            margin-bottom: 0.4rem;
            img {
                width: 0.38rem;
                margin-left: 0.15rem;
            }
            .video-icon {
                border: 1px solid #626161;
                font-size: 0.28rem;
                padding: 0.1rem;
                margin-right: 0.15rem;
                line-height: 0.28rem;
                border-radius: 0.1rem;
            }
            .video-title {
                flex: 1;
                margin-right: 0.15rem;
            }

            .video-process {
                font-size: 0.33rem;
                color: #04D809;
            }

        }
    }
    .teacher-div{
        
        margin: 0.4rem;
        background: #fff;
        padding: 0.3rem 0.4rem 0.5rem;
        border-radius: 0.2rem;
        .teacher-avatar {
            img {
                width: 1.2rem;
                height: 1.2rem;
                border-radius: 50%;
            }
            margin-right: 0.15rem;
        }
        .teacher-name {
            font-size: 0.48rem;
            color: #393939;
            .teacher-title {
                margin-left: 0.15rem;
                font-size: 0.33rem;
                color: #A6A2A2;
            }
        }
        .teacher-desc {
                font-size: 0.33rem;
                color: #605E5E;
                margin-top: 0.15rem;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                overflow: hidden;
                
            }
    }

    .question-list{
        
        margin: 0.4rem;
        background: #fff;
        border-radius: 0.2rem;
        text-align: left;
        .question-item {
            padding-bottom: 0.35rem;
        }
        .question-item::after {
            left: 0;
            right: 0;
        }
        .question-name { 
            text-align: left;
            font-size: 0.43rem;
            color: #494747;
        }
        .question-desc {
            flex: 1;
            font-size: 0.3rem;
            color: #706C6C;
             text-align: left;
            span {
                color: #F66666;
            }
            .question-view {
                margin-left: 0.5rem;
            }
        }
        .question-btn {
            font-size: 0.33rem;
            line-height: 0.33rem;
            color: #626161;
            border: 1px solid #ccc;
            border-radius: 0.1rem;
            padding: 0.2rem
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
}


</style>

<style lang="scss" >
.red-packet-pop {
    background-color: transparent;
    padding-bottom: 2rem;
    max-width: 100%;

}
</style>