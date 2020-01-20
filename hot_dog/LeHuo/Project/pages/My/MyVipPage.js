import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ImageBackground
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import { width }   from '../../../Resourse/CommonUIStyle'
import Url from "../../../Resourse/url";
import Toast from "@remobile/react-native-toast/index";
import ASText from '../../components/ASText'
import BImage from "../../components/BImage";
@containers()
export default class MyVipPage extends Component{
    static propTypes = {
        userInfo:React.PropTypes.object,
    }
    static defaultProps = {
    }
    constructor(props){
        super(props)
        this.state={
            uid:this.props.userInfo.id?this.props.userInfo.id:'',
            cover:'',
            endTime:'',
            shuoming:'',
            couponArray:[]
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'vip信息',
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
        this.props.fetchData(this, '', Url.myEquity(this.state.uid), {}, successCallback = (data) => {
            console.log('............卡片',data)
            this.setState({
                shuoming:data.info.shuoming,
                endTime:data.info.endTime,
                couponArray:data.info.couponArray,
                cover:data.info.cover

            })
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.notice)
        });
    }
    render(){
        let couponArray=Array.isArray(this.state.couponArray)?this.state.couponArray:[]
        return(
            <View style={styles.container}>
                <ImageBackground source={require('../../images/my/vipBack.png')} style={styles.backImage}/>
                <View style={{flex:1}}>
                    <View style={{paddingHorizontal:17,marginTop:80}}>
                        <BImage
                            style={{width:width-34,height:213,backgroundColor:colors.BackPage}}
                            resizeMode={'contain'}
                            source={{uri:this.state.cover}}/>
                    </View>
                    <View style={styles.discountListView}>
                        <View style={{width:5,height:16,borderRadius:3,backgroundColor:'#e6c48e'}}></View>
                        <ASText style={{fontSize:15,color:'#000000',marginLeft: 9}} text={'专属权益'}></ASText>
                    </View>
                    <View style={{marginTop:10,marginLeft:42}}>
                        <ASText style={{fontSize:12,color:colors.CAED}} text={this.state.shuoming}></ASText>
                    </View>
                    <View style={{flexDirection: 'row',flexWrap: 'wrap',marginTop:20,paddingRight: 17}}>
                        {couponArray?couponArray.map((item,i)=>{
                            return (
                                <View  key={i} style={{paddingBottom:5,paddingRight:20}}>
                                    <ASText
                                        numberOfLines={1}
                                        style={{fontSize:13,color:'#212020'}} text={item.name}>
                                    </ASText>
                                </View>
                            )
                        }):null}
                    </View>
                </View>
                <View style={{paddingBottom: 50,paddingHorizontal:16}}>
                    <ImageBackground source={require('../../images/my/endtime.png')} style={{width:width-32,height:(width-32)*122/750,justifyContent: 'center',alignItems: 'center'}}>
                        <ASText text={this.state.endTime+'到期'} style={{fontSize:24,color:'#282828',fontWeight: 'bold',backgroundColor:colors.TRANSPARENT_COLOR}}/>
                    </ImageBackground>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    discountListView:{
        marginTop:44,
        flexDirection:'row',
        alignItems:'center',
        marginLeft: 28
    },
    backImage:{
        width:width,
        height:width*540/750,
        position:'absolute',
        left:0,
        top:0
    }
});
