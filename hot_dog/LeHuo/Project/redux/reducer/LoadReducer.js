/**
 * Created by zhangyu on 2017/11/20.
 */
const todo =  (state:State={}, action) => {
    switch (action.type) {
        case 'FW_action_loading':
            let {pageId,isLoad} = action;
            let pageData = state[pageId]?state[pageId]:{}
            let newDate = Object.assign({},state);
            newDate[pageId]={
                ...pageData,
                isLoad:true
            }
             return newDate
        case 'FW_action_fetch_complite':
              var {pageId,isLoad} = action;
              var pageData = state[pageId]?state[pageId]:{}
              var newDate = Object.assign({},state);
              newDate[pageId]={
                   ...pageData,
                   isLoad:false
              }
              return newDate
        default:
            return state//返回原来的state
    }
}
export default todo