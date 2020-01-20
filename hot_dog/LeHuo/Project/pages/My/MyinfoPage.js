import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image, DeviceEventEmitter, AsyncStorage,
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Model from '../../../Resourse/Modal'
import TimePicker from '../../../Resourse/TimePicker'
import ASText from '../../components/ASText'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast";
@containers()
export default class MyinfoPage extends Component{
    static propTypes = {
        uid:React.PropTypes.string,
        isFrom:React.PropTypes.bool,
    };
    static defaultProps = {
        isFrom:false
    };
    constructor(props){
        super(props)
        this.onPickerCancel=this.onPickerCancel.bind(this);
        this.onPickerConfirm=this.onPickerConfirm.bind(this);
        this.onPickerSelect=this.onPickerSelect.bind(this);
        this.successBack=this.successBack.bind(this)
        this.state={
            name:'FIONA',
            icon:'',
            phone:'',
            birthday:'',
            sex:'',
            isShowModel:false,
            uid:'',
            userInfo:{},
            email:'',
            constellation:'',
            canClick:this.props.isFrom

        }
    }
    componentWillMount() {
        if(!this.props.isFrom){
            this.successBack()
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'个人信息',
        });
        if(this.props.isFrom){
            this.props.fetchData(this, '', Url.getUserInfoForApi(this.props.uid), {}, successCallback = (data) => {
                console.log('............个人信息',data)
                this.setState({
                    name:data.info.username?data.info.username:'',
                    icon:data.info.cover,
                    uid:data.info.id+'',
                    phone:data.info.phone,
                    sex:data.info.sex==0?'':data.info.sex==1?'男':'女',
                    email:data.info.email,
                    constellation:data.info.constellation+'',
                    birthday:data.info.birthday,
                })
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }
    }
    /**
     *@desc   修改回调
     *@author 张羽
     *@date   2018/12/12 下午11:19
     *@param
     */
    successBack(){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    console.log('..........userinfo',userinfo)
                    this.setState({
                        name:userinfo.username?userinfo.username:'',
                        icon:userinfo.cover,
                        uid:userinfo.id+'',
                        phone:userinfo.phone,
                        sex:userinfo.sex==0?'':userinfo.sex==1?'男':'女',
                        email:userinfo.email,
                        constellation:userinfo.constellation+'',
                        birthday:userinfo.birthday,
                        userInfo:userinfo
                    })
                }
            }
        })
    }
    /**
     *@desc   头像
     *@author 张羽
     *@date   2018/12/11 下午6:19
     *@param
     */
    onPressIcon(){
        this.props.push('ChangeIconPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    /**
     *@desc   昵称
     *@author 张羽
     *@date   2018/12/11 下午6:19
     *@param
     */
    onPressName(){
        this.props.push('ChangeNamePage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    /**
     *@desc   手机
     *@author 张羽
     *@date   2018/12/12 下午10:56
     *@param
     */
    onPressPhone(){
        this.props.push('LxfsPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }

    /**
     *@desc   邮箱
     *@author 张羽
     *@date   2019-08-26 18:29
     *@param
     */
    onPressEmail(){
        this.props.push('ChangeEmailPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    /**
     *@desc   生日
     *@author 张羽
     *@date   2018/12/12 下午10:57
     *@param
     */
    onPressBirth(){
        this.setState({
            isShowModel:true
        })
        TimePicker.datePicker('1949',this.state.birthday,this.onPickerConfirm,this.onPickerCancel,this.onPickerSelect)
    }
    //选择框确定
    onPickerConfirm(item){
        console.log('......item',item)
        this.setState({
            birthday:item,
            isShowModel:false
        },()=>{
            TimePicker.hide()
            this.props.fetchData(this, '', Url.changeBirdth(this.state.uid,this.state.birthday), {}, successCallback = (data) => {
                console.log('............评价',data)
                let userinfo={
                    ...this.state.userInfo,
                    constellation:data.info.constellation,
                    birthday:this.state.birthday
                }
                AsyncStorage.setItem('userInfo',JSON.stringify(userinfo));
                this.setState({
                    constellation:data.info.constellation
                })
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        })

    }
    //选择框取消
    onPickerCancel(){
        this.cancelModal();
    }
    //选择框选择
    onPickerSelect(item){

    }
    /**
     *@desc
     *@author 张羽
     *@date   2018/11/3 下午8:57
     *@param
     */
    cancelModal(){
        this.setState({
            isShowModel:false
        })
        TimePicker.hide()
    }
    /**
     *@desc   性别
     *@author 张羽
     *@date   2018/12/12 下午10:57
     *@param
     */
    onPressSex(){
        this.props.push('ChangeSexPage',{userInfo:this.state.userInfo,successBack:this.successBack})
    }
    render(){
        return(
            <View style={styles.container}>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressIcon()}} disabled={this.state.canClick}>
                    <ASText style={styles.title} text={'头像'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={{uri:this.state.icon}} style={{width:65,height:65,borderRadius:32.5}}/>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressName()}} disabled={this.state.canClick}>
                    <ASText style={styles.title} text={'昵称'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.name}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressPhone()}} disabled={this.state.canClick}>
                    <ASText style={styles.title} text={'手机号*'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.phone}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressEmail()}} disabled={this.state.canClick}>
                    <ASText style={styles.title} text={'邮箱'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.email?this.state.email:'未设置'}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={[styles.cellView,{marginTop:10}]} onPress={()=>{this.onPressBirth()}} disabled={this.state.canClick}>
                    <ASText style={styles.title} text={'生日'}/>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.birthday}/>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressSex()}} disabled={this.state.canClick}>
                    <ASText style={styles.title} text={'性别'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.sex?this.state.sex:'未设置'}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'星座'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.constellation}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </View>
                <Model showModal={this.state.isShowModel}
                       cancelModal={()=>{this.cancelModal()}}

                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
        paddingTop:10
    },
    cellView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:colors.WHITE,
        paddingHorizontal:12,
        paddingVertical:15,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.BackPage
    },
    title:{
        fontSize:16,
        color:colors.CHATTEXT
    }
});
