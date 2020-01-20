/**
 *@FileName index.js
 *@desc (入口)
 *@author chenbing
 *@date 2018/10/30 09:54
 */

import {
    AppRegistry,
    View,
    StyleSheet,
    Platform,
    DeviceEventEmitter,
    AppState, AsyncStorage, BackHandler, ToastAndroid
} from 'react-native';
import React, { Component } from 'react';
import { createStore, applyMiddleware  } from 'redux';
import { Provider,connect } from 'react-redux';
import {
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import fecth from './Project/redux/middleWare/FetchMiddleWare'
import reducers from './Project/redux/reducer/index';
import config from './Resourse/Config'
import RootRouter from './Project/router/RootRouter'
import Progress from './Resourse/progress'
import CodePush from 'react-native-code-push'
import {NavigationActions} from "react-navigation";
import SplashScreen from 'react-native-splash-screen';
import JMessage from 'jmessage-react-plugin';
import JPushModule from 'jpush-react-native';
import UploadImage from './Resourse/UploadImage'
import * as WeChat from 'react-native-wechat';
const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);
const store=createStore(reducers, applyMiddleware(middleware,fecth));
export default class LeHuo extends Component {
    static propTypes = {
        isPush:React.PropTypes.string,
    };
    constructor(props){
        super(props);
        this.becomeActive=this.becomeActive.bind(this);
        this.downloadThumbUserAvatar=this.downloadThumbUserAvatar.bind(this)
        this.listerAddFriend=this.listerAddFriend.bind(this)
        this.isLogin=this.isLogin.bind(this)
        this.IMLogin=false
        this.state={
            isshowProgress:false,
            progress:0,
            addfriend:[],
        }
    }
    componentWillUnmount(){
        JMessage.removeContactNotifyListener(listener) // 移除监听(一般在 componentWillUnmount 中调用)
    }
    componentWillMount() {
        if (!__DEV__) {
            global.console = {
                info: () => {},
                log: () => {},
                warn: () => {},
                debug: () => {},
                error: () => {}
            };
        }
    }
    componentDidMount(){
        SplashScreen.hide();
        this.becomeActive();
        AppState.addEventListener('change', this.becomeActive);
        //推送初始化
        JPushModule.initPush()
        WeChat.registerApp(config.wechatkey)
        //IM初始化
        JMessage.init({
            appkey: config.JImAppkey,
            isOpenMessageRoaming: true, // 是否开启消息漫游，默认不开启
            isProduction: !__DEV__, // 是否为生产模式
        })
        //IMDEG模式
        JMessage.setDebugMode({ enable: __DEV__ })
        this.isLogin()
        //收到推送更新用户信息
        this.uploadIM=DeviceEventEmitter.addListener('uploadIMinfo',(param)=>{
             this.updataIcon(param)
             this.uploadName(param)
        });
        //登录消息
        DeviceEventEmitter.addListener('login',(userinfo)=>{
           this.login(userinfo)
        });
        //获取登录状态
        this.ImloginStatus=DeviceEventEmitter.addListener('ImloginStatus',(param)=>{
            if(this.IMLogin){
                param(true)
            }else{
                this.isLogin()
                param(false)
            }
        });

    };
    /**
     *@desc   判断是否登录
     *@author 张羽
     *@date   2019/3/11 下午11:29
     *@param
     */
    isLogin(){
        //判断是否登录
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    JMessage.getMyInfo((UserInf) => {
                        if (!UserInf.username) {
                            // 未登录
                            JMessage.login({
                                username:  userinfo.imUsername,
                                password: userinfo.imPassword
                            },() => {
                                console.log('...........登录成功')
                                this.IMLogin=true
                                this.listerAddFriend(userinfo)
                            }, (error) => {
                                console.log('...........登录失败',error)
                                this.IMLogin=false
                            })
                        } else {
                            // 已登录
                            console.log('登录')
                            this.IMLogin=true
                            this.listerAddFriend(userinfo)
                        }
                    })
                }
            }
        })
    }
    /**
     *@desc   登录IM
     *@author 张羽
     *@date   2018/11/29 下午3:13
     *@param
     */
    async login(userinfo){
        JMessage.login({
            username: userinfo.imUsername,
            password: userinfo.imPassword
        },() => {
            console.log('...........登录成功')
            this.IMLogin=true
            //异步更新
            DeviceEventEmitter.emit('uploadIMinfo',userinfo)
        }, (error) => {
            console.log('...........登录失败',error)
            this.IMLogin=false
        })
    }
    /**
     *@desc   监听好友
     *@author 张羽
     *@date   2019/2/21 上午11:33
     *@param
     */
    listerAddFriend(userinfo){
        this.downloadThumbUserAvatar(userinfo)
    }
    /**
     *@desc   跟新头像
     *@author 张羽
     *@date   2019/5/7 上午12:26
     *@param
     */
    async updataIcon(userinfo){
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/icon.png';
        const options = {
            fromUrl: userinfo.cover,
            toFile: path,
            background: true,
        }
        try{
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('success', res,path);
                let param={
                    imgPath: path // 本地图片绝对路径。
                }
                JMessage.updateMyAvatar(param,(result)=>{
                    console.log('......更新头像成功')
                    this.downloadThumbUserAvatar(userinfo)
                },(err)=>{
                    console.log('......更新头像失败')
                })
            }).catch(err => {
                console.log('......下载失败')
            });
        }catch (e) {
        }
    }
    async uploadName(userInfo){
        let param={
            nickname:userInfo.username
        }
        JMessage.updateMyInfo(param,(result)=>{
            console.log('......更新昵称成功')
        },(err)=>{
            console.log('......更新昵称失败')
        })
    }
    /**
     *@desc   下载IM头像
     *@author 张羽
     *@date   2018/11/29 下午3:58
     *@param
     */
     downloadThumbUserAvatar(userInfo){
        let param={
            username:userInfo.imUsername,
            appKey:config.JImAppkey
        }
        JMessage.downloadThumbUserAvatar(param, (result) => {
            console.log('下载头像成功')
        }, (err) => {
            console.log('下载头像失败',err)
        })
    }
    becomeActive(){
        if(AppState.currentState==='active')
            if (Platform.OS === 'ios') {
                JPushModule.setBadge(0,(data)=>{
                    console.log('........llll',data)
                })
            }
        DeviceEventEmitter.emit('becomeActive')
        CodePush.sync({
                deploymentKey:Platform.OS === 'ios'?config.ReleaseDeployment:config.androidStagingDeployment,
                updateDialog: {
                    optionalIgnoreButtonLabel: '稍后',
                    optionalInstallButtonLabel: '立即更新',
                    optionalUpdateMessage: '有新版本了，是否更新？',
                    title: '更新提示',
                    appendReleaseDescription:true,
                    mandatoryContinueButtonLabel:'立即更新',
                    mandatoryUpdateMessage:'',
                    descriptionPrefix:''
                },
                installMode: CodePush.InstallMode.IMMEDIATE,
            },
            (status) => {
                switch (status) {
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                        break;
                    case CodePush.SyncStatus.INSTALLING_UPDATE:
                        break;
                }
            }, (progress) => {
                this.setState({
                    isshowProgress:true,
                    progress:progress.receivedBytes/progress.totalBytes
                })
            });
    }
    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <RootRouter/>
                    {this.state.isshowProgress? <Progress progres={this.state.progress}/>:null}
                </View>
            </Provider>
        )
    }
}
var styles = StyleSheet.create({
    container: {
        flex:1
    }
});
AppRegistry.registerComponent('LeHuo', () => LeHuo);

