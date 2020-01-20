
/**
 *@FileName Login.js
 *@desc (登录页)
 *@author chenbing
 *@date 2018/10/29 16:54
 */
import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Image,
	TouchableOpacity,
	TextInput,Platform,Alert,AsyncStorage,DeviceEventEmitter,ScrollView
} from 'react-native';
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import StringUtils from '../../../Resourse/StringUtil'
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getModel();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
import containers from '../../containers/containers'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import Config from '../../../Resourse/Config'
const CryptoJS = require('crypto-js');
import JPushModule from 'jpush-react-native';
import JMessage from 'jmessage-react-plugin';
import *as Wechat from 'react-native-wechat'
import * as QQAPI from 'react-native-qq';
import * as WeiBo from 'react-native-weibo-login';
import ASText from '../../components/ASText'
@containers()
export default class Login extends Component {
	constructor(props){
		super(props);
		this.countTime=this.countTime.bind(this)
        this.wechatLogin=this.wechatLogin.bind(this)
        this.getWechatInfo=this.getWechatInfo.bind(this)
        this.getWechatInformation=this.getWechatInformation.bind(this)
        this.loginThird=this.loginThird.bind(this)
        this.weiboLogin==this.weiboLogin.bind(this)
        this.getWeiboInformation=this.getWeiboInformation.bind(this)
        this.qqLogin=this.qqLogin.bind(this)
        this.code=''
        this.loginType=''
		this.state = {
			account:'',//用户名、邮箱
			validate:'',//密码
            messageCode:'获取验证码',
            waiting:false,
            isstallWexin: false
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
            title:'登录',
            hiddenNav:true
        });
        Wechat.isWXAppInstalled().then((param)=>{
            this.setState({
                isstallWexin:param
            })
        })
    }
    /**
     *@desc   扣扣登录
     *@author 张羽
     *@date   2019/2/22 下午5:03
     *@param
     */
    qqLogin(){
        QQAPI.login().then((responseCode)=>{
            console.log('..............jjjj',responseCode)
            this.getQQinformation(responseCode.access_token,responseCode.oauth_consumer_key,responseCode.openid)
        }).catch((err)=>{
        })
    }
    /**
     *@desc   获取qq信息
     *@author 张羽
     *@date   2019/2/22 下午5:12
     *@param
     */
    getQQinformation(access_token,oauth_consumer_key,openid){
        this.props.fetchData(this, '', Url.qqInfomation(access_token,oauth_consumer_key,openid), {}, successCallback = (data) => {
            return;
        }, failure = (data) => {
            console.log('............qq',data)
            if(data.ret==0){
                let param={
                    type:1,
                    open_id:openid,
                    cover:data.figureurl_qq,
                    nickname:data.nickname
                }
                this.loginThird(param)
            }
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
	 *@desc 登录
	 *@author chenbing
	 *@date 2018/10/29 16:21
	 */
     toLogin(){
        if(!this.state.account){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.account)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.validate){
            Alert.alert('提示','请输入密码',[{text:'确定',style:'cancel'}]);
            return
        }
        // if(this.state.validate!=this.code){
        //     Alert.alert('提示','请输入正确的验证码',[{text:'确定',style:'cancel'}]);
        //     return
        // }
         JPushModule.getRegistrationID((RegistrationID)=>{
            //获取经纬度
            DeviceEventEmitter.emit('location',(newparam)=>{
                let param={
                    phone:this.state.account,
                    password:this.state.validate,
                    registrationId:RegistrationID?RegistrationID:'8888',
                    lat:newparam.latitude,
                    lng:newparam.longitude
                }
                this.props.fetchData(this, '', Url.codeToLogin(param), {}, successCallback = (data) => {
                    console.log('............data',data)
                    let userInfo = JSON.stringify(data.info);
                    AsyncStorage.setItem('userInfo',userInfo);
                    //异步登录IM
                    DeviceEventEmitter.emit('login',data.info)
                    this.props.back()
                    return;
                }, failure = (data) => {
                    Toast.showShortCenter(data.notice)
                });
            })
         })
	}
	/**
	 *@desc 忘记密码
     *@author chenbing
	 *@date 2018/10/29 16:20
	 */
	forgetPwd(){
	    this.props.push('UpdataPassword')
	}
	/**
	 *@desc 注册
     *@author chenbing
	 *@date 2018/10/29 16:23
	 */
	toRegister(){
        this.props.push('Register')
	}
	/**
	 *@desc
     *@author chenbing
	 *@date 2018/10/29 16:25
	 *@param type 登录类型
	 */
	anotherLogin(type){
		switch(type){
			case 'qq':
                this.loginType='qq'
				this.qqLogin()
                break;
			case 'wx':
                this.loginType='wx'
			    this.wechatLogin()
				break;
			case 'wb':
                this.loginType='wb'
			    this.weiboLogin()
				break;
		}
	}
	/**
	 *@desc   微博登录
	 *@author 张羽
	 *@date   2019/1/4 上午10:47
	 *@param
	 */
	weiboLogin(){
        let config = {
            appKey:Config.weiboKey,
            scope: 'all',
            redirectURI: 'http://api.weibo.com/oauth2/default.html',
        }
        WeiBo.login(config)
            .then(res=>{
                console.log('login success:',res)
                this.getWeiboInformation(res.accessToken,res.userID)
            }).catch(err=>{
            console.log('login fail:',err)
        })
    }
    /**
     *@desc   获取微博token
     *@author 张羽
     *@date   2019/1/15 下午4:15
     *@param
     */
    getWeiboInformation(token,uid){
        this.props.fetchData(this, '', Url.weiboInfomation(token,uid), {}, successCallback = (data) => {
            return;
        }, failure = (data) => {
            console.log('............weibo',data)
            if(data.id){
                let param={
                    type:3,
                    open_id:data.idstr,
                    cover:data.avatar_hd,
                    nickname:data.screen_name
                }
                this.loginThird(param)
            }
        });
	}
	/**
	 *@desc   微信登录
	 *@author 张羽
	 *@date   2019/1/3 下午4:38
	 *@param
	 */
	wechatLogin(){
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_keshiClient';
        //判断微信是否安装
        Wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    //发送授权请求
                    Wechat.sendAuthRequest(scope, state)
                        .then(responseCode => {
                            //返回code码，通过code获取access_token
                            console.log('..............jjjj',responseCode)
                            this.access_token=responseCode.code
                            this.appid=responseCode.appid
                            this.getWechatInfo(responseCode.appid,responseCode.code)
                        })
                        .catch(err => {
                            Toast.showShortCenter('登录授权发生错误：',err)
                        })
                } else {
                    Toast.showShortCenter('您还没安装微信')
                }
            })
    }
    /**
     *@desc   获取微信token
     *@author 张羽
     *@date   2019/1/3 下午4:47
     *@param
     */
    getWechatInfo(APPID,CODE){
        this.props.fetchData(this, '', Url.getWechatToken(CODE,Config.weSlectKey,Config.wechatkey), {}, successCallback = (data) => {
            return;
        }, failure = (data) => {
            console.log('............weixin',data)
            if(data.access_token){
                this.getWechatInformation(data.access_token,data.openid)
            }
        });
    }
    /**
     *@desc   获取微信信息
     *@author 张羽
     *@date   2019/1/3 下午5:22
     *@param
     */
    getWechatInformation(access_token,OPENID){
        this.props.fetchData(this, '', Url.getWechatInfo(access_token,OPENID), {}, successCallback = (data) => {
            return;
        }, failure = (data) => {
           if(data.openid){
               let param={
                   type:2,
                   open_id:data.openid,
                   cover:data.headimgurl,
                   nickname:data.nickname
               }
               this.loginThird(param)
           }
        });
    }
    /**
     *@desc   第三方登录
     *@author 张羽
     *@date   2019/1/4 上午10:07
     *@param
     */
    loginThird(obj){
        JPushModule.getRegistrationID((RegistrationID)=>{
            //获取经纬度
            DeviceEventEmitter.emit('location',(newparam)=>{
                let param={
                    ...obj,
                    registrationId:RegistrationID?RegistrationID:'8888',
                    lat:newparam.latitude,
                    lng:newparam.longitude
                }
                this.props.fetchData(this, '', Url.thirdToLogin(param), {}, successCallback = (data) => {
                    console.log('............data',data)
                    let userInfo = JSON.stringify(data.info);
                    AsyncStorage.setItem('userInfo',userInfo);
                    DeviceEventEmitter.emit('login',data.info)
                    this.props.back()
                    return;
                }, failure = (data) => {
                	if(data.status==90){
                		this.props.push('BangdingPhone',{param:param,loginType:this.loginType})
						return
					}
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
                    <ASTouchableOpacity style={styles.closeBtn} onPress={()=>{this.props.back()}}>
                        <Image source={require("../../images/login/close.png")} style={styles.closeImg}/>
                    </ASTouchableOpacity>
                    <View style={{marginTop:65,justifyContent:'center',flexDirection:'row'}}>
                        <Image source={require("../../images/login/icon.png")} style={{width:65,height:65}}/>
                    </View>
                    <View style={{paddingBottom:48,backgroundColor:'black'}}>
                        <View style={styles.loginView}>
                            <View style={{marginTop:48,justifyContent:'center',flexDirection:'row'}}>
                                <ASText style={styles.loginText} text={'登录'}></ASText>
                            </View>
                            <View style={styles.loginContent}>
                                {/*手机号、邮箱输入*/}
                                <View style={styles.loginInputView}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholder={'请输入手机号'}
                                        value = {this.state.account}
                                        onChangeText={(text)=>this.setState({account:text})}
                                    />
                                </View>
                                {/*验证码输入*/}
                                <View style={[styles.loginInputView,{marginTop:60}]}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholder={'请输入密码'}
                                        value = {this.state.validate}
                                        onChangeText={(text)=>this.setState({validate:text})}
                                        secureTextEntry={true}
                                    />
                                </View>
                                {/*忘记密码，手机注册*/}
                                <View style={styles.outView}>
                                    <ASTouchableOpacity onPress={()=>this.forgetPwd()}>
                                        <ASText style={styles.innerBtnText} text={'忘记密码？'}></ASText>
                                    </ASTouchableOpacity>
                                    <ASTouchableOpacity onPress={()=>this.toRegister()}>
                                        <ASText style={styles.innerBtnText} text={'手机注册'}></ASText>
                                    </ASTouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/*第三方账号登录*/}
                        <ASTouchableOpacity onPress={()=>{this.toLogin()}} style={{width:105,height:105,borderRadius:52.5,backgroundColor:'white',position:'absolute',
                            bottom:0,left:(width-105)/2,zIndex: 1,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require("../../images/login/switch.png")} style={{width:71,height:71}}/>
                        </ASTouchableOpacity>
                    </View>
                    <View style={{width:width,alignItems:'center',flexDirection:'row',justifyContent:'center',marginTop:28}}>
                        <View style={styles.anotherBtn}>
                            <ASTouchableOpacity onPress={()=>this.anotherLogin("qq")}>
                                <View style={[styles.anotherBtnView,{marginLeft:0}]}>
                                    <Image source={require("../../images/login/qq.png")} style={styles.anotherBtnImg}/>
                                </View>
                            </ASTouchableOpacity>
                            {this.state.isstallWexin?<ASTouchableOpacity onPress={()=>this.anotherLogin("wx")}>
                                <View style={styles.anotherBtnView}>
                                    <Image source={require("../../images/login/wx.png")} style={styles.anotherBtnImg}/>
                                </View>
                            </ASTouchableOpacity>:null}
                            <ASTouchableOpacity onPress={()=>this.anotherLogin("wb")}>
                                <View style={styles.anotherBtnView}>
                                    <Image source={require("../../images/login/wb.png")} style={styles.anotherBtnImg}/>
                                </View>
                            </ASTouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <ASText style={styles.anotherText} text={'第三方账号登录'}></ASText>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:13,marginLeft:15,
                        width:width-30,borderTopColor: '#d8d8d8',borderTopWidth: 1}}>
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
        // paddingTop:Platform.OS === 'ios'?tabHeight:0,
		backgroundColor: 'black',
	},
	imageBackground:{
		width:width,
		height:200,
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
		height:17
	},
	loginView:{
		width:width-64,
		marginTop:22,
		marginLeft:32,
		backgroundColor:'white',
        borderRadius:32,
        height:337
	},
	loginText:{
		fontSize:20,
		color:"#1a1a1a",
	},
	loginContent:{
		marginTop:46,
	},
	loginInputView:{
		height:28,
		marginHorizontal:20,
		borderBottomWidth:1,
		borderBottomColor:'#d8d8d8',
		justifyContent:'center',
	},
	inputStyle:{
		padding:0,
		fontSize:15,
	},
	validateBtn:{
		position:'absolute',
		right:10,
	},
	validateText:{
		color:'#333',
		fontSize:15,
	},
	loginBtn:{
		height:40,
		justifyContent:'center',
		alignItems:'center',
		marginTop:50,
		marginLeft:30,
		borderRadius:20,
		backgroundColor:'#F2CB62',
        width:width-84
	},
	loginBtnText:{
		fontSize:18,
		color:'#fff'
	},
	outView:{
		marginTop:37,
		marginBottom:30,
		paddingHorizontal:44,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between'
	},
	innerBtnText:{
		color:'#dcc490',
		fontSize:12,
	},
	bottomView:{
		width:width-24,
		paddingHorizontal:30,
		marginTop:25,
		justifyContent:'center',
		alignItems:'center',
	},
	anotherText:{
        marginTop:10,
		fontSize:13,
		color:'#8e9092'
	},
	anotherBtn:{
		flexDirection:'row',
		alignItems:'center',
        justifyContent:'center',
        width:width,
        marginBottom:20,

	},
	anotherBtnView:{
		width:40,
		height:40,
		borderRadius:20,
		backgroundColor:'#ECECEA',
		justifyContent:'center',
		alignItems:'center',
        marginLeft:25
	},
	anotherBtnImg:{
		width:20,
		height:20,
		resizeMode:'contain'
	},
    xyView:{
        flexDirection:'row',
        marginTop:12,
        justifyContent:'center'

    },
    xyText:{
        fontSize:13,
        color:'#d8d8d8'
    }
});
