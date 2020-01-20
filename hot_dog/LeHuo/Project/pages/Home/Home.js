/**
 *@FileName Home.js
 *@desc (首页)
 *@author chenbing
 *@date 2018/10/30 16:54
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView, AsyncStorage, DeviceEventEmitter, ImageBackground, FlatList, Alert,PermissionsAndroid
} from 'react-native';
import containers from '../../containers/containers'
import ASText from '../../components/ASText'
import Url from '../../../Resourse/url'
import colors from '../../../Resourse/Colors'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import { Geolocation } from "react-native-amap-geolocation"
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import BImage from '../../components/BImage'
import BScrollView from '../../components/BScrollView'
import Swiper from 'react-native-swiper'
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getModel();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
//功能列表数据
const functionListData = [
    {
        name:'积分商城',
        img:require('../../images/home/jifen.png'),
        type:'0'
    },
    {
        name:'全部分类',
        img:require('../../images/home/allType.png'),
        type:'0'
    }
];
@containers()
export default class Home extends Component<Props> {
    constructor(props){
        super(props);
        this.getNearhotData=this.getNearhotData.bind(this)
        this.getLocation=this.getLocation.bind(this)
        this.getRecommendBusiness=this.getRecommendBusiness.bind(this)
        this.uploadAddress=this.uploadAddress.bind(this)
        this.getcarType=this.getcarType.bind(this)
        this.page=1  //页码
        this.perPage=10 //页数
        this.latitude=31.868341
        this.longitude=117.307311
        this.first=true
        this.address='合肥市'
        this.state={
            searchText:'',//搜索内容
            hotListData:[],
            city:'合肥市',
            recommendData:[],
            bannerArr:[],
            isPulling:false,
            enableLoadMore:false,
            isLoadingMore:false,
            isLoadMoreComplate:false,
            isUp:true ,//是否上架
            typeArr:functionListData,
            weathTemp:'',
            weathIcon:'',
        };
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'首页',
            hiddenNav:true
        });
        this.getLocation()
        //获取经纬度
        this.location=DeviceEventEmitter.addListener('location',(callback)=>{
            let param={
                latitude:this.latitude,
                longitude:this.longitude
            }
            callback(param)
        });
        this.getCity=DeviceEventEmitter.addListener('getCity',(callback)=>{
            callback(this.address)
        });
        //会员推荐
        this.getRecommendBusiness()
        //首页banner
        this.getBanner()
        this.getInappStore()
        this.getcarType()
        this.getweather()
        this.getNearhotData(false);
        this.uploadAddress(this.latitude,this.longitude)
    }

    /**
     *@desc   获取天气
     *@author 张羽
     *@date   2019-08-30 15:31
     *@param
     */
    getweather(){
        this.props.fetchData(this, '', Url.weather(), {}, successCallback = (data) => {
            console.log('........获取天气',data.info)
            this.setState({
                weathTemp:data.info.shishi_temp+'℃',
                weathIcon:data.info.icon
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取类别
     *@author 张羽
     *@date   2019-08-18 15:01
     *@param
     */
    getcarType(){
        this.props.fetchData(this, '', Url.carType(1,''), {}, successCallback = (data) => {
            console.log('........获取类别',data.info)
            this.setState({
                typeArr:data.info.concat(functionListData)
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   定位
     *@author 张羽
     *@date   2018/9/25 下午3:26
     *@param
     */
    async getLocation() {
        const version= await DeviceInfo.getSystemVersion()
        if (Platform.OS === 'android'&& parseFloat(version)>=6.0 ) {
            const location= await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
            if(location){
                Geolocation.init({
                    ios: "d397ac5abf35ad2d0a40dfe2cdc95074",
                    android: "d5929c0781b098c23eecfbe1e9b70087"
                })
                Geolocation.setOptions({
                    interval: 100000000, //无限时间
                    distanceFilter: 150,
                    reGeocode:true
                })
                Geolocation.addLocationListener(location =>
                    this.updateLocationState(location)
                )
                Geolocation.start();

            }else{
                try {
                    const granted =  PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                        {
                            'title': '热狗需要获取您的位置权限',
                            'message': ''
                        }
                    )
                    granted.then((data)=>{
                        if (data === PermissionsAndroid.RESULTS.GRANTED) {
                            Geolocation.init({
                                ios: "d397ac5abf35ad2d0a40dfe2cdc95074",
                                android: "d5929c0781b098c23eecfbe1e9b70087"
                            })
                            Geolocation.setOptions({
                                interval: 100000000, //无限时间
                                distanceFilter: 150,
                                reGeocode:true
                            })
                            Geolocation.addLocationListener(location =>
                                this.updateLocationState(location)
                            )
                            Geolocation.start();
                        } else {

                        }
                    })
                }catch(err) {
                    console.log('.....err',err)
                }
            }
        } else{
            await Geolocation.init({
                ios: "d397ac5abf35ad2d0a40dfe2cdc95074",
                android: "d5929c0781b098c23eecfbe1e9b70087"
            })
            Geolocation.setOptions({
                interval: 100000000, //无限时间
                distanceFilter: 150,
                reGeocode:true
            })
            Geolocation.addLocationListener(location =>
                this.updateLocationState(location)
            )
            Geolocation.start();
        }

    }
    /**
     *@desc   是否上架
     *@author 张羽
     *@date   2019/4/17 下午10:52
     *@param
     */
    getInappStore(){
        this.props.fetchData(this, '', Url.isUp(), {}, successCallback = (data) => {
            console.log('........data',data.info)
            this.setState({
                isUp:data.info!=1&&Platform.OS != 'android'?false:true,
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   更新定位
     *@author 张羽
     *@date   2018/9/14 下午5:02
     *@param
     */
    updateLocationState(location) {
        if (location.address&&location.city=='合肥市') {
            this.setState({ city:location.city?location.city:location.district},()=>{
                console.log('......jjjj',location)
                let latitude=location.latitude.toFixed(6) //纬度
                let longitude=location.longitude.toFixed(6) //经度
                this.latitude=latitude+''
                this.longitude=longitude+''
                if(location.poiName&&typeof(location.poiName)=='string'){
                    this.address=location.poiName
                }else{
                    let newaddress=location.address
                    if(location.province){
                        newaddress=newaddress.replace(location.province,'')
                    }
                    if(location.city){
                        newaddress=newaddress.replace(location.city,'')
                    }
                    this.address=newaddress
                }
                if(this.first){
                    this.first=false
                    this.getNearhotData(false);
                    this.uploadAddress(this.latitude,this.longitude)
                }
            })
        }
    }
    /*
     * 更新用户地址
     */
    uploadAddress(lat,lng){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    let uid=userinfo.id
                    this.props.fetchData(this, '', Url.uploadUserAddree(uid,lat,lng), {}, successCallback = (data) => {
                         console.log('......地址更新成功',data)
                        return;
                    }, failure = (data) => {
                        Toast.showShortCenter(data.notice)
                    });
                }
            }
        })
    }
    /**
     *@desc   首页banner
     *@author 张羽
     *@date   2018/12/17 下午2:21
     *@param
     */
    getBanner(){
        this.props.fetchData(this, '', Url.getBackImage('1'), {}, successCallback = (data) => {
            console.log('............首页banner',data)
            this.setState({bannerArr:data.info})
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取附近热门的数据
     *@author 张羽
     *@date   2018/11/27 上午9:50
     *@param
     */
    getNearhotData(isMore){
        this.props.fetchData(this, '', Url.nearbyBusiness('',this.page,this.perPage,this.latitude,this.longitude), {}, successCallback = (data) => {
            console.log('............附近热门',data)
            this.setState({
                hotListData:!isMore?data.info.list:this.state.hotListData.concat(data.info.list),
                isLoadMoreComplate:data.info.list.length<this.perPage?true:false,
                enableLoadMore:data.info.list.length<this.perPage?false:true,
                isPulling:false,
                isLoadingMore:false
            })
            return;
        }, failure = (data) => {
            this.setState({ isLoadMoreComplate:false,isPulling:false,isLoadingMore:false})
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   会员推荐
     *@author 张羽
     *@date   2018/12/16 下午3:17
     *@param
     */
    getRecommendBusiness(){
        this.props.fetchData(this, '', Url.recommendBusiness('','3'), {}, successCallback = (data) => {
            console.log('............同城推荐',data)
            this.setState({
                recommendData:data.info.list
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   点击附近热门
     *@author 张羽
     *@date   2018/11/27 下午1:43
     *@param
     */
    onPressHot(item){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                     this.props.push('HomeDetails',{userId:userinfo.id+'',businessId:item.id+''})
                }else{
                    this.props.push('Login',{transition:'forVertical'})
                }
            }
        })
    }
    /**
     *@desc   点击分类
     *@author 张羽
     *@date   2018/12/17 下午4:24
     *@param
     */
    onPressType(item){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    if(item.name==='积分商城'){
                        this.props.push('HomeVipListPage')
                        return
                    }
                    if(item.name==='全部分类'){
                        this.props.push('SearchPage',{typeArray:this.state.typeArr})
                        return;
                    }
                    this.props.push('HomeTypeListPage',{type:item.id+'',title:item.name,shaixuanArray:this.state.typeArr,type:item.id})
                }else{
                    this.props.push('Login',{transition:'forVertical'})
                }
            }
        })
    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2019/1/3 下午3:11
     *@param
     */
    onPull(){
        if(this.state.isPulling) return
        if(this.state.isLoadingMore)return
        this.setState({
            isPulling:true
        },()=>{
            this.page=1
            this.getNearhotData(false)
            this.getRecommendBusiness()
            if(this.state.typeArr.length==2){
                this.getcarType()
            }
            if(this.state.bannerArr.length==0){
                this.getBanner()
            }
        })
    }

    /**  点击天气
     *@author 张羽
     *@date   2019-09-05 11:24
     *@param
     */
    onPressWeather(){
        this.props.push('HTMLPage',{webUrl:'https://tianqi.qq.com/index.htm',title:'天气'})
    }

    /**
     *@desc   点击城市
     *@author 张羽
     *@date   2019-09-05 11:31
     *@param
     */
    onPressCity(){
        this.props.push('SlectCity')
    }
    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019/1/3 下午3:11
     *@param
     */
    onLoadMore(){
        if(this.state.isPulling) return
        if(this.state.isLoadingMore)return
        if(this.state.isLoadMoreComplate) return
        this.setState({ isLoadingMore:true},()=>{
            this.page=parseInt(this.state.hotListData.length/this.perPage)+1
            this.getNearhotData(true)
        })
    }
    /**
     *@desc 功能列表渲染
     *@author chenbing
     *@date 2018/10/29 21:57
     */
    renderFunctionList(){
        return (
            <View style={styles.functionListView}>
                {this.state.typeArr.map((item,i)=>{
                    let isShow=item.name==='积分商城'&&!this.state.isUp?true:false
                    if(isShow){
                        return<View key ={i}></View>
                    }
                    return(
                         <ASTouchableOpacity key={i} style={styles.functionListViewItem} onPress={()=>{this.onPressType(item)}}>
                             {item.name!='全部分类'&&item.name!='积分商城'?<BImage source={{uri:item.img}} style={styles.functionImg}/>:<Image
                             source={item.img} style={styles.functionImg}/>}
                                <ASText style={styles.functionText} text={item.name}></ASText>
                        </ASTouchableOpacity>
                    )
                })}
            </View>
        );
    }

    /**
     *@desc 渲染搜索栏
     *@author chenbing
     *@date 2018/10/29 22:5
     */

    renderLocationSearch(){
        return(
            <View style={styles.searchView}>
                <ASTouchableOpacity style={styles.locationView} onPress={()=>{this.onPressWeather()}}>
                    <View style={{alignItems:'center',justifyContent:'center',paddingRight: 10}}>
                        <Image source={{uri:this.state.weathIcon}} style={styles.locationImg}/>
                        <ASText style={styles.locationText} text={this.state.weathTemp}></ASText>
                    </View>
                </ASTouchableOpacity>
                <View style={styles.searchInputView}>
                    <Image source={require('../../images/common/search.png')} style={styles.searchImg}/>
                    <ASTouchableOpacity style={{flex:1}} onPress={()=>{
                        this.props.push('SearchPage',{typeArray:this.state.typeArr})
                    }}>
                        <ASText style={{ fontSize:15,color:'#999',marginLeft:5}} text={'查询您需要的'}></ASText>
                    </ASTouchableOpacity>
                </View>
                <ASTouchableOpacity style={styles.locationView} onPress={()=>{this.onPressCity()}}>
                    <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:6}}>
                        <ASText style={[styles.locationText,{color:'rgb(220,196,144)',marginTop:0}]} text={this.state.city}></ASText>
                    </View>
                </ASTouchableOpacity>
            </View>
        );
    }

    /**
     *@desc 渲染同城推荐列表
     *@author chenbing
     *@date 2018/10/30 9:58
     */
    renderRecommendList(){
        return (
            <ScrollView style={[styles.recommendOutView]} horizontal={true} showsHorizontalScrollIndicator={false}>
                {this.state.recommendData.map((item,index)=>{
                    return (
                        <View style={[styles.recommendInnerView]} key={index} >
                            <ASTouchableOpacity style={[{width:317,borderColor: '#F7F4EF',borderWidth: 2,borderRadius:6,paddingBottom:12}]} onPress={()=>{this.onPressHot(item)}}>
                                <BImage source={{uri:item.cover}} style={{width:317,height:190,borderTopRightRadius:6,borderTopLeftRadius:6}} imageStyle={{borderTopRightRadius:6,borderTopLeftRadius:6}}/>
                                <View style={{marginTop:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:9}}>
                                    <ASText style={{fontSize:15,color:'#333'}} text={item.name} numberOfLines={1}></ASText>
                                    <ASText style={{fontSize:12,color:'rgb(217,199,137)',width:80}} text={item.address} numberOfLines={1}></ASText>
                                </View>
                                <View style={{paddingHorizontal:9}}>
                                    <ASText text={'会员专享：'+item.slogan} style={{color:'rgb(137,137,137)',fontSize:13,marginTop:9}} numberOfLines={1}/>
                                </View>
                            </ASTouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        );
    }

    /**
     *@desc 渲染附近热门头部
     *@author chenbing
     *@date 2018/10/30 10:09
     */
    renderHotListHeader(){
        return(
            <View style={{width:'100%',height:43,backgroundColor:'#F7F4EF',justifyContent:'center',alignItems:'center'}}>
                <ASText style={{fontSize:15,color:'rgb(77,77,77)'}} text={'附近热门'}></ASText>
            </View>
        );
    }

    /**
     *@desc 渲染附近热门列表项
     *@author chenbing
     *@date 2018/10/30 10:14
     */
    renderHostListRow(rowData,index){
        return (
            <ASTouchableOpacity style={{width:width,backgroundColor:colors.WHITE,paddingHorizontal:10,paddingBottom:10}} onPress={()=>{this.onPressHot(rowData)}}>
                <View style={styles.hotListInnerView}>
                    <View style={[styles.HotListLeftView]}>
                        <BImage source={{uri:rowData.cover}} style={{width:213,height:159,borderRadius:6}} imageStyle={{borderRadius:6}}/>
                        <View style={{marginLeft:4}}>
                            {rowData.carousel&&rowData.carousel.length>0?<BImage source={{uri:rowData.carousel[0]}} style={{width:width-50-213-4,height:156/2,borderRadius:6}} imageStyle={{borderRadius:6}}/>:null}
                            {rowData.carousel&&rowData.carousel.length>1?<BImage source={{uri:rowData.carousel[1]}} style={{width:width-50-213-4,height:156/2,borderRadius:6,marginTop:3}} imageStyle={{borderRadius:6}}/>:null}
                        </View>
                    </View>
                    <View style={{marginTop:10}}>
                        <ASText style={{fontSize:15,color:'#333',fontWeight:'bold'}} text={rowData.name}></ASText>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10,width:width-50,alignItems:'center'}}>
                            <ASText numberOfLines={1} style={{fontSize:13,color:'#898989',width:width-150}} text={'套餐包含:'+rowData.slogan}></ASText>
                            <ASText style={{fontSize:12,color:'rgb(217,199,137)',width:80}} text={rowData.address} numberOfLines={1}></ASText>
                        </View>
                    </View>
                    <View style={styles.hotListPosition}>
                        <ASText numberOfLines={1} style={{fontSize:13,color:'#e27120'}} text={'¥'+rowData.avgPrice}></ASText>
                    </View>
                </View>
            </ASTouchableOpacity>
        );
    }
    /**
     *@desc   渲染轮播图
     *@author 张羽
     *@date   2019/1/17 上午10:35
     *@param
     */
    renderBanner(){
        let swiper= this.state.bannerArr.map((item,i)=>{
            if(item){
                return (
                    <ASTouchableOpacity key = {i}  style={{width:width,height:width*3/5}} onPress={()=>{
                        if(item.jumpType==1){
                            //活动页
                            this.props.push('FuwenbenPage',{H5:item.value})
                        }else if(item.jumpType==2){
                            //商铺ID
                            AsyncStorage.getItem('userInfo', (error, result) => {
                                if (!error) {
                                    if(result != null) {
                                        let userinfo=JSON.parse(result)
                                        this.props.push('HomeDetails',{userId:userinfo.id+'',businessId:item.value+''})
                                    }else{
                                        this.props.push('Login',{transition:'forVertical'})
                                    }
                                }
                            })
                        }else{
                            //商品ID
                            AsyncStorage.getItem('userInfo', (error, result) => {
                                if (!error) {
                                    if(result != null) {
                                        let userinfo=JSON.parse(result)
                                        this.props.push('VipListDetails',{uid:userinfo.id+'',id:item.value+''})
                                    }else{
                                        this.props.push('Login',{transition:'forVertical'})
                                    }
                                }
                            })
                        }
                    }}>
                        <BImage
                            style={{width:width,height:200}}
                            source={{uri:item.src}}
                        />
                    </ASTouchableOpacity>

                )
            }
        });
        return  swiper
    }
    _keyExtractor = (item, index) => 'hotlist'+index
    render() {
        return (
            <View style={{flex:1}}>
            <BScrollView showsVerticalScrollIndicator={false} enablePull={true} isPulling={this.state.isPulling}
                         onPull={()=>{this.onPull()}}
                         onLoadMore={()=>{this.onLoadMore()}}
                         isLoadingMore={this.state.isLoadingMore}
                         isLoadMoreComplate={this.state.isLoadMoreComplate}
                         enableLoadMore={this.state.enableLoadMore}
            >
                <View style={{flex:1,backgroundColor:colors.BACK_COLOR}}>
                    <View style={styles.topView}>
                        <ImageBackground style={styles.bannerView}>
                            {/*<BImage source={this.state.bannerArr.length>0?{uri:this.state.bannerArr[0].src}:require('../../images/home/banner.png')} style={styles.bannerImg}/>*/}
                            <Swiper
                                key={this.state.bannerArr.length}
                                height={width*3/5}
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
                        </ImageBackground>
                        {/*定位搜索*/}
                        {this.renderLocationSearch()}
                        {/*功能列表*/}
                        {this.renderFunctionList()}
                        <View style={{width:'100%',height:10,backgroundColor:'#F7F4EF'}}/>
                        {/*同城推荐*/}
                        <View style={styles.cellView}>
                            <ASText style={{fontSize:17,color:'rgb(77,77,77)'}} text={'同城推荐'}></ASText>
                            <ASTouchableOpacity style={styles.checkMore} onPress={()=>{this.props.push('SameCityPage')}}>
                                <ASText style={{fontSize:12,color:'rgb(216,199,139)'}} text={'更多>>'}></ASText>
                            </ASTouchableOpacity>
                        </View>
                        {/*同城推荐列表*/}
                        {this.renderRecommendList()}
                    </View>
                    {/*附近热门*/}
                    <FlatList
                        data = {this.state.hotListData}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item,index})=>this.renderHostListRow(item,index)}
                        ListHeaderComponent={()=>this.renderHotListHeader()}
                        style={{flex:1}}
                        ListFooterComponent={()=>{
                            if(this.state.isLoadMoreComplate){
                                return(
                                    <View style={{alignItems:'center',paddingVertical:10}}>
                                        <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                                    </View>
                                )
                            }
                            return <View></View>
                        }}

                    />
                </View>
            </BScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topView:{},
    bannerView:{
        width:width,
        height:200,
    },
    bannerImg:{
        width:width,
        height:200,
    },
    functionListView:{
        flexDirection:'row',
        paddingBottom:20,
        backgroundColor:colors.WHITE,
        flexWrap: 'wrap',
    },
    functionListViewItem:{
        justifyContent:'center',
        alignItems:'center',
        width:width/4,
        paddingTop:40,
    },
    functionImg:{
        width:35,
        height:35,
        marginBottom:10,
        alignSelf:'center'
    },
    functionText:{
        fontSize:13,
        color:'rgb(61,61,61)'
    },
    searchView:{
        width:width*0.9,
        height:50,
        borderColor:colors.BACK_COLOR,
        borderWidth:2,
        borderRadius:8,
        position:'absolute',
        top:170,
        left:width*0.05,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:colors.WHITE,
        paddingLeft:14,
        zIndex:1
    },
    locationView:{
        flexDirection:'row',
        backgroundColor:colors.WHITE
    },
    locationImg:{
        width:15,
        height:15,
        resizeMode:'contain'
    },
    locationText:{
        fontSize:10,
        color:'#979797',
        marginTop:4
    },
    searchInputView:{
        height:30,
        backgroundColor:'#F3F3F3',
        flexDirection:'row',
        alignItems:'center',
        borderRadius:5,
        flex:1
    },
    searchImg:{
        width:20,
        height:20,
        resizeMode:'contain',
        marginLeft:10,
    },
    searchInput:{
        flex:1,
        fontSize:15,
        color:'#999',
        padding:0,
        marginLeft:5,
    },
    cellView:{
        width:width,
        height:45,
        flexDirection:'row',
        paddingHorizontal:15,
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:colors.WHITE
    },
    checkMore:{

    },
    recommendOutView:{
        flexDirection:'row',
        backgroundColor:colors.WHITE
    },
    recommendInnerView:{
        backgroundColor:colors.WHITE,
        paddingBottom:20,
        paddingLeft:15,
        borderRadius:6
    },
    hotListInnerView:{
        borderWidth:2,
        borderColor:'#F7F4EF',
        paddingHorizontal:15,
        paddingVertical: 12,
        borderRadius:6
    },
    HotListLeftView:{
        flexDirection:'row',
        height:159,
        alignItems:'flex-end'
    },

});


