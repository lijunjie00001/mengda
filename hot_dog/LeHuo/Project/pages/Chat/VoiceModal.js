import React, {Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Modal, Dimensions,Text
} from 'react-native';
import colors from "../../../Resourse/Colors";
import Images from "../../../Resourse/Images";
import ASText from '../../components/ASText'
export default class VoiceModal extends Component{
    constructor(props){
        super(props)
        this.state={
            modalVisible:false,
            text:'手指上滑，取消发送',
            red:false,
        }
    }
    show(){
        this.setState({
            modalVisible:true,
            red:false
        })
    }
    showRed(){
        this.setState({
            modalVisible:true,
            text:'松开手指，取消发送',
            red:true
        })
    }
    hide(){
        this.setState({
            modalVisible:false,
            text:'手指上滑，取消发送',
            red:false,
        })
    }
    render(){
        return(
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}
            >
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:150,paddingVertical:20,justifyContent:'center',alignItems:'center',backgroundColor:colors.BLACK_TRANSPARENT_COLOR}}>
                        <Image source={Images.ChatVedio} style={{width:50,height:50}}/>
                        <ASText style={{fontSize:15,color:'white',marginTop:10,backgroundColor:this.state.red?'red':colors.TRANSPARENT_COLOR}} text={'手指上滑，取消发送'}></ASText>
                    </View>
                </View>
            </Modal>

        )
    }
}