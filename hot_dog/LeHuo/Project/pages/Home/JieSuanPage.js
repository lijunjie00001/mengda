import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput, Platform, Linking, AppState, Keyboard, Alert,
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import ASText from '../../components/ASText';
import { width} from "../../../Resourse/CommonUIStyle";
import *as Wechat from 'react-native-wechat'
import Toast from "@remobile/react-native-toast";
import Strings from '../../../Resourse/StringUtil'
import Url from "../../../Resourse/url";
import CommonPicker from "../../../Resourse/CommonPicker";
import TimePicker from "../../../Resourse/TimePicker";
@containers()
export default class JieSuanPage extends Component{
    static propTypes = {
        orderId:React.PropTypes.string,
        orderNum:React.PropTypes.string,
        isOrder:React.PropTypes.bool,
        is_discount:React.PropTypes.string,
        no_discount_price:React.PropTypes.string, //没有参与折扣的
        total_price:React.PropTypes.string, //总价格
        totalPrice:React.PropTypes.string,  //实付
        zhekou:React.PropTypes.string, //折扣
        isHotel:React.PropTypes.bool,
    };
    static defaultProps = {
        orderId:'',
        orderNum:'',
        isHotel:false,
    };
    constructor(props){
        super(props)
        let zhekou=this.props.zhekou?this.props.zhekou=='0.0'?'10':this.props.zhekou:'10'
        let isSlect=true
        if(this.props.isOrder){
            if(this.props.total_price==this.props.totalPrice){
                isSlect=false
            }
        }
        this.isclick=false
        this.state={
            price:this.props.total_price?this.props.total_price:'',
            buPrice:this.props.no_discount_price?this.props.no_discount_price:'',
            zhekou:zhekou,
            isSlect:isSlect,
            shifu:this.props.totalPrice?this.props.totalPrice:'',//
            isOrder:this.props.isOrder?this.props.isOrder:false,  //是否从订单页面而来
            uid:this.props.uid?this.props.uid:'',
            oid:this.props.oid?this.props.oid:'',
            orderNum:this.props.orderNum?this.props.orderNum:'',
            orderId:this.props.orderId?this.props.orderId:''
        }
        this.payZhunbei=this.payZhunbei.bind(this)
        this.becomeActive=this.becomeActive.bind(this)
    }
    componentDidMount() {
        this.props.setContainer(this, {
            title:this.state.isOrder? '结算':'确认订单',
        });
       this.change=AppState.addEventListener('change', this.becomeActive);
    }
    componentWillUnmount(){
        if(this.change){
            this.change.remove();
        }
    }
    /**
     *@desc   切换回来
     *@author 张羽
     *@date   2019-10-20 23:08
     *@param
     */
    becomeActive(){
        if( this.isclick&&this.state.orderNum){
            if(AppState.currentState==='active'){
                this.props.replace('OrderDetails',{uid:this.props.uid,orderNum:this.state.orderNum})
            }
        }
    }
    /**
     *@desc   接口
     *@author 张羽
     *@date   2019-09-12 04:01
     *@param
     */
    payZhunbei(isweixin){
        this.props.fetchData(this, '', Url.setOrderWaitSettle(this.state.uid,this.state.oid), {}, successCallback = (data) => {
            console.log('............待支付',data)
            this.isclick=true
            if(isweixin){
                Wechat.openWXApp()
            }else{
                let url='alipays://platformapi/startapp?appId=20000008'
                Linking.openURL(url).catch(e => console.warn(e));
            }
            return;
        }, failure = (data) => {
            // Toast.showShortCenter(data.notice)
            if(isweixin){
                Wechat.openWXApp()
            }else{
                let url='alipays://platformapi/startapp?appId=20000008'
                Linking.openURL(url).catch(e => console.warn(e));
            }
        });
    }

