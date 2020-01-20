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
        status:React.PropTypes.string,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.pageSize=10
        this.page=1
        this.state={
            uid:'',
            data:[],
            refreshing:false
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.pageId,
            hiddenNav:true
        });
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.setState({
                        uid:userinfo.id+''
                    },()=>{
                        this.getData()
                    })
                }
            }
        })
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/14 上午11:30
     *@param
     */
    getData(){
        // this.page=parseInt(this.state.data.length/this.pageSize)+1;
        this.props.fetchData(this, '', Url.recommendBusiness(this.state.uid,'1',this.props.status), {}, successCallback = (data) => {
            console.log('............列表',data)
            // this.setState({
            //     data:data.info.list
            // })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   刷新数据
     *@author 张羽
     *@date   2018/12/14 上午11:41
     *@param
     */
    onRefresh(){
        this.setState({refreshing:true})
        this.props.fetchData(this, '', Url.integralList(this.state.uid,this.props.status,this.page), {}, successCallback = (data) => {
            console.log('............列表',data)
            this.setState({
                data:data.info.list,
                refreshing:false
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
            this.setState({refreshing:false})
        });
    }
    /**
     *@desc   加载更多
     *@author 张羽
     *@date   2018/12/14 下午3:51
     *@param
     */
    onEndReached(){
        this.setState({refreshing:true})
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
                    extraData={this.state}
                    style={{flex:1}}
                    ListEmptyComponent={()=>{return(
                        <View style={{alignItems:'center',paddingTop:20}}>
                            <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                        </View>
                    )}}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{this.onRefresh()}}
                    // onEndReachedThreshold={0.3}
                    // onEndReached={()=>{this.onEndReached()}}
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