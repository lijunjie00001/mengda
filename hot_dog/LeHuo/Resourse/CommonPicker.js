import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import Picker from 'react-native-picker';
import moment from "moment/moment";
export default class CommonPicker{
    /***
     * @param data: 数据
     * @param selectedValue: 设置初始值,
     * @param onPickerConfirm: 确认触发事件,
     * @param onPickerCancel: 取消触发事件,
     * @param onPickerSelect: 选中触发事件,
     */
    static datePicker(data,selectedValue,onPickerConfirm,onPickerCancel,onPickerSelect){
        if (selectedValue == null || selectedValue == '') {
            selectedValue = data[0];
        } else {
            let isSelect = false;
            for(let i=0;i<data.length;i++){
                if(selectedValue===data[i]){
                    isSelect = true;
                }
            }
            if (isSelect) {
                selectedValue = selectedValue;
            } else {
                selectedValue = data[0];
            }
        }
        Picker.init({
            isloop:true,
            pickerData:data ,
            selectedValue:[selectedValue],
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            pickerTitleText:'',
            pickerCancelBtnColor:[11,99,247,1],
            pickerConfirmBtnColor:[11,99,247,1],
            pickerBg:[255,255,255,1],
            pickerToolBarBg:[255,255,255,1],
            pickerFontColor:[0,0,0,1],
            onPickerConfirm:(data)=>{
                onPickerConfirm(data[0])
            },
            onPickerCancel:(data)=>{
                onPickerCancel(data)
            },
            onPickerSelect:(data)=>{
                onPickerSelect(data)
            },
        });
        Picker.show();
    }
    static hide(){
        Picker.hide();
    }
}