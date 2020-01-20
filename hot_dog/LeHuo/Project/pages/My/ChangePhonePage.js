import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, DeviceEventEmitter, AsyncStorage
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import StringUtils from "../../../Resourse/StringUtil";
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
const CryptoJS = require('crypto-js');
import JPushModule from 'jpush-react-native';
import ASText from '../../components/ASText'
@containers()
export default class  ChangePhonePage extends Component{
    constructor(props){
        super(props)
        this.state={
            phone:this.props.phone,
            newPhone:'',
            messageCode:'获取验证码',
            waiting:false,
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'更换手机号',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                <ASText style={[styles.title,{color:colors.CHATTEXT}]} text={'保存'}></ASText>
            </ASTouchableOpacity>
        });
    }
    /**
     *@desc   倒计时
     *@author 张羽
     *@date   2018/11/27 下午2:11
     *@param
     */
    countTime() {
        this.setState({ waiting: true });
        let timecount = 60;
        // 开始倒计时
        this.interval = setInterval(() => {
            const timer = timecount--;
            if (timer === 0) {
                clearInterval(this.interval);
                this.setState({ messageCode: '重新获取' });
                this.setState({ waiting: false });
            } else {
                this.setState({ messageCode: `${timer}s` });
            }
        }, 1000);
    }
    /**
     *@desc   发送验证码
     *@author 张羽
     *@date   2019/3/4 下午11:29
     *@param
     */
    onPressSend(){
        if(!this.state.newPhone){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.newPhone)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        this.props.fetchData(this, '', Url.sendCode(this.state.newPhone,'3'), {}, successCallback = (data) => {
            this.countTime()
            this.code=data.info
            Toast.showShortCenter('验证码已发送，请注意查收')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   保存
     *@author 张羽
     *@date   2018/12/11 下午10:15
     *@param
     */
    onPressSave(){
        if(!this.state.newPhone){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.newPhone)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.code){
            Alert.alert('提示','请输入验证码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        JPushModule.getRegistrationID((RegistrationID)=>{
            //获取经纬度
            DeviceEventEmitter.emit('location',(newparam)=>{
                let param={
                    phone:this.state.phone,
                    newPhone:this.state.newPhone,
                    registrationId:RegistrationID?RegistrationID:'8888',
                    lat:newparam.latitude,
                    lng:newparam.longitude,
                    code:this.state.code,
                    md5Code:CryptoJS.MD5(this.state.code+'ZhangMeng').toString(),
                }
                this.props.fetchData(this, '', Url.changePhone(param), {}, successCallback = (data) => {
                    console.log('............data',data)
                    let userinfo={
                        ...this.props.userInfo,
                        phone:this.state.newPhone
                    }
                    AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
                    Alert.alert('提示','手机号修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                            this.props.back()
                        }}]);
                    return;
                }, failure = (data) => {
                    Toast.showShortCenter(data.notice)
                });
            })
        })

    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'原手机号'}></ASText>
                    <ASText style={styles.title} text={this.state.phone}></ASText>
                </View>
                <View style={[styles.cellView,{marginTop:10}]}>
                    <ASText style={styles.title} text={'新手机号'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder = {'手机号'}
                        placeholderTextColor = {colors.LINE}
                        onChangeText={(text)=>this.setState({newPhone:text})}
                    />
                </View>
                <View style={[styles.cellView]}>
                    <Text style={styles.title}>{'验  证  码'}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                        <TextInput
                            style={styles.inputStyle}
                            underlineColorAndroid={'transparent'}
                            placeholder = {'短信验证码'}
                            placeholderTextColor = {colors.LINE}
                            onChangeText={(text)=>this.setState({code:text})}
                        />
                        <ASTouchableOpacity style={styles.yanzhengView} onPress={()=>{this.onPressSend()}} disabled={this.state.waiting}>
                            <ASText style={[styles.title,{fontWeight:'bold'}]} text={this.state.messageCode}></ASText>
                        </ASTouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
        paddingTop:10
    },
    title:{
        fontSize:16,
        color:colors.CHATTEXT,
    },
    cellView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:colors.WHITE,
        paddingHorizontal:12,
        paddingVertical:15,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.BackPage
    },
    inputStyle:{
        padding:0,
        flex:1,
        fontSize:16,
        color:colors.CHATTEXT,
        marginLeft:15,
    },
    yanzhengView:{
        paddingHorizontal:12,
        paddingVertical:4,
        borderWidth:1,
        borderColor:colors.CHATTEXT,
        justifyContent:'center',
        alignItems:'center'
    }
});