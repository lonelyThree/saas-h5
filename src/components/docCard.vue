<template>
  <div class="doc-cards">
    <div class="doc-card" v-for="(item, index) in docList" :key="index" @click="goDoc(item)">
      <dl>
        <dt>
          <img :src="item.doc_photo" alt="">
        </dt>
        <dd>
          <h2>{{ item.doc_name }} <span>在线</span></h2>
          <p class="hos"> {{ item.dep_name }} {{ item.work_inst_name }}</p>
          <p class="good-at yichu2">擅长：{{ item.adept }}</p>
          <p><span class="price">{{ item.price > 0.001 ? '￥' + item.price : '免费' }}</span><span class="desc">{{ item.price >
            0.001 ? '起' : '' }} 图文 | 电话 | 视频等</span><span class="btn">问医生</span></p>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    docList: {
      type: Array,
      default: []
    }
  },
  methods: {
    goDoc(item) {
      //  this.$sensors.track('expertrecommendation_click', {
      //     expertrecommendationid: item.app_doc_id, 
      //     expertrecommendationname: item.doc_name
      // });
      this.$router.push({ name: 'MyDoctorDetail', query: { id: item.app_doc_id, type: 3 } })
    }
  }
}
</script>
<style lang="scss">
$r: 75;

.doc-cards {
  // margin:33rem/$r;
  background: #fff;
  //   .recommend-list{ 
  padding-left: 33rem/$r;
  padding-top: 10rem/$r;
  margin-top: 20rem/$r;

  .doc-card {
    // width: 676rem/$r;
    background: #FFFFFF;
    padding: 40rem/$r 40rem/$r 20rem/$r 0;
    box-sizing: border-box;
    // margin-right: 45rem/$r;
    // border: 1px solid #EBEBEB;
    // box-shadow: 0px 3rem/$r 8rem/$r 1px #EFEFEF;
    // border-radius: 30rem/$r; 
    margin-bottom: 20rem/$r;
    border-bottom: 1px solid #F6F7F9;

    dl {
      display: flex;
      flex-direction: row;

      dt {
        flex: none;

        img {
          width: 82rem/$r;
          height: 82rem/$r;
          border-radius: 50%;
          margin-right: 14rem/$r;
        }
      }

      dd {
        flex: 1;

        h2 {
          font-size: 29rem/$r;
          color: #333;

          span {
            font-size: 21rem/$r;
            color: #fff;
            display: inline-block;
            width: 67rem/$r;
            height: 29rem/$r;
            text-align: center;
            background: #E28C5B;
            border-radius: 4px;
          }

          height: 40rem/$r;
          margin-bottom:2rem/$r;
        }

        p.hos {
          font-size: 25rem/$r;
          color: #0D0D0D;
          margin-bottom: 20rem/$r;
          height: 36rem/$r;
        }

        p.split {
          height: 2px;
          display: flex;
          margin-left: -70rem/$r;

          img {
            width: 450rem/$r;
            height: 2rem/$r;
          }

          margin-bottom:26rem/$r;
        }

        p.good-at {
          font-size: 25rem/$r;
          color: #959696;
          margin-bottom: 30rem/$r;
        }

        span.price {
          font-size: 33rem/$r;
          font-weight: 500;
          color: #F6331D;
        }

        span.desc {
          font-size: 22rem/$r;
          color: #999999;
        }

        span.btn {
          display: inline-block;
          font-size: 29rem/$r;
          color: #FFFFFF;
          background: #01B7C5;
          width: 138rem/$r;
          height: 62rem/$r;
          border-radius: 33rem/$r;
          margin-bottom: 0;
          float: right;
          text-align: center;
          line-height: 62rem/$r;
        }
      }

      //     }
    }
  }
}</style>