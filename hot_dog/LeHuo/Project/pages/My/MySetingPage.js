import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, AsyncStorage,DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import JMessage from 'jmessage-react-plugin';
import SettingpushPage from "./SetingPush";
import ASText from '../../components/ASText'
@containers()
export default class MySetingPage extends Component{
    static propTypes = {
        isUp:React.PropTypes.bool,
    }
    static defaultProps = {
        isUp:false
    }
    constructor(props){
        super(props)
        this.successBack=this.successBack.bind(this)
        this.state={
            name:'',
            icon:'',
            uid:'',
            isPush:'',
            userInfo:{}

        }
    }
    componentWillUnmount() {
        if (this.login) {
            this.login.remove()
        }
    }
    componentWillMount() {
        this.successBack()
    }
    /**
     *@desc   修改回调
     *@author 张羽
     *@date   2018/12/12 下午11:19
     *@param
     */
    successBack(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    console.log('..........userinfo',userinfo)
                    this.setState({
                        name:userinfo.username?userinfo.username:'',
                        icon:userinfo.cover,
                        uid:userinfo.id+'',
                        isPush:userinfo.isPush+'',
                        userInfo:userinfo
                    })
                }
            }
        })
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'设置',
        });
        this.login=DeviceEventEmitter.addListener('login',(userinfo)=>{
            this.successBack()
        });
    }
    /**
     *@desc   点击头像
     *@author 张羽
     *@date   2018/12/13 下午2:59
     *@param
     */
    onPressIcon(){
        this.props.push('MyinfoPage')
    }
    /**
     *@desc   点击地址
     *@author 张羽
     *@date   2018/12/13 下午3:00
     *@param
     */
    onPressAddreee(){
        this.props.push('AddressListPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    /**
     *@desc   点击密码
     *@author 张羽
     *@date   2018/12/14 上午10:31
     *@param
     */
    onPressCode(){
        this.props.push('CodesetingPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    /**
     *@desc   点击消息
     *@author 张羽
     *@date   2019/3/4 下午11:12
     *@param
     */
    onPressMessage(){
        this.props.push('SettingpushPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    /**
     *@desc   退出登录
     *@author 张羽
     *@date   2019/1/3 下午3:31
     *@param
     */
    logout(){
        JMessage.logout()
        AsyncStorage.removeItem('userInfo')
        DeviceEventEmitter.emit('logout')
        this.props.back()
    }
    render(){
        return(
            <View style={styles.container}>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressIcon()}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={this.state.icon?{uri:this.state.icon}:Images.ICON} style={{width:65,height:65,borderRadius:32.5}}/>
                        <ASText style={[styles.title,{marginLeft:4}]} text={this.state.name}></ASText>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                {this.props.isUp?<ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressAddreee()}}>
                    <ASText style={styles.title} text={'我的收货地址'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={''}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>:null}
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressMessage()}}>
                    <ASText style={styles.title} text={'消息设置'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={''}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={[styles.cellView,{marginTop:10}]} onPress={()=>{this.onPressCode()}}>
                    <ASText style={styles.title} text={'密码设置'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={''}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                {/*<ASTouchableOpacity style={[styles.cellView,{marginTop:10}]} >*/}
                    {/*<Text style={styles.title}>{'清除缓存'}</Text>*/}
                    {/*<View style={{flexDirection:'row',alignItems:'center'}}>*/}
                        {/*<Text style={[styles.title,{color:colors.TIME}]}>{''}</Text>*/}
                        {/*<Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>*/}
                    {/*</View>*/}
                {/*</ASTouchableOpacity>*/}
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.props.push('VersionInfo')}}>
                    <ASText style={styles.title} text={'版本信息'}/>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={''}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.btnView} onPress={()=>{this.logout()}}>
                    <ASText style={{color:colors.WHITE,fontSize:17}} text={'退出登录'}></ASText>
                </ASTouchableOpacity>
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
        color:colors.CHATTEXT
    },
    btnView:{
        width:'80%',
        height:40,
        justifyContent:'center',
        alignItems:'center',
        marginTop:50,
        marginLeft:'10%',
        borderRadius:20,
        backgroundColor:colors.CHATBUDDLE
    }
});
