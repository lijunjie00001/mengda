import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Platform,ScrollView
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
// import Url from "../../../Resourse/url";
// import Toast from "@remobile/react-native-toast/index";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
// import  DeviceInfo from 'react-native-device-info';
// const device = DeviceInfo.getModel();
import ASText from '../../components/ASText'
// const tabHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
const tabHeight=0
@containers()
export default class SearchPage extends Component{
    constructor(props){
        super(props)
        this.Hoffset=0
        this.Voffset=0
        this.state={
            searchText:'',
            historyData:[],
            typeArray:this.props.typeArray?this.props.typeArray:[],
            slectType:this.props.typeArray?this.props.typeArray[0].name:''
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'搜索',
            hiddenNav:true
        });
        AsyncStorage.getItem('historySearch', (error, result) => {
            if (!error) {
                if(result != null) {
                    let historySearch = JSON.parse(result)
                    console.log('.......kkk', historySearch)
                    this.setState({
                        historyData: historySearch,
                    })

                }
            }
        })
    }
    /**
     *@desc   横向
     *@author 张羽
     *@date   2019-08-28 17:12
     *@param
     */
    onLayout(event,item){
        let {x,width} = event.nativeEvent.layout;
        if(!item.x){
            item.x=x
            item.width=width
        }
    }
    /**
     *@desc   横向滚动
     *@author 张羽
     *@date   2019-08-28 17:23
     *@param
     */
    HonScroll(event){
        console.log('.....onLayout',event.nativeEvent)
        this.Hoffset=event.nativeEvent.contentOffset.x
    }
    /**
     *@desc   垂直
     *@author 张羽
     *@date   2019-08-28 17:15
     *@param
     */
    onVLayout(event,item){
        let {y,height} = event.nativeEvent.layout;
        console.log('.....onLayout',event.nativeEvent.layout,item)
        if(!item.y){
            item.y=y
            item.height=height
        }
    }
    /**
     *@desc   垂直滚动
     *@author 张羽
     *@date   2019-08-28 17:28
     *@param
     */
    VonScroll(event){
        this.Voffset=event.nativeEvent.contentOffset.y
    }
    /**
     *@desc   点击分类
     *@author 张羽
     *@date   2019-08-28 17:18
     *@param
     */
    onPressType(item){
        if(this.state.slectType==item.name){
            return
        }
        this.setState({
            slectType:item.name
        })
        //判断垂直
        let Hx=item.x+item.width
        if((Hx-this.Hoffset)>width){
            let offset=Hx-width+50
            this.refs.HScrollView.scrollTo({x: offset, y: 0, animated: true})
        }
        this.refs.VScrollView.scrollTo({x: 0, y: item.y, animated: true})
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
                        placeholder={'搜索您需要的'}
                        value={this.state.searchText}
                        placeholderTextColor={colors.CAED}
                        onChangeText={(text)=>this.setState({searchText:text})}
                        onEndEditing={()=>{
                            if(this.state.searchText) {
                                AsyncStorage.getItem('historySearch', (error, result) => {
                                    if (!error) {
                                        if (result != null) {
                                            let historySearch = JSON.parse(result)
                                            if (historySearch.length >= 10) {
                                                historySearch.pop()
                                            }
                                            for (let i = 0; i < historySearch.length; i++) {
                                                let str = historySearch[i]
                                                if (this.state.searchText === str) {
                                                    //避免重复
                                                    historySearch.splice(i, 1)
                                                    break;
                                                }
                                            }
                                            historySearch.splice(0, 0, this.state.searchText)
                                            let history = JSON.stringify(historySearch);
                                            AsyncStorage.setItem('historySearch', history);
                                            this.props.push('HomeTypeListPage',{type:'',title:'',shaixuanArray:this.state.typeArray,keyword:this.state.searchText })
                                        } else {
                                            let historySearch = []
                                            historySearch.push(this.state.searchText)
                                            let history = JSON.stringify(historySearch);
                                            AsyncStorage.setItem('historySearch', history);
                                            this.props.push('HomeTypeListPage',{type:'',title:'',shaixuanArray:this.state.typeArray,keyword:this.state.searchText })
                                        }
                                    }
                                })
                            }
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

    render(){
        return(
            <View style={styles.container}>
                {this.renderTopView()}
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:25,alignItems:'center',paddingLeft:12}}>
                    <ASText style={{fontSize:14,color:colors.CHATTEXT,fontWeight:'bold'}} text={'最近使用'}></ASText>
                    <ASTouchableOpacity style={{paddingRight:27}} onPress={()=>{
                        AsyncStorage.removeItem('historySearch')
                        this.setState({historyData:[]})}
                    }>
                        <Image source={Images.Del_search} style={{width:15,height:16}}/>
                    </ASTouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:25,flexWrap:'wrap',paddingHorizontal:12}}>
                    {this.state.historyData.map((item,i)=>{
                        return(
                            <View style={{paddingRight:10,paddingBottom:10}} key={i}>
                                <ASTouchableOpacity onPress={()=>{
                                    this.props.push('HomeTypeListPage',{type:'',shaixuanArray:this.state.typeArray,keyword:item})
                                }}
                                    style={{paddingHorizontal:15,paddingVertical:10,justifyContent:'center',alignItems:'center',backgroundColor:colors.SEARCH_back,borderRadius:3}}>
                                    <ASText text={item}></ASText>
                                </ASTouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <View style={{height:10,backgroundColor:colors.BackPage}}></View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={'HScrollView'} onScroll={e=>this.HonScroll(e)} scrollEventThrottle={14}>
                    <View style={{flexDirection:'row'}}>
                        {this.state.typeArray.map((item,i)=>{
                            if(item.name=='全部分类'||item.name=='积分商城'){
                                return null
                            }
                            return(
                                <ASTouchableOpacity onPress={()=>{this.onPressType(item)}}
                                                    style={[{paddingRight:38,paddingLeft:12,paddingTop: 20,paddingBottom:12,backgroundColor:'white'}]} key={i+'type'} onLayout={e=>this.onLayout(e,item)}>
                                    <View style={[{paddingBottom: 10,borderBottomWidth: 1,borderBottomColor:'white'},this.state.slectType==item.name?{borderBottomColor:'#e3782c'}:{}]}>
                                        <ASText style={{color:'#3d3d3d',fontSize:16}}>{item.name}</ASText>
                                    </View>
                                </ASTouchableOpacity>

                            )
                        })}
                    </View>
                </ScrollView>
                <ScrollView showsVerticalScrollIndicator={false} ref={'VScrollView'} onScroll={e=>this.VonScroll(e)} scrollEventThrottle={14}>
                    <View style={{flex:1}}>
                        {this.state.typeArray.map((item,i)=>{
                            let child=item.child?item.child:[]
                            if(item.name=='全部分类'||item.name=='积分商城'){
                                return null
                            }
                            return(
                                <View style={{backgroundColor:'white'}} onLayout={e=>this.onVLayout(e,item)} key={item.id}>
                                    {i==0?null:<View style={{paddingTop:8,paddingBottom:18,paddingHorizontal:12}}>
                                        <ASText style={{color:'#3d3d3d',fontSize:16}}>{item.name}</ASText>
                                    </View>}
                                    <View style={{flexDirection:'row',flexWrap: 'wrap',paddingHorizontal:12,paddingBottom:10}}>
                                        {item.child.map((obj,index)=>{
                                            let yushu=(index+1)%4==0?true:false
                                            return(
                                                <ASTouchableOpacity style={[{paddingLeft:18,paddingBottom:12},yushu?{paddingLeft:0}:{}]} key={index} onPress={()=>{
                                                    this.props.push('HomeTypeListPage',{type:obj.id+'',title:obj.name,shaixuanArray:this.state.typeArray})
                                                }}>
                                                    <View style={{width:(width-78)/4,height:31,justifyContent:'center',alignItems:'center',borderRadius:2,backgroundColor:'#fbfbfb'}}>
                                                        <ASText text={obj.name} style={{fontSize:14,color:'#3d3d3d'}}/>
                                                    </View>
                                                </ASTouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>

                            )
                        })}
                    </View>
                </ScrollView>

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
