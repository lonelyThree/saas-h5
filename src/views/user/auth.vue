<template>
    <div class="main-content">
        
        <div class="reg-bg">
            <div class="top-div">
                <div class="top-title">请上传身份认证照片</div>
                <div class="top-desc">真实性核验</div>
                <div class="upload-div">
                    <van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="6" />
                </div>
            </div>
            
            <div class="auth-label">
                上传资料说明
            </div>
            <div class="auth-desc">
                可上传工牌照片、手持小票个人签名的店内自拍照等
            </div>
            <van-button class="submit-btn" disabled v-if="authStatus == 1">已通过审核</van-button>
            <van-button class="submit-btn" @click="submitInfo" :loading="submitLoading"  loading-text="保存中..." v-else>提交审核</van-button>

            <div  class="question-link" @click="goMine">
                <span class="quesstion-tip" v-if="routerName == 'mine'">返回主页</span>
                <span class="quesstion-tip" v-else>跳过，下次再说</span>
            </div>
            <div  class="question-link" v-if="authStatus == 4 && reason">
                <span class="quesstion-tip">审核失败原因： {{ reason }}</span>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance, proxyRefs } from "vue"
import { useRouter } from 'vue-router'
import { showToast, setToastDefaultOptions } from "vant";
import * as imageConversion from 'image-conversion';

const { currentRoute } = useRouter();
const route = currentRoute.value;
const router = useRouter()

const { proxy } = getCurrentInstance()



let aid = ""
let routerName = ""
let aType = ""

let sum = 0
const reason = ref('')


let aliyunOssToken = {
    accessid: "",
    callback: "",
    dir: "",
    expire: 0,
    host: "",
    policy: "",
    signature: "",
    url: ''
}


const fileList = ref([])
const submitLoading = ref(false)
const authStatus = ref(0)

setToastDefaultOptions({ duration: 2000 });

function goMine(){
    router.replace({name: 'UserMine'})
}

function getPolicyToken(fileInfo, index) {
    proxy.$axios.get(proxy.$config.domain + 'Oss/GetPolicyToken?type=img&id=' + aid, { hideLoading: true }).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
            const d = response.data.data
            aliyunOssToken = d
            if (fileInfo) {
                uploadFile(fileInfo, index)
            }

        } else {
            if (fileInfo) {
                fileInfo.status = 'failed'
                fileInfo.message = '上传失败'
                showToast('图片上传失败')
                handlRes()
            }

        }
    }).catch(error => {
        if (fileInfo) {
            fileInfo.status = 'failed'
            fileInfo.message = '上传失败'
            showToast('图片上传失败')
            handlRes()
        }
        // router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

    });
}


