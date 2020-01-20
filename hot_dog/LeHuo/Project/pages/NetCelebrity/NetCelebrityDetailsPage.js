import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    ScrollView,
    FlatList,
    Alert,
    Linking
} from 'react-native';
import containers from '../../containers/containers'
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getModel();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import colors from "../../../Resourse/Colors";
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import Images from "../../../Resourse/Images";
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import NewHTMLView from "react-native-render-html";
import SendMessage from "../../components/SendMessage";
import ActionSheet from "react-native-actionsheet";
@containers()
export default class NetCelebrityDetailsPage extends Component{
    constructor(props){
        super(props)
        this.page=1
        this.perPage=10
        this.state= {
            cover: '',//店铺头像
            name: '',//店铺名字
            address: '',//地址
            html: '',//富文本
            phone: '',//电话
            slogan: '',//描述
            comment: [],//评论
            isCollection: '',
            showKeyboard: false,
            textInput: '',
            canSubmit: false,
            placeholder: '评论',
            pingSecond: false,
            pingSecondItem: {},
            isAgree:'',
            count:0,
            isLoadComplete:false,
            isLoadMore:false,
            lat:'',
            lng:''
        }
        this.onChangeText=this.onChangeText.bind(this)
        this.sendMessage=this.sendMessage.bind(this)
        this.onEndReached=this.onEndReached.bind(this)
    }
    componentDidMount() {
        this.props.setContainer(this,{
            title:this.props.title,
        });
        this.getDetaisl()
        this.businessComment(false)
    }

    /**
     *@desc   获取详情接口
     *@author 张羽
     *@date   2019-08-26 14:43
     *@param
     */
    getDetaisl(){
        this.props.fetchData(this, '', Url.wanghongDetais(this.props.businessId,this.props.userId), {}, successCallback = (data) => {
            console.log('............网红推荐详情',data)
            this.setState({
                cover:data.info.business.cover?data.info.business.cover:'',
                name:data.info.business.name,//店铺名字
                address:data.info.business.address,//地址
                html:data.info.business.description,//富文本
                phone:data.info.business.phone,//电话
                slogan:data.info.business.slogan,//描述
                isAgree:data.info.business.isAgree,
                lat:data.info.business.lat,
                lng:data.info.business.lng,

            })
            return;
        }, failure = (data) => {

            Toast.showShortCenter(data.msg)
        });
    }

