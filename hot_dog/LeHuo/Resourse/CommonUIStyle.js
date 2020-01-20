/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */

import {
    Dimensions,
    PixelRatio,
    Platform
} from 'react-native';
export const width = Dimensions.get('window').width;      //设备的宽度
export const height = Dimensions.get('window').height;    //设备的高度
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例

let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;                           //iphone6的像素密度

//px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const scale = Math.min(height / h2, width / w2);   //获取缩放比例
/**
 *@desc   设置字体
 *@author 张羽
 *@date   2018/8/3 下午3:09
 *@param
 */
export function setSpText(size: number) {
    size = Math.round((size * scale) * pixelRatio / fontScale);
    return size/defaultPixel;
}
/**
 *@desc   设置长度
 *@author 张羽
 *@date   2018/8/3 下午3:09
 *@param
 */
export function scaleSize(size: number) {
    size = Math.round(size * scale);
    return size;
}
/**
 *@desc   判断是否IponeX
 *@author 张羽
 *@date   2018/8/7 下午5:06
 *@param
 */

export function isPhoneX () {
    return(
        Platform.OS === 'ios' &&
       ((height === X_HEIGHT && width === X_WIDTH) ||
        (height === X_WIDTH && width === X_HEIGHT))
    )

}