import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text, Image, Alert, AsyncStorage, Platform,
} from 'react-native';
import containers from '../../containers/containers'
import Images from "../../../Resourse/Images";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import colors from "../../../Resourse/Colors";
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import JMessage from 'jmessage-react-plugin';
import ASText from '../../components/ASText'
@containers()
export default class MessageDaraoPage extends Component {
    static propTypes = {
        username:React.PropTypes.string, //用户名
        loginName:React.PropTypes.string,  //本身登录名
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.getNoDisturbList=this.getNoDisturbList.bind(this)
        this.state={
            isNoDisturb:false,
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'消息免打扰',
        });
        this.getNoDisturbList()
    }
    /**
     *@desc   获取是否免打扰
     *@author 张羽
     *@date   2019/3/11 下午10:41
     *@param
     */
    getNoDisturbList(){
        JMessage.getNoDisturbList((result) => {
            let  userInfos =Platform.OS === 'android'?result.userInfoArray:result.userInfos
            console.log('............userInfoArr',userInfos,result)
            for(let i=0;i<userInfos.length;i++){
                let parm=userInfos[i]
                if(parm.username===this.props.username){
                    this.setState({
                        isNoDisturb:true
                    })
                    break;
                }
            }
        }, (error) => {
            var code = error.code
            var desc = error.description
        })
    }
    /**
     *@desc   设置推送
     *@author 张羽
     *@date   2019/3/4 下午11:17
     *@param
     */
    onPressSeting(){
        JMessage.setNoDisturb({ type: 'single', username: this.props.username, isNoDisturb: !this.state.isNoDisturb },
            () => {
                // do something.
                this.setState({
                    isNoDisturb:!this.state.isNoDisturb
                })
            }, (error) => {
                var code = error.code
                var desc = error.description
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <ASTouchableOpacity style={[styles.cellView,{paddingVertical:7,marginTop:10}]} onPress={()=>{this.onPressSeting()}}>
                    <ASText style={styles.title} text={'消息免打扰'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={!this.state.isNoDisturb?Images.NO_default:Images.Yes_default} style={{width:50,height:31}}/>
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
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:colors.WHITE,
        paddingHorizontal:12,
        paddingVertical:15,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.BackPage
    },
})