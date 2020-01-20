import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, Image, ActivityIndicator, Alert, Keyboard,TextInput,FlatList,Platform
} from 'react-native';
import colors from "../../../Resourse/Colors";
import Images from "../../../Resourse/Images";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Audio from './Audio'
import {width} from "../../../Resourse/CommonUIStyle";
import emilJson from '../../components//emoticonData.json'
import PictureActionSheet from '../../components/PictureActionSheet'
import ASText from '../../components/ASText'
export default class MessageTextBar extends Component{
    constructor(props){
        super(props)
        this.onSend=this.onSend.bind(this)
        this.onEndEditing=this.onEndEditing.bind(this)
        this.keyboardWillHide=this.keyboardWillHide.bind(this)
        this.onTouchStart=this.onTouchStart.bind(this)
        this.onScroll=this.onScroll.bind(this)
        this.onSubmit=false
        this.state={
            value:'',
            showEmiol:false,
            showAction:false,
            focused:false,
            emoilArr:this.getEmiolData(emilJson),
            isShowSend:false
        }
    }
    componentDidMount () {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount () {
        this.keyboardDidHideListener.remove();
    }
    /**
     *@desc   键盘收起
     *@author 张羽
     *@date   2019/1/17 下午4:14
     *@param
     */
    keyboardWillHide(){
        console.log('........kkkkkkkkey')
        if(this.onSubmit){
            this.onEndEditing()
            return;
        }
    }
    /**
     *@desc   点击socllview回调
     *@author 张羽
     *@date   2019/1/24 下午4:44
     *@param
     */
    onTouchStart(){
        if(this.state.showEmiol||this.state.showAction||this.state.focused){
            this.setState({
                showEmiol:false,
                showAction:false,
                focused:false,
            })
        }
    }
    /**
     *@desc   移动socllview回调
     *@author 张羽
     *@date   2019/1/24 下午4:45
     *@param
     */
    onScroll(){
        if(this.state.showEmiol||this.state.showAction||this.state.focused){
            this.setState({
                showEmiol:false,
                showAction:false,
                focused:false,
            })
        }
    }
    /*
     * 发送语音
     */
    onSend(info){
        if(this.props.onSend){
            this.props.onSend(info)
        }
    }
    /**
     *@desc   发送文本
     *@author 张羽
     *@date   2019/1/7 上午10:57
     *@param
     */
    onEndEditing(){
        if(this.props.onEndEditing){
            this.props.onEndEditing(this.state.value)
        }
        this.setState({value:''})
        this.onSubmit = false;
    }
    /**
     *@desc   文本变化
     *@author 张羽
     *@date   2019/1/17 下午3:58
     *@param
     */
    onChangeText(text){
        console.log('change-----',text,this.onSubmit)
        if(this.onSubmit){
            this.onEndEditing()
            return;
        }
        this.setState({
            value:text,
            isShowSend:text.length>0&&Platform.OS=='android'?true:false
        })

    }
    /**
     *@desc   发送图片
     *@author 张羽
     *@date   2019/1/7 上午10:57
     *@param
     */
    onGetImage(info){
        if(this.props.onGetImage){
            this.props.onGetImage(info)
        }
    }
    /**
     *@desc   表情数据
     *@author 张羽
     *@date   2018/12/24 下午5:23
     *@param
     */
    getEmiolData(param){
        let array=[]
        for (let key in param) {
            array.push({name: key, code: param[key]})
        }
        return array
    }
    /**
     *@desc   获取焦点
     *@author 张羽
     *@date   2018/12/25 上午10:54
     *@param
     */
    handleFocusSearch(){
        this.setState({
            showAction:false,
            showEmiol:false,
            focused:true
        })
    }
    /**
     *@desc   失去焦点
     *@author 张羽
     *@date   2018/12/25 上午10:56
     *@param
     */
    handleBlurSearch(){
        // if(Platform.OS==='android'&&this.onSubmit){
        //     this.onSubmit=false
        //     this.onEndEditing()
        //     return;
        // }
        this.setState({
            focused:false,
        })
    }
    /**
     *@desc   图片选择
     *@author 张羽
     *@date   2018/12/24 下午4:53
     *@param
     */
    renderAction(){
        return(
            <View style={{paddingLeft:20,paddingTop:20,height:200,backgroundColor:colors.WHITE,flexDirection:'row'}}>
                <ASTouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.refs.picture.handlePress(1)}}>
                    <Image source={Images.CAMERA} style={{height:40,width:40}}/>
                    <ASText  style={{fontSize:15,color:colors.CHATTEXT,marginTop:10}} text={'拍摄'}></ASText>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={{marginLeft:20,alignItems:'center'}} onPress={()=>{this.refs.picture.handlePress(2)}}>
                    <Image source={Images.PHOTO} style={{height:40,width:40}}/>
                    <ASText  style={{fontSize:15,color:colors.CHATTEXT,marginTop:10}} text={'相册'}></ASText>
                </ASTouchableOpacity>
            </View>
        )
    }
    /**
     *@desc   表情
     *@author 张羽
     *@date   2018/12/24 下午5:15
     *@param
     */
    renderEmiol(){
        return(
            <View style={{backgroundColor:'white',height:200}}>
                <FlatList
                    style={{flex:1,paddingHorizontal:(width-(parseInt(width/40)*40))/2}}
                    data={this.state.emoilArr}
                    renderItem={({item,index})=>this.renderEmoilRow(item,index)}
                    numColumns={parseInt(width/40)}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={{height:40,flexDirection:'row',justifyContent:'flex-end'}}>
                    <ASTouchableOpacity style={{width:100,justifyContent:'center',height:50,alignItems:'center',backgroundColor:'#5bc0de'}} onPress={()=>{this.onEndEditing()}}>
                        <ASText  style={{fontSize:15,color:colors.WHITE}} text={'发送'}></ASText>
                    </ASTouchableOpacity>
                </View>
            </View>
        )
    }
    renderEmoilRow(item,index){
        return(
            <ASTouchableOpacity style={{width:40,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.setState({value:this.state.value+item.code})}}>
                <ASText style={{fontSize:30}} text={item.code}></ASText>
            </ASTouchableOpacity>
        )
    }
    render(){
        return(
            <View>
                <View style={{flexDirection:'row',padding:10,alignItems:'center',borderTopColor:colors.LINE,borderTopWidth:colors.width_1_PixelRatio}}>
                    <ASTouchableOpacity style={{justifyContent: "center", paddingLeft: 8}} onPress={()=>{
                        if(!this.state.showVedio){
                            Keyboard.dismiss()
                            this.setState({showVedio:!this.state.showVedio,showAction:false,focused:false,showEmiol:false})
                        }else{
                            this.props.onCLick()
                            this.search.focus()
                            this.setState({showVedio:!this.state.showVedio,showAction:false,focused:false,showEmiol:false})
                        }
                    }}>
                        <Image source={!this.state.showVedio?Images.ChatVedio:Images.ChatKeybord} style={{width:30,height:30}}/>
                    </ASTouchableOpacity>
                    <View style={styles.searchRow}>
                            <TextInput
                                ref={(search) => {
                                    this.search = search
                                }}
                                style={styles.searchInput}
                                value={this.state.value}
                                autoFocus={this.state.focused}
                                maxLength={500}
                                keyboardType='default'
                                returnKeyType={'send'}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                placeholder={'说点什么'}
                                multiline={true}
                                onFocus={this.handleFocusSearch.bind(this)}
                                onBlur={this.handleBlurSearch.bind(this)}
                                onChangeText={(text)=>{this.onChangeText(text)}}
                                onSubmitEditing={()=>{
                                    console.log('..........this.onSubmit')
                                    this.onSubmit=true
                                }}
                                onKeyPress={(event)=>{
                                    console.log('........event',event.nativeEvent)
                                    if(event.nativeEvent.key=='Enter'){
                                        this.onSubmit=true
                                    }
                                }
                                }
                                enablesReturnKeyAutomatically={true}
                                maxLength={500}
                            />
                        {!this.state.showVedio?null: <Audio onSend={this.onSend.bind(this)}/>}
                    </View>
                    <ASTouchableOpacity style={{paddingLeft: 5, paddingRight: 5, justifyContent: "center"}}
                                        onPress={()=>{
                                            this.props.onCLick()
                                            if(!this.state.showEmiol){
                                                Keyboard.dismiss()
                                                this.setState({showEmiol:!this.state.showEmiol,showAction:false,showVedio:false})
                                            }else{
                                                this.search.focus()
                                               this.setState({showEmiol:!this.state.showEmiol,showAction:false,showVedio:false})}}
                                        }
                    >
                        <Image source={!this.state.showEmiol?Images.ChatEmdio:Images.ChatKeybord} style={{width:30,height:30}}/>
                    </ASTouchableOpacity>
                    {!this.state.isShowSend ? <ASTouchableOpacity style={{justifyContent: "center"}} onPress={() => {
                            this.props.onCLick()
                            if (!this.state.showAction) {
                                Keyboard.dismiss()
                                this.setState({showAction: !this.state.showAction, showEmiol: false, showVedio: false})
                            } else {
                                this.search.focus()
                                this.setState({showEmiol: !this.state.showEmiol, showAction: false, showVedio: false})
                            }
                        }}>
                            <Image source={Images.ChatAdd} style={{width: 30, height: 30}}/>
                        </ASTouchableOpacity> :
                        <ASTouchableOpacity style={{justifyContent: "center", width: 50, height: 30, backgroundColor: '#5bc0de',alignItems:'center',borderRadius:5}} onPress={()=>{
                            this.onEndEditing()
                        }}>
                            <ASText text={'发送'} style={{fontSize: 15, color: colors.WHITE}}/>
                        </ASTouchableOpacity>
                    }
                </View>
                {this.state.showAction?this.renderAction():null}
                {this.state.showEmiol?this.renderEmiol():null}
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