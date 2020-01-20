import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,Animated, ScrollView, Easing,Text,TouchableHighlight
} from 'react-native';
const hairlineWidth = StyleSheet.hairlineWidth
import {isPhoneX,width} from "../../Resourse/CommonUIStyle";
import ASTouchableOpacity from './ASTouchableOpacity'
import ASText from './ASText'
export default class ActionSheet extends Component {
    static propTypes = {
        onPressIndex:React.PropTypes.func
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.state={
            visible: false,
            sheetAnim: new Animated.Value(0)
        }

    }
    componentDidMount(){

    }
    show  () {
        this.setState({visible: true})
        Animated.timing(
            this.state.sheetAnim,
            {
                toValue: 1,
                duration: 200,
                easing: Easing.linear,
            },
        ).start(() => {
        });
    }
    hide (index) {
            Animated.timing(
                this.state.sheetAnim,
                {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.linear,
                },
            ).start(() => {
                this.setState({
                    visible:false,
                },()=>{
                    if(this.props.onPressIndex){
                        console.log('...........index',index)
                        this.props.onPressIndex(index)
                    }
                });
            });
    }
    _cancel  () {
        this.state.sheetAnim.stopAnimation(() => {
            Animated.timing(
                this.state.sheetAnim,
                {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.linear,
                },
            ).start(() => {
                this.setState({
                    visible:false,
                    sheetAnim: new Animated.Value(0),
                });
            });
        })
    }
    render() {
        const { visible, sheetAnim } = this.state
        if(!this.state.visible) return<View></View>
        return (
            <View
                style={styles.overlay}
            >
                <View style={[styles.overlay,{ opacity: 1}]}>
                    <Animated.View
                        style={[
                            styles.body,
                            {   opacity: sheetAnim,
                                marginBottom:sheetAnim.interpolate({inputRange:[0,1],outputRange:[-200,0] })}
                        ]}
                    >
                        <ASTouchableOpacity
                            activeOpacity={1}
                            underlayColor={'#F4F4F4'}
                            style={[styles.buttonBox,{ borderTopLeftRadius:15, borderTopRightRadius:15,opacity:1}]}
                            onPress={()=>{this.hide(1)}}
                        >
                            <ASText style={[styles.buttonText]} text={'拍照'}></ASText>
                        </ASTouchableOpacity>
                        <ASTouchableOpacity
                            activeOpacity={1}
                            underlayColor={'#F4F4F4'}
                            style={[styles.buttonBox,{ borderBottomLeftRadius:15,
                                borderBottomRightRadius:15,opacity:1}]}
                            onPress={()=>{this.hide(2)}}
                        >
                            <ASText style={[styles.buttonText]} text={'我的相册'}></ASText>
                        </ASTouchableOpacity>
                        <ASTouchableOpacity
                            activeOpacity={1}
                            underlayColor={'#F4F4F4'}
                            style={[styles.cancelButtonBox]}
                            onPress={()=>{this._cancel()}}
                        >
                            <ASText style={[styles.buttonText]} text={'取消'}></ASText>
                        </ASTouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        )
        // return (
        //     {/*<Modal animationType={'slide'}*/}
        //     {/*       onRequestClose={()=>{}}*/}
        //     {/*       visible={this.state.visible}*/}
        //     {/*       transparent={true} >*/}
        //
        //     // </Modal>
        // )
    }
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
        opacity: 0.4,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    body: {
        width:width-30,
        marginLeft:15,
        paddingBottom:10,
        opacity: 1,
    },
    titleBox: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    titleText: {
        color: '#757575',
        fontSize: 14
    },
    messageBox: {
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    messageText: {
        color: '#9a9a9a',
        fontSize: 12
    },
    buttonBox: {
        height: 50,
        marginTop: hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity:1
    },
    buttonText: {
        fontSize: 20,
        color: 'blue',
        fontWeight:'bold'
    },
    cancelButtonBox: {
        height: 50,
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius:15,
    }
})
