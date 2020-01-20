const ShowWife = (state:State={}, action) => {
    switch (action.type) {
        case 'FW_action_NoWife':
            let {pageId} = action;
            let pageData = state[pageId]?state[pageId]:{}
            let newDate = Object.assign({},state);
            newDate[pageId]={
                isShowWife:true,
                RetryAction:action,
           }
           return newDate
        case 'FW_action_haveWife':
                var {pageId} = action;
                var newDate = Object.assign({},state);
                newDate[pageId]={
                    isShowWife:false,
                    RetryAction:{},
                }
                return newDate
         default:
               return state//返回原来的state
        }
}
export default ShowWife