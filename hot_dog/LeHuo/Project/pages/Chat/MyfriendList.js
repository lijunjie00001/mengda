import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions, Platform,FlatList,Text,Image,DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import BImage from '../../components/BImage'
import JMessage from 'jmessage-react-plugin';
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import SwiperCompoent from '../../components/SwidperComponent'
import Config from '../../../Resourse/Config'
import NavBar from '../../components/NavBar'
import ASText from '../../components/ASText'
@containers()
export default class MyfriendList extends Component {
    static propTypes = {
        userInfo:React.PropTypes.object
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.getFriendData=this.getFriendData.bind(this)
        this.state={
            data:[],
            refreshing:false,
            isFriend:false
        }
    }
    componentWillUnmount(){
        DeviceEventEmitter.emit('shuaxin')
        this.addfriend.remove()
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'我的好友',
            hiddenNav:true
        });
        this.getData()
        this.getFriendData()
        this.addfriend=DeviceEventEmitter.addListener('addfriend',()=>{
            this.getData()
            this.getFriendData()
        });
    }
    /**
     *@desc   添加好友
     *@author 张羽
     *@date   2019/2/20 下午4:02
     *@param
     */
    onPressAdd(){
        this.props.push('AddFriend',{uid:this.props.userInfo.id})
    }
    /**
     *@desc   删除好友
     *@author 张羽
     *@date   2019/2/21 下午12:32
     *@param
     */
    onPressDel(item,index){
        this.props.fetchData(this, '', Url.removeFriend(this.props.userInfo.id,item.id), {}, successCallback = (data) => {
            console.log('好友列表',data)
            this.state.data.splice(index,1)
            this.setState({
                data:this.state.data
            })
            DeviceEventEmitter.emit('delFriend',item)
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   获取get
     *@author 张羽
     *@date   2019/2/21 上午11:29
     *@param
     */
    getFriendData(){
        let param={
            uid:this.props.userInfo.id
        }
        this.props.fetchData(this, '', Url.friendRequestList(param), {}, successCallback = (data) => {
            console.log('请求好友列表',data)
            let array=data.info
            let num=0
            for(let dic of array){
                let type=dic.status
                //未添加
                if(type=='0'){
                    num=1
                    break
                }
            }
            this.setState({
                isFriend:num==0?false:true
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   创建聊天
     *@author 张羽
     *@date   2019/2/21 下午12:36
     *@param
     */
    onPressChat(item){
        DeviceEventEmitter.emit('ImloginStatus',(islogin)=>{
            if(islogin){
                let name=item.imUsername
                let nickName=item.username
                JMessage.createConversation({ type: 'single', username: name, appKey:Config.JImAppkey  },
                    (conversation) => {
                        // do something.
                        this.props.push('ConversationPage',{title:nickName,username:name,loginName:this.props.userInfo.imUsername})
                    }, (error) => {
                        var code = error.code
                        var desc = error.description
                        Toast.showShortCenter(desc)
                    })
            }else{
                Toast.showShortCenter('正在登录聊天室，请稍后')
            }
        })
    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2019/3/17 下午6:02
     *@param
     */
    onRefresh(){
        if(this.state.refreshing)return
        this.setState({
            refreshing:true
        })
        this.getData()
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2019/2/20 下午3:40
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.getFriendList(this.props.userInfo.id), {}, successCallback = (data) => {
            console.log('好友列表',data)
            this.setState({
                data:data.info,
                refreshing:false
            })
            return;
        }, failure = (data) => {
            this.setState({
                refreshing:false
            })
            Toast.showShortCenter(data.notice)
        });
    }
    _keyExtractor = (item, index) => 'vip'+index
    renderRow(item,index){
        return(
            <SwiperCompoent onclickDel={()=>{
                this.onPressDel(item,index)
            }}>
                <ASTouchableOpacity  activeOpacity={1} style={{paddingHorizontal:12,flexDirection:'row',alignItems:'center',backgroundColor:'white'}} onPress={()=>{
                    this.onPressChat(item)
                }}>
                    <BImage style={{width:45,height:45,borderRadius:22.5}} source={{uri:item.cover}}/>
                    <View style={{flex:1,marginLeft:10,paddingVertical:13,borderBottomWidth:colors.width_1_PixelRatio,borderBottomColor:colors.LINE,justifyContent:'center',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                        <View style={{paddingVertical:7}}>
                            <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={item.username}></ASText>
                        </View>
                    </View>
                </ASTouchableOpacity>
            </SwiperCompoent>
        )
    }
    renderrightView(){
        return(
            <ASTouchableOpacity style={{paddingRight:12}} onPress={()=>{this.onPressAdd()}}>
                <Image source={Images.ADDFRIEND} style={{width:20,height:17}}/>
                {this.state.isFriend? <View  style={styles.pointView}></View>:null}
            </ASTouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <NavBar title={'我的好友'} rightView={this.renderrightView()} backFunction={()=>{this.props.back()}}/>
                <View style={{height:10,backgroundColor:colors.BackPage}}></View>
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    style={{flex:1}}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{this.onRefresh()}}
                    ListFooterComponent={()=>{
                        return(
                            <View style={{alignItems:'center',paddingVertical:10}}>
                                <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    pointView:{
        width:9,
        height:9,
        borderRadius:4.5,
        backgroundColor:colors.POINT,
        position:'absolute',
        right:0,
        top:0
    }
})
