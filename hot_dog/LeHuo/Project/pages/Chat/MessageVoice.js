import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, Image, ActivityIndicator, Alert, DeviceEventEmitter
} from 'react-native';
import colors from "../../../Resourse/Colors";
import Images from "../../../Resourse/Images";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Sound from "react-native-sound";
import Toast from "@remobile/react-native-toast/index";
import {AudioRecorder} from "react-native-audio";
import ASText from '../../components/ASText'
import Config from "../../../Resourse/Config";
import JMessage from "jmessage-react-plugin";
import RNFS  from 'react-native-fs'
export default class MessageVoice extends Component{
    static propTypes = {
        Message:React.PropTypes.object,
        index:React.PropTypes.number,
        MessageError:React.PropTypes.func,
    }
    static defaultProps = {
        Message:{}
    }
    constructor(props){
        super(props)
        this.state={
            isPlay:false,
            iconPath:''
        }
    }
    componentWillMount() {
        this.playVoice=DeviceEventEmitter.addListener('playVoice',this.playVoice.bind(this));
        this.uploadIcon=DeviceEventEmitter.addListener('uploadIcon',this.uploadIcon.bind(this));
        this.downIcon(this.props.Message.user.avatar)
    }
    componentWillUnmount() {
        if(this.sound){
            this.sound.release()
        }
        this.playVoice.remove()
        this.uploadIcon.remove()
    }
    uploadIcon(obj){
        if(obj.id===this.props.Message.fromUser._id&&obj.avatarThumbPath!=this.props.Message.user.avatar){
            this.setState({
                iconPath:obj.iconPath
            })
        }
    }
    /**
     *@desc   判断是否刷新
     *@author 张羽
     *@date   2019/6/27 下午2:49
     *@param
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.Message.isShowLoading!==this.props.Message.isShowLoading
            ||nextProps.Message.fail!==this.props.Message.fail
            ||nextProps.Message.user.avatar!==this.props.Message.user.avatar||
            nextState.iconPath!=this.state.iconPath||nextState.isPlay!=this.state.isPlay){

            return true;
        }
        else {
            return false;
        }
    }
    componentWillReceiveProps(nextProps) {
        if(!nextProps.Message.user.avatar||nextProps.Message.user.avatar!=this.props.Message.user.avatar){
            console.log('..........nextProps.Message.user====props.Message===',nextProps.Message.user.avatar,nextProps.Message.user.avatar)
            this.downIcon(nextProps.Message.user.avatar)
        }
    }
    downIcon(avatarThumbPath){
        if(!avatarThumbPath){
            JMessage.downloadThumbUserAvatar({ username:this.props.username, appKey:Config.JImAppkey  },
                (userInfo) => {
                    // do something.
                    console.log('.....xiazai',userInfo)
                    this.getIcon(userInfo.filePath,true)
                }, (error) => {
                    console.log('.........错误',error)
                })
        }else{
            this.getIcon(avatarThumbPath,false)
        }
    }
    getIcon(avatarThumbPath,isXia){
        //判断
        if(avatarThumbPath){
            //判断后缀
            console.log('..........avatarThumbPath',avatarThumbPath)
            if(!(avatarThumbPath.endsWith('.png'))&&!(avatarThumbPath.endsWith('.jpg'))){
                RNFS.readFile('file://'+avatarThumbPath,'base64').then((result)=>{
                    let baseImg=`data:image/png;base64,${result}`;
                    console.log('.....阅读')
                    this.setState({
                        iconPath:baseImg
                    },()=>{
                        if(isXia){
                            let obj={
                                iconPath:baseImg,
                                id:this.props.Message.fromUser._id,
                                avatarThumbPath:avatarThumbPath
                            }
                            DeviceEventEmitter.emit('uploadIcon',obj)
                        }
                    })
                }).catch((error)=>{
                    console.log('........error',error)
                })
            }else{
                RNFS.exists('file://'+avatarThumbPath).then((result)=>{
                    console.log('.......result',result)
                    if(!result){
                        this.readFail()
                    }else{
                        if(this.props.Message.user.avatar!=('file://'+avatarThumbPath)){
                            this.setState({
                                avatarThumbPath:'file://'+avatarThumbPath
                            })
                        }
                    }
                }).catch((error)=>{
                    console.log('........error',error)

                })
            }
        }
    }
    /**
     *@desc   阅读失败
     *@author 张羽
     *@date   2019/6/30 下午8:10
     *@param
     */
    readFail(){
        JMessage.downloadThumbUserAvatar({ username:this.props.username, appKey:Config.JImAppkey  },
            (userInfo) => {
                // do something.
                console.log('.....xiazai',userInfo)
                this.getIcon(userInfo.filePath)
            }, (error) => {
                console.log('.........错误',error)
            })
    }
    /**
     *@desc
     *@author 张羽
     *@date   2019/3/14 下午11:59
     *@param
     */
    playVoice(Message){
        if(Message._id!=this.props.Message._id){
            if(this.sound){
                this.sound.release()
            }
            this.setState({
                isPlay:false
            })
        }

    }
    /**
     *@desc   点击错误
     *@author 张羽
     *@date   2018/12/24 下午4:28
     *@param
     */
    onPressError(){
        Alert.alert('是否重新发送该条消息？', '',
            [
                {
                    text: '确定', onPress: () => {
                        if(this.props.MessageError){
                            this.props.MessageError(this.props.index,this.props.Message)
                        }
                    }
                },
                {
                    text: '取消'
                }
            ])
    }
    /**
     *@desc   点击语音
     *@author 张羽
     *@date   2018/12/25 下午3:56
     *@param
     */
    onPressVoice(){
        //播放
        Sound.setCategory('Playback');
        if(!this.state.isPlay){
            this.setState({
                isPlay: true
            });
            this.sound = new Sound(this.props.Message.path, '', (error) => {
                DeviceEventEmitter.emit('playVoice',this.props.Message)
                if (error) {
                    Toast.showShortCenter('资源已丢失')
                    this.setState({isPlay:false})
                    this.sound.release()
                } else {
                    this.sound.play((success) => {
                        if (!success) {
                            Alert.alert('播放失败');
                        }
                        this.setState({isPlay:false})
                        this.sound.release()
                    });
                }
            });
        }else{
            if (this.sound) {
                this.sound.stop(() => {
                    this.setState({isPlay: false});
                });
            }
        }
    }
    render(){
        let image;
        if (this.state.isPlay) {
            image =this.props.Message.fromUser._id==1?require("../../images/chat/senderVoicePlaying.gif") :
                require("../../images/chat/receiverVoicePlaying.gif");
        } else {
            image = this.props.Message.fromUser._id==2?Images.ChatMessageVoiceLeft :Images.ChatMessageRight;
        }
        let duration=!this.props.Message.duration?1:this.props.Message.duration
        return(
            <View style={[{flexDirection:'row',paddingTop:15,},this.props.Message.fromUser._id==2?{paddingLeft:12,paddingRight:100,justifyContent:'flex-start'}:{paddingRight:12,paddingLeft:100,justifyContent:'flex-end'}]}>
                {this.props.Message.fromUser._id==2?
                    <ASTouchableOpacity style={{width:43,height:43,borderRadius:21.5}} onPress={()=>{
                        this.props.onClickIcon(this.props.Message)
                    }}>
                        <Image source={this.props.Message.user.avatar||this.state.iconPath?{uri:this.state.iconPath?this.state.iconPath:'file://'+this.props.Message.user.avatar}:Images.ICON} style={{width:43,height:43,borderRadius:21.5}}/>
                    </ASTouchableOpacity>:null
                }
                {this.props.Message.fromUser._id==1?<ActivityIndicator
                    color={'#666'}
                    style={styles.loadingMore}
                    size="small"
                    animating={this.props.Message.isShowLoading}
                />:null}
                {this.props.Message.fromUser._id==1&&this.props.Message.fail? <ASTouchableOpacity onPress={()=>{this.onPressError()}} style={{justifyContent:'center',alignItems:'center',paddingHorizontal:5}}>
                    <Image style={{width: 20, height: 20}}
                           source={Images.ChatMessageError}/>
                </ASTouchableOpacity>:null}
                {this.props.Message.fromUser._id==1? <View style={{justifyContent:'center',alignItems:'center',paddingHorizontal:5,}}>
                    <ASText style={{fontSize:15,color:colors.TIME}} text={parseInt(duration)+'s'}></ASText>
                </View>:null}
                <ASTouchableOpacity onPress={()=>{this.onPressVoice()}}
                    style={[{padding:13,borderRadius:5,width: 40 + parseInt(this.props.Message.duration) * 2,flexDirection:'row'},this.props.Message.fromUser._id==2?{marginLeft:10,backgroundColor:colors.WHITE,justifyContent:'flex-end'}:{backgroundColor:colors.CHATBUDDLE}]}>
                   <Image source={image} style={{width: 20,height: 20}}/>
                </ASTouchableOpacity>
                {this.props.Message.fromUser._id==2? <View  style={{justifyContent:'center',alignItems:'center',paddingHorizontal:5}}>
                    <ASText style={{fontSize:15,color:colors.TIME}} text={parseInt(duration)+'s'}></ASText>
                </View>:null}
                {this.props.Message.fromUser._id==2&&this.props.Message.fail? <ASTouchableOpacity onPress={()=>{this.onPressError()}} style={{justifyContent:'center',alignItems:'center',paddingHorizontal:5}}>
                    <Image style={{width: 20, height: 20}}
                           source={Images.ChatMessageError}/>
                </ASTouchableOpacity>:null}
                {this.props.Message.fromUser._id==2?<ActivityIndicator
                    color={'#666'}
                    style={styles.loadingMore}
                    size="small"
                    animating={this.props.Message.isShowLoading}
                />:null}
                {this.props.Message.fromUser._id==1?
                    <View>
                        <Image source={this.props.Message.user.avatar||this.state.iconPath?{uri:this.state.iconPath?this.state.iconPath:'file://'+this.props.Message.user.avatar}:Images.ICON} style={{width:43,height:43,borderRadius:21.5,marginLeft:10}}/>
                    </View>:null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    loadingMore: {
        paddingHorizontal:5
    }
})
