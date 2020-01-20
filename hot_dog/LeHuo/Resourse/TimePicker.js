import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import Picker from 'react-native-picker';
import moment from 'moment';
//选择当前日期前一天的时间
function getDates(startYear){
    let arr = [];
    let dates = new Date('2028-12-30').getFullYear()
    let nowData=new Date()
    let nowYears=nowData.getFullYear()
    let nowMonth=nowData.getMonth()+1
    let nowDay=nowData.getDate()
    for(let i=startYear;i<=nowYears;i++){
        let arrM = [];
        let date = {};
        for(let j = 1;j<13;j++){
            if(i==nowYears){
                if(j>nowMonth){
                    continue
                }
            }
            let month = {};
            let day = [];
            if(j === 2){
                for(let k=1;k<(isLeapYear(i)?30:29);k++){
                    if(k>nowDay&&j==nowMonth&&i==nowYears){
                        continue
                    }else{
                        day.push(k+'日');
                    }
                }
            }else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    if(k>nowDay&&j==nowMonth&&i==nowYears){
                        continue
                    }else{
                        day.push(k+'日');
                    }
                }
            }else{
                for(let k=1;k<31;k++){
                    if(k>nowDay&&j==nowMonth&&i==nowYears){
                        continue
                    }else{
                        day.push(k+'日');
                    }
                }
            }
            if(day.length>0){
                month[j+'月'] = day;
                arrM.push(month);
            }
        }
        date[i+'年'] = arrM;
        arr.push(date)
    }
    return arr;
}
// 选择所有的时间
function getAlldates(startYear){
    let arr = [];
    let dates = new Date('2028-12-30').getFullYear()
    let nowData=new Date()
    let nowYears=nowData.getFullYear()
    let nowMonth=nowData.getMonth()+1
    let nowDay=nowData.getDate()
    for(let i=nowYears;i<=dates;i++){
        let arrM = [];
        let date = {};
        for(let j = 1;j<13;j++){
            if(i==nowYears){
                if(j<nowMonth){
                    continue
                }
            }
            let month = {};
            let day = [];
            if(j === 2){
                for(let k=1;k<(isLeapYear(i)?30:29);k++){
                    if(k<nowDay&&j==nowMonth&&i==nowYears){
                        continue
                    }else{
                        day.push(k+'日');
                    }

                }
            }else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    if(k<nowDay&&j==nowMonth&&i==nowYears){
                        continue
                    }else{
                        day.push(k+'日');
                    }

                }
            }else{
                for(let k=1;k<31;k++){
                    if(k<nowDay&&j==nowMonth&&i==nowYears){
                        continue
                    }else{
                        day.push(k+'日');
                    }
                }
            }
            month[j+'月'] = day;
            arrM.push(month);
        }
        date[i+'年'] = arrM;
        arr.push(date)
    }
    return arr;
}

function getPreciseDates(startYear) {
    // let arr = [];
    // let dates = new Date('2028-12-30 24:00').getFullYear()
    // for(let i=startYear;i<=dates;i++){
    //     let arrM = [];
    //     let date = {};
    //     for(let j = 1;j<13;j++){
    //         let month = {};
    //         let day = [];
    //         if(j === 2){
    //             for(let k=1;k<(isLeapYear(i)?30:29);k++){
    //                 day.push(k+'日');
    //             }
    //         }else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
    //             for(let k=1;k<32;k++){
    //                 day.push(k+'日');
    //             }
    //         }else{
    //             for(let k=1;k<31;k++){
    //                 day.push(k+'日');
    //             }
    //         }
    //         let hourArr=[]
    //         for(let k=0;k<24;k++){
    //             let minuter=[]
    //             let hour={}
    //             for(let j=0;j<60;j++){
    //                 minuter.push(j+'分')
    //             }
    //             hour[k+'时']=minuter
    //             hourArr.push(hour)
    //         }
    //         let newday=[];
    //         for(let i=1;i<day.length+1;i++){
    //             let days={}
    //              days[i+'日']=hourArr
    //              newday.push(days)
    //         }
    //         month[j+'月'] = newday;
    //         arrM.push(month);
    //     }
    //     date[i+'年'] = arrM;
    //     arr.push(date)
    // }
    // let hourArr=[]
    // for(let k=0;k<24;k++){
    //     let minuter=[]
    //     let hour={}
    //     for(let j=0;j<60;j++){
    //         minuter.push(j+'分')
    //     }
    //     hour[k+'时']=minuter
    //     hourArr.push(hour)
    // }
    // let pickerData=[arr,hourArr]
    // return hourArr
    let dates = new Date('2028-12-30').getFullYear()
    let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];
    for(let i=startYear;i<=dates;i++){
        years.push(i+'年')
    }

    for(let i=1;i<13;i++){
        months.push(i+'月');
    }
    for(let i=0;i<24;i++){
        hours.push(i+'时');
    }
    for(let i=1;i<32;i++){
        days.push(i+'日');
    }
    for(let i=1;i<61;i++){
        minutes.push(i+'分');
    }
    let pickerData = [years, months, days, hours, minutes];
    return pickerData

}

