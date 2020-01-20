
let initData = {
    datas:[]
}
const AddtenceReducer =   (state=initData, action) => {
    switch (action.type) {
        case 'addtence'+'_fetch_success':
            let datas = action.data;
            return {
                ...state,
                // 参数
                datas:datas.result,
            };
            return;
        case 'addtence'+'_fetch_failure':
            return state;
        default:
            return state//返回原来的state
    }
}
export default AddtenceReducer