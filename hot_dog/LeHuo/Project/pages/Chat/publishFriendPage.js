import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList, Alert, AsyncStorage, Platform,TextInput,Image,ScrollView,DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import {isPhoneX,width} from "../../../Resourse/CommonUIStyle";
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getDeviceName();
const statusBarHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 20 : 20)
import PictureActionSheet from '../../components/PictureActionSheet'
import ActionSheet from '../../components/ActionSheet'
import ASText from '../../components/ASText'
@containers()
export default class publishFriendPage extends Component{
    constructor(props){
        super(props)
        this.onPressImage=this.onPressImage.bind(this)
        this.state={
            content:'',
            imageData:[],
            isyinsi:0,
            maxFiles:6,
            city:''
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'发布',
            hiddenNav:true
        });
        DeviceEventEmitter.emit('getCity',(city)=>{
            this.setState({
                city:city?city:''
            })
        })
    }
    /**
     *@desc   选中图片
     *@author 张羽
     *@date   2018/12/19 下午8:53
     *@param
     */
    onPressImage(){
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
        let array=[]
        if (!Array.isArray(info)){
            //拍照
            let imageStr='data:'+info.mime+';base64,'+info.data
            let newparam={
                path:info.path,
                imageStr:imageStr
            }
            array.push(newparam)
        }else{
            for(let i=0;i<info.length;i++){
                let param=info[i]
                let imageStr='data:'+param.mime+';base64,'+param.data
                let newparam={
                    path:param.path,
                    imageStr:imageStr
                }
                array.push(newparam)
            }
        }
        this.setState({
            imageData:this.state.imageData.concat(array),
            maxFiles:6-this.state.imageData.length-array.length
        })
    }
    /**
     *@desc   发布
     *@author 张羽
     *@date   2018/12/19 下午9:12
     *@param
     */
    onPressPublish(){
        if(!this.state.content&&this.state.imageData.length==0){
            Alert.alert('提示','请至少文字跟图片有一样',[{text:'确定',style:'cancel'}]);
            return false;
        }
        let param={
            uid:this.props.uid,
            content:this.state.content,
            isLook:this.state.isyinsi,
            local:this.state.city
        }
        let formdata= new FormData();
        for (let key of Object.keys(param)) {
            formdata.append(key,param[key]);
        }
        for(let i=0;i<this.state.imageData.length;i++){
            let file= {uri: this.state.imageData[i].path, type: 'multipart/form-data', name: 'icon.jpg'}
            formdata.append('img[]',file);
        }
        param={
            ...param,
            imageData:formdata,
            isUpload:true
        };
        this.props.fetchData(this, '', Url.publish(param), {}, successCallback = (data) => {
            console.log('............发布',data)
            Toast.showShortCenter('发布成功')
            this.props.back()
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   隐私设置
     *@author 张羽
     *@date   2018/12/20 下午5:54
     *@param
     */
    onPressYinsi(){
        this.props.push('YinsiSeting',{isSlect:this.state.isyinsi,successBack:(item)=>{
                this.setState({isyinsi:item})
            }})
    }
    renderTopView(){
        return(
            <View style={styles.topView}>
                <ASTouchableOpacity style={{height:48,justifyContent:'center'}} onPress={()=>{this.props.back()}}>
                    <ASText style={{fontSize:16,color:colors.CHATTEXT}} text={'取消'}></ASText>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={{height:48,justifyContent:'center'}} onPress={()=>{this.onPressPublish()}}>
                    <ASText style={{fontSize:16,color:colors.CHATBUDDLE}} text={'发布'}></ASText>
                </ASTouchableOpacity>
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                {this.renderTopView()}
                <View style={{marginTop:30,paddingHorizontal:42,paddingBottom:50}}>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text)=>this.setState({content:text})}
                        defaultValue={this.state.content}
                        placeholder={'这一刻你想说什么'}
                        placeholderTextColor={colors.TIME}
                        multiline={true}
                    />
                </View>
                <View style={styles.imageView}>
                    {this.state.imageData.length==0?<ASTouchableOpacity style={{paddingRight:10}} onPress={this.onPressImage}>
                        <Image source={Images.UploadImage} style={{width:(width-106)/3,height:(width-106)/3}}/>
                    </ASTouchableOpacity>:null}
                    {this.state.imageData.map((item,i)=>{
                        return(
                            <ASTouchableOpacity style={{paddingRight:10,paddingBottom:10}} key={i}>
                                <Image source={{uri:item.path}} style={{width:(width-106)/3,height:(width-106)/3}}/>
                            </ASTouchableOpacity>
                        )
                    })}
                    {this.state.imageData.length>0&&this.state.imageData.length<6?<ASTouchableOpacity onPress={this.onPressImage}
                        style={{paddingRight:10}}>
                        <Image source={Images.UploadImage} style={{width:(width-106)/3,height:(width-106)/3}}/>
                    </ASTouchableOpacity>:null}
                </View>
                <View style={[styles.cell,{marginTop:78}]}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={Images.FriendLocation} style={{width:16,height:16}}/>
                        <ASText  style={{fontSize:16,color:colors.CHATTEXT,marginLeft:10}} text={'所在位置'}/>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{width:150,alignItems:'flex-end'}}>
                            <ASText  style={{fontSize:13,color:colors.CHATTEXT}} text={this.state.city?this.state.city:'定位失败'}/>
                        </View>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:10}}/>
                    </View>
                </View>
                <ASTouchableOpacity style={[styles.cell,{marginTop:10}]} onPress={()=>{this.onPressYinsi()}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={Images.Yinsi} style={{width:14,height:16}}/>
                        <ASText  style={{fontSize:16,color:colors.CHATTEXT,marginLeft:10}} text={'隐私设置'}></ASText>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={!this.state.isyinsi!=0?Images.YinsiNo:Images.YinsiDid} style={{width:17,height:11}}/>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:10}}/>
                    </View>
                </ASTouchableOpacity>
                </ScrollView>
                <PictureActionSheet
                    ref={'picture'}
                    onSuccess={this.onGetImage.bind(this)}
                    includeBase64={true}
                    multiple={true}
                    maxFiles={this.state.maxFiles}
                />
                {/*<ActionSheet*/}
                    {/*ref={'actionSheet'}*/}
                    {/*onPressIndex={(index)=>{*/}
                        {/*console.log(',,,,,,index',index)*/}
                        {/*if(index==1){*/}
                            {/*this.refs.picture.handlePress(1)*/}
                        {/*}else{*/}
                            {/*this.refs.picture.handlePress(2)*/}
                        {/*}*/}
                    {/*}}*/}
                {/*/>*/}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        top:Platform.OS === 'ios'?statusBarHeight:0,
    },
    cellView:{
        backgroundColor:colors.WHITE,
        justifyContent:'center',
        paddingHorizontal:11,
        paddingVertical:14
    },
    topView:{
        paddingHorizontal:12,
        justifyContent:'space-between',
        flexDirection:'row',
    },
    inputStyle:{
        padding:0,
        textAlign:'left',
        textAlignVertical:'top',
        fontSize:18,
        color:colors.TIME
    },
    imageView:{
        flexDirection:'row',
        flexWrap:'wrap',
        paddingLeft:43,
        paddingRight:33
    },
    cell:{
        marginLeft:43,
        width:width-86,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:10,
        alignItems:'center',
        borderTopColor:colors.LINE,
        borderTopWidth:colors.width_1_PixelRatio,
        paddingVertical: 15
    }
});
