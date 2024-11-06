import { TzCard } from '@/components/lib/tz-card';
import { useIntl, useLocation } from '@umijs/max';
import classNames from 'classnames';
import CloudHost from './CloudHost';
import InfoContext from './InfoContext';

type AssetInfoProps = {
  dataSource?: API_ASSETS.AssetsInfoResponse;
  loading?: boolean;
  className?: string;
};
function AssetInfo(props: AssetInfoProps) {
  const { className, dataSource, loading } = props;
  const intl = useIntl();
  const { state } = useLocation();
  const { task_id } = state ?? {};

  const { service, infos, region_name, platform_name, agentless_scannable } =
    dataSource ?? {};

  const isCloudHost = service === 'Cloud Host';

  return (
    <TzCard
      bodyStyle={
        loading ? { padding: '4px 16px 16px 16px' } : { paddingBlock: '4px 0' }
      }
      className={classNames('is-descriptions', className)}
      title={intl.formatMessage({ id: 'basicInfo' })}
    >
      <InfoContext
        loading={loading}
        dataSource={dataSource}
        column={1}
        task_id={task_id}
      />
      {isCloudHost && (
        <CloudHost
          // infoBreadcrumb={
          //   infoBreadcrumb
          //     ? [
          //         ...curBreadcrumb,
          //         {
          //           title: 'riskInfo',
          //         },
          //       ]
          //     : undefined
          // }
          infos={infos}
          // defaultParams={{ task_id, hash_id: id }}
        />
      )}
    </TzCard>
  );
}

export default AssetInfo;
