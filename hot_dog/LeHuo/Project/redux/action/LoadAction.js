/**
 * Created by zhangyu on 2017/11/20.
 */
export  default (pageId,isLoad=false)=>{
    return {
        type:'FW_action_loading',
        pageId,
        isLoad
    }
}