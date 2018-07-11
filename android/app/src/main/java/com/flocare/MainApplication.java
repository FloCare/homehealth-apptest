package com.flocare;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.github.wumke.RNImmediatePhoneCall.RNImmediatePhoneCallPackage;
import com.reactlibrary.securekeystore.RNSecureKeyStorePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.ReactInstanceManager;

// Add CodePush imports
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.microsoft.codepush.react.CodePush;

import com.reactnativenavigation.NavigationApplication;

import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication implements ReactInstanceHolder {

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
            new RealmReactPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNSecureKeyStorePackage(),
            new RNFirebasePackage(),
            new RNImmediatePhoneCallPackage(),
            new SplashScreenReactPackage(),
            new RNFirebaseAnalyticsPackage(),
            new CodePush("_9q-fpO4NWxccvRz1V4z4lcwCSZbH1VVg14MQ", getApplicationContext())
    );
  }

  @Override
  public String getJSBundleFile() {
        // Override default getJSBundleFile method with the one CodePush is providing
    return CodePush.getJSBundleFile();
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

      @Override
    public ReactInstanceManager getReactInstanceManager() {
        // CodePush must be told how to find React Native instance
        return getReactNativeHost().getReactInstanceManager();
    }
}
