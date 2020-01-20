//
//  Pay.h
//  userClient
//
//  Created by 张羽 on 2018/10/11.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AlipaySDK/AlipaySDK.h>
#import <React/RCTEventEmitter.h>
@interface Pay : RCTEventEmitter
@property (nonatomic, copy) NSString *AlipayCallBack;
@property (nonatomic, copy) NSString *WechatPayCallBack;
+(void)getPayResult:(NSDictionary*)result;
@end