function getAskForLeaveDates(startYear) {
    let hours = [],
        minutes = [];

    for(let i=1;i<13;i++){
        hours.push(i + '时');
    }
    for(let i=0;i<60;i++){
        minutes.push(i + '分');
    }
    let now = new Date();
    let cdate = [];
    let daySum = isLeapYear(now.getFullYear()) ? 366 : 365 ;
    let week = ['周日','周一','周二','周三','周四','周五','周六']
    for(let i=0;i<daySum;i++){
        var d=new Date();
        d.setDate(now.getDate() + i);
        cdate.push((d.getMonth()+1) + '月' + d.getDate() + '日  ' + week[d.getDay()]);
    }
    let pickerData = [cdate, ['上午', '下午'], hours, minutes];
    return pickerData;
}

// 判断是否是闰年
function isLeapYear(year){
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
}
export default class TimePicker{
    /***
     * @param startYear: 设置开始年份 number,string ,如1949, '1949'
     * @param selectedValue: 设置初始值,如1987-04-01
     * @param onPickerConfirm: 确认触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * @param onPickerCancel: 取消触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * @param onPickerSelect: 选中触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * 只能选择当前日期后一天的时间
     */
    static datePicker(startYear,selectedValue,onPickerConfirm,onPickerCancel,onPickerSelect){
        selectedValue = moment(selectedValue).toArray()
        selectedValue = [selectedValue[0]+'年',selectedValue[1]+1+'月',selectedValue[2]+'日',selectedValue[3]+'时']
        Picker.init({
            isloop:true,
            pickerData: getDates(startYear),
            selectedValue:selectedValue,
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            pickerTitleText:'',
            pickerCancelBtnColor:[11,99,247,1],
            pickerConfirmBtnColor:[11,99,247,1],
            pickerBg:[255,255,255,1],
            pickerToolBarBg:[255,255,255,1],
            pickerFontColor:[0,0,0,1],
            wheelFlex:[2,1,2],
            onPickerConfirm:(data)=>{
                DATA = {y:data[0],M:(parseInt(data[1])-1),D:data[2]}
                DATA = moment(DATA).format('YYYY-MM-DD');
                interval = moment(DATA).unix()
                onPickerConfirm(DATA,interval)
            },
            onPickerCancel:(data)=>{
                DATA = {y:data[0],M:(parseInt(data[1])-1),D:data[2]}
                DATA = moment(DATA).format('YYYY-MM-DD');
                interval = moment(DATA).unix()
                onPickerCancel(DATA,interval)
            },
            onPickerSelect:(data)=>{
                DATA = {y:data[0],M:(parseInt(data[1])-1),D:data[2]}
                DATA = moment(DATA).format('YYYY-MM-DD');
                interval = moment(DATA).unix()
                onPickerSelect(DATA,interval)
            },
        });
        Picker.show();
    }


