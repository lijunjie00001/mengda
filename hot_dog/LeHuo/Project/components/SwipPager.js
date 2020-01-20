/**
 * author：chenbing
 * describe：自定义轮播图
 * time：2017-11-8
 */
import React, { Component } from 'react'
import {
    View,
    Image,
    Dimensions,
    TouchableOpacity, StyleSheet
} from 'react-native'
import Swiper from 'react-native-swiper'
const { width } = Dimensions.get('window');
export default class SwipPager extends Component {
    static propTypes = {
        bannerArray:React.PropTypes.array,
        bannerClick:React.PropTypes.func,
    };
    static defaultProps = {
    };
    constructor(props){
        super(props);
        this.clickImage=this.clickImage.bind(this);
        this.renderBanner=this.renderBanner.bind(this)
    }
    clickImage(item){
        this.props.bannerClick(item)
    }
    renderBanner(){
        let swiper= this.props.bannerArray.map((item,i)=>{
            if(item){
                let img = item.picUrl;
                return (
                    <TouchableOpacity key = {i} onPress={()=>{this.clickImage(item)}} style={styles.imgView}>
                        <Image
                            style={styles.image}
                            source={{uri:img}}
                        />
                    </TouchableOpacity>

                )
            }
        });
        return  swiper
    }
    render () {
        return (
            <View style={{width:width,height:180}}>
                <Swiper
                        key={this.props.bannerArray.length}
                        height={180}
                        dot={<View style={{backgroundColor: 'white', width: 8, height: 8, borderRadius: 4, marginLeft: 5, marginRight: 5}} />}
                        activeDot={<View style={{backgroundColor: 'blue', width: 8, height: 8, borderRadius: 4, marginLeft: 5, marginRight: 5}} />}
                        paginationStyle={{
                            bottom:10,
                        }}
                        loop={true}
                        autoplay={true}
                >
                    {this.renderBanner()}
                </Swiper>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width:width,
        height:180,
    },
    imgView:{
        width: width,
        height: 180,
    },
    image: {
        width: width,
        height: 180,
    },
    Swiper:{
        width:width,
        height:180
    }

});