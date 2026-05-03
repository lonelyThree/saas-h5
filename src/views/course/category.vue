    <template>
        <div class="main-content course-index-content">

            <van-tabs v-model:active="active" :color="activeColor" title-active-color="#000"
                sticky swipe-threshold="3"
                title-inactive-colo="#676363" class="class-tab"  @change="handleCategoryChange">
                <van-tab v-for="item in categoryList" :title="item.name" :key="item.id" :name="item.id">
                </van-tab>
            </van-tabs>

            


            <div v-if="loading" flex="dir:top main:center cross:center" class="loading-box">
                <van-loading type="spinner" size="50" :color="activeColor" />
                <p>正在加载……</p>
            </div>

            <van-empty v-else-if="!loading && courseList.length == 0 && recommend.length == 0" description="未发现课程" />
            <van-swipe :autoplay="3000" lazy-render class="swipe" v-if="recommend.length > 0">
                <van-swipe-item v-for="item in recommend" :key="item.link" @click="gotoCourse(item)">
                    <div class="recommend-div">
                        <img :src="item.course_img" />
                        <van-text-ellipsis class="course-title" :content="item.course_title" />
                        <van-text-ellipsis class="course-desc" rows="2" :content="item.course_desc" />
                    </div>

                </van-swipe-item>
            </van-swipe>

            <div class="course-list-div" v-for="item in courseList" :key="item.link">
                <div class="title-div-div" flex="dir:left cross:center main:center">
                    <div class="title-div">{{ item.name }}</div>
                    <div class="desc-div">查看更多</div>
                </div>

                <div class="course-list">
                    <van-cell v-for="citem in item.course_list" :key="citem" class="item-div" @click="gotoCourse(citem)">
                        <div class="item-div" flex="dir:left cross:top main:center">
                            <div class="img-div">
                                <img :src="citem.course_img" />
                            </div>
                            <div class="course-info">
                                <van-text-ellipsis class="course-title" :content="citem.course_title" />
                                <van-text-ellipsis class="course-desc" :content="citem.course_desc" />
                                <div class="course-teacher">主讲人：{{ citem.teacher_name }}</div>
                                <div class="course-view">{{ citem.view }}人学习</div>
                            </div>

                        </div>
                    </van-cell>
                </div>

            </div>


        </div>

    </template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"
import { useRouter } from 'vue-router'

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()

const activeColor = ref('#1248e8')

//van-tabs__nav van-tabs__nav--line van-tabs__nav--complete
//van-tabs__nav van-tabs__nav--line

const loading = ref(true)
const adcode = ref('')
const courseList = ref([])
const recommend = ref([])
const categoryList = ref([])
const active = ref("")

function getCourseList(categoryId) {
    loading.value = true
    recommend.value = []
    courseList.value = []
    proxy.$axios.get(proxy.$config.domain + 'Course/IndexList?addcode=' + adcode.value + '&category_id=' + categoryId).then(response => {
        loading.value = false
        if (response.data.code === 200) {

            const d = response.data.data
            if (d && d.recommend) {
                recommend.value = d.recommend
            }

            if (d && d.list) {
                courseList.value = d.list
            }
        } // router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )


    })
        .catch(e => {
            loading.value = false
            // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
}

function getCategory() {
    proxy.$axios.get(proxy.$config.domain + 'Course/Index?addcode=' + adcode.value).then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            if (d) {
                categoryList.value = d
            
                
                return
            }
        }
        router.replace({ path: '/404', query: { msg: '暂没有课程学习' } })

    })
        .catch(e => {

        });
}


function handleCategoryChange(name, title) {
    getCourseList(name)
}
function gotoCourse(item) {
    router.replace({ name: 'CourseCourse', query: { id: item.link, type: item.type == 3 ?'loc':'' } })

}


function showGeoPosition(position) {
    adcode.value = position.adcode
    // console.log(position, "showGeoPosition=====")
    getCategory()
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
    GetGeo()

})

onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content.course-index-content {
    background: #f6f6f6;
    padding-bottom: 1rem;

    .class-tab {
        --van-tab-font-size: 36px;
        /* 基础字体大小 */
    }

    .loading-box {
        margin-top: 3rem;
        color: #000;

        p {
            line-height: 1.5rem;
            font-size: 0.32rem;
            color: #888;
        }
    }

    /* 未选中状态 */
    :deep(.van-tab) {
        font-size: 0.36rem;
       min-width: 2.7rem;
        /* 设置最小宽度基准值 */
        flex: 0 0 auto;
        /* 禁止flex项收缩 */
    }


    /* 选中状态 */
    :deep(.van-tab--active) {
        font-size: 0.43rem;
        font-weight: bold;
    }

    .swipe {
        margin: 0.5rem 0.4rem 0;
        border-radius: 0.3rem;
        background-color: #fff;

        .recommend-div {

            padding-bottom: 1rem;

            div {
                padding: 0 0.3rem;
            }

            .course-title {
                font-size: 0.49rem;
                color: #000;
                line-height: 0.6rem;
                margin-top: 0.4rem;
            }

            .course-desc {
                margin-top: 0.4rem;
                display: -webkit-box;
                font-size: 0.33rem;
                color: #C1BCBC;
                line-height: 0.5rem;
                ;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;

            }
        }
    }

    .course-list-div {
        margin: 0 0.4rem;

        .title-div-div {
            margin: 0.4rem 0;
            font-size: 0.39rem;
            color: #AFAAAA;

            .title-div {
                flex: 1;
                font-size: 0.49rem;
                color: #000;
            }
        }

        .course-list {
            background: #fff;
            // padding: 0 0.3rem;

            .item-div {
                .img-div {
                    width: 3.33rem;
                    height: 1.86rem;
                    margin-right: 0.3rem;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .course-info {
                width: 4.5rem;
                flex: 1;
                text-align: left;
                font-size: 0.33rem;

                .course-title, .course-desc {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;

            }

                .course-title {
                    font-size: 0.46rem;
                    color: #000;
                    line-height: 1;
                    overflow: hidden;
                }

                .course-desc {
                    color: #C1BCBC;
                    line-height: 1;
                    margin-top: 0.4rem;
                    overflow: hidden;

                }
                .course-teacher { 
                    color: #B8B5B5;
                    margin-top: 0.3rem;
                    line-height: 1;
                }
                .course-view {
                    color: #F98E2B;
                    margin-top: 0.3rem;
                    line-height: 1;

                }
            }

        }
    }



}
</style>