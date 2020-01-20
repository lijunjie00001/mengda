

import appPage                from '../../App'                                       // Login Page
import MainPage               from '../pages/MainPage'                               //  主页面
import Login                  from '../pages/Login/Login'
import UpdataPassword         from '../pages/Login/UpdatePassword'                  // 忘记密码
import Register               from '../pages/Login/Register'                        // 注册
import ConversationPage       from '../pages/Chat/ChatDetailsPage'                // 聊天页面
import MyinfoPage             from '../pages/My/MyinfoPage'
import ChangeNamePage         from '../pages/My/ChangeNamePage'
import ChangeIconPage         from '../pages/My/ChangeIconPage'
import LxfsPage               from '../pages/My/LxfsPage' //修改手机页面1
import ChangePhonePage        from '../pages/My/ChangePhonePage' //修改手机
import ChangeSexPage          from '../pages/My/changeSexPage'   //修改性别
import MySetingPage           from '../pages/My/MySetingPage'
import AddressListPage        from '../pages/My/MyAddressListPage' //地址列表
import AddaddressPage         from '../pages/My/AddaddRessPage'    //增加地址
import CodesetingPage         from '../pages/My/CodeSetingPage'    //修改密码
import MyjfPage               from '../pages/My/MyjfPage'          //积分明细
import MyvipPage              from '../pages/My/MyVipPage'         //会员卡
import SearchPage             from '../pages/Home/SearchPage'      //搜索页面
import SameCityPage           from '../pages/Home/SameCityPage'    //同城推荐
import HomeTypeListPage       from '../pages/Home/HomeTypeListPage' //分类列表
import HomeVipListPage        from '../pages/Home/HomeVipListPage'  //会员专
import MyCollection           from '../pages/My/CollectionListPage'       //收藏
import HomeDetails            from '../pages/Home/HomeDetailsPage'  //详情
import FriendCrycle           from '../pages/Chat/FriendCryclePage' //朋友圈
import FriendPublish          from '../pages/Chat/publishFriendPage' //发布朋友圈
import FriendDetails          from '../pages/Chat/FriendCrycleDetails' //朋友圈详情
import YinsiSeting            from '../pages/Chat/YinsiSetingPage'    //隐私设置
import SearchListPage         from '../pages/Home/SearchListPage'     //搜索列表
import VipListDetails         from '../pages/Home/VipListDetailsPage' //会员产品详情
import VipPayDetails          from '../pages/VipCard/VipPayDetails'   //开通会员
import MyOrderPaye            from '../pages/My/MyOrderPage'          //我的订单
import VersionInfo            from '../pages/My/VersionInfo'          //版本信息
import MyFriednList           from '../pages/Chat/MyfriendList'       //我的好友
import AddFriend              from '../pages/Chat/AddFriendPage'      // 添加好友
import SeachFriend            from '../pages/Chat/SearchFriend'       // 搜索好友
import OrderDetails           from '../pages/My/OrderDetails'         // 订单详情
import BangdingPhone          from '../pages/Login/BangdingPhone'     // 绑定手机
import VipSuccessPage         from '../pages/VipCard/VipSuccessPage'  // 购买成功
import VipDetailsListPaySuccess from '../pages/Home/VipDetailsPaySuccessPage' //会员产品购买成功
import SettingpushPage          from '../pages/My/SetingPush'  //  消息设置
import MyyouhuijuanPage         from '../pages/My/MyyouhuijuanPage' //优惠卷
import MessageDaraoPage         from '../pages/Chat/MessageDaraoPage'
import YouhuijuanDetailsPage    from '../pages/My/YouhuiJuanDetailsPage'
import XieyiPage                from '../pages/Login/XieyiPage'
import YudingPage               from '../pages/Home/YudingPage' //预定页面
import NetCelebrityDetailsPage  from '../pages/NetCelebrity/NetCelebrityDetailsPage' //网红详情
import ChangeEmailPage          from  '../pages/My/ChangeEmailsPage'
import JiesuPage                from  '../pages/Home/JieSuanPage'
import YudingSuccessPage        from '../pages/Home/YudingSuccessPage'
import HTMLPage                 from '../components/HTMLPage'
import FuwenbenPage             from '../components/FuwenbenPage'
import SlectCity                from '../pages/Home/SlectCityPage'
const RouteConfigs={
    // app Page
    appPage:{
        screen:appPage
    },
    MainPage:{
        screen:MainPage
    },
    Login:{
        screen:Login
    },
    UpdataPassword:{
        screen:UpdataPassword
    },
    Register:{
        screen:Register
    },
    ConversationPage:{
        screen:ConversationPage
    },
    MyinfoPage:{
        screen:MyinfoPage
    },
    ChangeNamePage:{
        screen:ChangeNamePage
    },
    ChangeIconPage:{
        screen:ChangeIconPage
    },
    ChangePhonePage:{
        screen:ChangePhonePage
    },
    LxfsPage:{
        screen:LxfsPage
    },
    ChangeSexPage:{
        screen:ChangeSexPage
    },
    MySetingPage:{
        screen:MySetingPage
    },
    AddaddressPage:{
        screen:AddaddressPage
    },
    AddressListPage:{
        screen:AddressListPage
    },
    CodesetingPage:{
        screen:CodesetingPage
    },
    MyjfPage:{
        screen:MyjfPage
    },
    MyvipPage:{
        screen:MyvipPage
    },
    SearchPage:{
        screen:SearchPage
    },
    SameCityPage:{
        screen:SameCityPage
    },
    HomeTypeListPage:{
        screen:HomeTypeListPage
    },
    HomeVipListPage:{
        screen:HomeVipListPage
    },
    MyCollection:{
        screen:MyCollection
    },
    HomeDetails:{
        screen:HomeDetails
    },
    FriendCrycle:{
        screen:FriendCrycle
    },
    FriendPublish:{
        screen:FriendPublish
    },
    FriendDetails:{
        screen:FriendDetails
    },
    YinsiSeting:{
        screen:YinsiSeting
    },
    SearchListPage:{
        screen:SearchListPage
    },
    VipListDetails:{
        screen:VipListDetails
    },
    VipPayDetails:{
        screen:VipPayDetails
    },
    MyOrderPaye:{
        screen:MyOrderPaye
    },
    VersionInfo:{
        screen:VersionInfo
    },
    MyFriednList:{
        screen:MyFriednList
    },
    AddFriend:{
        screen:AddFriend
    },
    SeachFriend:{
        screen:SeachFriend
    },
    OrderDetails:{
        screen:OrderDetails
    },
    BangdingPhone:{
        screen:BangdingPhone
    },
    VipSuccessPage:{
        screen:VipSuccessPage
    },
    VipDetailsListPaySuccess:{
        screen:VipDetailsListPaySuccess
    },
    SettingpushPage:{
        screen:SettingpushPage
    },
    MyyouhuijuanPage:{
        screen:MyyouhuijuanPage
    },
    MessageDaraoPage:{
        screen:MessageDaraoPage
    },
    YouhuijuanDetailsPage:{
        screen:YouhuijuanDetailsPage
    },
    XieyiPage:{
        screen:XieyiPage
    },
    YudingPage:{
        screen:YudingPage
    },
    NetCelebrityDetailsPage:{
        screen:NetCelebrityDetailsPage
    },
    ChangeEmailPage:{
        screen:ChangeEmailPage
    },
    JiesuPage:{
        screen:JiesuPage
    },
    YudingSuccessPage:{
        screen:YudingSuccessPage
    },
    HTMLPage:{
        screen:HTMLPage
    },
    FuwenbenPage:{
        screen:FuwenbenPage
    },
    SlectCity:{
        screen:SlectCity
    }
};

export default  RouteConfigs
