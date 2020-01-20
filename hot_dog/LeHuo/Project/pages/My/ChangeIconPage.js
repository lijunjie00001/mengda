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
import { isPhoneX,width,height }   from '../../../Resourse/CommonUIStyle'
import PictureActionSheet from '../../components/PictureActionSheet'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import ASText from '../../components/ASText'
@containers()
export default class ChangeIconPage extends Component{
    static propTypes = {
        successBack:React.PropTypes.func,
        userInfo:React.PropTypes.object,
    }
    constructor(props){
        super(props)
        this.state={
            icon:this.props.userInfo.cover?this.props.userInfo.cover:'',
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
            imageStr:'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'头像',
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
        if(!this.state.icon){
            Alert.alert('提示','头像不能为空',[{text:'确定',style:'cancel'}]);
        }
        this.props.fetchData(this, '', Url.changeIcon(this.state.uid,this.state.imageStr), {}, successCallback = (data) => {
            console.log('............头像',data)
            Alert.alert('提示','头像修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                    let userinfo={
                        ...this.props.userInfo,
                        cover:data.info
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
    /**
     *@desc   图片
     *@author 张羽
     *@date   2018/12/11 下午10:06
     *@param
     */
    onGetImage(info){
        let imageStr='data:'+info.mime+';base64,'+info.data
        this.setState({icon:info.path,imageStr:imageStr})
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{marginTop:16,paddingHorizontal:12}}>
                    <Image source={!this.state.icon?Images.ICON:{uri:this.state.icon}} style={{width:width-24,height:width-24,borderRadius:(width-24)/2}}/>
                </View>
                <ASTouchableOpacity style={styles.btnView} onPress={()=>{ this.refs.picture.handlePress(1)}}>
                    <ASText style={styles.title} text={'拍照'}></ASText>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={[styles.btnView,{marginTop:20}]} onPress={()=>{ this.refs.picture.handlePress(2)}}>
                    <ASText style={styles.title} text={'从手机相册选择'}></ASText>
                </ASTouchableOpacity>
                <PictureActionSheet
                    ref={'picture'}
                    onSuccess={this.onGetImage.bind(this)}
                    includeBase64={true}
                    compressImageQuality={0.3}
                />
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
    },
    title:{
        fontSize:16,
        color:colors.CHATBUDDLE
    },
    btnView:{
        marginTop:31,
        width:width-24,
        marginLeft:12,
        height:44,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:11,
        backgroundColor:colors.WHITE
    }
});