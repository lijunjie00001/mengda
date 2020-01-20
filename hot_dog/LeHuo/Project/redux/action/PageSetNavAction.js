let initData = {
    hiddenNav: false,
    title: '',
    titleStyle:{},
    rightBtnItems: [],
    hiddenBackBtn: false,

}
export default function setContainer (fromPage,data=initData){
    let pageId = fromPage.props.pageId;
    let returnData={
        type:'FW_action_set_container',
        pageId,
        data,
    }

    return returnData;
}