function random_string(len) {
    len = len || 3;
    var chars = 'abcdefhijkmnprstwxyz';
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function uploadFile(fileInfo, index) {
    console.log("ileInfo.name", fileInfo.file.name, fileInfo)

    var filename = random_string(8) + new Date().getTime() +'.'+ fileInfo.file.name.match(/[^\.]\w*$/g)[0];
    var formData = new FormData();
    //注意formData里append添加的键的大小写
    formData.append('x-oss-forbid-overwrite', 'true')
    formData.append('key', aliyunOssToken.dir + filename); //存储在oss的文件路径
    formData.append('OSSAccessKeyId', aliyunOssToken.accessid); //accessKeyId
    formData.append('policy', aliyunOssToken.policy); //policy
    formData.append('Signature', aliyunOssToken.signature); //签名
    formData.append('success_action_status', '404'); //签名
    formData.append('callback', aliyunOssToken.callback); //签名
    formData.append("file", fileInfo.file);
    var url = aliyunOssToken.host;
    // var fileUrl = aliyunOssToken.host + '/' + aliyunOssToken.dir + filename;

    proxy.$axios.post(url, formData, { hideLoading: true, customRequst: true, headers: { 'Content-type': 'application/octet-stream' } }).then(response => {
        // console.log(url, response, "url---response")
        // showLoading = false;
        fileInfo.message = '上传成功'
        if (response.data.code === 200) {
            fileInfo.status = 'done'
            fileInfo.url = aliyunOssToken.url + aliyunOssToken.dir + filename
            fileList.value[index].url = aliyunOssToken.url + aliyunOssToken.dir + filename
            handlRes()
        } else {
            fileInfo.status = 'failed'
            fileInfo.message = '上传失败'
            showToast(response.data.msg ? response.data.msg : '上传失败');
            handlRes()
            // self.prevent = false;
        }

    }).catch(error => {
        fileInfo.status = 'failed'
        fileInfo.message = '上传失败'
        handlRes()
    });


}

function uploadSectionFile(fileInfo, index) {
    if (aliyunOssToken.expire * 1000 < new Date().getTime()) {
        getPolicyToken(fileInfo, index)
        return
    }
    uploadFile(fileInfo, index)
}


function handleFile(fileInfo, index) {
    
      let isLt2kb = fileInfo.file.size / 1024 > 200 // 判定图片大小是否小于200k
      if (isLt2kb && false) {
        imageConversion.compressAccurately(fileInfo.file, 200).then(res => {
          let reader = new FileReader()
          reader.onload = (e) => {
            let objUrl = null
            if (typeof res === 'object') {
              objUrl = window.URL.createObjectURL(new Blob([res]))
            } else {
              objUrl = res
            }
            // 拿到压缩过后的图片
            // data-用于本地回显  res-用于上传接口使用
            fileInfo.file = res
            fileInfo.objUrl = objUrl
            uploadSectionFile(fileInfo, index)
          }
          reader.readAsArrayBuffer(fileInfo.file)
        })
      } else {
        uploadSectionFile(fileInfo, index)
      }
}


 // 绑定手机号确定按钮
function submitInfo() {
    if(fileList.value.length == 0) {
        showToast("请先上传证明");
        return false;
    }
    submitLoading.value = true

    sum = 0
    // 上传图片
    for (let index = 0; index < fileList.value.length; index ++) {
        let fileInfo = fileList.value[index]
        if(!fileInfo.url) {
            sum = sum + 1
            fileInfo.status = 'uploading'
            fileInfo.message = '上传中...'
            // 添加上传Promise到数组中
            handleFile(fileInfo, index)
        }
        
    }
    if(sum < 1) {
        saveInfo()
    }
}

function handlRes() {
    sum = sum - 1
    if(sum < 1) {
        saveInfo()
    }
}


function saveInfo() {
    if(sum > 0) {
        return;
    }

    let imgUrls = []

    for(let index = 0; index < fileList.value.length; index ++) {
        let fileInfo = fileList.value[index]
        if(!fileInfo.url) {
            submitLoading.value = false
            showToast("部分图片上传失败， 请重试");
            return false;
        }
        imgUrls.push(fileInfo.url)
    }
    

    proxy.$axios.post(proxy.$config.domain + "User/UpdateUserOtherInfo", {auth_imgs:imgUrls}, { toJSON: true}).then(response => {
        submitLoading.value = false
        if (response.data.code === 200) {
            showToast('保存成功！')
            setTimeout(()=> {
                if (routerName == "") {
                    router.replace({ name: 'UserMine'})
                    return
                }
                router.replace({ name: routerName, query: { 'id': aid, 'type': route.query.type } })
                
                // self.$router.replace({name: 'BaseInfo'})
            }, 1000)
        } else {
            showToast(response.data.msg?response.data.msg:'保存失败');
            // self.prevent = false;
        }
    }).catch(error => {
        showToast("保存失败！");
        // this.showLoading = false;
        // self.prevent = false;
    });
}


onMounted(() => {
    let page = route.query.page
    if(page && typeof page === 'string') {
        routerName = page
    }


    proxy.$axios.get(proxy.$config.domain + 'User/UserOtherInfo').then(response => {
        if (response.data.code === 200) {
            const d = response.data.data
            authStatus.value = d.status
            reason.value = d.auth_fail_reason
            if (d.urlList) {
                let urlList = []
                for(let i = 0; i < d.urlList.length; i ++) {
                    let url = d.urlList[i]
                    urlList.push({'url':url})
                }
                fileList.value = urlList
                // console.log(fileList.value, "onMounted==onMounted")
            } else if (d.status == 1) {
                router.replace({name: 'UserReg'})
            }
        } else {
            router.replace({path: '/404', query: { msg:response.data.msg ?response.data.msg:'网络连接错误，请刷新重试' }} )
        }
    })
        .catch(error => {
            router.replace({ path: '/404', query: { msg:'网络连接错误，请刷新重试' } })

        });
    
})


onBeforeUnmount(() => {

})
</script>
<style lang="scss" scoped>
.main-content{
    padding-bottom: 1.45rem;

    background: #fff;
}
.main-content.empty{
    background: #fff;
}
.reg-bg {
    width: 10rem;
    // height: 21.28rem;
    min-height: 100vh;
    
    background-color: #fff;

    
    .top-div {
        
        background-image: linear-gradient(180deg, rgba(249, 250, 250, 0) 0%, rgba(249, 250, 250, 1) 100%), linear-gradient(94.83deg, rgba(18, 219, 132, 1) 0%, rgba(0, 174, 255, 1) 100%);
        background-size: 100% 6.5rem;
        background-color: #FFFFFF;
        background-repeat: no-repeat;
        .top-title {
            padding: 0.6rem 0.375rem 0;
            font-weight: 500;
            font-size: 0.48rem;
            color: #FFFFFF;
        }
        .top-desc {
            padding: 0.2rem 0.375rem 0.375rem;
            font-size: 0.32rem;
            color: #FFFFFF;
        }
        .upload-div {
            margin: 0.375rem 0.375rem -0.375rem;
            background: #FFFFFF;
            border-radius: 0.27rem;
            padding: 0.4rem 0 .3rem 0.4rem;
        }
    }

    .auth-label {
        margin: 0.5rem 0.375rem 0.1rem;
        font-size: 0.37rem;
        color: #323233;
    }
    .auth-desc {
        margin: 0 0.375rem 2rem;
        font-size: 0.37rem;
        color: #646566;
    }
    
    .submit-btn {
        background: #0AC97A;
        border-radius: 0.27rem;
        margin: .7rem 0.375rem;
        height: 1.33rem;
        font-size: 0.43rem;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.33rem;
        width: 9.2rem;
    }

    .question-link {
        margin: 0.3rem 0;
        font-size: 0.32rem;
        color: #2A82E4;
        text-align: center;
        span {
            color: #2A82E4;
        }
        .van-checkbox {
            display: flex;
        }
        .quesstion-tip {
            color: #969799;
        }
    }
    
}

</style>

<style>
.van-list__finished-text{
    font-size: 10px;
}
</style>