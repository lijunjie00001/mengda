import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList, Alert, AsyncStorage,Image,ScrollView,NativeModules,DeviceEventEmitter,Platform
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import Images from "../../../Resourse/Images";
import * as WeChat from 'react-native-wechat';
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
var  Pay;
Platform.OS === 'ios' ?Pay=NativeModules.Pay:Pay=NativeModules.PayModule;
@containers()
export default class VipPayDetails extends Component{
    static propTypes = {
        item:React.PropTypes.object,
    }
    constructor(props){
        super(props)
        this.state={
            pay:'wechat',
            payNumber:1,
            price:this.props.item.price?this.props.item.price:'',
            oneDiscont:10,
            twooneDiscont:10,
            threeoneDiscont:10,
            fouroneDiscont:10,
            zhekouArray:[],
            onePrice:'',
            twoPrice:'',
            threePrice:'',
            fourPrice:'',
            id:''
        }
        this.getzhekou=this.getzhekou.bind(this)
    }
    componentWillUnmount(){
        this.payResult.remove();
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'购买会员',
        });
        this.payResult = DeviceEventEmitter.addListener('payInfo', (data) => {
            console.log('..........支付', data)
            if (Platform.OS === 'ios') {
                if (data.resultStatus === '9000') {
                    Toast.showShortCenter('支付成功')
                    this.props.replace('VipSuccessPage',{item:this.props.item})
                } else {
                    Toast.showShortCenter('支付失败')
                }
            } else {
                if (data === '9000') {
                    Toast.showShortCenter('支付成功')
                    this.props.replace('VipSuccessPage',{item:this.props.item})
                } else {
                    Toast.showShortCenter('支付失败')
                }
            }
        })
        this.getzhekou()
    }

    /**
     *@desc   获取折扣字段
     *@author 张羽
     *@date   2019-09-12 19:26
     *@param
     */
    getzhekou(){
        this.props.fetchData(this, '', Url.vipMonthList(), {}, successCallback = (data) => {
            console.log('............折扣',data)
            let array=Array.isArray(data.info)?data.info:[]
            let oneDiscont=array.length>=0?array[0].discount?array[0].discount:10:10
            let twooneDiscont=array.length>=1?array[1].discount?array[1].discount:10:10
            let threeoneDiscont=array.length>=2?array[2].discount?array[2].discount:10:10
            let fouroneDiscont=array.length>=3?array[3].discount?array[3].discount:10:10
            let price=parseFloat(this.state.price)
            let id=array.length>=0?array[0].id?array[0].id:'':''
            this.setState({
                oneDiscont:oneDiscont,
                twooneDiscont:twooneDiscont,
                threeoneDiscont:threeoneDiscont,
                fouroneDiscont:fouroneDiscont,
                onePrice:parseFloat(oneDiscont*1*0.1*price).toFixed(2),
                twoPrice:parseFloat(twooneDiscont*3*0.1*price).toFixed(2),
                threePrice:parseFloat(threeoneDiscont*6*0.1*price).toFixed(2),
                fourPrice:parseFloat(fouroneDiscont*12*0.1*price).toFixed(2),
                price:parseFloat(oneDiscont*1*0.1*price).toFixed(2),
                id:id,
                zhekouArray:data.info
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   支付
     *@author 张羽
     *@date   2019/2/21 上午10:39
     *@param
     */
    onPressPay(){
        let param={
            uid:this.props.uid,
            vid:this.props.item.id,
            isMortgage:0,
            payType:this.state.pay==='wechat'?'1':'2',
            mid:this.state.id
        }
        this.props.fetchData(this, '', Url.createOrderOfVip(param), {}, successCallback = (data) => {
            console.log('............支付',data)
            if(this.state.pay==='wechat'){
                //微信
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                                console.log('.........微信支付',data)
                                let payinfo=data.info.payInfo
                                let parm={
                                    partnerId:payinfo.partnerid,//商家向财付通申请的商家id
                                    prepayId: payinfo.prepayid,   // 预支付订单
                                    nonceStr: payinfo.noncestr,   // 随机串，防重发
                                    timeStamp: payinfo.timestamp+'',            // 时间戳，防重发
                                    package: payinfo.package,    // 商家根据财付通文档填写的数据和签名
                                    sign: payinfo.sign        // 商家根据微信开放平台文档对数据做的签名
                                }
                                console.log('.........微信支付',parm)
                                WeChat.pay(parm).then((data)=>{
                                    console.log('......data',data)
                                    if(data.errCode==0){
                                        //支付成功
                                        this.props.replace('VipSuccessPage',{item:this.props.item})
                                    }
                                },(error)=>{
                                    Toast.showShortCenter('支付失败')
                                })
                            }
                        else {
                            Toast.showShortCenter('您还没安装微信')
                        }
                    })
            }else{
                let payinfo=data.info.payInfo
                Pay.AliPay(payinfo)
            }
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    render(){
        let danjia=this.props.item.price?this.props.item.price:0
        let newdanjia=parseFloat(danjia)
        return(
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1}}>
                        <View style={{paddingVertical:31,alignItems:'center'}}>
                            <BImage
                                style={{width:255,height:150}}
                                resizeMode={'contain'}
                                source={{uri:this.props.item.cover?this.props.item.cover:''}}/>
                        </View>
                        <View style={{backgroundColor:'white',paddingHorizontal:11,paddingBottom:10}}>
                            <View style={{paddingTop: 10,flex:1}}>
                                <ASTouchableOpacity onPress={()=>{
                                    this.setState({
                                        payNumber:1,
                                        price:this.state.onePrice,
                                        id:this.state.zhekouArray.length>=0?this.state.zhekouArray[0].id:''
                                    })
                                }}
                                    style={[{width:width-22,flexDirection:'row',paddingLeft:17,paddingRight:11,alignItems:'center',
                                    borderWidth:colors.width_1_PixelRatio,borderColor:'#f2cb62',justifyContent:'space-between',paddingVertical:13},this.state.payNumber==1?{backgroundColor:'#f2cb62'}:{}]}>
                                    <ASText style={{fontSize:15,color:'#181c1e'}} text={'30天会员'}></ASText>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <View style={{width:50}}>
                                            <ASText style={{fontSize:15,color:'#181c1e'}} text={'¥'+this.state.onePrice}></ASText>
                                        </View>
                                        <View style={{paddingHorizontal:14,paddingVertical:3,borderRadius:11,backgroundColor:'#434343',marginLeft:12}}>
                                            <ASText style={{fontSize:13,color:'#ffffff'}} text={'开通'}></ASText>
                                        </View>
                                    </View>
                                </ASTouchableOpacity>
                            </View>
                            <View style={{paddingTop: 10,flex:1}}>
                                <ASTouchableOpacity onPress={()=>{
                                    this.setState({
                                        payNumber:3,
                                        price:this.state.twoPrice,
                                        id:this.state.zhekouArray.length>=1?this.state.zhekouArray[1].id:''
                                    })
                                }}
                                    style={[{width:width-22,flexDirection:'row',paddingLeft:17,paddingRight:11,alignItems:'center',
                                    borderWidth:colors.width_1_PixelRatio,borderColor:'#f2cb62',justifyContent:'space-between',paddingVertical:13},this.state.payNumber==3?{backgroundColor:'#f2cb62'}:{}]}>
                                    <ASText style={{fontSize:15,color:'#181c1e'}} text={'90天会员'}></ASText>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <View style={{width:50}}>
                                            <ASText style={{fontSize:15,color:'#181c1e'}} text={'¥'+this.state.twoPrice}></ASText>
                                             <ASText text={'¥'+parseFloat(newdanjia*3).toFixed(2)} style={{fontSize:12,color:'#9d9d9d',
                                                marginTop: 2,textDecorationLine:'line-through'}}></ASText>
                                        </View>
                                        <View style={{paddingHorizontal:14,paddingVertical:3,borderRadius:11,backgroundColor:'#434343',marginLeft:12}}>
                                            <ASText style={{fontSize:13,color:'#ffffff'}} text={'开通'}></ASText>
                                        </View>
                                    </View>
                                </ASTouchableOpacity>
                            </View>
                            <View style={{paddingTop: 10,flex:1}}>
                                <ASTouchableOpacity  onPress={()=>{
                                    this.setState({
                                        payNumber:6,
                                        price:this.state.threePrice,
                                        id:this.state.zhekouArray.length>=2?this.state.zhekouArray[2].id:''
                                    })
                                }}
                                    style={[{width:width-22,flexDirection:'row',paddingLeft:17,paddingRight:11,alignItems:'center',
                                    borderWidth:colors.width_1_PixelRatio,borderColor:'#f2cb62',justifyContent:'space-between',paddingVertical:13},this.state.payNumber==6?{backgroundColor:'#f2cb62'}:{}]}>
                                    <ASText style={{fontSize:15,color:'#181c1e'}} text={'6个月会员'}></ASText>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <View style={{width:50}}>
                                            <ASText style={{fontSize:15,color:'#181c1e'}} text={'¥'+this.state.threePrice}></ASText>
                                            <ASText text={'¥'+parseFloat(newdanjia*6).toFixed(2)} style={{fontSize:12,color:'#9d9d9d',
                                                marginTop: 2,textDecorationLine:'line-through'}}></ASText>
                                        </View>
                                        <View style={{paddingHorizontal:14,paddingVertical:3,borderRadius:11,backgroundColor:'#434343',marginLeft:12}}>
                                            <ASText style={{fontSize:13,color:'#ffffff'}} text={'开通'}></ASText>
                                        </View>
                                    </View>
                                </ASTouchableOpacity>
                            </View>
                            <View style={{paddingTop: 10,flex:1}}>
                                <ASTouchableOpacity onPress={()=>{
                                    this.setState({
                                        payNumber:12,
                                        price:this.state.fourPrice,
                                        id:this.state.zhekouArray.length>=3?this.state.zhekouArray[3].id:''
                                    })
                                }}
                                    style={[{width:width-22,flexDirection:'row',paddingLeft:17,paddingRight:11,alignItems:'center',
                                    borderWidth:colors.width_1_PixelRatio,borderColor:'#f2cb62',justifyContent:'space-between',paddingVertical:13},this.state.payNumber==12?{backgroundColor:'#f2cb62'}:{}]}>
                                    <ASText style={{fontSize:15,color:'#181c1e'}} text={'一年会员'}></ASText>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <View style={{width:50}}>
                                            <ASText style={{fontSize:15,color:'#181c1e'}} text={'¥'+this.state.fourPrice}></ASText>
                                            <ASText text={'¥'+parseFloat(newdanjia*12).toFixed(2)} style={{fontSize:12,color:'#9d9d9d',
                                                marginTop: 2,textDecorationLine:'line-through'}}></ASText>
                                        </View>
                                        <View style={{paddingHorizontal:14,paddingVertical:3,borderRadius:11,backgroundColor:'#434343',marginLeft:12}}>
                                            <ASText style={{fontSize:13,color:'#ffffff'}} text={'开通'}></ASText>
                                        </View>
                                    </View>
                                </ASTouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginLeft:17,height:1,width:width-28,backgroundColor:colors.BackPage}}></View>
                        <View style={[styles.discountListView]}>
                            <View style={{paddingBottom:15}}>
                                <ASText style={{fontSize:16,color:colors.CHATTEXT,marginLeft:11}} text={'会员权益：'}></ASText>
                            </View>
                            {this.props.item.couponArray?this.props.item.couponArray.map((item,i)=>{
                                return (
                                    <View  key={i} style={{paddingBottom:5,paddingHorizontal:19}}>
                                        <ASText
                                            numberOfLines={1}
                                            style={{fontSize:11,color:colors.CHATTEXT}} text={(i+1)+'、'+item.num+'张'+item.name}>
                                        </ASText>
                                    </View>
                                )
                            }):null}
                            <View style={{marginTop:10,paddingHorizontal:19}}>
                                <ASText style={{fontSize:11,color:colors.CAED}} text={this.props.item.shuoming}></ASText>
                            </View>
                        </View>
                        <ASTouchableOpacity onPress={()=>{this.setState({pay:'wechat'})}}
                                            style={{backgroundColor:colors.WHITE,marginTop:10,flexDirection:'row',paddingLeft:35,paddingRight:29,paddingVertical:18,justifyContent:'space-between',alignItems:'center',borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={Images.Vip_wexin} style={{width:27,height:22}}/>
                                <ASText style={{fontSize:17,color:colors.CHATTEXT,marginLeft:25}} text={'微 信 支 付'}></ASText>
                            </View>
                            <Image source={this.state.pay=='wechat'?Images.Vip_pay_slect:Images.Vip_pay_noSlect} style={{width:16,height:16}}/>
                        </ASTouchableOpacity>
                        <ASTouchableOpacity onPress={()=>{this.setState({pay:'alipay'})}}
                                            style={{backgroundColor:colors.WHITE,marginTop:10,flexDirection:'row',paddingLeft:35,paddingRight:29,paddingVertical:18,justifyContent:'space-between',alignItems:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={Images.Vip_alipay} style={{width:27,height:22}}/>
                                <ASText style={{fontSize:17,color:colors.CHATTEXT,marginLeft:25}} text={'支 付 宝 支 付'}></ASText>
                            </View>
                            <Image source={this.state.pay=='alipay'?Images.Vip_pay_slect:Images.Vip_pay_noSlect} style={{width:16,height:16}}/>
                        </ASTouchableOpacity>
                    </View>
                </ScrollView>
                <ASTouchableOpacity style={styles.btnView} onPress={()=>{this.onPressPay()}}>
                    <ASText style={{fontSize:16,color:colors.WHITE}} text={'¥ '+this.state.price+'元  立即支付'}></ASText>
                </ASTouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
    },
    discountListView:{
        width:'100%',
        backgroundColor:'white',
        paddingVertical:15
    },
    btnView:{
        height:50,
        backgroundColor:colors.CHATBUDDLE,
        justifyContent:'center',
        alignItems:'center'
    },
});
