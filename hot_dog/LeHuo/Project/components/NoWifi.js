/**
 * Created by user on 16/5/28.
 */
import React, {Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,

} from 'react-native';
import colors from '../../Resourse/Colors';
import ASText from './ASText'
export default class NoWifi extends Component {

    static propTypes = {
        resetFunc: React.PropTypes.func,    //需要重新请求的方法
    };
    render () {
        return (
            <View style={styles.mainStyle}>
                <Image style={styles.imageStyle} source={require('../images/common/wifi.png')}/>
                <ASText style={styles.textStyle1} text={'加载失败，请检查当前的网络环境！'}></ASText>
                <ASText style={styles.textStyle} text={'当前网络有问题,请稍后再试'}></ASText>
                <TouchableOpacity style={styles.btnStyle} onPress={this.props.resetFunc}>
                    <View style={styles.btnViewStyle}>
                        <ASText style={styles.btnText} text={'重新加载'}></ASText>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
let styles = StyleSheet.create({
    //
    mainStyle:{
        flexDirection:'column',
        backgroundColor:colors.WHITE,
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
    },
    imageStyle:{
        width:100,
        height:100,
        resizeMode:'contain',
    },
    textStyle1:{
        marginTop:26,
        fontSize:15,
        color:colors.SHOW_TEXT_COLOR
    },
    textStyle:{
        marginTop:12,
        fontSize:11,
        color:colors.HINT_TEXT_COLOR1,
        marginBottom:30,
    },
    btnStyle:{
        marginBottom:100,
    },
    btnViewStyle:{
        width:160,
        height:40,
        borderRadius:3,
        borderWidth:1,
        borderColor:colors.LINE_COLOR3,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',

    },
    btnText:{
        fontSize:15,
        color:colors.SHOW_TEXT_COLOR,
    }

});