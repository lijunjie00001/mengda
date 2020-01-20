/**
 * Created by zhangyu on 2017/11/20.
 */
import React, {
    Dimensions,
    Platform,
    AsyncStorage
} from 'react-native';
import config from '../../../Resourse/Config'
//var BASE_URL =config.baseUrl;

import fetchWithTimeout from './fetchWithTimeout'
export default  async (urlParam)=>{
    let BASE_URL =config.baseUrl;
    let method = urlParam.type;
    let requestUrl = (method==='GET'?BASE_URL+makeUrl(urlParam):BASE_URL+urlParam.url);
    requestUrl=urlParam.wechat?makeUrl(urlParam):requestUrl
    let contentType = method==='GET'?'application/json':'multipart/form-data';
    let param = method==='GET'?null:urlParam.param;
    let header = {
        method: method,
        follow: 1,
        timeout:60000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
        },
        body: method==='GET'?null:makeBoby(urlParam),
    };
    return fetchWithTimeout(requestUrl,header,urlParam.param).then((response) => response.json());
}
function makeUrl(urlParam){
    let {url,param} = urlParam;
    if(param){
        url = url+(url.indexOf('?') === -1 ? '?' : '&')
        for (let key of Object.keys(param)) {
            url = url+encodeURIComponent(key)+'='+encodeURIComponent(param[key])+'&';
        }
        if (url.endsWith('&')){
            url = url.substring(0,url.length-1);
        }
    }
    return url;
}
function makeBoby(urlParam){
    let {param} = urlParam;
    let formData = new FormData();
    if(param){
        if(param.isUpload){
            return param.imageData
        }
        for (let key of Object.keys(param)) {
            formData.append(key,param[key]);
        }
        return formData;
    }else{
        formData.append('a',1);
        return formData;
    }

}

function makeAndiordBoby(urlParam) {
    let {param} = urlParam;
    let boby='';
    if(param) {
        for (let key of Object.keys(param)) {
            boby = boby + key + '=' + param[key] + '&';
        }
        if (boby.endsWith('&')) {
            boby = boby.substring(0, boby.length - 1);
        }
    }
    return boby;

}
