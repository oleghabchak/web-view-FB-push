import {useState} from 'react';
import {Animated, Dimensions} from 'react-native';
import BootSplash from 'react-native-bootsplash';

type Props = {
  onAnimationEnd: () => void;
};

export const AnimatedBootSplash = ({onAnimationEnd}: Props) => {
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));

  const {container, logo /*, brand */} = BootSplash.useHideAnimation({
    manifest: require('./assets/bootsplash_manifest.json'),
    logo: require('./assets/bootsplash_logo.png'),

    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      const {height} = Dimensions.get('window');

      setTimeout(() => {
        Animated.stagger(500, [
          Animated.spring(translateY, {
            useNativeDriver: true,
            toValue: height,
          }),
        ]).start();

        Animated.timing(opacity, {
          useNativeDriver: true,
          toValue: 0,
          duration: 500,
          delay: 150,
        }).start(() => {
          onAnimationEnd();
        });
      }, 2000);
    },
  });

  return (
    <Animated.View
      {...container}
      style={[container.style, {opacity, backgroundColor: '#06033A'}]}>
      <Animated.Image
        {...logo}
        style={[logo.style, {transform: [{translateY}]}]}
      />
    </Animated.View>
  );
};
