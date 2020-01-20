import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert, AsyncStorage, Platform,  FlatList,Animated, Easing,
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import { isPhoneX,width }   from '../../../Resourse/CommonUIStyle'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CollectionListPage from './CollectionListPage'
import ASText from '../../components/ASText'
@containers()
export default class MyCollection extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object,
        isUp:React.PropTypes.bool,
    }
    static defaultProps = {
        isUp:false
    }
    constructor(props){
        super(props)
        this.state={
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
            tabIndex:0
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'收藏夹',
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
                            }
                        }}
                        returnKeyType = {'search'}
                    />
                </View>
            </View>
        )
    }
    /**
     *@desc   标签
     *@author 张羽
     *@date   2018/12/17 下午2:05
     *@param
     */
    renderTabber(props){
        let array=[
            {
                title:'酒店',
            }, {
                title:'美食',
            }, {
                title:'美容/SPA',
            },{
                title:'夜色',
            },{
                title:'会员专享',
            }
        ]
        return(
            <View style={{flexDirection:'row',paddingHorizontal:22,height:45,backgroundColor:colors.WHITE,justifyContent:'space-between',alignItems:'center'}}>
                {array.map((item,i)=>{
                    return(
                        <ASTouchableOpacity key={i} style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{props.goToPage(i)}}>
                            <ASText  style={[{fontSize:16,color:colors.CHATTEXT,fontWeight:'bold'},props.activeTab==i?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={item.title}></ASText>
                            <View  style={[{height:2,width:14,backgroundColor:colors.CHATBUDDLE,marginTop:5},props.activeTab!==i?{backgroundColor:colors.WHITE}:null]}></View>
                        </ASTouchableOpacity>
                    )
                })}
            </View>
        )
    }
    /**
     *@desc   收藏商家
     *@author 张羽
     *@date   2018/12/17 下午2:02
     *@param
     */
    renderListViewWithType(type){
        let tabLabel='';
        let status='';
        switch (type){
            case 0:
                tabLabel = '酒店';
                status='1'
                break;
            case 1:
                tabLabel = '美食';
                status='2';
                break;
            case 2:
                tabLabel = '美容/SPA';
                status='3';
                break;
            case 3:
                tabLabel = '夜色';
                status='4';
                break;
            case 4:
                tabLabel = '会员专享';
                status='6';
                break;
            default:
                break;
        }
        return (
            <View style={{flex:1}} tabLabel={tabLabel}>
                <CollectionListPage {...this.props}  status={status} pageId={'Collection'+type} userInfo={this.props.userInfo}/>
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                {/*/!*{this.renderTopView()}*!/*/}
                {/*<ScrollableTabView*/}
                {/*    initialPage={this.state.tabIndex}*/}
                {/*    style={{flex:1}}*/}
                {/*    contentProps={{keyboardShouldPersistTaps:'always'}}*/}
                {/*    renderTabBar={(props) =>this.renderTabber(props)}*/}
                {/*    ref={'ScrollableTabView'}*/}
                {/*>*/}
                {/*    {this.renderListViewWithType(0)}*/}
                {/*    {this.renderListViewWithType(1)}*/}
                {/*    {this.renderListViewWithType(2)}*/}
                {/*    {this.renderListViewWithType(3)}*/}
                {/*    {this.props.isUp?this.renderListViewWithType(4):null}*/}
                {/*</ScrollableTabView>*/}
                <CollectionListPage {...this.props}  status={status} pageId={'Collection'+type} userInfo={this.props.userInfo}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
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
        height:50,
        paddingHorizontal:12,
        alignItems:'center',
        paddingTop:10,
        zIndex:1,
        backgroundColor:'white'
    },
    searchInputView:{
        height:40,
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
