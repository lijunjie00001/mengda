
/**
 *@FileName VipCard.js
 *@desc (会员卡)
 *@author chenbing
 *@date 2018/10/30 10:01
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated, AsyncStorage, FlatList, SectionList, DeviceEventEmitter
} from 'react-native';
import Swiper from 'react-native-swiper';
import containers from '../../containers/containers';
import BListView from "../../components/BListView";
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import Images from '../../../Resourse/Images'
import colors from '../../../Resourse/Colors'
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import EZSwiper from 'react-native-ezswiper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import VipListPage from './VipListPage'
import VipPayDetails from "./VipPayDetails";
import BImage from '../../components/BImage'
import BScrollView from '../../components/BScrollView'
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getModel();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
const TitleArray=[
    {tabLabel :'最新',status:'1'},
    {tabLabel :'最火',status:'2'},
    {tabLabel :'最热',status:'3'},
    {tabLabel :'最潮',status:'4'}
]
import ASText from '../../components/ASText'
@containers()
export default class VipCard extends Component<Props> {
	constructor(props){
		super(props);
		this.getData=this.getData.bind(this)
        this.getListData=this.getListData.bind(this)
        this.getUserInfo=this.getUserInfo.bind(this)
        this.getInappStore=this.getInappStore.bind(this)
        this.classesType='1'
        this.sollvieY=0
        this.isChange=false
        this.page=1
        this.perPage=10
		this.state = {
            vipData:[],
            currectIndex:0,
            name:'',
            icon:'',
            currectData:{},
            data:[],
            currentTab:0,
            isPulling:false,
            isUp:false ,//是否上架
            isVip:false,
            endTime:'',
            enableLoadMore:false,
            isLoadingMore:false,
            isLoadMoreComplate:false,
		};
	}
    componentWillUnmount() {
        if (this.login) {
            this.login.remove()
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'会员卡',
            hiddenNav:true,
        });
        this.getUserInfo()
        this.getInappStore()
        //登录消息
        this.login=DeviceEventEmitter.addListener('login',(userinfo)=>{
            this.getUserInfo()
        });
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
        });
    }
    /**
     *@desc   获取登录信息
     *@author 张羽
     *@date   2019/2/22 下午5:31
     *@param
     */
    getUserInfo(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    console.log('..........userinfo',userinfo)
                    this.setState({
                        name:userinfo.username,
                        icon:userinfo.cover,
                        uid:userinfo.id+'',
                    },()=>{
                        this.getListData(false)
                        this.getData()
                    })
                }
            }
        })
    }
    /**
     *@desc   获取会员卡列表
     *@author 张羽
     *@date   2018/12/16 下午4:00
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.myEquity(this.state.uid), {}, successCallback = (data) => {
            this.props.fetchData(this, '', Url.myEquity(this.state.uid), {}, successCallback = (data) => {
                console.log('............卡片',data)
                let obj={
                    cover:data.info.cover,
                    shuoming:data.info.shuoming,
                    couponArray:data.info.couponArray,
                }
                let array=[]
                array.push(obj)
                this.setState({
                    endTime:data.info.endTime,
                    vipData:array,
                    currectData:array.length>=0?array[0]:{},
                    currectIndex:0,
                    isVip:true
                })
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
            return;
        }, failure = (data) => {
            this.props.fetchData(this, '', Url.vipList(), {}, successCallback = (data) => {
                console.log('............卡片',data)
                this.setState({
                    vipData:data.info,
                    currectData:data.info.length>=0?data.info[0]:{},
                    currectIndex:0,
                    isVip:false
                })
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.msg)
            });
        });
    }
    /**
     *@desc   获取推荐数据
     *@author 张羽
     *@date   2018/12/14 上午11:30
     *@param
     */
    getListData(isMore){
        this.props.fetchData(this, '', Url.recommendInVip(this.page,this.perPage, this.state.uid,this.classesType), {}, successCallback = (data) => {
            console.log('............列表',data)
            this.setState({
                data:isMore?this.state.data.concat(data.info.list):data.info.list,
                isPulling:false,
                isLoadMoreComplate:data.info.list.length<this.perPage?true:false,
                enableLoadMore:data.info.list.length<this.perPage?false:true,
                isLoadingMore:false
            })
            return;
        }, failure = (data) => {
            this.setState({isPulling:false,isLoadingMore:false})
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2019/3/17 下午5:57
     *@param
     */
    onPull(){
        if(this.state.isPulling)return
        this.setState({
            isPulling:true
        })
        this.getData(false)
        this.getUserInfo()
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
            this.page=parseInt(this.state.data.length/this.perPage)+1
            this.getListData(true)
        })
    }
	/**
	 *@desc   开通会员
	 *@author 张羽
	 *@date   2018/12/23 下午3:57
	 *@param
	 */
    onPressPay(){
        this.props.push('VipPayDetails',{item:this.state.currectData,uid:this.state.uid})
    }
    /**
     *@desc   点击cell
     *@author 张羽
     *@date   2018/12/11 下午11:19
     *@param
     */
    onPressCell(item){
        this.props.push('HomeDetails',{userId:this.state.uid+'',businessId:item.id+''})
    }
    /**
     *@desc   渲染卡片
     *@author 张羽
     *@date   2018/12/17 上午9:27
     *@param
     */
    renderImageRow(item,index){
        if(item){
            return (
                <View style={[styles.imgView]}>
                    <BImage
                        style={{position:'absolute',top:0,right:0,bottom:0,left:0}}
                        resizeMode={'contain'}
                        source={{uri:item.cover?item.cover:''}}
                        />
                </View>

            )
        }
    }

	/**
	 *@desc 会员优惠描述
	 *@author chenbing
	 *@date 2018/10/30 23:49
	 */
	renderDiscountDercribe(){
	    return(
            <View style={[styles.discountListView,{ alignItems:'center'}]}>
                {this.state.currectData.couponArray?this.state.currectData.couponArray.map((item,i)=>{
				    return (
				        <View  key={i} style={{paddingBottom:5,paddingHorizontal:60}}>
                            <ASText
                                numberOfLines={1}
                                style={{fontSize:11,color:colors.CHATTEXT}} text={(i+1)+'、'+item.num+'张'+item.name}>
                            </ASText>
                        </View>
				    )
			    }):null}
            </View>
        )
    }
    /**
     *@desc   标签
     *@author 张羽
     *@date   2018/12/17 下午2:05
     *@param
     */
    renderTabber(info){
        console.log('.....info',info)
        return(
            <View style={{flexDirection:'row',paddingHorizontal:26,height:38,backgroundColor:colors.WHITE,justifyContent:'space-between',alignItems:'center'}} >
                {TitleArray.map((item,i)=>{
                    return(
                        <ASTouchableOpacity key={i} style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{
                            if(this.state.currentTab==i)return
                            this.setState({currentTab:i},()=>{
                                this.classesType=item.status
                                this.page=1
                                this.getListData(false)
                            })
                        }}>
                            <ASText  style={[{fontSize:16,color:colors.CHATTEXT,fontWeight:'bold'},this.state.currentTab==i?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={item.tabLabel}></ASText>
                        </ASTouchableOpacity>
                    )
                })}
            </View>
        )
    }
    /**
     *@desc 渲染列表项
     *@author chenbing
     *@date 2018/10/30 10:14
     */
    renderHostListRow(item,index){
        let newArray=Array.isArray(item.label)?item.label:[]
        return (
                <TouchableOpacity style={styles.cellView} key={index} onPress={()=>{this.onPressCell(item)}}>
                    <BImage source={{uri:item.cover}}  style={{width:64,height:64,borderRadius:4}} imageStyle={{borderRadius:4}}/>
                    <View style={{marginLeft:10,flex:1}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <ASText style={{fontSize:14,fontWeight:'bold',color:colors.CHATTEXT}} text={item.name}></ASText>
                            <ASText style={{fontSize:10,color:'#737373'}} text={'收藏'+item.browse}></ASText>
                        </View>
                        {item.discount &&item.discount!='0.0'? <ImageBackground style={{
                                width: 44,
                                height: 17,
                                marginTop: 10,
                                justifyContent: 'center',
                                alignItems:'flex-end',paddingRight: 5
                            }} source={require('../../images/home/zhekou.png')}>
                                <ASText numberOfLines={1}
                                        style={{fontSize: 13, color: 'white', backgroundColor: colors.TRANSPARENT_COLOR}}
                                        text={item.discount + '折'}></ASText>
                            </ImageBackground> :
                            <ASText numberOfLines={1} style={{fontSize: 13, color: '#e27120', marginTop: 10}}
                                    text={'¥' + item.discountPrice}></ASText>
                        }
                        <View style={{marginTop:10,flexDirection:'row',flexWrap: 'wrap'}}>
                            {newArray.map((item,index)=>{
                                return(
                                    <View style={[{borderWidth:colors.width_1_PixelRatio,padding:2,
                                        justifyContent:'center',alignItems:'center',borderRadius:2,borderColor:'#e27120'},index==0?{}:{marginLeft:10}]} key={index}>
                                        <ASText style={{fontSize:10,color:'#e27120'}} text={item}></ASText>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </TouchableOpacity>
        );
    }
    _keyExtractor = (item, index) => 'jifen'+index
    render() {
        return (
            <View style={styles.container}>
                <BScrollView  contentInsetAdjustmentBehavior="automatic"  ref={'ScrollView'} enablePull={true}
                              isPulling={this.state.isPulling}
                              onPull={()=>{this.onPull()}}
                              onLoadMore={()=>{this.onLoadMore()}}
                              isLoadingMore={this.state.isLoadingMore}
                              isLoadMoreComplate={this.state.isLoadMoreComplate}
                              enableLoadMore={this.state.enableLoadMore}
                >
                    {this.state.isUp?<ImageBackground source={require('../../images/vip/bg.png')} style={styles.topView}>
                        <View style={styles.personView}>
                            <Image source={this.state.icon?{uri:this.state.icon}:require('../../images/my/person.png')} style={styles.personImg}/>
                            <ASText style={{fontSize:16,fontWeight:'bold',color:'#fff',backgroundColor:colors.TRANSPARENT_COLOR,marginTop:5}} text={this.state.name}></ASText>
                        </View>
                        <EZSwiper style={{width: width,height: 150,marginTop:32}}
                                  dataSource={this.state.vipData}
                                  width={ width }
                                  height={ 150 }
                                  renderRow={this.renderImageRow}
                                  loop={false}
                                  ratio={115/150}
                                  index={this.state.currectIndex}
                                  cardParams={{cardSide:255, cardSmallSide:115,cardSpace:1}}
                                  onDidChange={(obj,index)=> {
                                      if(this.state.index!==index){
                                          this.setState({currectData:obj,currectIndex:index,isChange:true})
                                      }
                                  }}
                        />
                        <ASTouchableOpacity style={styles.vipBtn} activeOpacity={0.9} onPress={()=>{this.onPressPay()}} disabled={this.state.isVip}>
                            <ASText style={{fontSize:16,color:'#333',fontWeight:'bold'}} text={this.state.isVip?(this.state.endTime+'到期'):'开通会员'}></ASText>
                        </ASTouchableOpacity>
                    </ImageBackground>:null}
                    {/*会员优惠描述*/}
                    {this.state.isUp? <View style={{marginBottom:20}}>
                        {this.renderDiscountDercribe()}
                        <View style={styles.discountListView}>
                            <ASText style={{fontSize:11,color:colors.CAED,lineHeight:15}} text={this.state.currectData.shuoming?this.state.currectData.shuoming:''}>
                            </ASText>
                        </View>
                    </View>:null}
                    {/*会员推荐商家*/}
                    <View style={[{width:'100%',height:45,backgroundColor:'#F7F4EF',justifyContent:'center',alignItems:'center'},!this.state.isUp?{marginTop:tabHeight}:{}]}>
                        <ASText style={{fontSize:16,color:'#333',fontWeight:'bold'}} text={this.state.isUp?'会员推荐商家':'推荐商家'}></ASText>
                    </View>
                    {this.renderTabber()}
                    <FlatList
                        data = {this.state.data}
                        renderItem={({item,index})=>this.renderHostListRow(item,index)}
                        renderSeparator={()=>null}//分割线
                        keyExtractor={this._keyExtractor}
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
                </BScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
	topView:{
        width:width,
        height:375,
    },
	personView:{
        width:width,
        marginTop:60,
        justifyContent:'center',
        alignItems:'center'
    },
	personImg:{
        width:50,
        height:50,
        resizeMode:'cover',
        borderRadius:25
    },
	imgView:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
	vipBtn:{
        width:width*0.5,
        height:40,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F2CB62',
        marginLeft:width*0.25,
        marginTop:27
    },
	discountListView:{
        width:width,
        marginTop:15,
        backgroundColor:'#fff',
        paddingHorizontal:20
    },
	line:{
    	width:20,
		height:2,
		alignSelf:'center',
		marginTop:5,
	},
    recommendInnerView:{

    },
    cellView:{
        paddingHorizontal:12,
        paddingVertical:16,
        borderBottomColor:colors.LINE,
        borderBottomWidth: colors.width_1_PixelRatio,
        flexDirection:'row',
        alignItems:'center'
    }

});
