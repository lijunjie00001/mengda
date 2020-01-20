import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput, AsyncStorage, Alert,ScrollView
} from 'react-native';
import containers from '../../containers/containers'
import ASText from '../../components/ASText'
import Url from '../../../Resourse/url'
import colors from '../../../Resourse/Colors'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import Toast from "@remobile/react-native-toast";
import TimePicker from "../../../Resourse/TimePicker";
import Model from "../../../Resourse/Modal";
import StringUtils from '../../../Resourse/StringUtil'
@containers()
export default class YudingPage extends Component{
    static propTypes = {
        bid:React.PropTypes.string,
        noticeArr:React.PropTypes.array, //酒店room
        is_hotal:React.PropTypes.bool,
        item:React.PropTypes.object,

    };
    static defaultProps = {
        noticeArr:[],
        is_hotal:false
    };
    constructor(props){
        super(props)
        let array=this.ChuliData()
        this.onPickerCancel=this.onPickerCancel.bind(this);
        this.onPickerConfirm=this.onPickerConfirm.bind(this);
        this.onPickerSelect=this.onPickerSelect.bind(this);
        this.state={
            noticeArr:array,
            count:0,
            totlePrice:0,
            name:'',
            card:'',
            phone:'',
            isShowModel:false,
            birthday:''
        }
    }
    componentDidMount() {
        this.props.setContainer(this,{
            title:'预定',
        });
    }

    /**
     *@desc   处理数据
     *@author 张羽
     *@date   2019-08-30 14:47
     *@param
     */
     ChuliData(){
         let array=JSON.parse(JSON.stringify(this.props.noticeArr))
         for(obj of array){
             obj.selectNum=0
         }
         return array

    }
    /**
     *@desc   点击减少
     *@author 张羽
     *@date   2019-08-30 14:46
     *@param
     */
    onPressreduce(item,index){
        if(item.selectNum==0)return
        item.selectNum=item.selectNum-1
        let totlePrice=(this.state.totlePrice)-parseFloat(item.discountPrice)
        this.setState({
            noticeArr:this.state.noticeArr,
            totlePrice:parseFloat(totlePrice).toFixed(2),
            count:this.state.count-1
        })
    }

    /**
     *@desc   点击增加
     *@author 张羽
     *@date   2019-08-30 14:53
     *@param
     */
    onPressAdd(item,index){
        if(item.selectNum==item.emptyNum){
            Toast.showShortCenter('没有更多房间了')
            return
        }
        item.selectNum=item.selectNum+1
        let totlePrice=parseFloat(this.state.totlePrice)+parseFloat(item.discountPrice)
        this.setState({
            noticeArr:this.state.noticeArr,
            totlePrice:parseFloat(totlePrice).toFixed(2),
            count:this.state.count+1
        })
    }

