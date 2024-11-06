import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzCol, TzRow } from '@/components/lib/tz-row-col';
import {
  getAssetsCompare,
  getRisksCompare,
} from '@/services/cspm/CloudPlatform';
import { useAccess, useIntl } from '@umijs/max';
import { get } from 'lodash';
import { useMemo } from 'react';
import GrowthStatics from '../components/Statistics/GrowthStatics';
import Cloud from './Cloud';
import MyTask from './MyTask';
import Todo from './Todo';
import RiskLine from './components/RiskLine';
import TopRisk from './components/TopRisk';
import TopRiskPlatform from './components/TopRiskPlatform';
import styles from './index.less';

const Dashboard = () => {
  const intl = useIntl();

  const accessFull = useAccess();
  const hasFragilenessAccess = useMemo(
    () => get(accessFull, PermisionMap.vulnerabilityAnalysis),
    [accessFull],
  );

  return (
    <TzPageContainer
      header={{
        title: intl.formatMessage({ id: 'dashboard' }),
      }}
      className={styles.dashboard}
    >
      <div className="mt-[2px]">
        <TzRow gutter={48}>
          <TzCol span={12}>
            <MyTask />
          </TzCol>
          <TzCol span={12}>{hasFragilenessAccess && <Todo />}</TzCol>
        </TzRow>
        <TzRow className="mb-8">
          <TzCol span={24}>
            <Cloud />
          </TzCol>
        </TzRow>
        <TzRow className="mb-8">
          <TzCol span={24}>
            <GrowthStatics
              title={intl.formatMessage({ id: 'assetProfile' })}
              fetchUrl={getAssetsCompare}
            />
          </TzCol>
        </TzRow>
        <TzRow className="mb-8">
          <TzCol span={24}>
            <GrowthStatics showRiskType fetchUrl={getRisksCompare} />
          </TzCol>
        </TzRow>
        <TzRow gutter={48} style={{ minHeight: 280 }}>
          <TzCol span={12}>
            <TopRisk />
          </TzCol>
          <TzCol span={12}>
            <TopRiskPlatform />
          </TzCol>
        </TzRow>
        <TzRow className="mt-8" style={{ minHeight: 320 }}>
          <TzCol span={24}>
            <RiskLine />
          </TzCol>
        </TzRow>
      </div>
    </TzPageContainer>
  );
};
export default Dashboard;
