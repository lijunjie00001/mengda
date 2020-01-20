import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, ImageBackground, DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import {width} from "../../../Resourse/CommonUIStyle";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FriendList from './FriendListPage'
import FriendPublish from "./publishFriendPage";
import ASText from '../../components/ASText'
import PictureActionSheet from "../../components/PictureActionSheet";
@containers()
export default class FriendCryclePage extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object
    }
    constructor(props){
        super(props)
        this.state={
            icon:this.props.userInfo?this.props.userInfo.cover:'',
            uid: this.props.userInfo?this.props.userInfo.id+'':'',
            background:this.props.userInfo.background?this.props.userInfo.background:''
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'动态',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressPublish()}}>
                <Image source={Images.CAMERA} style={{width:25,height:25}}/>
            </ASTouchableOpacity>
        });

    }
    /**
     *@desc   点击发布
     *@author 张羽
     *@date   2018/12/19 下午8:36
     *@param
     */
    onPressPublish(){
        this.props.push('FriendPublish',{transition:'forVertical',uid:this.state.uid})
    }

    /**
     *@desc   点击背景
     *@author 张羽
     *@date   2019-08-28 02:15
     *@param
     */
    onPressBack(){
        this.refs.picture.show()
    }
    /**
     *@desc   获取图片
     *@author 张羽
     *@date   2018/12/19 下午8:56
     *@param
     */
    onGetImage(info){
        console.log('........kkk',info)
        let imageStr='data:'+info.mime+';base64,'+info.data
        this.props.fetchData(this, '', Url.changeBackground(this.state.uid,imageStr), {}, successCallback = (data) => {
            console.log('............同城推荐',data)
            this.setState({
                background:imageStr
            })
            let userinfo={
                ...this.props.userInfo,
                background:imageStr
            }
            AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
            DeviceEventEmitter.emit('login',userinfo)
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   标签
     *@author 张羽
     *@date   2018/12/17 下午2:05
     *@param
     */
    renderTabber(props){
        let array=[
            {
                title:'我的动态',
            }, {
                title:'好友动态',
            }, {
                title: '附近动态',
            }
        ]
        return(
            <View stylle={{flexDirection:'column'}}>
                <ASTouchableOpacity style={{height:72,width:width}} onPress={()=>{this.onPressBack()}}></ASTouchableOpacity>
                <View style={styles.Tabber}>
                    <View style={{flexDirection:'row'}}>
                        {array.map((item,i)=>{
                            return(
                                <ASTouchableOpacity key={i} style={[{alignItems:'center',marginTop:9},i!=0?{marginLeft:30}:{}]} onPress={()=>{props.goToPage(i)}}>
                                    <ASText  style={[{fontSize:15,color:colors.WHITE,backgroundColor:colors.TRANSPARENT_COLOR},props.activeTab==i?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={item.title}></ASText>
                                    <View  style={[{height:2,width:18,backgroundColor:colors.CHATBUDDLE,marginTop:5},props.activeTab!==i?{backgroundColor:colors.TRANSPARENT_COLOR}:null]}></View>
                                </ASTouchableOpacity>
                            )
                        })}
                    </View>
                    <ASTouchableOpacity onPress={()=>{this.onPressBack()}}>
                        <Image source={{uri:this.state.icon}} style={{width:55,height:55,borderRadius:27.5}}/>
                    </ASTouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     *@desc   渲染分类标签的每个页面
     *@author 张羽
     *@date   2018/9/10 下午8:47
     *@param
     */
    renderListViewWithType(type){
        let tabLabel='';
        let status='';
        switch (type){
            case 0:
                tabLabel = '我的动态';
                status='0'
                break;
            case 1:
                tabLabel = '好友动态';
                status='1';
                break;
            case 2:
                tabLabel = '附近动态';
                status='2';
                break;
            default:
                break;
        }
        return (
            <View style={{flex:1}} tabLabel={tabLabel}>
                <FriendList {...this.props} uid={this.state.uid} status={status} pageId={'friend'+type} userInfo={this.props.userInfo}/>
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                <ImageBackground source={this.state.background?{uri:this.state.background}:Images.FriendCrycle} style={styles.ImageBackgroundView}/>
                <ScrollableTabView
                    initialPage={this.state.tabIndex}
                    style={{flex:1}}
                    contentProps={{keyboardShouldPersistTaps:'always'}}
                    renderTabBar={(props) =>this.renderTabber(props)}
                    ref={'ScrollableTabView'}
                >
                    {this.renderListViewWithType(0)}
                    {this.renderListViewWithType(1)}
                    {this.renderListViewWithType(2)}
                </ScrollableTabView>
                <PictureActionSheet
                    ref={'picture'}
                    onSuccess={this.onGetImage.bind(this)}
                    includeBase64={true}
                    multiple={false}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
    },
    ImageBackgroundView:{
        width:width,
        height:112,
        position: 'absolute',
        left:0,
        top:0
    },
    Tabber:{
        flexDirection:'row',
        paddingLeft:13,
        paddingRight:17,
        justifyContent:'space-between'
    }
})
