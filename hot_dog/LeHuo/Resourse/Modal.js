import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import Picker from 'react-native-picker';
import moment from 'moment';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
export default class Modal extends Component{
    static propTypes = {
        showModal:React.PropTypes.bool,
        cancelModal:React.PropTypes.func,
    }
    static defaultProps = {
        showModal:false
    }
    constructor(props){
        super(props);
    }
    render(){
        if(this.props.showModal){
            return (
                <TouchableWithoutFeedback onPress={()=>{
                    this.props.cancelModal()
                }}>
                    <View style={styles.modal}></View>
                </TouchableWithoutFeedback>
            )
        }else{
            return null
        }
    }
}
const styles = StyleSheet.create({
    modal:{
        position:'absolute',
        top:0,left:0,
        backgroundColor:'rgba(0,0,0,0.6)',
        width:WIDTH,
        height:HEIGHT
    }
});
module.exports = Modal;