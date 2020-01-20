
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList, AsyncStorage
} from 'react-native';
import containers from '../../containers/containers'
// import  DeviceInfo from 'react-native-device-info';
// const device = DeviceInfo.getModel();
// const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
const tabHeight=0
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import colors from "../../../Resourse/Colors";
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import Images from "../../../Resourse/Images";
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
import MasonryList from '@appandflow/masonry-list';
import BScrollView from "../../components/BScrollView";
const itemWidth = (width - 36) / 2;
@containers()
export default class NetCelebrity extends Component<Props> {
    constructor(props){
        super(props);
        this.perPage=10
        this.page=1
        this.isLoadMore=false
        this.state={
            searchText:'',//搜索内容
            hotListData:[],
            refreshing:false,
            isLoadMore:false,
            isLoadComplete:false,
            enableLoadMore:true

        };
        this.onEndReached=this.onEndReached.bind(this)
        this.getRecommendBusiness=this.getRecommendBusiness.bind(this)
        this.onRefresh=this.onRefresh.bind(this)
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'网红推荐',
            hiddenNav:true
        });
        //网红推荐
        this.getRecommendBusiness(false)
    }
    /**
     *@desc   网红推荐
     *@author 张羽
     *@date   2018/12/16 下午3:17
     *@param
     */
    getRecommendBusiness(ismore){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    console.log('..........userinfo',userinfo)
                    this.props.fetchData(this, '', Url.wanghot(userinfo.id,this.page,this.perPage), {}, successCallback = (data) => {
                        console.log('............网红推荐',data)
                        let array=ismore?this.state.hotListData.concat(data.info.list):data.info.list
                        for(let i=0;i<array.length;i++){
                            let obj=array[i]
                            obj.index=i
                        }
                        this.setState({
                            hotListData:array,
                            refreshing:false,
                            isLoadMore:false,
                            enableLoadMore:data.info.list.length<this.perPage?false:true,
                            isLoadMoreComplate:data.info.list.length<this.perPage?true:false,
                        },()=>{
                            this.isLoadMore=false
                        })
                        return;
                    }, failure = (data) => {
                        this.setState({
                            refreshing:false,
                            isLoadMore:false,
                        },()=>{
                            this.isLoadMore=false
                        })
                        Toast.showShortCenter(data.msg)
                    });
                }else{
                    this.props.fetchData(this, '', Url.wanghot('',this.page,this.perPage), {}, successCallback = (data) => {
                        console.log('............网红推荐',data)
                        let array=ismore?this.state.hotListData.concat(data.info.list):data.info.list
                        for(let i=0;i<array.length;i++){
                            let obj=array[i]
                            obj.index=i
                        }
                        this.setState({
                            hotListData:array,
                            isLoadMore:false,
                            enableLoadMore:data.info.list.length<this.perPage?false:true,
                            isLoadMoreComplate:data.info.list.length<this.perPage?true:false,
                            refreshing:false
                        },()=>{
                            this.isLoadMore=false
                        })
                        return;
                    }, failure = (data) => {
                        this.setState({
                            refreshing:false,
                            isLoadMore:false,
                        },()=>{
                            this.isLoadMore=false
                        })
                        Toast.showShortCenter(data.msg)
                    });
                }
            }
        })
    }

    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019-08-26 14:29
     *@param
     */
    onEndReached(){
        if(this.isLoadMore)return
        this.isLoadMore=true
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.hotListData.length/this.perPage)+1
            this.getRecommendBusiness(true)
        })
    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2019/3/17 下午5:57
     *@param
     */
    onRefresh(){
        if(this.state.refreshing)return
        if(this.state.isLoadMore)return
        this.setState({
            refreshing:true
        })
        this.page=1
        this.getRecommendBusiness(false)
    }
    /**
     *@desc   点击cell
     *@author 张羽
     *@date   2018/12/11 下午11:19
     *@param
     */
    onPressCell(item){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.props.push('NetCelebrityDetailsPage',{userId:userinfo.id+'',businessId:item.id+'',title:item.name,userinfo:userinfo})
                }else{
                    this.props.push('Login',{transition:'forVertical'})
                }
            }
        })
    }
    /**
     *@desc 渲染附近热门列表项
     *@author 陈金华
     *@date 2018/10/30 10:14
     */
    _renderItem = ({item}) =>{
        let height=(item.index+1)%2==0?120:150
        height=(item.index+1)%4==0?150:height
        return (
            <View style={styles.cellView}>
                <TouchableOpacity style={styles.recommendInnerView}  onPress={()=>{this.onPressCell(item)}}>
                    <BImage source={{uri:item.cover}} style={{width:(width-12)/2-12,height:height,borderTopRightRadius:6,borderTopLeftRadius:6}}
                            // isResize={true} imageWidth={(width-12)/2-12} imageHeight={200} pubuliu={true}
                            imageStyle={{borderTopRightRadius:6,borderTopLeftRadius:6}}/>
                    <View style={{paddingHorizontal:10,height:30}}>
                        <ASText style={{fontSize:14,fontWeight:'bold',color:colors.CHATTEXT,marginTop:9}} text={item.name} numberOfLines={1}></ASText>
                        <ASText style={{fontSize:12,color:colors.Noticetitle,marginTop:7}}  numberOfLines={1} text={item.slogan}></ASText>
                    </View>
                    <View style={{flex:1,justifyContent:'flex-end',height:50}}>
                        <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between',alignItems:'center',paddingHorizontal:10}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={item.isCollection?Images.ZANSELECT:Images.ZAN} style={{width:17,height:17}}/>
                                <ASText  style={{fontSize:14,color:colors.CHATTEXT,marginLeft:5}} text={item.agreeNum} numberOfLines={1}></ASText>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={Images.LIULAN} style={{width:14,height:12}}/>
                                <ASText  style={{fontSize:14,color:colors.CHATTEXT,marginLeft:5}} text={item.browse} numberOfLines={1}></ASText>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    /**
     *@desc   计算cell的高度
     *@author 张羽
     *@date   2019-09-07 00:36
     *@param
     */
    _getHeightForItem = ({item}) => {
        let height=(item.index+1)%2==0?120:150
        height=(item.index+1)%4==0?150:height
        return height+80;
    }
    _keyExtractor = (item, index) => {
        return  item.id+'';
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.TitleView}>
                    <Text style={styles.TitleText}>网红推荐</Text>
                </View>
                <BScrollView showsVerticalScrollIndicator={false} enablePull={true} isPulling={this.state.refreshing}
                             onPull={this.onRefresh}
                             onLoadMore={this.onEndReached}
                             isLoadingMore={this.state.isLoadingMore}
                             isLoadMoreComplate={this.state.isLoadMoreComplate}
                             enableLoadMore={this.state.enableLoadMore}
                >
                    <MasonryList
                        data={this.state.hotListData}
                        numColumns={2}
                        renderItem={this._renderItem}
                        getHeightForItem={this._getHeightForItem}
                        keyExtractor={this._keyExtractor}
                        style={{marginTop:10}}
                    />
                </BScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        paddingTop:Platform.OS === 'ios'?tabHeight:0,
    },
    recommendInnerView:{
        borderRadius:6,
        paddingBottom:10,
        borderWidth:colors.width_1_PixelRatio,
        borderColor:colors.LINE,
        flex:1
    },
    TitleText:{
        fontSize:26,
        color:colors.BLACK,
        fontWeight:'bold',
    },
    TitleView:{
        marginTop:48,
        width:width-24,
        marginLeft:12,
        paddingBottom:15,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE,
        flexDirection:'row',
        justifyContent:'space-between',

    },
    cellView:{
        paddingLeft:12,
        width:(width-12)/2,
        paddingBottom:10,
    }

});


