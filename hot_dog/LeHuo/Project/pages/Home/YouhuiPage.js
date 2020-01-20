import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList, ImageBackground, DeviceEventEmitter,
} from 'react-native';
import ASText from '../../components/ASText'
import Url from '../../../Resourse/url'
import colors from '../../../Resourse/Colors'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import BImage from '../../components/BImage'
import Toast from "@remobile/react-native-toast";
export default class YouhuiPage extends Component{
    static propTypes = {
        bid:React.PropTypes.string,
        uid:React.PropTypes.string,
    };
    static defaultProps = {

    };
    constructor(props){
        super(props)
        this.page=1
        this.perPage=10
        this.state={
            data:[],
            nearArray:[],
            is_hotal:true
        }
        this.getFeijiudian=this.getFeijiudian.bind(this)

    }
    componentDidMount() {
        this.getYouhuiInfo()
        this.getNear()
    }

    /**
     *@desc   获取优惠信息
     *@author 张羽
     *@date   2019-08-19 20:05
     *@param
     */
    getYouhuiInfo(){
        this.props.fetchData(this, '', Url.roomList(this.props.bid), {}, successCallback = (data) => {
            console.log('........优惠信息',data.info,this.props.noticeArr)
            this.setState({
                data:data.info
            })
            return;
        }, failure = (data) => {
            // Toast.showShortCenter(data.notice)
            this.getFeijiudian()
        });
    }

