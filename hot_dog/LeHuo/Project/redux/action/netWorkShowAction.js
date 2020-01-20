export default (pageId,data={})=>{
    let returnData={
        type:'FW_action_haveWife',
        pageId,
        data,
    }

    return returnData;
}