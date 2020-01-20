
export  default  (userInfo={})=>{
    let returnData={
        type:'FW_action_Login',
        userInfo,
    }
    return returnData;

}