    /**
     *@desc   选择日期
     *@author 张羽
     *@date   2019-08-30 15:03
     *@param
     */
    onPressData(){
        this.setState({
            isShowModel:true
        })
        TimePicker.dataPickerAllTime('1949',this.state.birthday,this.onPickerConfirm,this.onPickerCancel,this.onPickerSelect)
    }
    //选择框确定
    onPickerConfirm(item){
        console.log('......item',item)
        this.setState({
            birthday:item,
            isShowModel:false
        },()=>{
            TimePicker.hide()
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
     *@desc   预定
     *@author 张羽
     *@date   2019-08-30 15:12
     *@param
     */
    onPressSure(){
        if(this.state.count==0){
            Alert.alert('提示','请选择至少一间房间',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.birthday){
            Alert.alert('提示','请选择入住时间',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.name){
            Alert.alert('提示','请输入入住人姓名',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.card){
            Alert.alert('提示','请输入身份证号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.IdentityCodeValid(this.state.card)){
            Alert.alert('提示','请输入合法的身份证号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.phone){
            Alert.alert('提示','请输入入住人联系方式',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.phone)){
            Alert.alert('提示','请输入正确的手机号码',[{text:'确定',style:'cancel'}]);
            return ;
        }
        let roomjson={}
        for (let obj of this.state.noticeArr) {
            if(obj.selectNum>0){
                roomjson[obj.id]=obj.selectNum
            }
        }
        let roomstr=JSON.stringify(roomjson)
        let roomencodeURI=encodeURIComponent(roomstr)
        let param ={
            uid:this.props.uid,
            bid:this.props.bid,
            checkin:this.state.birthday,
            idcard:this.state.card,
            name:this.state.name,
            phone:this.state.phone,
            room:roomencodeURI
        }
        this.props.fetchData(this, '', Url.createOrderOfBusinessv2(param), {}, successCallback = (data) => {
            console.log('........获取周边',data.info)
            this.props.push('YudingSuccessPage')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1}}>
                        {this.state.noticeArr.map((item,index)=>{
                            if(item.emptyNum==0)return null
                            return(
                                <View style={{height:50,paddingLeft: 19,paddingRight: 13,flexDirection:'row',backgroundColor:'#ffffff',
                                    justifyContent: 'space-between',alignItems:'center',borderBottomColor:'#eeeeee',borderBottomWidth: colors.width_1_PixelRatio}}>
                                    <ASText style={{fontSize:14,color:'#959595'}}>{item.name}</ASText>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <ASTouchableOpacity style={{width:19,height:19}} onPress={()=>{this.onPressreduce(item,index)}}>
                                            <Image source={require('../../images/home/reduce.png')} style={{width:19,height:19}}/>
                                        </ASTouchableOpacity>
                                        <View style={{height:19,justifyContent:'center',alignItems:'center',paddingHorizontal:11,paddingVertical:6,
                                            borderTopColor:'#d8d8d8',borderTopWidth: colors.width_1_PixelRatio,borderBottomColor:'#d8d8d8',
                                            borderBottomWidth:colors.width_1_PixelRatio}}>
                                            <ASText style={{fontSize:12,color:'#3d3d3d'}}>{item.selectNum}</ASText>
                                        </View>
                                        <ASTouchableOpacity style={{width:19,height:19}} onPress={()=>{this.onPressAdd(item,index)}}>
                                            <Image source={require('../../images/home/add.png')} style={{width:19,height:19}}/>
                                        </ASTouchableOpacity>
                                        <ASText style={{fontSize:14,color:'#3d3d3d',marginLeft: 5}}>{'间'}</ASText>
                                    </View>
                                </View>
                            )
                        })
                        }
                        <View style={{height:50,paddingLeft: 19,paddingRight: 34,flexDirection:'row',backgroundColor:'#ffffff',
                            justifyContent: 'space-between',alignItems:'center',borderBottomColor:'#eeeeee',borderBottomWidth: colors.width_1_PixelRatio}}>
                            <ASText style={{fontSize:14,color:'#959595'}}>{'入住日期:'}</ASText>
                            <ASTouchableOpacity onPress={()=>{this.onPressData()}}>
                                <ASText style={{fontSize:14,color:'#3d3d3d'}}>{this.state.birthday?this.state.birthday:'选择'}</ASText>
                            </ASTouchableOpacity>
                        </View>
                        <View style={{height:50,paddingLeft: 19,paddingRight: 13,flexDirection:'row',backgroundColor:'#ffffff',
                            justifyContent: 'space-between',alignItems:'center',borderBottomColor:'#eeeeee',borderBottomWidth: colors.width_1_PixelRatio}}>
                            <View style={{width:100}}>
                                <ASText style={{fontSize:14,color:'#959595'}}>{'入住人姓名'}</ASText>
                            </View>
                            <TextInput
                                style={styles.inputStyle}
                                underlineColorAndroid={'transparent'}
                                placeholder = {'请输入一位入住人姓名'}
                                placeholderTextColor = {'#363636'}
                                onChangeText={(text)=>this.setState({name:text})}
                            />
                        </View>
                        <View style={{height:50,paddingLeft: 19,paddingRight: 13,flexDirection:'row',backgroundColor:'#ffffff',
                            justifyContent: 'space-between',alignItems:'center',borderBottomColor:'#eeeeee',borderBottomWidth: colors.width_1_PixelRatio}}>
                            <View style={{width:100}}>
                                <ASText style={{fontSize:14,color:'#959595'}}>{'入住人身份证'}</ASText>
                            </View>
                            <TextInput
                                style={styles.inputStyle}
                                underlineColorAndroid={'transparent'}
                                placeholder = {'请输入一位入住人姓名'}
                                placeholderTextColor = {'#363636'}
                                onChangeText={(text)=>this.setState({card:text})}
                            />
                        </View>
                        <View style={{height:50,paddingLeft: 19,paddingRight: 13,flexDirection:'row',backgroundColor:'#ffffff',
                            justifyContent: 'space-between',alignItems:'center',borderBottomColor:'#eeeeee',borderBottomWidth: colors.width_1_PixelRatio}}>
                            <View style={{width:100}}>
                                <ASText style={{fontSize:14,color:'#959595'}}>{'联系电话'}</ASText>
                            </View>
                            <TextInput
                                style={styles.inputStyle}
                                underlineColorAndroid={'transparent'}
                                placeholder = {'请输入入住人联系电话'}
                                placeholderTextColor = {'#363636'}
                                onChangeText={(text)=>this.setState({phone:text})}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={{height:57,width:width,backgroundColor:'#ffffff',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                    <ASText text={'共'+this.state.count+'间,'} style={{fontSize:14,color:'#959595',marginRight: 16}}>
                        <ASText text={'合计：'} style={{color:'#3d3d3d'}}>
                            <ASText text={'¥'+this.state.totlePrice} style={{color:'#e27120',fontSize:18}}>
                            </ASText>
                        </ASText>
                    </ASText>
                    <ASTouchableOpacity style={{width:100,height:57,justifyContent:'center',alignItems:'center',backgroundColor:'#ff9c56'}} onPress={()=>{
                        this.onPressSure()
                    }}>
                        <ASText style={{fontSize:16,color:'#ffffff'}}>{'预订'}</ASText>
                    </ASTouchableOpacity>
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
    inputStyle:{
        padding:0,
        flex:1,
        fontSize:16,
        color:'#363636',
    },
});
