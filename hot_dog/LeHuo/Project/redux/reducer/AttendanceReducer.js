
let initData=[]
export default (state,props,initData=initData)=>{
    let pageId = props.pageId
    let data = state[pageId];
    let newData = {
        ...initData,
        ...data,
    }
    return newData;
}