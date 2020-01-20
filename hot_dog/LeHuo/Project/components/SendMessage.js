/**
 * Created by user on 16/8/24.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions, Platform,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ASText from '../../Resourse/ASText';
import colors from '../../Resourse/Colors';

const WIDTH = Dimensions.get('window').width;

export default class SendMessage extends Component {
    static propTypes = {
        showKeyboard:React.PropTypes.bool,
        onBlur:React.PropTypes.func,
        onChangeText:React.PropTypes.func,
        sendMessage:React.PropTypes.func,
        textInput:React.PropTypes.string,
        canSubmit:React.PropTypes.bool,
        topSpacing:React.PropTypes.number,
        placeholder:React.PropTypes.string ,
        autoFocus:React.PropTypes.bool ,

    };
    static defaultProps = {
        showKeyboard:false,
        textInput:'',
        canSubmit:false,
        topSpacing:0,
        autoFocus:true
    };
    constructor(props) {
        super(props);
        this.showKeyboard = this.showKeyboard.bind(this);
    }
    showKeyboard(){
        if(this.props.showKeyboard){
            return (
                <View style={styles.sendMessage}>
                    <View style={{flex:1,paddingLeft:10,justifyContent:'center'}}>
                        <TextInput ref='textinput'
                                   style={styles.textInput}
                                   underlineColorAndroid={"transparent"}
                                   placeholder={this.props.placeholder}
                                   onChangeText={this.props.onChangeText}
                                   value={this.props.textInput}
                                   onBlur={this.props.onBlur}
                                   autoFocus={this.props.autoFocus}
                                   multiline={true}
                        />
                    </View>
                    <TouchableOpacity onPress={this.props.sendMessage} disabled={!this.props.canSubmit} style={!this.props.canSubmit?[styles.sendBtn,{backgroundColor:'#ccc'}]:styles.sendBtn}>
                        <ASText style={{color:'#333333',fontSize:14}} text='发送' />
                    </TouchableOpacity>
                </View>
            )
        }
    }
    render () {
        return (
            <View style={styles.bottomView}>
                {this.showKeyboard()}
                {Platform.OS === 'android'?null: <KeyboardSpacer topSpacing={this.props.topSpacing}/>}
            </View>
        );
    }
}
let styles = StyleSheet.create({
    bottomView:{
        position:'absolute',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'#f4f5f9',
        bottom:0
    },
    sendMessage:{
        flexDirection:'row',
        width:WIDTH,
        backgroundColor:'#f4f5f9',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10
    },
    textInput:{
        flex:1,
        padding:0,
        fontSize:15,
        color:colors.CHATTEXT,
        backgroundColor:colors.WHITE,
        borderRadius:4,
        marginLeft:10,
        marginRight:10,
    },
    sendBtn:{
        width:60,
        height:33,
        backgroundColor:colors.WHITE,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
        marginRight:10
    }
});