    /**
     *@desc   确认订单
     *@author 张羽
     *@date   2019-10-31 14:29
     *@param
     */
    onPressSureOrder(){
        if(!this.state.shifu){
            Alert.alert('提示','请输入正确的价格',[{text:'确定',style:'cancel'}]);
            return ;
        }
        let param ={
            uid:this.props.uid,
            bid:this.props.bid,
            discount_price:this.state.shifu?this.state.shifu:'0.00',
            total_price:this.state.price?this.state.price:'0.00',
            no_discount_price:this.state.buPrice?this.state.buPrice:'0.00',
            is_dicount:this.state.isSlect?'1':'0',
        }
        this.props.fetchData(this, '', Url.createOrderOfBusinessv2(param), {}, successCallback = (data) => {
            this.setState({
                orderNum:data.info.orderNum
            },()=>{
                this.props.replace('OrderDetails',{uid:this.props.uid,orderNum:this.state.orderNum})
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{marginLeft: 12,width:width-24,marginTop: 16,
                    backgroundColor: 'white',borderRadius:10,justifyContent: 'space-between',alignItems:'center',height:36,paddingHorizontal: 12,flexDirection:'row'}}>
                    <ASText text={'消费金额'} style={{fontSize:16,color:'#3d3d3d',fontWeight:'bold'}}/>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder={'询问服务员后输入'}
                        value = {this.state.price}
                        editable={this.state.isOrder?false:true}
                        onChangeText={(text)=>{
                            if(Strings.checkPrice(text)){
                                let buPrice=''
                                let shifu=''
                                if(this.state.buPrice){
                                    let newprice=parseFloat(text)-parseFloat(this.state.buPrice)
                                    if(newprice<0){
                                        buPrice=''
                                        shifu=parseFloat(text)
                                        if(this.state.isSlect){
                                            shifu=parseFloat(shifu*this.state.zhekou*0.1).toFixed(2)
                                        }
                                    }else{
                                        buPrice=this.state.buPrice
                                        shifu=text
                                        if(this.state.isSlect){
                                            shifu=parseFloat(newprice*this.state.zhekou*0.1)+parseFloat(buPrice)
                                            shifu=parseFloat(shifu).toFixed(2)
                                        }
                                    }
                                }else{
                                    shifu=parseFloat(text)
                                    if(this.state.isSlect){
                                        shifu=parseFloat(shifu*this.state.zhekou*0.1).toFixed(2)
                                    }
                                }
                                this.setState({
                                    price:text,
                                    buPrice:buPrice,
                                    shifu:shifu
                                })
                            }else if(text==''){
                                this.setState({
                                    price:text,
                                })
                            }
                        }}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={{marginLeft:12,marginTop:11}}>
                    <ASText text={'输入不参与优惠金额(如酒水、套餐)'} style={{fontSize:12,color:'#dcc490'}}/>
                </View>
                <View style={{marginLeft: 12,width:width-24,marginTop: 13,backgroundColor: 'white',borderRadius:10,flexDirection:'row',
                    justifyContent: 'space-between',alignItems:'center',height:36,paddingHorizontal: 12}}>
                    <ASText text={'不参与优惠金额：'} style={{fontSize:16,color:'#3d3d3d',fontWeight:'bold'}}/>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        placeholder={'询问服务员后输入'}
                        value = {this.state.buPrice}
                        editable={this.state.isOrder?false:true}
                        onChangeText={(text)=>{
                            if(Strings.checkPrice(text)){
                                let price=this.state.price
                                let shifu=this.state.shifu
                                if(this.state.price){
                                    let newprice=parseFloat(this.state.price)-parseFloat(text)
                                    if(newprice<0){
                                        Toast.showShortCenter('不参与的优惠金额小于消费金额')
                                        return
                                    }else{
                                        price=this.state.price
                                        shifu=this.state.price
                                        if(this.state.isSlect){
                                            shifu=parseFloat(newprice*this.state.zhekou*0.1)+parseFloat(text)
                                            shifu=parseFloat(shifu).toFixed(2)
                                        }
                                    }
                                }else{
                                   return;
                                }
                                this.setState({
                                    price:price,
                                    buPrice:text,
                                    shifu:shifu
                                })
                            }else if(text==''){
                                this.setState({
                                    buPrice:text,
                                })
                            }
                        }}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={{marginTop: 13,backgroundColor: 'white',justifyContent: 'space-between',flexDirection:'row',
                    alignItems:'center',height:40,paddingHorizontal: 12}}>
                    <ASText text={this.state.zhekou=='10'?'暂无折扣':(this.state.zhekou+'折')} style={{fontSize:16,color:'#3d3d3d',fontWeight:'bold'}}/>
                    <ASTouchableOpacity disabled={this.state.isOrder?true:false}
                        style={{justifyContent: 'center',}} onPress={() => {
                        this.setState({
                            isSlect:!this.state.isSlect
                        },()=>{
                            let shifu=this.state.shifu
                            if(this.state.isSlect){
                                let newprice=parseFloat(this.state.price)-parseFloat(this.state.buPrice)
                                shifu=parseFloat(newprice*this.state.zhekou*0.1)+parseFloat(this.state.buPrice)
                                shifu=parseFloat(shifu).toFixed(2)
                            }else{
                                shifu=this.state.price
                            }
                            this.setState({
                                shifu:shifu
                            })
                        })
                    }}>
                        <Image
                            source={this.state.isSlect ? require('../../images/my/collectionSlect.png') : require('../../images/my/collection.png')}
                            style={{width: 20, height: 20}}/>
                    </ASTouchableOpacity>
                </View>
                <View style={{marginTop: 13,backgroundColor: 'white',justifyContent: 'space-between',flexDirection:'row',
                    alignItems:'center',height:40,paddingHorizontal: 12}}>
                    <ASText text={'实付金额'} style={{fontSize:14,color:'#3d3d3d'}}/>
                    <ASText text={'¥'+this.state.shifu} style={{fontSize:18,color:'#e27120'}}/>
                </View>
                <View style={{flex:1,backgroundColor:'white',paddingHorizontal:12,paddingTop: 16,marginTop:13}}>
                    {this.state.isOrder?<ASTouchableOpacity style={{width:width-24,height:36,justifyContent:'center',alignItems:'center',backgroundColor:'#53b538',borderRadius:10}} onPress={() => {
                        Wechat.isWXAppInstalled()
                            .then((isInstalled) => {
                                if (isInstalled) {
                                    //发送授权请求
                                    if (this.isclick) {
                                        Wechat.openWXApp()
                                    } else {
                                        this.payZhunbei(true)
                                    }
                                } else {
                                    Toast.showShortCenter('您还没安装微信')
                                }
                            })
                    }}>
                        <ASText text={'微信买单'} style={{fontSize:16,color:'#FFF',fontWeight:'bold'}}/>
                    </ASTouchableOpacity>:null}
                    {this.state.isOrder?<ASTouchableOpacity style={{width:width-24,height:36,justifyContent:'center',alignItems:'center',backgroundColor:'#01a1ec',marginTop:13,borderRadius:10}} onPress={()=>{
                        let url=Platform.OS == 'android'?'alipays://platformapi/startapp?appId=20000056':'alipay://platformapi/startapp?appId=20000056'
                        Linking.canOpenURL(url).then(supported => {
                            if (!supported) {
                                console.log('Can\'t handle url: ' + url);
                                Toast.showShortCenter('您还未安装支付宝')
                            } else {
                                if(this.isclick){
                                    let url='alipays://platformapi/startapp?appId=20000008'
                                    Linking.openURL(url).catch(e => console.warn(e));
                                }else {
                                    this.payZhunbei(false)
                                }
                            }
                        }).catch(err => console.error('An error occurred', err));
                    }}>
                        <ASText text={'支付宝买单'} style={{fontSize:16,color:'#FFF',fontWeight:'bold'}}/>
                    </ASTouchableOpacity>:null}
                    {this.state.isOrder?null:<ASTouchableOpacity style={{width:width-24,height:36,justifyContent:'center',alignItems:'center',backgroundColor:'#53b538',borderRadius:10}} onPress={()=>{
                        this.onPressSureOrder()
                    }}>
                        <ASText text={'确认订单'} style={{fontSize:16,color:'#FFF',fontWeight:'bold'}}/>
                    </ASTouchableOpacity>}
                    <ASText text={this.state.isOrder? '买单仅限于到店支付，请确认金额后提交':'确认订单后去订单结算'} style={{fontSize:12,color:'#3d3d3d',marginTop:10}}/>
                </View>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.BackPage
    },
    inputStyle:{
        padding:0,
        fontSize: 13,
        color:'#d8d8d8',
        width:150,
        textAlign:'right'
    }
})
