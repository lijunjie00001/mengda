package com.mengda.regou.bridge;

import android.os.Message;
import android.util.Log;

import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mengda.regou.MainActivity;

import java.util.Map;

/**
 * @version:v1.0
 * @description:支付
 * @package: com.lv.brokerclient.bridge
 * @author: chenbing
 * @date :2018/11/21
 */
public class PayModule extends ReactContextBaseJavaModule {

    public static ReactContext mContext;

    public PayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //给上下文对象赋值
        this.mContext = reactContext;

    }

    /**
     * ReactContextBaseJavaModule要求派生类实现getName方法。这个函数用于返回一个字符串
     * 这个字符串用于在JavaScript端标记这个原生模块
     *
     * @return
     */
    @Override
    public String getName() {
        return "PayModule";
    }


    /**
     * 支付宝支付
     *
     * @param orderInfo
     */
    @ReactMethod
    public void AliPay(final String orderInfo) {

        Runnable payRunnable = new Runnable() {

            @Override
            public void run() {
                PayTask alipay = new PayTask(getCurrentActivity());
                Map<String, String> result = alipay.payV2(orderInfo, true);
                Log.i("msp", result.toString());

                Message msg = new Message();
                msg.what = MainActivity.SDK_PAY_FLAG;
                msg.obj = result;
                MainActivity.mHandler.sendMessage(msg);
            }
        };

        Thread payThread = new Thread(payRunnable);
        payThread.start();

    }



}
