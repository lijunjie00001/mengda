import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList, Animated, Easing, Image, TouchableOpacity,ImageBackground
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
import BImage from '../../components/BImage'
import ASText from '../../components/ASText'
@containers()
export default class CollectionListPage extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object,
        status:React.PropTypes.string,
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.pageNum=10
        this.page=1
        this.state={
            data:[],
            refreshing:false,
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
            opacity: new Animated.Value(0),
            show:false,
            quanSlect:false
        }
        this.clickRight=this.clickRight.bind(this)
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'收藏夹',
            rightBtnItems:[{title: '管理',imageSource:'',func:this.clickRight}]
        });
        this.getData()
    }

    /**
     *@desc   点击管理
     *@author 张羽
     *@date   2019-08-28 01:24
     *@param
     */
    clickRight(){
        if(!this.state.show){
            this.setState({
                show:true,
            });
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                },
            ).start(() => {
            });
        }else{
            this.state.opacity.stopAnimation(() => {
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 0,
                        duration: 500,
                        easing: Easing.linear,
                    },
                ).start(() => {
                    this.setState({
                        show:false,
                        opacity: new Animated.Value(0),

                    });
                });
            })
        }
    }
    /**
     *@desc   获取数据
     *@author 张羽
     *@date   2018/12/14 上午11:30
     *@param
     */
    getData(){
        this.props.fetchData(this, '', Url.collectionv2(this.state.uid,this.page,this.pageNum), {}, successCallback = (data) => {
            console.log('............列表',data)
            let array=[]
            for (let obj of data.info.list) {
                let newobj={
                    ...obj,
                    isSlect:false
                }
                array.push(newobj)
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
            Toast.showShortCenter(data.notice)
        });
    }
    onPressHot(item){
        if(item.type=='1'){
            this.props.push('HomeDetails',{userId:this.state.uid+'',businessId:item.itemid+''})
        }else if(item.type=='2'){
            this.props.push('VipListDetails',{uid:this.state.uid+'',id:item.itemid+''})
        }

    }
    /**
     *@desc   刷新
     *@author 张羽
     *@date   2018/12/18 下午5:26
     *@param
     */
    onRefresh(){
        if(this.state.refreshing)return
        this.setState({
            refreshing:true
        },()=>{
            this.getData()
        })
    }

    /**
     *@desc   点击全选
     *@author 张羽
     *@date   2019-08-28 01:59
     *@param
     */
    onPressQuan(){
        for(let item of this.state.data){
            item.isSlect=!item.isSlect
        }
        this.setState({
            quanSlect:!this.state.quanSlect,
            data:this.state.data
        })
    }
    /**
     *@desc   点击选择
     *@author 张羽
     *@date   2019-08-28 01:56
     *@param
     */
    onPressSlect(item){
        item.isSlect=!item.isSlect
        this.setState({
            data:this.state.data
        })
    }

    /**
     *@desc   点击删除
     *@author 张羽
     *@date   2019-08-28 02:05
     *@param
     */
    onPressDel(){
        let cid=''
        for(let item of this.state.data){
            if(item.isSlect){
                cid=cid+item.id+','
            }
        }
        if(!cid){
            Toast.showShortCenter('至少选择一个')
            return
        }
        if (cid.endsWith(',')){
            cid = cid.substring(0,cid.length-1);
        }
        this.props.fetchData(this, '', Url.collectionDelete(this.state.uid,cid), {}, successCallback = (data) => {
            console.log('............列表',data)
            let array=[]
            for (let obj of this.state.data) {
                if(!obj.isSlect){
                    array.push(obj)
                }
            }
            this.setState({
                data:array,
                refreshing:false
            })
            Toast.showShortCenter('删除成功')
            return;
        }, failure = (data) => {
            this.setState({
                refreshing:false
            })
            Toast.showShortCenter(data.notice)
        });

    }
    /**
     *@desc   cell
     *@author 张羽
     *@date   2018/12/18 下午5:16
     *@param
     */
    renderRow(item,index){
        let label=Array.isArray(item.label)?item.label:[]
        return(
            <TouchableOpacity style={styles.cellView} key={index} onPress={()=>{this.onPressHot(item)}}>
                {this.state.show ? <ASTouchableOpacity style={{justifyContent: 'center',}} onPress={() => {
                    this.onPressSlect(item)
                }}>
                    <Image
                        source={item.isSlect ? require('../../images/my/collectionSlect.png') : require('../../images/my/collection.png')}
                        style={{width: 20, height: 20}}/>
                </ASTouchableOpacity> : null
                }
                <Animated.View style={[styles.hotListInnerView,
                    {marginLeft:this.state.opacity.interpolate({inputRange:[0,1],outputRange:[0,12]})}]}>
                    <BImage source={{uri:item.cover}}  style={{width:64,height:64,borderRadius:4}} imageStyle={{borderRadius:4}}/>
                    <View style={{marginLeft:10,flex:1}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <ASText style={{fontSize:14,fontWeight:'bold',color:colors.CHATTEXT}} text={item.name}></ASText>
                            <ASText style={{fontSize:10,color:'#737373'}} text={'收藏'+item.collection}></ASText>
                        </View>
                        {item.type==2? <ASText numberOfLines={1} style={{fontSize:13,color:'#e27120',marginTop:10}} text={'¥'+item.price}></ASText>:
                        item.discount &&item.discount!='0.0'&&parseFloat(item.discount)<10?<ImageBackground style={{width:44,height:17,marginTop:10,justifyContent:'center',alignItems:'flex-end',paddingRight: 5}} source={require('../../images/home/zhekou.png')}>
                            <ASText numberOfLines={1} style={{fontSize:13,color:'white',backgroundColor:colors.TRANSPARENT_COLOR}} text={item.discount+'折'}></ASText>
                        </ImageBackground>:
                        <ASText numberOfLines={1} style={{fontSize:13,color:'#e27120',marginTop:10}} text={'¥'+item.discount}></ASText>}
                        <View style={{marginTop:10,flexDirection:'row',flexWrap: 'wrap'}}>
                            {label.map((item,index)=>{
                                return(
                                    <View style={[{borderWidth:colors.width_1_PixelRatio,padding:2,
                                        justifyContent:'center',alignItems:'center',borderRadius:2,borderColor:'#e27120'},index==0?{}:{marginLeft:10}]} key={index}>
                                        <ASText style={{fontSize:10,color:'#e27120'}} text={item}></ASText>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                 </Animated.View>
            </TouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => 'shoucang'+item.id
    render(){
        return(
            <View style={styles.container}>
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
                                <ASText style={{fontSize:15,color:colors.JF_title}} text={'---我是有底线的---'}></ASText>
                            </View>
                        )
                    }}
                />
                {this.state.show?<View style={{justifyContent: 'space-between',paddingHorizontal:12,alignItems:'center',height:50,flexDirection:'row',backgroundColor:'white'}}>
                    <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{this.onPressQuan()}}>
                        <Image source={this.state.quanSlect?require('../../images/my/collectionSlect.png'):require('../../images/my/collection.png')} style={{width:20,height:20}}/>
                        <ASText  style={{fontSize:14,color:colors.TIME,marginLeft:12}} text={'全选'}></ASText>
                    </ASTouchableOpacity>
                    <ASTouchableOpacity style={{flexDirection:'row',alignItems:'center',
                        backgroundColor:'#e3782c',justifyContent:'center',paddingHorizontal:15,paddingVertical:10,borderRadius: 10}} onPress={()=>{this.onPressDel()}}>
                        <ASText  style={{fontSize:12,color:'white'}} text={'删除'}></ASText>
                    </ASTouchableOpacity>
                </View>:null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:10,
        backgroundColor:colors.BackPage
    },
    // cellView:{
    //     backgroundColor:colors.WHITE,
    //     justifyContent:'center',
    //     paddingHorizontal:11,
    //     paddingVertical:14
    // },
    jfView:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    hotListInnerView:{
        flexDirection:'row'
    },
    HotListLeftView:{
        flexDirection:'row',
    },
    HotListRightView:{
        marginLeft:14,
        flex:1
    },
    cellView:{
        paddingHorizontal:12,
        paddingVertical:16,
        borderBottomColor:colors.LINE,
        borderBottomWidth: colors.width_1_PixelRatio,
        alignItems:'center',
        backgroundColor:'white',
        flexDirection:'row'
    }

});
