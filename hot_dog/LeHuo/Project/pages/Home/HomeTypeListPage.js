    import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Platform, FlatList, Animated, Easing, TouchableOpacity, ImageBackground,
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import BImage from '../../components/BImage'
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
const shaixuanArray=[
    '星级','收藏数','距离','价格'
]
import ASText from '../../components/ASText'
@containers()
export default class HomeTypeListPage extends Component{
    static propTypes = {
        type:React.PropTypes.string,
        title:React.PropTypes.string,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.cot=2 //1代表从低到高,2人气从高到低
        this.dot=1 //1从近到远 2距离从远到近
        this.type=this.props.type
        this.page=1
        this.perPage=10
        this.type=this.props.type
        this.state={
            data:[],
            uid:'',
            isShaixuan:false,
            opacity: new Animated.Value(0),
            current:'',
            isLoadComplete:false,
            isLoadMore:false,
            refreshing:false,
            isJu:false,
            isRenqi:false,
            shaixuanArray:this.props.shaixuanArray,
            count:'',
            slectArray:[],
            slectFirst:'',
            slectSecond:'',
            currentId:'',
            keyword:this.props.keyword?this.props.keyword:''//关键词
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.title,
            hiddenNav:true
        });
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.setState({
                        uid:userinfo.id+''
                    },()=>{
                        this.getData(false)
                    })
                }
            }
        })
    }
    /**
     *@desc   点击cell
     *@author 张羽
     *@date   2018/12/18 下午10:36
     *@param
     */
    onPressRow(item){
        this.props.push('HomeDetails',{userId:this.state.uid,businessId:item.id+''})
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/17 下午3:55
     *@param
     */
    getData(isMore){
        this.props.fetchData(this, '', Url.getBusinessInType(this.type,this.state.uid,this.cot,this.dot,this.page,this.state.keyword), {}, successCallback = (data) => {
            console.log('............分类',data)
            this.setState({
                data:isMore?this.state.data.concat(data.info.list?data.info.list:[]) :data.info.list?data.info.list:[],
                refreshing:false,
                isLoadMore:false,
                isLoadComplete:data.info.list?data.info.list.length<this.perPage?true:false:false
            })
            return;
        }, failure = (data) => {
            this.setState({
                refreshing:false,
                isLoadMore:false,
                isLoadComplete:false
            })
            Toast.showShortCenter(data.notice)
        });
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
        this.getData(false)
    }
    /**
     *@desc   点击全部
     *@author 张羽
     *@date   2019/3/17 下午6:47
     *@param
     */
    onPressQuan(){
        this.orderField='1'
        this.orderType=0
        this.page=1
        this.getData(false)
    }
    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019/3/17 下午5:58
     *@param
     */
    onEndReached(){
        if(this.state.refreshing)return
        if(this.state.isLoadMore)return
        if(this.state.isLoadComplete) return
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.data.length/this.perPage)+1
            this.getData(true)
        })
    }
    /**
     *@desc   点击筛选
     *@author 张羽
     *@date   2018/12/17 下午11:10
     *@param
     */
    onPressShaixuan(){
        if(!this.state.isShaixuan){
            this.setState({
                isShaixuan:true,
            });
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.linear,
                },
            ).start(() => {
            });
        }else{
            this.state.opacity.stopAnimation(() => {
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.linear,
                    },
                ).start(() => {
                    this.setState({
                        isShaixuan:false,
                        opacity: new Animated.Value(0),

                    });
                });
            })
        }
    }

    /**
     *@desc   距离
     *@author 张羽
     *@date   2019-09-05 15:39
     *@param
     */
    onPressJu(){
        this.setState({
            isJu:!this.state.isJu
        },()=>{
            this.page=1
            this.dot=this.state.isJu?2:1
            this.getData(false)
        })

    }

    /**
     *@desc   人气
     *@author 张羽
     *@date   2019-09-05 15:39
     *@param
     */
    onPressRenqi(){
        this.setState({
            isRenqi:!this.state.isRenqi
        },()=>{
            this.page=1
            this.cot=this.state.isRenqi?1:2
            this.getData(false)
        })
    }
    /**
     *@desc   点击筛选cell
     *@author 张羽
     *@date   2018/12/17 下午11:26
     *@param
     */
    onPressShaixuanCell(item){
        //筛选
        if(!item.child){
            this.state.opacity.stopAnimation(() => {
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.linear,
                    },
                ).start(() => {
                    this.setState({
                        isShaixuan:false,
                        opacity: new Animated.Value(0),
                        current:item.name,
                        currentId:item.id
                    },()=>{
                        this.type=item.id
                        this.page=1
                         this.getData(false)
                    });

                });
            })
            return
        }
        this.setState({
            slectArray:item.child?item.child:[],
            slectFirst:item.name
        })
    }

    /**
     *@desc   二级分类
     *@author 张羽
     *@date   2019-09-05 16:03
     *@param
     */
    onPressShaixuanCellSecond(item){
        this.state.opacity.stopAnimation(() => {
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,
                },
            ).start(() => {
                this.setState({
                    isShaixuan:false,
                    opacity: new Animated.Value(0),
                    current:item.name,
                    currentId:item.id,
                    slectSecond:item.name,
                },()=>{
                    this.type=item.id
                    this.page=1
                    this.getData(false)
                });

            });
        })
    }
    /**
     *@desc   topView
     *@author 张羽
     *@date   2018/12/17 下午4:42
     *@param
     */
    renderTopView(){
        return(
            <View style={styles.topView}>
                <View style={styles.searchInputView}>
                    <Image source={require('../../images/common/search.png')} style={styles.searchImg}/>
                    <TextInput
                        style={styles.searchInput}
                        underlineColorAndroid={'transparent'}
                        placeholder={'搜索您需要的'}
                        value={this.state.keyword}
                        placeholderTextColor={colors.CAED}
                        onChangeText={(text)=>this.setState({keyword:text})}
                        onEndEditing={()=>{
                            if(this.state.keyword) {
                                AsyncStorage.getItem('historySearch', (error, result) => {
                                    if (!error) {
                                        if (result != null) {
                                            let historySearch = JSON.parse(result)
                                            if (historySearch.length >= 10) {
                                                historySearch.pop()
                                            }
                                            for (let i = 0; i < historySearch.length; i++) {
                                                let str = historySearch[i]
                                                if (this.state.keyword === str) {
                                                    //避免重复
                                                    historySearch.splice(i, 1)
                                                    break;
                                                }
                                            }
                                            historySearch.splice(0, 0, this.state.keyword)
                                            let history = JSON.stringify(historySearch);
                                            AsyncStorage.setItem('historySearch', history);
                                        } else {
                                            let historySearch = []
                                            historySearch.push(this.state.keyword)
                                            let history = JSON.stringify(historySearch);
                                            AsyncStorage.setItem('historySearch', history);
                                        }
                                    }
                                })
                                this.page=1
                                this.getData(false)
                            }
                        }}
                        returnKeyType = {'search'}
                    />
                </View>
                <ASTouchableOpacity style={{paddingLeft:22,justifyContent:'center'}} onPress={()=>{this.props.back()}}>
                    <ASText style={{fontSize:16,color:colors.CHATTEXT,fontWeight:'bold'}} text={'取消'}></ASText>
                </ASTouchableOpacity>
            </View>
        )
    }
    /**
     *@desc   筛选
     *@author 张羽
     *@date   2018/12/17 下午11:04
     *@param
     */
    rendershaixan(){
        return(
            <View style={{height:45,zIndex:1,flexDirection:'row',alignItems:'center',borderBottomWidth:colors.width_1_PixelRatio,borderBottomColor:colors.LINE,backgroundColor:'white'}}>
                <ASTouchableOpacity style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.onPressShaixuan()}}>
                    <ASText style={[{fontSize:15,color:colors.CHATTEXT},this.state.isShaixuan?{color:colors.CHATBUDDLE}:{}]} text={this.state.current?this.state.current:'分类'}></ASText>
                    <Image source={!this.state.isShaixuan?Images.Arrow_down:Images.Arrow_yellow_up} style={{width:11,height:6,marginLeft:5}}/>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.onPressJu()}}>
                    <ASText style={[{fontSize:15,color:colors.CHATTEXT},this.state.isJu?{color:colors.CHATBUDDLE}:{}]} text={'距离'}></ASText>
                    <Image source={!this.state.isJu?Images.Arrow_down:Images.Arrow_yellow_up} style={{width:11,height:6,marginLeft:5}}/>
                </ASTouchableOpacity>
                {/*<ASTouchableOpacity style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.onPressRenqi()}}>*/}
                {/*    <ASText style={[{fontSize:15,color:colors.CHATTEXT},this.state.isRenqi?{color:colors.CHATBUDDLE}:{}]} text={'人气'}></ASText>*/}
                {/*    <Image source={!this.state.isRenqi?Images.Arrow_down:Images.Arrow_yellow_up} style={{width:11,height:6,marginLeft:5}}/>*/}
                {/*</ASTouchableOpacity>*/}
            </View>
        )
    }
    /**
     *@desc   cell
     *@author 张羽
     *@date   2018/12/17 下午3:55
     *@param
     */
    renderRow(item,index){
        let newArray=Array.isArray(item.label)?item.label:[]
        return(
            <TouchableOpacity style={styles.cellView} key={index} onPress={()=>{this.onPressRow(item)}}>
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
                                text={'¥' + item.avgPrice}></ASText>
                    }
                    <View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',flexWrap: 'wrap',flex:1}}>
                            {newArray.map((item,index)=>{
                                return(
                                    <View style={[{borderWidth:colors.width_1_PixelRatio,padding:2,
                                        justifyContent:'center',alignItems:'center',borderRadius:2,borderColor:'#e27120'},index==0?{}:{marginLeft:10}]} key={index}>
                                        <ASText style={{fontSize:10,color:'#e27120'}} text={item}></ASText>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={[{paddingHorizontal:5,paddingVertical:5,borderRadius:5,borderWidth: colors.width_1_PixelRatio,borderColor: '#e27120'}]}>
                            <ASText style={[{fontSize:10,color:'#e27120'}]} text={'更多详情>>'}></ASText>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'samecity'+index
    render(){
        return(
            <View style={styles.container}>
                {this.renderTopView()}
                {this.rendershaixan()}
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                    style={{flex:1}}
                    ListEmptyComponent={()=>{
                        if(this.state.isLoadComplete){
                            return <View></View>
                        }
                        return(
                            <View style={{alignItems:'center',paddingTop:20}}>
                                <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                            </View>
                        )}}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{this.onRefresh()}}
                    onEndReachedThreshold={0.3}
                    onEndReached={()=>this.onEndReached()}
                    ListFooterComponent={()=>{
                        if(this.state.isLoadComplete){
                            return(
                                <View style={{alignItems:'center',paddingVertical:10}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                                </View>
                            )
                        }else if(this.state.isLoadMore){
                            return(
                                <View style={{alignItems:'center',paddingVertical:20}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'正在加载中...'}></ASText>
                                </View>
                            )
                        }else{
                            return <View></View>
                        }
                    }}
                />
                {this.state.isShaixuan?<View style={styles.shaixuanView}>
                    <Animated.View style={[{backgroundColor:colors.WHITE,flexDirection:'row',},{
                        marginTop:this.state.opacity.interpolate({inputRange:[0,1],outputRange:[0,0]})
                    }]}>
                        <View style={{flex:1}}>
                            {this.state.shaixuanArray.map((item,i)=>{
                                if(item.name=='积分商城'||item.name=='全部分类')return
                                return(
                                    <ASTouchableOpacity onPress={()=>{this.onPressShaixuanCell(item)}}
                                                        key={i} style={[{height:50,justifyContent:'center',paddingLeft:32,borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio}]}>
                                        <ASText style={[{fontSize:15,color:colors.CHATTEXT},this.state.slectFirst===item.name?{color:colors.CHATBUDDLE}:{}]} text={item.name}></ASText>
                                    </ASTouchableOpacity>
                                )
                            })}
                        </View>
                        {this.state.slectArray.length>0?<View style={{flex:1}}>
                            {this.state.slectArray.map((obj,i)=>{
                                return(
                                    <ASTouchableOpacity onPress={()=>{this.onPressShaixuanCellSecond(obj)}}
                                                        key={i} style={[{height:50,justifyContent:'center',paddingLeft:32,borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio}]}>
                                        <ASText style={[{fontSize:15,color:colors.CHATTEXT},this.state.slectSecond===obj.name?{color:colors.CHATBUDDLE}:{}]} text={obj.name}></ASText>
                                    </ASTouchableOpacity>
                                )
                            })}
                        </View>:null}
                    </Animated.View>
                </View>:null}

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    hotListInnerView:{
        justifyContent:'center',
        paddingVertical:17,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE
    },
    HotListLeftView:{
        flexDirection:'row',
        alignItems:'center'
    },
    HotListRightView:{
        marginLeft:14,
        justifyContent:'center',
        flex:1
    },
    hotListPosition:{
        marginTop:16,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    searchInput:{
        padding:0,
        flex:1,
        fontSize:15,
        color:colors.CHATTEXT,
        marginLeft:10
    },
    topView:{
        flexDirection:'row',
        height:50,
        paddingHorizontal:12,
        alignItems:'center',
        paddingTop:10,
        zIndex:1,
        backgroundColor:'white'
    },
    searchInputView:{
        height:30,
        flexDirection:'row',
        flex:1,
        backgroundColor:colors.SEARCH_back,
        paddingHorizontal:10,
        alignItems:'center',
        borderRadius:5,
    },
    searchImg:{
        width:20,
        height:20,
        resizeMode:'contain',
    },
    shaixuanView:{
        position:'absolute',
        top:95,
        right:0,
        bottom:0,
        left:0,
        backgroundColor:colors.BLACK_TRANSPARENT_COLOR,
        zIndex:0
    },
    cellView:{
        paddingHorizontal:12,
        paddingVertical:16,
        borderBottomColor:colors.LINE,
        borderBottomWidth: colors.width_1_PixelRatio,
        flexDirection:'row',
        alignItems:'center'
    }


})
