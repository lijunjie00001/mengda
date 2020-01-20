package com.mengda.regou;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.gratong.WeiBoPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import io.jchat.android.JMessageReactPackage;
import cn.reactnative.modules.qq.QQPackage;
import com.theweflex.react.WeChatPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.beefe.picker.PickerViewPackage;
import com.rnfs.RNFSPackage;
import com.microsoft.codepush.react.CodePush;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.remobile.toast.RCTToastPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import com.mengda.regou.bridge.PayPackage;
import android.support.multidex.MultiDex;

public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new RNFetchBlobPackage(),
          new JMessageReactPackage(SHUTDOWN_TOAST),
           new PayPackage(),
            new WeiBoPackage(),
            new FastImageViewPackage(),
            new ReactNativeAudioPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new QQPackage(),
            new WeChatPackage(),
            new AMapGeolocationPackage(),
          new SplashScreenReactPackage(),
          new PickerViewPackage(),
          new RNFSPackage(),
          new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
          new RCTCameraPackage(),
          new PickerPackage(),
          new RCTToastPackage(),
          new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
