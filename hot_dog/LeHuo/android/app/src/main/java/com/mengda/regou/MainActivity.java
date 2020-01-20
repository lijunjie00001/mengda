package com.mengda.regou;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Bundle;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mengda.regou.bridge.PayPackage;
import com.mengda.regou.pay.AuthResult;
import com.mengda.regou.pay.PayResult;
import static com.mengda.regou.bridge.PayModule.mContext;
import cn.jpush.android.api.JPushInterface;
import org.devio.rn.splashscreen.SplashScreen;

import java.util.Map;

public class MainActivity extends ReactActivity {

   public static final int SDK_PAY_FLAG = 1;
        public static final int SDK_AUTH_FLAG = 2;
        public static String mPayResult = "";

        @SuppressLint("HandlerLeak")
            public static Handler mHandler = new Handler() {
                @SuppressWarnings("unused")
                public void handleMessage(Message msg) {
                    switch (msg.what) {
                        case SDK_PAY_FLAG: {
                            @SuppressWarnings("unchecked")
                            PayResult payResult = new PayResult((Map<String, String>) msg.obj);
                            /**
                             对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                             */
                            String resultInfo = payResult.getResult();// 同步返回需要验证的信息
                            String resultStatus = payResult.getResultStatus();

                            // 判断resultStatus 为9000则代表支付成功
                            if (TextUtils.equals(resultStatus, "9000")) {
                                // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
                                mPayResult = String.valueOf(resultStatus);
                                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                        .emit("payInfo", "9000");

                            } else {
                                // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                                mPayResult = String.valueOf(resultStatus);
                                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                        .emit("payInfo", "8000");
                            }
                            break;
                        }
                        case SDK_AUTH_FLAG: {
                            @SuppressWarnings("unchecked")
                            AuthResult authResult = new AuthResult((Map<String, String>) msg.obj, true);
                            String resultStatus = authResult.getResultStatus();

                            // 判断resultStatus 为“9000”且result_code
                            // 为“200”则代表授权成功，具体状态码代表含义可参考授权接口文档
                            if (TextUtils.equals(resultStatus, "9000") && TextUtils.equals(authResult.getResultCode(), "200")) {
                                // 获取alipay_open_id，调支付时作为参数extern_token 的value
                                // 传入，则支付账户为该授权账户
                                mPayResult = String.valueOf(resultStatus);
                                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                        .emit("payInfo", "9000");
                            } else {
                                // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                                mPayResult = String.valueOf(resultStatus);
                                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                        .emit("payInfo", "8000");
                            }
                            break;
                        }
                        default:
                            break;
                    }
                }

                ;
            };
    @Override
    protected String getMainComponentName() {
        return "LeHuo";
    }
     @Override
            protected void onCreate(Bundle savedInstanceState) {
                SplashScreen.show(this);
                super.onCreate(savedInstanceState);
                JPushInterface.init(this);
            }

            @Override
            protected void onPause() {
                super.onPause();
                JPushInterface.onPause(this);
            }

            @Override
            protected void onResume() {
                super.onResume();
                JPushInterface.onResume(this);
            }
}
