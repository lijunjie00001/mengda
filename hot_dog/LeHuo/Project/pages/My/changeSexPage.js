import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
    Dimensions, Platform, BackHandler, Text, Image, Alert, AsyncStorage, DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import Images from "../../../Resourse/Images";
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import ASText from '../../components/ASText'
@containers()
export default class changeSexPage extends Component {
    static propTypes = {
        successBack:React.PropTypes.func,
        userInfo:React.PropTypes.object,
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.state={
            sex:this.props.userInfo.sex?this.props.userInfo.sex:'',
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
        }

    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'性别',
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
        if(!this.state.sex){
            Alert.alert('提示','请选择性别',[{text:'确定',style:'cancel'}]);
        }
        this.props.fetchData(this, '', Url.changeSex(this.state.uid,this.state.sex), {}, successCallback = (data) => {
            console.log('............名字',data)
            Alert.alert('提示','性别修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                    let userinfo={
                        ...this.props.userInfo,
                        sex:this.state.sex
                    }
                    AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
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
    onPressJb(str){
        this.setState({
            sex:str
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressJb('1')}}>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <ASText style={[{fontSize:14,color:colors.CHATTEXT,lineHeight:20},this.state.sex=='1'?{color:colors.CODE_TEXT}:{}]} text={'男'}></ASText>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        {this.state.sex=='1'? <Image source={Images.RIGHT} style={{width:20,height:13}}/>:null}
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressJb('2')}}>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <ASText style={[{fontSize:14,color:colors.CHATTEXT,lineHeight:20},this.state.sex=='2'?{color:colors.CODE_TEXT}:{}]} text={'女'}></ASText>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        {this.state.sex=='2'?  <Image source={Images.RIGHT} style={{width:20,height:13}}/>:null}
                    </View>
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
        paddingHorizontal:17,
        height:50,
        backgroundColor:colors.WHITE,
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE,
        flexDirection:'row'
    },
    title:{
        fontSize:16,
        color:colors.CHATTEXT
    },
})
