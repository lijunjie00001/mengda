import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";

@containers()
export default class ChangeNamePage extends Component{
    static propTypes = {
        successBack:React.PropTypes.func,
        userInfo:React.PropTypes.object,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.state={
            name:this.props.userInfo.username?this.props.userInfo.username:'',
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'昵称',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                <Text style={[styles.title,{color:colors.CHATTEXT}]}>{'保存'}</Text>
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
        if(!this.state.name){
            Alert.alert('提示','昵称不能为空',[{text:'确定',style:'cancel'}]);
        }
        this.props.fetchData(this, '', Url.changeName(this.state.uid,this.state.name), {}, successCallback = (data) => {
            console.log('............名字',data)
            Alert.alert('提示','昵称修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                    let userinfo={
                        ...this.props.userInfo,
                        username:this.state.name
                    }
                    AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
                    DeviceEventEmitter.emit('login',userinfo)
                    if(this.props.successBack){
                        this.props.successBack()
                    }
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
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text)=>this.setState({name:text})}
                        defaultValue={this.state.name}
                        placeholder={'请输入昵称'}
                        placeholderTextColor={colors.BackPage}
                    />
                    <ASTouchableOpacity onPress={()=>{this.setState({name:''})}}>
                        <Image source={Images.DEL_GRAY} style={{width:16,height:16}}/>
                    </ASTouchableOpacity>
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
    }
});