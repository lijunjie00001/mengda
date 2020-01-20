import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions, Platform,Text
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASText from '../../components/ASText'
@containers()
export default class YouhuiJuanDetailsPage extends Component {
    static propTypes = {

    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.state={
            title:this.props.title,
            juanHao:this.props.juanHao,
            endTime:this.props.endTime,
        }

    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'详情',
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{backgroundColor:colors.Gray,height:50,justifyContent:'center',alignItems:'center'}}>
                    <ASText style={{fontSize:18,fontWeight:'bold',color:colors.CHATTEXT}} text={this.state.title+'劵'}></ASText>
                </View>
                <View style={{height:87,backgroundColor:colors.WHITE,alignItems:'center'}}>
                    <View style={{marginTop:12,height:colors.width_1_PixelRatio,backgroundColor:colors.LINE}}></View>
                    <ASText style={{fontSize:15,color:colors.JF_title,marginTop:29}} text={'劵号：'+this.state.juanHao}></ASText>
                    <View style={{position:'absolute',left:-10,top:0,height:20,width:20,borderRadius:10,backgroundColor:colors.CHATBUDDLE}}></View>
                    <View style={{position:'absolute',right:-10,top:0,height:20,width:20,borderRadius:10,backgroundColor:colors.CHATBUDDLE}}></View>
                </View>
                <View style={{marginTop:15,alignItems:'center'}}>
                    <ASText style={{fontSize:14,color:colors.CHATTEXT}} text={'有效期：'+this.state.endTime}></ASText>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.CHATBUDDLE,
        paddingTop:21,
        paddingHorizontal:12
    }
})
