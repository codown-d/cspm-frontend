import { TzSteps } from '@/components/lib/tzSteps';
import { StepProps } from 'antd';
import classNames from 'classnames';
import { useMemo, useRef } from 'react';
import './index.less';

export type ModelStepsProps = {
  dataSource?: API.TaskDetailProgressObj[];
  className?: string;
};
function ModelSteps({ dataSource, className }: ModelStepsProps) {
  const currentRef = useRef<number>();
  const items1 = useMemo(() => {
    return dataSource?.map((v, idx) => {
      v.status === 'running' && (currentRef.current = idx);
      return {
        title: v.name,
        icon: <span>{idx + 1}</span>,
      } as unknown as StepProps;
    });
  }, [dataSource]);

  return (
    <div className={classNames('model-steps', className)}>
      <TzSteps
        current={currentRef.current ?? dataSource?.length}
        labelPlacement="vertical"
        items={items1}
      />
    </div>
  );
}

export default ModelSteps;
