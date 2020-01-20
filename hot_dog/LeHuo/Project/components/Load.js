/**
 * Created by zhangyu on 2017/11/20.
 */
import React, {Component } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    Image,
    Easing
} from 'react-native';
import colors from '../../Resourse/Colors';
import ASText from './ASText';
export default class Load extends Component {
    isLoad=false;
    constructor(props: any) {
        super(props);
        this.state = {
            transform: new Animated.Value(0)
        };
    }
    static propTypes = {
        isShow:React.PropTypes.bool
    };
    static defaultProps = {
        isShow: false,
    };
    componentDidMount(){
        this.isLoad=true;
        this.startAnimation();
    }
    componentWillUnmount(){
        this.isLoad=false;
    }
    startAnimation() {
        this.state.transform.setValue(0);
        Animated.timing(
            this.state.transform,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                isInteraction:this.props.isInteraction?false:true
            },
        ).start(() => {
            if(this.isLoad){
                this.startAnimation()
            }
        });
    }
    render () {
        return (
            <View style={styles.mainStyle}>
                <View style={styles.container}>
                    {/*<Image style={styles.icon} source={require('../icon_load.png')}/>*/}
                    <Animated.Image   isInteraction={false} style={[styles.quan,{
                        transform: [{
                            rotateZ: this.state.transform.interpolate({
                                inputRange: [0,1],
                                outputRange: ['0deg', '360deg']
                            })}
                        ],
                    }]
                    } source={require('../images/common/loading.png')}/>
                    <ASText style={{color:colors.WHITE,fontSize:10.5,marginTop:7}} text="正在加载" />
                </View>
            </View>
        )
    }
}
let styles = StyleSheet.create({
    mainStyle:{
        flexDirection:'column',
        backgroundColor:'rgba(0,0,0,0.05)',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
    },
    container:{
        borderRadius:10,
        backgroundColor:'rgba(0,0,0,0.8)',
        width:65,
        height:65,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    icon:{
        width:22,
        height:9,
        left:14,
        top:20.5,
        position:'absolute',
    },
    quan:{
        marginTop:3,
        width:26,
        height:26,
        resizeMode:'contain',
    }

});