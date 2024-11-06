import NoData from '@/components/NoData';
import { useIntl } from '@umijs/max';
import { Skeleton } from 'antd';
import { Dispatch, Key, SetStateAction, memo } from 'react';
import ComplianceStatisticsBar from './ComplianceStatisticsBar';

type IComplianceStatistics = {
  complianceOverview?: API_COMPLIANCE.ComplianceOverviewItem[];
  complianceId?: Key;
  loading?: boolean;
  noTitle?: boolean;
  setComplianceId?: Dispatch<SetStateAction<Key | undefined>>;
};
function ComplianceStatistics({
  complianceOverview,
  complianceId,
  setComplianceId,
  loading,
  noTitle,
}: IComplianceStatistics) {
  const intl = useIntl();
  return (
    <div>
      {!noTitle && (
        <div className="head-tit-1 mb-2">
          {intl.formatMessage({ id: 'complianceOverview' })}
        </div>
      )}

      {loading ? (
        <Skeleton className="mt-2" />
      ) : complianceOverview?.length ? (
        <ComplianceStatisticsBar
          value={complianceId}
          onChange={setComplianceId}
          data={complianceOverview}
        />
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default memo(ComplianceStatistics);
