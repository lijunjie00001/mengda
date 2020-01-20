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
import MyOrderList      from './MyOrderList'
import ASText from '../../components/ASText'
@containers()
export default class MyOrderPage extends Component{
    static propTypes = {
        tabIndex:React.PropTypes.number,
        uid:React.PropTypes.string,
    };
    constructor(props){
        super(props)
        this.state={
            tabIndex:props.tabIndex
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'订单',
        });
        this.timeout=setTimeout(() => this.scrollableTabView.goToPage(this.props.tabIndex), 0);
    }
    renderTabber(props){
        let array=[
            {
                title:'全部订单',
            }, {
                title:'待处理',
            }, {
                title:'已取消',
            }, {
                title:'已完成',
            }
        ]
        return(
            <View style={{flexDirection:'row',paddingHorizontal:26,height:50,backgroundColor:colors.WHITE,justifyContent:'space-between',alignItems:'center',borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio}}>
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
                tabLabel = '全部订单';
                status='0'
                break;
            case 1:
                tabLabel = '待处理';
                status='1,2,3';
                break;
            case 2:
                tabLabel = '已取消';
                status='4';
                break;
            case 3:
                tabLabel = '已完成';
                status='5';
                break;
            default:
                break;
        }
        return (
            <View style={{flex:1}} tabLabel={tabLabel}>
                <MyOrderList {...this.props} uid={this.props.uid} status={status} pageId={'order'+type} />
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
                    ref={(ref) => { this.scrollableTabView = ref; }}
                >
                    {this.renderListViewWithType(0)}
                    {this.renderListViewWithType(1)}
                    {this.renderListViewWithType(2)}
                    {this.renderListViewWithType(3)}
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
