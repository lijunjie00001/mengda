import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    Image
} from 'react-native';

const { height, width } = Dimensions.get('window');
import EZSwiper from 'react-native-ezswiper';
import Images from '../../../Resourse/Images'
// const images = [require(`./resource/0.jpg`),require(`./resource/1.jpg`),require(`./resource/2.jpg`),require(`./resource/3.jpg`),require(`./resource/4.jpg`),require(`./resource/5.jpg`),require(`./resource/6.jpg`),require(`./resource/7.jpg`),require(`./resource/8.jpg`)]
import containers from '../../containers/containers';
import Toast from "@remobile/react-native-toast/index";
import Url from "../../../Resourse/url";
@containers()
export default class App extends Component<{}> {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 0,
            vipData:[]
        };
    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:'会员卡',
            hiddenNav:true,
        });
        this.props.fetchData(this, '', Url.vipList(), {}, successCallback = (data) => {
            console.log('............卡片',data)
            this.setState({vipData:data.info})
            return;
        }, failure = (data) => {
            Toast.showShortCenter(data.msg)
        });
    }
    /**
     *@desc   获取会员卡列表
     *@author 张羽
     *@date   2018/12/16 下午4:00
     *@param
     */
    getData(){

    }
    renderTitle(title){
        return <Text style={{backgroundColor:'green'}}>{title}</Text>
    }

    renderRow(obj, index) {
        return (
            <View style={[styles.cell,{backgroundColor:index % 2 === 0 ? 'red' : 'yellow'}]}>
                <Text>{obj}</Text>
            </View>
        )
    }

    renderImageRow(item, index) {
        return (
            <View style={[styles.cell]}>
                <Image
                    style={{position:'absolute',top:0,right:0,bottom:70,left:0,width: undefined, height: undefined}}
                    resizeMode={'contain'}
                    source={item.vipName==='黄铜会员'?Images.Vip_black:item.vipName==='白银会员'?Images.Vip_whit:Images.Vip_gold}/>
            </View>
        )
    }


    onPressRow(obj, index) {
        console.log('onPressRow=>obj:'+ obj + ' ,index:' + index);
        alert('onPressRow=>obj:'+ obj + ' ,index:' + index);
    }

    onWillChange(obj, index) {
        console.log('onWillChange=>obj:'+ obj + ' ,index:' + index);
        // alert('onWillChange=>obj:'+ obj + ' ,index:' + index);
    }

    onDidChange(obj, index) {
        console.log('onDidChange=>obj:'+ obj + ' ,index:' + index);
        // alert('onDidChange=>obj:'+ obj + ' ,index:' + index);
    }

    render() {
        return (
            <ScrollView style={[styles.container]} contentInsetAdjustmentBehavior="automatic">
                <EZSwiper style={{width: width,height: 150,marginTop:32}}
                          dataSource={this.state.vipData}
                          width={ width }
                          height={ 150 }
                          renderRow={this.renderImageRow}
                          loop={false}
                          index={1}
                          ratio={115/150}
                          cardParams={{cardSide:255, cardSmallSide:115,cardSpace:1}}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    swiper: {
        backgroundColor: 'white',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageControl: {
        position: 'absolute',
        bottom: 4,
        right: 10,
    },
});