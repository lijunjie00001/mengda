let initData = {
    account:'',
    isCertification:false, //实名认证
    isDistractionCompany:false,       //完善娱乐业信息
    isPersonalCompany:false, //是否完善个人从业单位
    isWornoutCompany:false,  //完善废旧企业
    isZlCompany:false,   //完善租赁企业
    isCarWxCompany:false ,//完善汽车维修
    isCarCjCompany:false, //弯身汽车拆解
    iconImage:''
}
const changeUserInfo =   (state=initData, action) => {
    switch (action.type) {
        case 'UserInfo':
            //获取个人信息
            return;
        case 'changeAccout'+'_fetch_success':
            //修改名字
            return state;
        case 'changeIcon'+'_fetch_success':
            //修改头像
            return state;
        case 'changeIsCertification'+'_fetch_success':
            //实名认证
            return state;
        case 'changeIsDistractionCompany'+'_fetch_success' :
            //完善娱乐业信息
            return state;
         case 'changeIsPersonalCompany'+'_fetch_success' :
             //完善个人信息
            return state;
        default:
            return state//返回原来的state
    }
}
export default changeUserInfo