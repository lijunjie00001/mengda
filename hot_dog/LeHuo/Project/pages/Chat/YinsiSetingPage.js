import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput, Alert,
} from 'react-native';
import containers from '../../containers/containers'
import colors from "../../../Resourse/Colors";
import Images from '../../../Resourse/Images'
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
import {width} from "../../../Resourse/CommonUIStyle";
import ASText from '../../components/ASText'
@containers()
export default class YinsiSetingPage extends Component{
    static propTypes = {
       isSlect:React.PropTypes.number,
        successBack:React.PropTypes.func,
    }
    static defaultProps = {
        isSlect:0
    }
    constructor(props){
        super(props)
        this.state={
            isSlect:this.props.isSlect
        }
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'昵称',
            rightView:<ASTouchableOpacity style={{justifyContent:'center',width:44,height:44,alignItems:'center'}} onPress={()=>{this.onPressSave()}}>
                <ASText style={[styles.title,{color:colors.CHATTEXT}]} text={'保存'}></ASText>
            </ASTouchableOpacity>
        });
    }
    /**
     *@desc   保存
     *@author 张羽
     *@date   2018/12/20 下午5:59
     *@param
     */
    onPressSave(){
        if(this.props.successBack){
            this.props.successBack(this.state.isSlect)
        }
        this.props.back()
    }
    render(){
        return(
            <View style={styles.container}>
                <ASTouchableOpacity style={styles.cell} onPress={()=>{this.setState({isSlect:0})}}>
                    {this.state.isSlect==0? <Image source={Images.YIN_DUI} style={{width:17,height:15,marginLeft:22}}/>:null}
                    <ASText style={[{fontSize:16,color:colors.CHATTEXT},this.state.isSlect==0?{marginLeft:10}:{marginLeft:48}]} text={'公开'}>
                    <ASText style={{color:colors.TIME}} text={' (所有人可见)'}></ASText>
                    </ASText>
                </ASTouchableOpacity>
                <ASTouchableOpacity style={styles.Newcell} onPress={()=>{this.setState({isSlect:1})}}>
                    {this.state.isSlect==1? <Image source={Images.YIN_DUI} style={{width:17,height:15,marginLeft:22}}/>:null}
                    <ASText style={[{fontSize:16,color:colors.CHATTEXT},this.state.isSlect==1?{marginLeft:10}:{marginLeft:48}]} text={'私密'}>
                        <ASText style={{color:colors.TIME}} text={' (仅自己可见)'}></ASText>
                    </ASText>
                </ASTouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackPage,
        paddingTop: 10
    },
    cell:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        height:46,
        borderBottomWidth:colors.width_1_PixelRatio,
        borderBottomColor:colors.LINE
    },
    Newcell:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        height:46,
    }
})