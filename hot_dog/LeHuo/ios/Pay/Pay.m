//
//  Pay.m
//  userClient
//
//  Created by 张羽 on 2018/10/11.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "Pay.h"
#import <React/RCTEventDispatcher.h>
static NSString * const DidReceiveMessage = @"payInfo";
static NSString * const SearchAddress=@"SearchAddress";
static NSString * const SearchDistance=@"SearchDistance";
static Pay *_instance=nil;
@implementation Pay
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();
+(instancetype)sharedInstance {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if(_instance == nil) {
      _instance = [[self alloc] init];
    }
  });
  return _instance;
}
/*
 */
+(void)getPayResult:(NSDictionary*)result{
  //支付结果
  [[Pay sharedInstance].bridge.eventDispatcher sendAppEventWithName:DidReceiveMessage body:result];
}
/*
 * 支付宝支付
 */
RCT_EXPORT_METHOD(AliPay:(NSString*)orderInfo){
    // NOTE: 调用支付结果开始支付
    NSString *appScheme=@"org.reactjs.native.keshi";
    [Pay sharedInstance].bridge=self.bridge;
    [[AlipaySDK defaultService] payOrder:orderInfo fromScheme:appScheme callback:^(NSDictionary *resultDic) {
      NSLog(@"reslut = %@",resultDic);
    }];
}
- (NSArray<NSString *> *)supportedEvents
{
  return @[DidReceiveMessage,SearchAddress,SearchDistance];
}
@end