    /**
     *@desc   获取评论
     *@author 张羽
     *@date   2019-08-27 23:50
     *@param
     */
    businessComment(isMore){
        this.props.fetchData(this, '', Url.businessComment(this.props.businessId,this.props.userId,this.page,this.perPage), {}, successCallback = (data) => {
            console.log('............网红推荐评论',data)
            this.setState({
                comment:isMore?this.state.comment.concat(data.info.list):data.info.list, //评论
                count:data.info.count,
                isLoadComplete:data.info.list.length<this.perPage?true:false,
                isLoadMore:false
            })
            return;
        }, failure = (data) => {
            this.setState({
                isLoadMore:false,
                isLoadComplete:false
            })
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   描述文本变化
     *@author 张羽
     *@date   2019-08-26 16:29
     *@param
     */
    // 留言控制是否能留言
    onChangeText(value){
        this.setState({textInput:value,canSubmit:value?true:false})
    }

    /**
     *@desc   发送
     *@author 张羽
     *@date   2019-08-26 16:30
     *@param
     */
    sendMessage(){
        if(!this.state.pingSecond){
            this.props.fetchData(this, '', Url.pingShop(this.props.businessId,this.props.userId,this.state.textInput,5), {}, successCallback = (data) => {
                console.log('............评价',data)
                this.setState({showKeyboard:false,textInput:''},()=>{
                    this.page=1
                    this.businessComment(false)
                })
                Toast.showShortCenter(data.notice)
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }else{
            this.props.fetchData(this, '', Url.toReplyBusiness(this.props.userId,this.props.businessId,this.state.pingSecondItem.uid,
                this.state.textInput,this.state.pingSecondItem.id,'5','3'), {}, successCallback = (data) => {
                console.log('............评价',data)
                for(let obj of this.state.comment){
                    if(obj.id==this.state.pingSecondItem.id){
                        obj.commentNum=obj.commentNum+1
                        let param={
                            content: this.state.textInput,
                            cover: this.props.userinfo.cover,
                            id: 190,
                            username: this.props.userinfo.username,
                        }
                        if(obj.replay){
                            obj.replay.splice(0,0,param)
                        }else{
                            let array=[]
                            array.push(param)
                            obj.replay=array
                        }
                        this.setState({
                            comment:this.state.comment
                        })
                        break;
                    }
                }
                this.setState({showKeyboard:false,textInput:'',pingSecond:false,pingSecondItem:{}})
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }

    }
    /**
     *@desc   点击评论列表评论
     *@author 张羽
     *@date   2019-08-26 17:22
     *@param
     */
    onPressCommit(item){
        this.setState({
            showKeyboard:true,
            pingSecondItem:item,
            pingSecond:true,
            placeholder:'回复'+item.username
        })
    }
    /**
     *@desc   打电话
     *@author 张羽
     *@date   2018/11/11 下午10:07
     *@param
     */
    onPressPhone(){
        if(!this.state.phone){
            return
        }
        Alert.alert('提示', '确认拨打：'+this.state.phone +' ？', [{text:'取消',style:'cancel'},{text:'拨打',onPress: () => {
                Linking.canOpenURL('tel:'+this.state.phone).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' );
                    } else {
                        return Linking.openURL('tel:'+this.state.phone);
                    }
                }).catch(err => console.error('An error occurred', err));
            }}]);
    }

    /**
     *@desc   地址
     *@author 张羽
     *@date   2019-09-10 01:14
     *@param
     */
    onPressClickAddress(){
        this.refs.actionSheet.show()
    }
    /**
     *@desc   选择地图
     *@author 张羽
     *@date   2018/9/27 下午9:46
     *@param
     */
    handlePress(i){
        if(i==0)return
        let url;
        let lon=parseFloat(this.state.lng).toFixed(6)
        let lat=parseFloat(this.state.lat).toFixed(6)
        let name=this.state.name
        if(i==1){
            //高德地图转换
            let key='89d11f9ffedcf1a025058de1e535a287'
            let root='https://restapi.amap.com/v3/assistant/coordinate/convert?key='+key
            let hh='&locations='+lon+','+lat+'&output=JSON'+'&coordsys=baidu'
            let base=root+hh
            let header = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                }
            };
            fetch(base,header).then((response) => response.json()).then((data)=>{
                console.log('..........经纬度转换',data)
                if(data.status==='1'){
                    let locations=data.locations
                    let array=locations.split(',')
                    if(Array.isArray(array)&&array.length>1){
                        lon=array[0]
                        lat=array[1]
                    }
                    if(Platform.OS == 'android'){
                        url = `androidamap://route?sourceApplication=appname&dev=0&m=0&t=0&dlon=${lon}&dlat=${lat}&dname=${name}`;
                    }else{
                        url = `iosamap://path?sourceApplication=appname&dev=0&m=0&t=0&dlon=${lon}&dlat=${lat}&dname=${name}`;
                    }
                    Linking.canOpenURL(url).then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle url: ' + url);
                            Toast.showShortBottom('您还未安装'+(i==1?'高德地图':'百度地图'))
                        } else {
                            return Linking.openURL(url).catch(e => console.warn(e));
                        }
                    }).catch(err => console.error('An error occurred', err));
                }else{
                    Toast.showShortCenter('地图经纬度转换错误')
                }
            })['catch'](function (error) {
                Toast.showShortCenter('地图经纬度转换错误')
            });
        }else{
            if (Platform.OS == 'android') {//android
                url = `baidumap://map/direction?destination=name:${name}|latlng:${lat},${lon}&mode=driving&coord_type=bd09ll&src=android.baidu.regou;scheme=bdapp;package=com.baidu.BaiduMap;end`;
            } else if (Platform.OS == 'ios') {//ios
                url = `baidumap://map/direction?destination=name:${name}|latlng:${lat},${lon}&mode=driving&coord_type=bd09ll&src=android.baidu.regou;scheme=bdapp`;
            }
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                    Toast.showShortBottom('您还未安装'+(i==1?'高德地图':'百度地图'))
                } else {
                    return Linking.openURL(url).catch(e => console.warn(e));
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }
    /**
     *@desc   点击点赞
     *@author 张羽
     *@date   2019-08-29 22:16
     *@param
     */
    onPressShopAgree(){
        this.props.fetchData(this, '', Url.addBusinessSupport(this.props.businessId,this.props.userId), {}, successCallback = (data) => {
            console.log('............评价',data)
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
            this.setState({
                isAgree:!this.state.isAgree
            })
        });
    }
    /**
     *@desc   点赞
     *@author 张羽
     *@date   2019-08-28 00:30
     *@param
     */
    onPressAgree(item){
        this.props.fetchData(this, '', Url.toReplyBusiness(this.props.userId,this.props.businessId,item.uid,
           '',item.id,'','1'), {}, successCallback = (data) => {
            console.log('............点赞',data)
            for(let obj of this.state.comment){
                if(obj.id==item.id){
                    obj.agreeNum=obj.isAgree?(obj.agreeNum-1):(obj.agreeNum+1)
                    obj.isAgree=!obj.isAgree
                    this.setState({
                        comment:this.state.comment
                    })
                    break;
                }
            }
            Toast.showShortCenter(data.notice)
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }

    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019-08-29 22:46
     *@param
     */
    onEndReached(){
        if(this.state.comment.length<this.perPage)return;
        if(this.state.isLoadMore)return
        if(this.state.isLoadComplete) return
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.comment.length/this.perPage)+1
            this.businessComment(true)
        })
    }
    renderHtml(){
        return(
            <View style={{paddingVertical:16,backgroundColor:colors.WHITE,marginTop:2,paddingHorizontal:12}}>
                <NewHTMLView
                    html={this.state.html}
                    renderers={{
                        img: (htmlAttribs, children, style, passProps) => {
                            const { src, height } = htmlAttribs;
                            const imageHeight = height || 200;
                            let isResize=src.endsWith('.gif')?false:true
                            return (
                                <BImage
                                    style={{ width: width-20, height: parseInt(imageHeight) }}
                                    source={{ uri: src }}
                                    isResize={isResize}
                                    imageWidth={width-20}
                                />
                            );
                        }
                    }}
                />
            </View>
        )
    }

    renderRow(item,index){
        let replay=Array.isArray(item.replay)?item.replay:[]
        return(
            <ASTouchableOpacity style={{backgroundColor:'white',borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:colors.LINE}} activeOpacity={1} onPress={()=>{
                this.setState({
                    showKeyboard:false,
                    pingSecondItem:{},
                    pingSecond:false,
                    placeholder:'评论'
                })
            }}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal: 12,paddingTop:16}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <BImage source={{uri:item.cover?item.cover:''}} style={{width:44,height:44,borderRadius: 22}} imageStyle={{borderRadius:22}}/>
                        <View style={{marginLeft:14}}>
                            <ASText text={item.username} style={{fontSize:13,color:'#3d3d3d'}}/>
                            <ASText text={item.createTime} style={{fontSize:12,color:'#959595',marginTop:8}}/>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{this.onPressCommit(item)}}>
                            <Image source={Images.HOT_PINGJIA} style={{width:17,height:15}}/>
                            <ASText text={item.commentNum} style={{fontSize:12,color:'#959595',marginLeft:6}}/>
                        </ASTouchableOpacity>
                        <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center',marginLeft:27}} onPress={()=>{this.onPressAgree(item)}}>
                            <Image source={item.isAgree?Images.ZANSELECT:Images.ZAN} style={{width:17,height:15}}/>
                            <ASText text={item.agreeNum} style={{fontSize:12,color:'#959595',marginLeft:6}}/>
                        </ASTouchableOpacity>
                    </View>
                </View>
                <View style={{marginLeft:70,paddingVertical:18,paddingRight: 12}}>
                    <ASText text={item.content} style={{fontSize:16,color:'#3d3d3d'}}/>
                </View>
                <View style={{paddingHorizontal:12,paddingBottom:10}}>
                    <View style={{backgroundColor:'#f8f8f8'}}>
                        {replay.map((item,index)=>{
                            return(
                                <View style={{flexDirection:'row',paddingHorizontal: 12,paddingTop:10,paddingBottom:20,borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:'#eeeeee'}} key={index}>
                                    <View style={{flexDirection:'row'}}>
                                        <BImage source={{uri:item.cover?item.cover:''}} style={{width:30,height:30,borderRadius: 15}}/>
                                        <View style={{marginLeft:14}}>
                                            <ASText text={item.username} style={{fontSize:13,color:'#dcc490'}}/>
                                            <ASText text={item.content} style={{fontSize:14,color:'#3d3d3d',marginTop:10}}/>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </ASTouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'friend'+item.id
    renderCommit(){
        return(
            <View style={{marginTop:13,flex:1}}>
                <View style={{paddingLeft: 12,paddingTop: 24,paddingBottom: 11,backgroundColor:'white'}}>
                    <ASText text={'留言'+this.state.count} style={{fontSize:16,color:'#3d3d3d'}}/>
                    <View style={{position:'absolute',width:20,height:2,left:12,bottom:0,backgroundColor:'#e3782c'}}></View>
                </View>

            </View>
        )
    }
    renderHeader(){
        return(
            <ASTouchableOpacity style={{flex:1}}  activeOpacity={1} onPress={()=>{
                this.setState({
                    showKeyboard:false,
                    pingSecondItem:{},
                    pingSecond:false,
                    placeholder:'评论'
                })
            }}>
                <View style={{marginTop: 10,backgroundColor: 'white'}}>
                    <View style={{flexDirection:'row',justifyContent: 'center',paddingVertical: 16,alignItems:'center'}}>
                        <BImage source={{uri:this.state.cover}} style={{width:43,height:43,borderRadius:21.5}} imageStyle={{borderRadius: 21.5}}/>
                        <ASText text={this.state.name} style={{fontSize:15,color:'#3d3d3d',fontWeight: 'bold',marginLeft: 15}}/>
                    </View>
                    <View style={{marginLeft:12}}>
                        <BImage source={{uri:this.state.cover}} style={{width:width-24,height:(width-24)*3/5}}/>
                    </View>
                    <View style={{marginTop:18,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Image source={Images.DIANPU} style={{width:16,height:16}}/>
                        <ASText text={this.state.slogan} style={{fontSize:15,color:'#3d3d3d',marginLeft: 15}}/>
                    </View>
                    <ASTouchableOpacity style={{marginTop:18,alignItems:'center',justifyContent:'center',paddingBottom: 17}} onPress={()=>{this.onPressClickAddress()}}>
                        <View style={{flexDirection:'row',alignItems:'center',width:250,justifyContent:'center'}}>
                            <Image source={require('../../images/home/distance.png')} style={{width:13,height:16}}/>
                            <ASText text={this.state.address} style={{fontSize:14,color:'#dcc490',marginLeft:5}} />
                        </View>
                        {/*<ASTouchableOpacity style={{marginTop:10}} onPress={()=>{this.onPressPhone()}}>*/}
                        {/*    <Image source={require('../../images/home/phone.png')} style={{width:15,height:15}}/>*/}
                        {/*</ASTouchableOpacity>*/}
                    </ASTouchableOpacity>
                </View>
                {this.renderHtml()}
                {this.renderCommit()}
            </ASTouchableOpacity>
        )
    }
    render(){
        return(
            <View style={styles.container} >
                    <FlatList
                        data = {this.state.comment}
                        renderItem={({item,index})=>this.renderRow(item,index)}
                        ListHeaderComponent={this.renderHeader()}
                        ItemSeparatorComponent={()=>null}//分割线
                        keyExtractor={this._keyExtractor}
                        extraData={this.state.data}
                        style={{flex:1,backgroundColor:'white',marginTop:1}}
                        onEndReachedThreshold={0.3}
                        onEndReached={this.onEndReached}
                        keyboardShouldPersistTaps={'always'}
                        keyboardDismissMode={'on-drag'}
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
                                        <ASText style={{fontSize: 15, color: colors.JF_title}} text={'正在加载中...'}/>
                                    </View>
                                )
                            }else{
                                return <View></View>
                            }
                        }}/>

                    {/*/!*<ScrollView>*!/*/}
                    {/*/!*    <View style={{flex:1}}>*!/*/}
                    {/*/!*    <View style={{marginTop: 10,backgroundColor: 'white'}}>*!/*/}
                    {/*/!*        <View style={{flexDirection:'row',justifyContent: 'center',paddingVertical: 16,alignItems:'center'}}>*!/*/}
                    {/*/!*            <BImage source={{uri:this.state.cover}} style={{width:43,height:43,borderRadius:21.5}}/>*!/*/}
                    {/*/!*            <ASText text={this.state.name} style={{fontSize:15,color:'#3d3d3d',fontWeight: 'bold',marginLeft: 15}}/>*!/*/}
                    {/*/!*        </View>*!/*/}
                    {/*/!*        <View style={{marginLeft:12}}>*!/*/}
                    {/*/!*            <BImage source={{uri:this.state.cover}} style={{width:width-24,height:200}}/>*!/*/}
                    {/*/!*        </View>*!/*/}
                    {/*/!*        <View style={{marginTop:18,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>*!/*/}
                    {/*/!*            <Image source={Images.DIANPU} style={{width:16,height:16}}/>*!/*/}
                    {/*/!*            <ASText text={this.state.slogan} style={{fontSize:15,color:'#3d3d3d',marginLeft: 15}}/>*!/*/}
                    {/*/!*        </View>*!/*/}
                    {/*/!*        <View style={{marginTop:18,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingBottom: 17}}>*!/*/}
                    {/*/!*            <ASText text={this.state.address} style={{fontSize:14,color:'#dcc490'}}/>*!/*/}
                    {/*/!*            <Image source={require('../../images/home/distance.png')} style={{width:13,height:16,marginLeft:33}}/>*!/*/}
                    {/*/!*            <ASTouchableOpacity style={{paddingLeft: 21}} onPress={()=>{this.onPressPhone()}}>*!/*/}
                    {/*/!*                <Image source={require('../../images/home/phone.png')} style={{width:15,height:15}}/>*!/*/}
                    {/*/!*            </ASTouchableOpacity>*!/*/}
                    {/*/!*        </View>*!/*/}
                    {/*/!*    </View>*!/*/}
                    {/*/!*    {this.renderHtml()}*!/*/}
                    {/*/!*    {this.renderCommit()}*!/*/}
                    {/*      */}
                    {/*    /!*</View>*!/*/}
                    {/*// </ScrollView>*/}
                <View style={{height:57,backgroundColor:'white',flexDirection:'row',marginTop:1}}>
                    <View style={{flexDirection:'row',flex:1}}>
                        {/*<View style={{flexDirection:'row',alignItems:'center',flex:1}}>*/}
                        {/*    <ASTouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>*/}
                        {/*        /!*<Image source={require('../../images/home/phone.png')} style={{width:15,height:15}}/>*!/*/}
                        {/*        <Image source={Images.NoCollection} style={{width:20,height:17}}/>*/}
                        {/*        <ASText text={'收藏'} style={{fontSize:12,color:'#3d3d3d',marginTop:5}}/>*/}
                        {/*    </ASTouchableOpacity>*/}
                        {/*    <View style={{width:1,height:30,backgroundColor:'#d8d8d8'}}></View>*/}
                        {/*</View>*/}
                        <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                            <ASTouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.setState({showKeyboard:true})}}>
                                {/*<Image source={require('../../images/home/phone.png')} style={{width:15,height:15}}/>*/}
                                <Image source={require('../../images/home/liuyan.png')} style={{width:20,height:20}}/>
                                <ASText text={'留言'} style={{fontSize:12,color:'#3d3d3d',marginTop:5}}/>
                            </ASTouchableOpacity>
                            <View style={{width:1,height:30,backgroundColor:'#d8d8d8'}}></View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                            <ASTouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>{
                                this.onPressShopAgree()
                            }}>
                                {/*<Image source={require('../../images/home/phone.png')} style={{width:15,height:15}}/>*/}
                                <Image source={this.state.isAgree?Images.ZANSELECT:Images.ZAN} style={{width:17,height:17}}/>
                                <ASText text={'点赞'} style={{fontSize:12,color:'#3d3d3d',marginTop:5}}/>
                            </ASTouchableOpacity>
                        </View>
                    </View>
                    <ASTouchableOpacity style={{width:108,height:57,justifyContent:'center',alignItems:'center',backgroundColor:'#ff9c56'}} onPress={()=>{this.onPressPhone()}}>
                        <ASText text={'电话'} style={{fontSize:16,color:'white'}}/>
                    </ASTouchableOpacity>
                </View>
                <SendMessage
                    showKeyboard={this.state.showKeyboard}
                    onBlur={this.onBlur}
                    onChangeText={this.onChangeText}
                    sendMessage={this.sendMessage}
                    textInput={this.state.textInput}
                    canSubmit={this.state.canSubmit}
                    placeholder={this.state.placeholder}
                />
                <ActionSheet
                    ref="actionSheet"
                    title={'选择地图'}
                    options={['取消','高德地图','百度地图']}
                    cancelButtonIndex={0}
                    onPress={(i)=>this.handlePress(i)}
                />
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F4EF',
    },
})
