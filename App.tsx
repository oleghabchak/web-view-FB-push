import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';

import 'react-native-gesture-handler';
import {getFcmToken, registerListenerWithFCM} from './NotificationManager';
import {WebView} from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {AnimatedBootSplash} from './AnimatedBootSplash';

const App = () => {
  const mainUrl = 'https://sportzino.com/?platform=app';
  const webViewRef = React.useRef(null);
  const [visible, setVisible] = useState(true);
  const [link, setUrl] = useState({url: mainUrl});
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  useEffect(() => {
    changeNavigationBarColor('#06033d');
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

  useEffect(() => {
    const handleNotificationClickAction = (
      clickActionData: React.SetStateAction<null>,
    ) => {
      setUrl(clickActionData);
    };

    const unsubscribe = registerListenerWithFCM({
      onNotificationClickActionHandling: handleNotificationClickAction,
    });

    return () => {
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <StatusBar animated={true} backgroundColor="#06033d" />

      <WebView
        ref={webViewRef}
        containerStyle={{backgroundColor: '#06033d'}}
        style={styles.container}
        source={{uri: link?.url}}
        applicationNameForUserAgent={'DemoApp/1.1.0'}
        onLoad={handleWebViewLoad}
        allowsBackForwardNavigationGestures={true}
      />

      {visible && (
        <AnimatedBootSplash
          onAnimationEnd={() => {
            setVisible(false);
          }}
        />
      )}
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
    borderWidth: 7,
    borderColor: '#fff',
    borderRadius: 50,
  },
});

export default App;
