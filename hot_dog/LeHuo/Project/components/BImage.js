import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator,Modal,ScrollView,ImageBackground,Platform,CameraRoll,PermissionsAndroid
} from 'react-native';
import FastImage from 'react-native-fast-image'
import ASTouchableOpacity from './ASTouchableOpacity'
import Images from '../../Resourse/Images'
import Toast from "@remobile/react-native-toast/index";
import {Geolocation} from "react-native-amap-geolocation/lib/js";
import  DeviceInfo from 'react-native-device-info';
export default class BImage extends Component {
    constructor(props: any) {
        super(props);
        this.state={
            isLoaded:false,
            width:0,
            height:0,
            iserror:false,
            isShowMore:false,
            MoreHeight:Dimensions.get('window').height,
            MoreWidth:Dimensions.get('window').width,
            source:this.getSource(this.props.source),
            isShowResize:this.props.isResize?false:true,//是否要重置大小
            pubuliu:false

        }
        this.onPressHigh=this.onPressHigh.bind(this)
    }
    static propTypes = {
        ...Image.propTypes,
        imageWidth:React.PropTypes.number, //图片宽度,
        imageHeight:React.PropTypes.number, //图片宽度
        isShowDefaultImage:React.PropTypes.bool,  //是否需要默认图片，一般小头像不需要
        isResize: React.PropTypes.bool,           //图片加载完成后是否重置图片大小
        onImageLoadEnd:React.PropTypes.func,       //当图片load结束
        resizeMode:React.PropTypes.string,
        isMore:React.PropTypes.bool,  //点击变大
        isH5:React.PropTypes.bool,
        pubuliu:React.PropTypes.bool,  //是否瀑布流
    }
    static defaultProps = {
        ...Image.defaultProps,
        imageWidth:Dimensions.get('window').width/2,
        imageHeight:0,
        imageHeight:0,
        isShowDefaultImage:true,
        isResize:false,
        resizeMode:'cover',
        isMore:false,
        isH5:false,
        isShowResize:false,
        imageStyle:{}
    }
    /**
     *@desc   安卓source处理
     *@author 张羽
     *@date   2019/5/3 上午1:37
     *@param
     */
     getSource(source){
        let newSource={}
        if (typeof source === 'object' && source.uri) {
            if(source.uri.indexOf('http://')!=-1||source.uri.indexOf('https://')!=-1||source.uri.indexOf('file://')!=-1){
                return source
            }else{
                newSource={
                    uri:'file://'+source.uri
                }
                return newSource
            }
        }else{
            return source
        }
    }
    componentDidMount() {
            if (this.props.isResize) {
                if(this.props.source.uri=='file://'||this.props.source.uri=='file://undefined'||!this.props.source.uri){
                    this.setState({isShowResize:true})
                    return;
                }
                if (typeof this.state.source === 'object' && this.state.source.uri) {
                    if(this.props.isH5){
                        Image.getSize(this.props.source.uri,
                            (width, height) => {
                                let newWidth=this.props.imageWidth
                                let newHeight=newWidth*height/width
                                this.setState({width:newWidth, height:newHeight,isShowResize:true})
                            },
                            (error) => {
                                this.setState({isShowResize:true})
                            }
                        );
                    }else{
                        if(this.props.source.uri.endsWith('.gif')){
                            this.setState({isShowResize:true})
                            return;
                        }
                        Image.getSize(this.props.source.uri,
                            (width, height) => {
                                let newWidth=Math.min(this.props.imageWidth,width)
                                let newHeight=0
                                if(this.props.imageHeight>0){
                                    if(!this.props.pubuliu){
                                        newHeight=Math.min(this.props.imageHeight,height)
                                        newWidth=width*newHeight/height
                                    }else{
                                        newHeight=this.props.imageWidth*height/width
                                    }
                                }else{
                                    newHeight=newWidth*height/width
                                }
                                this.setState({width:newWidth, height:newHeight,isShowResize:true})
                            },
                            (error) => {
                                this.setState({isShowResize:true})
                            }
                        );
                    }
                }
            }

    }
    /**
     *@desc   点击变大
     *@author 张羽
     *@date   2019/3/6 下午10:59
     *@param
     */
    onPressMore(){
        console.log('.........ismore')
        if (typeof this.props.source === 'object' && this.props.source.uri) {
            this.setState({
                isShowMore:true
            })
        }else{
            Toast.showShortCenter('图片已丢失')
        }

    }

