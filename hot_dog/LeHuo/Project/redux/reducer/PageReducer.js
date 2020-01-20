
export default (state:State={},action)=>{
    switch(action.type){
        case 'FW_action_set_container': {
            let {pageId, data} = action
            if (pageId) {
                let pageData = state[pageId] ? state[pageId] : {}
                let newData = Object.assign({}, state)
                newData[pageId] = {
                    ...pageData,
                    ...data,
            }
                return newData;
            }
        }
    }
    return state;
}