<template>
    <section class="tab-wrap">
        <ul>
            <router-link v-for="(item, index) in tabList" :key="index" :to="item.path"
                custom v-slot="{ navigate }" replace>
                <li @click="navigate" @keypress.enter="navigate" role="link">
                <p class='p-img'>
                    <img @click="imgClick(item, index)" :src="item.img" alt="">
                </p>
                <p @click="imgClick(item, index)" class="p-title" :class="item.class">{{ item.name }}</p>
            </li>
            </router-link>
        </ul>
    </section>
</template>
<script>
import { ref } from 'vue';
export default {
    props: {
        index: Number,
        aid: String
    },
    setup(props) {
        // const active = ref(props.index);
        const aid = ref(props.aid);
        const iconArr = ['index', 'desc', 'rank']
        const nameArr = ['答题', '活动说明', '排行']
        let tabList = []
        iconArr.forEach((el, index) =>  {
            let img = require('../assets/icons/' + el + '.png')
            let cla = ''
            if(props.index == index) {
                img = require('../assets/icons/' + el + '-sel.png')
                cla = 'sel'
            }
            tabList.push({
                name:nameArr[index],
                img: img,
                path:'',
                class: cla,
                path2:'/ask/'+el+'?id='+aid.value
            })
        })
        return { tabList };
    },
    methods: {
        imgClick(item, index) {
            console.log(item, index, "==wx_appid==")
            window.location.replace(item.path2 + "&wx_appid=" + this.$route.query.wx_appid)
        },
    }
};
</script>
<style lang="scss">
.tab-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;

    ul {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 1.49333rem;
        background: #fff;
        padding-top: 0.24rem;
        box-sizing: border-box;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
            font-size: 12px;

        li {
            text-align: center;
            width: 25%;

            .p-img {
                position: relative;

                img {
                    width: 0.51rem;
                    height: 0.51rem;
                }
            }
        }

        .p-title {
            color: #0E050A;
            font-size: 0.29rem;
            margin-top:0.13rem;
        }

        .sel {
            color: #EFA52D;
        }
    }

    li.router-link-active{ .p-title{color:#EFA52D;}}
    .pos-dot {
        width: 0.44rem;
        height: 0.44rem;
        position: absolute;
        background: #F75257;
        right: 0.5333rem;
        top: -0.0933rem;
        text-align: center;
        color: #fff;
        border: 1px solid #fff;
        display: flex;
        justify-content: center;
        border-radius: 50%;
        line-height: -0.44rem;

        i {
            font-style: normal;
        }

        i.more {
            margin-top: -0.0667rem;
            display: inline-block;
        }
    }
}
</style>