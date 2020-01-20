import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated, Easing, Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window')
export default class progres extends Component {
    static propTypes = {
        progres:React.PropTypes.number
    };
    static defaultProps = {

    };
   constructor(props){
       super(props)
       this.progres=0 //记录上一次的进度
       this.width=0
       this.state={
           progress:new Animated.Value(0),
           width:0,
       }
   }
    componentWillReceiveProps(nextProps) {
        this.width=this.state.width
        this.setState({
            width:(width-60)*nextProps.progres
        })
        this.state.progress=new Animated.Value(0),
        Animated.timing(
            this.state.progress,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.linear,
            },
        ).start(() => {

        });
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.progress}>
                <Animated.View style={{
                    width: this.state.progress.interpolate({inputRange: [0, 1], outputRange: [this.width, this.state.width]})
                    ,backgroundColor: 'red',height:20,
                }}>
                </Animated.View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        left:0,
        backgroundColor:'rgba(0,0,0,0)',
        justifyContent:'center',
        alignItems:'center'
    },
    progress:{
        width:width-60,
        height:20,
        borderRadius:5,
        backgroundColor:'gray'
    }

})