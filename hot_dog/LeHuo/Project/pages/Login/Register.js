/**
 *@FileName Register.js
 *@desc (注册页面)
 *@author chenbing
 *@date 2018/10/29 17:53
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    TextInput, Platform, Alert, AsyncStorage, DeviceEventEmitter,ScrollView
} from 'react-native';
import {isPhoneX, width} from '../../../Resourse/CommonUIStyle'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import StringUtils from '../../../Resourse/StringUtil'
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getModel();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
import containers from '../../containers/containers'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
const CryptoJS = require('crypto-js');
import JPushModule from 'jpush-react-native';
import ASText from '../../components/ASText'
@containers()
export default class Register extends Component {
	constructor(props){
		super(props);
        this.countTime=this.countTime.bind(this)
		this.code=''
		this.state = {
			phone:'',//手机号
			validate:'',//验证码
			pwd:'',//密码
			confirmPwd:'',//确认密码
			isAgree:true,//是否同意协议
            messageCode:'获取验证码',
            waiting:false,
            isUp:false ,//是否上架
            inviteCode:'',//邀请码
		}
	}
    /* 组件要被从界面上移除的时候,清除定时器 */
    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'注册',
            hiddenNav:true
        });
        this.getInappStore()

    }
    /**
     *@desc   是否上架
     *@author 张羽
     *@date   2019/4/17 下午10:52
     *@param
     */
    getInappStore(){
        this.props.fetchData(this, '', Url.isUp(), {}, successCallback = (data) => {
            console.log('........data',data.info)
            this.setState({
                isUp:data.info==1&&Platform.OS != 'android'?true:false
            })
            return;
        }, failure = (data) => {
        });
    }
	/**
	 *@desc 点击是否同意协议
     *@author chenbing
	 *@date 2018/10/29 17:38
	 */
	toReadAgreement(){
		this.setState({isAgree:!this.state.isAgree});
	}
    /**
     *@desc   获取短信验证码
     *@author 张羽
     *@date   2018/11/27 下午2:07
     *@param
     */
    onPressgetCode(){
        if(!this.state.phone){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.phone)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        this.props.fetchData(this, '', Url.sendCode(this.state.phone,'2'), {}, successCallback = (data) => {
            this.countTime()
            this.code=data.info
            Toast.showShortCenter('验证码已发送，请注意查收')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
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
	 *@desc 点击返回
     *@author chenbing
	 *@date 2018/10/29 17:47
	 */
	back(){
       this.props.back()
	}

	/**
	 *@desc 点击注册
     *@author chenbing
	 *@date 2018/10/29 17:56
	 */
	toRegister(){
        if(!this.state.phone){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.phone)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.validate){
            Alert.alert('提示','请输入验证码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        // if(this.state.validate!=this.code){
         //    Alert.alert('提示','请输入正确的验证码',[{text:'确定',style:'cancel'}]);
         //    return ;
		// }
        if(!this.state.pwd){
            Alert.alert('提示','请输入密码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.confirmPwd){
            Alert.alert('提示','请输入确认密码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(this.state.pwd!==this.state.confirmPwd){
            Alert.alert('提示','两次密码输入不一致',[{text:'确定',style:'cancel'}]);
            return ;
        }
         JPushModule.getRegistrationID((RegistrationID)=>{
            //获取经纬度
            DeviceEventEmitter.emit('location',(newparam)=>{
                let param={
                    phone:this.state.phone,
                    password:this.state.pwd,
                    code:this.state.validate,
                    md5Code:CryptoJS.MD5(this.state.validate+'ZhangMeng').toString(),
                    registrationId:RegistrationID?RegistrationID:'8888',
                    lat:newparam.latitude,
                    lng:newparam.longitude,
                    inviteCode:this.state.inviteCode
                }
                this.props.fetchData(this, '', Url.register(param), {}, successCallback = (data) => {
                    console.log('............data',data)
                    Alert.alert('提示','注册成功',[{text:'确定',style:'cancel',onPress:()=>{
                            this.props.back()
                        }}]);
                    return;
                }, failure = (data) => {
                    Toast.showShortCenter(data.notice)
                });
            })
        })
	}
	/**
	 *@desc   点击协议
	 *@author 张羽
	 *@date   2019/5/5 下午10:03
	 *@param
	 */
    onPressXieyi(){
        this.props.push('XieyiPage',{transition:'forVertical'})
    }
	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
				<View style={{flex:1}}>
                    {/*<ImageBackground*/}
                    {/*    source={require("../../images/login/bg.jpg")}*/}
                    {/*    style={styles.imageBackground}*/}
                    {/*>*/}
                    {/*   */}
                    {/*</ImageBackground>*/}
                    <TouchableOpacity style={styles.closeBtn} onPress={()=>this.back()}>
                        <Image source={require("../../images/login/close.png")} style={styles.closeImg}/>
                    </TouchableOpacity>
                    <View style={{marginTop:65,justifyContent:'center',flexDirection:'row'}}>
                        <Image source={require("../../images/login/icon.png")} style={{width:65,height:65}}/>
                    </View>
                    <View style={{paddingBottom:48,backgroundColor:'black'}}>
                        <View style={styles.loginView}>
                            <View style={{marginTop:48,justifyContent:'center',flexDirection:'row'}}>
                                <ASText style={styles.loginText} text={'注册'}></ASText>
                            </View>
                           <View style={styles.loginContent}>
                            {/*手机号、邮箱输入*/}
                               <View style={[styles.loginInputView,{marginTop:0}]}>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入手机号码'}
                                    value = {this.state.phone}
                                    onChangeText={(text)=>this.setState({phone:text})}
                                />
                              </View>
                            {/*验证码输入*/}
                            <View style={styles.loginInputView}>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'验证码'}
                                    value = {this.state.validate}
                                    onChangeText={(text)=>this.setState({validate:text})}
                                />
                                <TouchableOpacity style={styles.validateBtn} onPress={()=>{this.onPressgetCode()}} disabled={this.state.waiting}>
                                    <ASText style={styles.validateText} text={this.state.messageCode}></ASText>
                                </TouchableOpacity>
                            </View>

                            {/*密码*/}
                            <View style={styles.loginInputView}>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入密码'}
                                    value = {this.state.pwd}
                                    onChangeText={(text)=>this.setState({pwd:text})}
                                    secureTextEntry={true}
                                />
                            </View>

                            <View style={styles.loginInputView}>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请再次输入密码'}
                                    value = {this.state.confirmPwd}
                                    onChangeText={(text)=>this.setState({confirmPwd:text})}
                                    secureTextEntry={true}
                                />
                            </View>
                               <View style={styles.loginInputView}>
                                   <TextInput
                                       style={styles.inputStyle}
                                       underlineColorAndroid={'transparent'}
                                       placeholder={'请输入邀请码（选填）'}
                                       value = {this.state.inviteCode}
                                       onChangeText={(text)=>this.setState({inviteCode:text})}
                                       secureTextEntry={true}
                                   />
                               </View>

                            {/*/!*注册按钮*!/*/}
                            {/*<TouchableOpacity style={styles.registerBtn} onPress={()=>this.toRegister()}>*/}
                            {/*    <ASText style={styles.registerBtnText} text={'注册'}></ASText>*/}
                            {/*</TouchableOpacity>*/}

                            {/*/!*阅读协议*!/*/}
                            {/*{this.state.isUp? <View style={styles.outView}>*/}
                            {/*    <TouchableOpacity style={styles.chooseBtn} onPress={()=>{this.toReadAgreement()}}>*/}
                            {/*        {this.state.isAgree?(*/}
                            {/*            <Image source={require("../../images/login/choose.png")} style={styles.chooseImg}/>*/}
                            {/*        ):(<Text/>)}*/}
                            {/*    </TouchableOpacity>*/}
                            {/*    <View style={styles.xyView}>*/}
                            {/*        <ASText style={styles.xyText} text={'我已阅读并同意'}></ASText>*/}
                            {/*        <TouchableOpacity onPress={()=>{this.onPressXieyi()}} >*/}
                            {/*           <ASText style={[styles.xyText,{color:'#3E90FE'}]} text={'《热狗注册服务协议》'}></ASText>*/}
                            {/*        </TouchableOpacity>*/}
                            {/*    </View>*/}
                            {/*</View>:<View style={styles.outView}></View>}*/}
                        </View>
                        </View>
                        <ASTouchableOpacity onPress={()=>{this.toRegister()}} style={{width:105,height:105,borderRadius:52.5,backgroundColor:'white',position:'absolute',
                            bottom:0,left:(width-105)/2,zIndex: 1,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require("../../images/login/switch.png")} style={{width:71,height:71}}/>
                        </ASTouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:44,marginLeft:15,
                        width:width-30}}>
                        <View style={styles.xyView}>
                            <ASText style={styles.xyText} text={'我已阅读并同意'}></ASText>
                            <TouchableOpacity onPress={()=>{this.onPressXieyi()}} >
                                <ASText style={[styles.xyText,{color:'#dcc490'}]} text={'《热狗注册服务协议》'}></ASText>
                            </TouchableOpacity>
                        </View>
                    </View>
				</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	imageBackground:{
		width:width,
		height:250,
        paddingTop:Platform.OS === 'ios'?tabHeight:0,
        position:'absolute',
        top:0,
        left:0
	},
	closeBtn:{
        position:'absolute',
        top:Platform.OS === 'ios'?tabHeight:0,
        left:12,
        height:44,
        width:44,
        flexDirection:'row',
        alignItems:'center',
	},
	closeImg:{
        width:17,
        height:17,
		resizeMode:'contain'
	},
	loginView:{
        width:width-64,
        marginTop:22,
        marginLeft:32,
        backgroundColor:'white',
        borderRadius:32,
        paddingBottom: 77
	},
	loginText:{
        fontSize:20,
        color:"#1a1a1a",
	},
	loginContent:{
        marginTop:33,
	},
	loginInputView:{
        height:28,
        marginHorizontal:20,
        borderBottomWidth:1,
        borderBottomColor:'#d8d8d8',
        justifyContent:'center',
        marginTop:28
	},
	inputStyle:{
		padding:0,
		fontSize:14,
	},
	validateBtn:{
		position:'absolute',
		right:10,
	},
	validateText:{
		color:'#333',
		fontSize:15,
	},
	registerBtn:{
        width:width-84,
		height:40,
		justifyContent:'center',
		alignItems:'center',
		marginTop:50,
        marginLeft:30,
		borderRadius:20,
		backgroundColor:'#F2CB62'
	},
	registerBtnText:{
		fontSize:18,
		color:'#fff'
	},
	outView:{
        paddingHorizontal:15,
		height:45,
		marginTop:10,
		marginBottom:30,
		flexDirection:'row',
		alignItems:'center',
	},
	chooseBtn:{
		width:16,
		height:16,
		borderWidth:2,
		borderRadius:2,
		borderColor:'#F2CB62',
		justifyContent:'center',
		alignItems:'center',
	},
	chooseImg:{
		width:12,
		height:8,
		resizeMode:'contain'
	},
	xyView:{
		flexDirection:'row',
		marginLeft:10,
	},
	xyText:{
		fontSize:13,
		color:'#666'
	}
});
