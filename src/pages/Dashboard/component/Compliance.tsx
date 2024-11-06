import TzSelect from '@/components/lib/tzSelect';
import NoData from '@/components/NoData';
import useCompliance from '@/hooks/useCompliance';
import LoadingCover from '@/loadingCover';
import ComplianceStatisticsBar from '@/pages/Compliance/List/ComplianceStatistics/ComplianceStatisticsBar';
import { getComplianceStatistics } from '@/services/cspm/Statistics';
import { history, useIntl } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { get, toNumber } from 'lodash';
import { useState } from 'react';
function Compliance() {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [complianceId, setComplianceId] = useState<string>();
  const [complianceOverview, setComplianceOverview] =
    useState<API_COMPLIANCE.ComplianceOverviewItem[]>();

  const options = useCompliance({ status: 1 });
  useUpdateEffect(() => {
    setComplianceId(get(options, '0.value'));
  }, [options]);

  useUpdateEffect(() => {
    setLoading(true);
    complianceId &&
      getComplianceStatistics(complianceId)
        .then((res) => {
          setComplianceOverview(res);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [complianceId]);
  const len = complianceOverview?.length ?? 0;
  return (
    <div className="mt-6">
      <span className="head-tit-1">
        {intl.formatMessage({ id: 'complianceOverview' })}
      </span>
      <span className="ml-2">
        {intl.formatMessage({ id: 'complianceFramework' })}：
      </span>
      <TzSelect
        showSearch={false}
        placeholder={intl.formatMessage({ id: 'selectTips' }, { name: '' })}
        onChange={setComplianceId}
        value={complianceId}
        options={options}
        bordered={false}
        className="min-w-[20px] -ml-[10px]"
        popupMatchSelectWidth={200}
      />
      <div className="relative max-h-[184px] bg-[rgba(33,119,209,0.02)] mt-1">
        <LoadingCover loading={loading} />
        {complianceOverview?.length ? (
          <ComplianceStatisticsBar
            className={classNames('px-[16px] py-[16px] pt-[12px]', {
              'gap-x-10': len > 5,
            })}
            showTip
            key={complianceId}
            data={complianceOverview}
            onRow={(key) =>
              history.push(`/compliance/list`, {
                credentialIds: [toNumber(key)],
                complianceId,
              })
            }
          />
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}

export default Compliance;