    /***  请假选择日期
     * @param startYear: 设置开始年份 number,string ,如1949, '1949'
     * @param selectedValue: 设置初始值,如1987-04-01
     * @param onPickerConfirm: 确认触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * @param onPickerCancel: 取消触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * @param onPickerSelect: 选中触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     */
    static preciseDatesDatePicker(startYear,selectedValue,onPickerConfirm,onPickerCancel,onPickerSelect) {
        let date = new Date();
        if (selectedValue == '') {
            console.log(date.getFullYear().toString()+'年',(date.getMonth()+1).toString()+'月',date.getDate().toString()+'日',date.getHours().toString()+'时',date.getMinutes().toString()+'分')
            selectedValue = [date.getFullYear().toString()+'年',(date.getMonth()+1).toString()+'月',date.getDate().toString()+'日',date.getHours().toString()+'时',date.getMinutes().toString()+'分']
        } else {
            selectedValue = moment(selectedValue).toArray()
            selectedValue = [selectedValue[0]+'年',selectedValue[1]+1+'月',selectedValue[2]+'日',selectedValue[3]+'时',selectedValue[4]+'分']//,
        }
        Picker.init({
            isloop:true,
            pickerData: getPreciseDates(startYear),
            selectedValue:selectedValue,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText: '',
            wheelFlex: [2, 1, 1, 1, 1],
            onPickerConfirm: (data)=> {
                let targetValue = [...data];
                if(parseInt(targetValue[1]) === 2){
                    if(parseInt(targetValue[0])%4 === 0 && parseInt(targetValue[2]) > 29){
                        targetValue[2] = 29+'日';
                    }
                    else if(parseInt(targetValue[0])%4 !== 0 && parseInt(targetValue[2]) > 28){
                        targetValue[2] = 28+'日';
                    }
                }
                else if(parseInt(targetValue[1]) in {4:1, 6:1, 9:1, 11:1} && parseInt(targetValue[2]) > 30){
                    targetValue[2] = 30+'日';

                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(data)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if (k == 0) {
                            targetValue[k] = parseInt(v)+'年';
                        } else if (k ==1) {
                            targetValue[k] = parseInt(v)+'月';
                        } else if (k ==2) {
                            targetValue[k] = parseInt(v)+'日';
                        } else if (k ==3) {
                            targetValue[k] = parseInt(v)+'时';
                        } else if (k ==4) {
                            targetValue[k] = parseInt(v)+'分';
                        }
                    });
                    Picker.select(targetValue);
                    data = targetValue;
                }
                DATA = {y:data[0],M:(parseInt(data[1])-1),d:data[2],h:data[3],m:data[4]}
                DATA = moment(DATA).format('YYYY-MM-DD HH:mm');
                interval = moment(DATA).unix()
                onPickerConfirm(DATA,interval)
            },
            onPickerCancel: (data)=> {
                DATA = {y:data[0],M:(parseInt(data[1])-1),d:data[2],h:data[3],m:data[4]}
                DATA = moment(DATA).format('YYYY-MM-DD HH:mm');
                interval = moment(DATA).unix()
                onPickerCancel(DATA,interval)
            },
            onPickerSelect: (data)=> {
                let targetValue = [...data];
                if(parseInt(targetValue[1]) === 2){
                    if(parseInt(targetValue[0])%4 === 0 && parseInt(targetValue[2]) > 29){
                        targetValue[2] = 29+'日';
                    }
                    else if(parseInt(targetValue[0])%4 !== 0 && parseInt(targetValue[2]) > 28){
                        targetValue[2] = 28+'日';
                    }
                }
                else if(parseInt(targetValue[1]) in {4:1, 6:1, 9:1, 11:1} && parseInt(targetValue[2]) > 30){
                    targetValue[2] = 30+'日';

                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(data)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if (k == 0) {
                            targetValue[k] = parseInt(v)+'年';
                        } else if (k ==1) {
                            targetValue[k] = parseInt(v)+'月';
                        } else if (k ==2) {
                            targetValue[k] = parseInt(v)+'日';
                        } else if (k ==3) {
                            targetValue[k] = parseInt(v)+'时';
                        } else if (k ==4) {
                            targetValue[k] = parseInt(v)+'分';
                        }
                    });
                    Picker.select(targetValue);
                    data = targetValue;
                }
                DATA = {y:data[0],M:(parseInt(data[1])-1),d:data[2],h:data[3],m:data[4]}
                DATA = moment(DATA).format('YYYY-MM-DD HH:mm');
                interval = moment(DATA).unix()
                onPickerSelect(DATA,interval)
            }
        });
        Picker.show();
    }
    /***
     * @param startYear: 设置开始年份 number,string ,如1949, '1949'
     * @param selectedValue: 设置初始值,如1987-04-01
     * @param onPickerConfirm: 确认触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * @param onPickerCancel: 取消触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * @param onPickerSelect: 选中触发事件, 传出DATA:1987-04-01 ,interval:时间戳
     * 只能选择所有的时间
     */
    static dataPickerAllTime(startYear,selectedValue,onPickerConfirm,onPickerCancel,onPickerSelect){
        selectedValue = moment(selectedValue).toArray()
        selectedValue = [selectedValue[0]+'年',selectedValue[1]+1+'月',selectedValue[2]+'日',selectedValue[3]+'时']
        Picker.init({
            isloop:true,
            pickerData: getAlldates(startYear),
            selectedValue:selectedValue,
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            pickerTitleText:'',
            pickerCancelBtnColor:[11,99,247,1],
            pickerConfirmBtnColor:[11,99,247,1],
            pickerBg:[255,255,255,1],
            pickerToolBarBg:[255,255,255,1],
            pickerFontColor:[0,0,0,1],
            wheelFlex:[2,1,2],
            onPickerConfirm:(data)=>{
                DATA = {y:data[0],M:(parseInt(data[1])-1),D:data[2]}
                DATA = moment(DATA).format('YYYY-MM-DD');
                interval = moment(DATA).unix()
                onPickerConfirm(DATA,interval)
            },
            onPickerCancel:(data)=>{
                DATA = {y:data[0],M:(parseInt(data[1])-1),D:data[2]}
                DATA = moment(DATA).format('YYYY-MM-DD');
                interval = moment(DATA).unix()
                onPickerCancel(DATA,interval)
            },
            onPickerSelect:(data)=>{
                DATA = {y:data[0],M:(parseInt(data[1])-1),D:data[2]}
                DATA = moment(DATA).format('YYYY-MM-DD');
                interval = moment(DATA).unix()
                onPickerSelect(DATA,interval)
            },
        });
        Picker.show();
    }

    static hide(){
        Picker.hide();
    }
}
