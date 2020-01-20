export default class StringUtil {
    /***
     * 验证用户名 账号 验证规则：字母、数字、下划线组成，字母开头，4-16位。
     * @param str
     * @returns {boolean}
     */
    static checkUser(str){
        let re = /^[a-zA-z]\w{3,15}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    /***
     * 验证身份证是否合法
     * @param str
     * @returns {boolean}
     */
    static IdentityCodeValid(code) {
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var pass= true;

        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
            pass = false;
        }

        else if(!city[code.substr(0,2)]){
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if(parity[sum % 11] != code[17]){
                    pass =false;
                }
            }
        }
        return pass;
    }

    /*根据身份证号码获得出生日期*/
    static getBirthdayFromIdCard(idCard) {
        let birthday = "";
        if(idCard){
            if(idCard.length === 15){
                birthday = "19"+idCard.substr(6,6);
            } else if(idCard.length === 18){
                birthday = idCard.substr(6,8);
            }
            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        }
        return birthday;
    }

    /***
     * 验证手机号
     * @param mobile 手机 验证规则：11位数字，以1开头。
     * @returns {boolean}
     */
    static checkMobile(mobile) {
        let re = /^1\d{10}$/;
        if (re.test(mobile)) {
            return true;
        } else {
            return false;
        }
    }
    /*
     验证电话号码
     验证规则：区号+号码，区号以0开头，3位或4位
     号码由7位或8位数字组成
     区号与号码之间可以无连接符，也可以“-”连接
     如01088888888,010-88888888,0955-7777777
     */
    static checkPhone(phone){
        let re = /^0\d{2,3}-?\d{7,8}$/;
        if (re.test(phone)) {
            return true;
        } else {
            return false;
        }
    }
    /*
     验证邮箱
     验证规则：姑且把邮箱地址分成“第一部分@第二部分”这样
     第一部分：由字母、数字、下划线、短线“-”、点号“.”组成，
     第二部分：为一个域名，域名由字母、数字、短线“-”、域名后缀组成，
     而域名后缀一般为.xxx或.xxx.xx，一区的域名后缀一般为2-4位，如cn,com,net，现在域名有的也会大于4位
     */
    static checkEmail(email){
        let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (re.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    /***
     * 验证码密码
     * @param password 密码
     * @returns {boolean}
     */
    static checkPwd(password){
        if(password&&password.length>=6&&password&&password.length<=20){
            return true;
        }else{
            return false;
        }
    }

    /***
     * 验证短信验证码
     * @param sms  短信验证码
     * @returns {boolean}
     */
    static checkSmsCode(sms){
        if(sms){
            return true;
        }else{
            return false;
        }
    }
    static checkAmount(amount){
        let re = /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/
        if (re.test(amount)) {
            return true;
        } else {
            return false;
        }
    }
    static qiniuImageReset(url,width,height, isVideo = false){
        width=parseInt(width)
        height=parseInt(height)
        let use =url.indexOf('?')===-1?'?':'&'
        if (isVideo)
        {
            return url + use + 'vframe/jpg/offset/0/w/' + width + '/h/' + height;
        }

        if(height>0){
            let type = isVideo ? 'vframe/jpg/offset/0/w/' : 'imageView2/1/w/';
            return url+use+type+width+'/h/'+height
        }else{
            let type = isVideo ? 'vframe/jpg/offset/0/w/' : 'imageView2/0/w/';
            return url+use+type+width
        }
        // return url+use+'imageMogr2/thumbnail/'+width+'x'
    }

    /***
     * OSS图片缩略设置
     * @param url  目标Url
     * @param width 需要的宽
     * @param height 需要的高（可以不设，不设置的话就按照原比例缩放）
     * @returns {string}
     */
    static ossImageReset(url,width,height){
        let max_width = 750
        width=parseInt(width)
        height=parseInt(height)
        if (width>max_width){
            if(height>0){
                height=parseInt(height*max_width/width)
            }
            width = max_width
        }
        let use =url.indexOf('?')===-1?'?':'&'
        if(height>0){
            let resize = 'x-oss-process=image/resize,m_fill,h_'+height+',w_'+width
            return url+use+resize
        }else{
            let resize = 'x-oss-process=image/resize,w_'+width
            return url+use+resize
        }
    }

    static getQueryString(url,name)
    {
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let search = url.split('?')
        if(search.length>1){
            let r = search[1].match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }
        return null

    }

    /*获得字符长度*/
    static strLen(str) {
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }
    /*
      判断为数字跟英文的字符串
     */
    static checkNumberWithZimoString(str){
        var re =  /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合
        if (!re.test(str))
        {
            return false;
        }else{
            return true;
        }
    }
    /*
     判断都是数字
     */
    static checkNumber(str){
        var regPos = / ^\d+$/; // 非负整数
        var regNeg = /^\-[1-9][0-9]*$/; // 负整数
        if(regPos.test(str) || regNeg.test(str)){
            return true;
        }else{
            return false;
        }
    }
    /*
      判断是否正整数
     */
    static checkZnumber(str){
        var re = /^[1-9]+[0-9]*]*$/;
        if (!re.test(str))
        {
            return false;
        }else{
            return true;
        }
    }
    /*
      判断是否全是汉字
     */
    static checkChina(str){
        var stringFlag = true;
        for(var i = 0; i < str.length; i++){
            if(str.charCodeAt(i) <= 255){
                stringFlag = false;
                break;
            }
        }
        if(stringFlag){
            return true
        }else{
            return false
        }
    }
    /*
      判断是否中英文混合
     */
    static  checkChinaAndEnglish(str){
        var stringFlag = true;
        for(var i = 0; i < str.length; i++){
            if(str.charCodeAt(i) <= 255){
                stringFlag = this.checkEnglish(str.charAt(i));
                if(!stringFlag)break;
            }
        }
        if(stringFlag){
            return true
        }else{
            return false
        }
    }
    /*
      判断都是字母
     */
    static checkEnglish(str){
        var reg= /^[A-Za-z]+$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }

    /*
      汽车排量判断
     */
    static checkCarpl(str){
        var reg=/^[0-9]+([.][0-9]{1}){0,1}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }
    /*
      车身结构判断
     */
    static checkCarjg(str){
        var reg=/^[1-9][\u4e00-\u9fa5][1-9][\u4e00-\u9fa5]$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }
    /*
     车架号判断
     */
    static checkCarjh(str){
        var reg= /^[0-9A-Z]{17}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }
    /*
      车牌号
     */
    static checkCarph(str){
        var reg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }

    /**
     *@desc 校验电子税号
     *@author 陈金华
     *@date 2018/8/22 11:34
     *@param str
     */
    static checkIMEI(str){
        let reg = /^[0-9]{15}$/;//由15位数字组成
        if(reg.test(str)){
            return true;
        }else{
            return false;
        }
    }
    /*
      个人信息修改用户名
      不以数字开头的4-15位由字母、数字或下划线组成的用户名
     */
    static checkUserName(str){
        var reg=/^[A-Za-z_][A-Za-z_0-9]{3,14}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }
    /*
      实名认证用户名
      不以数字开头的4-15位英文、数字或2-8个汉字的实名认证用户名
     */
    static checkCertUserName(str){
        var reg=/^[A-Za-z][A-Za-z0-9]{3,14}$/ || /^[\u4e00-\u9fa5]{1,7}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }
    /*
     发动机型号判断
     */
    static checkCarfdj(str){
        var reg=/^[0-9A-Z]{6,8}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }
    /*
     价格判断
     */
    static checkPrice(str){
        var reg=/^([0-9][0-9]*)+([.][0-9]){0,1}$/;
        if(reg.test(str)){
            let number=(str+'').split('.');
            if(number[0]==='0'){
                return true
            }
            if(this.checkZnumber(number[0])){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
    /*
      带有两位小数的正数(价格除外)
     */
    static checkTwo(str){
        var reg=/^([0-9][0-9]*)+([.][0-9][0-9]{0,2}){0,2}$/;
        if(reg.test(str)){
            let number=(str+'').split('.');
            if(number[0]==='0'){
                return true
            }
            if(this.checkZnumber(number[0])){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
    /*
     * 判断是否小数点是否超标
     */
    static checkSmallNumber(str,max){
        var reg=/^([0-9][0-9]*)+([.][0-9][0-9]*)$/;
        if(reg.test(str)){
            let number=(str+'').split('.');
            if(number[0]==='0'||this.checkZnumber(number[0])){
                if(number.length>1&&number[1].length>max){
                    return 'max'
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }

    static checkUserName(str){
        var reg=/^[a-zA-Z][a-zA-Z0-9_]{3,14}$/;
        if(reg.test(str)){
            return true
        }else{
            return false
        }
    }

    /**
     *@desc 去除字符串首尾空格
     *@author 陈金华
     *@date 2018/8/17 9:26
     *@param str 需要除去空格的字符串
     */
    static trimStr(str){
        return str.replace(/(^\s*)|(\s*$)/g,"");
    }


    /**
     *@desc 判断输入的字符串是不是表情
     *@author 陈金华
     *@date 2018/8/21 10:07
     *@param substring 需要判断的字符串
     */
    static isEmojiCharacter(substring){
        for ( var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                    || hs == 0x2b50) {
                    return true;
                }
            }
        }
    }
};