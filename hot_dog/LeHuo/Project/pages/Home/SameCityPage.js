import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Platform,  FlatList
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
import MasonryList from '@appandflow/masonry-list';
@containers()
export default class SameCityPage extends Component{
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.state={
            data:[],
            refreshing:false
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'同城推荐',
        });
        this.getData()
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/17 下午3:55
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.recommendBusiness('','3'), {}, successCallback = (data) => {
            console.log('............同城推荐',data)
            let array=data.info.list
            for(let i=0;i<array.length;i++){
                let obj=array[i]
                obj.index=i
            }
            this.setState({
                data:array,
                refreshing:false
            })
            return;
        }, failure = (data) => {
            this.setState({
                refreshing:false
            })
            Toast.showShortCenter(data.msg)
        });
    }
    onRefresh(){
        if(this.state.refreshing)return
        this.setState({
            onRefresh:true
        },()=>{
            this.getData()
        })
    }
    /**
     *@desc   点击详情
     *@author 张羽
     *@date   2018/12/23 下午3:50
     *@param
     */
    onPressHot(item){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.props.push('HomeDetails',{userId:userinfo.id+'',businessId:item.id+''})
                }else{
                    this.props.push('Login',{transition:'forVertical'})
                }
            }
        })
    }
    /**
     *@desc   cell
     *@author 张羽
     *@date   2018/12/17 下午3:55
     *@param
     */
    _renderItem = ({item}) =>{
        let height=(item.index+1)%2==0?120:150
        height=(item.index+1)%4==0?150:height
        return(
            <ASTouchableOpacity style={{paddingLeft:12,paddingTop:16}} onPress={()=>{this.onPressHot(item)}}>
                <View style={styles.recommendInnerView}>
                    <BImage source={{uri:item.cover}} style={{width:(width-36)/2,height:height,borderRadius:6}}  imageStyle={{borderRadius:6}}
                            // isResize={true} imageWidth={(width-36)/2} imageHeight={200} pubuliu={true}
                    />
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10,alignItems:'center',width:(width-48)/2,paddingHorizontal:6,height:20}} >
                        <ASText style={{fontSize:10,color:'#333',fontWeight:'bold',width:(width-48)/2-60}} text={item.name} numberOfLines={1}></ASText>
                        <ASText style={{fontSize:10,color:'rgb(217,199,137)',width:50}} text={item.address} numberOfLines={1}></ASText>
                    </View>
                    <View style={{height:15}}>
                       <ASText numberOfLines={1} style={{fontSize:10,color:'#898989',marginLeft: 6}} text={'套餐包含:'+item.slogan}></ASText>
                    </View>
                </View>
            </ASTouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'samecity'+item.id
    /**
     *@desc   计算cell的高度
     *@author 张羽
     *@date   2019-09-07 00:36
     *@param
     */
    _getHeightForItem = ({item,index}) => {
        let height=(item.index+1)%2==0?120:150
        height=(item.index+1)%4==0?150:height
        return height+96;
    }
    render(){
        return(
            <View style={styles.container}>
                {/*<FlatList*/}
                {/*    data = {this.state.data}*/}
                {/*    renderItem={({item,index})=>this.renderRow(item,index)}*/}
                {/*    renderSeparator={()=>null}//分割线*/}
                {/*    keyExtractor={this._keyExtractor}*/}
                {/*    numColumns={2}*/}
                {/*    style={{flex:1,paddingRight:12}}*/}
                {/*    refreshing={this.state.refreshing}*/}
                {/*    onRefresh={()=>{this.onRefresh()}}*/}
                {/*    ListFooterComponent={()=>{ return(*/}
                {/*        <View style={{alignItems:'center',paddingVertical:10}}>*/}
                {/*            <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>*/}
                {/*        </View>*/}
                {/*    )}}*/}
                {/*/>*/}
                <MasonryList
                    data={this.state.data}
                    numColumns={2}
                    renderItem={this._renderItem}
                    getHeightForItem={this._getHeightForItem}
                    keyExtractor={this._keyExtractor}
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
    recommendInnerView:{
        borderWidth:colors.width_1_PixelRatio,
        borderColor:colors.LINE,
        paddingBottom:10,
        borderRadius: 6
    },
})
