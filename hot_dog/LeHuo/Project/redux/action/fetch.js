/**
 * Created by zhangyu on 2017/11/20.
 */
import {
    DeviceEventEmitter,
    InteractionManager,
} from 'react-native';
function baseFetch(fromPage,type,urlParam,bridge,successCallback,failCallback,errorCallback){
    let pageId = fromPage.props.pageId;
    let paramSuccess = (data)=>{
        if(successCallback){
             InteractionManager.runAfterInteractions(() => {
                successCallback(data)
               });

        }
    }
    let paramfail = (data)=>{
        if(failCallback){
             InteractionManager.runAfterInteractions(() => {
                failCallback(data)
              });
        }
    }
    let parmerror=(code,message)=>{
        console.log('获取数据错误：code,',code,'message',message);
        if(errorCallback){
            InteractionManager.runAfterInteractions(() => {
                errorCallback(code,message)
            });
        }
    }
    return {
        middlewareType:'FW_action_fetch',
        type,
        pageId,
        urlParam,
        bridge,
        'successCallback':paramSuccess,
        'failCallback':paramfail,
        'errorCallback':parmerror

    }
}

export default function fetchData (fromPage,type,urlParam,bridge,successCallback=null,failCallback=null,errorCallback=null){
     // let url1 = 'http://rapapi.org/mockjsdata/29304/api/03180';
    return baseFetch(fromPage,type,urlParam,bridge,successCallback,failCallback,errorCallback)
}