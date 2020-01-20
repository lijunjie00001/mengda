/**
 * Created by user on 2016/11/4.
 */
import React, {Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
// import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from './ActionSheet'
export default class PictureActionSheet extends Component {
    static propTypes = {
        onSuccess:React.PropTypes.func,      //成功后的回调
        compressImageMaxWidth:React.PropTypes.number,//压缩后图片最大的宽
        compressImageMaxHeight:React.PropTypes.number,//压缩后图片最大的高
        maxFiles:React.PropTypes.number,//每次最多的图片数量
        cropping:React.PropTypes.bool,//是否剪切图片
        width:React.PropTypes.number,//剪切图片的宽
        height:React.PropTypes.number,//剪切图片的高
        cropperCircleOverlay:React.PropTypes.bool,//是否显示圆形剪切图片的覆层
        multiple:React.PropTypes.bool, //是否多选
        isShowPicker:React.PropTypes.bool,//是否显示照片选择
        headPortraitLayer:React.PropTypes.bool,//相机蒙层头像面是否显示
        nationalEmblemLayer:React.PropTypes.bool,//相机蒙层国徽面是否显示
        includeBase64:React.PropTypes.bool,
    }
    static defaultProps = {
        compressImageMaxWidth:1000,
        compressImageMaxHeight:1000,
        maxFiles:1,
        cropping:false,
        width:1000,
        height:1000,
        cropperCircleOverlay:false,
        multiple:false,
        isShowPicker:true,
        nationalEmblemLayer:false,//默认蒙层
        headPortraitLayer:false,//默认蒙层
    }
    constructor (props) {
        super (props);
        this.handlePress=this.handlePress.bind(this)
        this.show=this.show.bind(this)
    }
    handlePress(i){
        if(i==1){
            ImagePicker.openCamera({
                compressImageMaxWidth:this.props.cropping?this.props.width:this.props.compressImageMaxWidth,
                compressImageMaxHeight:this.props.cropping?this.props.height:this.props.compressImageMaxHeight,
                width: this.props.width,
                height: this.props.height,
                mediaType:'photo',
                maxFiles:this.props.maxFiles,
                cropping: this.props.cropping,
                cropperCircleOverlay:this.props.cropperCircleOverlay,
                nationalEmblemLayer:this.props.nationalEmblemLayer,
                headPortraitLayer:this.props.headPortraitLayer,
                includeBase64:this.props.includeBase64,
                compressImageQuality:0.3
            }).then(image => {
                this.props.onSuccess(image)
            }).catch((err)=>{
                console.log(err);
            });
        }else if(i==2){
            ImagePicker.openPicker({
                compressImageMaxWidth:this.props.cropping?this.props.width:this.props.compressImageMaxWidth,
                compressImageMaxHeight:this.props.cropping?this.props.height:this.props.compressImageMaxHeight,
                width: this.props.width,
                height: this.props.height,
                multiple:this.props.multiple,
                mediaType:'photo',
                maxFiles:this.props.maxFiles,
                cropping: this.props.cropping,
                cropperCircleOverlay:this.props.cropperCircleOverlay,
                nationalEmblemLayer:this.props.nationalEmblemLayer,
                headPortraitLayer:this.props.headPortraitLayer,
                includeBase64:this.props.includeBase64,
                compressImageQuality:0.3
            }).then(image => {
                this.props.onSuccess(image)
            }).catch((err)=>{
                console.log(err);
            });
        }
    }
    show(){
        this.ActionSheet.show()
    }
    render () {
        return (
            <ActionSheet
                {...this.props}
                ref={o => this.ActionSheet = o}
                // title={'选择照片'}
                // options={this.props.isShowPicker?['取消','拍照','我的相册']:['取消','拍照']}
                // cancelButtonIndex={0}
                onPressIndex={this.handlePress}
            />

        )
    }
}
let styles = StyleSheet.create({
    //
    mainStyle:{
        flexDirection:'column',
        backgroundColor:'rgba(0,0,0,0)',
        justifyContent:'center',
        alignItems:'center',
    },
    messageView:{
        backgroundColor:'#ff9000',
        paddingHorizontal:8,
        paddingVertical:3,
        borderRadius:3
    },
    message:{
        color:'white',
        fontSize:12
    },
    jiantou:{
        width:10,
        height:10,
        borderWidth:5,
        borderColor:'#00000000',
        borderTopColor:'#ff9000',
    },

});