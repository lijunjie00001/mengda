import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage,ScrollView
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import SelectBox from '../../components/SelectBox';
import StringUtils from '../../../Resourse/StringUtil'
import ASText from '../../components/ASText'
@containers()
export default class AddaddRessPage extends Component{
    static propTypes = {
        successBack:React.PropTypes.func,
        uid:React.PropTypes.string,
        isEdit:React.PropTypes.bool,
        info:React.PropTypes.object,
    }
    static defaultProps = {
        isEdit:false,
        info:{}

    }
    constructor(props){
        super(props)
        this.cityState=''
        this.area=''
        this.state={
            name:this.props.isEdit?this.props.info.name?this.props.info.name:'':'',
            phone:this.props.isEdit?this.props.info.phone?this.props.info.phone:'':'',
            area:this.props.isEdit?this.props.info.pct?this.props.info.pct:'':'',
            street:'',
            isdefault:this.props.isEdit?this.props.info.isDefault==1?true:false:false,
            uid:this.props.uid,
            areaId:this.props.isEdit?this.props.info.townId?this.props.info.townId:'':'',
            address:this.props.isEdit?this.props.info.address?this.props.info.address:'':'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'添加地址',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                <Text style={[styles.title,{color:colors.CHATTEXT}]}>{'保存'}</Text>
            </ASTouchableOpacity>
        });
    }
    /**
     *@desc   保存
     *@author 张羽
     *@date   2018/12/13 下午4:59
     *@param
     */
    onPressSave(){
        if(!this.state.name){
            Alert.alert('提示','请输入收货人',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.phone){
            Alert.alert('提示','请输入联系电话',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!StringUtils.checkMobile(this.state.phone)){
            Alert.alert('提示','请输入正确的联系电话',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.area){
            Alert.alert('提示','请选择所在地区',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(!this.state.address){
            Alert.alert('提示','请输入详细地址',[{text:'确定',style:'cancel'}]);
            return ;
        }
        if(this.props.isEdit){
            let param={
                uid:this.props.uid,
                phone:this.state.phone,
                addrTownId:this.state.areaId,
                address:this.state.address,
                name:this.state.name,
                isDefault:this.state.isdefault?'1':'0',
                id:this.props.info.id
            }
            this.props.fetchData(this, '', Url.updateAddress(param), {}, successCallback = (data) => {
                console.log('............新加',data)
                Alert.alert('提示','地址修改成功',[{text:'确定',style:'cancel',onPress:()=>{
                        if(this.props.successBack){
                            this.props.successBack()
                        }
                        this.props.back()
                    }}]);
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });

        }else{
            let param={
                uid:this.props.uid,
                phone:this.state.phone,
                addrTownId:this.state.areaId,
                address:this.state.address,
                name:this.state.name,
                isDefault:this.state.isdefault?'1':'0'
            }
            this.props.fetchData(this, '', Url.addAddress(param), {}, successCallback = (data) => {
                console.log('............新加',data)
                Alert.alert('提示','地址添加成功',[{text:'确定',style:'cancel',onPress:()=>{
                        if(this.props.successBack){
                            this.props.successBack()
                        }
                        this.props.back()
                    }}]);
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }
    }
    /**
     *@desc   地址
     *@author 张羽
     *@date   2018/12/13 下午3:24
     *@param
     */
    onPressArea(){
        this.props.fetchData(this, '', Url.getProvince(), {}, successCallback = (data) => {
            console.log('............省份',data)
            let array=[]
            for(let i=0;i<data.info.length;i++){
                let param=data.info[i]
                let newParam={
                    ...param,
                    title:param.addrProName
                }
                array.push(newParam)
            }
            this.cityState='pro'
            this.dialog.show('请选择省份', array);
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   街道
     *@author 张羽
     *@date   2018/12/13 下午3:25
     *@param
     */
    onPressStreet(){

    }
    /**
     *@desc
     *@author 张羽
     *@date   2018/12/13 下午4:10
     *@param
     */
    callBackSelect(item){
        if(this.cityState=='pro'){
            this.props.fetchData(this, '', Url.getCityOfProvince(item.addrProId), {}, successCallback = (data) => {
                console.log('............城市',data)
                let array=[]
                for(let i=0;i<data.info.length;i++){
                    let param=data.info[i]
                    let newParam={
                        ...param,
                        title:param.addrCityName
                    }
                    array.push(newParam)
                }
                this.cityState='city'
                this.area=item.title
                this.dialog.show('请选择城市', array);
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }else if(this.cityState=='city'){
            this.props.fetchData(this, '', Url.getTownOfCity(item.addrCityId), {}, successCallback = (data) => {
                console.log('............城市',data)
                let array=[]
                for(let i=0;i<data.info.length;i++){
                    let param=data.info[i]
                    let newParam={
                        ...param,
                        title:param.addrTownName
                    }
                    array.push(newParam)
                }
                this.cityState=''
                this.area=this.area+item.title
                this.dialog.show('请选择城市', array);
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
            });
        }else{
            this.area=this.area+item.title
            this.setState({
                area:this.area,
                areaId:item.addrTownId
            })
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'收货人'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text)=>this.setState({name:text})}
                        defaultValue={this.state.name}
                        placeholder={'请输入收货人'}
                        placeholderTextColor={colors.TIME}
                    />
                </View>
                <View style={styles.cellView}>
                    <ASText style={styles.title} text={'联系电话'}></ASText>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text)=>this.setState({phone:text})}
                        defaultValue={this.state.phone}
                        placeholder={'请输入联系电话'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.TIME}
                    />
                </View>
                <ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressArea()}}>
                    <ASText style={styles.title} text={'所在地区'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ASText style={[styles.title,{color:colors.TIME}]} text={this.state.area?this.state.area:'请选择'}></ASText>
                        <Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>
                    </View>
                </ASTouchableOpacity>
                {/*<ASTouchableOpacity style={styles.cellView} onPress={()=>{this.onPressStreet()}}>*/}
                    {/*<Text style={styles.title}>{'街道'}</Text>*/}
                    {/*<View style={{flexDirection:'row',alignItems:'center'}}>*/}
                        {/*<Text style={[styles.title,{color:colors.TIME}]}>{this.state.street?this.state.street:'请选择'}</Text>*/}
                        {/*<Image source={Images.ARROW_GRAY} style={{width:7,height:16,marginLeft:4}}/>*/}
                    {/*</View>*/}
                {/*</ASTouchableOpacity>*/}
                <View style={styles.addressView}>
                    <TextInput
                        style={[styles.inputStyle,{marginLeft:0,textAlign:'left'}]}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text)=>this.setState({address:text})}
                        defaultValue={this.state.address}
                        placeholder={'请填写详细地址 '}
                        multiline={true}
                        placeholderTextColor={colors.TIME}
                    />
                </View>
                <ASTouchableOpacity style={[styles.cellView,{paddingVertical:7,marginTop:10}]} onPress={()=>{{this.setState({isdefault:!this.state.isdefault})}}}>
                    <ASText style={styles.title} text={'设为默认'}></ASText>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={!this.state.isdefault?Images.NO_default:Images.Yes_default} style={{width:50,height:31}}/>
                    </View>
                </ASTouchableOpacity>
                </ScrollView>
                <SelectBox
                    callback={item => this.callBackSelect(item)}
                    isLogin
                    ref={(dialog) => {
                        this.dialog = dialog;
                    }}
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
    },
    inputStyle:{
        padding:0,
        flex:1,
        fontSize:16,
        color:colors.CHATTEXT,
        marginLeft:20,
        textAlign:'right'
    },
    addressView:{
        height:120,
        paddingVertical:10,
        paddingHorizontal:12,
        backgroundColor:colors.WHITE,

    }
});