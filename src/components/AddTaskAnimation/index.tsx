import { useMemoizedFn } from 'ahooks';
import { hasIn } from 'lodash';
import React, {
  CSSProperties,
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { createRoot } from 'react-dom/client';

type FlyOuterProps = {
  flyOuterStyle?: CSSProperties;
  flyInnerStyle?: CSSProperties;
  runTime?: number;
};
type FlyOuterFn = {
  flyOuterRef: React.RefObject<HTMLDivElement | undefined>;
  flyInnerRef: React.RefObject<HTMLDivElement | undefined>;
};
/**
 * 动画球
 * @params children - 小球扩展内容
 * @params flyOuterStyle - 小球外层扩展样式
 * @params flyInnerStyle - 小球内层扩展样式
 * @params runTime - 小球运动时间
 * @params ref - 小球dom实例
 */
const flyOuter = React.forwardRef(
  (
    { flyOuterStyle = {}, flyInnerStyle = {}, runTime = 0.6 }: FlyOuterProps,
    ref: ForwardedRef<FlyOuterFn>,
  ) => {
    const flyOuterRef = useRef<HTMLDivElement>(null);
    const flyInnerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({ flyOuterRef, flyInnerRef }));

    // 运动小球外层样式
    const flyOuter_Style = Object.assign(
      {
        position: 'absolute',
        width: '24px',
        height: '24px',
        transition: `transform ${runTime}s`,
        display: 'none',
        // margin: ' -20px 0 0 -20px',
        transitionTimingFunction: 'linear',
        zIndex: 999999,
      },
      flyOuterStyle,
    );

    // 运动小球内层样式
    const flyInner_Style = Object.assign(
      {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: '#2177D1',
        lineHeight: '1',
        transition: `transform ${runTime}s`,
        justifyContent: 'center',
        alignItems: 'center',
        transitionTimingFunction: 'cubic-bezier(.55,0,.85,.36)', // 向上抛物线的右边
        // transitionTimingFunction: 'cubic-bezier(0, 0, .25, 1.3)', // 向下抛物线的左边
      },
      flyInnerStyle,
    );

    return (
      <div style={flyOuter_Style} ref={flyOuterRef}>
        <div style={flyInner_Style} ref={flyInnerRef} />
      </div>
    );
  },
);

/**
 * 抛物线动画效果
 * @params startRef - 起始点dom节点
 * @params flyOuterStyle - 小球外层扩展样式
 * @params flyInnerStyle - 小球内层扩展样式
 * @params runTime - 小球运动时间
 * @returns { running } - 小球开始运动函数
 */
type TUseParabola = FlyOuterProps & {
  startRef: React.RefObject<HTMLDivElement | undefined>;
};
export default function useAddTaskAnimation(
  props: TUseParabola | React.RefObject<HTMLDivElement | undefined>,
) {
  const {
    startRef,
    flyOuterStyle,
    flyInnerStyle,
    runTime = 800,
  } = (hasIn(props, 'startRef') ? props : { startRef: props }) as TUseParabola;

  const containerRef = useRef(document.createElement('div'));
  const anchorRef = useRef(document.createElement('div'));
  const innerRef = useRef<FlyOuterFn>(null);
  let isRunning = false;
  const endDom = document.getElementById('global_task');
  const container = containerRef.current;
  const anchor = anchorRef.current;

  const mout = useMemoizedFn((node) => {
    if (!node) {
      return;
    }

    document.body.appendChild(container);
    setTimeout(() => {
      anchor.style.position = 'fixed';
      const {
        left = 0,
        top = 0,
        width,
        height,
      } = node?.getBoundingClientRect() ?? {};
      anchor.style.left = left + 'px';
      anchor.style.top = top + 'px';
      anchor.style.width = width + 'px';
      anchor.style.height = height + 'px';
      anchor.style.zIndex = '-10';
      // anchor.style.background = 'red';
      document.body.appendChild(anchor);
    });
  });
  // 挂载到dom上
  useEffect(() => {
    mout(startRef.current);
    return () => {
      setTimeout(() => {
        container && container.parentNode?.removeChild(container);
        anchor && anchor.parentNode?.removeChild(anchor);
      }, 1000);
    };
  }, []);

  useEffect(() => {
    if (anchorRef?.current && startRef?.current && endDom) {
      renderFlyOuter();
    }
  }, []);
  const renderFlyOuter = useMemoizedFn(() => {
    const Node = React.createElement(flyOuter, {
      ref: innerRef,
      flyOuterStyle,
      flyInnerStyle,
      runTime: runTime / 1000,
    });

    const root = createRoot(containerRef.current);
    root.render(Node);
  });
  function refreshMount(node?: HTMLElement) {
    renderFlyOuter();
    mout(node);
  }
  function running() {
    if (anchorRef.current && endDom && innerRef.current) {
      const flyOuterRef = innerRef.current.flyOuterRef.current;
      const flyInnerRef = innerRef.current.flyInnerRef.current;

      // 现在起点距离终点的距离
      const startDot = anchorRef.current?.getBoundingClientRect();
      const endDot = endDom.getBoundingClientRect();

      if (!flyOuterRef || !flyInnerRef || !startDot || !endDot) {
        return;
      }

      // 中心点的水平垂直距离
      const offsetX =
        endDot.left + endDot.width / 4 - (startDot.left + startDot.width / 2);
      // let offsetY = endDot.top + endDot.height / 2 - (startDot.top + startDot.height / 2);
      const offsetY =
        endDot.top + endDot.height / 4 - (startDot.top + startDot.height / 2);

      // 页面滚动尺寸
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft || 0;
      if (!isRunning) {
        // 初始定位
        flyOuterRef.style.display = 'block';
        flyOuterRef.style.left = `${
          startDot.left + scrollLeft + anchorRef.current.clientWidth / 2
        }px`;
        flyOuterRef.style.top = `${
          startDot.top + scrollTop + anchorRef.current.clientHeight / 2
        }px`;

        // 开始动画
        flyOuterRef.style.transform = `translateX(${offsetX}px)`;
        flyInnerRef.style.transform = `translateY(${offsetY}px)`;

        // 动画标志量
        isRunning = true;
        setTimeout(() => {
          flyOuterRef.style.display = 'none';
          flyOuterRef.style.left = '';
          flyOuterRef.style.top = '';
          flyOuterRef.style.transform = '';
          flyInnerRef.style.transform = '';
          isRunning = false;
        }, runTime);
      }
    }
  }

  return { running, refreshMount };
}
