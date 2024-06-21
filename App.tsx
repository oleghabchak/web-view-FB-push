import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
  Dimensions,
  View,
  Image,
  Alert,
} from 'react-native';

import 'react-native-gesture-handler';
import {getFcmToken, registerListenerWithFCM} from './NotificationManager';
import {WebView} from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
// import LoadingComponents from './DashLoading';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const App = () => {
  // const mainUrl = 'https://sportzino-auth.vercel.app/';
  const mainUrl = 'https://sportzino.com/?platform=app';
  // const mainUrl = "https://sportzino.com/signup?utm_source=newsletter1&utm_medium=email&utm_campaign=spz_7b9aba1a";
  const webViewRef = React.useRef(null);
  const [link, setUrl] = useState({url: mainUrl});
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  useEffect(() => {
    changeNavigationBarColor('#06033d');
    // SplashScreen.show();
    getFcmToken();
    if (Platform.OS === 'ios') {
      messaging()
        .subscribeToTopic('ios')
        .then(() => console.log('Subscribed to topic iOS!'));
    }

    if (Platform.OS === 'android') {
      messaging()
        .subscribeToTopic('android')
        .then(() => console.log('Subscribed to topic android!'));
    }

    messaging()
      .subscribeToTopic('spectator')
      .then(() => console.log('Subscribed to topic spectator!'));
  }, []);

  console.log('link', link?.url);

  useEffect(() => {
    // Define the callback function
    const handleNotificationClickAction = (
      clickActionData: React.SetStateAction<null>,
    ) => {
      // Handle the click action data received from the child
      // console.log('STclickActionDataATE12', clickActionData);
      setUrl(clickActionData);
    };

    // Call the registerListenerWithFCM function and pass the callback function
    const unsubscribe = registerListenerWithFCM({
      onNotificationClickActionHandling: handleNotificationClickAction,
    });

    // Clean up function
    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
    } catch (error) {
      console.log(error);
    }

    const backAction = () => {
      webViewRef.current.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const handleWebViewLoad = () => {
    setWebViewLoaded(true);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#06033d',
        justifyContent: 'center',
        alignContent: 'center',
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }}>
      <StatusBar animated={true} backgroundColor="#06033d" />

      {/* {!webViewLoaded ?  */}
      {/* <>
        <LoadingComponents width={screenWidth} />
        <Image
          style={{
            position: 'absolute',
            left: (screenWidth - screenWidth * 0.5) / 2, // Center horizontally
            top: (screenHeight - screenHeight * 0.5) / 2,
            marginTop: 55,
            transform: [{scale: 0.4}],
          }}
          source={require('./lib/pin.png')}
        />
      </> */}

      <WebView
        ref={webViewRef}
        style={styles.container}
        source={{uri: link?.url}}
        applicationNameForUserAgent={'DemoApp/1.1.0'}
        onLoad={handleWebViewLoad}
        allowsBackForwardNavigationGestures={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06033d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    transformOrigin: 'center',
    animationName: 'animation',
    animationDuration: 1200,
    animationTimingFunction: 'cubic-bezier',
    animationIterationCount: 'infinite',
    borderWidth: 7, // Equivalent to stroke-width in SVG
    borderColor: '#fff', // Equivalent to stroke in SVG
    borderRadius: 50, // To make a round border, similar to stroke-linecap: round
    // You may need to implement the shadow effect differently as React Native doesn't support filter: url(#shadow)
    // You can use shadow properties like shadowColor, shadowOffset, shadowOpacity, and shadowRadius instead
  },
});
export default App;
