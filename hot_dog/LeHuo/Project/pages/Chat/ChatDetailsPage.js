import React, {Component} from 'react';
import {
    Platform, StyleSheet, View, Keyboard, ActivityIndicator, TouchableOpacity, Image,
    DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from '../../../Resourse/Colors'
import Images from '../../../Resourse/Images'
import JMessage from 'jmessage-react-plugin';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PictureActionSheet from '../../components/PictureActionSheet'
import MessageText from './MessageText'
import MessageImage from './MessageImage'
import MessageVoice from './MessageVoice'
const uuid = require('uuid');
import MessageContainer from './MessageContainer'
import MessageTextBar  from './MessageTextBar'
import Config from '../../../Resourse/Config'
import TimePicker from "../../../Resourse/TimePicker";
import CommonPicker from "../../../Resourse/CommonPicker";
import MessageDaraoPage from "./MessageDaraoPage";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
@containers()
export default class ChatDetailsPage extends Component{
    static propTypes = {
        title:React.PropTypes.string, //标题
        username:React.PropTypes.string, //用户名
        loginName:React.PropTypes.string,  //本身登录名
        backSuccess:React.PropTypes.func,  //返回回调
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.getConversation=this.getConversation.bind(this)
        this.ListFooterComponent=this.ListFooterComponent.bind(this)
        this.renderMessageContainer=this.renderMessageContainer.bind(this)
        this.onPull=this.onPull.bind(this)
        this.onEndEditing=this.onEndEditing.bind(this)
        this.onGetImage=this.onGetImage.bind(this)
        this.onSend=this.onSend.bind(this)
        this.onTouchStart=this.onTouchStart.bind(this)
        this.onSollview=this.onSollview.bind(this)
        this.onCLick=this.onCLick.bind(this)
        this.onMessageError=this.onMessageError.bind(this)
        this.getIcon=this.getIcon.bind(this)
        this.onClickIcon=this.onClickIcon.bind(this)
        this.limit=15
        this.from=0
        this.state={
            messages:[],
            refreshing:false,
            canMore:true,
        }
    }
    componentWillUnmount(){
       if(this.props.backSuccess){
           this.props.backSuccess()
       }
       JMessage.removeReceiveMessageListener(this.listener)
        if (Platform.OS === 'android') {
            JMessage.exitConversation();
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.title,
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                     <Image source={Images.ChatMessageDarao} style={{width:14.5,height:18}}/>
            </ASTouchableOpacity>
        });
        this.getConversation(false)
        this.resetUnreadMessageCount()
        //监听消息
        this.listener = (param) => {
            // 收到的消息会返回一个消息对象.
            if(param.from.username!==this.props.username){
                //收到的消息不是对象聊天
                return
            }
            let userName=this.props.username
            let message={
                _id: uuid.v4(),
                text:param.type==='text'?param.text:'',
                createdAt:param.createTime,
                image:param.type=='image'?param.thumbPath:'',
                isShowLoading:false, //发送状态
                fail:false,//是否失败
                user: {
                    _id: param.from.username!==userName?1:2,
                    name:  param.from.nickname? param.from.nickname:param.from.username,
                    avatar: param.from.avatarThumbPath,
                },
                type:param.type,
                fromUser:{
                    ...param.from,
                    _id: param.from.username!==userName?1:2,
                },
                messageId:param.id,
                path:param.path?param.path:'',
                duration:param.duration?param.duration:'',
                accoutId:param.from.username
            }
            let isFa=false
            if(Platform.OS=='android'){
                for(let i=0;i<this.state.messages.length;i++){
                    let newparam=this.state.messages[i]
                    if(newparam.fromUser._id==message.fromUser._id){
                        if( newparam.user.avatar!=message.user.avatar&&!isFa) {
                            isFa=true
                            let obj={
                                iconPath:message.user.avatar,
                                id:message.fromUser._id,
                            }
                            DeviceEventEmitter.emit('uploadAndroid',obj)
                        }
                        newparam.user.avatar=message.user.avatar
                    }
                }
            }
            this.state.messages.splice(0,0,message)
            this.setState({
                messages:this.state.messages
            },()=>{
                this.resetUnreadMessageCount()
            })
        }
        JMessage.addReceiveMessageListener(this.listener)
    }
    /**
     *@desc   处理数据
     *@author 张羽
     *@date   2019/6/28 下午6:32
     *@param
     */
    prepareMessages(messages) {
        return messages.reduce((o, m, i) => {
            const previousMessage = messages[i + 1] || {}
            const nextMessage = messages[i - 1] || {}
            o.push({
                ...m,
                previousMessage,
                nextMessage
            })
            return o
        }, [])
    }
    /**
     *@desc   处理相加数据
     *@author 张羽
     *@date   2019/6/29 上午11:26
     *@param
     */
    chuliData(array,isMore){
        if(isMore){

        }else{
            this.setState({
                messages:this.prepareMessages(array)
            })
        }
    }
    /**
     *@desc   修改头像
     *@author 张羽
     *@date   2019/5/5 上午12:28
     *@param
     */
    getIcon(){
        JMessage.downloadOriginalUserAvatar({ username:this.props.username, appKey:Config.JImAppkey  },
            (userInfo) => {
                // do something.
                console.log('..........userInfo',userInfo)
                let filePath=userInfo.filePath
                for(let dic of this.state.messages){
                    if(dic.fromUser._id==2){
                        dic.user.avatar=filePath
                    }
                }
                this.setState({
                    messages:this.state.messages
                })
            }, (error) => {
                console.log('.........错误',error)
            })
    }
    /**
     *@desc   消息免打扰
     *@author 张羽
     *@date   2019/3/5 上午12:26
     *@param
     */
    onPressSave(){
        this.props.push('MessageDaraoPage',{loginName:this.props.loginName,username:this.props.username})
    }
    /**
     *@desc   flatlistView 点击方法
     *@author 张羽
     *@date   2019/1/24 下午4:39
     *@param
     */
    onTouchStart(){
        this.MessageTextBar.onTouchStart()
    }
    /**
     *@desc   flatlist 滚动
     *@author 张羽
     *@date   2019/1/24 下午4:39
     *@param
     */
    onSollview(){
        this.MessageTextBar.onScroll()
    }
    /**
     *@desc   点击
     *@author 张羽
     *@date   2019/1/24 下午5:16
     *@param
     */
    onCLick(){
        this.MessageContainer.sclloviewTop()
    }
    /*
     * 重制聊天未读数
     */
    resetUnreadMessageCount(){
        JMessage.resetUnreadMessageCount({ type: 'single', username: this.props.username, appKey: Config.JImAppkey },
            (conversation) => {
                // do something.
                console.log('....重制聊天未读数')
            }, (error) => {

            })
    }
    /**
     *@desc   获取聊天
     *@author 张羽
     *@date   2018/12/3 下午1:32
     *@param
     */
    getConversation(ismore){
        let userName=this.props.username
        JMessage.getHistoryMessages({ type: 'single', username: userName, appKey: Config.JImAppkey,from: this.from,limit: this.limit,isDescend:Platform.OS === 'android'?true:false },
            (conversation) => {
                // do something
                console.log('.......kk',conversation)
                let array=[]
                for(let i=0;i<conversation.length;i++){
                    let param=conversation[i]
                    let message={
                        _id: uuid.v4(),
                        text:param.type==='text'?param.text:'',
                        createdAt:param.createTime,
                        image:param.type=='image'?param.thumbPath?param.thumbPath:'':'',
                        isShowLoading:false, //发送状态
                        fail:false,//是否失败
                        user: {
                            _id: param.from.username!==userName?1:2,
                            name:  param.from.nickname? param.from.nickname:param.from.username,
                            avatar: param.from.avatarThumbPath,
                        },
                        type:param.type,
                        fromUser:{
                            ...conversation.from,
                            _id: param.from.username!==userName?1:2,
                        },
                        messageId:param.id,
                        path:param.path?param.path:'',
                        duration:param.duration?param.duration:'',
                        accoutId:param.from.username
                    }
                    array.push(message)
                }
                console.log('...........lll',array)
                // this.chuliData(array,ismore)
                this.setState({
                    messages:ismore?this.state.messages.concat(array):array,
                    refreshing:false,
                    canMore:array.length<this.limit?false:true
                })
            }, (error) => {
                var code = error.code
                var desc = error.description
                this.setState({
                    refreshing:false
                })
            })
    }

    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2018/12/29 下午3:42
     *@param
     */
    onRefresh(){
        console.log('......kkk')
        if(!this.state.canMore) return //能否加载
        if(this.state.refreshing)return //加载更多
        this.setState({refreshing:true})
        this.from=parseInt(this.state.messages.length/this.limit)+1
        console.log('............this.from',this.from)
        this.getConversation(true)
    }
    /**
     *@desc   发送文本消息
     *@author 张羽
     *@date   2018/12/23 下午9:33
     *@param
     */
    onEndEditing(text){
        if(!text)return
        let userName=this.props.username
        JMessage.createSendMessage({type: 'single', username: this.props.username, appKey: Config.JImAppkey, messageType: 'text',text:text}, (messagedata) => {
            console.log('message;;;;',messagedata)
            if(messagedata.code==2)return
            let param=messagedata
            let message={
                _id: uuid.v4(),
                text:param.type==='text'?param.text:'',
                createdAt:param.createTime,
                image:param.type=='image'?param.thumbPath:'',
                isShowLoading:true, //发送状态
                fail:false,
                user: {
                    _id: param.from.username!==userName?1:2,
                    name:  param.from.nickname? param.from.nickname:param.from.username,
                    avatar: param.from.avatarThumbPath,
                },
                type:param.type,
                fromUser:{
                    ...messagedata.from,
                    _id: param.from.username!==userName?1:2,
                },
                messageId:messagedata.id,
                path:param.path?param.path:'',
                duration:param.duration?param.duration:'',
            }
            this.state.messages.splice(0,0,message)
            this.setState({
                messages:this.state.messages,
                value:''
            })
            JMessage.sendMessage({id: messagedata.id, type: 'single', username: this.props.username,appKey:Config.JImAppkey,}, (data) => {
                // 成功回调
                console.log('......成功回调',data)
                let param= this.state.messages[0]
                param.isShowLoading=false
                param.fail=false
                this.setState({messages:this.state.messages})
            }, (error) => {
                // 失败回调
                let param= this.state.messages[0]
                param.isShowLoading=false
                param.fail=true
                this.setState({messages:this.state.messages})
                console.log('......失败回调',error)
            })
        })
    }
    /**
     *@desc   点击重发
     *@author 张羽
     *@date   2018/12/24 下午4:32
     *@param
     */
    onMessageError(index,message){
        let param={
            ...message,
            fail:false,
            isShowLoading:true
        }
        this.state.messages.splice(index,1)
        this.state.messages.splice(0,0,param)
        this.setState({
            messages:this.state.messages
        })
        JMessage.sendMessage({id: message.messageId, type: 'single', username: this.props.username,appKey: Config.JImAppkey,}, (data) => {
            // 成功回调
            console.log('......成功回调',data)
            let param= this.state.messages[0]
            param.isShowLoading=false
            param.fail=false
            this.setState({messages:this.state.messages})
        }, (error) => {
            // 失败回调
            let param= this.state.messages[0]
            param.isShowLoading=false
            param.fail=true
            this.setState({messages:this.state.messages})
            console.log('......失败回调',error)
        })
    }
    /**
     *@desc   图片
     *@author 张羽
     *@date   2018/12/11 下午10:06
     *@param
     */
    onGetImage(info){
       console.log('.....info',info,this.props)
        let userName=this.props.username
        let path=Platform.OS === 'android'?info.path.slice(7,info.path.length):info.path
        console.log('..........path',path)
        JMessage.createSendMessage({type: 'single', username: this.props.username, appKey: Config.JImAppkey, messageType: 'image',path:path}, (messagedata) => {
            console.log('message;;;;',messagedata)
            if(messagedata.code==2)return
            if(messagedata.code==1)return
            let param=messagedata
            let message={
                _id: uuid.v4(),
                text:param.type==='text'?param.text:'',
                createdAt:param.createTime,
                image:param.type=='image'?param.thumbPath:'',
                isShowLoading:true, //发送状态
                fail:false,
                user: {
                    _id: param.from.username!==userName?1:2,
                    name:  param.from.nickname? param.from.nickname:param.from.username,
                    avatar: param.from.avatarThumbPath,
                },
                type:param.type,
                fromUser:{
                    ...messagedata.from,
                    _id: param.from.username!==userName?1:2,
                },
                messageId:messagedata.id,
                path:param.path?param.path:'',
                duration:param.duration?param.duration:'',
            }
            this.state.messages.splice(0,0,message)
            this.setState({
                messages:this.state.messages,
            })
            JMessage.sendMessage({id: messagedata.id, type: 'single', username: this.props.username,appKey: Config.JImAppkey,}, (data) => {
                // 成功回调
                console.log('......成功回调',data)
                let param= this.state.messages[0]
                param.isShowLoading=false
                param.fail=false
                this.setState({messages:this.state.messages})
            }, (error) => {
                // 失败回调
                let param= this.state.messages[0]
                param.isShowLoading=false
                param.fail=true
                this.setState({messages:this.state.messages})
                console.log('......失败回调',error)
            })
        })
    }
    /**
     *@desc   发送语音
     *@author 张羽
     *@date   2018/12/25 下午2:58
     *@param
     */
    onSend(info){
        let userName=this.props.username
        console.log('..........jjjuserName',this.props,info)
        JMessage.createSendMessage({type: 'single', username: this.props.username, appKey: Config.JImAppkey, messageType: 'voice',path:info.voice.path}, (messagedata) => {
            console.log('message;;;;',messagedata)
            if(messagedata.code==2)return
            let param=messagedata
            let message={
                _id: uuid.v4(),
                text:param.type==='text'?param.text:'',
                createdAt:param.createTime,
                image:param.type=='image'?param.thumbPath:'',
                isShowLoading:true, //发送状态
                fail:false,
                user: {
                    _id: param.from.username!==userName?1:2,
                    name:  param.from.nickname? param.from.nickname:param.from.username,
                    avatar: param.from.avatarThumbPath,
                },
                type:param.type,
                fromUser:{
                    ...messagedata.from,
                    _id: param.from.username!==userName?1:2,
                },
                messageId:messagedata.id,
                path:param.path?param.path:'',
                duration:param.duration?param.duration:'',
            }
            this.state.messages.splice(0,0,message)
            this.setState({
                messages:this.state.messages,
            })
            JMessage.sendMessage({id: messagedata.id, type: 'single', username: this.props.username,appKey: Config.JImAppkey,}, (data) => {
                // 成功回调
                console.log('......成功回调',data)
                let param= this.state.messages[0]
                param.isShowLoading=false
                param.fail=false
                this.setState({messages:this.state.messages})
            }, (error) => {
                // 失败回调
                let param= this.state.messages[0]
                param.isShowLoading=false
                param.fail=true
                this.setState({messages:this.state.messages})
                console.log('......失败回调',error)
            })
        })
    }
    /**
     *@desc   底部
     *@author 张羽
     *@date   2018/12/24 下午4:53
     *@param
     */
    renderTolBar(){
        let param={
            onSend:this.onSend,
            onEndEditing:this.onEndEditing,
            onGetImage:this.onGetImage,
            onCLick:this.onCLick
        }
        return(
            <View>
                <MessageTextBar {...param}  ref={(MessageTextBar) => {
                    this.MessageTextBar = MessageTextBar
                }}/>
            </View>
        )
    }
    renderRow(item,index){
        if(item.type=='text'){
            return(
                <MessageText Message={item} index={index} MessageError={(index,message)=>{this.onMessageError(index,message)}}/>
            )
        }else if(item.type=='image'){
            return(
                <MessageImage Message={item} index={index} MessageError={(index,message)=>{this.onMessageError(index,message)}}/>
            )
        }else if(item.type=='voice'){
            return(
                <MessageVoice Message={item} index={index} MessageError={(index,message)=>{this.onMessageError(index,message)}} />
            )
        }
    }
    /**
     *@desc   头部
     *@author 张羽
     *@date   2018/12/29 下午3:52
     *@param
     */
    ListFooterComponent(){
        if(this.state.refreshing){
            return(
                <View style={{paddingTop:10,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator
                        color={'#666'}
                        size="small"
                        animating={this.state.refreshing}
                    />
                </View>
            )
        }else{
            return<View></View>
        }
    }
    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019/1/4 下午3:48
     *@param
     */
    onPull(){
        if(this.state.refreshing)return
        if(!this.state.canMore)return
        this.from=this.state.messages.length
        console.log('............this.from',this.from)
        this.setState({refreshing:true},()=>{
            this.getConversation(true)
        })
    }

    /**
     *@desc   点击头像
     *@author 张羽
     *@date   2019-09-20 17:10
     *@param
     */
    onClickIcon(message){
        console.log('.......message',message)
        this.props.push('MyinfoPage',{uid:message.accoutId,isFrom:true})
    }
    /**
     *@desc   list
     *@author 张羽
     *@date   2019/1/4 下午3:44
     *@param
     */
    renderMessageContainer(){
        let param={
            messages:this.state.messages,
            refreshing:this.state.refreshing,
            onPull:this.onPull,
            isComplte:this.state.isComplte,
            onTouchStart:this.onTouchStart,
            onSollview:this.onSollview,
            onMessageError:this.onMessageError,
            username:this.props.username,
            onClickIcon:this.onClickIcon
        }
        return(
            <MessageContainer {...param} ref={(MessageContainer) => {
                this.MessageContainer = MessageContainer
            }}/>
        )
    }
    _keyExtractor = (item, index) => item._id+index
    render(){
        return(
            <View style={styles.container}>
                {this.renderMessageContainer()}
                {this.renderTolBar()}
                {Platform.OS === 'ios'?<KeyboardSpacer topSpacing={0}/>:null}
                <PictureActionSheet
                    ref={'picture'}
                    onSuccess={this.onGetImage.bind(this)}
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
    searchRow: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 4,
        borderWidth:colors.width_1_PixelRatio,
        borderColor:colors.LINE,
        borderRadius:6,
        backgroundColor:colors.WHITE,
        paddingVertical:5,
    },
    searchInput:{
        fontSize:15,
        color:'#999',
        padding:0,
        marginLeft:5,
        textAlignVertical:'top',
    },
})
