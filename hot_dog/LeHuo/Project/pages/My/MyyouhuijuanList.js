import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList, Alert, AsyncStorage,Image
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import ASText from '../../components/ASText'
const ColorImage={
    //美食
    'a':{
        lineColor:colors.MeishiLine,
        titleColr:colors.MeishiTitle,
        img:require('../../images/home/food.png')
    },
    //酒店
    'b':{
        lineColor:colors.JiuDianLine,
        titleColr:colors.JiuDianTitle,
        img:require('../../images/home/restaurant.png')
    },
    //spa
    'c':{
        lineColor:colors.SPAlline,
        titleColr:colors.SPAtitle,
        img:require('../../images/home/spa.png')
    },
    //夜色
    'd':{
        lineColor:colors.YESEline,
        titleColr:colors.YESETitle,
        img:require('../../images/home/nignt.png')
    }
}
@containers()
export default class CollectionListPage extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object,
        status:React.PropTypes.string,
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.state={
            data:[],
            refreshing:false,
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.pageId,
            hiddenNav:true
        });
        this.getData()
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/14 上午11:30
     *@param
     */
    getData(){
        // this.page=parseInt(this.state.data.length/this.pageSize)+1;
        this.props.fetchData(this, '', Url.couponList(this.state.uid,this.props.status), {}, successCallback = (data) => {
            console.log('............列表',data)
            this.setState({
                data:data.info.list
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    onPressHot(item){
        this.props.push('YouhuijuanDetailsPage',{title:item.typeStr,juanHao:item.couponNo,endTime:item.expireDate})
    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2018/12/18 下午5:26
     *@param
     */
    onRefresh(){

    }
    /**
     *@desc   cell
     *@author 张羽
     *@date   2018/12/18 下午5:16
     *@param
     */
    renderRow(rowData,index){
        //2餐饮 1酒店 3美容 4夜色
        let json=rowData.type==1?ColorImage.c:rowData.type==2?ColorImage.b:rowData.type==3?ColorImage.c:rowData.type==4?ColorImage.d:ColorImage.d
        return(
            <ASTouchableOpacity style={{width:'100%',backgroundColor:colors.WHITE,paddingHorizontal:27,paddingBottom:20}} onPress={()=>{this.onPressHot(rowData)}}>
                <View style={{borderWidth:2,borderColor:json.lineColor,borderRadius:5,flexDirection:'row',alignItems:'center',height:90}}>
                    <Image source={json.img} style={{width:36,height:36,resizeMode:'contain',marginLeft:25}}/>
                    <ASText style={{fontSize:17,fontWeight:'bold',color:colors.CHATTEXT,marginLeft:10}} text={rowData.typeStr}></ASText>
                    <ASText style={{fontSize:13,color:colors.CHATTEXT,marginLeft:10}} text={rowData.name}></ASText>
                    <View style={styles.timeView}>
                        <ASText style={{fontSize:11,color:json.titleColr}} text={'有效期: '+rowData.expireDate}></ASText>
                    </View>
                </View>
            </ASTouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'shoucang'+index
    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data = {this.state.data}
                    renderItem={({item,index})=>this.renderRow(item,index)}
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
        backgroundColor:'white'
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
    },
    hotListInnerView:{
        justifyContent:'center',
        paddingVertical:17,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE
    },
    HotListLeftView:{
        flexDirection:'row',
    },
    HotListRightView:{
        marginLeft:14,
        flex:1
    },
    timeView:{
        position:'absolute',
        right:8,
        bottom:8
    }

});