    /**
     *@desc   非酒店
     *@author 张羽
     *@date   2019-09-08 22:31
     *@param
     */
    getFeijiudian(){
        this.props.fetchData(this, '', Url.discountList(this.props.bid), {}, successCallback = (data) => {
            console.log('........非酒店优惠信息',data.info)
            this.setState({
                data:data.info,
                is_hotal:false
            })
            return;
        }, failure = (data) => {
            // Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取周边
     *@author 张羽
     *@date   2019-08-28 15:24
     *@param
     */
    getNear(){
        this.props.fetchData(this, '', Url.nearbyFood(this.page,this.perPage,this.props.bid), {}, successCallback = (data) => {
            console.log('........获取周边',data.info)
            this.setState({
                nearArray:data.info.list
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    // _keyExtractor = (item, index) => ''+item.id

    render() {
        return(
            <View style={styles.container}>
                <View style={{backgroundColor:'white'}}>
                    {this.state.data.map((item,index)=>{
                        let emptyNum=item.emptyNum
                        let newArray=Array.isArray(item.label)?item.label:[]
                        return(
                            <View style={{flexDirection: 'row',paddingHorizontal:12,paddingBottom: 18,borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:colors.LINE,paddingTop:10,alignItems:'center'}} key={item.id}>
                                <BImage source={{uri:item.cover?item.cover:''}} style={{width:88,height:88,borderRadius: 6}} imageStyle={{borderRadius: 6}}/>
                                <View style={{marginLeft: 28,flex:1,justifyContent:'center'}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                                            <ASText text={item.name} style={{fontSize:16,color:'#1a1a1a'}}></ASText>
                                            {/*{this.state.is_hotal?<ASText text={emptyNum>0?('还剩'+emptyNum+'间'):'无房'} style={[{fontSize:10,color:'#e27120',marginLeft:27},emptyNum>0?{}:{color:'#959595'}]}/>:null}*/}
                                        </View>
                                        {this.state.is_hotal? <View>
                                            <ASText text={'¥'+item.discountPrice} style={{fontSize:16,color:'#e27120'}}></ASText>
                                            <ASText text={'¥'+item.price} style={{fontSize:10,color:'#9d9d9d',
                                                marginTop: 2,textDecorationLine:'line-through'}}></ASText>
                                        </View>: <View>
                                            {item.discount=='0.0'||item.discount==0?null:<ImageBackground style={{width:44,height:17,marginTop:10,justifyContent:'center',alignItems:'flex-end',paddingRight: 5}} source={require('../../images/home/zhekou.png')}>
                                                <ASText numberOfLines={1} style={{fontSize:13,color:'white',backgroundColor:colors.TRANSPARENT_COLOR}} text={item.discount+'折'}></ASText>
                                            </ImageBackground>}
                                        </View>}
                                    </View>
                                    {item.title?<ASText text={item.title} style={{fontSize:12,color:'#3d3d3d'}}></ASText>:null}
                                    <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:'center',marginTop:10}}>
                                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                                            {newArray.map((item,index)=>{
                                                return(
                                                    <View style={[{borderWidth:colors.width_1_PixelRatio,padding:2,
                                                        justifyContent:'center',alignItems:'center',borderRadius:2,borderColor:'#e27120'},index==0?{}:{marginLeft:10}]} key={index}>
                                                        <ASText style={{fontSize:10,color:'#e27120'}} text={item}></ASText>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                            <ASTouchableOpacity onPress={()=>{
                                                this.props.fetchData(this, '', Url.myEquity(this.props.uid), {}, successCallback = (data) => {
                                                    if(this.state.is_hotal){
                                                        this.props.push('YudingPage',{noticeArr:this.state.data,uid:this.props.uid,bid:this.props.bid})
                                                    }else{
                                                        this.props.push('JiesuPage',{zhekou:item.discount,uid:this.props.uid,bid:this.props.bid})
                                                    }
                                                    return;
                                                }, failure = (data) => {
                                                    Toast.showShortCenter(data.notice)
                                                });
                                            }}
                                                                style={[{paddingHorizontal:10,paddingVertical:5,borderRadius:6,backgroundColor:'#e3782c',
                                                                    justifyContent:'center',alignItems:'center'},emptyNum==0&&this.state.is_hotal?{backgroundColor:'#d8d8d8'}:{}]} disabled={emptyNum==0&&this.state.is_hotal?true:false}>
                                                <ASText text={this.state.is_hotal?'预订':'折扣买单'} style={{fontSize:14,color:'#ffffff'}}></ASText>
                                            </ASTouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View style={{paddingLeft: 12,paddingTop: 24,paddingBottom: 11,backgroundColor:'white'}}>
                    <ASText text={'周边'} style={{fontSize:16,color:'#3d3d3d'}}/>
                    <View style={{position:'absolute',width:20,height:2,left:12,bottom:0,backgroundColor:'#e3782c'}}></View>
                </View>
                <View style={{backgroundColor:'white',marginTop:1}}>
                    {this.state.nearArray.map((item,index)=>{
                        let newArray=Array.isArray(item.label)?item.label:[]
                        return(
                            <View style={{flexDirection: 'row',paddingHorizontal:12,paddingBottom: 18,
                                borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:colors.LINE,paddingTop: 10}} key={item.id}>
                                <BImage source={{uri:item.cover?item.cover:''}} style={{width:88,height:88,borderRadius: 6}} imageStyle={{borderRadius: 6}}/>
                                <View style={{marginLeft: 28,flex:1,justifyContent:'center'}}>
                                    <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                                            <ASText text={item.name} style={{fontSize:16,color:'#1a1a1a'}}></ASText>
                                        </View>
                                        <View>
                                            {item.discount=='0.0'||item.discount==0?null:<ImageBackground style={{width:44,height:17,marginTop:10,justifyContent:'center',alignItems:'flex-end',paddingRight: 5}} source={require('../../images/home/zhekou.png')}>
                                                <ASText numberOfLines={1} style={{fontSize:13,color:'white',backgroundColor:colors.TRANSPARENT_COLOR}} text={item.discount+'折'}></ASText>
                                            </ImageBackground>}
                                        </View>
                                    </View>
                                    {item.title?<ASText text={item.title} style={{fontSize:12,color:'#3d3d3d'}}></ASText>:null}
                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                                            {newArray.map((item,index)=>{
                                                return(
                                                    <View style={[{borderWidth:colors.width_1_PixelRatio,padding:2,
                                                        justifyContent:'center',alignItems:'center',borderRadius:2,borderColor:'#e27120'},index==0?{}:{marginLeft:10}]} key={index}>
                                                        <ASText style={{fontSize:10,color:'#e27120'}} text={item}></ASText>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                            <ASTouchableOpacity onPress={()=>{
                                                this.props.push('HomeDetails',{userId:this.props.uid,businessId:item.id+'',forceNav:true})
                                            }}
                                                                style={[{paddingHorizontal:10,paddingVertical:5,borderRadius:6,backgroundColor:'#e3782c',
                                                                    justifyContent:'center',alignItems:'center'}]} >
                                                <ASText text={'进店看看'} style={{fontSize:14,color:'#ffffff'}}></ASText>
                                            </ASTouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
})
