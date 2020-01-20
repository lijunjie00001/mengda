import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, Image, ActivityIndicator, Alert
} from 'react-native';
import colors from "../../../Resourse/Colors";
import Images from "../../../Resourse/Images";
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import JMessage from 'jmessage-react-plugin';
import RNFS  from 'react-native-fs'
import Config from "../../../Resourse/Config";
import ASText from '../../components/ASText'
export default class ChatListCell extends Component{
    static propTypes = {
        time:React.PropTypes.string,
        isShowPoint:React.PropTypes.bool,
        name:React.PropTypes.string,
        title:React.PropTypes.string,
        rowData:React.PropTypes.object,
    }
    static defaultProps = {
        rowData:{}
    }
    constructor(props){
        super(props)
        this.state={
            avatarThumbPath:'',
        }
    }
    /**
     *@desc   判断是否刷新
     *@author 张羽
     *@date   2019/6/27 下午2:49
     *@param
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.time!==this.props.time
            ||nextProps.isShowPoint!==this.props.isShowPoint
            ||nextProps.name!==this.props.name
            ||nextProps.title!==this.props.title
            ||nextProps.rowData.target.avatarThumbPath!==this.props.rowData.target.avatarThumbPath||
            nextState.avatarThumbPath!=this.state.avatarThumbPath
        ){
            return true;
        }
        else {
            return false;
        }
    }
    componentWillReceiveProps(nextProps) {
        if(!nextProps.rowData.target.avatarThumbPath||nextProps.rowData.target.avatarThumbPath!=this.props.rowData.target.avatarThumbPath){
            this.downIcon(nextProps.rowData.target.avatarThumbPath)
        }
    }
    downIcon(avatarThumbPath){
        if(!avatarThumbPath){
            JMessage.downloadThumbUserAvatar({ username:this.props.rowData.target.username, appKey:Config.JImAppkey  },
                (userInfo) => {
                    // do something.
                    console.log('.....xiazai',userInfo)
                    this.getIcon(userInfo.filePath)
                }, (error) => {
                    console.log('.........错误',error)
                })
        }else{
            this.getIcon(avatarThumbPath)
        }
    }
    componentWillMount() {
        this.downIcon(this.props.rowData.target.avatarThumbPath)
    }
    getIcon(avatarThumbPath){
        //判断
        if(avatarThumbPath){
            //判断后缀
            if(!avatarThumbPath.endsWith('.png')&&!avatarThumbPath.endsWith('.jpg')){
                RNFS.readFile('file://'+avatarThumbPath,'base64').then((result)=>{
                    let baseImg=`data:image/png;base64,${result}`;
                    console.log('.....阅读')
                    this.setState({
                        avatarThumbPath:baseImg
                    })
                }).catch((error)=>{
                    console.log('........error',error)
                    this.readFail()
                })
            }else{
                RNFS.exists('file://'+avatarThumbPath).then((result)=>{
                    console.log('.......result',result)
                    if(!result){
                        this.readFail()
                    }else{
                        if(this.props.rowData.target.avatarThumbPath!=('file://'+avatarThumbPath)){
                            this.setState({
                                avatarThumbPath:'file://'+avatarThumbPath
                            })
                        }
                    }
                }).catch((error)=>{
                    console.log('........error',error)

                })
            }
        }else{

        }
    }
    /**
     *@desc   阅读失败
     *@author 张羽
     *@date   2019/6/30 下午8:10
     *@param
     */
    readFail(){
        JMessage.downloadThumbUserAvatar({ username:this.props.rowData.target.username, appKey:Config.JImAppkey  },
            (userInfo) => {
                // do something.
                console.log('.....xiazai',userInfo)
                this.getIcon(userInfo.filePath)
            }, (error) => {
                console.log('.........错误',error)
            })
    }
    render(){
        return(
            <View style={{paddingVertical:8,borderBottomColor:colors.LINE,borderBottomWidth:colors.width_1_PixelRatio,flexDirection:'row',alignItems:'center'}}>
                <View >
                    {this.props.rowData.target.avatarThumbPath||this.state.avatarThumbPath?<Image source={{uri:this.state.avatarThumbPath?this.state.avatarThumbPath:('file://'+this.props.rowData.target.avatarThumbPath)}} style={{width:45,height:45,borderRadius:22.5,backgroundColor:colors.BACK_COLOR}}/>:
                        <Image source={Images.ICON} style={{width:45,height:45,borderRadius:22.5,backgroundColor:colors.BACK_COLOR}}/>
                    }
                    {this.props.isShowPoint? <View  style={styles.pointView}></View>:null}
                </View>
                <View style={{flex:1,justifyContent:'center',marginLeft:9}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <ASText style={{fontSize:17,color:colors.CHATTEXT}} text={this.props.name}/>
                        <ASText style={{fontSize:12,color:colors.TIME}} text={this.props.time}/>
                    </View>
                    <ASText style={{fontSize:14,color:colors.TIME,marginTop:9}} numberOfLines={1} text={this.props.title}/>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    topView:{
        height:44,
        paddingHorizontal:12,
    },
    topCellView:{
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:colors.LINE,
        paddingRight:14,
        flexDirection:'row',
        height:44,
        alignItems:'center'
    },
    pointView:{
        width:9,
        height:9,
        borderRadius:4.5,
        backgroundColor:colors.POINT,
        position:'absolute',
        right:0,
        top:0
    }
});