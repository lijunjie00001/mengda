package com.mengda.regou.bridge;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PayPackage implements ReactPackage {

      //支付PayModule
        public PayModule mPayModule;

        @Override
        public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
            List<NativeModule> modules = new ArrayList<>();
            mPayModule = new PayModule(reactContext);
            modules.add(mPayModule);
            return modules;
        }

        @Override
        public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
            return Collections.emptyList();
        }

        public List<Class<? extends JavaScriptModule>> createJSModules() {
            return Collections.emptyList();
        }
}