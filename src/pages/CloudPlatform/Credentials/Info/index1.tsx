import NoData from '@/components/NoData';
import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import TzAnchor from '@/components/lib/TzAnchor';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import translate from '@/locales/translate';
import AssetsList from '@/pages/Asset/OldList';
import RiskList from '@/pages/Risks/List';
import GrowthStatics from '@/pages/components/Statistics/GrowthStatics';
import {
  getAssetsCompare,
  getCredentialById,
  getRisksCompare,
} from '@/services/cspm/CloudPlatform';
import { DEFAULT_PWD } from '@/utils';
import {
  history,
  useIntl,
  useLocation,
  useModel,
  useParams,
  useRouteProps,
} from '@umijs/max';
import classNames from 'classnames';
import { isNil } from 'lodash';
import { memo, useEffect, useMemo, useState } from 'react';
import CExportModal from '../CExportModal';
import useClodPlatformEvent from '../useClodPlatformEvent';
import styles from './inde.less';

function Detail() {
  const intl = useIntl();
  const { key: pathKey } = useLocation();

  const AnchorIds = useMemo(
    () => ({
      assetProfile: `assetProfile${pathKey}`,
      riskProfile: `riskProfile${pathKey}`,
      info: `info${pathKey}`,
      assets: `assets${pathKey}`,
      risk: `risk${pathKey}`,
    }),
    [pathKey],
  );
  const items = useMemo(
    () => [
      {
        href: `#${AnchorIds.assetProfile}`,
        key: AnchorIds.assetProfile,
        title: translate('assetProfile'),
      },
      {
        href: `#${AnchorIds.riskProfile}`,
        key: AnchorIds.riskProfile,
        title: translate('riskProfile'),
      },
      {
        href: `#${AnchorIds.info}`,
        key: AnchorIds.info,
        title: translate('basicInfo'),
      },
      {
        href: `#${AnchorIds.assets}`,
        key: AnchorIds.assets,
        title: translate('assetList'),
      },
      {
        href: `#${AnchorIds.risk}`,
        key: AnchorIds.risk,
        title: translate('riskList'),
      },
    ],
    [AnchorIds],
  );
  const { breadcrumb } = useRouteProps();
  const { id = 0 } = useParams();
  const { handleOprClick } = useClodPlatformEvent();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<API.CredentialResponse | undefined>();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  const [access, secret, extra] = useMemo(
    () =>
      commonPlatforms?.find((v) => v.key === info?.platform)
        ?.secret_key_names ?? ['-', '-'],
    [commonPlatforms, info],
  );

  useEffect(() => {
    setLoading(true);
    id &&
      getCredentialById(id)
        .then(setInfo)
        .finally(() => setLoading(false));
  }, [id]);

  const riskListDefaultParams = useMemo(
    () => ({
      credential_id: +id,
      risks_static: info?.risks_static,
      platform: info?.platform,
    }),
    [info],
  );

  const assetsListDefaultParams = useMemo(
    () => ({ credential_id: +id, platform: info?.platform }),
    [info],
  );
  const defaultParams = useMemo(() => ({ credential_id: +id }), [id]);

  return (
    <TzPageContainer
      className={classNames('info-card-box', styles.platformInfo)}
      header={{
        title: <PageTitle title={info?.name ?? '-'} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={[
        <CExportModal
          key="export"
          id={id || ''}
          name={info?.name}
          renderTrigger={
            <TzButton disabled={!info}>
              {intl.formatMessage({ id: 'exportReport' })}
            </TzButton>
          }
        />,
        <TzButton
          disabled={!info}
          key="edit"
          onClick={(e) => id && handleOprClick(e, 'edit', id)}
        >
          {intl.formatMessage({ id: 'edit' })}
        </TzButton>,
        <TzButton
          disabled={!info}
          key="delete"
          onClick={(e) =>
            info &&
            id &&
            handleOprClick(e, 'delete', { id, ...info }, () =>
              history.push('/sys/cloud-platform'),
            )
          }
          danger
        >
          {intl.formatMessage({ id: 'delete' })}
        </TzButton>,
      ]}
    >
      <div className="flex">
        <div className="flex-1">
          <TzCard
            bodyStyle={{ padding: '12px 16px 4px 16px' }}
            id={AnchorIds.assetProfile}
            className={styles.statisticsCard}
          >
            <GrowthStatics
              title={intl.formatMessage({ id: 'assetProfile' })}
              defaultParams={defaultParams}
              fetchUrl={getAssetsCompare}
              scrollAnchorStyle={{ top: -280 }}
            />
          </TzCard>
          <TzCard
            bodyStyle={{ padding: '12px 16px 4px 16px' }}
            id={AnchorIds.riskProfile}
            className={styles.statisticsCard}
          >
            <GrowthStatics
              showRiskType
              defaultParams={defaultParams}
              fetchUrl={getRisksCompare}
            />
          </TzCard>
          <TzCard
            bodyStyle={
              loading ? { padding: '4px 16px 16px 16px' } : { paddingTop: 4 }
            }
            id={AnchorIds.info}
            className="is-descriptions"
            title={intl.formatMessage({ id: 'basicInfo' })}
          >
            <TzProDescriptions
              loading={loading}
              dataSource={{
                ...info,
                secret: DEFAULT_PWD,
              }}
              columns={[
                {
                  title: access,
                  key: 'access',
                  dataIndex: 'access',
                },
                {
                  title: secret,
                  key: 'secret',
                  dataIndex: 'secret',
                },
                {
                  title: extra,
                  key: 'extra',
                  dataIndex: 'extra',
                },
                // {
                //   title: intl.formatMessage({ id: 'lastUpdatedTime' }),
                //   key: 'update_time',
                //   dataIndex: 'update_time',
                //   valueType: 'dateTime',
                // },
              ].filter((item) => item.key !== 'extra' || !isNil(extra))}
            />
          </TzCard>
          <TzCard
            bodyStyle={{ padding: '12px 16px 4px 16px' }}
            id={AnchorIds.assets}
            className={styles.statisticsCard}
          >
            {!!info ? (
              <AssetsList
                tableAnchorStyle={{ top: -102 }}
                defaultParams={assetsListDefaultParams}
              />
            ) : (
              <NoData />
            )}
          </TzCard>
          <TzCard
            bodyStyle={{ padding: '12px 16px 4px 16px' }}
            id={AnchorIds.risk}
            className={styles.statisticsCard}
          >
            {!!info ? (
              <RiskList
                tableAnchorStyle={{ top: -102 }}
                affix={false}
                defaultParams={riskListDefaultParams}
              />
            ) : (
              <NoData />
            )}
          </TzCard>
        </div>
        <TzAnchor items={items} />
      </div>
    </TzPageContainer>
  );
}

export default memo(Detail);
