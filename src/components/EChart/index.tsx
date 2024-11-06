import { useDebounceEffect, useSize } from 'ahooks';
import classNames from 'classnames';
import { EChartsOption } from 'echarts';
import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import echarts from './echarts.config';
import './index.less';
type EChartProps = {
  options: EChartsOption;
  loading?: boolean;
  ZrDataInY?: boolean;
  onClick?: (e) => void;
  onZrClick?: (e: number) => void;
  style?: any;
  className?: string;
  finished?: any;
};
const EChart = (props: EChartProps, ref: ForwardedRef<any>) => {
  const {
    options,
    loading = false,
    ZrDataInY,
    onClick,
    onZrClick,
    style,
    className,
  } = props;
  const cDom = useRef(null);
  const cInstance = useRef<any>(null);
  const { width: domW, height: domH } = useSize(cDom) ?? {};

  const getInstance = () => cInstance.current;

  useEffect(() => {
    if (cDom.current) {
      cInstance.current = echarts.getInstanceByDom(cDom.current);
      if (!cInstance.current) {
        cInstance.current = echarts.init(cDom.current);
      }

      cInstance.current?.on('click', (event) => {
        if (event && onClick) onClick(event);
      });
      cInstance.current.getZr().on('click', (params) => {
        let pointInPixel = [params.offsetX, params.offsetY];
        if (cInstance.current.containPixel('grid', pointInPixel)) {
          let xIndex = cInstance.current.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY,
          ])[ZrDataInY ? 1 : 0];
          if (params && onZrClick) onZrClick(0 + xIndex);
        }
      });
      cInstance.current.on('finished', function () {
        props?.finished?.(cInstance.current);
      });
      options && cInstance.current?.setOption(options);
    }

    return () => {
      cInstance.current?.dispose();
    };
  }, [cDom, options]);
  useDebounceEffect(
    () => {
      cInstance.current?.resize({
        width: domW,
        height: domH,
        // animation: { duration: 50 },
      });
    },
    [domW, domH],
    { wait: 100 },
  );

  // 展示 loading 动画
  useEffect(() => {
    loading
      ? cInstance.current?.showLoading()
      : cInstance.current?.hideLoading();
  }, [loading]);

  // 对父组件暴露获取ECharts实例的方法，可直接通过实例调用原生函数
  useImperativeHandle(ref, () => ({
    getInstance,
    resize: (w, h) => {
      cInstance.current?.resize({
        width: w ?? domW,
        height: h ?? domH,
        // animation: { duration: 50 },
      });
    },
  }));
  return (
    <div
      ref={cDom}
      className={classNames('tz-chart', className)}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
};

export default React.memo(React.forwardRef(EChart));
