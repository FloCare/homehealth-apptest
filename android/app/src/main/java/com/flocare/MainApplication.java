package com.flocare;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
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

import com.reactnativenavigation.NavigationApplication;

import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

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
            new SplashScreenReactPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}
