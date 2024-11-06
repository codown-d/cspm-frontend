import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzCard } from '@/components/lib/tz-card';
import { CLOUD_HOST_ASSET_INFO } from '@/utils/constants';
import { useIntl } from '@umijs/max';
import { get, keys } from 'lodash';
import DBS from './DBS';

type AssetInfoProps = {
  infos: API_ASSETS.AssetsInfoResponseInfos;
  loading?: boolean;
  isHistory?: boolean;
};
function AssetInfo({
  isHistory,
  infos: { basic_info, disks },
  ...restProps
}: AssetInfoProps) {
  const intl = useIntl();

  return (
    <TzCard
      bodyStyle={
        restProps.loading
          ? { padding: '4px 16px 16px 16px' }
          : { paddingBlock: '4px 0' }
      }
      className="is-descriptions"
      title={intl.formatMessage({ id: 'detailedInfo' })}
    >
      <TzProDescriptions {...restProps}>
        {keys(CLOUD_HOST_ASSET_INFO).map((key) => (
          <TzProDescriptions.Item
            key={key}
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label={get(CLOUD_HOST_ASSET_INFO, key)}
          >
            {get(basic_info, key) || '-'}
          </TzProDescriptions.Item>
        ))}
      </TzProDescriptions>
      <DBS dataSource={disks} />
    </TzCard>
  );
}

export default AssetInfo;
