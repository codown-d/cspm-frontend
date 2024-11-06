import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { CLOUD_HOST_ASSET_INFO } from '@/utils/constants';
import { useIntl } from '@umijs/max';
import { BreadcrumbProps, Divider } from 'antd';
import { get, keys } from 'lodash';
import DBS from './DBS';

type CloudHostProps = {
  infos: API_ASSETS.AssetsInfoResponseInfos;
  infoBreadcrumb?: BreadcrumbProps['items'];
};
function CloudHost(props: CloudHostProps) {
  const { infos, infoBreadcrumb } = props;
  const intl = useIntl();

  return (
    <>
      <div className="mx-4">
        <Divider className="my-0 border-[#F4F6FA]" />
      </div>
      <div className="card-tit my-3 px-4">
        {intl.formatMessage({ id: 'detailedInfo' })}
      </div>
      <TzProDescriptions column={1}>
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
            {get(infos, ['basic_info', key]) || '-'}
          </TzProDescriptions.Item>
        ))}
      </TzProDescriptions>
      <DBS dataSource={get(infos, 'disks')} />
    </>
  );
}

export default CloudHost;
