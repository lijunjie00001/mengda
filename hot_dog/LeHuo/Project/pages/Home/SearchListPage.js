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
export default class SearchListPage extends Component{
    static propTypes = {
        searchText:React.PropTypes.string
    }
    constructor(props){
        super(props)
        this.getData=this.getData.bind(this)
        this.state={
            searchText:this.props.searchText,
            data:[]
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'搜索',
        });
        this.getData()
    }
    getData(){
        this.props.fetchData(this, '', Url.search(this.state.searchText), {}, successCallback = (data) => {
            console.log('............搜索',data)
            this.setState({
                data:data.info
            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    /**
     *@desc   topView
     *@author 张羽
     *@date   2018/12/17 下午4:42
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
                                        } else {
                                            let historySearch = []
                                            historySearch.push(this.state.searchText)
                                            let history = JSON.stringify(historySearch);
                                            AsyncStorage.setItem('historySearch', history);
                                        }
                                    }
                                })
                            }
                            this.getData()
                        }}
                        returnKeyType = {'search'}
                    />
                </View>
            </View>
        )
    }
    /**
     *@desc   点击cell
     *@author 张羽
     *@date   2019/4/29 上午12:52
     *@param
     */
    onPressHot(rowdata){
        AsyncStorage.getItem('userInfo', (error, result) => {
            if (!error) {
                if(result != null) {
                    let userinfo=JSON.parse(result)
                    this.props.push('HomeDetails',{userId:userinfo.id+'',businessId:rowdata.id+''})
                }else{
                    this.props.push('Login',{transition:'forVertical'})
                }
            }
        })
    }
    _keyExtractor = (item, index) => 'samecity'+index
    /**
     *@desc   cell
     *@author 张羽
     *@date   2018/12/17 下午3:55
     *@param
     */
    renderRow(rowData,index){
        return(
            <ASTouchableOpacity style={{width:'100%',backgroundColor:colors.WHITE,paddingHorizontal:12}} onPress={()=>{this.onPressHot(rowData)}}>
                <View style={styles.hotListInnerView}>
                    <View style={styles.HotListLeftView}>
                        <BImage source={{uri:rowData.logo?rowData.logo:''}} style={{width:140,height:100,backgroundColor:colors.BACK_COLOR,borderRadius:6}}/>
                        <View style={styles.HotListRightView}>
                            <ASText style={{fontSize:17,fontWeight:'bold',color:colors.CHATTEXT}} text={rowData.name}></ASText>
                            <ASText numberOfLines={1} style={{fontSize:14,color:colors.TIME,marginTop:12}} text={rowData.slogan}></ASText>
                        </View>
                    </View>
                </View>
            </ASTouchableOpacity>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                {this.renderTopView()}
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
    topView:{
        flexDirection:'row',
        height:50,
        paddingHorizontal:12,
        alignItems:'center',
        paddingTop:10,
        zIndex:1,
        backgroundColor:'white'
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
    searchInput:{
        padding:0,
        flex:1,
        fontSize:15,
        color:colors.CHATTEXT,
        marginLeft:10
    },

})