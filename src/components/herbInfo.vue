<template>
    <div class="herb-info order-tetail" :class="{ 'box-wrap': title }">
        <p class="box-wrap-title" v-if="title">{{ title }}</p>
        <ul class="goods-ul">
            <li class="goods-li" flex="dir:left cross:center">
                <div class="goods-img-wrap" flex="dir:left cross:center main:center">
                    <img class="" src="../../static/img/doctor/herb-icon.png" alt="">
                </div>
                <div class="goods-info">
                    <p class="name pret-name">{{ pret_info }}</p>
                    <div flex="dir:left cross:center main:justify">
                        <p class="price"></p>
                        <p class="num pret_num">共{{ pret_num }}剂</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type: String,
            default:'',
        },
        pret_info:{
            type: String,
            default:'',
        },
        pret_num:{
            type: String,
            default:'',
        }
    }
}
</script>
<style lang="scss">
.herb-info .box-wrap-title {
    padding: 0.42rem 0.35rem 0.42rem 0;
    height: 0.39rem;
    font-size: 0.38rem;
    color: rgba(51, 51, 51, 1);
    line-height: 0.39rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}



.herb-info.order-tetail {
    width: 92%;
    margin: 0 auto;
    .goods-ul {
        border-top: 1px solid #F6F6F6;

        .goods-li {
            margin: 0.43rem 0;

            .goods-img-wrap {
                width: 1.55rem;
                height: 1.55rem;
                border: 1px solid #F6F6F6;
                border-radius: 0.15rem;
                margin-right: 0.27rem;

                img {
                    width: auto;
                    height: auto;
                    max-height: 1.5rem;
                    max-width: 1.5rem;
                }
            }

            .goods-info {
                width: 6.48rem;
            }

            .name {
                height: 0.53rem;
                font-size: 0.37rem;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 0.53rem;
                margin-bottom: 0.05rem;
            }

            .pret-name {
                height: auto;
                line-height: 2;
                word-break: break-all;

                white-space: pre-wrap;
            }

            .man {
                height: 0.37rem;
                font-size: 0.27rem;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                line-height: 0.37rem;
                margin-bottom: 0.21rem;
            }

            .price {
                height: 0.37rem;
                font-size: 0.37rem;
                color: rgba(234, 71, 71, 1);
                line-height: 0.37rem;
                letter-spacing: 1px;

                span {
                    font-size: 0.27rem;
                }
            }

            .num {
                height: 0.32rem;
                font-size: 0.32rem;
                color: rgba(153, 153, 153, 1);
                line-height: 0.32rem;
            }

            .num.pret_num {
                font-size: 0.37rem;
                line-height: .5rem;
                height: 0.5rem;
            }
        }
    }
}
.herb-info.box-wrap {
    border-radius: 0.21rem;
    margin: 0 auto;
    width: 9.2rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rem 0rem 0.11rem 0rem rgba(0, 0, 0, 0.08);
    border: 0.01rem solid rgba(246, 246, 246, 1);
    box-sizing: border-box;
    margin-bottom: 0.27rem;
    padding-left: 0.4rem;
}
</style>