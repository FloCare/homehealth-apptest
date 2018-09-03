package com.flocare;

import com.reactnativenavigation.controllers.SplashActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import com.facebook.soloader.SoLoader;
import android.content.Intent;

public class MainActivity extends SplashActivity  {
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		SplashScreen.show(this);
		super.onCreate(savedInstanceState);
        SoLoader.init(this, /* native exopackage */ false); // <-- Check this line exists within the block
	}
}
