import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage,ImageBackground,Keyboard,ScrollView,Modal
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import {height, width} from "../../../Resourse/CommonUIStyle";
import DateUtils from "../../../Resourse/DateUtil";
import SendMessage from '../../components/SendMessage'
import BImage from '../../components/BImage'
import Swiper from 'react-native-swiper';
import ASText from '../../components/ASText'
@containers()
export default class FriendCrycleDetails extends Component{
    static propTypes = {
        uid:React.PropTypes.string,
        item:React.PropTypes.object,
        name:React.PropTypes.string,
        successBack:React.PropTypes.func,
        icon:React.PropTypes.string,
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.sendMessage=this.sendMessage.bind(this)
        this.onBlur=this.onBlur.bind(this)
        this.onChangeText=this.onChangeText.bind(this)
        this.state={
            isshow:false,
            item:{},
            showKeyboard:true,
            textInput:'',
            canSubmit:false,
            placeholder:'评论',
            item:{},
            isContent:false,
            cellId:'',
            content:{},
            isShowMore:false,
            moreImage:[],
            index:0
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'详情',
            back:this.back.bind(this)
        });
        this.getData()
    }
    /**
     *@desc   返回
     *@author 张羽
     *@date   2018/12/20 下午5:18
     *@param
     */
    back(){
        if(this.props.successBack){
            this.props.successBack(this.state.item)
        }
        this.props.back()
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/20 下午4:37
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.FriendDetais(this.props.uid,this.props.item.id), {}, successCallback = (data) => {
            console.log('............朋友圈',data)
            this.setState({
                isshow:true,
                item: {
                    ...data.info,
                    cover:this.props.item.cover,
                    username:this.props.item.username,
                },

            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
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
                   let param=this.state.item
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
                            username: this.props.name,
                            cover:this.props.cover
                        }
                        param.agree.push(obj)
                    }
                    this.setState({item:param})
                    return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
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
        Keyboard.dismiss()
    }
    // 留言控制是否能留言
    onChangeText(value){
        this.setState({textInput:value,canSubmit:value?true:false})
    }
    /**
     *@desc   点击图片
     *@author 张羽
     *@date   2019/3/11 下午9:52
     *@param
     */
    onPressImage(item,index){
        this.setState({
            isShowMore:true,
            moreImage:item.photo,
            index:index
        })
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
                let obj = this.state.item
                let newComtent = {
                    content:this.state.textInput,
                    id: obj.id,
                    toReplayUsername: null,
                    type: '2',
                    uid: this.props.uid,
                    username: this.props.name,
                    cover:this.props.cover
                }
                obj.comment.push(newComtent)
                this.setState({
                    item:obj,
                    textInput:''
                })
                Keyboard.dismiss()
                return;

            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }else{
            this.props.fetchData(this, '', Url.toReply(this.props.uid,this.state.content.uid,this.state.cellId,this.state.textInput), {}, successCallback = (data) => {
                console.log('............评论回复成功',data)
                let obj = this.state.item
                let newComtent = {
                    content:this.state.textInput,
                    id: obj.id,
                    toReplayUsername: this.state.content.username,
                    type: '2',
                    uid: this.props.uid,
                    username: this.props.name,
                    cover:this.props.cover
                }
                obj.comment.push(newComtent)
                this.setState({
                    item:obj,
                    textInput:'',
                    isContent:false,
                    placeholder:'评论'
                })
                Keyboard.dismiss()
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }
    }
    renderBanner(){
        let widthAndHeight={};
        if(this.state.width>0&&this.state.height>0){
            if((this.state.width/this.state.height)>=(width/(height-64))){
                widthAndHeight={
                    width:width,
                    height:this.state.height*width/this.state.width
                }
            }else{
                widthAndHeight={
                    width:this.state.width*(height-64)/this.state.height,
                    height:height-64
                }
            }
        }
        let swiper= this.state.moreImage.map((item,i)=>{
            if(item){
                let imgUrl = item;
                return (
                    <ASTouchableOpacity key = {i}
                                        onPress={()=>{this.setState({isShowMore:false})}}
                                        style={{width:width,height:height-64,justifyContent:'center',alignItems:'center'}}
                                        activeOpacity={1}
                    >
                        <BImage
                            style={[styles.image,widthAndHeight]}
                            source={{uri:imgUrl}}
                            resizeMode={'contain'}
                        />
                    </ASTouchableOpacity>
                )
            }
        });
        return  swiper
    }

    renderRow(){
        return(
            <ASTouchableOpacity style={{paddingHorizontal:12,paddingTop:15}}>
                <View style={{backgroundColor:colors.WHITE,borderRadius:5,paddingHorizontal:10,paddingTop:15,paddingBottom:30}}>
                    <View style={{flexDirection:'row'}}>
                        <BImage source={{uri:this.state.item.cover}} style={{width:44,height:44,borderRadius:22}} imageStyle={{borderRadius: 22}}/>
                        <View  style={{marginLeft:10,justifyContent:'center'}}>
                            <ASText style={{fontSize:18,color:colors.FIREDD_NAME,fontWeight:'bold'}} text={this.state.item.username}/>
                            <ASText style={{fontSize:17,color:colors.CHATTEXT,marginTop:8}} text={this.state.item.content}/>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:16,marginLeft:54}}>
                        {this.state.item.photo.map((item,i)=>{
                            return(
                                <ASTouchableOpacity key={i} style={{paddingRight:10,paddingBottom:10}} onPress={()=>{this.onPressImage(this.state.item,i)}}>
                                    <BImage source={{uri:item}} style={{width:(width-98)/3-10,height:(width-98)/3-10}} />
                                </ASTouchableOpacity>
                            )
                        })}
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:54,paddingRight:10}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:12,color:colors.TIME}}>{DateUtils.FriendTime(this.state.item.createTime)}</Text>
                            {this.state.item.local?<View style={{flexDirection:'row',alignItems:'center',marginLeft:22}}>
                                <Image source={Images.Location} style={{width:11,height:15}}/>
                                <ASText style={{fontSize:12,color:colors.TIME,marginLeft:5}} text={this.state.item.local}></ASText>
                            </View>:null}
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <ASTouchableOpacity style={{paddingLeft:15}} onPress={()=>{this.onPressAgree(this.state.item)}}>
                                <Image source={this.state.item.isAgree==0?Images.AgreeNo:Images.AgreeDid} style={{width:17,height:17}}/>
                            </ASTouchableOpacity>
                        </View>
                    </View>
                    {this.state.item.agree.length>0?<View style={{flexDirection:'row',paddingTop:12,paddingLeft:10,paddingRight:10,marginTop:15,borderTopWidth:colors.width_1_PixelRatio,borderTopColor:colors.LINE,borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio,
                    }}>
                        <Image source={Images.AgreeList} style={{width:17,height:17,marginTop:9}}/>
                        <View  style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}>
                            {this.state.item.agree.map((item,i)=>{
                                return(
                                    <View style={{marginLeft:10,paddingBottom:10}} key={i}>
                                        {/*<Text style={{fontSize:15,color:colors.FIREDD_NAME}}>{item.username}</Text>*/}
                                        <BImage source={{uri:item.cover}} style={{width:35,height:35,borderRadius:17.5}} imageStyle={{borderRadius:17.5}}/>
                                    </View>
                                )
                            })}
                        </View>
                    </View>:null}
                    {this.state.item.comment.length>0?<View style={[{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},this.state.item.agree.length==0?{borderTopWidth:colors.width_1_PixelRatio,borderTopColor:colors.LINE,marginTop:15,paddingTop:15}:{}]}>
                        <Image source={Images.Commet} style={{width:17,height:15,marginTop:9}}/>
                        <View  style={{flexWrap:'wrap',flex:1}}>
                            {this.state.item.comment.map((obj,i)=>{
                                return(
                                    <ASTouchableOpacity style={{marginLeft:10,paddingBottom:10,flexDirection:'row',paddingRight:10}} key={i} onPress={()=>{this.onPressContentCommet(obj,this.state.item)}}>
                                        <BImage source={{uri:obj.cover}} style={{width:35,height:35,borderRadius:17.5}} imageStyle={{borderRadius: 17.5}}/>
                                        <View style={{marginLeft:10}}>
                                            <View style={{paddingBottom:5,paddingRight:10,flex:1}}>
                                                <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={obj.username}/>
                                            </View>
                                            {!obj.toReplayUsername?<ASText style={{fontSize:14,color:colors.FIREDD_NAME}}>
                                                <ASText style={{color:colors.TIME}} text={obj.content}/>
                                            </ASText>:<ASText style={{fontSize:14,color:colors.FIREDD_NAME}}>
                                                <ASText style={{color:colors.CHATTEXT}} text={' 回复 '}>
                                                    <ASText style={{fontSize:14,color:colors.FIREDD_NAME}} text={obj.toReplayUsername+' : '}>
                                                        <ASText style={{color:colors.TIME}} text={obj.content}></ASText>
                                                    </ASText>
                                                </ASText>
                                            </ASText>}
                                        </View>

                                    </ASTouchableOpacity>
                                )
                            })}
                        </View>
                    </View>:null}
                </View>
            </ASTouchableOpacity>
        )
    }
    renderPagination(index, total, context){
        return (
            <View style={styles.bottomPageView}>
                <ASText style={{color:colors.WHITE}} text={(index+1)+'/'+total}/>
            </View>
        );
    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                {this.state.isshow?this.renderRow():null}
                </ScrollView>
                <SendMessage
                    showKeyboard={this.state.showKeyboard}
                    onBlur={this.onBlur}
                    onChangeText={this.onChangeText}
                    sendMessage={this.sendMessage}
                    textInput={this.state.textInput}
                    canSubmit={this.state.canSubmit}
                    placeholder={this.state.placeholder}
                    autoFocus={false}
                />
                <Modal visible={this.state.isShowMore}
                       onRequestClose={()=>{}}
                       transparent={true}
                       animationType={'fade'}
                >
                    <View style={{flex:1,backgroundColor:'#000',justifyContent:'center'}}>
                        <Swiper
                            key={this.state.moreImage.length}
                            height={height-64}
                            paginationStyle={{
                                bottom:10,
                            }}
                            index={this.state.index}
                            pagingEnabled={true}
                            renderPagination={(index, total, context)=>this.renderPagination(index, total, context)}
                            loop={false}
                            autoplay={false}
                        >
                            {this.renderBanner()}
                        </Swiper>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingBottom:50
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
})
