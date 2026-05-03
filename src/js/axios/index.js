import axios from "axios";
import Qs from "qs";
import router from '../../router'

import config from '../config/index'

import { showLoadingToast, closeToast } from 'vant'


function startLoading() {
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
    });
}

function endLoading() {
    // 结束加载
    closeToast();
}



// 超时时间（ms）
axios.defaults.timeout = 30 * 1000;
// axios请求开启cookie，支持跨域请求携带cookie
// axios.defaults.withCredentials = true;

axios.defaults.baseURL = ''


import { Base64 } from "js-base64";


const wxAuth = config.config.wxAuth
const imUrl = config.config.im


let urlSearch = UrlSearch()
let ser_token = ''
let ser_appid = ''
let ser_openid = ''
if (urlSearch) {
    ser_token = urlSearch['user_token'] //u rl-token
    ser_appid = urlSearch['wx_appid'] //url-appid

    ser_openid = urlSearch['wx_openid'] //url-appid
}




let storeToken = localStorage.getItem('user_token');
let appid='' //store appid
	if(storeToken){
		appid = storeToken.split("_")[1];
	}
// localStorage.setItem("user_token", '1b453104dcbd720ee527532bef224398_wxc500dc51b8ba31dc');
// 拦截器
axios.interceptors.request.use(
    async config => {
        // this.$loading.show();
    // Vue.prototype.$loading.show()  // 请求前显示loading
    if(!config.hideLoading) {
        startLoading()
    }
    if (config.customRequst) {
        return config;
    }
        
    // token参数在登录完成时将会获得 暂时放在header中的token字段里  //development
    if(process.env.NODE_ENV=='development'){
        config.headers.token = storeToken
        // localStorage.setItem("user_token", config.headers.token);
    }else{
        if(ser_token&&ser_appid){   	//有token 有appid
                localStorage.setItem("user_token",ser_token);
                localStorage.setItem("wx_openid",ser_openid);
                localStorage.setItem("wx_appid",ser_appid);
                config.headers.token = ser_token
                let url = funcUrlDel(window.location.href,"user_token");
                window.location.replace(url)  //去掉url里的token 防止分享链接token暴露
                // window.location.reload();
        }else if(!ser_token && ser_appid){ //没有token  有appid
            if(appid!=ser_appid){
                judgeLogin();
                return config;
            }else{
                config.headers.token = storeToken
            }
        }else if(ser_token && !ser_appid){ //有token 没有appid
            if(storeToken!=ser_token){
                judgeLogin();
                return config;
            }else{
                config.headers.token = storeToken
            }
        }
    }
    
    // console.log("axios", config)
    

    // 如果需要转jSON提交的
    // 举例: let toJSON = Regs.createCom.test( config.url );
    // 由于暂时没有使用json提交方式，设置成false
    let toJSON =  config.toJSON
    let toForm =  config.toForm
    if(config.method === 'post' ) {
      
    } else { 
        if(!config.params) {
            config.params = {}
        }
    }
    if(toJSON) { 
        config.headers['Content-Type'] = 'application/json';
        config.data = JSON.stringify(config.data);
    } else if(toForm){
        // post请求必须把data内容使用qs转一下
    } else {
        // post请求必须把data内容使用qs转一下
        config.data = Qs.stringify(config.data);
    }
    delete config.toJSOn;

    return config;
}, error => {
    // 对请求错误做些什么
    // Vue.prototype.$loading.hide()  // 请求前显示loading
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(response => {
    closeToast()
    // console.log("interceptors.response===", response, "interceptors.response.", response.data.code)
            // Vue.prototype.$loading.hide()  // 请求前显示loading
        // 用户未登录
        if (response.data.code == 1001) {
            // console.log("token过期")
            //token过期  重新登录
            judgeLogin();
            return Promise.resolve(response);
            // return response;
        } else if (response.data.code == 601) {
            // 刷新页面
            window.location.reload();
            return Promise.resolve(response);
        } else if (response.data.type == 'application/json') {
            const reader = new FileReader();
          reader.onload = () => {
            try {
              // 尝试将读取的结果解析为 JSON
              const json = JSON.parse(reader.result);
              if (json.code == 1001) {
                //token过期  重新登录
                judgeLogin();
                return;
              }
              // 其他情况，继续处理 JSON 数据
              return response;
            } catch (error) {
            } finally {
              // 继续处理其他逻辑
              return Promise.resolve(response);
            }
          };
          reader.readAsText(response.data);
          
        } else {
            return Promise.resolve(response);
        }
    },
    error => {
        closeToast()
        // console.log("interceptors.err===", response, "interceptors.err.", response.data.code)
        // Vue.prototype.$loading.hide()  // 请求前显示loading
        // Do something with response error
        return Promise.reject(error);
    }
);

function judgeLogin() {
    // if (judgeMiro() == 'wxwork') {
    //     wxWorkLogin();
    // } else {
        login();
    // }
}
function login(){
    if (ser_appid && ser_appid != 'undefined') {
        let url = window.location.href;
        url = funcUrlDel(url, "wx_openid")
        let key = Base64.encode(`${url}&##key##`)
        let oauthUrl = `${wxAuth}/home/unionlogin.htm?wx_appid=${ser_appid}&key=${key}`
        if (location.pathname == '/article/article') {
            oauthUrl = oauthUrl + "&oauth_type=snsapi_base"
        }
        window.location.replace(oauthUrl)
    } else {
        
        router.replace({ path: '/404', query: { msg:'缺少对应的渠道' } })
    }
}

function judgeMiro() {
    var ua = window.navigator.userAgent.toLowerCase();
    if ((ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork')) {
        return 'wxwork'
    } else if (ua.match(/micromessenger/i) == 'micromessenger') {
        // alert("微信客户端");
        return 'wxplay'
    } else {
        return '网页 xhr'
    }
}

function wxWorkLogin() {
    let url = window.location.href;
    url = funcUrlDel(url, "wx_openid")
    let key = Base64.encode(`${url}&##key##`)
    Axios.get(imUrl + '/oauth/url?wx_appid='+ser_appid+'&key='+key).then(res => {
        // alert('企业微信登录')
        if (res.data.status == 200) {
            window.location.replace(res.data.data)
        }
    }).catch(error => {
        console.error('error', error);
    })
}

function UrlSearch () {
	var name, value
    var str = location.href // 取得整个地址栏
	var num = str.indexOf('?')
	str = str.substring(num + 1) // 取得所有参数   stringvar.substr(start [, length ]

    var urlSearch = { user_token: '', wx_appid: '', wx_openid:'' }

	var arr = str.split('&') // 各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf('=')
		if (num > 0) {
			name = arr[i].substring(0, num)
			value = arr[i].substring(num + 1)
            urlSearch[name] = value
		}
	}
    return urlSearch
}
// function isWeiXin() {
//     var ua = window.navigator.userAgent.toLowerCase();
//     if (ua.match(/MicroMessenger/i) == 'micromessenger') {
//       return true;
//     } else {
//       return false;
//     }
//   }
  function funcUrlDel(url,name) {
	//根据#号拆分
	   let poundarr = url.split('#')
	   //？拆分
      let questionarr = []
      if (poundarr) {
          //把#接上
          poundarr.forEach((element,index) => {
              if(index>0){
                  element = '#'+ element
              }
   
              let temparr = element.split('?')
              if(!temparr){
                  return true
              }
             temparr.forEach((item, idx) => {
                 //保留问号
                  if (idx > 0) {
                      item = '?'+item
                  }
                  questionarr.push(item)
              })
          });
      }else{
          questionarr = url.split('?')
          if (questionarr) {
              questionarr.forEach((item, idx)  => {
                  if (idx > 0) {
                      item = '?'+item
                  }
              })
          }
      }
   
      if(!questionarr){
          return  url
      }
   
      //&符号的处理
   let andarr = []
      questionarr.forEach((item,index) => {
          let andidx = item.indexOf('&')
          if (andidx <= -1) {
              andarr.push(item)
              return true
          }
   
       let tempandarr = item.split('&')
          tempandarr.forEach((ele, idx) => {
              if (idx > 0) {
               ele = '&' + ele
              }
              andarr.push(ele)
          })
      })
   
   
      let newurl = ''
      andarr.forEach(item => {
          let nameindex = item.indexOf(name+'=')
          //不拼接要删除的参数
          if (nameindex > -1) {
              //保留第一个问号
              let questionidx = item.indexOf('?')
              if (questionidx == 0) {
                  newurl += '?'
              }
              return true
          }
          newurl += item
      })
   
      return newurl.replace(/\?\&/g,"?")
}  
// Vue.prototype.$axios = axios;

export default axios;