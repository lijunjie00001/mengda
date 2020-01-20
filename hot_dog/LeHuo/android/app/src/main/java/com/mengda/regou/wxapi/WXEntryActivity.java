package com.mengda.regou.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.theweflex.react.WeChatModule;

/**
 * @version:版本
 * @description:描述
 * @package: com.lv.brokerclient.wxapi
 * @author: chenbing
 * @date :2018/11/19
 */
public class WXEntryActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }




}
