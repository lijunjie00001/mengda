/**
 *@FileName UpdatePassword.js
 *@desc (修改密码页面)
 *@author chenbing
 *@date 2018/10/29 18:02
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
import { isPhoneX ,width}   from '../../../Resourse/CommonUIStyle'
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
export default class UpdatePassword extends Component {
	constructor(props){
		super(props);
        this.countTime=this.countTime.bind(this)
		this.code=''
		this.state = {
			account:'',//账号
			validate:'',//验证码
			pwd:'',//密码
			confirmPwd:'',//确认密码
            messageCode:'获取验证码',
            waiting:false,
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
            title:'忘记密码',
            hiddenNav:true
        });
    }
    /**
     *@desc   获取短信验证码
     *@author 张羽
     *@date   2018/11/27 下午2:07
     *@param
     */
    onPressgetCode(){
        if(!this.state.account){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.account)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        this.props.fetchData(this, '', Url.sendCode(this.state.account,'5'), {}, successCallback = (data) => {
            this.countTime()
            this.code=data.info
            Toast.showShortCenter('验证码已发送，请注意查收')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.msg)
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
	 *@desc 点击确定，修改密码
     *@author chenbing
	 *@date 2018/10/29 17:59
	 */
	updatePwd(){
        if(!this.state.account){
            Alert.alert('提示','请输入手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.account)){
            Alert.alert('提示','请输入正确手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.validate){
            Alert.alert('提示','请输入验证码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(this.state.validate!=this.code){
            Alert.alert('提示','请输入正确的验证码',[{text:'确定',style:'cancel'}]);
            return ;
        }
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
                    phone:this.state.account,
                    password:this.state.pwd,
                    code:this.state.validate,
                    md5Code:CryptoJS.MD5(this.state.validate+'ZhangMeng').toString(),
                    registrationId:RegistrationID?RegistrationID:'8888',
                    lat:newparam.latitude,
                    lng:newparam.longitude
                }
                this.props.fetchData(this, '', Url.forgetPassword(param), {}, successCallback = (data) => {
                    console.log('............data',data)
                    Alert.alert('提示','密码修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                            this.props.back()
                        }}]);
                    return;
                }, failure = (data) => {
                    Toast.showShortCenter(data.notice)
                });
            })
         })
	}
	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
				<View style={{flex:1}}>
				<ImageBackground
					source={require("../../images/login/bg.jpg")}
					style={styles.imageBackground}
				>
					<ASTouchableOpacity style={[styles.closeBtn]} onPress={()=>this.back()}>
						<Image source={require("../../images/login/backImg.png")} style={styles.closeImg}/>
					</ASTouchableOpacity>
				</ImageBackground>
				<View style={styles.loginView}>
					<ASText style={styles.loginText} text={'修改密码'}></ASText>
					<View style={styles.loginContent}>
						{/*手机号、邮箱输入*/}
						<View style={styles.loginInputView}>
							<TextInput
								style={styles.inputStyle}
								underlineColorAndroid={'transparent'}
								placeholder={'请输入账号'}
								value = {this.state.account}
								onChangeText={(text)=>this.setState({account:text})}
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
							<ASTouchableOpacity style={styles.validateBtn} onPress={()=>{this.onPressgetCode()}} disabled={this.state.waiting}>
								<ASText style={styles.validateText} text={this.state.messageCode}></ASText>
							</ASTouchableOpacity>
						</View>
						{/*密码*/}
						<View style={styles.loginInputView}>
							<TextInput
								style={styles.inputStyle}
								underlineColorAndroid={'transparent'}
								placeholder={'请输入密码'}
								value = {this.state.pwd}
								onChangeText={(text)=>this.setState({pwd:text})}
							/>
						</View>
						<View style={styles.loginInputView}>
							<TextInput
								style={styles.inputStyle}
								underlineColorAndroid={'transparent'}
								placeholder={'请再次输入密码'}
								value = {this.state.confirmPwd}
								onChangeText={(text)=>this.setState({confirmPwd:text})}
							/>
						</View>
						{/*确定按钮*/}
						<ASTouchableOpacity style={styles.registerBtn} onPress={()=>{this.updatePwd()}}>
							<ASText style={styles.registerBtnText} text={'确定'}></ASText>
						</ASTouchableOpacity>

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
		backgroundColor: '#fff',
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
        width:22,
        height:22,
        resizeMode:'contain',
	},
	loginView:{
		width:width-24,
        marginTop:80,
        marginLeft:12,
		backgroundColor:'transparent'
	},
	loginText:{
		fontSize:26,
		color:"#fff",
		fontWeight:'bold',
        marginLeft:30
	},
	loginContent:{
		marginTop:36,
		borderRadius:10,
		backgroundColor:'#fff',
		borderColor:"#F2CB62",
		borderWidth:1,
	},
	loginInputView:{
        marginTop:10,
        height:45,
        marginHorizontal:15,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
        justifyContent:'center'
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
        backgroundColor:'#F2CB62',
		marginBottom:30
	},
	registerBtnText:{
		fontSize:18,
		color:'#fff'
	}
});
