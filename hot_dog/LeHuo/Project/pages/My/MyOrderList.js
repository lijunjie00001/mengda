import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList, Alert, AsyncStorage,Image,DeviceEventEmitter,Modal,TextInput
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
@containers()
export default class MyOrderList extends Component{
    static propTypes = {
        uid:React.PropTypes.string,
        status:React.PropTypes.string,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.pageNum=10
        this.page=1
        this.orderId=''
        this.index=0
        this.state={
            // uid:this.props.userInfo.id?this.props.userInfo.id:'',
            data:[],
            refreshing:false,
            isLoadComplete:false,
            isLoadMore:false,
            visible:false,
            star:5,
            pinjia:''
        }
    }
    /* 组件要被从界面上移除的时候,清除定时器 */
    componentWillUnmount() {
        if (this.del) {
           this.del.remove();
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.pageId,
            hiddenNav:true
        });
        this.getData(false)
        this.del=DeviceEventEmitter.addListener('del',(item)=>{
            for(let i=0;i<this.state.data.length;i++){
                let obj=this.state.data[i]
                if(obj.orderId==item.orderId){
                    this.state.data.splice(i,1)
                    this.setState({
                        data:this.state.data
                    })
                    break;
                }
            }
        });
        this.Pinjia=DeviceEventEmitter.addListener('del',(id)=>{
            for(let i=0;i<this.state.data.length;i++){
                let obj=this.state.data[i]
                if(obj.orderId==id){
                    obj.status=5
                    this.setState({
                        data:this.state.data
                    })
                    break;
                }
            }
        });
    }
    getData(isMore){
        this.props.fetchData(this, '', Url.orderListv2(this.props.uid,this.props.status,this.page,this.pageNum), {}, successCallback = (data) => {
            console.log('............订单',data)
            this.setState({
                data:isMore?this.state.data.concat(data.info.list):data.info.list,
                refreshing:false,
                isLoadMore:false,
                isLoadComplete:data.info.list.length<this.pageNum?true:false
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
     *@desc   加载更多
     *@author 张羽
     *@date   2019/3/17 下午5:58
     *@param
     */
    onEndReached(){
        if(this.state.data.length==0)return;
        if(this.state.refreshing)return
        if(this.state.isLoadMore)return
        if(this.state.isLoadComplete) return
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.data.length/this.pageNum)+1
            this.getData(true)
        })
    }

    /**
     *@desc   点击删除
     *@author 张羽
     *@date   2019-08-29 13:26
     *@param
     */
    onPressdel(item,index){
        this.props.fetchData(this, '', Url.orderDelete(item.orderId,this.props.uid,item.bid), {}, successCallback = (data) => {
            console.log('............订单',data)
            this.state.data.splice(index,1)
            this.setState({
                data:this.state.data
            })
            DeviceEventEmitter.emit('del',item)
            Toast.showShortCenter('删除成功')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    /**
     *@desc   点击评价
     *@author 张羽
     *@date   2019-08-29 17:44
     *@param
     */
    onPressPinjia(item,index){
        this.index=index
        this.orderId=item.bid
        this.setState({
            visible:true,
            pinjia:''
        })
    }

    /**
     *@desc   评价按钮
     *@author 张羽
     *@date   2019-08-29 18:16
     *@param
     */
    onPressPinjiaBtn(){
        if(!this.state.pinjia){
            Alert.alert('提示','请输入评价',[{text:'确定',style:'cancel'}]);
            return ;
        }
        this.props.fetchData(this, '', Url.pingShop(this.orderId,this.props.uid,this.state.pinjia,this.state.star), {}, successCallback = (data) => {
            console.log('............请输入评价',data)
            let item=this.state.data[this.index]
            item.status=6
            this.setState({
                data:this.state.data,
                visible:false
            })
            DeviceEventEmitter.emit('pinjia',this.orderId)
            Toast.showShortCenter('评价成功')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    /**
     *@desc   结算按钮
     *@author 张羽
     *@date   2019-09-10 00:34
     *@param
     */
    onPressJiesuan(item){
        this.props.fetchData(this, '', Url.orderDetail(this.props.uid,item.orderNum), {}, successCallback = (data) => {
            console.log('............订单',data)
            this.props.push('JiesuPage',{
                zhekou:data.info.discount+'',
                uid:this.props.uid,
                oid:item.orderId,
                isOrder:true,
                orderNum:item.orderNum,
                is_discount:data.info.is_discount,
                no_discount_price:data.info.no_discount_price,
                total_price:data.info.total_price,
                totalPrice:data.info.totalPrice,
                isHotel:data.info.isHotel==1?true:false
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   点击order
     *@author 张羽
     *@date   2019/2/20 下午4:37
     *@param
     */
    onPressOrder(item){
        this.props.push('OrderDetails',{uid:this.props.uid,orderNum:item.orderNum})
    }
    renderRow(item,index){
        let goodsNum=item.goodsNum?item.goodsNum:'1'
        let showBtn=item.status==5||item.status==6||item.status==4?true:false
        let showJiesuan=item.status==2||item.status==3?true:false
        return(
            <ASTouchableOpacity style={{paddingHorizontal: 12,paddingTop:12,backgroundColor:colors.BackPage}} onPress={()=>{this.onPressOrder(item)}}>
                <View style={{flex:1,backgroundColor:'white',borderRadius:6,paddingTop:18}}>
                    <View style={{flexDirection: 'row',flex:1,justifyContent:'space-between',paddingLeft: 15}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <BImage source={{uri:item.logo}} style={{width:30,height:30,borderRadius:15}} imageStyle={{borderRadius:15}}/>
                            <View style={{marginLeft: 10}}>
                                <ASText style={{fontSize:12,color:'#3d3d3d'}} text={item.goodsName}></ASText>
                                <ASText style={{fontSize:10,color:'#959595',marginTop: 5}} text={item.createTime}></ASText>
                            </View>
                        </View>
                        <View style={{paddingRight: 10}}>
                            <ASText style={{fontSize:10,color:'#df5059'}} text={item.statusStr}></ASText>
                        </View>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row',paddingLeft: 15}}>
                        <BImage source={{uri:item.goodsCover}} style={{width:80,height:80,borderRadius:6,backgroundColor:colors.BackPage}} imageStyle={{borderRadius:6}}/>
                        <View style={{marginLeft:13,flex:1}}>
                            <View style={{paddingRight:80}}>
                                <ASText text={item.title} numberOfLines={2} style={{fontSize:12,color:'#3d3d3d'}}/>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',paddingRight:16,flex:1}}>
                                <View style={{width:10,backgroundColor:'white'}}></View>
                                <View style={{alignItems:'flex-end'}}>
                                    <ASText text={'合计:¥'+item.totalPrice} numberOfLines={1} style={{fontSize:16,color:'#3d3d3d',marginTop:7}}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop:15,height:1,backgroundColor:colors.BackPage}}></View>
                    {showBtn?<View style={{flexDirection:'row',paddingVertical:18,alignItems:'center',justifyContent:'flex-end',paddingRight:16}}>
                        <ASTouchableOpacity style={{paddingVertical:5,paddingHorizontal:10,borderRadius:11,borderWidth: 1,borderColor:'#959595',alignItems:'center'}} onPress={()=>{this.onPressdel(item,index)}}>
                            <ASText text={'删除'} numberOfLines={1} style={{fontSize:12,color:'#959595'}}/>
                        </ASTouchableOpacity>
                        {item.status==5||item.status==4?<ASTouchableOpacity disabled={item.status==5?true:false} onPress={()=>{this.onPressPinjia(item,index)}}
                                            style={[{paddingVertical:5,paddingHorizontal:10,borderRadius:11,borderWidth: 1,borderColor:'#e5781c',marginLeft:17},item.status==5?{borderColor:'#e4e4e4'}:{}]}>
                            <ASText text={item.status==5?'已评价':item.status==4?'评价':''} numberOfLines={1} style={[{fontSize:12,color:'#e5781c'},item.status==5?{color:'#e4e4e4'}:{}]}/>
                        </ASTouchableOpacity>:null}
                    </View>:null}
                    {showJiesuan?<View style={{flexDirection:'row',paddingVertical:18,alignItems:'center',justifyContent:'flex-end',paddingRight:16}}>
                        <ASTouchableOpacity style={{paddingVertical:5,paddingHorizontal:10,borderRadius:11,borderWidth: 1,borderColor:'#959595',}} onPress={()=>{this.onPressJiesuan(item,index)}}>
                            <ASText text={'结算'} numberOfLines={1} style={{fontSize:12,color:'#959595'}}/>
                        </ASTouchableOpacity>
                    </View>:null}
                </View>
            </ASTouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'jifen'+index
    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    ItemSeparatorComponent={({item,index})=>{return(<View style={{height:10,backgroundColor:colors.BackPage}}></View>)}}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
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
                    extraData={this.state}
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
                <Modal animationType={'slide'}
                       onRequestClose={()=>{}}
                       visible={this.state.visible}
                       transparent={true}
                >
                    <ASTouchableOpacity style={{flex:1,justifyContent:'center',paddingHorizontal:50,backgroundColor:'rgba(0,0,0,0.3)'}} onPress={()=>{
                        this.setState({
                            visible:false
                        })
                    }}>
                        <View style={{backgroundColor:'white',borderRadius:6}}>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:45,borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:colors.LINE}}>
                                <ASText text={'整体评价'} style={{color:'#3d3d3d',fontSize:12}}></ASText>
                                <View style={{flexDirection:'row',marginLeft:19}}>
                                    <ASTouchableOpacity style={{width:15,height:15}} onPress={()=>{this.setState({
                                        star:1
                                    })}}>
                                         <Image source={this.state.star>=1?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:15,height:15}}/>
                                    </ASTouchableOpacity>
                                    <ASTouchableOpacity style={{width:15,height:15,marginLeft:6}} onPress={()=>{this.setState({
                                        star:2
                                    })}}>
                                        <Image source={this.state.star>=2?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:15,height:15}}/>
                                    </ASTouchableOpacity>
                                    <ASTouchableOpacity style={{width:15,height:15,marginLeft:6}} onPress={()=>{this.setState({
                                        star:3
                                    })}}>
                                        <Image source={this.state.star>=3?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:15,height:15}}/>
                                    </ASTouchableOpacity>
                                    <ASTouchableOpacity style={{width:15,height:15,marginLeft:6}} onPress={()=>{this.setState({
                                        star:4
                                    })}}>
                                        <Image source={this.state.star>=4?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:15,height:15}}/>
                                    </ASTouchableOpacity>
                                    <ASTouchableOpacity style={{width:15,height:15,marginLeft:6}} onPress={()=>{this.setState({
                                        star:5
                                    })}}>
                                        <Image source={this.state.star>=5?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:15,height:15}}/>
                                    </ASTouchableOpacity>
                                </View>
                            </View>
                            <View style={{paddingHorizontal:10,marginTop:8}}>
                                <View style={{height:110,borderRadius:6,borderWidth:colors.width_1_PixelRatio,borderColor:colors.LINE}}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholder={'来说说宝贝的优点和美中不足的地方吧…'}
                                        placeholderTextColor={'#dddddd'}
                                        value = {this.state.account}
                                        onChangeText={(text)=>this.setState({pinjia:text})}
                                        multiline={true}
                                    />
                                </View>
                            </View>
                            <View style={{paddingVertical:12,justifyContent:'center',alignItems:'center'}}>
                                <ASTouchableOpacity style={{paddingHorizontal:10,paddingVertical:6,borderRadius:11,backgroundColor:'#e3782c'}} onPress={()=>{this.onPressPinjiaBtn()}}>
                                    <ASText text={'提交评价'} style={{color:'white',fontSize:12}}></ASText>
                                </ASTouchableOpacity>
                            </View>
                        </View>
                    </ASTouchableOpacity>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.BackPage
    },
    cellView:{
        backgroundColor:colors.WHITE,
        justifyContent:'center',
        paddingHorizontal:11,
        paddingVertical:14
    },
    jfView:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    inputStyle:{
        fontSize:12,
        color:'#3d3d3d',
        padding:0,
        flex:1,
        height:100,
        paddingHorizontal:6,
        textAlignVertical:'top'
    }
});
