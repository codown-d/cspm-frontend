import TzDrawer from '@/components/lib/TzDrawer';
import { useIntl, useModel } from '@umijs/max';
import { FloatButton } from 'antd';
import { memo } from 'react';
import TaskList from './TaskList';
import './index.less';

function TaskSocketList() {
  const intl = useIntl();
  // const [state, { toggle, setFalse }] = useBoolean();
  const { taskSocketOpenState, taskSocketAction } = useModel('global');

  return (
    <>
      <div className="global-task">
        <TzDrawer
          width={400}
          style={{ maxHeight: 600 }}
          title={intl.formatMessage({ id: 'verificationProgress' })}
          open={taskSocketOpenState}
          rootClassName="global-task-drawer"
          onClose={taskSocketAction?.setFalse}
          closeIcon={
            <i className="!font-normal inline-block icon iconfont icon-arrow-double text-xl -rotate-90" />
          }
        >
          <TaskList />
        </TzDrawer>
        <FloatButton
          onClick={taskSocketAction?.toggle}
          icon={
            <i className="inline-block icon iconfont icon-arrow-double text-xl rotate-90" />
          }
          type="primary"
          className="global-task-btn top-0 right-0"
        />
      </div>
    </>
  );
}

export default memo(TaskSocketList);
