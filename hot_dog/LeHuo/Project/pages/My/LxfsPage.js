import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, AsyncStorage, DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import { isPhoneX,width,height }   from '../../../Resourse/CommonUIStyle'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
const CryptoJS = require('crypto-js');
import JPushModule from 'jpush-react-native';
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import ASText from '../../components/ASText'
@containers()
export default class LxfsPage extends Component{
    static propTypes = {
        successBack:React.PropTypes.func,
        userInfo:React.PropTypes.object,
    }
    constructor(props){
        super(props)
        this.state={
            phone:this.props.userInfo.phone?this.props.userInfo.phone:'',
            code:'',
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'手机号',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                <ASText style={[styles.title,{color:colors.CHATTEXT}]} text={'确定'}></ASText>
            </ASTouchableOpacity>
        });
    }
    /**
     *@desc   保存
     *@author 张羽
     *@date   2018/12/11 下午10:15
     *@param
     */
    onPressSave(){
        JPushModule.getRegistrationID((RegistrationID)=>{
            //获取经纬度
            DeviceEventEmitter.emit('location',(newparam)=>{
                let param={
                    phone:this.state.phone,
                    password:this.state.code,
                    registrationId:RegistrationID?RegistrationID:'8888',
                    lat:newparam.latitude,
                    lng:newparam.longitude
                }
                this.props.fetchData(this, '', Url.toLogin(param), {}, successCallback = (data) => {
                    console.log('............data',data)
                    this.props.replace('ChangePhonePage',{uid:this.state.uid,phone:this.state.phone})
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
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'登录密码'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder = {'请输入登录密码'}
                        placeholderTextColor = {colors.LINE}
                        onChangeText={(text)=>this.setState({code:text})}
                        secureTextEntry={true}
                    />
                </View>
                <Text style={{fontSize:13,color:colors.Noticetitle,marginTop:11,marginLeft:12}}>{'备注:输入正确的登录密码才能修改手机号'}</Text>
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
    title:{
        fontSize:16,
        color:colors.CHATTEXT
    },
    inputStyle:{
        padding:0,
        flex:1,
        fontSize:16,
        color:colors.CHATTEXT,
        marginLeft:15,
        textAlign:'right'
    }
});
