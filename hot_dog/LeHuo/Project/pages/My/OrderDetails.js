import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image, Alert, Linking,ScrollView
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
@containers()
export default class test extends Component {
    static propTypes = {
        uid:React.PropTypes.string,
        orderNum:React.PropTypes.string,
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.state= {
            orderNum: '',//订单号
            totalPrice: '',//价格
            goodsName: '',//商品名
            goodsCover: '',//商品图片
            address: '',
            isHotel:'1',//是不是酒店 1代表酒店
            roomInfo:[],
            name:'',//入住人
            phone:'',//手机号码
            idcard:'',//身份证
            checkin:'',//入住日期
            createTime:'',// 订单时间
            normsName:'',//规格名
            title:'',//优惠信息
            phoneOfBusiness:'',//商户电话
            phoneOfCustomer:'',//客服电话
        }


    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'订单详情',
        });
        this.getData()
    }

    /**
     *@desc   获取订单详情数据
     *@author 张羽
     *@date   2019-09-12 00:56
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.orderDetail(this.props.uid,this.props.orderNum), {}, successCallback = (data) => {
            console.log('............订单',data)
            this.setState({
                goodsName:data.info.goodsName,
                orderNum:data.info.orderNum,
                totalPrice:data.info.totalPrice,
                goodsCover:data.info.goodsCover?data.info.goodsCover:'',
                address:data.info.address?data.info.address.pct?data.info.address.pct:'':'',
                roomInfo:data.info.roomInfo,
                createTime:data.info.createTime,
                name:data.info.isHotel=='1'?data.info.register?data.info.register.name:'':'',
                phone:data.info.isHotel=='1'?data.info.register?data.info.register.phone:'':'',
                checkin:data.info.isHotel=='1'?data.info.register?data.info.register.checkin:'':'',
                idcard:data.info.isHotel=='1'?data.info.register?data.info.register.idcard:'':'',
                isHotel:data.info.isHotel,
                normsName:data.info.normsName,
                title:data.info.title,
                phoneOfBusiness:data.info.phoneOfBusiness,
                phoneOfCustomer:data.info.phoneOfCustomer



            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    /**
     *@desc   点击商家
     *@author 张羽
     *@date   2019-09-12 00:50
     *@param
     */
    onPressShangjia(){
        if(!this.state.phoneOfBusiness){
            return
        }
        Alert.alert('提示', '确认拨打：'+this.state.phoneOfBusiness +' ？', [{text:'取消',style:'cancel'},{text:'拨打',onPress: () => {
                Linking.canOpenURL('tel:'+this.state.phoneOfBusiness).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' );
                    } else {
                        return Linking.openURL('tel:'+this.state.phoneOfBusiness);
                    }
                }).catch(err => console.error('An error occurred', err));
            }}]);
    }

    /**
     *@desc   点击客服
     *@author 张羽
     *@date   2019-09-12 00:50
     *@param
     */
    onPressKefu(){
        if(!this.state.phoneOfCustomer){
            return
        }
        Alert.alert('提示', '确认拨打：'+this.state.phoneOfCustomer +' ？', [{text:'取消',style:'cancel'},{text:'拨打',onPress: () => {
                Linking.canOpenURL('tel:'+this.state.phoneOfCustomer).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' );
                    } else {
                        return Linking.openURL('tel:'+this.state.phoneOfCustomer);
                    }
                }).catch(err => console.error('An error occurred', err));
            }}]);
    }
    render() {
        let roomInfo=Array.isArray(this.state.roomInfo)?this.state.roomInfo:[]
        return (
                <View style={styles.container}>
                    <View style={{marginTop: 10,backgroundColor: 'white',flexDirection:'row',paddingVertical: 22,paddingHorizontal: 15}}>
                        <BImage source={{uri:this.state.goodsCover}} style={{width:110,height:110,borderRadius:6}} imageStyle={{borderRadius:6}}/>
                        <View style={{marginLeft: 15,paddingTop: 15,paddingBottom: 5,flex:1,justifyContent: 'space-between'}}>
                            <View>
                                <ASText text={this.state.goodsName} style={{fontSize:15,color:'#070707'}}/>
                                <ASText text={this.state.address} style={{fontSize:11,color:'#070707',marginTop:6.5,width:150}}/>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                <ASText text={'¥'} style={{fontSize:10,color:'#ff0226'}}>
                                    <ASText text={this.state.totalPrice} style={{fontSize:18,color:'#ff0226'}}/>
                                </ASText>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 10,backgroundColor: 'white',paddingLeft: 14,paddingTop:10}}>
                        <View style={{flexDirection:'row',paddingBottom:10}}>
                            <View style={{width:2,height:20,backgroundColor:'#ff8a00'}}></View>
                            <ASText text={'订单详情'} style={{fontSize:15,color:'#070707',marginLeft:10}}/>
                        </View>
                    </View>
                    {this.state.isHotel=='1'?<View style={{backgroundColor:'white',paddingLeft: 14}}>
                        <View style={{paddingTop:10,flexDirection:'row',flexWrap: 'wrap',paddingBottom:20}}>
                            {roomInfo.map((item,i)=>{
                                return(
                                    <View style={{paddingRight: 10,paddingBottom:10}} key={i}>
                                        <ASText text={item.name} style={{fontSize:14,color:'#3c3c3a'}}/>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                            <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'入住人姓名'}/>
                            <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.name}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                            <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'入住日期'}/>
                            <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.checkin}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                            <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'身份证号码'}/>
                            <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.idcard}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                            <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'联系电话'}/>
                            <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.phone}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                            <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'订单号'}/>
                            <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.orderNum}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                            <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'订单生成时间'}/>
                            <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.createTime}/>
                        </View>
                    </View>:
                        <View style={{backgroundColor:'white',paddingLeft: 14,paddingTop:10}}>
                            <View style={{paddingRight: 10,paddingBottom:30}} >
                                <ASText text={this.state.normsName} style={{fontSize:14,color:'#3c3c3a'}}/>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                                <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'优惠信息'}/>
                                <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.title}/>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                                <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'订单号 '}/>
                                <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.orderNum}/>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20}}>
                                <ASText style={{fontSize:12,color:'#7b7a75',width:75}} text={'订单生成时间'}/>
                                <ASText style={{fontSize:12,color:'#070707',marginLeft:30   }} text={this.state.createTime}/>
                            </View>
                        </View>
                    }
                    <View style={{flexDirection:'row',borderTopWidth: colors.width_1_PixelRatio,borderTopColor:colors.LINE,backgroundColor:'white',paddingTop:12,paddingBottom:30}}>
                        <ASTouchableOpacity onPress={()=>{this.onPressShangjia()}}
                                            style={{flex:1,borderRightWidth: colors.width_1_PixelRatio,borderRightColor:'#d1c5a9',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                            <Image style={{width:20,height:20}} source={require('../../images/my/kefuphone.png')}/>
                            <ASText style={{marginLeft:12,fontSize:14,color:'#070707'}} text={'联系商家'}/>
                        </ASTouchableOpacity>
                        <ASTouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}} onPress={()=>{this.onPressKefu()}}>
                            <Image style={{width:20,height:20}} source={require('../../images/my/kefu.png')}/>
                            <ASText style={{marginLeft:12,fontSize:14,color:'#070707'}} text={'联系客服'}/>
                        </ASTouchableOpacity>
                    </View>

                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage
    }
})
