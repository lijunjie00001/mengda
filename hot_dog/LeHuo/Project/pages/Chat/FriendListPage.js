import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList, Alert, AsyncStorage,Image,DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import {width,height} from "../../../Resourse/CommonUIStyle";
import DateUtils from '../../../Resourse/DateUtil'
import SendMessage from '../../components/SendMessage'
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
@containers()
export default class FriendListPage extends Component{
    static propTypes = {
        uid:React.PropTypes.string,
        status:React.PropTypes.string,
        userInfo:React.PropTypes.object,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.sendMessage=this.sendMessage.bind(this)
        this.onBlur=this.onBlur.bind(this)
        this.onChangeText=this.onChangeText.bind(this)
        this.onEndReached=this.onEndReached.bind(this)
        this.page=1
        this.pageNum=10
        this.state={
            data:[],
            refreshing:false,
            name:this.props.userInfo.username,
            icon:this.props.userInfo?this.props.userInfo.cover:'',
            showKeyboard:false,
            textInput:'',
            canSubmit:false,
            placeholder:'评论',
            item:{},
            isContent:false,
            cellId:'',
            content:{},
            isLoadComplete:false,
            isLoadMore:false,
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.pageId,
            hiddenNav:true
        });
        this.getData(false)
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/19 下午4:51
     *@param
     */
    getData(isMore){
        if(this.props.status=='0'){
            //我的朋友圈
            this.props.fetchData(this, '', Url.myPyqList(this.props.uid,this.page), {}, successCallback = (data) => {
                console.log('............朋友圈列表',data)
                this.setState({
                    data:!isMore?data.info.list:this.state.data.concat(data.info.list),
                    isLoadComplete:data.info.list.length<this.pageNum?true:false,
                    refreshing:false,
                    isLoadMore:false
                })
                return;
            }, failure = (data) => {
                this.setState({refreshing:false, isLoadMore:false})
                Toast.showShortCenter(data.notice)
            });
        }else if(this.props.status=='1'){
            //好友
            this.props.fetchData(this, '', Url.friendPyqList(this.props.uid,this.page), {}, successCallback = (data) => {
                console.log('............朋友圈列表',data)
                this.setState({
                    data:!isMore?data.info.list:this.state.data.concat(data.info.list),
                    isLoadComplete:data.info.list.length<this.pageNum?true:false,
                    refreshing:false,
                    isLoadMore:false
                })
                return;
            }, failure = (data) => {
                this.setState({refreshing:false, isLoadMore:false})
                Toast.showShortCenter(data.notice)
            });
        }else{
            //附近
            this.props.fetchData(this, '', Url.nearPyqList(this.props.uid,this.page), {}, successCallback = (data) => {
                console.log('............朋友圈列表',data)
                this.setState({
                    data:!isMore?data.info.list:this.state.data.concat(data.info.list),
                    isLoadComplete:data.info.list.length<this.pageNum?true:false,
                    refreshing:false,
                    isLoadMore:false
                })
                return;
            }, failure = (data) => {
                this.setState({refreshing:false, isLoadMore:false})
                Toast.showShortCenter(data.notice)
            });
        }
    }
    /**
     *@desc   点赞取消点赞
     *@author 张羽
     *@date   2018/12/20 下午2:18
     *@param
     */
    onPressAgree(item){
        this.props.fetchData(this, '', Url.toAgree(this.props.uid,item.id), {}, successCallback = (data) => {
            console.log('............点赞',data)
            for(let i=0;i<this.state.data.length;i++){
                let param=this.state.data[i]
                if(param.id==item.id){
                    param.isAgree=param.isAgree==1?0:1 //是否点赞修改
                    //去掉点赞
                    if(param.isAgree==0){
                        for(let a=0;a<param.agree.length;a++){
                            let newParam=param.agree[a]
                            if(newParam.uid==this.props.uid){
                                param.agree.splice(a,1)
                                break;
                            }
                        }
                    }else{
                        let obj={
                            id: item.id,
                            type: 1,
                            uid: this.props.uid,
                            username: this.state.name
                        }
                        param.agree.push(obj)
                    }
                    this.setState({data:this.state.data})
                    break;
                }
            }
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   点击评论
     *@author 张羽
     *@date   2018/12/20 下午2:58
     *@param
     */
    onPressCommet(item){
        this.setState({
            showKeyboard:true,
            item:item,
            isContent:false
        })
    }
    /**
     *@desc   点击回复的评论
     *@author 张羽
     *@date   2018/12/20 下午3:29
     *@param
     */
    onPressContentCommet(item,obj){
        this.setState({
            showKeyboard:true,
            item:obj,
            isContent:true,
            cellId:obj.id,
            content:item,
            placeholder:'回复'+item.username
        })
    }
    // 取消键盘
    onBlur(){
        this.setState({
            showKeyboard:false,
        })
    }
    // 留言控制是否能留言
    onChangeText(value){
        this.setState({textInput:value,canSubmit:value?true:false})
    }
    /**
     *@desc   点击盆友圈
     *@author 张羽
     *@date   2018/12/20 下午4:30
     *@param
     */
    onPressCell(item){
        this.props.push('FriendDetails',{uid:this.props.uid,item:item,name:this.state.name,cover:this.state.icon,successBack:(item)=>{
            //回调
                for(let i=0;i<this.state.data.length;i++) {
                    let param = this.state.data[i]
                    if (param.id == item.id) {
                        param = {
                            ...item
                        }
                        this.state.data.splice(i,1,param)
                        this.setState({data: this.state.data})
                        break;
                    }
                }
            }})
    }
    /**
     *@desc   点击图片
     *@author 张羽
     *@date   2019/3/11 下午9:52
     *@param
     */
    onPressImage(item,index){
        let param={
            isShowMore:true,
            moreImage:item.photo,
            index:index
        }
        DeviceEventEmitter.emit('showModal',param)
    }
    /**
     *@desc   发送
     *@author 张羽
     *@date   2018/12/20 下午4:30
     *@param
     */
    sendMessage(){
        if(!this.state.isContent){
            this.props.fetchData(this, '', Url.toComment(this.props.uid,this.state.item.id,this.state.textInput), {}, successCallback = (data) => {
                console.log('............评论成功',data)
                for(let i=0;i<this.state.data.length;i++) {
                    let param = this.state.data[i]
                    if (param.id == this.state.item.id) {
                        let obj = this.state.data[i]
                        let newComtent = {
                            content:this.state.textInput,
                            id: obj.id,
                            toReplayUsername: null,
                            type: '2',
                            uid: this.props.uid,
                            username: this.state.name
                        }
                        obj.comment.push(newComtent)
                        this.setState({
                            data:this.state.data,
                            showKeyboard:false,
                            textInput:''
                        })
                        break;
                    }
                }
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }else{
            this.props.fetchData(this, '', Url.toReply(this.props.uid,this.state.content.uid,this.state.cellId,this.state.textInput), {}, successCallback = (data) => {
                console.log('............评论回复成功',data)
                for(let i=0;i<this.state.data.length;i++) {
                    let param = this.state.data[i]
                    if (param.id == this.state.item.id) {
                        let obj = this.state.data[i]
                        let newComtent = {
                            content:this.state.textInput,
                            id: obj.id,
                            toReplayUsername: this.state.content.username,
                            type: '2',
                            uid: this.props.uid,
                            username: this.state.name
                        }
                        obj.comment.push(newComtent)
                        this.setState({
                            data:this.state.data,
                            showKeyboard:false,
                            textInput:'',
                            placeholder:'评论'
                        })
                        break;
                    }
                }
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }
    }
    onRefresh(){
        this.setState({
            refreshing:true
        },()=>{
            this.page=1
            this.getData(false)
        })
    }
    onEndReached(){
        if(this.state.isLoadMore)return
        if(this.state.isLoadComplete) return
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.data.length/this.pageNum)+1
            this.getData(true)
        })
    }
    renderRow(item,index){
        return(
            <ASTouchableOpacity style={{paddingHorizontal:12,paddingTop:15}} onPress={()=>{this.onPressCell(item)}}>
                <View style={{backgroundColor:colors.WHITE,borderRadius:5,paddingHorizontal:10,paddingTop:15,paddingBottom:30}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:44,height:44,borderRadius:22}} >
                           <BImage source={{uri:item.cover}} style={{width:44,height:44,borderRadius:22}} imageStyle={{borderRadius: 22}}/>
                        </View>
                        <View  style={{marginLeft:10,justifyContent:'center'}}>
                            <ASText style={{fontSize:18,color:colors.FIREDD_NAME,fontWeight:'bold'}} text={item.username}></ASText>
                            <ASText style={{fontSize:17,color:colors.CHATTEXT,marginTop:8}} text={item.content}></ASText>
                        </View>
                    </View>
                    {/*//图片*/}
                    <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:16,marginLeft:54}}>
                        {item.photo.map((obj,i)=>{
                            return(
                                <ASTouchableOpacity key={i} style={{paddingRight:10,paddingBottom:10}} onPress={()=>{this.onPressImage(item,i)}}>
                                    <BImage source={{uri:obj}} style={{width:(width-98)/3-10,height:(width-98)/3-10}} />
                                </ASTouchableOpacity>
                            )
                        })}
                    </View>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:54,paddingRight:10}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <ASText style={{fontSize:12,color:colors.TIME}} text={DateUtils.FriendTime(item.createTime)}></ASText>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <ASTouchableOpacity style={{paddingLeft:15}} onPress={()=>{this.onPressAgree(item)}}>
                                    <Image source={item.agree.length==0&&item.isAgree==0?Images.AgreeNo:Images.AgreeDid} style={{width:17,height:17}}/>
                                </ASTouchableOpacity>
                                <ASTouchableOpacity style={{paddingLeft:15}} onPress={()=>{this.onPressCommet(item)}}>
                                    <Image source={Images.Commet} style={{width:17,height:15}}/>
                                </ASTouchableOpacity>
                            </View>
                        </View>
                        {item.local?<View style={{flexDirection:'row',alignItems:'center',marginLeft:54,paddingRight:10,marginTop:10}}>
                            <Image source={Images.Location} style={{width:11,height:15}}/>
                            <ASText style={{fontSize:12,color:colors.TIME,marginLeft:5}} text={item.local}></ASText>
                        </View>:null}
                    </View>
                    {/*//点赞view*/}
                    {item.agree.length>0?<View style={{flexDirection:'row',paddingTop:12,paddingLeft:54,paddingRight:10,marginTop:15,borderTopWidth:colors.width_1_PixelRatio,borderTopColor:colors.LINE
                    }}>
                        <Image source={Images.AgreeList} style={{width:17,height:17}}/>
                        <View  style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}>
                            {item.agree.map((item,i)=>{
                                return(
                                    <View style={{marginLeft:10,paddingBottom:10}} key={i}>
                                        <ASText style={{fontSize:15,color:colors.FIREDD_NAME}} text={item.username}></ASText>
                                    </View>
                                )
                            })}
                        </View>
                    </View>:null}
                    {/*//评论*/}
                    {item.comment.length>0?<View style={[{flexDirection:'row',paddingLeft:54,paddingRight:10},item.agree.length==0?{borderTopWidth:colors.width_1_PixelRatio,borderTopColor:colors.LINE,marginTop:15,paddingTop:15}:{}]}>
                        <Image source={Images.Commet} style={{width:17,height:15,marginTop:2}}/>
                        <View  style={{flexWrap:'wrap',flex:1}}>
                            {item.comment.map((obj,i)=>{
                                return(
                                    <ASTouchableOpacity style={{marginLeft:10,paddingBottom:10,flexDirection:'row'}} key={i} onPress={()=>{this.onPressContentCommet(obj,item)}}>
                                        {!obj.toReplayUsername?<ASText style={{fontSize:15,color:colors.FIREDD_NAME}} text={ obj.username+' :  '}>
                                            <ASText style={{color:colors.CHATTEXT}} text={obj.content}></ASText>
                                        </ASText>:<ASText style={{fontSize:15,color:colors.FIREDD_NAME}} text={ obj.username+''}>
                                                <ASText style={{color:colors.CHATTEXT}} text={' 回复 '}>
                                                    <ASText style={{fontSize:15,color:colors.FIREDD_NAME}} text={obj.toReplayUsername+' : '}>
                                                        <ASText style={{color:colors.CHATTEXT}} text={obj.content}></ASText>
                                                    </ASText>
                                                </ASText>
                                            </ASText>}
                                    </ASTouchableOpacity>
                                )
                            })}
                        </View>
                    </View>:null}
                </View>
            </ASTouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'friend'+index
    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    ItemSeparatorComponent={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    extraData={this.state.data}
                    style={{flex:1}}
                    ListEmptyComponent={()=>{
                        if(!this.state.isLoadComplete){
                            return(
                                <View style={{alignItems:'center',paddingTop:20}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                                </View>
                            )
                        }else{
                            return <View></View>
                        }
                       }}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{this.onRefresh()}}
                    onEndReachedThreshold={0.3}
                    onEndReached={this.onEndReached}
                    ListFooterComponent={()=>{
                        if(this.state.isLoadComplete){
                            return(
                                <View style={{alignItems:'center',paddingVertical:10}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                                </View>
                            )
                        }else if(this.state.isLoadMore){
                            return(
                                <View style={{alignItems:'center',paddingVertical:10}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'正在加载中...'}></ASText>
                                </View>
                            )
                        }else{
                            return <View></View>
                        }
                    }}
                />
                <SendMessage
                    showKeyboard={this.state.showKeyboard}
                    onBlur={this.onBlur}
                    onChangeText={this.onChangeText}
                    sendMessage={this.sendMessage}
                    textInput={this.state.textInput}
                    canSubmit={this.state.canSubmit}
                    placeholder={this.state.placeholder}
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
    cellView:{
        backgroundColor:colors.WHITE,
        justifyContent:'center',
        paddingHorizontal:11,
        paddingVertical:14
    },
    image: {
        width:width,
        height:height-64,
    },
    Swiper:{
        width:width,
        height:height-64,
    },
    bottomPageView:{
        width:width,
        marginBottom:20,
        justifyContent:'center',
        alignItems:'center'
    }
});
