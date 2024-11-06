import { TzCard } from '@/components/lib/tz-card';
import NoData from '@/components/NoData';
import ComplianceStatistics from '@/pages/Compliance/List/ComplianceStatistics';
import PlatformRisks from '@/pages/Compliance/List/PlatformRisks';
import CusSelectWithAll from '@/pages/components/CusSelectWithAll';
import { getComplianceTaskOverview } from '@/services/cspm/Task';
import { useIntl, useParams } from '@umijs/max';
import { Skeleton } from 'antd';
import classNames from 'classnames';
import { get } from 'lodash';
import { Key, useEffect, useState } from 'react';

type IProps = {
  id: string;
  basic?: API_TASK.TaskDetailBasic;
};
function OverView({ id: anchorId, basic }: IProps) {
  const intl = useIntl();
  const { id } = useParams();
  const { credentials } = basic ?? {};
  const [complianceId, setComplianceId] = useState<Key>();
  const [loading, setLoading] = useState<boolean>();
  const [credentialIds, setCredentialIds] = useState<number[]>(() => {
    return credentials?.map((v) => v.value);
  });
  const [complianceOverview, setComplianceOverview] =
    useState<API_COMPLIANCE.ComplianceOverviewItem[]>();

  useEffect(() => {
    if (!credentials?.length) {
      return;
    }
    setLoading(true);
    getComplianceTaskOverview(id, { credential_ids: credentialIds })
      .then((res) => {
        setComplianceOverview(res);
        setComplianceId(get(res, [0, 'key']));
      })
      .finally(() => setLoading(false));
  }, [credentialIds]);

  return (
    <TzCard
      id={anchorId}
      bodyStyle={{ padding: '0 16px 12px 16px' }}
      title={
        <div className="flex items-center -mt-1">
          {intl.formatMessage({ id: 'complianceRes' })}
          <div
            className={classNames(
              'ml-3 text-[#3E4653] text-sm font-normal inline-flex items-center',
            )}
          >
            <span className="text-xs">
              {intl.formatMessage({ id: 'cloudAccountLabel' })}：
            </span>
            <CusSelectWithAll
              size="small"
              placeholder={intl.formatMessage(
                { id: 'selectTips' },
                { name: '' },
              )}
              onChange={setCredentialIds}
              value={credentialIds}
              allLabel={intl.formatMessage({ id: 'fullAccount' })}
              options={credentials}
              bordered={false}
              className="min-w-[100px] -ml-[10px]"
              popupMatchSelectWidth={200}
            />
          </div>
        </div>
      }
    >
      {loading ? (
        <Skeleton className="mt-2" />
      ) : complianceOverview?.length ? (
        <>
          <ComplianceStatistics
            noTitle
            loading={loading}
            complianceOverview={complianceOverview}
            complianceId={complianceId}
            setComplianceId={setComplianceId}
          />

          {!!complianceId && (
            <PlatformRisks
              from="task"
              taskId={id}
              // key={complianceId}
              credentialIds={credentialIds}
              complianceId={complianceId}
            />
          )}
        </>
      ) : (
        <NoData />
      )}
    </TzCard>
  );
}

export default OverView;
