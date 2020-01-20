import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Platform, ScrollView, Linking, Dimensions, Alert, WebView, PixelRatio, FlatList
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import { isPhoneX,width,height }   from '../../../Resourse/CommonUIStyle'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
// import  DeviceInfo from 'react-native-device-info';
// const device = DeviceInfo.getModel();
// const statusBarHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
const statusBarHeight=0
const BACK_ITEM_IMAGE = require ('../../images/common/top_arrow.png');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BImage from '../../components/BImage'
import Swiper from 'react-native-swiper'
import ASText from '../../components/ASText'
import YouhuiPage from "./YouhuiPage";
import JiudianInfo from "./JiudianInfo";
import JiudianPinjia from './JiudianPinjia'
import ActionSheet from 'react-native-actionsheet'
import *as Wechat from 'react-native-wechat'
@containers()
export default class HomeDetailsPage extends Component{
    static propTypes = {
        userId:React.PropTypes.string,
        businessId:React.PropTypes.string,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.getH5data=this.getH5data.bind(this)
        this.renderAndroid=this.renderAndroid.bind(this)
        this.renderHeader=this.renderHeader.bind(this)
        this.getInappStore=this.getInappStore.bind(this)
        this.state= {
            star: 0, //星星
            noticeArr: [], //标签
            name: '', //名字
            address: '', //地址
            collection: 0, //收藏人数
            isCollection: false, //是否收藏
            browse: 0,//浏览
            avgPrice: '',//价格
            intro: '',//简介
            cover: '',//封面
            carousel: [],//图片数组
            type: '',
            phone: '',//电话,//
            H5: '',
            city: '',
            tabIndex: 0,
            isShow: false,
            h5Show: false,
            dataSource: {'key':[]},
            activeTab:0,
            data:[],
            lat:'',
            lng:'',
            shareView:false,
            isShowShare:true,
        }

    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'详情',
            hiddenNav:true
        });
        this.getData()
        this.getH5data()
        this.getInappStore()
    }
    /**
     *@desc   是否上架
     *@author 张羽
     *@date   2019/4/17 下午10:52
     *@param
     */
    getInappStore(){
        if(Platform.OS != 'android'){
            this.props.fetchData(this, '', Url.isUp(), {}, successCallback = (data) => {
                console.log('........data',data.info)
                Wechat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                            this.setState({
                                isShowShare:true
                            })
                        } else {
                            this.setState({
                                isShowShare:data.info==1?true:false
                            })
                        }
                    })
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/18 下午5:03
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.businessDetail(this.props.businessId,this.props.userId), {}, successCallback = (data) => {
            console.log('............详情',data)
            this.setState({
                star:data.info.star,
                noticeArr:data.info.label?data.info.label:[],
                name:data.info.name,
                address:data.info.address,
                collection:data.info.collection,
                isCollection:data.info.isCollection,
                cover:data.info.cover,
                intro:data.info.intro,
                phone:data.info.phone,
                type:data.info.type,
                carousel:data.info.carousel?data.info.carousel:[],
                city:data.info.city,
                isShow:true,
                lat:data.info.lat,
                lng:data.info.lng,
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取富文本数据
     *@author 张羽
     *@date   2019/1/17 下午1:47
     *@param
     */
    getH5data(){
        this.props.fetchData(this, '', Url.getBusinessDescription(this.props.businessId), {}, successCallback = (data) => {
            console.log('............H5详情',data)
            this.setState({
                H5:data.info,
                h5Show:true
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   收藏取消收藏
     *@author 张羽
     *@date   2018/12/18 下午10:28
     *@param
     */
    onPressCollection(){
        //商家
        this.props.fetchData(this, '', Url.collect(this.props.userId,'1','',this.props.businessId), {}, successCallback = (data) => {
            console.log('............收藏',data)
            if(this.state.isCollection){
                this.setState({
                    isCollection:!this.state.isCollection
                })
                Toast.showShortCenter('取消收藏成功')
            }else{
                this.setState({
                    isCollection:!this.state.isCollection
                })
                Toast.showShortCenter('收藏成功')
            }
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    /**
     *@desc   点击分享
     *@author 张羽
     *@date   2019-09-09 22:04
     *@param
     */
    onPressShare(){
        this.setState({
            shareView:true
        })
    }

    /**
     *@desc   点击微信
     *@author 张羽
     *@date   2019-09-09 22:24
     *@param
     */
      onPressShareWe(){
        Wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let result =  Wechat.shareToSession({
                        type: 'news',
                        title: this.state.name,
                        description:this.state.intro,
                        webpageUrl:'http://app.mengdakj.cn/Index/download',
                        thumbImage:this.state.cover
                    });
                } else {
                    Toast.showShortCenter('您还没安装微信')
                }
            })
    }
    /**
     *@desc   朋友圈
     *@author 张羽
     *@date   2019-09-09 22:25
     *@param
     */
    onPressShareLine(){
        Wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let result =  Wechat.shareToTimeline({
                        type: 'news',
                        title: this.state.name,
                        description:this.state.intro,
                        webpageUrl:'http://app.mengdakj.cn/Index/download',
                        thumbImage:this.state.cover
                    });
                } else {
                    Toast.showShortCenter('您还没安装微信')
                }
            })
    }
    /**
     *@desc   点击地址
     *@author 张羽
     *@date   2019-09-06 23:42
     *@param
     */
    onPressClickAddress(){
        this.refs.actionSheet.show()
    }
    /**
     *@desc   选择地图
     *@author 张羽
     *@date   2018/9/27 下午9:46
     *@param
     */
    handlePress(i){
        if(i==0)return
        let url;
        let lon=parseFloat(this.state.lng).toFixed(6)
        let lat=parseFloat(this.state.lat).toFixed(6)
        let name=this.state.name
        if(i==1){
            //高德地图转换
            let key='89d11f9ffedcf1a025058de1e535a287'
            let root='https://restapi.amap.com/v3/assistant/coordinate/convert?key='+key
            let hh='&locations='+lon+','+lat+'&output=JSON'+'&coordsys=baidu'
            let base=root+hh
            let header = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                }
            };
            fetch(base,header).then((response) => response.json()).then((data)=>{
                console.log('..........经纬度转换',data)
                if(data.status==='1'){
                    let locations=data.locations
                    let array=locations.split(',')
                    if(Array.isArray(array)&&array.length>1){
                        lon=array[0]
                        lat=array[1]
                    }
                    if(Platform.OS == 'android'){
                        url = `androidamap://route?sourceApplication=appname&dev=0&m=0&t=0&dlon=${lon}&dlat=${lat}&dname=${name}`;
                    }else{
                        url = `iosamap://path?sourceApplication=appname&dev=0&m=0&t=0&dlon=${lon}&dlat=${lat}&dname=${name}`;
                    }
                    Linking.canOpenURL(url).then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle url: ' + url);
                            Toast.showShortBottom('您还未安装'+(i==1?'高德地图':'百度地图'))
                        } else {
                            return Linking.openURL(url).catch(e => console.warn(e));
                        }
                    }).catch(err => console.error('An error occurred', err));
                }else{
                    Toast.showShortCenter('地图经纬度转换错误')
                }
            })['catch'](function (error) {
                Toast.showShortCenter('地图经纬度转换错误')
            });
        }else{
            if (Platform.OS == 'android') {//android
                url = `baidumap://map/direction?destination=name:${name}|latlng:${lat},${lon}&mode=driving&coord_type=bd09ll&src=android.baidu.regou;scheme=bdapp;package=com.baidu.BaiduMap;end`;
            } else if (Platform.OS == 'ios') {//ios
                url = `baidumap://map/direction?destination=name:${name}|latlng:${lat},${lon}&mode=driving&coord_type=bd09ll&src=android.baidu.regou;scheme=bdapp`;
            }
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                    Toast.showShortBottom('您还未安装'+(i==1?'高德地图':'百度地图'))
                } else {
                    return Linking.openURL(url).catch(e => console.warn(e));
                }
            }).catch(err => console.error('An error occurred', err));
        }

    }
    /**
     *@desc   打电话
     *@author 张羽
     *@date   2018/11/11 下午10:07
     *@param
     */
    onPressPhone(){
        if(!this.state.phone){
            return
        }
        Alert.alert('提示', '确认拨打：'+this.state.phone +' ？', [{text:'取消',style:'cancel'},{text:'拨打',onPress: () => {
                Linking.canOpenURL('tel:'+this.state.phone).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' );
                    } else {
                        return Linking.openURL('tel:'+this.state.phone);
                    }
                }).catch(err => console.error('An error occurred', err));
            }}]);
    }
    renderTopView(){
        return(
            <View style={styles.mainStyle}>
                <View style = {[styles.topView]}>
                    <ASTouchableOpacity
                        onPress = {()=>{this.props.back()}}
                        style = {[styles.backBtnStyle]}
                    >
                        <Image
                            style = {styles.backImage}
                            source = {BACK_ITEM_IMAGE}
                        />
                    </ASTouchableOpacity>
                    <View overflow='hidden' style = {[styles.titleStyle]}>
                        <ASText
                            text = {'详情'}
                            numberOfLines = {1}
                            style = {[styles.titleTextStyle]}/>
                    </View>
                    <View style={styles.rightView}>
                        <ASTouchableOpacity style={{width:20,height:17}} onPress={()=>{this.onPressCollection()}}>
                            <Image
                                style = {{width:20,height:17}}
                                source = {this.state.isCollection?Images.Collection:Images.NoCollection}
                            />
                        </ASTouchableOpacity>
                        {this.state.isShowShare?<ASTouchableOpacity style={{width:40,height:20,paddingLeft:20}} onPress={()=>{this.onPressShare()}}>
                            <Image
                                style = {{width:20,height:20}}
                                source = {require('../../images/home/share.png')}
                            />
                        </ASTouchableOpacity>:null}
                    </View>
                </View>
            </View>
        )
    }
    /**
     *@desc   渲染轮播图
     *@author 张羽
     *@date   2019/1/17 上午10:35
     *@param
     */
    renderBanner(){
        let swiper= this.state.carousel.map((item,i)=>{
            if(item){
                return (
                    <View key = {i}  style={{width:width-24,height:(width-24)*3/5}}>
                        <BImage
                            style={{width:width-24,height:(width-24)*3/5,borderRadius:6}}
                            source={{uri:item}}
                            imageStyle={{borderRadius:6}}
                        />
                    </View>

                )
            }
        });
        return  swiper
    }
    /**
     *@desc   苹果
     *@author 张羽
     *@date   2019/4/30 下午1:37
     *@param
     */
    renderNode(node, index, siblings, parent, defaultRenderer) {
        console.log('..........node',node)
        if (node.name == 'img') {
            const { src, height } = node.attribs;
            const imageHeight = height || 200;
            return (
                    <BImage
                        key={index}
                        style={{ width: width-20, height: parseInt(imageHeight) }}
                        source={{ uri: src }}
                        isResize={true}
                        imageWidth={width-20}
                    />

            );
        }
        // content: () => <View style={{ width: '100%', height: 1, backgroundColor: 'blue' }} />
    }
    /**
     *@desc   安卓
     *@author 张羽
     *@date   2019/4/30 下午1:38
     *@param
     */
    renderAndroid(node, index, siblings, parent, defaultRenderer){
        if(this.state.H5.indexOf('<img')!=-1){
            if (node.name == 'img') {
                const { src, height } = node.attribs;
                const imageHeight = height || 200;
                return (
                    <View style={{paddingBottom:10}}  key={index}>
                        <BImage
                            style={{ width: width-20, height: parseInt(imageHeight) }}
                            source={{ uri: src }}
                            isResize={true}
                            imageWidth={width-20}
                        />
                    </View>
                );
            }else{
                return(
                    <View key={index}>
                        {defaultRenderer(node.children, parent)}
                    </View>
                )
            }
        }else{

        }
    }
    renderTabber(){
        // let array=[
        //     {
        //         title:'优惠信息',
        //     }, {
        //         title:'用户评价',
        //     }, {
        //         title:'商家信息',
        //     }
        // ]
        return(
                <View style={{flexDirection:'row',paddingHorizontal:12,height:50,backgroundColor:colors.WHITE,marginTop:1,paddingTop:24,flex:1}}>
                    {/*{array.map((item,i)=>{*/}
                    {/*    return(*/}
                    {/*        <ASTouchableOpacity key={i} style={[{justifyContent:'center',alignItems:'center'},i==0?{marginLeft:0}:{marginLeft:24}]} onPress={()=>{}}>*/}
                    {/*            <ASText  style={[{fontSize:14,color:colors.CHATTEXT,fontWeight:'bold'},this.state.activeTab==i?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={item.title}></ASText>*/}
                    {/*            <View  style={[{height:2,width:25,backgroundColor:colors.CHATBUDDLE,marginTop:5},this.state.activeTab!==i?{backgroundColor:colors.WHITE}:null]}></View>*/}
                    {/*        </ASTouchableOpacity>*/}
                    {/*    )*/}
                    {/*})}*/}
                </View>
        )
    }

    /**
     *@desc   点击cell
     *@author 张羽
     *@date   2019-08-30 13:22
     *@param
     */
    onPressTab(item){
        if(this.state.activeTab==item.index)return
        this.setState({
            activeTab:item.index
        })
    }
    /**
     *@desc   渲染分类标签的每个页面
     *@author 张羽
     *@date   2018/9/10 下午8:47
     *@param
     */
    renderListViewWithType(){
        if(this.state.activeTab==2){
            return (
                    <JiudianInfo H5={this.state.H5}/>
            )
        }
        if(this.state.activeTab==0){
            return(
                    <YouhuiPage  {...this.props} noticeArr={this.state.noticeArr} bid={this.props.businessId} uid={this.props.userId}/>
            )
        }
        if(this.state.activeTab==1){
            return(
                    <JiudianPinjia  {...this.props} bid={this.props.businessId} />
            )
        }
    }
    renderHeader(){
        let array=[
            {
                title:'优惠信息',
                index:0
            }, {
                title:'用户评价',
                index:1
            }, {
                title:'商家信息',
                index:2
            }
        ]
        return(
            <View >
                <View style={{paddingHorizontal:12,backgroundColor:colors.WHITE}}>
                    <Swiper
                        key={this.state.carousel.length}
                        height={(width-24)*3/5}
                        dot={<View style={{backgroundColor: 'white', width: 8, height: 8, borderRadius: 4, marginLeft: 5, marginRight: 5}} />}
                        activeDot={<View style={{backgroundColor: 'blue', width: 8, height: 8, borderRadius: 4, marginLeft: 5, marginRight: 5}} />}
                        paginationStyle={{
                            bottom:10,
                        }}
                        loop={true}
                        autoplay={true}
                    >
                        {this.renderBanner()}
                    </Swiper>
                </View>
                <View style={styles.addreeView}>
                    <ASText style={{fontSize:16,fontWeight:'bold',color:colors.CHATTEXT}} text={this.state.name}></ASText>
                    {/*<ASText style={{fontSize:18,color:colors.CHATBUDDLE}} numberOfLines={1} text={this.state.city}></ASText>*/}
                </View>
                <View style={{paddingHorizontal:12,paddingTop:20,backgroundColor:colors.WHITE}}>
                    <ASText style={{fontSize:14,color:'#959595'}} text={this.state.intro}></ASText>
                </View>
                <View style={{paddingTop:28,paddingBottom:25,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:12,backgroundColor:'white'}}>
                    <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{this.onPressClickAddress()}}>
                        <Image source={Images.NewDistance} style={{width:15,height:19}}/>
                        <ASText  style={{fontSize:13,color:'#dcc490',marginLeft:5,width:250}} text={this.state.address}></ASText>
                    </ASTouchableOpacity>
                    <ASTouchableOpacity style={{marginTop:13,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.onPressPhone()}}>
                        <Image source={Images.PHONE} style={{width:15,height:15}}/>
                        <ASText  style={{fontSize:13,color:colors.CHATTEXT,marginTop:7}} text={'预约'}></ASText>
                    </ASTouchableOpacity>
                </View>
                <View style={{flexDirection:'row',paddingHorizontal:12,height:50,backgroundColor:colors.WHITE,marginTop:1,paddingTop:24,flex:1}}>
                    {array.map((item,i)=>{
                        return(
                            <ASTouchableOpacity key={i} style={[{justifyContent:'center',alignItems:'center'},i==0?{marginLeft:0}:{marginLeft:24}]} onPress={()=>{
                                this.onPressTab((item))
                            }}>
                                <ASText  style={[{fontSize:14,color:colors.CHATTEXT,fontWeight:'bold'},this.state.activeTab==i?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={item.title}></ASText>
                                <View  style={[{height:2,width:25,backgroundColor:colors.CHATBUDDLE,marginTop:5},this.state.activeTab!==i?{backgroundColor:colors.WHITE}:null]}></View>
                            </ASTouchableOpacity>
                        )
                    })}
                    {/*<ASTouchableOpacity  style={[{alignItems:'center',marginLeft:0}]} onPress={()=>{}}>*/}
                    {/*    <ASText  style={[{fontSize:14,color:colors.CHATTEXT,fontWeight:'bold'},this.state.activeTab=='0'?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={'优惠信息'}></ASText>*/}
                    {/*    <View  style={[{height:2,width:25,backgroundColor:colors.CHATBUDDLE,marginTop:5},this.state.activeTab=='0'?{backgroundColor:colors.WHITE}:null]}></View>*/}
                    {/*</ASTouchableOpacity>*/}
                    {/*<ASTouchableOpacity  style={[{alignItems:'center',marginLeft:24}]} onPress={()=>{}}>*/}
                    {/*    <ASText  style={[{fontSize:14,color:colors.CHATTEXT,fontWeight:'bold'},this.state.activeTab=='1'?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={'用户评价'}></ASText>*/}
                    {/*    <View  style={[{height:2,width:25,backgroundColor:colors.CHATBUDDLE,marginTop:5},this.state.activeTab=='1'?{backgroundColor:colors.WHITE}:null]}></View>*/}
                    {/*</ASTouchableOpacity>*/}
                    {/*<ASTouchableOpacity  style={[{alignItems:'center',marginLeft:24}]} onPress={()=>{}}>*/}
                    {/*    <ASText  style={[{fontSize:14,color:colors.CHATTEXT,fontWeight:'bold'},this.state.activeTab=='2'?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={'商家信息'}></ASText>*/}
                    {/*    <View  style={[{height:2,width:25,backgroundColor:colors.CHATBUDDLE,marginTop:5},this.state.activeTab=='2'?{backgroundColor:colors.WHITE}:null]}></View>*/}
                    {/*</ASTouchableOpacity>*/}
                </View>
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                {this.renderTopView()}
                {/*<FlatList*/}
                {/*    data = {this.state.data}*/}
                {/*    renderSeparator={()=>null}//分割线*/}
                {/*    keyExtractor={this._keyExtractor}*/}
                {/*    style={{flex:1}}*/}
                {/*    ListFooterComponent={()=>{*/}
                {/*       return(*/}
                {/*           <View style={{flex:1}}>*/}

                {/*           </View>*/}
                {/*       )*/}
                {/*    }}*/}
                {/*/>*/}
                <ScrollView >
                    {this.renderHeader()}
                    {this.renderListViewWithType()}
                {/*{this.state.isShow&&this.state.h5Show?<ScrollableTabView*/}
                {/*    initialPage={this.state.tabIndex}*/}
                {/*    contentProps={{keyboardShouldPersistTaps:'always'}}*/}
                {/*    renderTabBar={(props) =>this.renderTabber(props)}*/}

                {/*>*/}
                {/*    {this.renderListViewWithType(0)}*/}
                {/*    {this.renderListViewWithType(1)}*/}
                {/*    {this.renderListViewWithType(2)}*/}
                {/*</ScrollableTabView>:null}*/}
                </ScrollView>
                {/*// <ASTouchableOpacity style={styles.btnView} onPress={()=>{this.onPressPhone()}}>*/}
                {/*//     <ASText style={{fontSize:16,color:colors.WHITE}} text={'立即预订'}></ASText>*/}
                {/*// </ASTouchableOpacity>*/}
                <ActionSheet
                    ref="actionSheet"
                    title={'选择地图'}
                    options={['取消','高德地图','百度地图']}
                    cancelButtonIndex={0}
                    onPress={(i)=>this.handlePress(i)}
                />
                {this.state.shareView?<View style={styles.shareView}>
                    <View style={{backgroundColor:'white',flexDirection:'row',paddingVertical:10}}>
                        <ASTouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.onPressShareWe()}}>
                                <Image source={require('../../images/home/wexinshare.png')} style={{width:40,height:40}}/>
                                <ASText text={'微信'} style={{fontSize:14,color:'#959595'}}/>
                        </ASTouchableOpacity>
                        <ASTouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.onPressShareLine()}}>
                            <Image source={require('../../images/home/pengyouquan.png')} style={{width:40,height:40}} />
                            <ASText text={'朋友圈'} style={{fontSize:14,color:'#959595'}}/>
                        </ASTouchableOpacity>
                    </View>
                    <ASTouchableOpacity style={{justifyContent:'center',alignItems:'center',paddingVertical: 10,
                        borderTopWidth: colors.width_1_PixelRatio,borderTopColor:colors.LINE,backgroundColor:colors.WHITE}} onPress={()=>{
                            this.setState({shareView:false})
                    }}>
                        <ASText text={'取消'} style={{fontSize:15,color:'#3d3d3d'}}/>
                    </ASTouchableOpacity>
                </View>:null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.BackPage,
    },
    addreeView:{
        paddingTop:15,
        paddingHorizontal:12,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:colors.WHITE,
    },
    btnView:{
        height:50,
        backgroundColor:colors.CHATBUDDLE,
        justifyContent:'center',
        alignItems:'center'
    },
    mainStyle:{
        flexDirection:'column',
        backgroundColor:colors.WHITE,
        paddingTop:Platform.OS === 'ios'?statusBarHeight:0,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.BackPage,
        zIndex:1
    },
    backBtnStyle : {
        justifyContent:'center',
        alignItems:'center',
        height:44,
        width:44,
    },
    rightImg:{
        height:18,
        width:18,
        resizeMode:'contain',
    },
    titleStyle : {
        position:'absolute',
        height:44,
        right:60,
        left:60,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    titleTextStyle : {
        color:colors.CHATTEXT,
        fontSize:18,
        textAlign:'center',
        flex:1,
        fontWeight:'bold',
    },
    topView: {
        height:44,
        flexDirection:'row',
        width:Dimensions.get('window').width,
    },
    rightView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        paddingRight:22
    },
    shareView:{
        position: 'absolute',
        top:0,
        left: 0,
        right: 0,
        bottom:0,
        backgroundColor:colors.BLACK_TRANSPARENT_COLOR,
        justifyContent:'flex-end'
    }


});
