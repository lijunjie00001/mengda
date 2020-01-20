
/**
 *@FileName My.js
 *@desc (我的)
 *@author chenbing
 *@date 2018/10/30 09:54
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    AsyncStorage, DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from '../../../Resourse/Colors'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import MyjfPage from "./MyjfPage";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import MySetingPage from "./MySetingPage";
const orderClassListData = [
	{
		title:'待处理',
		pic:require('../../images/my/willOrder.png')
	},
	{
		title:'已取消',
		pic:require('../../images/my/shipped.png')
	},
	{
		title:'已完成',
		pic:require('../../images/my/receiving.png')
	},
    {
        title:'全部订单',
        pic:require('../../images/my/allOrder.png')
    }
];
const personFunctionListData = [
    {
		title:'收藏夹',
		pic:require('../../images/my/collect.png')
	},
	{
		title:'vip权益信息',
		pic:require('../../images/my/vip.png')
	},
	{
		title:'积分',
		pic:require('../../images/my/itegral.png')
	},
	{
		title:'设置',
		pic:require('../../images/my/setting.png')
	},
];
import ASText from '../../components/ASText'
import PictureActionSheet from "../../components/PictureActionSheet";
@containers()
export default class My extends Component<Props> {
    constructor(props){
        super(props)
        this.getUserInfo=this.getUserInfo.bind(this)
        this.getJifen=this.getJifen.bind(this)
        this.state={
            icon:'', //头像
            name:'', //名字
            uid:'' ,  //用户ID
            userInfo:{},
            isUp:false ,//是否上架,
            background:'',
            integral:'',//积分
        }
    }
    componentWillUnmount() {
        if (this.login) {
            this.login.remove()
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'我的',
            hiddenNav:true
        });
        //登录消息
        this.login=DeviceEventEmitter.addListener('login',(userinfo)=>{
            this.getUserInfo()
        });
        this.getUserInfo()
        this.getInappStore()
        // this.getBackImage()
    }
    /**
     *@desc   是否上架
     *@author 张羽
     *@date   2019/4/17 下午10:52
     *@param
     */
    getInappStore(){
        this.props.fetchData(this, '', Url.isUp(), {}, successCallback = (data) => {
            console.log('........data',data.info)
            this.setState({
                isUp:data.info!=1&&Platform.OS != 'android'?false:true,
            })
            return;
        }, failure = (data) => {
        });
    }

    /**
     *@desc   获取积分
     *@author 张羽
     *@date   2019-09-12 22:09
     *@param
     */
    getJifen(){
        this.props.fetchData(this, '', Url.getUserInfoForApi(this.state.uid), {}, successCallback = (data) => {
            console.log('........积分',data.info)
            this.setState({
                integral:data.info.integral
            })
            return;
        }, failure = (data) => {
        });
    }
    /**
     *@desc   获取背景图片
     *@author 张羽
     *@date   2019-08-19 18:25
     *@param
     */
    getBackImage(){
        this.props.fetchData(this, '', Url.getBackImage(1), {}, successCallback = (data) => {
            console.log('........获取背景图片',data.info)
            return;
        }, failure = (data) => {
        });
    }
    /**
     *@desc   获取登录信息
     *@author 张羽
     *@date   2019/2/22 下午5:31
     *@param
     */
    getUserInfo(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    console.log('..........userinfo',userinfo)
                    this.setState({
                        name:userinfo.username,
                        icon:userinfo.cover,
                        uid:userinfo.id+'',
                        userInfo:userinfo,
                        background:userinfo.background
                    },()=>{
                        this.getJifen()
                    })
                }
            }
        })
    }
    onPressMyInfo(){
        this.props.push('MyinfoPage')
    }

    /**
     *@desc   点击背景图片
     *@author 张羽
     *@date   2019-09-06 22:16
     *@param
     */
    onPressBackImage(){
        this.refs.picture.show()
    }
    /**
     *@desc   获取图片
     *@author 张羽
     *@date   2018/12/19 下午8:56
     *@param
     */
    onGetImage(info){
        let imageStr='data:'+info.mime+';base64,'+info.data
        this.props.fetchData(this, '', Url.changeBackground(this.state.uid,imageStr), {}, successCallback = (data) => {
            console.log('............同城推荐',data)
            this.setState({
                background:imageStr
            })
            let userinfo={
                ...this.state.userInfo,
                background:imageStr
            }
            AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
	/**
	 *@desc 点击订单分类的每一项
	 *@author chenbing
	 *@date 2018/10/30 18:37
     * @param type 订单类型
	 */
	clickOrderClassListItem(type){
        switch(type){
            case '全部订单':
                this.props.push('MyOrderPaye',{tabIndex:0,uid:this.state.uid})
                break;
            case '待处理':
                this.props.push('MyOrderPaye',{tabIndex:1,uid:this.state.uid})
                break;
	        case '已取消':
                this.props.push('MyOrderPaye',{tabIndex:2,uid:this.state.uid})
		        break;
	        case '已完成':
                this.props.push('MyOrderPaye',{tabIndex:3,uid:this.state.uid})
		        break;
        }
    }

	/**
	 *@desc 点击个人功能列表项
	 *@author chenbing
	 *@date 2018/10/30 20:03
	 *@param type 功能类型
	 */
	clickPersonFunction(type){
		switch(type){
			case '收藏夹':
                this.props.push('MyCollection',{userInfo:this.state.userInfo,isUp:this.state.isUp})
				break;
			case '优惠券':
                this.props.push('MyyouhuijuanPage',{userInfo:this.state.userInfo})
				break;
			case 'vip权益信息':
                this.props.fetchData(this, '', Url.myEquity(this.state.uid), {}, successCallback = (data) => {
                    this.props.push('MyvipPage',{userInfo:this.state.userInfo})
                    return;
                }, failure = (data) => {
                    Toast.showShortCenter(data.notice)
                    DeviceEventEmitter.emit('vippay')
                });
				break;
			case '积分':
				this.props.push('MyjfPage',{userInfo:this.state.userInfo})
				break;
			case '设置':
			    this.props.push('MySetingPage',{isUp:this.state.isUp})
				break;
		}
	}

	/**
	 *@desc 渲染订单分类列表
	 *@author chenbing
	 *@date 2018/10/30 18:38
	 */
	renderOrderClassList(){
        return(
            <View style={styles.orderClassListView}>
                {orderClassListData.map((item,i)=>{
                    return (
                        <TouchableOpacity key={i} onPress={()=>this.clickOrderClassListItem(item.title)}>
                            <View>
                                <Image source={item.pic} style={styles.orderClassListImg}/>
                                <ASText style={{fontSize:12,color:'#3d3d3d',}} text={item.title}></ASText>
                            </View>
                        </TouchableOpacity>
                    );

                })}
            </View>
        )
    }
	/**
	 *@desc 渲染个人功能列表
	 *@author chenbing
	 *@date 2018/10/30 20:01
	 */
	renderPersonFunctionList(){
		return (
			<View style={{width:'100%',marginTop:10}}>
				{
					personFunctionListData.map((item,i)=>{
					    if(item.title==='vip权益信息'&&!this.state.isUp){
                            return<View key={i}></View>
                        }
						return (
							<TouchableOpacity
								style={[styles.functionListItemView,{marginTop:(i==3)?10:0}]}
								key={i}
							    onPress={()=>this.clickPersonFunction(item.title)}
							>
								<View style={styles.functionListItemInnerView}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Image source={item.pic} style={styles.functionListImg}/>
                                        <ASText text={item.title} style={{fontSize:14,color:'#3d3d3d'}}></ASText>
                                    </View>
                                    {item.title=='积分'?<ASText text={'拥有积分:'+this.state.integral} style={{fontSize:14,color:'#3d3d3d'}}/>:null}
									<Image source={require('../../images/my/rightArrow.png')} style={styles.rightArrowImg}/>
								</View>
							</TouchableOpacity>
						)
					})
				}
			</View>
		);

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <View style={{width:width,height:188}}>
                        <ImageBackground source={this.state.background?{uri:this.state.background}:require('../../images/login/bg.jpg')}
                               style={{width:width,height:188}} >
                            <ASTouchableOpacity style={styles.personView}  onPress={()=>{this.onPressBackImage()}}>
                                <ASTouchableOpacity onPress={()=>{this.onPressMyInfo()}}
                                    style={{alignItems:'center',backgroundColor:colors.TRANSPARENT_COLOR,justifyContent: 'center'}}>
                                    {this.state.icon?<Image source={{uri:this.state.icon}} style={styles.personImg}/>:<Image source={require("../../images/login/icon.png")} style={styles.personImg}/>}
                                    <ASText style={styles.personMsg} text={this.state.name}></ASText>
                                </ASTouchableOpacity>
                            </ASTouchableOpacity>
                        </ImageBackground>
                    </View>
                    {/*{this.state.isUp?<View style={{backgroundColor:'#fff',width:'100%',height:73}}/>:null}*/}
                    {/*订单分类*/}
                    {this.state.isUp?this.renderOrderClassList():null}
                </View>
	            {/*个人功能列表*/}
	            {this.renderPersonFunctionList()}
                <PictureActionSheet
                    ref={'picture'}
                    onSuccess={this.onGetImage.bind(this)}
                    includeBase64={true}
                    multiple={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F4EF',
    },
	topView:{},
	personView:{
        width:width,
        height:188,
        paddingHorizontal:15,
        justifyContent:'center',
        alignItems:'center'
    },
    personImg:{
	    width:48,
        height:48,
        borderRadius:24
    },
    personMsg:{
        fontSize:16,
        color:'#fff',
        fontWeight:'bold',
        marginTop:9
    },
	orderClassListView:{
        width:width,
        height:77,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical: 20,
        backgroundColor:'white',
        paddingHorizontal:44
    },
    orderClassListImg:{
        width:30,
        height:30,
        resizeMode:'contain',
        alignSelf:'center',
        marginBottom:5,
    },
	functionListItemView:{
		width:width,
		paddingHorizontal:15,
		backgroundColor:'#fff',
    },
	functionListItemInnerView:{
    	flexDirection:'row',
		alignItems:'center',
		height:50,
		borderBottomColor:'#eee',
		borderBottomWidth:0.5,
        justifyContent:'space-between',
        paddingRight: 15
	},
	functionListImg:{
    	width:30,
		height:30,
		resizeMode:'contain',
		marginRight:10
	},
	rightArrowImg:{
    	position:'absolute',
		right:0,
		width:8,
		height:16,
	}
});
