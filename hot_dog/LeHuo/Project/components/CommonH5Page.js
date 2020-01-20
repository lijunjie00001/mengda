/**
 * Created by zhangyu on 2017/7/20.
 */
/**
 * Created by zhangyu on 2017/7/20.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
    Dimensions, Platform, DeviceEventEmitter,Alert,AsyncStorage,BackHandler
} from 'react-native';
let WEBVIEW_REF = 'webview';
import containers from '../containers/containers'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../Resourse/url";
@containers()
export default class CommonH5Page extends Component {
    static propTypes = {
        title:React.PropTypes.string,
        webUrl:React.PropTypes.string,
        uid:React.PropTypes.string, //账号id
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.canGoback=false

    }
    componentWillMount() {
        if (Platform.OS === 'android') {
            this.lister1= BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.title,
            back:this.back.bind(this)
        });
    }
    componentWillUnmount(){
        if (Platform.OS === 'android') {
            this.lister1.remove()
        }
    }
    onBackAndroid(){
        this.back()
    }
    back(){
        if(this.canGoback){
            this.refs['webview'].goBack();
        }else{
            this.props.back()
        }
    }
    /**
     *@desc   js交互
     *@author 张羽
     *@date   2018/9/18 下午9:58
     *@param
     */
    onMessage(event){
        console.log('..........网页消息',event.nativeEvent.data)
        if(event.nativeEvent.data==='Login'){
            this.props.popTocompent('MainPage')
        }else if(event.nativeEvent.data==='exit'){
            Alert.alert('提示','确定推出登录？',[{text:'确定',onPress:()=>{
                    this.props.fetchData(this,'',Url.outapi(this.props.uid),{},successCallback = (data) => {
                        console.log('..........kkk',data);
                        DeviceEventEmitter.emit('exit')
                        AsyncStorage.clear()
                        this.props.back()
                    }, failure = (data) => {
                        Toast.showShortCenter(data.msgs)
                    });
                }},{text:'取消',style:'cancel'}]);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{uri:this.props.webUrl}}
                    style={styles.webView}
                    scalesPageToFit={true}
                    startInLoadingState={true}
                    automaticallyAdjustContentInsets={true}
                    ref={WEBVIEW_REF}
                    onNavigationStateChange={(event)=>{
                        this.canGoback=event.canGoBack
                    }}
                    onMessage={(event)=>{this.onMessage(event)}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'

    },
    webView:{
        width:Dimensions.get('window').width,
        borderWidth:1,
        marginTop:0,
        marginLeft:1,
        height:Dimensions.get('window').height,
    },
});