import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,

} from 'react-native';
import containers from '../../containers/containers'
import ASText from '../../components/ASText'
import colors from '../../../Resourse/Colors'
@containers()
export default class YudingSuccessPage extends Component{
    componentDidMount() {
        this.props.setContainer(this,{
            title:'预定状态',
        });
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:colors.BackPage}}>
                <View style={{flex:1,marginTop: 1,backgroundColor:'white',justifyContent: 'center',alignItems:'center'}}>
                    <Image source={require('../../images/my/collectionSlect.png')} style={{width:49,height:49}}/>
                    <ASText text={'订单提交成功'} style={{marginTop:17,color:'#3d3d3d',fontSize:16}}/>
                    <ASText text={'订单状态将以短信发送至用户手机\n' +
                    '请注意查收'} style={{marginTop:18,color:'#dcc490',fontSize:12}}/>
                </View>
            </View>
        )
    }

}
