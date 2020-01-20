
/**
 *@FileName Chat.js
 *@desc (乐聊)
 *@author chenbing
 *@date 2018/10/30 10:54
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, AsyncStorage, DeviceEventEmitter} from 'react-native';
import BListView  from '../../components/BListView'
import containers from '../../containers/containers'
import colors from '../../../Resourse/Colors'
import Images from '../../../Resourse/Images'
import JMessage from 'jmessage-react-plugin';
import DateUtils from '../../../Resourse/DateUtil'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Config from '../../../Resourse/Config'
import Toast from "@remobile/react-native-toast/index";
import SwiperCompoent from '../../components/SwidperComponent'
import ChatListCell from './ChatListCell'
import ASText from '../../components/ASText'
@containers()
export default class ChatList extends Component{
    constructor(props){
        super(props)
        this.getConversations=this.getConversations.bind(this)
        this.state={
            data:[],
            isPulling:false,
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'热聊',
            hiddenBackBtn:true,
        });
        this.getConversations()
        //监听
        JMessage.addReceiveMessageListener(()=>{
            this.getConversations()
        })
        this.chat= DeviceEventEmitter.addListener('chat',()=>{
            this.getConversations()
        });
        this.shuaxin=DeviceEventEmitter.addListener('shuaxin',()=>{
            this.getConversations()
        });
        this.del=DeviceEventEmitter.addListener('delFriend',(item)=>{
            for(let i=0;i<this.state.data.length;i++){
                let param=this.state.data[i]
                if(item.imUsername==param.target.username){
                    this.onclickDel(param)
                    break;
                }
            }
        })

    }
    backSuccess(){
        this.getConversations()
    }
    /**
     *@desc   点击动态
     *@author 张羽
     *@date   2018/12/19 下午4:18
     *@param
     */
    onPressCrycle(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.props.push('FriendCrycle',{userInfo:userinfo})
                }
            }
        })
    }
    /**
     *@desc   点击我的好友
     *@author 张羽
     *@date   2019/2/20 下午3:36
     *@param
     */
    onPressFriendList(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.props.push('MyFriednList',{userInfo:userinfo})
                }
            }
        })
    }
    /**
     *@desc   获取会话列表
     *@author 张羽
     *@date   2018/11/30 上午10:00
     *@param
     */
    getConversations(){
        JMessage.getConversations((conArr) => {
            console.log('....获取会话列表',conArr)
            this.setState({
                data:conArr,
                isPulling:false
            })
        }, (error) => {
           console.log('....获取会话列表失败',error)
            var code = error.code
            var desc = error.description
            Toast.showShortCenter(desc)
            this.setState({
                isPulling:false
            })
        })
    }
    /**
     *@desc   上啦刷新
     *@author 张羽
     *@date   2019/3/3 下午10:05
     *@param
     */
    onPull(){
        if(this.state.isPulling)return
        this.setState({
            isPulling:true
        })
        this.getConversations()
    }
    /**
     *@desc   删除
     *@author 张羽
     *@date   2019/3/19 上午12:15
     *@param
     */
    onclickDel(item){
        JMessage.deleteConversation({ type: 'single', username: item.target.username, appKey:  Config.JImAppkey },
            (conversation) => {
                // do something.
                this.getConversations()
            }, (error) => {
                var code = error.code
                var desc = error.description
                Toast.showShortCenter(desc)
            })
    }
    /**
     *@desc   点击聊天
     *@author 张羽
     *@date   2018/11/30 上午11:01
     *@param
     */
    onPressChat(item){
        if (Platform.OS === 'android') {
            JMessage.enterConversation({type: 'single', username: item.target.username, appKey: Config.JImAppkey},
                (conversation) => {
                    // do something.
                    AsyncStorage.getItem('userInfo', (error, result) => {
                        if (!error) {
                            if (result != null) {
                                let userinfo = JSON.parse(result)
                                let name = item.target.nickname ? item.target.nickname : item.target.username
                                this.props.push('ConversationPage', {
                                    title: name,
                                    username: item.target.username,
                                    loginName: userinfo.imUsername,
                                    backSuccess: () => {
                                        this.backSuccess()
                                    }
                                })
                            }
                        }
                    })
                }, (error) => {
                    var code = error.code
                    var desc = error.description
                    Toast.showShortCenter(desc)
                })
        }else{
            AsyncStorage.getItem('userInfo', (error, result) => {
                if (!error) {
                    if (result != null) {
                        let userinfo = JSON.parse(result)
                        let name = item.target.nickname ? item.target.nickname : item.target.username
                        this.props.push('ConversationPage', {
                            title: name,
                            username: item.target.username,
                            loginName: userinfo.imUsername,
                            backSuccess: () => {
                                this.backSuccess()
                            }
                        })
                    }
                }
            })
        }
    }
    /**
     *@desc   cell
     *@author 张羽
     *@date   2019/1/24 下午5:11
     *@param
     */
    renderRow(rowData,sectionId,rowId){
        if(!rowData.latestMessage) return null
        let time=DateUtils.getDateStr(rowData.latestMessage?rowData.latestMessage.createTime:'')
        let title=rowData.latestMessage.type==='image'?'[图片]':rowData.latestMessage.type==='voice'?'[语音]':rowData.latestMessage.text
        let isShowPoint=rowData.unreadCount>0?true:false
        let name=rowData.target.nickname?rowData.target.nickname:rowData.target.username
        return(
            <SwiperCompoent onclickDel={()=>{this.onclickDel(rowData)}}>
                <ASTouchableOpacity style={{paddingHorizontal:12,backgroundColor:'white'}} onPress={()=>{this.onPressChat(rowData)}} activeOpacity={1}>
                    {/*<View style={{paddingVertical:8,borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio,flexDirection:'row',alignItems:'center'}}>*/}
                        {/*<View >*/}
                            {/*{rowData.target.avatarThumbPath?<Image source={{uri:('file://'+rowData.target.avatarThumbPath)}} style={{width:45,height:45,borderRadius:22.5,backgroundColor:colors.BACK_COLOR}}/>:*/}
                                {/*<Image source={Images.ICON} style={{width:45,height:45,borderRadius:22.5,backgroundColor:colors.BACK_COLOR}}/>*/}
                            {/*}*/}
                            {/*{isShowPoint? <View  style={styles.pointView}></View>:null}*/}
                        {/*</View>*/}
                        {/*<View style={{flex:1,justifyContent:'center',marginLeft:9}}>*/}
                            {/*<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>*/}
                                {/*<Text style={{fontSize:17,color:colors.CHATTEXT}}>{name}</Text>*/}
                                {/*<Text style={{fontSize:12,color:colors.TIME}}>{time}</Text>*/}
                            {/*</View>*/}
                            {/*<Text style={{fontSize:14,color:colors.TIME,marginTop:9}} numberOfLines={1}>{title}</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    <ChatListCell
                        isShowPoint={isShowPoint}
                        name={name}
                        title={title}
                        time={time}
                        rowData={rowData}

                    />
                </ASTouchableOpacity>
            </SwiperCompoent>
        )
    }
    /**
     *@desc   系统消息
     *@author 张羽
     *@date   2019/1/24 下午5:11
     *@param
     */
    renderHeader(){
        // return(
        //     {/*<View style={{paddingHorizontal:12,height:60,borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio,justifyContent:'center'}}>*/}
        //         {/*<Text  style={{fontSize:17,color:colors.CHATTEXT}}>{'消息中心'}</Text>*/}
        //     {/*</View>*/}
        // )
        return null
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <View style={styles.topCellView}>
                        <ASText style={{fontSize:28,fontWeight:'bold',color:colors.CHATTEXT}} text={'消息'}/>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <ASTouchableOpacity onPress={()=>{this.onPressFriendList()}}>
                                 <ASText style={{fontSize:15,color:colors.CHATTEXT}} text={'我的好友'}/>
                            </ASTouchableOpacity>
                            <ASTouchableOpacity onPress={()=>{this.onPressCrycle()}}>
                                 <ASText style={{fontSize:15,color:colors.CHATTEXT,marginLeft:20}} text={'动态'}/>
                            </ASTouchableOpacity>
                        </View>
                    </View>
                </View>
                <BListView
                    data={this.state.data}//设置数据源
                    renderRow={(rowData,sectionId,rowId)=>this.renderRow(rowData,sectionId,rowId)}//返回cell
                    style={[styles.listView]}
                    enableEmptySections = {true}
                    renderSeparator={()=>{return null}}//分割线
                    removeClippedSubviews={true}
                    renderHeader={()=>this.renderHeader()}
                    isPulling={this.state.isPulling}
                    enablePull={true}
                    onPull={()=>{this.onPull()}}
                    ref='scrollView'
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    topView:{
        height:44,
        paddingHorizontal:12,
    },
    topCellView:{
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:colors.LINE,
        paddingRight:14,
        flexDirection:'row',
        height:44,
        alignItems:'center'
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
});
