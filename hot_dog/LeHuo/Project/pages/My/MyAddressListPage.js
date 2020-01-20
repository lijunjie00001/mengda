import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage,FlatList
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import ASText from '../../components/ASText'
@containers()
export default class MyAddressListPage extends Component{
    static propTypes = {
        successBack:React.PropTypes.func,
        userInfo:React.PropTypes.object,
        select:React.PropTypes.bool,
        uid:React.PropTypes.string,
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.state={
            data:[],
            uid:this.props.select?this.props.uid:this.props.userInfo?this.props.userInfo.id:'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'地址',
        });
        this.getData()
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/13 下午5:08
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.addressList(this.state.uid), {}, successCallback = (data) => {
            console.log('............地址列表',data)
            this.setState({data:data.info})
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   点击加地址
     *@author 张羽
     *@date   2018/12/13 下午3:36
     *@param
     */
    onPressAdd(){
        this.props.push('AddaddressPage',{uid:this.state.uid+'',successBack:()=>{
             this.getData()
            }})
    }
    /**
     *@desc   点击地址
     *@author 张羽
     *@date   2019/2/21 上午12:20
     *@param
     */
    onPressItem(item){
        if(this.props.select&&this.props.successBack){
            this.props.successBack(item)
            this.props.back()
        }
    }
    /**
     *@desc   默认地址
     *@author 张羽
     *@date   2018/12/13 下午5:45
     *@param
     */
    onPressDefault(item,index){
    }
    /**
     *@desc   编辑
     *@author 张羽
     *@date   2018/12/13 下午5:47
     *@param
     */
    onPressEdit(item,index){
        this.props.push('AddaddressPage',{uid:this.state.uid+'',isEdit:true,info:item,successBack:()=>{
                this.getData()
            }})
    }
    /**
     *@desc   删除
     *@author 张羽
     *@date   2018/12/13 下午5:47
     *@param
     */
    onPressDel(item,index){
        this.props.fetchData(this, '', Url.deleteAddress(this.state.uid,item.id), {}, successCallback = (data) => {
            console.log('............删除',data)
            this.state.data.splice(index,1)
            this.setState({data:this.state.data})
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    _keyExtractor = (item, index) => 'address'+index
    renderAddressCell(item,index) {
        return (
            <ASTouchableOpacity style={{paddingTop:10}} onPress={()=>{this.onPressItem(item)}}>
                <View style={styles.cellView}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:12}}>
                        <ASText style={styles.title} text={item.name}></ASText>
                        <ASText style={styles.title} text={item.phone}></ASText>
                    </View>
                    <View style={{paddingVertical:15}}>
                        <ASText style={[styles.title,{fontSize:15}]} text={item.pct+item.address}></ASText>
                    </View>
                    <View style={styles.btnView}>
                        <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{this.onPressDefault(item,index)}}>
                            <Image source={item.isDefault==1?Images.Right_yellow:Images.CIRCLE} style={{width:19,height:19}}/>
                            <ASText  style={[{color:colors.CHATTEXT,fontSize:12,marginLeft:10},item.isDefault==1?{color:colors.CHATBUDDLE}:{}]} text={'默认地址'}></ASText>
                        </ASTouchableOpacity>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{this.onPressEdit(item,index)}}>
                                <Image source={Images.EDIT} style={{width:13,height:13}}/>
                                <ASText  style={{fontSize:12,color:colors.Noticetitle,marginLeft:8}} text={'编辑'}></ASText>
                            </ASTouchableOpacity>
                            <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center',marginLeft:39}} onPress={()=>{this.onPressDel(item,index)}}>
                                <Image source={Images.Del_address} style={{width:11,height:13}}/>
                                <ASText  style={{fontSize:12,color:colors.Noticetitle,marginLeft:8}} text={'删除'}></ASText>
                            </ASTouchableOpacity>
                        </View>
                    </View>
                </View>
            </ASTouchableOpacity>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderAddressCell(item,index)}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                    style={{flex:1}}
                />
                <ASTouchableOpacity style={styles.newBtn} onPress={()=>{this.onPressAdd()}}>
                    <ASText style={[styles.title,{color:colors.CHATBUDDLE}]} text={'添加新地址'}></ASText>
                </ASTouchableOpacity>
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
        backgroundColor:colors.WHITE,
        paddingLeft:12,
        paddingVertical:15
    },
    title:{
        fontSize:14,
        color:colors.CHATTEXT
    },
    inputStyle:{
        padding:0,
        flex:1,
        fontSize:16,
        color:colors.CHATTEXT
    },
    btnView:{
       justifyContent:'space-between',
        alignItems:'center',
        paddingTop:15,
        borderTopColor:colors.LINE,
        borderTopWidth:colors.width_1_PixelRatio,
        flexDirection:'row',
        paddingRight:12
    },
    newBtn:{
        height:50,
        backgroundColor:colors.WHITE,
        justifyContent:'center',
        alignItems:'center'
    }
});