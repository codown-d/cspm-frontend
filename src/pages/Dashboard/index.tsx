import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TopRisk from '@/pages/components/Chart/TopRisk';
import { useAccess, useIntl } from '@umijs/max';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import { get } from 'lodash';
import { useMemo } from 'react';
import AssetsProfile from './component/AssetsProfile';
import Compliance from './component/Compliance';
import Credential from './component/Credential';
import MyTask from './component/MyTask';
import RiskLine from './component/RiskLine';
import RiskProfile from './component/RiskProfile';
import Sensitive from './component/Sensitive';
import Todo from './component/Todo';
import Vuln from './component/Vuln';
import styles from './index.less';

function Dashboard() {
  const intl = useIntl();
  const { width = 0 } = useSize(document.body) ?? {};

  const accessFull = useAccess();
  const hasFragilenessAccess = useMemo(
    () => get(accessFull, PermisionMap.vulnerabilityAnalysis),
    [accessFull],
  );
  const listProps = useMemo(
    () => ({
      chartClassName: classNames('!gap-1', {
        'grid grid-cols-2': width > 1920,
      }),
      hiddenNoData: true,
    }),
    [],
  );
  return (
    <TzPageContainer
      header={{
        title: intl.formatMessage({ id: 'dashboard' }),
      }}
      className={styles.dashboard}
    >
      <div className="flex gap-[30px]">
        <div className="flex-1 w-0">
          <Credential styles={styles} />
          <RiskProfile />
          <AssetsProfile />
          <Compliance />
          <RiskLine />
        </div>
        <div className="w-[30%] max-w-[560px] min-w-[340px] flex gap-6 flex-col">
          <Vuln {...listProps} />
          <Sensitive {...listProps} />
          <TopRisk
            className={classNames('overflow-hidden risk-top', styles.topRisk)}
            isAllPlatforms
            title={intl.formatMessage({ id: 'topRisk' })}
          />
          <MyTask />
          {hasFragilenessAccess && <Todo />}
        </div>
      </div>
    </TzPageContainer>
  );
}

export default Dashboard;
