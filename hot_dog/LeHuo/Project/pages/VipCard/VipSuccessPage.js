import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions, Platform,Image,Text,ScrollView
} from 'react-native';
import containers from '../../containers/containers'
import Images from "../../../Resourse/Images";
import colors from "../../../Resourse/Colors";
import ASText from '../../components/ASText'
@containers()
export default class VipSuccessPage extends Component {
    static propTypes = {
        item:React.PropTypes.object,
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);

    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'购买成功',
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1}}>
                        <View style={{paddingVertical:55,alignItems:'center'}}>
                            <Image source={Images.Right_yellow} style={{width:70,height:70}}/>
                            <ASText style={{fontSize:18,color:colors.CHATTEXT,marginTop:25}} text={'恭喜您成为'+this.props.item.vipName}></ASText>
                        </View>
                        <View style={[styles.discountListView]}>
                            <View style={{paddingBottom:15}}>
                                <ASText style={{fontSize:16,color:colors.CHATTEXT,marginLeft:22}} text={'会员权益：'}></ASText>
                            </View>
                            {this.props.item.couponArray?this.props.item.couponArray.map((item,i)=>{
                                return (
                                    <View  key={i} style={{paddingBottom:5,paddingHorizontal:22}}>
                                        <ASText
                                            numberOfLines={1}
                                            style={{fontSize:11,color:colors.CHATTEXT}} text={(i+1)+'、'+item.num+'张'+item.name}>
                                        </ASText>
                                    </View>
                                )
                            }):null}
                            <View style={{marginTop:15,paddingHorizontal:22}}>
                                <ASText style={{fontSize:11,color:colors.CAED}} text={this.props.item.shuoming}></ASText>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    discountListView:{
        width:'100%',
        marginTop:15,
        backgroundColor:'white',
    },
})
