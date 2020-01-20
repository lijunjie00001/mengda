export default (state,props,initData={})=> {
    let pageId = props.pageId
    let data = state[pageId];
    let newData = {
        ...initData,
        ...data,
    }
    return newData;
}
