import TzDrawer from '@/components/lib/TzDrawer';
import { useIntl } from '@umijs/max';
import { useBoolean } from 'ahooks';
import { FloatButton } from 'antd';
import { memo, useRef } from 'react';
import TaskList from './TaskList';
import './index.less';

enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}
function Index() {
  const draggableTimeRef = useRef<number>();
  const intl = useIntl();
  const [state, { toggle, setTrue, setFalse }] = useBoolean();

  return (
    <>
      <div className="global-task">
        <TzDrawer
          title={intl.formatMessage({ id: '验证进度' })}
          open={state}
          className="global-task-drawer"
          onClose={setFalse}
          closeIcon={
            <i className="!font-normal inline-block icon iconfont icon-arrow-double text-xl -rotate-90" />
          }
        >
          <TaskList />
        </TzDrawer>
        <FloatButton
          onClick={toggle}
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

export default memo(Index);
