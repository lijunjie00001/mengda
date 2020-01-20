import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Platform
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import  DeviceInfo from 'react-native-device-info';
const device = DeviceInfo.getModel();
const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
import BListView  from '../../components/BListView'
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
@containers()
export default class SearchPage extends Component{
    constructor(props){
        super(props)
        this.state={
            searchText:'',
            data:[]
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'搜索',
            hiddenNav:true
        });
    }
    /**
     *@desc   搜索好友请求
     *@author 张羽
     *@date   2019/2/20 下午4:19
     *@param
     */
    onPressAddFriedn(){
        if(!this.state.searchText) return
        this.props.fetchData(this, '', Url.searchFriend(this.props.uid,this.state.searchText), {}, successCallback = (data) => {
            console.log('...........sous荐',data)
            this.setState({
                data:data.info
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   发送好友请求
     *@author 张羽
     *@date   2019/2/21 上午11:25
     *@paramm
     */
    onPressAdd(item){
        this.props.fetchData(this, '', Url.addFriend(this.props.uid,item.id), {}, successCallback = (data) => {
            console.log('发送好友列表',data)
            Toast.showShortCenter('已发送好友请求')
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   搜索框
     *@author 张羽
     *@date   2018/12/17 下午3:16
     *@param
     */
    renderTopView(){
        return(
            <View style={styles.topView}>
                <View style={styles.searchInputView}>
                    <Image source={require('../../images/common/search.png')} style={styles.searchImg}/>
                    <TextInput
                        style={styles.searchInput}
                        underlineColorAndroid={'transparent'}
                        placeholder={'搜索您需要添加的好友'}
                        value={this.state.searchText}
                        placeholderTextColor={colors.CAED}
                        onChangeText={(text)=>this.setState({searchText:text})}
                        onEndEditing={()=>{
                            this.onPressAddFriedn()
                        }}
                        returnKeyType = {'search'}
                    />
                </View>
                <ASTouchableOpacity style={{paddingLeft:22,justifyContent:'center'}} onPress={()=>{this.props.back()}}>
                    <ASText style={{fontSize:16,color:colors.CHATTEXT,fontWeight:'bold'}} text={'取消'}></ASText>
                </ASTouchableOpacity>
            </View>
        )
    }
    renderRow(rowData,sectionId,rowId){
        return(
            <View style={{paddingHorizontal:12,flexDirection:'row',alignItems:'center'}}>
                <BImage style={{width:45,height:45}} source={{uri:rowData.cover}}/>
                <View style={{flex:1,marginLeft:10,paddingVertical:13,borderBottomWidth:colors.width_1_PixelRatio,borderBottomColor:colors.LINE,justifyContent:'space-between',flexDirection:'row'}}>
                    <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={rowData.username}></ASText>
                    <ASTouchableOpacity onPress={()=>{this.onPressAdd(rowData)}}
                        style={[{paddingVertical:7,paddingHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:3},rowData.isFriend==0?{backgroundColor:colors.AddFriend}:{borderWidth:colors.width_1_PixelRatio,borderColor:colors.CHATTEXT}]}>
                        <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={rowData.isFriend==0?'添加':'已添加'}></ASText>
                    </ASTouchableOpacity>
                </View>
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                {this.renderTopView()}
                <BListView
                    data={this.state.data}//设置数据源
                    renderRow={(rowData,sectionId,rowId)=>this.renderRow(rowData,sectionId,rowId)}//返回cell
                    style={[styles.listView]}
                    enableEmptySections = {true}
                    renderSeparator={()=>{return null}}//分割线
                    removeClippedSubviews={true}
                    ref='scrollView'
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingTop:Platform.OS === 'ios'?tabHeight:0,
    },
    title:{
        fontSize:16,
        color:colors.CHATTEXT
    },
    searchInput:{
        padding:0,
        flex:1,
        fontSize:15,
        color:colors.CHATTEXT,
        marginLeft:10
    },
    topView:{
        flexDirection:'row',
        height:44,
        paddingHorizontal:12,
        alignItems:'center'
    },
    searchInputView:{
        height:30,
        flexDirection:'row',
        flex:1,
        backgroundColor:colors.SEARCH_back,
        paddingHorizontal:10,
        alignItems:'center',
        borderRadius:5,
    },
    searchImg:{
        width:20,
        height:20,
        resizeMode:'contain',
    },

});