    /**
     *@desc   长按保存
     *@author 张羽
     *@date   2019-09-20 18:36
     *@param
     */
    async onPressHigh(){
        const version= await DeviceInfo.getSystemVersion()
        if (Platform.OS === 'android'&& parseFloat(version)>=6.0 ) {
            const camera =  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            if(camera){
                let source =this.getSource(this.props.source);
                if(source.uri.indexOf('file://')!=-1){
                    return new Promise((resolve, reject) => {
                        try {
                            let promise = CameraRoll.saveToCameraRoll(source.uri);
                            promise.then(function(result) {
                                resolve({statusCode:200});
                                //alert('保存成功！地址如下：\n' + result);
                                Toast.showShortCenter('图片已保存到相册')
                            }).catch(function(error) {
                                console.log('error', error);
                                // alert('保存失败！\n' + error);
                                Toast.showShortCenter('图片保存失败')
                            });
                        } catch (e) {
                            reject(new Error(e))
                        }
                    })
                }
            }else{
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            'title': '热狗需要获取您的相册权限',
                            'message': ''
                        }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        let source =this.getSource(this.props.source);
                        if(source.uri.indexOf('file://')!=-1){
                            return new Promise((resolve, reject) => {
                                try {
                                    let promise = CameraRoll.saveToCameraRoll(source.uri);
                                    promise.then(function(result) {
                                        resolve({statusCode:200});
                                        //alert('保存成功！地址如下：\n' + result);
                                        Toast.showShortCenter('图片已保存到相册')
                                    }).catch(function(error) {
                                        console.log('error', error);
                                        // alert('保存失败！\n' + error);
                                        Toast.showShortCenter('图片保存失败')
                                    });
                                } catch (e) {
                                    reject(new Error(e))
                                }
                            })
                        }

                    } else {

                    }
                }catch(err) {

                }
            }
        }else{
            let source =this.getSource(this.props.source);
            if(source.uri.indexOf('file://')!=-1){
                return new Promise((resolve, reject) => {
                    try {
                        let promise = CameraRoll.saveToCameraRoll(source.uri);
                        promise.then(function(result) {
                            resolve({statusCode:200});
                            //alert('保存成功！地址如下：\n' + result);
                            Toast.showShortCenter('图片已保存到相册')
                        }).catch(function(error) {
                            console.log('error', error);
                            // alert('保存失败！\n' + error);
                            Toast.showShortCenter('图片保存失败')
                        });
                    } catch (e) {
                        reject(new Error(e))
                    }
                })
            }
        }

    }
    render () {
        let source =this.getSource(this.props.source);
        let resizeMode=this.props.resizeMode==='cover'?FastImage.resizeMode.cover:this.props.resizeMode==='contain'?FastImage.resizeMode.contain:
            this.props.resizeMode==='center'?FastImage.resizeMode.center:FastImage.resizeMode.stretch
        let NewView=Platform.OS == 'android'?ImageBackground:FastImage
        if(this.props.isMore){
            return (
                <ASTouchableOpacity disabled={this.props.isMore?false:true} onPress={()=>{this.onPressMore()}}>
                    {this.props.isResize && !this.state.isShowResize ?
                        <View  style={this.props.style}>
                            <View style={styles.defaultView}>
                                <Image source={Images.BImagefauril} style={{width: 50, height: 50}}/>
                            </View>
                        </View>
                            :
                        <FastImage
                            source={{
                                uri: source.uri,
                                priority: FastImage.priority.normal,
                            }}
                            style={[this.props.style, this.props.isResize && this.state.width ? {
                                width: this.state.width,
                                height: this.state.height,
                                overflow:'hidden',
                            } : { overflow:'hidden'}]}
                            onLoadEnd={() => {
                                this.setState({isLoaded: true});
                                this.props.onImageLoadEnd && this.props.onImageLoadEnd(source.uri)
                            }
                            }
                            resizeMode={resizeMode}
                            onError={() => {
                                //错误
                                this.setState({
                                    isError: true
                                })
                            }}
                            onLoad={() => {
                                this.setState({isError: false, isLoaded: true})
                            }}
                        >
                            {this.props.children}
                            {(!this.state.isLoaded && !this.state.isError) ? (<View style={[styles.defaultView,{backgroundColor:'rgba(247,244,238,1)'}]}>
                                {/*<ActivityIndicator*/}
                                {/*    color={'#666'}*/}
                                {/*    style={styles.loadingMore}*/}
                                {/*    size="small"*/}
                                {/*    animating={!this.state.isLoaded}*/}
                                {/*/>*/}
                                <Image source={require('../images/login/icon.png')} style={{width: 50, height: 50}}/>
                            </View>) : null}
                            {this.state.isError && this.state.isLoaded ? <View style={styles.defaultView}>
                                <Image source={Images.BImagefauril} style={{width: 50, height: 50}}/>
                            </View> : null}
                        </FastImage>
                    }
                    <Modal visible={this.state.isShowMore}
                           onRequestClose={()=>{}}
                           transparent={true}
                           animationType={'fade'}
                    >
                            <View style={styles.moreView} >
                                {this.state.MoreHeight>Dimensions.get('window').height?
                                    <ScrollView>
                                        <TouchableWithoutFeedback onLongPress={this.onPressHigh} delayLongPress={1000}
                                                            style={{width:this.state.MoreWidth,height:this.state.MoreHeight}} onPress={()=>{this.setState({isShowMore:false})}}>
                                            <FastImage
                                                source = {{
                                                    uri:source.uri,
                                                    priority: FastImage.priority.normal,
                                                    cache:'force-cache'
                                                }}
                                                resizeMode={'contain'}
                                                style={[this.props.style,{width:this.state.MoreWidth,height:this.state.MoreHeight,overflow:'hidden'}]}
                                            />
                                        </TouchableWithoutFeedback>
                                    </ScrollView>:
                                    <TouchableWithoutFeedback  onLongPress={this.onPressHigh} delayLongPress={1000} onPress={()=>{this.setState({isShowMore:false})}}>
                                        <FastImage
                                            source = {{
                                                uri:source.uri,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={'contain'}
                                            style={[this.props.style, {width:this.state.MoreWidth,height:this.state.MoreHeight, overflow:'hidden'}]}
                                        />
                                    </TouchableWithoutFeedback>
                                }
                            </View>
                    </Modal>
                </ASTouchableOpacity>
            );
        }else{
            return(
                <View  style={[this.props.style, this.props.isResize && this.state.width ? {
                    width: this.state.width,
                    height: this.state.height
                } : {}]}>
                {this.props.isResize && !this.state.isShowResize ?
                    <View style={this.props.style}>
                        <View style={[styles.defaultView,{backgroundColor:'rgba(247,244,238,1)'}]}>
                            {/*<ActivityIndicator*/}
                            {/*    color={'#666'}*/}
                            {/*    style={styles.loadingMore}*/}
                            {/*    size="small"*/}
                            {/*    animating={!this.state.isLoaded}*/}
                            {/*/>*/}
                            <Image source={require('../images/login/icon.png')} style={{width: 50, height: 50}}/>
                        </View>
                    </View>
                    :
                    <NewView
                        source={{
                            uri: source.uri,
                            priority: FastImage.priority.normal,
                            cache:Platform.OS == 'android'?'force-cache':'immutable'
                        }}
                        style={[this.props.style, this.props.isResize && this.state.width ? {
                            width: this.state.width,
                            height: this.state.height,
                            overflow:'hidden'
                        } : {overflow:'hidden'}]}
                        onLoadEnd={() => {
                            this.setState({isLoaded: true});
                            this.props.onImageLoadEnd && this.props.onImageLoadEnd(source.uri)
                        }
                        }
                        resizeMode={resizeMode}
                        onError={() => {
                            //错误
                            this.setState({
                                isError: true
                            })
                        }}
                        onLoad={() => {
                            this.setState({isError: false, isLoaded: true})
                        }}
                        imageStyle={this.props.imageStyle}
                    >
                        {this.props.children}
                        {(!this.state.isLoaded && !this.state.isError) ? (<View style={[styles.defaultView,{backgroundColor:'rgba(247,244,238,1)'}]}>
                            {/*<ActivityIndicator*/}
                            {/*    color={'#666'}*/}
                            {/*    style={styles.loadingMore}*/}
                            {/*    size="small"*/}
                            {/*    animating={!this.state.isLoaded}*/}
                            {/*/>*/}
                            <Image source={require('../images/login/icon.png')} style={{width: 50, height: 50}}/>
                        </View>) : null}
                        {this.state.isError && this.state.isLoaded ? <View style={styles.defaultView}>
                            <Image source={Images.BImagefauril} style={{width: 50, height: 50}}/>
                        </View> : null}
                    </NewView>
        }
                </View>
            )
        }
    }

}
let styles = StyleSheet.create({
    //
    defaultStyle:{
        backgroundColor:'white',
        overflow:'hidden',
    },
    defaultView:{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden',
    },
    defaultImage:{
        width:128,
        height:44,
        overflow:'hidden',
    },
    moreView:{
        flex:1,
        backgroundColor:'rgba(0,0,0,1)',
        justifyContent:'center'
    }
});
