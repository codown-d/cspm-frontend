import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';
import LottieLoading from '../assets/lottie/loading.json';

interface LottieProps {
  animationData: any;
}

const Lottie = ({ animationData }: LottieProps) => {
  const element = useRef<HTMLDivElement>(null);
  const lottieInstance = useRef<any>();

  useEffect(() => {
    if (element.current) {
      lottieInstance.current?.destroy();
      lottieInstance.current = lottie.loadAnimation({
        container: element.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
        animationData: animationData,
      });
    }
    lottieInstance.current.play();
    lottieInstance.current.setSpeed(2.2);
    // lottieInstance.current.playSegments(
    //   [firstLoopSegment, secondLoopSegment],
    //   true,
    // );
    return () => {
      lottieInstance.current?.destroy();
      lottieInstance.current = null;
    };
  }, [animationData]);

  return <div style={{ height: '100%', width: '100%' }} ref={element} />;
};

const LoadingLottie = () => {
  return <Lottie animationData={LottieLoading} />;
};
export default LoadingLottie;
