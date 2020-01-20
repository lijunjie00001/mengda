import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList, Image,
} from 'react-native';
import colors from '../../../Resourse/Colors'
import BImage from '../../components/BImage'
import {width} from "../../../Resourse/CommonUIStyle";
import ASText from "../../components/ASText";
import ASTouchableOpacity from "../../components/ASTouchableOpacity";
import Images from "../../../Resourse/Images";
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast";
export default class JiudianPinjia  extends Component{
    constructor(props){
        super(props)
        this.page=1
        this.perPage=10
        this.state={
            comment:[]
        }
    }
    componentDidMount() {
        this.businessComment()
    }

    /**
     *@desc   获取评论
     *@author 张羽
     *@date   2019-08-27 23:50
     *@param
     */
    businessComment(){
        this.props.fetchData(this, '', Url.businessComment(this.props.businessId,this.props.userId,this.page,this.perPage), {}, successCallback = (data) => {
            console.log('............网红推荐评论',data)
            this.setState({
                comment:data.info.list,//评论
            })
            return;
        }, failure = (data) => {

            Toast.showShortCenter(data.msg)
        });
    }
    renderRow(item,index){
        let replay=item.replay?item.replay:[]
        let star=item.star?item.star:5
        return(
            <View style={{backgroundColor:'white',borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:colors.LINE}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal: 12,paddingTop:16}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <BImage source={{uri:item.cover?item.cover:''}} style={{width:44,height:44,borderRadius: 22}}/>
                        <View style={{marginLeft:14}}>
                            <ASText text={item.username} style={{fontSize:13,color:'#3d3d3d'}}/>
                            <View style={{flexDirection:'row',marginTop:6}}>
                                <Image source={star>=1?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:12,height:12}}/>
                                <Image source={star>=2?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:12,height:12,marginLeft:6}}/>
                                <Image source={star>=3?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:12,height:12,marginLeft:6}}/>
                                <Image source={star>=4?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:12,height:12,marginLeft:6}}/>
                                <Image source={star>=5?require('../../images/home/starSlect.png'):require('../../images/home/pingjiastar.png')} style={{width:12,height:12,marginLeft:6}}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{marginLeft:70,paddingVertical:18,paddingRight: 12}}>
                    <ASText text={item.content} style={{fontSize:16,color:'#3d3d3d'}}/>
                </View>
                <View style={{paddingHorizontal:12,paddingBottom:10}}>
                    <View style={{backgroundColor:'#f8f8f8'}}>
                        {replay.map((item,index)=>{
                            return(
                                <View style={{flexDirection:'row',paddingHorizontal: 12,paddingTop:10,paddingBottom:20,borderBottomWidth: colors.width_1_PixelRatio,borderBottomColor:'#eeeeee'}} key={index}>
                                    <View style={{flexDirection:'row'}}>
                                        <BImage source={{uri:item.cover?item.cover:''}} style={{width:30,height:30,borderRadius: 15}}/>
                                        <View style={{marginLeft:14}}>
                                            <ASText text={item.username} style={{fontSize:13,color:'#dcc490'}}/>
                                            <ASText text={item.content} style={{fontSize:14,color:'#3d3d3d',marginTop:10}}/>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-end',paddingBottom:10,paddingRight:12}}>
                    <ASText text={item.createTime} style={{fontSize:12,color:'#959595'}}/>
                </View>
            </View>
        )
    }
    _keyExtractor = (item, index) => 'friend'+item.id
    render(){
        return(
            <View style={{flex:1}}>
                <View style={{paddingLeft: 12,paddingTop: 24,paddingBottom: 11,backgroundColor:'white'}}>
                    <ASText text={'评价'} style={{fontSize:16,color:'#3d3d3d'}}/>
                    <View style={{position:'absolute',width:20,height:2,left:12,bottom:0,backgroundColor:'#e3782c'}}></View>
                </View>
                <FlatList
                    data = {this.state.comment}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    ItemSeparatorComponent={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    style={{flex:1,backgroundColor:'white',marginTop:1}}
                    ListEmptyComponent={()=>{
                        return(
                            <View style={{alignItems:'center',paddingVertical:20}}>
                                <ASText style={{fontSize:15,color:colors.JF_title}} text={'暂无评论'}></ASText>
                            </View>
                        )
                    }}

                />
            </View>
        )
    }

}
