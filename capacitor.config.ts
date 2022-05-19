import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.wsdc2017indonesia.app',
  appName: 'WSDC 2017',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      "launchAutoHide": false,
      "androidScaleType": "CENTER_CROP",
      "splashFullScreen": true,
      "splashImmersive": false,
      "backgroundColor": "#ffffff" // YOUR SPLASH SCREEN MAIN COLOR
    },
  },
};

export default config;
