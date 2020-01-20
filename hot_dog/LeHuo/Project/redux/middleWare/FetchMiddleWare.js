/**
 * Created by zhangyu on 2017/11/20.
 */
import React, {
    NativeModules,
    Platform,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import Fetch from '../Fetch/Fetch'
import LoadAction from '../action/LoadAction'
import LoadFinish from '../action/LoadFinishAction'
import netWorkAction from '../action/netWorkAction'
import netWorkShowACtion from '../action/netWorkShowAction'
export default  store=> (next)=>  async (action)=>  {
    if(action.middlewareType==='FW_action_fetch'){
        let {pageId,type,urlParam,bridge,successCallback,failCallback,errorCallback} = action;
        store.dispatch(
            netWorkShowACtion(pageId,action)
        );
        store.dispatch(
            LoadAction(pageId,true)
        );
        try{
            var result=await Fetch(urlParam);
            let response = result.response ? result.response : result;
            //请求接口出现错误，提示信息
            if (!response){
                response={
                    code:-100,
                    message:'网络请求失败'
                }
            }
            /*****************************请求接口成功后**********************************/
            if(response.status==100) {
                if (successCallback) {
                       let data = {
                        type:type+'_fetch_success',
                        pageId,
                        param:urlParam.param,
                        data:response,
                        bridge:bridge
                       };
                       store.dispatch(data);
                       store.dispatch(
                        LoadFinish(pageId,false)
                      );
                        successCallback(response);
                    }
            }else{
                console.log('..........error',response);
                let data = {
                    type:type+'_fetch_failure',
                    pageId,
                    param:urlParam.param,
                    bridge:bridge,
                    data:response,
                };
                store.dispatch(data);
                store.dispatch(
                    LoadFinish(pageId,false)
                );
                if(failCallback){
                    failCallback(response)
                }
            }
        }catch (err) {
            console.log('fetch error:',err);
            let response = {
                code:-100,
                message:'网络请求失败'
            };
            store.dispatch({
                type:type+'_fetch_failure',
                pageId:pageId,
                param:urlParam.param,
                ...response,
            });
            store.dispatch(
                LoadFinish(pageId,false)
            );
            store.dispatch(
                netWorkAction(pageId,action)
            );
            if(errorCallback){
                errorCallback(response)
            }
        }
    }else{
        return next(action);
    }
}

