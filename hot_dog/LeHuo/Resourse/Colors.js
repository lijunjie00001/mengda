/**
 *@FileName Colors.js
 *@desc (定义系统颜色)
 *@author 陈金华
 *@date 2018/7/30 10:55
 */
import {
    PixelRatio,
} from 'react-native';
const colors = {
    WHITE:'#fff',//白色
    RED:'#f00',//红色
    BLACK:'#000',//黑色
    TRANSPARENT_COLOR:'rgba(0,0,0,0)',//透明色
    BLACK_TRANSPARENT_COLOR:'rgba(0,0,0,0.7)',//半透明黑色
    BACK_COLOR:'#F7F4EF',
    CHATTEXT:'rgba(51,51,51,1)',
    LINE:'rgba(204,204,204,1)',
    POINT:'rgba(235,28,18,1)',
    TIME:'rgba(153,153,153,1)',
    CHATBUDDLE:'rgba(242,203,98,1)',
    SYSTEMTEXT:'rgba(167,167,161,1)',
    // width_1_PixelRatio:1,
    width_1_PixelRatio:1/PixelRatio.get(),
    BackPage:'rgba(247,244,238,1)',
    Noticetitle:'rgba(102,102,102,1)',
    CODE_TEXT:'#35BFEC',
    JF_title:'rgba(128,128,128,1)',
    CAED:'rgba(179,179,179,1)',
    SEARCH_back:'rgba(243,243,243,1)',
    FIREDD_NAME:'rgba(117,119,154,1)',
    Price:'rgba(252,52,52,1)',
    Order:'rgba(193,152,65,1)',
    OrderPrice:'rgba(225,8,8,1)',
    AddFriend:'rgba(255,237,0,1)',
    OrderDetail:'rgba(253,251,247,1)',
    MeishiLine:'rgba(242,203,98,1)', //美食
    MeishiTitle:'rgba(241,146,72,1)',
    JiuDianLine:'rgba(34,203,255,1)', //酒店
    JiuDianTitle:'rgba(33,181,253,1)',
    SPAlline:'rgba(253,160,99,1)',//spa
    SPAtitle:'rgba(253,139,94,1)',
    YESEline:'rgba(112,144,242,1)', //夜色
    YESETitle:'rgba(117,132,234,1)',
    Gray:'rgba(245,245,244,1)',
    

};

export default colors;

