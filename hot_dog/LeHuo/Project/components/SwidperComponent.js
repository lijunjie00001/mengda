import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ListView,
    Animated,
    Easing,
    Text,
    PanResponder,
    TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import ASTouchableOpacity from './ASTouchableOpacity'
const width=Dimensions.get('window').width;
export default class SwidperComponent extends Component{
    static propTypes = {
        onclickDel: React.PropTypes.func,
    };
    constructor(props){
        super(props)
        this._handleMoveShouldSetPanResponderCapture=this._handleMoveShouldSetPanResponderCapture.bind(this)
        this._handlePanResponderGrant=this._handlePanResponderGrant.bind(this)
        this._handlePanResponderMove=this._handlePanResponderMove.bind(this)
        this._handlePanResponderEnd=this._handlePanResponderEnd.bind(this)
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
            onResponderTerminationRequest:()=>true,
            onShouldBlockNativeResponder: (event, gestureState) => false,//表示是否用 Native 平台的事件处理，默认是禁用的，全部使用 JS 中的事件处理，注意此函数目前只能在 Android 平台上使用
        });
        //上一次滑动最后的left偏移量
        this._previousLeft = 0;
        this._isOpen = false;
        //left偏移动画
        this.state = {
            currentLeft: new Animated.Value(this._previousLeft),
        };
    }
    componentDidMount(){

    }
    componentWillMount() {

    }
    /**
     * 是否需要成为move事件响应者，返回true直接走onPanResponderMove
     * @param event
     * @param gestureState
     * @returns {boolean}
     * @private
     */
    _handleMoveShouldSetPanResponderCapture(event: Object, gestureState: Object,): boolean {
        //当垂直滑动的距离<10 水平滑动的距离>10的时候才让捕获事件
        console.log('_handleMoveShouldSetPanResponderCapture',gestureState);
        return Math.abs(gestureState.dy) < 10 && Math.abs(gestureState.dx) > 10;
    }

    /**
     * 表示申请成功，组件成为了事件处理响应者
     * @param event
     * @param gestureState
     * @private
     */
    _handlePanResponderGrant(event: Object, gestureState: Object): void {
        console.log('_handlePanResponderGrant');
    }

    /**
     * 处理滑动事件
     * @param event
     * @param gestureState
     * @private
     */
    _handlePanResponderMove(event: Object, gestureState: Object): void {
        if (this._previousLeft === null) {
            this._previousLeft = this.state.currentLeft._value
        }
        let nowLeft = this._previousLeft + gestureState.dx / 0.5;
        if(nowLeft<-100){
            nowLeft=-100
        }
        //右滑最大距离为0（边界值）
        nowLeft = Math.min(nowLeft, 0);
        this.state.currentLeft.setValue(
            nowLeft,
        );
    }
    /**
     * 结束事件的时候回调
     * @param event
     * @param gestureState
     * @private
     */
    _handlePanResponderEnd(event: Object, gestureState: Object): void {
        if(this._isOpen){
            if (Math.abs(this.state.currentLeft._value) >= 100) {
                this._animateToOpenPosition();
            } else {
                this._animateToClosedPosition();
            }
        }else{
            if (Math.abs(this.state.currentLeft._value) >= 100 / 3) {
                this._animateToOpenPosition();
            } else {
                this._animateToClosedPosition();
            }
        }
        this._previousLeft = null;
    }
    _animateToOpenPosition(): void {
        this._isOpen = true;
        this._animateTo(-100);
    }

    _animateToClosedPosition(duration: number = 300): void {
        this._isOpen = false;
        this._animateTo(0, duration);
    }

    _animateTo(toValue, duration = 300, callback): void {
        Animated.spring(
            this.state.currentLeft,
            {
                toValue,
                friction: 8,                        // 弹性系数
                tension: 35
            }
        ).start((value) => {
        });
    }
    render(){
        return(
            <View style={styles.container}>
                <ASTouchableOpacity
                    style={styles.content} onPress={()=>{
                    if(this.props.onclickDel){
                        this.props.onclickDel()
                    }
                }}>
                    <Text style={{fontSize:30,color:'white'}}>{'删除'}</Text>
                </ASTouchableOpacity>
                <Animated.View
                    {...this._panResponder.panHandlers}
                    style={{
                        transform: [
                            {translateX: this.state.currentLeft}
                        ]
                    }}
                >
                    {this.props.children}
                </Animated.View>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    content:{
        position:'absolute',
        backgroundColor:'red',
        justifyContent:'center',
        right:0,
        bottom:0,
        top:0,
        alignItems:'center',
        width:100,
    }
})
