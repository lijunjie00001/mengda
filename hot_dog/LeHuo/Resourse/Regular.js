import Certification from "../Project/pages/persionCenter/Certification";


const mobileAll = /(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\d{8}$)|(^1705\d{7}$)|(^1(33|53|7[37]|8[019])\d{8}$)|(^1700\d{7}$)|(^1(3[0-2]|4[5]|5[56]|7[6]|8[56])\d{8}$)|(^170[7-9]\d{7}$)|(^0\d{2,3}-?\d{7,8}$)/;
const nsrsbhPattern =/(^([A-Za-z0-9]{15,20})$)/;   //纳税人识别号验证规则
const passWorld = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //密码由6-16位数字和字母的组合
const userName = /^[A-Za-z_][A-Za-z_0-9]{3,14}$/;//不以数字开头的4-15位由字母、数字或下划线组成的用户名
const certificationUserName = /^[A-Za-z][A-Za-z0-9]{3,14} || [\u4e00-\u9fa5]{1,7} $/;//不以数字开头的4-15位英文、数字或2-8个汉字的实名认证用户名
const nsrmcPattern = /^[A-Za-z0-9\u4e00-\u9fa5-()（）]+$/;    //纳税人名称正则表达式
// /*const testPhone= /^([0-9]\d*|[-]|[,]){1,50}$/;//电话正则*/
const testPhone= /^[0-9０-９ +,-]+$/;
const emailPattern = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;  //邮箱校验
const unitPattern = /^[a-zA-Z\u4e00-\u9fa5]+$/; //计量单位正则，只能输入中文或字母
const pricePattern = /^([0-9]{1,6})(\.\d{1,2})?$/;  //含税单价正则，整数部分不超过6位，小数不超过2位
const chinesePattern = /[\u4e00-\u9fa5]/g;//汉字校验正则
const shxydmParrern = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;//统一社会信用代码正则
const clsbmPattern = /^([A-Z0-9]{17})$/;//车辆识别码正则
const fdjhmPattern = /^[A-Z0-9]{6,8}/;//发动机号码正则
const cphmPatern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;//车牌号码正则
const sfzCode = '111';
const namePattern = /^[a-zA-Z\u4e00-\u9fa5]+$/;//身份证姓名校验正则
const phonePattern = /^((0\d{2,3})?-?)(\d{7,8})(-(\d{3,}))?$/; //固定电话正则，区号可写可不写

module.exports = {
    mobileAll,
    nsrsbhPattern,
    passWorld,
    nsrmcPattern,
    testPhone,
    emailPattern,
    unitPattern,
    pricePattern,
    chinesePattern,
    shxydmParrern,
    clsbmPattern,
    fdjhmPattern,
    cphmPatern,
    userName,
    certificationUserName,
    sfzCode,
    namePattern,
    phonePattern
};