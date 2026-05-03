<template>
    <div class="main-content" v-if="type != 2">
        <div :style="{background: 'linear-gradient(to bottom,'+bgColor+' 0%, '+bgColor+'88 50%, '+bgColor+'10 100%', height: '3.91rem', marginBottom: '-3rem'}">
        </div>
        <van-swipe :autoplay="3000" lazy-render class="top-swipe">
            <van-swipe-item v-for="item in topList" :key="item.img" @click="gotoUrlPath(item.link)">
                <div style="margin: 0 0.42rem;">
                    <img :src="item.img"  :style="{  borderRadius:'0.4rem 0.4rem 0.7rem 0.7rem'}" />
                </div>
                
            </van-swipe-item>
         </van-swipe>

         <div class="top-items">
           <ul>
             <li v-for="(item,index) in btnList"  :key="item.title"   @click="gotoUrlPath(item.link)">
               <p><img :src="item.img" alt=""></p>
               <p>{{item.title}}</p>
             </li>
           </ul>
        </div>

        <van-swipe :autoplay="3000" lazy-render style="margin-top: 0.5rem;" >
            <van-swipe-item v-for="item in centerList" :key="item.img" @click="gotoUrlPath(item.link)">
                <img :src="item.img"   />
                
            </van-swipe-item>
         </van-swipe>

        <div class="title-div-div">
            <div class="title-div" flex="dir:left cross:center">
                <div class="title-bg" :style="{ background:  bgColor }"></div>
                活动列表
                
            </div>
        </div>
        <div v-for="(item, index) in hotList" class="speak-li" :key="item.img"  @click="gotoUrlPath(item.link)">
            <img :src="item.img">
        </div>
        
        <div class="tip-div" flex="dir:left cross:center main:center">
            <img src="../../assets/img/speak/no-more.png" />
            <div>暂时没有更多活动了~</div>
        </div>

    </div>
     <div class="main-content university" v-else>
        <img v-if="data.company_imgs" :src="data.company_imgs" />
        <img v-else src="../../assets/img/mine/reg-top-bg.png" />
        <div class="top-div-line">
            <div class="top-div">
                <img  :src="data.company_logo" />
                <div class="title-div">
                    {{ data.company_name }}
                </div>
            </div>
            <div class="num-div" flex="dir:left cross:center main:left">
                <span>{{ data.teacher_list.length  || 0}} </span> 位老师  
                <span class="course-num">{{ data.course_list.length || 0}} </span> 门课程
            </div>
        </div>

        <van-tabs v-model:active="active" :border="true">
            <van-tab title="课程">
                <div class="course-list"  v-if="data?.course_list?.length > 0">
                    <div class="course-div" v-for="item in data.course_list" :key="item.id" 
                         @click="goCourseClick(item)" >
                          <img :src="item.img"  />
                        <div class="course-title">{{ item.title }}</div>
                        <div class="course-desc" flex="dir:left main:justify cross:center">
                            <div>{{ item.teacher_name }}</div>
                            <div v-if="item?.money > 0">
                                {{ item.award_type == 2 ? item.money: (item.money / 100.0).toFixed(2)}}
                                {{ item.award_type == 2 ? '积分':(item.award_type == 3 ? '星币':'元') }}
                            </div>
                        </div>
                        
                    </div>
                </div>
                <van-empty description="暂无视频"  image-size="4rem"  v-else/>
            </van-tab>
            <van-tab title="老师">
                <div class="video-list"  v-if="data?.teacher_list?.length > 0">
                    <div class="teacher-div" v-for="item in data.teacher_list" :key="item.id" 
                    @click="goTeacherClick(item)"
                    flex="dir:left main:left cross:top">
                        <div class="teacher-avatar">
                            <img :src="item.avatar" />
                        </div>
                        <div class="teacher-info">
                            <div class="teacher-name" flex="dir:left main:left cross:baseline">
                                <div>{{ item.name }}</div>
                                <div class="teacher-title">{{ item.title }}</div>
                            </div>
                            <div class="teacher-desc">{{ item.desc }}</div>
                        </div>
                    </div>
                </div>
                <van-empty description="暂无讲师" image-size="4rem" v-else/>
            </van-tab>
            <van-tab title="说明">
                 <div class="desc-html" v-html="data.desc" v-if="data.desc"> </div>
                <van-empty description="暂无说明" image-size="4rem" v-else />
            </van-tab>
            <van-tab title="榜单">
                <van-empty description="暂无榜单" image-size="4rem" />
            </van-tab>
        </van-tabs>


            

     </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"

import { useRouter } from 'vue-router'
import { showToast } from "vant";

const { currentRoute } = useRouter()
const router = useRouter()

const { proxy } = getCurrentInstance()

const route = currentRoute.value;

const bgColor = ref('#1248e8')
const topList = ref([])
const btnList = ref([])
const centerList = ref([])
const hotList = ref([])

const type = ref(1)
const data = ref({})


const jumpMiniProgram = ref(false)
const aid = ref(proxy.$route.query.id)


