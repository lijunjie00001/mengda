import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList, Alert, AsyncStorage
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import ASText from '../../components/ASText'
@containers()
export default class MyjfListPage extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object,
        status:React.PropTypes.string,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.pageNum=10
        this.page=1
        this.state={
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
            data:[],
            refreshing:false,
            isLoadComplete:false,
            isLoadMore:false,
            refreshing:false
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
     *@date   2018/12/14 上午11:30
     *@param
     */
    getData(isMore){
        this.props.fetchData(this, '', Url.integralList(this.state.uid,this.props.status,this.page), {}, successCallback = (data) => {
            console.log('............列表',data)
            this.setState({
                data:isMore?this.state.data.concat(data.info.list):data.info.list,
                refreshing:false,
                isLoadMore:false,
                isLoadComplete:data.info.list.length<this.pageNum?true:false
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
     *@desc   积分cell
     *@author 张羽
     *@date   2018/12/14 上午11:04
     *@param
     */
    renderJfListRow(item,index){
        return (
            <View style={styles.cellView}>
                <ASTouchableOpacity style={{flex:1}} key={index} >
                    <View style={[styles.jfView]}>
                        <ASText style={{fontSize:16,color:colors.CHATTEXT}} text={item.orderType}></ASText>
                        <ASText style={{fontSize:16,color:colors.CHATTEXT,fontWeight:'bold'}} text={item.type==1?'+'+item.integral:'-'+item.integral}></ASText>
                    </View>
                    <View style={[styles.jfView,{marginTop:9}]}>
                        <ASText style={{fontSize:13,color:colors.CHATTEXT}} text={'剩余积分:'}></ASText>
                        <ASText style={{fontSize:13,color:colors.JF_title}} text={item.createTime}></ASText>
                    </View>
                </ASTouchableOpacity>
            </View>
        );
    }
    _keyExtractor = (item, index) => 'jifen'+index
    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderJfListRow(item,index)}
                    ItemSeparatorComponent={({item,index})=>{return(<View style={{height:colors.width_1_PixelRatio,backgroundColor:colors.LINE}}></View>)}}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    style={{flex:1}}
                    ListEmptyComponent={()=>{
                        if(this.state.isLoadComplete){
                            return <View></View>
                        }
                        return(
                            <View style={{alignItems:'center',paddingTop:20}}>
                                <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                            </View>
                        )}}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{this.onRefresh()}}
                    onEndReachedThreshold={0.3}
                    onEndReached={()=>this.onEndReached()}
                    ListFooterComponent={()=>{
                        if(this.state.isLoadComplete){
                            return(
                                <View style={{alignItems:'center',paddingVertical:10}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                                </View>
                            )
                        }else if(this.state.isLoadMore){
                            return(
                                <View style={{alignItems:'center',paddingVertical:20}}>
                                    <ASText style={{fontSize:15,color:colors.JF_title}} text={'正在加载中...'}></ASText>
                                </View>
                            )
                        }else{
                            return <View></View>
                        }
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cellView:{
        backgroundColor:colors.WHITE,
        justifyContent:'center',
        paddingHorizontal:11,
        paddingVertical:14
    },
   jfView:{
        justifyContent:'space-between',
       alignItems:'center',
       flexDirection:'row'
   }
});