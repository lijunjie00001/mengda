import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Platform,FlatList
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
@containers()
export default class VipList extends Component{
    static propTypes = {
        status:React.PropTypes.string,
    }
    constructor(props){
        super(props)
        this.perPage=10
        this.page=1
        this.state={
            uid:'',
            cateId:this.props.status,
            data:[]
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
    getData(){
        this.props.fetchData(this, '', Url.goodsList(this.state.uid,this.state.cateId,this.page,this.perPage), {}, successCallback = (data) => {
            console.log('............推荐',data)
            this.setState({data:data.info.list})
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    onPressHot(item){
        this.props.push('VipListDetails',{uid:this.state.uid,id:item.id+''})
    }
    _keyExtractor = (item, index) => 'vip'+index
    renderRow(rowData,index){
        return(
            <ASTouchableOpacity style={{width:'100%',backgroundColor:colors.WHITE,paddingHorizontal:12}} onPress={()=>{this.onPressHot(rowData)}}>
                <View style={styles.hotListInnerView}>
                    <View style={styles.HotListLeftView}>
                        <BImage source={{uri:rowData.cover}} style={{width:140,height:100,backgroundColor:colors.BACK_COLOR,borderRadius:6}} imageStyle={{borderRadius: 6}}/>
                        <View style={styles.HotListRightView}>
                            <View>
                            <ASText style={{fontSize:17,fontWeight:'bold',color:colors.CHATTEXT}} text={rowData.cate}></ASText>
                            <ASText numberOfLines={1} style={{fontSize:14,color:colors.TIME,marginTop:10}} text={rowData.goodsName}></ASText>
                            </View>
                            <ASText style={{fontSize:18,color:colors.Price}} text={'￥'+rowData.price}><ASText style={{fontSize:11,color:colors.TIME,fontWeight:'normal'}} text={'元'}></ASText></ASText>
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
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    hotListInnerView:{
        justifyContent:'center',
        paddingVertical:17,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE
    },
    HotListLeftView:{
        flexDirection:'row',
        alignItems:'center'
    },
    HotListRightView:{
        marginLeft:14,
        justifyContent:'space-between',
        height:100,
    },
})
