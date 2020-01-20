/**
 * Created by cjh on 2018/5/18.
 * 封装textinput组件
 */

import React, {Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Platform,
    Text,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native';
export default class BTextInput extends Component {
    static propTypes = {
        value:React.PropTypes.string,//文本框的值
        defaultValue:React.PropTypes.string,//文本框默认值
        placeholder:React.PropTypes.string,//默认提示文字
        showDelButton:React.PropTypes.bool,//是否显示删除按钮
        multiline:React.PropTypes.bool,//可否多行输入，默认false
        password:React.PropTypes.bool,//是否密码框，默认为false
        secureTextEntry:React.PropTypes.bool,//是否隐藏输入文字，类似于密码框，默认false
        autoFocus:React.PropTypes.bool,//是否自动获取焦点，默认为false
        editable:React.PropTypes.bool,//是否可编辑，默认为true
        autoUpperOrLower:React.PropTypes.string,//文本转大写或者小写upper/lower
        onFocus:React.PropTypes.func,//文本框失去焦点函数
        onEndEditing:React.PropTypes.func,//结束编辑时调用函数
        onBlur:React.PropTypes.func,//文本框失去焦点时调用函数，在 onEndEditing 之后
    };
    static defaultProps = {
        value:'',
        defaultValue:'',
        placeholder:'',
        showDelButton:false,
        multiline:false,
        password:false,
        secureTextEntry:false,
        autoFocus:false,
        editable:true,

    };

    constructor(props: Props) {
        super(props);
        this.state = {
            inputValue:this.props.value,
            width:this.props.width?this.props.width:200,
        };

    }
    componentDidMount(){

    }


    /*文本修改事件*/
    onChangeText(text){
        if(this.props.autoUpperOrLower === 'upper'){
            this.setState({inputValue:text.toUpperCase()});
        }else if(this.props.autoUpperOrLower === 'lower'){
            this.setState({inputValue:text.toLowerCase()});
        }else{
            this.setState({inputValue:text});
        }
        if(this.props.onChangeText){
            this.props.onChangeText(text);
        }
    }

    /*清空输入框*/
    deleteInput(){
        this.setState({inputValue:''});
    }

    render() {

        return (
            <View style={[styles.inputView,this.props.inputViewStyle,{width:this.state.width,height:this.props.height}]}>
                <TextInput
                    style = {[styles.input,this.props.inputStyle,{width:this.state.width-12,height:this.props.height}]}
                    underlineColorAndroid = {"transparent"}
                    value = {this.state.inputValue}
                    defaultValue = {this.props.defaultValue}
                    placeholder = {this.props.placeholder}
                    placeholderTextColor = {this.props.placeholderTextColor}
                    multiline = {this.props.multiline}
                    password = {this.props.password}
                    autoFocus = {this.props.autoFocus}
                    editable = {this.props.editable}
                    secureTextEntry = {this.props.secureTextEntry}
                    returnKeyType={this.props.returnKeyType}
                    onChangeText = {(text)=>this.onChangeText(text)}
                    onFocus = {this.props.onFocus}
                    onEndEditing = {this.props.onEndEditing}
                    onSubmitEditing={this.props.onSubmitEditing}
                    onBlur = {this.props.onBlur}
                />
                {this.props.showDelButton?(
                    <TouchableOpacity style={[styles.delbtn,{top:(this.props.height && this.props.height>12)?((this.props.height-14)/2):13}]}
                                      onPress={()=>{this.deleteInput()}}>
                        <Image source={require('../images/home/del.png')} style={styles.delImg}/>
                    </TouchableOpacity>
                ):(null)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputView:{
        width:200,
        height:30,
        justifyContent:'center',
        /*borderWidth:1,*/
    },
    input:{
        width:188,
        height:30,
        paddingVertical:0,
        /*borderWidth:1,
        borderColor:'#f00',*/
        position:'absolute',
    },
    delbtn:{
        position:'absolute',
        right:0,
    },
    delImg:{
        width:12,
        height:12,
        resizeMode:'contain'
    }
});

