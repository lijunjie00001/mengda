
let initData = {
    loginStatus:false,
    userId:'',
    phone:''
}
const loginInformation =   (state=initData, action) => {
    switch (action.type) {
        case 'FW_action_Login':
            let {userInfo} = action;
            let newDate = Object.assign({},state);
            newDate={
                ...newDate,
                userInfo: {
                    loginStatus:true,
                    userId:userInfo.user.userid+'',
                    certification:userInfo.user.name&&userInfo.user.idcardno?true:false,
                    userAccount:userInfo.user.useraccount,
                    }
            }
            return newDate
        case 'FW_action_exit':
            var {userInfo} = action;
            var newDate = Object.assign({},state);
            newDate={
                ...newDate,
                userInfo:{
                    ...newDate.userInfo,
                    loginStatus:false
                }
            }
            return newDate
        case 'FW_action_certification_fetch_success':
            var newDate = Object.assign({},state);
            newDate={
                ...newDate,
                userInfo: {
                    ...newDate.userInfo,
                    certification:true
                }
            }
            return newDate
        default:
            return state//返回原来的state
    }
}
export default loginInformation