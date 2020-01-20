/**
 * Created by zhangyu on 2017/11/21.
 */
export  default (pageId,isLoad=false)=>{
    return {
        type:'FW_action_fetch_complite',
        pageId,
        isLoad
    }
}
