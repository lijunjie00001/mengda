import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import { isPhoneX,width,height }   from '../../../Resourse/CommonUIStyle'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import ASText from '../../components/ASText'

@containers()
export default class CodeSetingPage extends Component{
    static propTypes = {
        successBack:React.PropTypes.func,
        userInfo:React.PropTypes.object,
    }
    constructor(props){
        super(props)
        this.state={
            name:this.props.userInfo.username?this.props.userInfo.username:'',
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
            jiuCode:'',
            newCode:'',
            secondCode:'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'修改密码',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                <ASText style={[styles.title,{color:colors.CHATTEXT}]} text={'保存'}></ASText>
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
        if(!this.state.jiuCode){
            Alert.alert('提示','请输入原密码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.newCode){
            Alert.alert('提示','请输入新密码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.secondCode){
            Alert.alert('提示','请输入新密码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(this.state.newCode!=this.state.secondCode){
            Alert.alert('提示','新密码跟确认新密码不想等',[{text:'确定',style:'cancel'}]);
            return ;
        }
        let param={
            userId:this.state.uid,
            oldPassword:this.state.jiuCode,
            newPassword:this.state.newCode
        }
        this.props.fetchData(this, '', Url.changePassword(param), {}, successCallback = (data) => {
            console.log('............订单',data)
            Alert.alert('提示','修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                    this.props.back()
                }}]);
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });

    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'昵称'}></ASText>
                    <ASText style={styles.title} text={this.state.name}></ASText>
                </View>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'旧    密   码'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder = {'原密码'}
                        placeholderTextColor = {colors.LINE}
                        secureTextEntry={true}
                        onChangeText={(text)=>this.setState({jiuCode:text})}
                    />
                </View>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'新    密   码'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder = {'新密码'}
                        placeholderTextColor = {colors.LINE}
                        secureTextEntry={true}
                        onChangeText={(text)=>this.setState({newCode:text})}
                    />
                </View>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'确认新密码'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder = {'确认新密码'}
                        placeholderTextColor = {colors.LINE}
                        secureTextEntry={true}
                        onChangeText={(text)=>this.setState({secondCode:text})}
                    />
                </View>
                 <ASText style={{fontSize:13,color:colors.Noticetitle,marginTop:11,marginLeft:12}} text={'密码由6-20位英文字母、数字或符号组成'}></ASText>
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
        color:colors.CHATTEXT
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
        marginLeft:6,
        textAlign:'right'
    },
    loginInputView:{
        marginTop:10,
        width:'90%',
        height:45,
        marginHorizontal:'5%',
        borderBottomWidth:1,
        borderBottomColor:'#eee',
        justifyContent:'center'
    },
    validateBtn:{
        position:'absolute',
        right:10,
    },
    validateText:{
        color:'#333',
        fontSize:15,
    },
});
