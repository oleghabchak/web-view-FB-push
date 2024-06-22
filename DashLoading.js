import React, {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';

export default function AnimationWithImperativeApi({width}) {
  const animationRef = useRef();

  useEffect(() => {
    animationRef.current?.play();

    animationRef.current?.play(71, 86);
  }, [animationRef]);

  return (
    <LottieView
      ref={animationRef}
      source={require('./loading.json')}
      loop
      speed={0.2}
      style={{width: width, height: width, alignItems:'baseline'}}
    />
  );
}
