import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions, Platform, AsyncStorage, TextInput, Image, FlatList, Text, DeviceEventEmitter
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import BImage from '../../components/BImage'
import JMessage from 'jmessage-react-plugin';
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import ASText from '../../components/ASText'
@containers()
export default class AddFriendPage extends Component {
    static propTypes = {

    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.page=1
        this.pageNum=10
        this.state={
            searchText:'',
            data:[
            ],
            isLoadComplete:true,
            isLoadMore:false,
            refreshing:false
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'添加好友',
        });
        this.getData(false)
    }
    componentWillUnmount(){
        DeviceEventEmitter.emit('addfriend')
    }
    /**
     *@desc   获取get
     *@author 张羽
     *@date   2019/2/21 上午11:29
     *@param
     */
    getData(isMore){
        let param={
            uid:this.props.uid,
        }
        this.props.fetchData(this, '', Url.friendRequestList(param), {}, successCallback = (data) => {
            console.log('请求好友列表',data)
            this.setState({
                data:data.info,
                refreshing:false,
                isLoadMore:false,
            })
            return;
        }, failure = (data) => {
            this.setState({
                refreshing:false,
                isLoadMore:false,
                isLoadComplete:false
            })
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2019/3/17 下午5:57
     *@param
     */
    onRefresh(){
        if(this.state.refreshing)return
        if(this.state.isLoadMore)return
        this.setState({
            refreshing:true
        })
        this.page=1
        this.getData(false)
    }
    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2019/3/17 下午5:58
     *@param
     */
    onEndReached(){
        if(this.state.refreshing)return
        if(this.state.isLoadMore)return
        if(this.state.isLoadComplete) return
        this.setState({ isLoadMore:true},()=>{
            this.page=parseInt(this.state.data.length/this.pageNum)+1
            this.getData(true)
        })
    }
    /**
     *@desc   添加
     *@author 张羽
     *@date   2019/2/21 下午12:14
     *@param
     */
    onPressAdd(item){
        let type=item.status
        // // if(type==0){
        this.props.fetchData(this, '', Url.acceptFriend(this.props.uid,item.uid,'2'), {}, successCallback = (data) => {
                item.status=2
                this.setState({
                    data:this.state.data
                })
                return;
            }, failure = (data) => {
                Toast.showShortCenter(data.notice)
        });
        // }
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
                    <ASTouchableOpacity style={{flex:1}} onPress={()=>{
                        this.props.push('SeachFriend',{uid:this.props.uid})
                    }}>
                        <ASText style={{color:colors.CAED}} text={'搜索您要添加的好友'}/>
                    </ASTouchableOpacity>
                </View>
            </View>
        )
    }
    renderRow(item,index){
        let type=item.status
        return(
            <View style={{paddingHorizontal:12,flexDirection:'row',alignItems:'center'}}>
                <BImage style={{width:45,height:45}} source={{uri:item.cover}}/>
                <View style={{flex:1,marginLeft:10,paddingVertical:13,borderBottomWidth:colors.width_1_PixelRatio,borderBottomColor:colors.LINE,justifyContent:'space-between',flexDirection:'row'}}>
                    <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={item.username}/>
                    <ASTouchableOpacity onPress={()=>{this.onPressAdd(item)}}
                                        style={[{paddingVertical:7,paddingHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:3},type=='0'?{backgroundColor:colors.AddFriend}:{borderWidth:colors.width_1_PixelRatio,borderColor:colors.CHATTEXT}]}>
                        <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={type=='0'?'添加':type=='2'?'已添加':type=='1'?'已拒绝':''}/>
                    </ASTouchableOpacity>
                </View>
            </View>
        )
    }
    _keyExtractor = (item, index) => 'vip'+index
    render() {
        return (
            <View style={styles.container}>
                {this.renderTopView()}
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    style={{flex:1}}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{this.onRefresh()}}
                    ListFooterComponent={()=>{
                        return(
                            <View style={{alignItems:'center',paddingVertical:10}}>
                                <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}/>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
})
