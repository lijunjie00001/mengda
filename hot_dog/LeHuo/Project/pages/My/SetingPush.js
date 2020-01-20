import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text, Image, Alert, AsyncStorage,
} from 'react-native';
import containers from '../../containers/containers'
import Images from "../../../Resourse/Images";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import colors from "../../../Resourse/Colors";
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import ASText from '../../components/ASText'
@containers()
export default class SetingPush extends Component {
    static propTypes = {

    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        console.log('.....',this.props.userInfo)
        this.state={
            isdefault:this.props.userInfo.isPush==0?true:false,
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
        }

    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'消息设置',
        });
    }
    /**
     *@desc   设置推送
     *@author 张羽
     *@date   2019/3/4 下午11:17
     *@param
     */
    onPressSeting(){
        this.props.fetchData(this, '', Url.setPush(this.state.uid,this.state.isdefault?'1':'0'), {}, successCallback = (data) => {
            console.log('............推送',data)
            this.setState({
                isdefault:!this.state.isdefault
            },()=>{
                let userinfo={
                    ...this.props.userInfo,
                    isPush:this.state.isdefault?0:1
                }
                AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
                if(this.props.successBack){
                    this.props.successBack()
                }
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ASTouchableOpacity style={[styles.cellView,{paddingVertical:7,marginTop:10}]} onPress={()=>{this.onPressSeting()}}>
                    <ASText style={styles.title} text={'消息设置'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={!this.state.isdefault?Images.NO_default:Images.Yes_default} style={{width:50,height:31}}/>
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