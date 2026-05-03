<template>
    <div class="comment-content" @touchmove.prevent>
      <div class="pop-con">
          <img @click="closeComment" class="close-img" src="@/../static/img/patient/comment-close.png" alt="">
          <h2>评价</h2>
          <ul class="star-list">
              <li @click="selStar(index)" v-for="(item,index) in 5" :key="index">
                  <img v-if="index<selIndex" src="@/../static/img/patient/comment-star-bigy.png" alt="">
                  <img v-else src="@/../static/img/patient/comment-star-bigg.png" alt="">
              </li>
          </ul>
          <h4>{{titleTxt}}</h4>
          <ul class="ques-list" v-if="selIndex<=2">
              <li @click="selQues(item,index)" v-for="(item,index) in queslist" :key="index" :class="item.sel?'select':''">{{item.text}}</li>
          </ul>
          <p v-if="type=='undo'" class="area-p">
              <textarea maxlength="150" v-model="content" placeholder="问诊过程还满意吗？说说您的感受和建议吧。" name="" id="" cols="30" rows="10"></textarea>
              <span> <i>{{content.length}}</i>/150</span>
          </p>
          <p v-if="type=='done'&&commentInfo.content" class="comment-detail">{{commentInfo.content}}</p>
          <button @click="submit" :class="(selTagCon.length&&selTagCon.length>0)||selIndex>=3?'':'notext'" v-if="type=='undo'">提交</button>
          <button @click="closeComment" v-if="type=='done'" class="know-btn">我知道了</button>
      </div>
      <div class="mark-bg" @touchmove.prevent></div>
    </div>
</template>
<script>
import { showToast } from 'vant'
export default {
    data(){
        return{
            selIndex:5, //打分
            queslist:[
                {sel:false,text:'解决部分问题'},
                {sel:false,text:'接诊时间长'},
                {sel:false,text:'回复速度慢'},
                {sel:false,text:'排队时间长'}]
            ,
            selTagCon:[],
            titleTxt:'非常满意',
            content:'',
        }
    },
    props:['type','id','commentInfo'],
    mounted(){
        this.$nextTick(()=>{
            if(this.type=='done'){
                 this.selIndex = this.commentInfo.score
                    let list = this.commentInfo.tag
                    this.queslist = [];
                    list.forEach((element)=>{
                          this.queslist.push({
                              text:element
                          })  
                    })
            }
        })
    },
    watch:{
        selIndex(val){
            switch (val){
                case 1:
                    this.titleTxt = '非常不满意'
                break;  
                case 2:
                    this.titleTxt = '不满意'
                break;  
                case 3:
                    this.titleTxt = '一般'
                break;  
                case 4:
                    this.titleTxt = '满意'
                break;  
                case 5:
                    this.titleTxt = '非常满意'
                break;    
            }
        },
    },
    methods:{
        selStar(index){
            this.selIndex = index+1
        },
        selQues(item,index){
            this.queslist[index].sel = !this.queslist[index].sel;
            if(this.queslist[index].sel){
                this.selTagCon.push(item.text)
            }else{
                this.selTagCon.forEach((element,i) => {
                    if(element==item.text){
                        this.selTagCon.splice(i,1)
                    }
                });
            }
            console.log(this.selTagCon)
        },
        closeComment(){
            this.$emit('close')
        },
        submit(){
            let params={
                score:this.selIndex,
                tag:this.selTagCon.join(','),
                content:this.content,
                id:this.id
            }
            this.$axios.post('/api/addComment', params).then(response => {
                console.log(response)
                if (response.data.status == 200) {
                     this.$emit('commentSucc')
                } else {
                    showToast(response.data.message)
                    this.$emit('close')
                }
            })
            .catch(error => {
                console.log(error)
            });
        }
    }
}
</script>
<style lang="scss">
$r:75;
.comment-content{
    .pop-con{
        width:8.93rem;
        height:auto;
        background: #fff;
        border-radius: 0.16rem;
        position: fixed;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        z-index: 1000;
        .close-img{
            width:32rem/$r;
            height:32rem/$r;
            position: absolute;
            right:16rem/$r;
            top:16rem/$r;
        }
        h2{font-size:32rem/$r; text-align: center; margin:44rem/$r 0 30rem/$r 0; color:#181818; font-weight: normal;}
        .star-list{
            display: flex; flex-direction: row; justify-content: center; margin-bottom:20rem/$r;
            li{
                img{width:64rem/$r; height:64rem/$r; margin:0 15rem/$r;}
            }
        }
        h4{color:#EFAA05; font-size: 24rem/$r; height:34rem/$r; margin-bottom:30rem/$r; text-align: center; font-weight: normal;}
        .ques-list{
            display: flex; flex-direction: row; flex-wrap: wrap; justify-content: left; padding-left:0.35rem;
            li{
                width:280rem/$r; height:64rem/$r; line-height: 64rem/$r; border:1px solid #DADADA; box-sizing: border-box;
                font-size:24rem/$r; color:#666666; border-radius: 8rem/$r; text-align: center; margin:0 15rem/$r 30rem/$r;
            }
            li.select{
                color:#01B7C5; border-color:#01B7C5; background: #F9F8FE;
            }
        }
        .area-p{
            position: relative; width: 590rem/$r;height: 144rem/$r; box-sizing: border-box;margin-left:40rem/$r;  margin-bottom:45rem/$r;
            span{font-size:12rem/$r;position: absolute; right:30rem/$r; bottom:12rem/$r; color:#999999; i{font-style: normal; color:#8C72D8;}}
        }
        textarea{width: 590rem/$r; font-size: 28rem/$r;
                height: 144rem/$r; color:#333;
                background: #F3F4F6;-webkit-appearance: none;
                border-radius: 8rem/$r;
                border:1px solid #EEEEEE;
                padding:10rem/$r 13rem/$r; box-sizing: border-box;
                }
        .comment-detail{
            padding:0 40rem/$r; color:#333; font-size:28rem/$r; margin-bottom:50rem/$r;
        }    
        button{
            width: 590rem/$r;
            height: 72rem/$r;
            background: #01B7C5;
            border-radius: 12rem/$r;
            border: 1px solid #8C72D8;
            line-height: 72rem/$r; display: block;
            text-align: center;
            color:#fff; font-size: 32rem/$r; margin: 0 auto 32rem/$r;
        } 
        .know-btn{
            margin: 0 auto 32rem/$r;
        }   
        .notext{background: #EAEAEA; color:#fff;border-color:#EAEAEA;}
    }
    .mark-bg{
        z-index: 999;
        position: fixed;
    }
}

</style> 