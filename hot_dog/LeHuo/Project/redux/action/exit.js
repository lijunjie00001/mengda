

export default   (userInfo={})=>{
    let returnData={
        type:'FW_action_exit',
        userInfo,
    }
    return returnData;
}