/**
 *@FileName MainPage.js
 *@desc (主界面)
 *@author chenbing
 *@date 2018/10/30 10:01
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Platform,
    AsyncStorage,
    BackHandler,
    DeviceEventEmitter,
    ToastAndroid,
    AppState,
    Alert,
    ScrollView,
    FlatList,
    TouchableWithoutFeedback,
    CameraRoll,
    PermissionsAndroid
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import { connect } from 'react-redux'
import { NavigationActions,SafeAreaView }    from 'react-navigation'
import Home from './Home/Home' //首页
import VipCard     from './VipCard/VipCard'   //会员卡
import Chat from './Chat/ChatList' //乐聊
import NetCelebrity  from './NetCelebrity/NetCelebrity'  // 网红推荐
import My      from './My/My'   // 我的
import colors  from '../../Resourse/Colors'
const device = DeviceInfo.getDeviceName();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 84 : 50)
import Toast from "@remobile/react-native-toast/index";
import JMessage from "jmessage-react-plugin";
const HOME=require('../images/tab/home.png')
const HOME_SELECT= require('../images/tab/home_select.png')
const VIP=require('../images/tab/vip.png')
const VIP_SELECT=require('../images/tab/vip_select.png')
const CHAT=require('../images/tab/chat.png')
const CHAT_SELECT=require('../images/tab/chat_select.png')
const RECOMMEND=require('../images/tab/recommend.png')
const RECOMMEND_SELECT=require('../images/tab/recommend_select.png')
const MY=require('../images/tab/my.png')
const MY_SELECT=require('../images/tab/my_select.png')
const { width, height } = Dimensions.get('window');
import Url from "../../Resourse/url";
import Fetch from '../redux/action/fetch'
import SplashScreen from 'react-native-splash-screen'
import DeviceInfo from "react-native-device-info/deviceinfo";
import Modal from '../components/NewModal'
import ASTouchableOpacity from '../components/ASTouchableOpacity'
import BImage from '../components/BImage'
import ASText from '../components/ASText'
import RNFS  from 'react-native-fs'
class MainPage extends Component {
    static propTypes = {

    };
    static defaultProps = {

    };
    constructor (props) {
        super (props);
        this.state={
            selectedTab:'Home',
            islogin:false,
            userinfo:{},
            isUp:false,
            wait:true,
            isShowMore:false,
            moreImage:[],
            index:0
        }
    }
    componentWillUnmount(){

    }
    componentWillMount() {
        //获取登录信息
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.setState({
                        islogin: true,
                        userinfo:userinfo,
                    })
                }
            }
        })
        this.getInappStore()
        JMessage.removeContactNotifyListener(this.loginlistener) // 移除监听(一般在 componentWillUnmount 中调用)
        this.showModal=DeviceEventEmitter.addListener('showModal',(param)=>{
            this.setState({
                isShowMore:true,
                moreImage:param.moreImage,
                index:param.index
            })
        });

    }
    /**
     *@desc   是否上架
     *@author 张羽
     *@date   2019/4/17 下午10:52
     *@param
     */
    getInappStore(){
        this.props.navigation.dispatch(Fetch(this,'', Url.isUp(), {}, successCallback = (data) => {
            this.setState({
                isUp:data.info!=1&&Platform.OS != 'android'?false:true,
            },()=>{
                SplashScreen.hide()
            })
            return;
        }, failure = (data) => {
            SplashScreen.hide()
            // this.setState({
            //     wait:false
            // })
        }));
    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            this.lister1= BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
        //特定页面的安卓返回
        DeviceEventEmitter.addListener('andiordBack',this.back.bind(this));
        //跳回指定页面
        DeviceEventEmitter.addListener('popComponent',this.popComponent.bind(this));
        //退出登录消息
        DeviceEventEmitter.addListener('logout',()=>{
            this.setState({
                islogin:false,
                selectedTab:'Home',
            })
        });
        this.loginlistener = (event) => {
            console.log('...............jj',event)
            Alert.alert('提示','您的账号在其他的设备上已登录',[{text:'确定',style:'cancel',onPress:()=>{
                    AsyncStorage.removeItem('userInfo')
                    DeviceEventEmitter.emit('logout')
                    this.popComponent('MainPage')
                }}]);
        }
        JMessage.addLoginStateChangedListener(this.loginlistener) // 添加监听
        //切换tab
        DeviceEventEmitter.addListener('vippay',()=>{
            this.onChangeTab('VipCard')
        })
        let timecount = 2;
        // 开始倒计时
        this.interval = setInterval(() => {
            const timer = timecount--;
            if (timer === 0) {
                clearInterval(this.interval);
                this.setState({ wait: false });
            } else {

            }
        }, 1000);

    };
    /**
     *@desc   返回指定位置
     *@author 张羽
     *@date   2018/10/16 下午4:23
     *@param
     */
    popComponent(page){
        var key;
        for(let i=0;i<this.props.nav.routes.length;i++){
            var router=this.props.nav.routes[i];
            if(page===router.routeName){
                if((i+1)<this.props.nav.routes.length){
                    key=this.props.nav.routes[i+1].key;
                    break;
                }
            }
        }
        this.props.navigation.goBack(key)
    }
    //特定物理返回键处理
    back(props){
        const routes = this.props.nav.routes;
        const routeName = routes[routes.length-1].routeName;
        if(routeName==='Home'||routeName==='Home'){
            props();
        }else{
            var backAction=NavigationActions.back({
            });
            this.props.dispatch(backAction);
        }
    }
    /*安卓物理返回键监听事件*/
    onBackAndroid(){
        const routes = this.props.nav.routes;
        if (routes.length === 1) {
            if (this.lastBackPressed && this.lastBackPressed+1000 >= Date.now()) {
                BackHandler.exitApp();
            }
            ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
            this.lastBackPressed = Date.now();
            return true;
        }else if(routes.length > 1){
            var backAction=NavigationActions.back({
            });
            this.props.dispatch(backAction);
            return true;
        }else{
            BackHandler.exitApp();
        }
    }

    /**
     *@desc   图片长按保存
     *@author 张羽
     *@date   2019-09-20 19:02
     *@param
     */
     async onPressHigh(item){
        if(!item)return
        const version= await DeviceInfo.getSystemVersion()
        if (Platform.OS === 'android'&& parseFloat(version)>=6.0 ) {
            const camera =  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            if(camera){
                return new Promise((resolve, reject) => {
                    let timestamp = (new Date()).getTime();//获取当前时间错
                    let random = String(((Math.random() * 1000000) | 0))//六位随机数
                    let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
                    const downloadDest = `${dirs}/${timestamp+random}.jpg`;
                    const formUrl = item;
                    const options = {
                        fromUrl: formUrl,
                        toFile: downloadDest,
                        background: true,
                        begin: (res) => {
                            // console.log('begin', res);
                            // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                        },
                    };
                    try {
                        const ret = RNFS.downloadFile(options);
                        ret.promise.then(res => {
                            // console.log('success', res);
                            // console.log('file://' + downloadDest)
                            let promise = CameraRoll.saveToCameraRoll(downloadDest);
                            promise.then(function(result) {
                                // alert('保存成功！地址如下：\n' + result);
                                Toast.showShortCenter('图片已保存到相册')
                            }).catch(function(error) {
                                console.log('error', error);
                                // alert('保存失败！\n' + error);
                                Toast.showShortCenter('图片保存失败')
                            });
                            resolve(res);
                        }).catch(err => {
                            reject(new Error(err))
                        });
                    } catch (e) {
                        reject(new Error(e))
                    }

                })
            }else{
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            'title': '热狗需要获取您的相册权限',
                            'message': ''
                        }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        return new Promise((resolve, reject) => {
                            let timestamp = (new Date()).getTime();//获取当前时间错
                            let random = String(((Math.random() * 1000000) | 0))//六位随机数
                            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
                            const downloadDest = `${dirs}/${timestamp+random}.jpg`;
                            const formUrl = item;
                            const options = {
                                fromUrl: formUrl,
                                toFile: downloadDest,
                                background: true,
                                begin: (res) => {
                                    // console.log('begin', res);
                                    // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                                },
                            };
                            try {
                                const ret = RNFS.downloadFile(options);
                                ret.promise.then(res => {
                                    // console.log('success', res);
                                    // console.log('file://' + downloadDest)
                                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                                    promise.then(function(result) {
                                        // alert('保存成功！地址如下：\n' + result);
                                        Toast.showShortCenter('图片已保存到相册')
                                    }).catch(function(error) {
                                        console.log('error', error);
                                        // alert('保存失败！\n' + error);
                                        Toast.showShortCenter('图片保存失败')
                                    });
                                    resolve(res);
                                }).catch(err => {
                                    reject(new Error(err))
                                });
                            } catch (e) {
                                reject(new Error(e))
                            }

                        })

                    } else {

                    }
                }catch(err) {

                }
            }
        }else{
            return new Promise((resolve, reject) => {
                let timestamp = (new Date()).getTime();//获取当前时间错
                let random = String(((Math.random() * 1000000) | 0))//六位随机数
                let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
                const downloadDest = `${dirs}/${timestamp+random}.jpg`;
                const formUrl = item;
                const options = {
                    fromUrl: formUrl,
                    toFile: downloadDest,
                    background: true,
                    begin: (res) => {
                        // console.log('begin', res);
                        // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                    },
                };
                try {
                    const ret = RNFS.downloadFile(options);
                    ret.promise.then(res => {
                        // console.log('success', res);
                        // console.log('file://' + downloadDest)
                        let promise = CameraRoll.saveToCameraRoll(downloadDest);
                        promise.then(function(result) {
                            // alert('保存成功！地址如下：\n' + result);
                            Toast.showShortCenter('图片已保存到相册')
                        }).catch(function(error) {
                            console.log('error', error);
                            // alert('保存失败！\n' + error);
                            Toast.showShortCenter('图片保存失败')
                        });
                        resolve(res);
                    }).catch(err => {
                        reject(new Error(err))
                    });
                } catch (e) {
                    reject(new Error(e))
                }

            })
        }
    }
    /**
     *@desc 点击底部按钮
     *@author chenbing
     *@date 2018/10/30 16:20
     */
    onChangeTab(tab){
        if(this.state.selectedTab===tab){
            return
        }
        //获取登录信息
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    if(tab==='Chat'){
                        DeviceEventEmitter.emit('ImloginStatus',(isLogin)=>{
                            if(isLogin){
                                this.setState({
                                    islogin: true,
                                    userinfo:userinfo,
                                    wait:false,
                                    selectedTab:tab
                                },()=>{
                                    DeviceEventEmitter.emit('chat')
                                })
                            }else{
                                Toast.showShortCenter('正在登录消息，请稍后')
                            }
                        })
                    }else{
                        this.setState({
                            islogin: true,
                            userinfo:userinfo,
                            wait:false,
                            selectedTab:tab
                        })
                    }
                }else{
                    this.setState({wait:false})
                    this.props.navigation.navigate('Login',{transition:'forVertical'})
                }
            }
        })
    }
    _keyExtractor = (item, index) => 'image'+index
    renderRow(item,index){
        return(
            <TouchableWithoutFeedback
                                onPress={()=>{this.setState({isShowMore:false})}}
                                style={{width:width,height:height,justifyContent:'center',
                                    alignItems:'center',backgroundColor:colors.BLACK}}
                                onLongPress={()=>{this.onPressHigh(item)}} delayLongPress={1000}
            >
                <View style={{width:width,height:height,justifyContent:'center',
                    alignItems:'center',backgroundColor:colors.BLACK}}>
                    <BImage
                        style={[styles.image]}
                        source={{uri:item}}
                        resizeMode={'contain'}
                    />
                    <View style={styles.bottomPageView}>
                        <ASText style={{color:colors.WHITE}} text={(index+1)+'/'+this.state.moreImage.length}></ASText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    render() {
        return (
                <SafeAreaView style={styles.container}>
                    <TabNavigator tabBarStyle={styles.tabbarStyle} tabBarShadowStyle={styles.tabBarShadowStyle}>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'Home'}
                            title={'首页'}
                            titleStyle={styles.tabTitle}
                            selectedTitleStyle={styles.tabSelectTitle}
                            onPress={() => {
                                this.onChangeTab('Home')
                            }}
                            tabStyle={{height: 50}}
                            renderIcon={() => <Image source={HOME} style={styles.imageIcon}/>}
                            renderSelectedIcon={() => <Image source={HOME_SELECT} style={styles.imageIcon}/>}

                        >
                            <Home  {...this.props} isPushed={true} uid={this.state.id}/>
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'VipCard'}
                            title={'会员'}
                            titleStyle={styles.tabTitle}
                            selectedTitleStyle={styles.tabSelectTitle}
                            onPress={() => {
                                this.onChangeTab('VipCard')
                            }}
                            tabStyle={{height: 50}}
                            renderIcon={() => <Image source={VIP} style={styles.imageIcon}/>}
                            renderSelectedIcon={() => <Image source={VIP_SELECT} style={styles.imageIcon}/>}
                        >
                            {this.state.islogin?<VipCard  {...this.props} isPushed={true} uid={this.state.id}/>:<View></View>}
                        </TabNavigator.Item>
                        {this.state.isUp? <TabNavigator.Item
                            title={'热聊'}
                            selected={this.state.selectedTab === 'Chat'}
                            titleStyle={styles.tabTitle}
                            selectedTitleStyle={styles.tabSelectTitle}
                            onPress={() => {
                                this.onChangeTab('Chat')
                            }}
                            tabStyle={{height: 50}}
                            renderIcon={() => <Image source={CHAT} style={styles.imageIcon}/>}
                            renderSelectedIcon={() => <Image source={CHAT_SELECT} style={styles.imageIcon}/>}
                        >
                            {this.state.islogin?<Chat  {...this.props} isPushed={true} uid={this.state.id}/>:<View></View>}
                        </TabNavigator.Item>:null}
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'NetCelebrity'}
                            title={'网红推荐'}
                            titleStyle={styles.tabTitle}
                            selectedTitleStyle={styles.tabSelectTitle}
                            onPress={() => {
                                this.onChangeTab('NetCelebrity')
                            }}
                            tabStyle={{height: 50}}
                            renderIcon={() => <Image source={RECOMMEND} style={styles.imageIcon}/>}
                            renderSelectedIcon={() => <Image source={RECOMMEND_SELECT} style={styles.imageIcon}/>}
                        >
                            {this.state.islogin?<NetCelebrity  {...this.props} isPushed={true} uid={this.state.id}/>:<View></View>}
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'My'}
                            title={'我的'}
                            titleStyle={styles.tabTitle}
                            selectedTitleStyle={styles.tabSelectTitle}
                            onPress={() => {
                                this.onChangeTab('My')
                            }}
                            tabStyle={{height: 50}}
                            renderIcon={() => <Image source={MY} style={styles.imageIcon}/>}
                            renderSelectedIcon={() => <Image source={MY_SELECT} style={styles.imageIcon}/>}
                        >
                            <My  {...this.props} isPushed={true} uid={this.state.id}/>
                        </TabNavigator.Item>
                    </TabNavigator>
                    <Modal
                        onRequestClose={()=>{this.setState({isShowMore:false})}}
                        transparent={true}
                        animationType={'fade'}
                        isShowMore={this.state.isShowMore}
                    >
                        <FlatList
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flex:1}}
                            data = {this.state.moreImage}
                            renderItem={({item,index})=>this.renderRow(item,index)}
                            renderSeparator={()=>null}//分割线
                            keyExtractor={this._keyExtractor}
                            initialScrollIndex={this.state.index}
                            getItemLayout={(data, index) => (
                                {length: width, offset: width * index, index}
                            )}

                        />
                    </Modal>
                </SafeAreaView>
            )

    }
}
const mapStateToProps= (store,ownProps)=> {
    return {
        nav:store.nav,
    }
};
export default connect(mapStateToProps)(MainPage);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.WHITE
    },
    tabTitle:{
        color:colors.CHATTEXT,
        fontSize:11,
        marginTop:5
    },
    tabSelectTitle:{
        color:colors.CHATTEXT,
        fontSize:11,
        marginTop:5
    },
    tabbarStyle:{
        backgroundColor:colors.WHITE,
        height:50,
        justifyContent:'center',
        borderTopWidth:colors.width_1_PixelRatio,
        borderTopColor:colors.CHATTEXT,
        paddingBottom:6
    },
    tabBarShadowStyle:{
        backgroundColor:colors.TRANSPARENT_COLOR,
    },
    imageIcon:{
        height:25,
        width:25,
        resizeMode: 'contain',
    },
    image: {
        width:width,
        height:height-64,
    },
    Swiper:{
        width:width,
        height:height-64,
    },
    bottomPageView:{
        width:width,
        marginBottom:20,
        justifyContent:'center',
        alignItems:'center',
        height:64
    }
})
