let initData = {
    datas:[],
    enableLoadMore:true,
    isLoadingMore:false,
    isLoadMoreComplate:false,
}
const publishListPage =   (state=initData, action) => {
    switch (action.type) {
        case 'listData'+'_fetch_success':
            //获取全部信息
            let datas = action.data;
            return {
                // 参数
                datas:datas.result,
                enableLoadMore:true,
                isLoadingMore:false,
                isLoadMoreComplate:false,
            };
        case 'Grounding'+'_fetch_success':
            //上架
            return state;
        case 'changeIcon'+'_fetch_success':
            //下架
            return state;
        case 'changeIsCertification'+'_fetch_success':
            //删除
            return state;
        case 'changeIsDistractionCompany'+'_fetch_success' :
            //编辑
            return state;
        default:
            return state//返回原来的state
    }
}
export default publishListPage