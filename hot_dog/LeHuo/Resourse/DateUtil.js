/**
 * Created by user on 16/7/21.
 */

import moment from 'moment';
import {AsyncStorage} from "react-native";
import config from "./Config";

export default class DateUtil {
    static format(date, style) {
        if (date && style) {
            return moment(Number(date)).format(style);
        }

        return '';
    }

    static getTimeObject(time) {
        return moment(time).toObject()
    }

    /**
     * 今天开始时间
     */
    static getTodayStart() {
        return moment({hour: 0, minute: 0, seconds: 0}).unix() * 1000;
    }

    /**
     * 昨天开始时间
     */
    static getYestodayStart() {
        return moment({hour: 0, minute: 0, seconds: 0}).subtract(1, 'days').unix() * 1000;
    }

    /**
     * 获取时间的字符串形式  时间戳转字符串
     */
    static reFormatDateStr(dateStr) {
        return DateUtil.getDateStr(moment(dateStr).unix() * 1000)
    }

    /**
     * 获取时间的字符串形式  时间戳转字符串
     */
    static getDateStr(date) {
        if(!date){
            return ''
        }
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - date;   //时间差的毫秒数
        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000))
        //计算出小时
        var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000))
        //计算相差分钟数
        var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000))
        let newdate=new Date(date);
        let newHour=newdate.getHours()
        let newminutes=newdate.getMinutes()
        if(days<0){
            return '刚刚'
        }
        if(days==0){
            if(hours==0&&minutes==0){
                return '刚刚'
            }else if(hours==0&&minutes<=59){
                return minutes+'分钟前'
            }else{
                let min=newminutes.length==1?'0'+newminutes:newminutes
                if(newHour>11){
                    return '下午'+(newHour-12)+':'+min
                }else{
                    return '上午'+newHour+':'+min
                }
            }
        }else{
            return this.formatDateTime(newdate,4)
        }
    }
    /*
     * 聊天页面比较时间判断显示
     */
    static getChatData(data,nextData) {
        if (!nextData) {
            //上面的时间
            return this.getDateStr(data)
        }
        let newData=data-nextData;//时间差的毫秒数
        if(newData>60*1000){
            //大于1分钟显示
            return this.getDateStr(data)
        }
        return null
    }

    /**
     * 获取今天是星期几
     */
    static getDateForWeek() {
        var string = "星期";
        var week = new Date().getDay();
        switch (week) {
            case 0 :
                string += "日";
                break;
            case 1 :
                string += "一";
                break;
            case 2 :
                string += "二";
                break;
            case 3 :
                string += "三";
                break;
            case 4 :
                string += "四";
                break;
            case 5 :
                string += "五";
                break;
            case 6 :
                string += "六";
                break;
        }
        return string;
    }

    /**
     * 获取当前日期是星期几
     * param dateInterval 时间戳
     */
    static getWeek(dateInterval){
        let dateString = DateUtil.format(dateInterval,'YYYY-MM-DD');
        var dateArray = dateString.split("-");
        var  date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);

        //var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
        //return "星期" + weeks[date.getDay()];
        return "星期" + "日一二三四五六".charAt(date.getDay());
    };

    //获取登录信息
    static async getLoginData() {
       let result= await new Promise(function (resolve, reject) {
            let result=AsyncStorage.getItem('userInfo');
            result.then(function (response) {
                resolve(response)
            })['catch'](function (error) {
                resolve({})
            });

            })
        return    result;

    }

    /*转换时间日期格式 ****年**月**日 HH:mm  type=1,格式到日，type=2，格式化到分*/
    static formatDateTime (date,type) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        if(type == 1){
            return   y + '年' +m + '月' + d+'日';
        }
        if(type == 2){
            return   y + '年' + m + '月' + d+'日 '+h+':'+minute;
        }
        if(type == 3){
            return   y + '-' + m + '-' + d;
        }
        if(type == 4){
            return   y + '-' + m + '-' + d +' '+ h + ':' + minute;
        }

    }
    static FriendTime(date){
        if(!date){
            return ''
        }
        let time=new Date(date.replace(/\-/g,'/')).getTime()
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - time;   //时间差的毫秒数
        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000))
        //计算出小时
        var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000))
        //计算相差分钟数
        var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000))
        let newdate=new Date(date);
        let newHour=newdate.getHours()
        let newminutes=newdate.getMinutes()
        if(days<0){
            return '刚刚'
        }
        if(days==0){
            if(hours==0&&minutes==0){
                return '刚刚'
            }else if(hours==0&&minutes<=59){
                return minutes+'分钟前'
            }else if(hours>0){
                return hours+'小时前'
            }
        }else {
            if(days<31){
                return days+'天前'
            }else{
                return this.formatDateTime(newdate,4)
            }
        }
    }
    static showTime(msgDate) {
        msgDate = new Date(msgDate);
        let nowDate = new Date();
        let result = "";
        let startTime = nowDate.getTime();
        let endTime = msgDate.getTime();
        let dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
        // let d = moment.duration(moment(nowDate, 'YYYYMMDD').diff(moment(msgDate, "YYYYMMDD")));
        // let dates = d.asDays();
        if (dates < 1) //小于24小时
        {
            if (nowDate.getDate() === msgDate.getDate()) {//同一天,显示时间
                result = moment(msgDate).locale("en").format("HH:mm");
            } else {
                result = moment(msgDate).locale("en").format("昨天 HH:mm");
            }
        }
        else if (dates < 2)//昨天
        {
            let yesterday = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1);
            if (msgDate.getDate() === yesterday.getDate()) {
                result = moment(msgDate).locale("en").format("昨天 HH:mm");
            } else {
                result = moment(msgDate).locale("en").format("前天 HH:mm");
            }
        }
        // else if (dates <= 2) //前天
        // {
        // 	result = moment(msgDate).format("前天 HH:mm");
        // }
        else if (dates < 7)//一周内
        {
            result = moment(msgDate).locale("en").format("M月D日");
        }
        else//显示日期
        {
            result = moment(msgDate).locale("en").format("YYYY/MM/DD");
        }
        return result;

    }

}