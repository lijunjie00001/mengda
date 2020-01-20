import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Linking
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASText from '../../components/ASText'
import Url from "../../../Resourse/url";
import * as Wechat from "react-native-wechat";
import Toast from "@remobile/react-native-toast";
@containers()
export default class VersionInfo extends Component{
    constructor(props){
        super(props)
        this.state={
            version:''
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'版本信息',
        });
        this.getVersion()
    }
    getVersion(){
        this.props.fetchData(this, '', Url.getVersion(), {}, successCallback = (data) => {
            console.log('............版本号',data)
            this.setState({
                version:data.info
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{alignItems:'center',marginTop:100}}>
                    <ASText style={{fontSize:15,color:colors.CHATTEXT,}} text={'版本号'+this.state.version}></ASText>
                    <ASText style={{fontSize:15,color:colors.CHATTEXT,marginTop:4.5}} text={'已经最新版本了'}></ASText>
                </View>
                <View style={styles.bottomView}>
                    <ASText style={{fontSize:12,color:colors.TIME,}} text={'安徽萌哒网络科技有限公司'}></ASText>
                    <ASText style={{fontSize:12,color:colors.TIME,marginTop:4.5}} text={'copyright@2019-2021'}></ASText>
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        alignItems:'center'
    },
    bottomView:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:17.5
    }
})
