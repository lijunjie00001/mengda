import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Platform, FlatList, Dimensions, ScrollView, DeviceEventEmitter, NativeModules,
    PixelRatio,Keyboard
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
// import  DeviceInfo from 'react-native-device-info';
// const device = DeviceInfo.getDeviceName();
// const statusBarHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
const statusBarHeight=0
const BACK_ITEM_IMAGE = require ('../../images/common/top_arrow.png');
import NewHTMLView from 'react-native-render-html'
import Swiper from 'react-native-swiper'
import BImage from '../../components/BImage'
import * as WeChat from 'react-native-wechat';
import VipDetailsListPaySuccess from "./VipDetailsPaySuccessPage";
import StringUtils from '../../../Resourse/StringUtil'
var  Pay;
Platform.OS === 'ios' ?Pay=NativeModules.Pay:Pay=NativeModules.PayModule;
import ASText from '../../components/ASText'
@containers()
export default class VipListDetailsPage extends Component{
    static propTypes = {
        uid:React.PropTypes.string,
        id:React.PropTypes.string,
    }
    constructor(props){
        super(props)
        this.getH5data=this.getH5data.bind(this)
        this.getAddress=this.getAddress.bind(this)
        this.panduanji=this.panduanji.bind(this)
        this.perPage=10
        this.page=1
        this.keyborad=false
        this.state={
            uid:'',
            data:[],
            number:1,
            pay:'wechat',
            isCollection:false,
            cate:'',
            carousel:[],
            goodsName:'',
            price:'',
            norms:[],//规格数组
            tolalPrice:'',
            currentName:'',
            currentId:'',
            currentPrice:'',
            showNorms:false,
            addressList:[],
            addressItem:{},
            guigeName:'选择规格',
            guigeId:'',
            H5:'',
            showJifen:true,//是否显示积分页面,
            jifenText:'',
            useIntegral:1,//是否使用积分
            guigeItem:{},//规格item
            btnTitle:'立即支付',
            jifenNum:'',
            myJifen:'',
            jifenbili:''  //积分比例
        }
    }
    componentWillUnmount(){
        this.payResult.remove();
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'详情',
            hiddenNav:true
        });
        this.getData()
        this.getH5data()
        this.getAddress()
        this.getJifen()
        this.getJifenbili()
        this.payResult = DeviceEventEmitter.addListener('payInfo', (data) => {
            console.log('..........支付', data)
            if (Platform.OS === 'ios') {
                if (data.resultStatus === '9000') {
                    Toast.showShortCenter('支付成功')
                    this.props.push('VipDetailsListPaySuccess')
                } else {
                    Toast.showShortCenter('支付失败')
                }
            } else {
                if (data === '9000') {
                    Toast.showShortCenter('支付成功')
                    this.props.push('VipDetailsListPaySuccess')
                } else {
                    Toast.showShortCenter('支付失败')
                }
            }
        })
    }

    /**
     *@desc   获取积分比例
     *@author 张羽
     *@date   2019-10-17 23:48
     *@param
     */
    getJifenbili(){
        this.props.fetchData(this, '', Url.getJifenbili(), {}, successCallback = (data) => {
            console.log('........获取积分比例',data.info)
            // this.setState({
            //     myJifen:data.info.integral
            // })
            return;
        }, failure = (data) => {
            this.jifenbili=data.info
            this.setState({
                jifenbili:data.info
            })

        });
    }
    /**
     *@desc   获取积分
     *@author 张羽
     *@date   2019-09-12 22:09
     *@param
     */
    getJifen(){
        this.props.fetchData(this, '', Url.getUserInfoForApi(this.props.uid), {}, successCallback = (data) => {
            console.log('........积分',data.info)
            this.setState({
                myJifen:data.info.integral
            })
            return;
        }, failure = (data) => {
        });
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/18 下午5:03
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.goodsDetail(this.props.id,this.props.uid), {}, successCallback = (data) => {
            console.log('............详情',data)
            this.setState({
                cate:data.info.cate,
                carousel:data.info.carousel,
                goodsName:data.info.goodsName,
                norms:data.info.norms,
                price:data.info.price,
                tolalPrice:data.info.price,
                guigeId:data.info.norms.length==1?data.info.norms[0].id:'',
                guigeItem:data.info.norms.length==1?data.info.norms[0]:'',
            },()=>{
                if(data.info.norms.length==1){
                    //一个规格的情况下
                    let obj=data.info.norms[0]
                    let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0
                    let deductionPrice=this.state.guigeItem.deductionPrice?parseFloat(this.state.guigeItem.deductionPrice):0
                    let btnTitle=''
                    // if(this.state.useIntegral){
                    //     let newtitle=parice*this.state.number-(parice-deductionPrice)
                    //     btnTitle='¥'+newtitle+'元'+'+'+this.state.guigeItem.integral+'积分'+'   立即支付'
                    // }else{
                        let newtitle=parice*this.state.number
                        btnTitle='¥'+newtitle+'元'+'   立即支付'
                    // }
                    this.setState({
                        showJifen:true,
                        jifenText:'最多可使用'+this.state.guigeItem.integral+'积分抵用'+(parice-deductionPrice)+'元',
                        btnTitle:btnTitle
                    })
                }
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    /**
     *@desc   判断使用的积分可够
     *@author 张羽
     *@date   2019-09-12 05:03
     *@param
     */
    panduanji(jifen){
        this.props.fetchData(this, '', Url.canUserIntegral(this.props.uid,jifen), {}, successCallback = (data) => {
            console.log('............积分',data)
            let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0
            let deductionPrice=this.state.guigeItem.deductionPrice?parseFloat(this.state.guigeItem.deductionPrice):0
            let btnTitle=''
            // if(this.state.useIntegral){
            //     let newtitle=parice*this.state.number-(parice-deductionPrice)
            //     btnTitle='¥'+newtitle+'元'+'+'+this.state.guigeItem.integral+'积分'+'   立即支付'
            // }else{
                let newtitle=parice*this.state.number
                btnTitle='¥'+newtitle+'元'+'   立即支付'
            // }
            this.setState({
                showJifen:true,
                jifenText:'可使用'+this.state.guigeItem.integral+'积分抵用'+(parice-deductionPrice)+'元',
                btnTitle:btnTitle
            })
            return;
        }, failure = (data) => {

        });
    }
    /**
     *@desc   点击支付
     *@author 张羽
     *@date   2019/2/21 下午1:46
     *@param
     */
    onPressPay(){
        if(this.keyborad){
            Keyboard.dismiss()
            return;
        }
        if(this.state.jifenNum.length>0){
            if(StringUtils.checkZnumber(this.state.jifenNum)){
                if(parseInt(this.state.jifenNum)%parseInt(this.state.jifenbili)==0){

                }else{
                    Alert.alert('提示',' 请输入'+this.state.jifenbili+'的整数倍积分',[{text:'确定',style:'cancel'}]);
                    return ;
                }
            }else{
                Alert.alert('提示',' 请输入正确的积分',[{text:'确定',style:'cancel'}]);
                return ;
            }
        }
        if(!this.state.addressItem.id){
            Alert.alert('提示','请选择地址',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.guigeId){
            Alert.alert('提示','请选择规格',[{text:'确定',style:'cancel'}]);
            return ;
        }
        let param={
            uid:this.props.uid,
            aid:this.state.addressItem.id,
            gnid:this.state.guigeId,
            goodsNum:this.state.number,
            payType:this.state.pay==='wechat'?'1':'2',
            useIntegral:this.state.jifenNum
        }
        this.props.fetchData(this, '', Url.createOrderOfGoods(param), {}, successCallback = (data) => {
            console.log('............H5详情',data)
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
                                    this.props.push('VipDetailsListPaySuccess')
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
    /**
     *@desc   获取富文本数据
     *@author 张羽
     *@date   2019/1/17 下午1:47
     *@param
     */
    getH5data(){
        this.props.fetchData(this, '', Url.getGoodsDescription(this.props.id), {}, successCallback = (data) => {
            console.log('............H5详情',data)
            this.setState({
                H5:data.info
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取地址
     *@author 张羽
     *@date   2019/2/21 上午12:09
     *@param
     */
    getAddress(){
        console.log('........this.props.id',this.props.id)
        this.props.fetchData(this, '', Url.addressList(this.props.uid), {}, successCallback = (data) => {
            console.log('.......地址',data)
            this.setState({
                addressList:data.info,
                addressItem:data.info.length>0?data.info[0]:{}
            })
            return;
        }, failure = (data) => {
            console.log('.......地址',data)
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   选择规格
     *@author 张羽
     *@date   2019/1/29 下午3:09
     *@param
     */
    onPressNorms(){
        this.setState({
            showNorms:true
        })
    }
    /**
     *@desc   选择地址
     *@author 张羽
     *@date   2019/2/21 上午12:16
     *@param
     */
    onPressSlectAddress(){
        this.props.push('AddressListPage',{uid:this.props.uid,select:true,successBack:(item)=>{
            this.setState({
                addressItem:item,
                addressList:['1']
            })
        }})
    }
    /**
     *@desc   收藏
     *@author 张羽
     *@date   2018/12/23 下午3:48
     *@param
     */
    onPressCollection(){
        //商ping
        this.props.fetchData(this, '', Url.collect(this.props.uid,'2',this.props.id,''), {}, successCallback = (data) => {
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
                            text = {'购买'}
                            numberOfLines = {1}
                            style = {[styles.titleTextStyle]}/>
                    </View>
                    <ASTouchableOpacity style={styles.rightView} onPress={()=>{this.onPressCollection()}}>
                        <Image
                            style = {{width:20,height:17}}
                            source = {this.state.isCollection?Images.Collection:Images.NoCollection}
                        />
                    </ASTouchableOpacity>
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
                        />
                    </View>

                )
            }
        });
        return  swiper
    }
    render(){
        return(
            <View style={styles.container}>
                {this.renderTopView()}
                <ScrollView>
                <View style={{flex:1}}>
                    <View style={{paddingHorizontal:12,backgroundColor:colors.WHITE,backgroundColor:colors.WHITE}}>
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
                        <ASText style={{fontSize:21,color:colors.Price}} text={'￥'+this.state.price}></ASText>
                        {/*<Text style={{fontSize:14,color:colors.TIME}} numberOfLines={1}>{'配送费0元'}</Text>*/}
                    </View>
                    <View style={{paddingHorizontal:12,paddingTop:20,backgroundColor:colors.WHITE}}>
                        <ASText style={{fontSize:20,color:colors.CHATTEXT,fontWeight:'bold'}} text={this.state.cate}></ASText>
                    </View>
                    <View style={{paddingHorizontal:12,paddingTop:14,paddingBottom:25,backgroundColor:colors.WHITE}}>
                        <ASText style={{fontSize:16,color:colors.Noticetitle,}} text={this.state.goodsName}></ASText>
                    </View>
                    <View style={{paddingVertical:16,backgroundColor:colors.WHITE,marginTop:10,paddingHorizontal:10}}>
                        {/*<HTMLView*/}
                            {/*value={this.state.H5}*/}
                            {/*renderNode={Platform.OS==='ios'?this.renderNode:this.renderAndroid}*/}
                        {/*/>*/}
                        <NewHTMLView
                            html={this.state.H5}
                            renderers={{
                                img: (htmlAttribs, children, style, passProps) => {
                                    const { src, height } = htmlAttribs;
                                    const imageHeight = height || 200;
                                    return (
                                        <BImage
                                            style={{ width: width-20, height: parseInt(imageHeight) }}
                                            source={{ uri: src }}
                                            isResize={true}
                                            imageWidth={width-20}
                                        />
                                    );
                                }
                            }}
                        />
                    </View>
                   <View style={{marginTop:10, paddingLeft: 33,paddingRight:12,paddingVertical:15,backgroundColor:'white'}}>
                        {/*<View style={{flexDirection:'row',alignItems:'center'}}>*/}
                        {/*    <Image source={require('../../images/my/itegral.png')} style={{width:20,height:20}}/>*/}
                        {/*    <ASText style={{fontSize: 14, color: colors.Noticetitle,marginLeft:10}} text={this.state.jifenText}/>*/}
                        {/*</View>*/}
                        {/*<ASTouchableOpacity style={{width: 50, height: 20,paddingLeft:30,justifyContent:'center'}} onPress={()=>{*/}
                        {/*    let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0*/}
                        {/*    let deductionPrice=this.state.guigeItem.deductionPrice?parseFloat(this.state.guigeItem.deductionPrice):0*/}
                        {/*    let btnTitle=''*/}
                        {/*    if(!this.state.useIntegral){*/}
                        {/*        let newtitle=parice*this.state.number-(parice-deductionPrice)*/}
                        {/*        btnTitle='¥'+newtitle+'元'+'+'+this.state.guigeItem.integral+'积分'+'   立即支付'*/}
                        {/*    }else{*/}
                        {/*        let newtitle=parice*this.state.number*/}
                        {/*        btnTitle='¥'+newtitle+'元'+'   立即支付'*/}
                        {/*    }*/}
                        {/*    this.setState({*/}
                        {/*        jifenText:'可使用'+this.state.guigeItem.integral+'积分抵用'+(parice-deductionPrice)+'元',*/}
                        {/*        btnTitle:btnTitle,*/}
                        {/*        useIntegral:this.state.useIntegral?0:1*/}
                        {/*    })}*/}
                        {/*}>*/}
                        {/*    <Image*/}
                        {/*        source={this.state.useIntegral ? require('../../images/my/collectionSlect.png') : require('../../images/my/collection.png')}*/}
                        {/*        style={{width: 20, height: 20}}/>*/}
                        {/*</ASTouchableOpacity>*/}
                        <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{this.setState({
                            useIntegral:!this.state.useIntegral
                        })}}>
                            <Image
                                source={this.state.useIntegral ? require('../../images/my/collectionSlect.png') : require('../../images/my/collection.png')}
                                style={{width: 20, height: 20}}/>
                                <ASText text={'使用积分'} style={{fontSize:13,color:colors.Noticetitle,marginLeft:10}}/>
                            <ASText text={'当前积分:'+this.state.myJifen} style={{fontSize:13,color:colors.Noticetitle,marginLeft:10}}/>
                        </ASTouchableOpacity>
                        {this.state.useIntegral?<View style={{flexDirection:'row',alignItems:'center',marginTop:15}}>
                            <View style={{paddingHorizontal:10,paddingVertical:5,borderWidth:colors.width_1_PixelRatio,borderColor:colors.BLACK,flex:1}}>
                                <TextInput
                                    style={styles.searchInput}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入需要抵扣的积分'}
                                    value={this.state.jifenNum}
                                    placeholderTextColor={colors.CAED}
                                    keyboardType={'numeric'}
                                    onChangeText={(text)=>this.setState({jifenNum:text})}
                                    onFocus={()=>{this.keyborad=true}}
                                    onBlur={()=>{
                                        this.keyborad=false
                                        if(this.state.jifenNum.length>0){
                                            if(StringUtils.checkZnumber(this.state.jifenNum)){
                                                if(parseInt(this.state.jifenNum)%parseInt(this.state.jifenbili)==0){
                                                    let num=parseInt(this.state.jifenNum)/parseInt(this.state.jifenbili)
                                                    let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0
                                                    let newtitle=parice*this.state.number-num
                                                    let btnTitle='¥'+newtitle+'元'+'+'+this.state.jifenNum+'积分'+'   立即支付'
                                                    this.setState({
                                                        btnTitle:btnTitle
                                                    })
                                                }else{
                                                    Alert.alert('提示',' 请输入'+this.state.jifenbili+'的整数倍积分',[{text:'确定',style:'cancel'}]);
                                                    return ;
                                                }
                                            }else{
                                                Alert.alert('提示',' 请输入正确的积分',[{text:'确定',style:'cancel'}]);
                                                return ;
                                            }
                                        }
                                    }}
                                />
                            </View>
                            <ASText text={'请输入'+this.state.jifenbili+'的整数倍'} style={{fontSize:13,color:'red',marginLeft:10}}/>
                        </View>:null}
                    </View>
                    {this.state.addressList.length > 0 ?
                        <ASTouchableOpacity style={{
                            paddingHorizontal: 12,
                            paddingTop: 15,
                            paddingBottom: 15,
                            backgroundColor: colors.WHITE,
                            borderBottomWidth: colors.width_1_PixelRatio,
                            borderBottomColor: colors.LINE,
                            marginTop: 10
                        }} onPress={()=>{this.onPressSlectAddress()}}>
                            <View style={{
                                paddingLeft: 21,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <ASText style={{fontSize: 14, color: colors.Noticetitle}} text={'收货人：'+this.state.addressItem.name}></ASText>
                                <ASText style={{fontSize: 14, color: colors.Noticetitle}} text={this.state.addressItem.phone}></ASText>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 14
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={Images.Location} style={{width: 15, height: 19}}/>
                                    <ASText style={{
                                        fontSize: 14,
                                        color: colors.Noticetitle,
                                        marginLeft: 5
                                    }} text={this.state.addressItem.pct+this.state.addressItem.address}></ASText>
                                </View>
                                <Image source={Images.ARROW_GRAY} style={{width: 8, height: 12}}/>
                            </View>
                        </ASTouchableOpacity>:
                        <ASTouchableOpacity style={{
                            paddingHorizontal: 12,
                            paddingTop: 15,
                            paddingBottom: 15,
                            backgroundColor: colors.WHITE,
                            borderBottomWidth: colors.width_1_PixelRatio,
                            borderBottomColor: colors.LINE,
                            marginTop: 10
                        }} onPress={()=>{this.onPressSlectAddress()}}>
                            <ASText style={{fontSize: 21, color: colors.CHATTEXT}} text={'选择地址'}></ASText>
                        </ASTouchableOpacity>
                    }
                    <View style={{paddingLeft:33,paddingRight:12,paddingVertical:15,backgroundColor:colors.WHITE,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                        <ASText style={{fontSize:14,color:colors.Noticetitle}} text={'规格：'}></ASText>
                        {this.state.norms.length==1?
                            <ASText style={{fontSize:17,color:colors.Price}} text={this.state.norms[0].name}></ASText>:
                            <ASTouchableOpacity style={{paddingHorizontal:10,paddingVertical:5,borderWidth:colors.width_1_PixelRatio,borderColor:colors.LINE}} onPress={()=>{this.onPressNorms()}}>
                                <ASText style={{fontSize:17,color:colors.Price}} text={this.state.guigeName}></ASText>
                            </ASTouchableOpacity>
                        }
                    </View>
                    {/*<View style={{paddingLeft:33,paddingRight:12,paddingVertical:15,backgroundColor:colors.WHITE,justifyContent:'space-between',alignItems:'center',flexDirection:'row',*/}
                    {/*}}>*/}
                    {/*    <ASText style={{fontSize:14,color:colors.Noticetitle}} text={'数量:'}></ASText>*/}
                    {/*    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>*/}
                    {/*        <ASTouchableOpacity onPress={()=>{*/}
                    {/*            if(this.state.number==1)return*/}
                    {/*            let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0*/}
                    {/*            let deductionPrice=this.state.guigeItem.deductionPrice?parseFloat(this.state.guigeItem.deductionPrice):0*/}
                    {/*            let btnTitle=''*/}
                    {/*            if(this.state.useIntegral){*/}
                    {/*                let newtitle=parice*(this.state.number-1)-(parice-deductionPrice)*/}
                    {/*                btnTitle='¥'+newtitle+'元'+'+'+this.state.guigeItem.integral+'积分'+'   立即支付'*/}
                    {/*            }else{*/}
                    {/*                let newtitle=parice*(this.state.number-1)*/}
                    {/*                btnTitle='¥'+newtitle+'元'+'   立即支付'*/}
                    {/*            }*/}
                    {/*            this.setState({*/}
                    {/*                jifenText:'可使用'+this.state.guigeItem.integral+'积分抵用'+(parice-deductionPrice)+'元',*/}
                    {/*                btnTitle:btnTitle,*/}
                    {/*                number:this.state.number-1*/}
                    {/*            })}*/}
                    {/*        }>*/}
                    {/*            <Image source={Images.Vip_reduce} style={{width:21,height:21}}/>*/}
                    {/*        </ASTouchableOpacity>*/}
                    {/*        <View style={{paddingHorizontal:20,justifyContent:'center',alignItems:'center'}}>*/}
                    {/*            <ASText style={{fontSize:18,color:colors.CHATTEXT}} text={this.state.number}></ASText>*/}
                    {/*        </View>*/}
                    {/*        <ASTouchableOpacity onPress={()=>{*/}
                    {/*            let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0*/}
                    {/*            let deductionPrice=this.state.guigeItem.deductionPrice?parseFloat(this.state.guigeItem.deductionPrice):0*/}
                    {/*            let btnTitle=''*/}
                    {/*            if(this.state.useIntegral){*/}
                    {/*                let newtitle=parice*(this.state.number+1)-(parice-deductionPrice)*/}
                    {/*                btnTitle='¥'+newtitle+'元'+'+'+this.state.guigeItem.integral+'积分'+'   立即支付'*/}
                    {/*            }else{*/}
                    {/*                let newtitle=parice*(this.state.number+1)*/}
                    {/*                btnTitle='¥'+newtitle+'元'+'   立即支付'*/}
                    {/*            }*/}
                    {/*            this.setState({*/}
                    {/*                jifenText:'可使用'+this.state.guigeItem.integral+'积分抵用'+(parice-deductionPrice)+'元',*/}
                    {/*                btnTitle:btnTitle,*/}
                    {/*                number:this.state.number+1*/}
                    {/*            })}*/}
                    {/*        }>*/}
                    {/*            <Image source={Images.Vip_add} style={{width:21,height:21}}/>*/}
                    {/*        </ASTouchableOpacity>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
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
                    <ASText style={{fontSize:16,color:colors.WHITE}} text={this.state.btnTitle}></ASText>
                </ASTouchableOpacity>
                {this.state.showNorms?
                    <ASTouchableOpacity style={styles.showNorms} onPress={()=>{
                        this.setState({showNorms:false})}}>
                        <View style={styles.NormsView}>
                            {this.state.norms.map((item,i)=>{
                                return(
                                    <View  key={i} style={{paddingRight:15}}>
                                        <ASTouchableOpacity style={[styles.norBtnView]} onPress={()=>{
                                            this.setState({
                                                guigeName:item.name,
                                                guigeId:item.id,
                                                showNorms:false,
                                                guigeItem:item
                                            },()=>{
                                                let parice=this.state.guigeItem.price?parseFloat(this.state.guigeItem.price):0
                                                let btnTitle='¥'+parice+'元'+'   立即支付'
                                                if(this.state.jifenNum.length>0) {
                                                    if (StringUtils.checkZnumber(this.state.jifenNum)) {
                                                        if (parseInt(this.state.jifenNum) % parseInt(this.state.jifenbili) == 0) {
                                                            let num = parseInt(this.state.jifenNum) / parseInt(this.state.jifenbili)
                                                            let parice = this.state.guigeItem.price ? parseFloat(this.state.guigeItem.price) : 0
                                                            let newtitle = parice * this.state.number - num
                                                            btnTitle = '¥' + newtitle + '元' + '+' + this.state.jifenNum + '积分' + '   立即支付'
                                                        }
                                                    }
                                                }
                                                // let deductionPrice=this.state.guigeItem.deductionPrice?parseFloat(this.state.guigeItem.deductionPrice):0
                                                // let btnTitle=''
                                                // if(this.state.useIntegral){
                                                //     let newtitle=parice*this.state.number-(parice-deductionPrice)
                                                //     btnTitle='¥'+newtitle+'元'+'+'+this.state.guigeItem.integral+'积分'+'   立即支付'
                                                // }else{
                                                //     let newtitle=parice*this.state.number
                                                //     btnTitle='¥'+newtitle+'元'+'   立即支付'
                                                // }
                                                this.setState({
                                                    showJifen:true,
                                                    // jifenText:'可使用'+this.state.guigeItem.integral+'积分抵用'+(parice-deductionPrice)+'元',
                                                    btnTitle:btnTitle
                                                })
                                            })
                                        }}>
                                            <ASText style={[{fontSize:15,color:colors.CHATTEXT},this.state.guigeId==item.id?{color:colors.Price}:{}]} text={item.name}></ASText>
                                        </ASTouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </ASTouchableOpacity>
                    :null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
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
    addreeView:{
        paddingTop:17,
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
    showNorms:{
        position:'absolute',
        right:0,
        left:0,
        top:0,
        bottom:0,
        backgroundColor:colors.BLACK_TRANSPARENT_COLOR,
        justifyContent:'flex-end'
    },
    NormsView:{
        flexDirection:'row',
        paddingHorizontal:10,
        backgroundColor:colors.WHITE,
        flexWrap:'wrap',
        paddingTop:20,
        paddingBottom:100
    },
    norBtnView:{
        paddingVertical:5,
        paddingHorizontal:10,
        borderWidth:colors.width_1_PixelRatio,
        borderColor:colors.LINE,
    },
    searchInput:{
        padding:0,
        flex:1,
        fontSize:15,
        color:colors.CHATTEXT,
    },
})
