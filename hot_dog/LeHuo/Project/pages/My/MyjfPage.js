import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image, DeviceEventEmitter, AsyncStorage,
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyjfListPage      from './MyjfListPage'
import ASText from '../../components/ASText'
@containers()
export default class MyjfPage extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object,
    }
    static defaultProps = {
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
            title:'积分',
        });
    }
    renderTabber(props){
        let array=[
            {
                title:'总明细',
            }, {
                title:'获得积分明细',
            }, {
                title:'积分换购明细',
            }
        ]
        return(
            <View style={{flexDirection:'row',paddingHorizontal:26,height:50,backgroundColor:colors.WHITE,justifyContent:'space-between',alignItems:'center',borderBottomWidth:colors.width_1_PixelRatio,borderBottomColor:colors.LINE}}>
                {array.map((item,i)=>{
                    return(
                        <ASTouchableOpacity key={i} style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{props.goToPage(i)}}>
                            <ASText  style={[{fontSize:16,color:colors.CHATTEXT,fontWeight:'bold'},props.activeTab==i?{color:colors.CHATBUDDLE}:{fontWeight:'normal'}]} text={item.title}></ASText>
                           <View  style={[{height:2,width:25,backgroundColor:colors.CHATBUDDLE,marginTop:5},props.activeTab!==i?{backgroundColor:colors.WHITE}:null]}></View>
                        </ASTouchableOpacity>
                    )
                })}
            </View>
        )
    }
    /**
     *@desc   渲染分类标签的每个页面
     *@author 张羽
     *@date   2018/9/10 下午8:47
     *@param
     */
    renderListViewWithType(type){
        let tabLabel='';
        let status='';
        switch (type){
            case 0:
                tabLabel = '总明细';
                status='0'
                break;
            case 1:
                tabLabel = '获得积分明细';
                status='1';
                break;
            case 2:
                tabLabel = '积分换购明细';
                status='2';
                break;
            default:
                break;
        }
        return (
            <View style={{flex:1}} tabLabel={tabLabel}>
                <MyjfListPage {...this.props} uid={this.state.uid} status={status} pageId={'JfList'+type} />
            </View>
        )
    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollableTabView
                    initialPage={this.state.tabIndex}
                    style={{flex:1}}
                    contentProps={{keyboardShouldPersistTaps:'always'}}
                    renderTabBar={(props) =>this.renderTabber(props)}
                    ref={'ScrollableTabView'}
                >
                    {this.renderListViewWithType(0)}
                    {this.renderListViewWithType(1)}
                    {this.renderListViewWithType(2)}
                </ScrollableTabView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    }
});