function getActivity() {
    proxy.$axios.get(proxy.$config.domain + 'Company/ActivityIndex?a_id='+aid.value).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if(d.status != 1) {
                router.replace({ path: '/404', query: { msg:'活动不存在' } })
                return
            }
            if(d.type == 2) {
                type.value = 2
                data.value = d
                return
            }
            type.value = 1

            d.forEach(item => {
                if(item.type == 1) {
                    bgColor.value = item.title
                } else if (item.type == 2) {
                    topList.value = topList.value.concat(item)
                } else if (item.type == 3) {
                    btnList.value = btnList.value.concat(item)
                } else if (item.type == 4) {
                    centerList.value = centerList.value.concat(item)
                } else if (item.type == 5) {
                    hotList.value = hotList.value.concat(item)
                }
                
            });
            
        } else {
            // console.log(response.data.code, "response.data.code", response)
            // showEmpty.value = true
            // tipMessage.value = '网络连接错误，请刷新重试'
            showToast(response.data.msg? response.data.msg :'活动获取失败')

        }
    }).catch(error => {
        // showToast('活动获取失败')
        console.log(error, '活动获取失败')
    });
}

function gotoUrlPath(url) {
    if(!url) {
        return
    }
    if(!jumpMiniProgram.value) {
        window.location.replace(url)
        return
    }
    let urlPath = encodeURIComponent(url)
    
    wx.miniProgram.getEnv(function(res) {
       if(res.miniprogram) {
            wx.miniProgram.navigateTo({url: '/pages/h5_jump/index?url=' + urlPath})
            return
       }
       window.location.replace(url)

    })
}

function goCourseClick(item) {
    router.replace({ name: 'CourseCourse', query: { id: item.id, type: item.limit_type == 3 ?'loc':'' } })
}

function goTeacherClick(item) {
    router.replace({ name: 'CourseTeacher', query: { id: item.id } })
}

function getJsTicket() {
    let url = window.location.href.split('#')[0]
    proxy.$axios.get(proxy.$config.domain + 'User/GetTicketSign?url='+ encodeURIComponent(url)).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            wx.config({
                debug: false,
                appId: d.appId,
                timestamp: d.timestamp,
                nonceStr: d.nonceStr,
                signature: d.signature,
                jsApiList: ['chooseImage'],
                openTagList: ['wx-open-launch-weapp']
            })
            wx.ready(function () {
                console.log('成功了')
            })
            wx.error(function (res) {
                console.log(res)
            })


        } else {
            // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )

        }
    })
    .catch(error => {
        // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    });
}

onMounted(() => {
    let channel_name = route.query.channel_name
    if(channel_name && typeof channel_name === 'string' && channel_name == 'weapp') {
        jumpMiniProgram.value = true
        getJsTicket()
    }

    if (aid.value == "") {
        router.replace({ path: '/404', query: { msg: '活动不存在' } })
        return
    }
    getActivity()
    

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content {
    padding-bottom: 0.8rem;
    background: #FFFFFF;
}
.title-div-div {
    .top-swipe {
        img {
            margin: 0 0,42rem;
            border: 1px solid #12CB7B;
        }
    }
   
    .title-div {
        margin-top: 0.2rem;
        font-size: 0.5rem;
        font-weight: bold;
        color: #494948;
        padding:0.3rem 0;
        background: #FFFFFF;
        .title-bg {
            width: 0.08rem;
            height: 0.68rem;
            background: #12CB7B;
            margin-right: 0.28rem;
            margin-left: 0.42rem;
        }
    }
}

.top-items{ 
        display: flex; 
          margin-top: 0.5rem;
          background:#fff;
          ul{
            display: flex; padding:0 1rem;width:100%; 
            justify-content: space-between;
            li{
            box-sizing: border-box;
              text-align: center;flex:none;
              img{width:1.13rem; height:1.13rem;}
              p{color: #494948;; font-size:0.28rem; margin-top:0.1rem;}
            }
        }
    }
.speak-li {
    margin: 0rem 0.42rem 0.4rem;
    background: #FFFFFF;
    border-radius: 0.27rem;
    box-shadow:0rem 0rem 0.5rem 0rem rgba(128,99,163,0.18);
}
.tip-div {
    font-size: 0.4rem;
    line-height: 1rem;
    color: #aaa;
    img {
        width:0.68rem;
        margin-right: 0.1rem;
    }
}

.main-content.university {
    padding-bottom: 1rem;
    background: #f7f7f7;
    .top-div-line {
        
        background: #FFFFFF;
        margin-bottom: 0.2rem;
        .top-div {
            // margin-top:-.6rem;
        height: 2.1rem;
        border-radius: 0.52rem 0.52rem 0 0;
        
        position: relative;

        padding-left: 2.7rem;
        padding-top: 0.3rem;

        font-size: 0.5rem;
        font-weight: bold;
        color: #333333;
        img {
            width: 2.1rem;
            height: 2.1rem;
            border-radius: 50%;
            position: absolute;
            top: -0.5rem;
            left: 0.3rem;
        }
        
    }
    .num-div {
        font-size: 0.35rem;
        color: #9FA2A3;
        padding: 0rem 0.35rem 0.5rem;
        span {
            font-size: 0.59rem;
            color: #000000;
            font-weight: bold;
            margin: 0 0.1rem;
        }
        .course-num {
            margin-left: 0.6rem;
        }
    }
    }
    .course-list {
        display: flex;
        flex-wrap: wrap;
        .course-div { 
            width: 4.4rem;
            margin-left: 0.4rem;
            background: #fff;
            margin-top: 0.5rem;
            img {
                width: 100%;
                height: 2.48rem;
            }
            .course-title {
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

            .course-desc {
                font-size: 0.33rem;
                color: #000;  
                line-height: 1.5;
                padding: 0.3rem;
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
            margin-right: 0.3rem;
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
    .desc-html {
        margin: 0.5rem 0.4rem 0;

        font-size: 0.35rem;
        color: #333333;
        line-height: 0.65rem;
    }

}

</style>