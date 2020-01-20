

const Url = {
    /*
     * 附近热门
     * @param userId
     * @param page 页码
     * @param perPage 页数
     * @param lat
     * @param lng
     */
    nearbyBusiness(userId,page,perPage,lat,lng){
        return{
            url:'Index/nearbyBusiness',
            type:'GET',
            param:{
                userId:userId,
                page:page,
                perPage:perPage,
                lat:lat,
                lng:lng

            }
        }
    },
    /*
     * 店铺详情
     * @param businessId
     * @param userId
     */
    businessDetail(businessId,userId){
        return{
            url:'Index/businessDetail',
            type:'GET',
            param:{
                businessId:businessId,
                userId:userId,
            }
        }
    },
    /*
     * 首页搜索
     */
    search(keyword){
        return{
            url:'Index/search',
            type:'POST',
            param:{
                keyword:keyword,
            }
        }
    },
    /*
     * 根据类型获取不同的商铺列表
     * @param type 类别ID
     * @param userId
     * @param page
     * @param cot 人气
     * @param dot 距离
     * @param perPage 每页多少
     * @param keyword 关键词
     */
    getBusinessInType(type,userId,cot,dot,page,keyword){
        return{
            url:'Index/getBusinessInType_v2',
            type:'GET',
            param:{
                type:type,
                userId:userId,
                cot:cot,
                dot:dot,
                page:page,
                keyword:keyword
            }
        }
    },
    /*
     * 注册
     * @param phone 手机号码
     * @param password
     * @param code
     * @param md5Code
     * @param registrationId
     * @param lat
     * @param lng
     *
     */
    register(param){
        return{
            url:'Login/register',
            type:'POST',
            param:param
        }
    },
    /*
     * 忘记密码
     * @param phone 手机号码
     * @param password
     * @param code
     * @param md5Code
     * @param registrationId
     * @param lat
     * @param lng
     */
    forgetPassword(param){
        return{
            url:'Login/forgetPassword',
            type:'POST',
            param:param
        }
    },
    /*
     * 登录
     * @param phone 手机号码
     * @param password
     * @param registrationId
     * @param lat
     * @param lng
     */
    codeToLogin(param){
        return{
            url:'Login/toLogin',
            type:'POST',
            param:param
        }
    },
    /*
     * 修改姓名
     */
    changeName(userId,username){
        return{
            url:'User/changeUsername',
            type:'POST',
            param:{
                userId:userId,
                username:username
            }
        }
    },
    /*
     * 修改头像
     */
    changeIcon(userId,base64){
        return{
            url:'User/changeCover',
            type:'POST',
            param:{
                userId:userId,
                base64:base64
            }
        }
    },
    /*
     * 修改性别
     */
    changeSex(userId,sex){
        return{
            url:'User/changeSex',
            type:'POST',
            param:{
                userId:userId,
                sex:sex
            }
        }
    },
    /*
     * 账号密码登录
     * @param phone 手机号码
     * @param password
     * @param registrationId
     * @param lat
     * @param lng
     */
    toLogin(param){
        return{
            url:'Login/toLogin',
            type:'POST',
            param:param
        }
    },
    /*
     * 获取省份
     */
    getProvince(){
        return{
            url:'User/getProvince',
            type:'GET',
        }
    },
    /*
     *根据省份获取城市
     */
    getCityOfProvince(addrProId){
        return{
            url:'User/getCityOfProvince',
            type:'GET',
            param:{
                addrProId:addrProId
            }
        }
    },
    /*
     * 根据城市ID去获取城镇
     */
    getTownOfCity(addrCityId){
        return{
            url:'User/getTownOfCity',
            type:'GET',
            param:{
                addrCityId:addrCityId
            }
        }
    },
    /*
     * 添加新地址
     * @param uid
     * @param phone
     * @param addrTownId 城镇ID
     * @param address    详细地址
     * @param name
     * @param isDefault
     */
    addAddress(param){
        return{
            url:'User/addAddress',
            type:'POST',
            param:param
        }
    },
    /*
     * 地址列表
     * @param uid
     */
    addressList(uid){
        return{
            url:'User/addressList',
            type:'GET',
            param:{
                uid:uid
            }
        }
    },
    /*
     * 删除地址
     * @param uid
     * @param id  地址ID
     */
    deleteAddress(uid,id){
        return{
            url:'User/deleteAddress',
            type:'POST',
            param:{
                uid:uid,
                id:id
            }
        }
    },
    /*
     * 更新地址
     * @param id 地址ID
     * @param uid
     * @param phone
     * @param addrTownId 城镇ID
     * @param address    详细地址
     * @param name
     * @param isDefault 1默认 0不默认
     */
    updateAddress(param){
        return{
            url:'User/updateAddress',
            type:'POST',
            param:param
        }
    },
    /*
     * 积分列表
     * @param uid
     * @param cate 0全部1获得积分2积分兑换
     * @param page
     */
    integralList(uid,cate,page){
        return{
            url:'User/integralList',
            type:'GET',
            param:{
                uid:uid,
                cate:cate,
                page:page
            }
        }
    },
    /*
     *推荐店铺
     * @param type 1会员推荐，2网红 3同城
     * @param uid  没有则不传
     * @param cate 1酒店 2美食 3美容 4夜色 5其他 6会员
     */
    recommendBusiness(uid,type,cate){
        return{
            url:'Index/recommendBusiness',
            type:'GET',
            param:{
                uid:uid,
                type:type,
                cate:cate?cate:''
            }
        }
    },
    /*
     * 会员卡列表
     */
    vipList(){
        return{
            url:'User/vipList',
            type:'GET',
        }
    },
    /*
     * 首页banner
     */
    getBanner(){
        return{
            url:'Index/bannerList',
            type:'GET',
        }
    },
    /*
     * 会员专享推荐列表分类
     */
    goodsRecommendList(uid){
        return{
            url:'Index/goodsRecommendList',
            type:'GET',
            param:{
                uid:uid
            }
        }
    },
    /*
     * 店铺详情
     * @param businessId 店铺id
     * @param userId
     */
    businessDetail(businessId,userId){
        return{
            url:'Index/businessDetail',
            type:'GET',
            param:{
                businessId:businessId,
                userId:userId
            }
        }
    },
    /*
     * 收藏列表
     * @param uid
     * @param type 1商户 2商品
     * @param businessType 商户类型
     * @param goodsType    商品类型
     */
    collectionList(uid,type,businessType,goodsType){
        return{
            url:'User/collectionList',
            type:'GET',
            param:{
                uid:uid,
                type:type,
                businessType:businessType,
                goodsType:goodsType
            }
        }
    },
    /*
     * 收藏/取消收藏
     * @param uid
     * @param type 1商家2商品
     * @param gid  商品ID
     * @param bid  商家id
     */
    collect(uid,type,gid,bid){
        return{
            url:'User/collect',
            type:'POST',
            param:{
                uid:uid,
                type:type,
                gid:gid,
                bid:bid
            }
        }
    },
    /*
     * 发布
     * @param uid
     * @param content
     * @param img
     */
    publish(param){
        return {
            url: 'Friend/publish',
            type: 'POST',
            param: param
        }

    },
    /*
     * 我的朋友圈列表
     */
    myPyqList(uid,page){
        return{
            url:'Friend/myPyqList',
            type:'GET',
            param:{
                uid:uid,
                page:page,
            }
        }
    },
    /*
     * 点赞取消点赞
     * @param uid
     * @param aid 朋友圈ID
     */
    toAgree(uid,aid){
        return{
            url:'Friend/toAgree',
            type:'POST',
            param:{
                uid:uid,
                aid:aid,
            }
        }
    },
    /*
     * 评论
     * @param uid
     * @param aid 朋友圈ID
     * @param content 内容
     */
    toComment(uid,aid,content){
        return{
            url:'Friend/toComment',
            type:'POST',
            param:{
                uid:uid,
                aid:aid,
                content:content
            }
        }
    },
    /*
     * 动态评论
     * @param uid
     * @param replyUid 恢复的用户ID
     * @param aid 朋友圈ID
     * @param content 内容
     */
    toReply(uid,replyUid,aid,content){
        return{
            url:'Friend/toReply',
            type:'POST',
            param:{
                uid:uid,
                replyUid:replyUid,
                aid:aid,
                content:content
            }
        }
    },
    /*
     * 朋友圈详情
     */
    FriendDetais(uid,aid){
        return{
            url:'Friend/detail',
            type:'GET',
            param:{
                uid:uid,
                aid:aid,
            }
        }
    },
    /*
     * 好友的朋友圈
     */
    friendPyqList(uid,page){
        return{
            url:'Friend/friendPyqList',
            type:'GET',
            param:{
                uid:uid,
                page:page
            }
        }
    },
    /*
     * 附近的朋友圈
     */
    nearPyqList(uid,page){
        return{
            url:'Friend/nearPyqList',
            type:'GET',
            param:{
                uid:uid,
                page:page
            }
        }
    },
    /*
     * 会员推荐列表
     * @param uid
     * @param cateId 0全部1白酒2红酒3黄酒
     * @param page 当前页
     * @param perPage 页数
     */
    goodsList(uid,cateId,page,perPage){
        return{
            url:'Index/goodsList',
            type:'GET',
            param:{
                uid:uid,
                cateId:cateId,
                page:page,
                perPage:perPage
            }
        }
    },
    /*
     * 商品详情
     * @param goodsId 商品ID
     * @param uid
     */
    goodsDetail(businessId,uid){
        return{
            url:'Index/goodsDetail',
            type:'GET',
            param:{
                goodsId:businessId,
                uid:uid
            }
        }
    },
    /*
     * 订单列表
     * @param uid
     * @param page
     * @param status 0全部 2待处理 3已发货 4已签收
     */
    orderList(uid,page,status){
        return{
            url:'User/orderList',
            type:'GET',
            param:{
                uid:uid,
                page:page,
                status:status
            }
        }
    },
    /*
     * h5店铺详情
     */
    getBusinessDescription(businessId){
        return{
            url:'Index/getBusinessDescription',
            type:'GET',
            param:{
                businessId:businessId,
            }
        }
    },
    /*
     * h5专享商品详情
     */
    getGoodsDescription(goodsId){
        return{
            url:'Index/getGoodsDescription',
            type:'GET',
            param:{
                goodsId:goodsId,
            }
        }
    },
    /*
     * 我的会员权益
     */
    myEquity(uid){
        return{
            url:'User/myEquity',
            type:'GET',
            param:{
                uid:uid,
            }
        }
    },
    /*
     * 获取微信token
     */
    getWechatToken(code,sceret,oppid){
        return{
            url:'https://api.weixin.qq.com/sns/oauth2/access_token',
            type:'GET',
            wechat:true,
            param:{
                code:code,
                secret:sceret,
                appid:oppid,
                grant_type:'authorization_code'
            }
        }
    },
    /*
     * 获取微信信息
     */
    getWechatInfo(token,oppid){
        return{
            url:'https://api.weixin.qq.com/sns/userinfo',
            type:'GET',
            wechat:true,
            param:{
                access_token:token,
                openid:oppid,
            }
        }
    },
    /*
     * 第三方登录
     * @param type 1 扣扣 2微信 3微博
     * @param open_id
     * @param cover 头像
     * @param nickname 昵称
     * @param registrationId
     * @param lat
     * @param lng
     */
    thirdToLogin(param){
        return{
            url:'Login/thirdToLogin',
            type:'POST',
            param:param
        }
    },
    /*
     * 第三方注册
     *  * @param type 1 扣扣 2微信 3微博
     * @param open_id
     * @param cover 头像
     * @param nickname 昵称
     * @param registrationId
     * @param lat
     * @param lng
     * @param phone
     * @param code
     * @param md5Code
     *
     */
    registerThird(param){
        return{
            url:'Login/registerThird',
            type:'POST',
            param:param
        }
    },
    /*
     * 微博获取信息
     * @param access_token
     * @param uid
     */
    weiboInfomation(access_token,uid){
        return{
            url:'https://api.weibo.com/2/users/show.json',
            type:'GET',
            wechat:true,
            param:{
                access_token:access_token,
                uid:uid,
            }
        }
    },
    /*
     * qq获取信息
     */
    qqInfomation(access_token,oauth_consumer_key,openid){
        return{
            url:'https://graph.qq.com/user/get_user_info',
            type:'GET',
            wechat:true,
            param:{
                access_token:access_token,
                oauth_consumer_key:oauth_consumer_key,
                openid:openid
            }
        }
    },
    /*
     * 发送验证码
     * @param phone
     * @param type 1登录 2注册 5修改密码 3 绑定手机
     *
     */
    sendCode(phone,type){
        return{
            url:'Login/sendCode',
            type:'POST',
            param:{
                phone:phone,
                type:type
            }
        }
    },
    /*
     * 店铺详情富文本
     */
    getBusinessDescription(businessId){
        return{
            url:'Index/getBusinessDescription',
            type:'GET',
            param:{
                businessId:businessId,
            }
        }
    },
    /*
     *商品详情富文本
     */
    getGoodsDescription(goodsId){
        return{
            url:'Index/getGoodsDescription',
            type:'GET',
            param:{
                goodsId:goodsId,
            }
        }
    },
    /*
     * 搜索好友
     */
    searchFriend(uid,username){
        return{
            url:'Friend/searchFriend',
            type:'POST',
            param:{
                uid:uid,
                username:username
            }
        }
    },
    /*
     * 订单详情
     */
    orderDetail(uid,orderNum){
        return{
            url:'User/orderDetail',
            type:'GET',
            param:{
                uid:uid,
                orderNum:orderNum
            }
        }
    },
    /*
     * 购买会员卡
     * @param uid
     * @param vid 卡片ID
     * @param isMortgage
     * @param payType 1微信 2支付宝
     */
    createOrderOfVip(param) {
        return {
            url: 'Business/createOrderOfVip',
            type: 'POST',
            param: param
        }
    },
    /*
     * 会员产品购买
     * @param uid
     * @param aid 地址ID
     * @param gnid 商品ID
     * @param goodsNum 商品数目
     * @param payType
     */
    createOrderOfGoods(param){
        return {
            url: 'Business/createOrderOfGoods',
            type: 'POST',
            param: param
        }
    },
    /*
     * 添加好友
     * @param uid
     * @param fid
     */
    addFriend(uid,fid){
        return {
            url: 'Friend/addFriend',
            type: 'POST',
            param: {
                uid:uid,
                fid:fid
            }
        }
    },
    /*
     * 删除好友
     */
    removeFriend(uid,fid){
        return {
            url: 'Friend/removeFriend',
            type: 'POST',
            param: {
                uid:uid,
                fid:fid
            }
        }
    },
    /*
     * 好友列表
     */
    getFriendList(uid){
        return {
            url: 'Friend/getFriendList',
            type: 'GET',
            param: {
                uid:uid,
            }
        }
    },
    /*
     * 修改密码
     */
    changePassword(param){
        return {
            url: 'User/changePassword',
            type: 'POST',
            param:param
        }
    },
    /*
     *  设置推送
     */
    setPush(uid,isPush){
        return {
            url: 'User/setPush',
            type: 'POST',
            param:{
                uid:uid,
                isPush:isPush
            }
        }
    },
    /*
     * 我的优惠卷
     * @param uid
     * @param type 0 全部 1酒店 2美食 3美容 4夜色 5其他 6会员
     */
    couponList(uid,type){
        return {
            url: 'User/couponList',
            type: 'GET',
            param:{
                uid:uid,
                type:type
            }
        }
    },
    /*
     * 修改手机号
     */
    changePhone(param){
        return {
            url: 'User/changePhone',
            type: 'POST',
            param:param
        }
    },
    /*
     *好友请求列表
     */
    friendRequestList(param){
        return {
            url: 'Friend/friendRequestList',
            type: 'GET',
            param:param
        }
    },
    /*
     * 接受好友请求
     * @param type 1拒绝 2接受
     */
    acceptFriend(uid,fid,type){
        return {
            url: 'Friend/acceptFriend',
            type: 'POST',
            param:{
                uid:uid,
                fid:fid,
                type:type
            }
        }
    },
    /*
     * 商品分类
     */
    getCate(){
        return{
            url: 'Index/cate',
            type: 'GET',
            param:{}
        }
    },
    /*
     * 苹果是否上架
     */
    isUp(){
        return{
            url: 'Index/inAppStore',
            type: 'GET',
            param:{}
        }
    },
    /*
     * 更新用户地址
     */
    uploadUserAddree(uid,lat,lng){
        return{
            url: 'User/updateLocal',
            type: 'POST',
            param:{
                uid:uid,
                lat:lat,
                lng:lng
            }
        }
    },
    /*
     * 获取首页类别
     * @param type 0平台分类1商户分类
     * @param pid  父级分类，传递本参数就表示获取单个子集分类
     */
    carType(type,pid){
        return{
            url: 'Index/cate_v2',
            type: 'GET',
            param:{
                type:type,
                pid:pid,
            }
        }
    },
    /*
     * 获取背景图片
     * @param  type 1商品页面2商户页面3活动页面4积分背景5朋友圈背景
     */
    getBackImage(type){
        return{
            url: 'Index/bannerList_v2',
            type: 'GET',
            param:{
                type:type,
            }
        }
    },
    /*
     * 获取酒店优惠信息
     * @param bid  商户id
     */
    roomList(bid){
        return{
            url: 'Business/roomList',
            type: 'GET',
            param:{
                bid:bid,
            }
        }
    },
    /*
     * 非酒店优惠信息
     */
    discountList(bid){
        return{
            url: 'Business/discountList',
            type: 'GET',
            param:{
                bid:bid,
            }
        }
    },
    /*
     * 新版网红推荐
     * @param uid 用户id，没有就不传
     * @param page
     * @param perPage
     */
    wanghot(uid,page,perPage){
        return{
            url: 'Index/whRecommendBusiness',
            type: 'GET',
            param:{
                uid:uid,
                page:page,
                perPage:perPage
            }
        }
    },
    /*
     * 网红详情接口
     */
    wanghongDetais(id,uid){
        return{
            url: 'Index/whBusinessDetail',
            type: 'GET',
            param:{
                bid:id,
                uid:uid
            }
        }
    },
    /*
     * 评论商户
     * @param bid 商户id
     * @param uid 用户id
     * @param content 评论内容
     * @param star 星级（1~5）
     */
    pingShop(bid,uid,content,star){
        return{
            url: 'Business/toCommentBusiness',
            type: 'POST',
            param:{
                bid:bid,
                uid:uid,
                content:content,
                star:star
            }
        }
    },
    /*
     * 评论商户里面评论
     * @param bid 商户id
     * @param uid 用户id
     * @param content 评论内容
     * @param replyUid 要回复的用户id
     */
    pingSecondShop(bid,uid,content,replyUid){
        return{
            url: 'Business/toCommentBusiness',
            type: 'POST',
            param:{
                bid:bid,
                uid:uid,
                content:content,
                replyUid:replyUid
            }
        }
    },
    /*
     * 修改星座生日
     * @param uid 用户id
     * @param birthday 生日字符串，形如2018-02-01
     */
    changeBirdth(uid,birthday){
        return{
            url: 'User/setBirthday',
            type: 'POST',
            param:{
                uid:uid,
                birthday:birthday,
            }
        }
    },
    /*
     *商户评论列表
     * @param bid 商户id
     * @param uid 用户id（有就传）
     * @param page
     * @param perPage
     */
    businessComment(bid,uid,page,perPage){
        return{
            url: 'Business/businessComment',
            type: 'GET',
            param:{
                bid:bid,
                uid:uid,
                page:page,
                perPage:perPage
            }
        }
    },
    /*
     *回复商户的评论/点赞商户评论
     * @param commentId 所属的评论id，即列表里面的id
     * @param replyUid  要回复的用户id
     * @param 1点赞3回复（type为点赞的时候content和star可以不传）
     */
    toReplyBusiness(uid,bid,replyUid,content,commentId,start,type){
        return{
            url: 'Business/toReplyBusiness',
            type: 'POST',
            param:{
                uid:uid,
                bid:bid,
                replyUid:replyUid,
                content:content,
                commentId:commentId,
                start:start,
                type:type
            }
        }
    },
    /*
     * 最火最热接口
     * @param page
     * @param perPage
     * @param uid
     * @param type 1最新2最火3最热4最潮
     */
    recommendInVip(page,perPage,uid,type){
        return{
            url: 'Index/recommendInVip',
            type: 'GET',
            param:{
                page:page,
                perPage:perPage,
                uid:uid,
                type:type,
            }
        }
    },
    /*
     * 批量删除收藏
     * @param uid
     * @param cid 收藏id，如果是批量的，就用逗号将多个cid连接起来
     */
    collectionDelete(uid,cid){
        return{
            url: 'User/collectionDelete',
            type: 'POST',
            param:{
                uid:uid,
                cid:cid,
            }
        }
    },
    /*
     * 上传朋友圈背景
     */
    changeBackground(userId,base){
        return{
            url: 'User/changeBackground',
            type: 'POST',
            param:{
                userId:userId,
                base64:base,
            }
        }
    },
    /*
     * 获取周边信息
     */
    nearbyFood(page,perPage,bid){
        return{
            url: 'Business/nearbyFood',
            type: 'GET',
            param:{
                page:page,
                perPage:perPage,
                bid:bid
            }
        }
    },
    /*
     * 新的订单
     * @param status待处理1,2,3 已取消4 已完成5
     */
    orderListv2(uid,status,page,perPage){
        return{
            url: 'User/orderList_v2',
            type: 'GET',
            param:{
                uid:uid,
                status:status,
                page:page,
                perPage:perPage,
            }
        }
    },
    /*
     * 修改邮箱
     */
    changeEmail(userId,email){
        return{
            url: 'User/changeEmail',
            type: 'POST',
            param:{
                userId:userId,
                email:email,
            }
        }
    },
    /*
     *  新的收藏列表
     */
    collectionv2(uid,page,perPage){
        return{
            url: 'User/collectionList_v2',
            type: 'GET',
            param:{
                uid:uid,
                page:page,
                perPage:perPage,
            }
        }
    },
    /*
     * 删除订单
     */
    orderDelete(oid,uid,bid){
        return{
            url: 'User/orderDelete',
            type: 'POST',
            param:{
                oid:oid,
                uid:uid,
                bid:bid
            }
        }
    },
    /*
     *对商铺点赞
     */
    addBusinessSupport(bid,uid){
        return{
            url: 'Business/addBusinessSupport',
            type: 'POST',
            param:{
                bid:bid,
                uid:uid,
            }
        }
    },
    /*
     * 商户下单接口
     * 包含酒店的预定，当商户类型不为酒店的时候，后面5个字段都穿空就行了）
     * @param uid
     * @param bid
     * @param checkin 入住时间
     * @param idcard  入住身份证
     * @param name  入住人姓名
     * @param phone 入住人号码
     * @param room   房型数据（json格式，房型id为key， 数量为key，将json字符串urlencode）
     * @param is_dicount  是否折扣
     * @param no_discount_price 无折扣的金额
     * @param total_price 总共金额
     * @param discount_price 折扣金额
     */
    createOrderOfBusinessv2(param){
        return{
            url: 'Business/createOrderOfBusiness_v2',
            type: 'POST',
            param:param
        }
    },
    /*
     *获取天气
     */
    weather(){
        return{
            url: 'Index/weather',
            type: 'GET',
            param:{}
        }
    },
    /*
     * 待结算
     */
    setOrderWaitSettle(uid,oid){
        return{
            url: 'Business/setOrderWaitSettle',
            type: 'POST',
            param:{
                uid:uid,
                oid:oid
            }
        }
    },
    /*
     * 判断积分可够
     */
    canUserIntegral(uid,integral){
        return{
            url: 'Index/canUserIntegral',
            type: 'GET',
            param:{
                uid:uid,
                integral:integral
            }
        }
    },
    /*
     * 获取会员卡的优惠
     */
    vipMonthList(){
        return{
            url: 'User/vipMonthList',
            type: 'GET',
            param:{}
        }
    },
    /*
     * 获取积分
     */
    getUserInfoForApi(uid){
        return{
            url: 'User/getUserInfoForApi',
            type: 'GET',
            param:{
                uid:uid
            }
        }
    },
    /*
     * 获取用户信息
     */
    getUserInfoForApi(uid){
        return{
            url: 'User/getUserInfoForApi',
            type: 'GET',
            param:{
                uid:uid
            }
        }
    },
    /*
     * 获取版本号
     */
    getVersion(){
        return{
            url: 'Index/getVersion',
            type: 'GET',
            param:{

            }
        }
    },
    /*
     * 获取积分比例
     */
    getJifenbili(){
        return{
            url: 'Business/getProportionOfApi',
            type: 'GET',
            param:{

            }
        }
    }

};
module.exports = Url;
