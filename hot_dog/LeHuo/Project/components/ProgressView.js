import React,{Component}from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ProgressViewIOS, Dimensions,
    ProgressBarAndroid,
    Platform
} from 'react-native';
import Progress from './CusProgressBar';
import ASText from './ASText'
export default class progressView extends Component{
    static propTypes={
        progres:React.PropTypes.number
    }
    static defaultProps = {

    }

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.progres)
        return (
            <View style={styles.container}>
                <View>
                    <ASText style={styles.text} text={Math.round(this.props.progres*100) + '%'}></ASText>
                </View>
                <Progress
                    progres={this.props.progres}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        alignItems:'center',
        backgroundColor:'rgba(255,255,255,0.5)',
        justifyContent:'center',
    },
    text:{
        color:'#2196F3',
        fontSize:16,
        marginBottom:40,
        fontWeight: 'bold',
    },
});