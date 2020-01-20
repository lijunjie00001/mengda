import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert, AsyncStorage, Platform,  FlatList,ImageBackground,ScrollView
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import EZSwiper from 'react-native-ezswiper';
import BImage from '../../components/BImage'
import BScrollView from '../../components/BScrollView'
import ASText from '../../components/ASText'
import Swiper from "react-native-swiper";
const typeArray=[
    {
        title:'酒水',
        icon:require('../../images/home/jiushui.png')
    },
    {
        title:'茶叶',
        icon:require('../../images/home/chaye.png')
    },
    {
        title:'生活',
        icon:require('../../images/home/shenghuo.png')
    },
    {
        title:'母婴',
        icon:require('../../images/home/muyin.png')
    }
]
@containers()
export default class HomeVipListPage extends Component{
    constructor(props){
        super(props)
        this.getListData=this.getListData.bind(this)
        this.perPage=10
        this.page=1
        this.cateId=''
        this.state={
            uid:'',
            data:[],
            tabIndex:0,
            listData:[],
            isPulling:false,
            enableLoadMore:false,
            isLoadingMore:false,
            isLoadMoreComplate:false,
            cateArr:[],
            background:'',
            typeArray:[],
            backImage:[]
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'会员专享',
        });
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.setState({
                        uid:userinfo.id+'',
                    },()=>{
                        this.getCarType()
                    })
                }
            }
        })
        this.getBackImage()
    }

    /**
     *@desc   获取分类
     *@author 张羽
     *@date   2019-09-06 21:05
     *@param
     */
    getCarType(){
        this.props.fetchData(this, '', Url.carType(0,''), {}, successCallback = (data) => {
            console.log('........获取分类',data.info)
            let dataArray=Array.isArray(data.info)?data.info[0]:{}
            let child=dataArray.child?dataArray.child:[]
            this.setState({
                typeArray:child
            },()=>{
                let obj=child.length>0?child[0]:{}
                this.cateId=obj.id>0?obj.id:''
                this.getListData(false)
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取背景图片
     *@author 张羽
     *@date   2019-08-28 02:44
     *@param
     */
    getBackImage(){
        this.props.fetchData(this, '', Url.getBackImage(2), {}, successCallback = (data) => {
            console.log('........获取背景图片',data.info)
            this.setState({
                backImage:data.info
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取列表数据
     *@author 张羽
     *@date   2019/1/14 下午2:58
     *@param
     */
    getListData(isMore){
        this.props.fetchData(this, '', Url.goodsList(this.state.uid,this.cateId,this.page,this.perPage), {}, successCallback = (data) => {
            console.log('............推荐',data)
            this.setState({
                listData:isMore?this.state.listData.concat(data.info.list):data.info.list,
                isLoadMoreComplate:data.info.list.length<this.perPage?true:false,
                enableLoadMore:data.info.list.length<this.perPage?false:true,
                isPulling:false,
                isLoadingMore:false,
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
            this.setState({isLoadMore:false,isPulling:false, isLoadingMore:false,})
        });
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
            this.getListData(false)
            this.getData()
        })
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
            this.page=parseInt(this.state.listData.length/this.perPage)+1
            this.getListData(true)
        })
    }
    /**
     *@desc   点击分类
     *@author 张羽
     *@date   2019/1/14 下午3:00
     *@param
     */
    onPressTitle(item){
        this.cateId=item.id
        this.getListData(false)
    }
    /**
     *@desc   点击列表
     *@author 张羽
     *@date   2019/1/14 下午3:06
     *@param
     */
    onPressHot(item){
        this.props.push('VipListDetails',{uid:this.state.uid,id:item.id+''})
    }
    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019/1/3 下午3:11
     *@param
     */
    onEndReached(){
        if(this.state.isLoadMore)return
        if(this.state.isLoadComplete) return
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.listData.length/this.perPage)+1
            this.getListData(true)
        })
    }
    renderTabber(){
        return(
            <View style={{flexDirection:'row',alignItems:'center',paddingTop:20,backgroundColor:'white',flexWrap: 'wrap'}}>
                {this.state.typeArray.map((item,i)=>{
                    return(
                        <ASTouchableOpacity key={i} style={{justifyContent:'center',alignItems:'center',paddingBottom: 20,width:width/4}} onPress={()=>{
                            this.setState({tabIndex:i},()=>{
                                this.onPressTitle(item)
                            })
                          }}>
                           <BImage source={{uri:item.img}} style={{width:48,height:48}}/>
                            <ASText style={{fontSize:14,color:'#3d3d3d',marginTop:10}} text={item.name}></ASText>
                            <View style={[{width:20,height:1,backgroundColor:'#e3782c',marginTop:6},this.state.tabIndex==i?{}:{backgroundColor:'white'}]}></View>
                        </ASTouchableOpacity>
                    )
                })}
            </View>
        )
    }
    _keyExtractor = (item, index) => 'vip'+item.id
    renderRow(rowData,index){
        return(
            <ASTouchableOpacity style={{width:'100%',backgroundColor:colors.WHITE}} onPress={()=>{this.onPressHot(rowData)}}>
                <View style={styles.hotListInnerView}>
                    <View style={styles.HotListLeftView}>
                        <BImage source={{uri:rowData.cover}} style={{width:80,height:80,backgroundColor:colors.BACK_COLOR,borderRadius:4}} imageStyle={{borderRadius:4}}/>
                        <View style={styles.HotListRightView}>
                            <ASText style={{fontSize:12,fontWeight:'bold',color:'#4d4d4d'}} text={rowData.goodsName}></ASText>
                            <ASText style={{fontSize:16,color:'#e27120',marginTop:17}} text={'￥'+rowData.price}></ASText>
                            <View style={{marginTop:13,flexDirection:'row',justifyContent:'space-between',flex:1}}>
                                <ASText style={{fontSize:12,color:'#4d4d4d'}} text={'库存:'+rowData.stock}></ASText>
                                <View style={[{paddingHorizontal:10,paddingVertical:5,borderRadius:5,borderWidth: colors.width_1_PixelRatio,borderColor: '#e27120'},
                                    rowData.stock==0?{borderColor:'#959595'}:{}]}>
                                    <ASText style={[{fontSize:10,color:'#e27120'},rowData.stock==0?{color:'#959595'}:{}]} text={ rowData.stock==0?'已兑完':'去兑换>>'}></ASText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ASTouchableOpacity>
        )
    }
    /**
     *@desc   渲染轮播图
     *@author 张羽
     *@date   2019/1/17 上午10:35
     *@param
     */
    renderBanner(){
        let swiper= this.state.backImage.map((item,i)=>{
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
                            style={{width:width,height:width*3/5,borderRadius:6,backgroundColor:colors.BACK_COLOR}}
                            source={{uri:item.src}}
                        />
                    </ASTouchableOpacity>

                )
            }
        });
        return  swiper
    }
    render(){
        return(
            <View style={styles.container}>
                <BScrollView showsVerticalScrollIndicator={false} enablePull={true} isPulling={this.state.isPulling}
                             onPull={()=>{this.onPull}}
                             onLoadMore={()=>{this.onLoadMore()}}
                             isLoadingMore={this.state.isLoadingMore}
                             isLoadMoreComplate={this.state.isLoadMoreComplate}
                             enableLoadMore={this.state.enableLoadMore}
                >
                    <View style={{flex:1}}>
                        <View style={{height:width*3/5}}>
                            <Swiper
                                key={this.state.backImage.length}
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
                        </View>
                        {this.renderTabber()}
                        <View style={{height:10,backgroundColor:'#f8f8f8'}}></View>
                        <FlatList
                            data = {this.state.listData}
                            renderItem={({item,index})=>this.renderRow(item,index)}
                            renderSeparator={()=>null}//分割线
                            keyExtractor={this._keyExtractor}
                            style={{flex:1}}
                            ListFooterComponent={()=>{
                                    return(
                                        <View style={{alignItems:'center',paddingVertical:10}}>
                                            <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                                        </View>
                                    )
                            }}
                        />
                    </View>
                </BScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    ImageBackgroundView:{
        width:width,
        height:200,
        position:'absolute',
        right:0,
        left:0,
        top:0
    },
    imgView:{
        borderRadius:6,
        borderColor:colors.LINE,
        borderWidth:2,
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    hotListInnerView:{
        justifyContent:'center',
        paddingVertical:12,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE,
        paddingLeft: 16,
        paddingRight: 27
    },
    HotListLeftView:{
        flexDirection:'row',
        alignItems:'center'
    },
    HotListRightView:{
        marginLeft:23,
        flex:1
    },
})
