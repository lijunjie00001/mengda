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
export default class VipDetailsPaySuccessPage extends Component {
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
                            <ASText style={{fontSize:18,color:colors.CHATTEXT,marginTop:25}} text={'恭喜您购买成功'}></ASText>
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
