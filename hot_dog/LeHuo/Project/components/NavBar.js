import React, {Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    StatusBar,
    Platform,
    Text,
} from 'react-native';
import ASText from '../../Resourse/ASText';
import colors from '../../Resourse/Colors';
const BACK_ITEM_IMAGE = require ('../images/common/top_arrow.png');
// import  DeviceInfo from 'react-native-device-info';
// const device = DeviceInfo.getModel();
// const statusBarHeight = (device === 'iPhone X' || device === 'iPhone XR' || device === 'iPhone XS' || device === 'iPhone XS Max' ? 44 : 20)
const statusBarHeight=0
class NavBar extends Component {
    static propTypes = {
        // fromPage:React.PropTypes.object,    //所在页面
        navStyle: View.propTypes.style,       //自定义导航样式
        hiddenNav: React.PropTypes.bool,       //是否隐藏Nav

        //返回按钮设置
        backBtnTitle: React.PropTypes.string,//返回按钮的标题
        backFunction: React.PropTypes.func, // 返回按钮的方法,只有在特殊要求的情况下才传入
        hiddenBackBtn:React.PropTypes.bool, // 是否隐藏返回按钮
        leftView:React.PropTypes.any,       //左边的View


        title: React.PropTypes.string,      //标题
        titleStyle: Text.propTypes.style,   //自定义标题样式
        rightBtnItems:React.PropTypes.array,//右边的按钮 格式[{title:'',imageSource:'',func:func}]
        rightView:React.PropTypes.any       //右边的View
    };
    static defaultProps = {
        hiddenNav: false,
        navStyle:{},
        titleStyle:{},
        hiddenBackBtn: false,
        title: '',
        rightBtnItems: [],
    };

    creatBackItem () {
        if (this.props.leftView){
            return this.props.leftView
        }
        else if(!this.props.hiddenBackBtn){
            if(this.props.backBtnTitle){
                return (
                    <TouchableOpacity
                        onPress = {this.backBtnPress.bind(this)}
                        style = {[styles.backBtnStyle]}
                    >
                        <ASText style = {[styles.backItemTextStyle]} text={this.props.backBtnTitle}/>
                    </TouchableOpacity>
                )
            }else{
                return (
                    <TouchableOpacity
                        onPress = {this.backBtnPress.bind(this)}
                        style = {[styles.backBtnStyle]}
                    >
                        <Image
                            style = {styles.backImage}
                            source = {BACK_ITEM_IMAGE}
                        />
                    </TouchableOpacity>
                )
            }

        }

    }
    rightItemAction (item) {
        if (item&&item.func) {
            item.func();
        }
    }
    creatRightItem () {
        if(this.props.rightView){
            return (
                <View style={styles.rightView}>
                    {this.props.rightView}
                </View>
            )
        }else{
            let item= this.props.rightBtnItems.map(function(item,i){
                if(item.imageSource){
                    return ( <TouchableOpacity
                        onPress = {this.rightItemAction.bind(this,item)}
                        style = {[styles.rightBtn]}
                        key={i}
                    >
                        <Image
                            style = {styles.rightImg}
                            source = {item.imageSource}
                        />
                    </TouchableOpacity>)

                }else{
                    return ( <TouchableOpacity
                        onPress = {this.rightItemAction.bind(this,item)}
                        style = {[styles.rightBtn]}
                        key={i}
                    >
                        <ASText style = {styles.rightText} text={item.title}/>
                    </TouchableOpacity>)
                }

            }.bind(this));
            return (
                <View style={styles.rightView}>
                    {item}
                </View>
            )
        }


    }
    backBtnPress(){
        console.log('backBtnPress');
        if(this.props.backFunction){
            this.props.backFunction();
        }
        else{
            if(this.props.fromPage&&this.props.fromPage.back){
                this.props.fromPage.back();
            }
        }
    }
    render() {
        return (
            <View style = {[styles.mainStyle,this.props.navStyle]}>
                <StatusBar
                    barStyle="default"
                />
                <View style = {[styles.container]}>
                    {this.creatBackItem()}
                    <View overflow='hidden' style = {[styles.titleStyle]}>
                        <ASText
                            text = {this.props.title}
                            numberOfLines = {1}
                            style = {[styles.titleTextStyle,this.props.titleStyle]}/>
                    </View>
                    {this.creatRightItem()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainStyle:{
        flexDirection:'column',
        backgroundColor:colors.WHITE,
        paddingTop:Platform.OS === 'ios'?statusBarHeight:0,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.BackPage,
        zIndex:1
    },
    container: {
        height:44,
        flexDirection:'row',
        width:Dimensions.get('window').width,
    },
    backBtnStyle : {
        justifyContent:'center',
        alignItems:'center',
        height:44,
        width:44,
    },
    backItemTextStyle : {
        color:colors.WHITE,
        fontSize:14,
    },
    titleStyle : {
        position:'absolute',
        height:44,
        right:60,
        left:60,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    titleTextStyle : {
        color:colors.CHATTEXT,
        fontSize:18,
        textAlign:'center',
        flex:1,
        fontWeight:'bold',
    },
    backImage : {
        height:15,
        width:11,
        resizeMode:'contain',
    },
    rightView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        paddingRight:5,
    },
    rightBtn:{
        height:44,
        paddingRight:8,
        alignItems:'center',
        justifyContent:'center',
    },
    rightImg:{
        height:18,
        width:18,
        resizeMode:'contain',
    },
    rightText:{
        color:colors.SHOW_TEXT_COLOR,
        fontSize:14,
    },
});

module.exports = NavBar;
