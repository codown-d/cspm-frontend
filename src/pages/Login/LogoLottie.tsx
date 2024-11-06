import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';
import LottieLogo from '../../assets/lottie/logo.json';

const firstLoopSegment: [number, number] = [0, 180];
const secondLoopSegment: [number, number] = [180, 240];

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
        autoplay: false,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
        animationData: animationData,
      });
    }
    lottieInstance.current.playSegments(
      [firstLoopSegment, secondLoopSegment],
      true,
    );
    return () => {
      lottieInstance.current?.destroy();
      lottieInstance.current = null;
    };
  }, [animationData]);

  return <div style={{ height: '100%', width: '100%' }} ref={element} />;
};

const LogoLottie = () => {
  return <Lottie animationData={LottieLogo} />;
};
export default LogoLottie;
