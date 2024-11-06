import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import CusSelectWithAll from '../components/CusSelectWithAll';
import ComplianceStatistics from './List/ComplianceStatistics';
import PlatformRisks from './List/PlatformRisks';
import ScanModal from './ScanModal';
import useCompliance from './useCompliance';

const Compliance = () => {
  const intl = useIntl();
  const {
    credentials,
    effectivePlatform,
    complianceId,
    setComplianceId,
    complianceOverview,
    credentialIds,
    setCredentialIds,
    overviewLoading,
  } = useCompliance();

  return (
    <TzPageContainer
      header={{
        title: (
          <div className="flex">
            {intl.formatMessage({ id: 'complianceSafety' })}
            <div
              className={classNames(
                'ml-3 text-[#3E4653] text-sm font-normal inline-flex items-center',
              )}
            >
              <span>{intl.formatMessage({ id: 'cloudAccountLabel' })}：</span>
              <CusSelectWithAll
                placeholder={intl.formatMessage(
                  { id: 'selectTips' },
                  { name: '' },
                )}
                allowAllClear
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
        ),
      }}
      extra={[
        <TzButton
          key="new"
          onClick={() => {
            history.push('/compliance/framework');
          }}
        >
          {intl.formatMessage({ id: 'complianceFramework' })}
        </TzButton>,

        <ScanModal
          frameworkOpt={complianceOverview}
          cascaderMap={{
            platforms: effectivePlatform,
            credential_ids: credentials,
          }}
        />,
        <TzButton
          key="setting"
          onClick={() => history.push('/compliance/setting')}
        >
          {intl.formatMessage({ id: 'setting' })}
        </TzButton>,
      ]}
    >
      <ComplianceStatistics
        loading={overviewLoading}
        complianceOverview={complianceOverview}
        complianceId={complianceId}
        setComplianceId={setComplianceId}
      />

      <PlatformRisks
        // key={complianceId}
        credentialIds={credentialIds}
        complianceId={complianceId}
      />
    </TzPageContainer>
  );
};
export default Compliance;
